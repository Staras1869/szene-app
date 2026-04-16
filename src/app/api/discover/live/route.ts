import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const revalidate = 1800 // 30 min cache

const CITY_LABEL: Record<string, string> = {
  mannheim:     "Mannheim",
  heidelberg:   "Heidelberg",
  frankfurt:    "Frankfurt",
  ludwigshafen: "Ludwigshafen",
  karlsruhe:    "Karlsruhe",
}

// ── Serper — multiple targeted queries per city+vibe ─────────────────────────

const VIBE_QUERIES: Record<string, string[]> = {
  party:   ["club party rave Nacht", "Clubnacht Techno House", "Party Event"],
  music:   ["Konzert live musik festival", "concert live music", "Musikfestival"],
  culture: ["Ausstellung Theater Kunst festival", "exhibition theatre art festival"],
  food:    ["Street Food Markt pop-up", "Foodfestival Markt outdoor"],
  student: ["Studentenparty Uni Party", "Hochschulparty campus event", "AStA party"],
  outside: ["Open Air Festival Sommer", "Outdoor festival Freibad", "Stadtfest"],
  chill:   ["Bar Lounge Weinbar Abend", "entspannter Abend bar"],
  all:     ["Event Party Konzert Festival Veranstaltung", "Clubnacht Konzert Festival"],
}

// Sites that reliably have German event listings
const SITE_SEARCHES: Record<string, string[]> = {
  party:   ["site:ra.co", "site:facebook.com/events", "site:eventim.de"],
  music:   ["site:eventim.de", "site:ticketmaster.de", "site:facebook.com/events"],
  culture: ["site:eventbrite.de", "site:facebook.com/events"],
  food:    ["site:eventbrite.de", "site:facebook.com/events"],
  student: ["site:facebook.com/events", "site:eventbrite.de"],
  outside: ["site:eventim.de", "site:facebook.com/events"],
  chill:   ["site:facebook.com/events", "site:eventbrite.de"],
  all:     ["site:ra.co", "site:eventim.de", "site:eventbrite.de"],
}

async function serperSearch(query: string, key: string): Promise<any[]> {
  try {
    // Try /events endpoint first (structured)
    const evRes = await fetch("https://google.serper.dev/events", {
      method: "POST",
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "de", hl: "de", num: 10 }),
    })
    if (evRes.ok) {
      const d = await evRes.json()
      if ((d.events ?? []).length > 0) return d.events
    }

    // Fallback to /search (organic results)
    const srRes = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "de", hl: "de", num: 10 }),
    })
    if (!srRes.ok) return []
    const d = await srRes.json()
    // Parse organic results as events
    return (d.organic ?? []).map((r: any) => ({
      title: r.title,
      date:  r.date ?? "",
      venue: r.sitelinks?.[0]?.title ?? "",
      link:  r.link,
    }))
  } catch {
    return []
  }
}

async function fetchSerper(city: string, vibe: string): Promise<any[]> {
  const key = process.env.SERPER_API_KEY
  if (!key) return []

  const label   = CITY_LABEL[city] ?? city
  const queries = VIBE_QUERIES[vibe] ?? VIBE_QUERIES.all
  const sites   = SITE_SEARCHES[vibe] ?? SITE_SEARCHES.all

  // Run: (vibe queries × city) + (site-specific searches)
  const searches = [
    // General vibe queries
    ...queries.map(q => `${q} ${label} 2025`),
    // Site-specific for more reliable sources
    ...sites.slice(0, 2).map(s => `${s} ${label} ${queries[0]?.split(" ")[0] ?? "event"} 2025`),
  ]

  const results = await Promise.allSettled(
    searches.slice(0, 4).map(q => serperSearch(q, key)) // max 4 searches
  )

  const all: any[] = []
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value)
  }

  return all.map((e: any, i: number) => ({
    id:       `sr-${city}-${vibe}-${i}`,
    source:   "web",
    title:    e.title ?? "Event",
    venue:    e.venue ?? label,
    area:     label,
    date:     e.date ?? "",
    time:     e.time ?? "",
    url:      e.link ?? e.url ?? "",
    image:    e.thumbnail ?? "",
    price:    null,
    category: vibe === "music" ? "Music" : vibe === "party" ? "Nightlife" : vibe === "food" ? "Food" : vibe === "culture" ? "Culture" : vibe === "student" ? "Student" : "Event",
    city,
  }))
}

// ── Resident Advisor — best for club/electronic events in Germany ─────────────

async function fetchRA(city: string, vibe: string): Promise<any[]> {
  if (!["party", "music", "all"].includes(vibe)) return []

  const RA_AREAS: Record<string, string> = {
    mannheim:  "mannheim",
    heidelberg: "heidelberg",
    frankfurt:  "frankfurt",
    karlsruhe:  "karlsruhe",
  }
  const area = RA_AREAS[city]
  if (!area) return []

  try {
    // RA has a GraphQL API used by their website
    const today = new Date().toISOString().split("T")[0]
    const end   = new Date(Date.now() + 30 * 24 * 3600_000).toISOString().split("T")[0]

    const res = await fetch("https://ra.co/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; Szene/1.0)",
        "Referer": "https://ra.co",
      },
      body: JSON.stringify({
        operationName: "GET_EVENT_LISTINGS",
        variables: {
          filters: {
            areas: { slug: area },
            startDate: today,
            endDate: end,
          },
          pageSize: 20,
          page: 1,
        },
        query: `query GET_EVENT_LISTINGS($filters: FilterInputDtoInput, $pageSize: Int, $page: Int) {
          eventListings(filters: $filters, pageSize: $pageSize, page: $page) {
            data {
              id
              event {
                id
                title
                date
                startTime
                contentUrl
                venue { name }
                images { filename }
              }
            }
          }
        }`,
      }),
      next: { revalidate: 1800 },
    })

    if (!res.ok) return []
    const data = await res.json()
    const listings = data?.data?.eventListings?.data ?? []

    return listings.map((l: any) => {
      const ev = l.event
      return {
        id:       `ra-${ev.id}`,
        source:   "ra",
        title:    ev.title,
        venue:    ev.venue?.name ?? city,
        area:     city,
        date:     ev.date?.split("T")[0] ?? "",
        time:     ev.startTime ?? "",
        url:      ev.contentUrl ? `https://ra.co${ev.contentUrl}` : "",
        image:    ev.images?.[0]?.filename ? `https://ra.co${ev.images[0].filename}` : "",
        price:    null,
        category: "Nightlife",
        city,
      }
    })
  } catch {
    return []
  }
}

// ── Ticketmaster (when key available) ────────────────────────────────────────

async function fetchTicketmaster(city: string, vibe: string): Promise<any[]> {
  const key = process.env.TICKETMASTER_API_KEY
  if (!key) return []

  const params = new URLSearchParams({
    apikey:      key,
    city:        CITY_LABEL[city] ?? city,
    countryCode: "DE",
    size:        "20",
    sort:        "date,asc",
    classificationName: vibe === "music" ? "music" : vibe === "culture" ? "arts" : "music,arts",
  })

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data._embedded?.events ?? []).map((e: any) => ({
      id:       `tm-${e.id}`,
      source:   "ticketmaster",
      title:    e.name,
      venue:    e._embedded?.venues?.[0]?.name ?? city,
      area:     e._embedded?.venues?.[0]?.city?.name ?? city,
      date:     e.dates?.start?.localDate ?? "",
      time:     e.dates?.start?.localTime?.slice(0, 5) ?? "",
      url:      e.url ?? "",
      image:    e.images?.[0]?.url ?? "",
      price:    e.priceRanges ? `€${Math.round(e.priceRanges[0].min)}` : null,
      category: e.classifications?.[0]?.genre?.name ?? "Event",
      city,
    }))
  } catch { return [] }
}

// ── Eventbrite (when key available) ──────────────────────────────────────────

async function fetchEventbrite(city: string, vibe: string): Promise<any[]> {
  const key = process.env.EVENTBRITE_API_KEY
  if (!key) return []

  const catMap: Record<string, string> = { music: "103", culture: "105", food: "110", party: "103" }
  const params = new URLSearchParams({
    "location.address": `${CITY_LABEL[city]}, Germany`,
    "location.within":  "25km",
    expand:             "venue",
    sort_by:            "date",
    "start_date.range_start": new Date().toISOString(),
    "start_date.range_end":   new Date(Date.now() + 30 * 24 * 3600_000).toISOString(),
    ...(catMap[vibe] ? { categories: catMap[vibe] } : {}),
  })

  try {
    const res = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.events ?? []).map((e: any) => ({
      id:       `eb-${e.id}`,
      source:   "eventbrite",
      title:    e.name?.text ?? "Event",
      venue:    e.venue?.name ?? city,
      area:     e.venue?.address?.city ?? city,
      date:     e.start?.local?.split("T")[0] ?? "",
      time:     e.start?.local?.split("T")[1]?.slice(0, 5) ?? "",
      url:      e.url ?? "",
      image:    e.logo?.url ?? "",
      price:    e.is_free ? "Free" : null,
      category: catMap[vibe] === "110" ? "Food" : catMap[vibe] === "105" ? "Culture" : "Event",
      city,
    }))
  } catch { return [] }
}

// ── Main ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "mannheim"
  const vibe = req.nextUrl.searchParams.get("vibe") ?? "all"

  const [tm, eb, ra, sr] = await Promise.allSettled([
    fetchTicketmaster(city, vibe),
    fetchEventbrite(city, vibe),
    fetchRA(city, vibe),
    fetchSerper(city, vibe),
  ])

  const results = [
    ...(ra.status === "fulfilled" ? ra.value : []),   // RA first — most reliable for clubs
    ...(tm.status === "fulfilled" ? tm.value : []),
    ...(eb.status === "fulfilled" ? eb.value : []),
    ...(sr.status === "fulfilled" ? sr.value : []),
  ]

  // Deduplicate by normalised title
  const seen = new Set<string>()
  const deduped = results.filter(e => {
    if (!e.title) return false
    const key = e.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  deduped.sort((a, b) => (a.date || "9") > (b.date || "9") ? 1 : -1)

  return NextResponse.json({
    events: deduped,
    total:  deduped.length,
    sources: {
      ra:           ra.status  === "fulfilled" ? ra.value.length  : 0,
      ticketmaster: tm.status  === "fulfilled" ? tm.value.length  : 0,
      eventbrite:   eb.status  === "fulfilled" ? eb.value.length  : 0,
      web:          sr.status  === "fulfilled" ? sr.value.length  : 0,
    },
  })
}
