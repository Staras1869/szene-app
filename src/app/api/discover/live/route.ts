import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
export const revalidate = 1800

const CITY_LABEL: Record<string, string> = {
  mannheim:     "Mannheim",
  heidelberg:   "Heidelberg",
  frankfurt:    "Frankfurt",
  ludwigshafen: "Ludwigshafen",
  karlsruhe:    "Karlsruhe",
}

// German days/months for date parsing
const DE_MONTHS: Record<string, string> = {
  januar:"01",februar:"02",märz:"03",april:"04",mai:"05",juni:"06",
  juli:"07",august:"08",september:"09",oktober:"10",november:"11",dezember:"12",
  jan:"01",feb:"02",mär:"03",apr:"04",jun:"06",jul:"07",aug:"08",sep:"09",okt:"10",nov:"11",dez:"12",
}

function parseDate(raw: string): string {
  if (!raw) return ""
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const s = raw.toLowerCase()
  // "15. april 2025" or "15 apr"
  const m = s.match(/(\d{1,2})\.?\s+([a-zä]+)\.?\s*(\d{4})?/)
  if (m) {
    const day   = m[1].padStart(2, "0")
    const month = DE_MONTHS[m[2]] ?? DE_MONTHS[m[2].slice(0,3)] ?? "01"
    const year  = m[3] ?? new Date().getFullYear().toString()
    return `${year}-${month}-${day}`
  }
  return raw
}

// ── Serper core ───────────────────────────────────────────────────────────────

async function serperQuery(q: string, key: string, type: "events"|"search"|"news" = "events"): Promise<any[]> {
  try {
    const res = await fetch(`https://google.serper.dev/${type}`, {
      method: "POST",
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q, gl: "de", hl: "de", num: 10 }),
    })
    if (!res.ok) return []
    const d = await res.json()
    if (type === "events") return d.events ?? []
    if (type === "news")   return d.news ?? []
    return d.organic ?? []
  } catch { return [] }
}

function mapSerperEvent(e: any, city: string, category: string, idx: number): any {
  return {
    id:       `sr-${city}-${idx}-${Math.random().toString(36).slice(2,6)}`,
    source:   "web",
    title:    e.title ?? e.name ?? "",
    venue:    e.venue ?? e.address ?? CITY_LABEL[city],
    area:     CITY_LABEL[city],
    date:     parseDate(e.date ?? e.dateText ?? ""),
    time:     e.time ?? "",
    url:      e.link ?? e.url ?? "",
    image:    e.thumbnail ?? e.imageUrl ?? "",
    price:    e.price ?? null,
    category,
    city,
  }
}

function mapOrganic(e: any, city: string, category: string, idx: number): any {
  return {
    id:       `or-${city}-${idx}-${Math.random().toString(36).slice(2,6)}`,
    source:   "web",
    title:    e.title ?? "",
    venue:    e.sitelinks?.[0]?.title ?? CITY_LABEL[city],
    area:     CITY_LABEL[city],
    date:     parseDate(e.date ?? ""),
    time:     "",
    url:      e.link ?? "",
    image:    e.imageUrl ?? "",
    price:    null,
    category,
    city,
  }
}

// ── Social platform search via Google ────────────────────────────────────────
// Instagram, Facebook, TikTok, YouTube don't allow direct API event search,
// but Google indexes their public pages — we search them directly.

async function fetchSocials(city: string, vibe: string): Promise<any[]> {
  const key = process.env.SERPER_API_KEY
  if (!key) return []

  const label = CITY_LABEL[city] ?? city
  const cat   = vibeToCategory(vibe)

  // Map vibe to German + English keywords
  const kw: Record<string, { de: string; en: string; tags: string }> = {
    party:   { de: "Party Clubnacht Rave",      en: "club night party rave",     tags: "#party #clubnight #rave" },
    music:   { de: "Konzert Festival Live",      en: "concert festival live",     tags: "#concert #livemusic #festival" },
    culture: { de: "Ausstellung Kunst Theater",  en: "exhibition art theatre",    tags: "#art #exhibition #culture" },
    food:    { de: "Street Food Markt Pop-Up",   en: "street food market popup",  tags: "#streetfood #foodmarket" },
    student: { de: "Studentenparty Uni Campus",  en: "student party university",  tags: "#studentenparty #uniparty" },
    outside: { de: "Open Air Festival Stadtfest",en: "open air festival outdoor", tags: "#openair #festival #outdoor" },
    chill:   { de: "Bar Lounge Weinbar Abend",   en: "bar lounge evening chill",  tags: "#bar #lounge" },
    all:     { de: "Event Party Konzert",        en: "event party concert",       tags: "#event #party #concert" },
  }
  const k = kw[vibe] ?? kw.all

  const searches: { q: string; type: "events"|"search"|"news" }[] = [
    // Instagram — public posts indexed by Google
    { q: `site:instagram.com "${label}" ${k.de} 2025`,           type: "search" },
    { q: `site:instagram.com "${label}" ${k.tags}`,              type: "search" },
    // Facebook Events — publicly indexed
    { q: `site:facebook.com/events "${label}" ${k.en} 2025`,     type: "events" },
    { q: `site:facebook.com "${label}" ${k.de} Veranstaltung`,   type: "search" },
    // TikTok — promoters post events as videos
    { q: `site:tiktok.com "${label}" ${k.de} ${k.tags}`,         type: "search" },
    // YouTube — event promos, aftermovies, announcements
    { q: `site:youtube.com "${label}" ${k.en} 2025 official`,    type: "search" },
    // WhatsApp channel events (public groups indexed)
    { q: `"${label}" ${k.de} Event Einladung 2025 -site:eventim.de -site:ra.co`, type: "events" },
    // Local German event portals
    { q: `site:eventim.de "${label}" ${k.de}`,                   type: "search" },
    { q: `site:ticketmaster.de "${label}" ${k.en}`,              type: "search" },
    { q: `site:reservix.de "${label}" ${k.de}`,                  type: "search" },
    // Nightlife-specific German platforms
    { q: `site:berghain.de OR site:clubbase.de "${label}" ${k.de}`, type: "search" },
    // Local city event pages
    { q: `"${label}" Veranstaltungen ${k.de} ${new Date().getFullYear()}`, type: "events" },
    // News about upcoming events
    { q: `"${label}" ${k.de} Event Ankündigung`,                 type: "news" },
  ]

  const results = await Promise.allSettled(
    searches.map(s => serperQuery(s.q, key, s.type))
  )

  const all: any[] = []
  results.forEach((r, i) => {
    if (r.status !== "fulfilled") return
    const isEvents  = searches[i].type === "events"
    const isOrganic = searches[i].type === "search"
    r.value.forEach((e: any, j: number) => {
      if (isEvents)  all.push(mapSerperEvent(e, city, cat, i * 100 + j))
      if (isOrganic) all.push(mapOrganic(e, city, cat, i * 100 + j))
      // News: treat as organic
      if (!isEvents && !isOrganic) all.push(mapOrganic(e, city, cat, i * 100 + j))
    })
  })

  return all
}

// ── General Serper event search ───────────────────────────────────────────────

async function fetchSerper(city: string, vibe: string): Promise<any[]> {
  const key = process.env.SERPER_API_KEY
  if (!key) return []

  const label = CITY_LABEL[city] ?? city
  const cat   = vibeToCategory(vibe)

  const vibeTerms: Record<string, string[]> = {
    party:   ["Clubnacht Techno House Rave Party", "club rave party night"],
    music:   ["Konzert Live Musik Festival", "concert live music festival"],
    culture: ["Ausstellung Theater Kunst Kultur", "exhibition art theatre culture"],
    food:    ["Street Food Markt Pop-Up Foodfestival", "street food market popup"],
    student: ["Studentenparty Uni Hochschulparty AStA", "student party university campus"],
    outside: ["Open Air Festival Stadtfest Sommerfest", "outdoor open air festival"],
    chill:   ["Bar Lounge Weinbar Cocktailbar", "bar lounge wine cocktail"],
    all:     ["Event Party Konzert Festival Veranstaltung", "event party concert festival"],
  }

  const queries = vibeTerms[vibe] ?? vibeTerms.all
  const searches = queries.map(q => `${q} ${label} ${new Date().getFullYear()}`)

  const results = await Promise.allSettled(
    searches.map(q => serperQuery(q, key, "events"))
  )

  const all: any[] = []
  results.forEach((r, i) => {
    if (r.status !== "fulfilled") return
    r.value.forEach((e: any, j: number) => all.push(mapSerperEvent(e, city, cat, i * 100 + j)))
  })
  return all
}

// ── Resident Advisor ──────────────────────────────────────────────────────────

async function fetchRA(city: string, vibe: string): Promise<any[]> {
  if (!["party", "music", "all"].includes(vibe)) return []
  const RA_AREAS: Record<string, string> = {
    mannheim: "mannheim", heidelberg: "heidelberg",
    frankfurt: "frankfurt", karlsruhe: "karlsruhe",
  }
  const area = RA_AREAS[city]
  if (!area) return []

  try {
    const today = new Date().toISOString().split("T")[0]
    const end   = new Date(Date.now() + 30 * 24 * 3600_000).toISOString().split("T")[0]
    const res   = await fetch("https://ra.co/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0", "Referer": "https://ra.co" },
      body: JSON.stringify({
        operationName: "GET_EVENT_LISTINGS",
        variables: { filters: { areas: { slug: area }, startDate: today, endDate: end }, pageSize: 20, page: 1 },
        query: `query GET_EVENT_LISTINGS($filters: FilterInputDtoInput, $pageSize: Int, $page: Int) {
          eventListings(filters: $filters, pageSize: $pageSize, page: $page) {
            data { id event { id title date startTime contentUrl venue { name } images { filename } } }
          }
        }`,
      }),
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.data?.eventListings?.data ?? []).map((l: any) => ({
      id:       `ra-${l.event.id}`,
      source:   "ra",
      title:    l.event.title,
      venue:    l.event.venue?.name ?? city,
      area:     city,
      date:     l.event.date?.split("T")[0] ?? "",
      time:     l.event.startTime ?? "",
      url:      l.event.contentUrl ? `https://ra.co${l.event.contentUrl}` : "",
      image:    l.event.images?.[0]?.filename ? `https://ra.co${l.event.images[0].filename}` : "",
      price:    null,
      category: "Nightlife",
      city,
    }))
  } catch { return [] }
}

// ── Ticketmaster ──────────────────────────────────────────────────────────────

async function fetchTicketmaster(city: string, vibe: string): Promise<any[]> {
  const key = process.env.TICKETMASTER_API_KEY
  if (!key) return []
  const params = new URLSearchParams({
    apikey: key, city: CITY_LABEL[city] ?? city, countryCode: "DE",
    size: "20", sort: "date,asc",
    classificationName: vibe === "music" ? "music" : vibe === "culture" ? "arts" : "music,arts",
  })
  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`, { next: { revalidate: 1800 } })
    if (!res.ok) return []
    const data = await res.json()
    return (data._embedded?.events ?? []).map((e: any) => ({
      id: `tm-${e.id}`, source: "ticketmaster",
      title: e.name, venue: e._embedded?.venues?.[0]?.name ?? city,
      area: e._embedded?.venues?.[0]?.city?.name ?? city,
      date: e.dates?.start?.localDate ?? "", time: e.dates?.start?.localTime?.slice(0,5) ?? "",
      url: e.url ?? "", image: e.images?.[0]?.url ?? "",
      price: e.priceRanges ? `€${Math.round(e.priceRanges[0].min)}` : null,
      category: e.classifications?.[0]?.genre?.name ?? "Event", city,
    }))
  } catch { return [] }
}

// ── Eventbrite ────────────────────────────────────────────────────────────────

async function fetchEventbrite(city: string, vibe: string): Promise<any[]> {
  const key = process.env.EVENTBRITE_API_KEY
  if (!key) return []
  const catMap: Record<string, string> = { music: "103", culture: "105", food: "110", party: "103" }
  const params = new URLSearchParams({
    "location.address": `${CITY_LABEL[city]}, Germany`,
    "location.within": "25km", expand: "venue", sort_by: "date",
    "start_date.range_start": new Date().toISOString(),
    "start_date.range_end": new Date(Date.now() + 30 * 24 * 3600_000).toISOString(),
    ...(catMap[vibe] ? { categories: catMap[vibe] } : {}),
  })
  try {
    const res = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, {
      headers: { Authorization: `Bearer ${key}` }, next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data.events ?? []).map((e: any) => ({
      id: `eb-${e.id}`, source: "eventbrite",
      title: e.name?.text ?? "Event", venue: e.venue?.name ?? city,
      area: e.venue?.address?.city ?? city,
      date: e.start?.local?.split("T")[0] ?? "", time: e.start?.local?.split("T")[1]?.slice(0,5) ?? "",
      url: e.url ?? "", image: e.logo?.url ?? "",
      price: e.is_free ? "Free" : null,
      category: catMap[vibe] === "110" ? "Food" : catMap[vibe] === "105" ? "Culture" : "Event", city,
    }))
  } catch { return [] }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function vibeToCategory(vibe: string): string {
  const map: Record<string,string> = {
    party: "Nightlife", music: "Music", culture: "Culture",
    food: "Food", student: "Student", outside: "Outdoor", chill: "Bar",
  }
  return map[vibe] ?? "Event"
}

function dedupe(events: any[]): any[] {
  const seen = new Set<string>()
  return events.filter(e => {
    if (!e.title) return false
    const key = e.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 25)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ── Main ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "mannheim"
  const vibe = req.nextUrl.searchParams.get("vibe") ?? "all"

  const [ra, tm, eb, sr, social] = await Promise.allSettled([
    fetchRA(city, vibe),
    fetchTicketmaster(city, vibe),
    fetchEventbrite(city, vibe),
    fetchSerper(city, vibe),
    fetchSocials(city, vibe),   // Instagram, Facebook, TikTok, YouTube, local portals
  ])

  const get = (r: PromiseSettledResult<any[]>) => r.status === "fulfilled" ? r.value : []

  // Priority order: RA (most reliable) → TM → EB → Serper → Social
  const merged = [
    ...get(ra),
    ...get(tm),
    ...get(eb),
    ...get(sr),
    ...get(social),
  ]

  const deduped = dedupe(merged)
  deduped.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date > b.date ? 1 : -1
  })

  return NextResponse.json({
    events: deduped,
    total:  deduped.length,
    sources: {
      ra:           get(ra).length,
      ticketmaster: get(tm).length,
      eventbrite:   get(eb).length,
      web:          get(sr).length,
      social:       get(social).length,
    },
  })
}
