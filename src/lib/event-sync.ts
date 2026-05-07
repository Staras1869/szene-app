/**
 * Event Sync Engine
 *
 * Sources:
 *   1. Facebook Events API        — structured event data per venue page
 *   2. Instagram Business Discovery — caption-parsed event posts per venue
 *   3. Resident Advisor (RA)      — club/electronic events, all 8 cities
 *   4. Ticketmaster               — concerts + ticketed events, all 8 cities
 *
 * Required env vars:
 *   META_ACCESS_TOKEN      — Long-lived Page Access Token
 *   META_IG_BUSINESS_ID    — Szene IG Business Account ID
 *   TICKETMASTER_API_KEY   — Ticketmaster Discovery API key
 *
 * Run via POST /api/events/sync (secured with CRON_SECRET).
 */

import { prisma } from "@/lib/prisma"
import { getBusinessProfile } from "@/lib/instagram-graph"
import { MANNHEIM_HEIDELBERG_VENUES, type Venue } from "@/lib/venues-database"

const BASE = "https://graph.facebook.com/v21.0"

function token() {
  return process.env.META_ACCESS_TOKEN ?? ""
}

// ─── Facebook Events ──────────────────────────────────────────────────────────

interface FBEvent {
  id: string
  name: string
  description?: string
  start_time: string
  end_time?: string
  cover?: { source: string }
  ticket_uri?: string
  place?: { name: string }
}

async function fetchFacebookEvents(venue: Venue): Promise<FBEvent[]> {
  if (!venue.facebook || !token()) return []

  const fields = "id,name,description,start_time,end_time,cover,ticket_uri,place"
  const url = `${BASE}/${encodeURIComponent(venue.facebook)}/events?access_token=${token()}&fields=${fields}&time_filter=upcoming&limit=25`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      if (res.status !== 404) console.error(`[sync] FB events failed for ${venue.facebook}: ${res.status}`)
      return []
    }
    const data = await res.json()
    if (data.error) {
      console.error(`[sync] FB API error for ${venue.name}:`, data.error.message)
      return []
    }
    return data.data ?? []
  } catch (err) {
    console.error(`[sync] FB fetch error for ${venue.name}:`, err)
    return []
  }
}

function parseFBEvent(fb: FBEvent, venue: Venue) {
  const dt = new Date(fb.start_time)
  const date = dt.toISOString().split("T")[0]
  const time = `${String(dt.getHours()).padStart(2, "0")}:${String(dt.getMinutes()).padStart(2, "0")}`

  return {
    title:       fb.name,
    description: fb.description ?? null,
    date,
    time:        time === "00:00" ? null : time,
    venue:       fb.place?.name ?? venue.name,
    city:        venue.city,
    category:    venue.category,
    price:       null,
    imageUrl:    fb.cover?.source ?? null,
    sourceUrl:   fb.ticket_uri ?? `https://www.facebook.com/events/${fb.id}`,
    lat:         null,
    lon:         null,
    status:      "approved",
    source:      "facebook",
    externalId:  `fb_${fb.id}`,
  }
}

// ─── Instagram caption parsing ────────────────────────────────────────────────

// Keywords that suggest a post announces an event
const EVENT_KEYWORDS = [
  /\bdoors?\b/i, /\btickets?\b/i, /\blineup\b/i, /\beinlass\b/i,
  /\beintritt\b/i, /\bveranstaltung\b/i, /\bparty\b/i, /\bnight\b/i,
  /\blive\b/i, /\bconcert\b/i, /\bkonzert\b/i, /\bfestival\b/i,
  /\brelease\b/i, /\bclub night\b/i, /\bsaturday\b/i, /\bfreitag\b/i,
  /\bsamstag\b/i, /\bfreidag\b/i, /\bmorgen\b/i, /\btonight\b/i,
  /\bheute\b/i, /\bthis week\b/i, /\bnext week\b/i,
]

// Date patterns — German + English, returns { date: "YYYY-MM-DD" } or null
function extractDate(caption: string): string | null {
  const now = new Date()
  const year = now.getFullYear()

  // ISO: 2025-05-09 or 09.05.2025 or 09.05.25
  const isoMatch = caption.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const [, y, m, d] = isoMatch
    const date = `${y}-${m}-${d}`
    if (new Date(date) >= now) return date
  }

  const dotMatch = caption.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/)
  if (dotMatch) {
    const [, d, m, y] = dotMatch
    const fullYear = y.length === 2 ? `20${y}` : y
    const date = `${fullYear}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
    if (new Date(date) >= now) return date
  }

  // "9. Mai" / "9th May" / "May 9"
  const MONTHS: Record<string, string> = {
    jan: "01", feb: "02", mär: "03", mar: "03", apr: "04", mai: "05", may: "05",
    jun: "06", jul: "07", aug: "08", sep: "09", okt: "10", oct: "10",
    nov: "11", dez: "12", dec: "12",
  }
  const monthPattern = new RegExp(
    `(\\d{1,2})\\.?\\s*(${Object.keys(MONTHS).join("|")})[a-z]*\\.?\\s*(\\d{4})?`,
    "i"
  )
  const mMatch = caption.match(monthPattern)
  if (mMatch) {
    const [, d, mon, y] = mMatch
    const m = MONTHS[mon.slice(0, 3).toLowerCase()]
    const fullYear = y ?? year.toString()
    const date = `${fullYear}-${m}-${d.padStart(2, "0")}`
    if (new Date(date) >= now) return date
  }

  return null
}

// Time patterns — "22:00", "22 Uhr", "Doors: 22h", "ab 22"
function extractTime(caption: string): string | null {
  const match = caption.match(/\b(\d{1,2})[:\s]?(\d{2})?\s*(?:uhr|h\b)?/i)
  if (!match) return null
  const h = parseInt(match[1], 10)
  const min = match[2] ?? "00"
  if (h < 12 || h > 23) return null
  return `${String(h).padStart(2, "0")}:${min}`
}

// Extract title — first non-emoji, non-hashtag line of caption
function extractTitle(caption: string, venueName: string): string {
  const lines = caption
    .split("\n")
    .map((l) => l.replace(/[\u{1F300}-\u{1FFFF}]/gu, "").replace(/#\S+/g, "").trim())
    .filter((l) => l.length > 4)

  const first = lines[0]
  if (first && first.length <= 80) return first
  return `Event @ ${venueName}`
}

function isEventCaption(caption: string): boolean {
  if (!caption) return false
  return EVENT_KEYWORDS.some((kw) => kw.test(caption))
}

async function syncInstagramEvents(venue: Venue) {
  if (!venue.instagram) return []

  const profile = await getBusinessProfile(venue.instagram, 12)
  if (!profile?.media?.data) return []

  const results: ReturnType<typeof parseIGPost>[] = []
  for (const post of profile.media.data) {
    if (!post.caption || !isEventCaption(post.caption)) continue
    const date = extractDate(post.caption)
    if (!date) continue
    results.push(parseIGPost(post, venue, date))
  }
  return results
}

function parseIGPost(
  post: { id: string; caption?: string; media_url?: string; permalink: string; timestamp: string },
  venue: Venue,
  date: string
) {
  const caption = post.caption ?? ""
  return {
    title:       extractTitle(caption, venue.name),
    description: caption.length > 300 ? caption.slice(0, 300) + "…" : caption,
    date,
    time:        extractTime(caption),
    venue:       venue.name,
    city:        venue.city,
    category:    venue.category,
    price:       null,
    imageUrl:    post.media_url ?? null,
    sourceUrl:   post.permalink,
    lat:         null,
    lon:         null,
    status:      "approved",
    source:      "instagram",
    externalId:  `ig_${post.id}`,
  }
}

// ─── Upsert helper ────────────────────────────────────────────────────────────

type EventRow = {
  title: string; description: string | null; date: string; time: string | null
  venue: string; city: string; category: string; price: string | null
  imageUrl: string | null; sourceUrl: string | null
  lat: number | null; lon: number | null
  status: string; source: string; externalId: string
}

async function upsertEvent(data: EventRow) {
  await prisma.event.upsert({
    where:  { externalId: data.externalId },
    update: {
      title:       data.title,
      description: data.description,
      date:        data.date,
      time:        data.time,
      venue:       data.venue,
      imageUrl:    data.imageUrl,
      sourceUrl:   data.sourceUrl,
      price:       data.price,
    },
    create: data,
  })
}

// ─── Resident Advisor ─────────────────────────────────────────────────────────

const RA_AREAS: Record<string, string> = {
  mannheim: "mannheim", heidelberg: "heidelberg",
  frankfurt: "frankfurt", karlsruhe: "karlsruhe",
  berlin: "berlin", munich: "munich",
  cologne: "cologne", stuttgart: "stuttgart",
}

async function syncRA(city: string): Promise<number> {
  const area = RA_AREAS[city]
  if (!area) return 0

  const today = new Date().toISOString().split("T")[0]
  const end   = new Date(Date.now() + 60 * 24 * 3600_000).toISOString().split("T")[0]

  const res = await fetch("https://ra.co/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0", "Referer": "https://ra.co" },
    body: JSON.stringify({
      operationName: "GET_EVENT_LISTINGS",
      variables: { filters: { areas: { slug: area }, startDate: today, endDate: end }, pageSize: 50, page: 1 },
      query: `query GET_EVENT_LISTINGS($filters: FilterInputDtoInput, $pageSize: Int, $page: Int) {
        eventListings(filters: $filters, pageSize: $pageSize, page: $page) {
          data { id event { id title date startTime contentUrl images { filename } venue { name } } }
        }
      }`,
    }),
    next: { revalidate: 3600 },
  })

  if (!res.ok) return 0
  const data = await res.json()
  const listings = data?.data?.eventListings?.data ?? []

  let count = 0
  for (const l of listings) {
    const e = l.event
    if (!e?.id || !e?.date) continue
    await upsertEvent({
      title:       e.title ?? "RA Event",
      description: null,
      date:        e.date.split("T")[0],
      time:        e.startTime ?? null,
      venue:       e.venue?.name ?? city,
      city:        city.charAt(0).toUpperCase() + city.slice(1),
      category:    "Nightlife",
      price:       null,
      imageUrl:    e.images?.[0]?.filename ? `https://ra.co${e.images[0].filename}` : null,
      sourceUrl:   e.contentUrl ? `https://ra.co${e.contentUrl}` : null,
      lat:         null,
      lon:         null,
      status:      "approved",
      source:      "ra",
      externalId:  `ra_${e.id}`,
    })
    count++
  }
  return count
}

// ─── Ticketmaster ─────────────────────────────────────────────────────────────

const TM_CITIES: Record<string, string> = {
  mannheim: "Mannheim", heidelberg: "Heidelberg", frankfurt: "Frankfurt",
  stuttgart: "Stuttgart", karlsruhe: "Karlsruhe",
  berlin: "Berlin", munich: "Munich", cologne: "Cologne",
}

async function syncTicketmaster(city: string): Promise<number> {
  const key = process.env.TICKETMASTER_API_KEY
  if (!key) return 0

  const label = TM_CITIES[city]
  if (!label) return 0

  const params = new URLSearchParams({
    apikey: key, city: label, countryCode: "DE",
    size: "50", sort: "date,asc",
    classificationName: "music,arts",
  })

  const res = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events.json?${params}`,
    { next: { revalidate: 3600 } }
  )
  if (!res.ok) return 0
  const data = await res.json()
  const events = data._embedded?.events ?? []

  let count = 0
  for (const e of events) {
    if (!e?.id) continue
    const venue = e._embedded?.venues?.[0]
    await upsertEvent({
      title:       e.name,
      description: null,
      date:        e.dates?.start?.localDate ?? "",
      time:        e.dates?.start?.localTime?.slice(0, 5) ?? null,
      venue:       venue?.name ?? label,
      city:        label,
      category:    e.classifications?.[0]?.genre?.name ?? "Music",
      price:       e.priceRanges ? `€${Math.round(e.priceRanges[0].min)}` : null,
      imageUrl:    e.images?.find((i: any) => i.ratio === "16_9")?.url ?? e.images?.[0]?.url ?? null,
      sourceUrl:   e.url ?? null,
      lat:         venue?.location?.latitude  ? parseFloat(venue.location.latitude)  : null,
      lon:         venue?.location?.longitude ? parseFloat(venue.location.longitude) : null,
      status:      "approved",
      source:      "ticketmaster",
      externalId:  `tm_${e.id}`,
    })
    count++
  }
  return count
}

// ─── Main sync ────────────────────────────────────────────────────────────────

const ALL_CITIES = ["mannheim", "heidelberg", "frankfurt", "stuttgart", "karlsruhe", "berlin", "munich", "cologne"]

export interface SyncResult {
  venue:        string
  fb:           number
  ig:           number
  ra:           number
  ticketmaster: number
  errors:       string[]
}

export async function syncVenueEvents(venue: Venue): Promise<SyncResult> {
  const errors: string[] = []
  let fb = 0
  let ig = 0

  // Facebook Events
  try {
    const events = await fetchFacebookEvents(venue)
    for (const e of events) {
      await upsertEvent(parseFBEvent(e, venue) as EventRow)
      fb++
    }
  } catch (err) {
    errors.push(`FB: ${String(err)}`)
  }

  // Instagram posts
  try {
    const posts = await syncInstagramEvents(venue)
    for (const p of posts) {
      await upsertEvent(p as EventRow)
      ig++
    }
  } catch (err) {
    errors.push(`IG: ${String(err)}`)
  }

  return { venue: venue.name, fb, ig, ra: 0, ticketmaster: 0, errors }
}

export async function syncAllVenues(): Promise<SyncResult[]> {
  const results: SyncResult[] = []

  // Meta sources — sequential to respect rate limits
  for (const venue of MANNHEIM_HEIDELBERG_VENUES) {
    results.push(await syncVenueEvents(venue))
  }

  // RA + Ticketmaster — parallel per city, both sources at once
  const cityResults = await Promise.allSettled(
    ALL_CITIES.map(async (city) => {
      const [ra, tm] = await Promise.allSettled([syncRA(city), syncTicketmaster(city)])
      return {
        venue:        city,
        fb:           0,
        ig:           0,
        ra:           ra.status === "fulfilled" ? ra.value : 0,
        ticketmaster: tm.status === "fulfilled" ? tm.value : 0,
        errors:       [
          ...(ra.status === "rejected" ? [`RA: ${ra.reason}`] : []),
          ...(tm.status === "rejected" ? [`TM: ${tm.reason}`] : []),
        ],
      }
    })
  )

  for (const r of cityResults) {
    if (r.status === "fulfilled") results.push(r.value)
  }

  return results
}
