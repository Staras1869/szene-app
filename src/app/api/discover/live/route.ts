import { type NextRequest, NextResponse } from "next/server"

export const runtime  = "nodejs"
export const revalidate = 1800

const CITY_LABEL: Record<string, string> = {
  mannheim: "Mannheim", heidelberg: "Heidelberg",
  frankfurt: "Frankfurt", ludwigshafen: "Ludwigshafen", karlsruhe: "Karlsruhe",
}

// ─── Known local venues & party brands per city ───────────────────────────────
// These are the real spots that generic searches miss.

const LOCAL_SPOTS: Record<string, { venues: string[]; brands: string[]; accounts: string[] }> = {
  mannheim: {
    venues: [
      "Kaizen Mannheim", "MS Connexion Mannheim", "BASE Club Mannheim",
      "Zeitraumexit Mannheim", "Tiffany Club Mannheim", "Alte Feuerwache Mannheim",
      "Ella und Louis Mannheim", "7Grad Mannheim", "ZEPHYR Bar Mannheim",
      "Strandbar Rennwiese Mannheim", "Hafen Mannheim Club",
      "Kulturhaus G7 Mannheim", "Capitol Mannheim", "Galerie Kurzzeit Mannheim",
      "Plan B Mannheim", "Café Central Mannheim", "Nachtflug Mannheim",
    ],
    brands: [
      "UNME Party Mannheim", "Alma Party Mannheim", "AStA Mannheim Party",
      "FSMB Mannheim", "Uni Mannheim Semesterparty", "Jungbusch Festival",
      "Afrobeats Mannheim", "Latin Night Mannheim", "Reggaeton Mannheim",
      "Hip Hop Mannheim Club", "Techno Mannheim Underground",
    ],
    accounts: [
      "site:instagram.com/kaizen.mannheim",
      "site:instagram.com jungbusch mannheim nightlife",
      "site:instagram.com mannheim party afro",
      "site:instagram.com base.club.mannheim",
      "site:facebook.com UNME Mannheim party",
      "site:facebook.com Alma Mannheim event",
    ],
  },
  heidelberg: {
    venues: [
      "Cave 54 Heidelberg", "halle02 Heidelberg", "Nachtschicht Heidelberg",
      "Destille Heidelberg", "Goldener Engel Heidelberg", "Billy Blues Heidelberg",
      "Green Apple Heidelberg", "Tangente Heidelberg", "O'Brien's Heidelberg",
      "Harmoniegarten Heidelberg", "Schwimmbad Club Heidelberg",
    ],
    brands: [
      "Uni Heidelberg Party", "Heidelberg Student Night", "Afro Night Heidelberg",
      "Latin Heidelberg", "Heidelberg Open Air",
    ],
    accounts: [
      "site:instagram.com heidelberg nightlife party",
      "site:instagram.com cave54 heidelberg",
      "site:facebook.com halle02 Heidelberg event",
    ],
  },
  frankfurt: {
    venues: [
      "Robert Johnson Frankfurt", "Cocoon Club Frankfurt", "King Kamehameha Frankfurt",
      "Metropol Frankfurt", "Zoom Frankfurt", "Batschkapp Frankfurt",
      "Musikclub Dreikönigskeller", "Club Voltaire Frankfurt",
      "Brotfabrik Frankfurt", "Tanzhaus West Frankfurt",
    ],
    brands: [
      "Goethe Uni Party Frankfurt", "Afrohouse Frankfurt", "Reggaeton Frankfurt",
      "Hip Hop Frankfurt Club", "Latin Night Frankfurt", "Techno Frankfurt",
    ],
    accounts: [
      "site:instagram.com frankfurt nightlife afro",
      "site:instagram.com robertjohnsonclub",
      "site:facebook.com Frankfurt Latin party event",
    ],
  },
  ludwigshafen: {
    venues: [
      "Das Haus Ludwigshafen", "Rheinufer Ludwigshafen", "Ernst-Bloch-Zentrum Ludwigshafen",
    ],
    brands: ["Party Ludwigshafen", "Afro Night Ludwigshafen", "Open Air Rhein"],
    accounts: ["site:instagram.com ludwigshafen party event", "site:facebook.com Ludwigshafen event"],
  },
  karlsruhe: {
    venues: [
      "Substage Karlsruhe", "Tollhaus Karlsruhe", "Gotec Club Karlsruhe",
      "Hemingway Karlsruhe", "Jubez Karlsruhe",
    ],
    brands: [
      "KIT Party Karlsruhe", "Uni Karlsruhe Semesterparty", "Afrobeats Karlsruhe",
      "Latin Night Karlsruhe",
    ],
    accounts: [
      "site:instagram.com karlsruhe nightlife",
      "site:facebook.com Karlsruhe party student",
    ],
  },
}

const DE_MONTHS: Record<string, string> = {
  januar:"01",februar:"02",märz:"03",april:"04",mai:"05",juni:"06",
  juli:"07",august:"08",september:"09",oktober:"10",november:"11",dezember:"12",
  jan:"01",feb:"02",mär:"03",apr:"04",jun:"06",jul:"07",aug:"08",sep:"09",okt:"10",nov:"11",dez:"12",
}

function parseDate(raw: string): string {
  if (!raw) return ""
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  const s = raw.toLowerCase()
  const m = s.match(/(\d{1,2})\.?\s+([a-zä]+)\.?\s*(\d{4})?/)
  if (m) {
    const day   = m[1].padStart(2, "0")
    const month = DE_MONTHS[m[2]] ?? DE_MONTHS[m[2].slice(0,3)] ?? "01"
    const year  = m[3] ?? new Date().getFullYear().toString()
    return `${year}-${month}-${day}`
  }
  return raw
}

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

function mapEvent(e: any, city: string, category: string, idx: number): any {
  return {
    id:       `sr-${city}-${idx}-${Math.random().toString(36).slice(2,6)}`,
    source:   "web",
    title:    e.title ?? e.name ?? "",
    venue:    e.venue ?? e.address ?? CITY_LABEL[city],
    area:     CITY_LABEL[city],
    date:     parseDate(e.date ?? e.dateText ?? ""),
    time:     e.time ?? "",
    url:      e.link ?? e.url ?? "",
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
    price:    null,
    category,
    city,
  }
}

// ─── 1. Hyper-local search: specific venues + party brands by name ────────────
async function fetchLocal(city: string, vibe: string): Promise<any[]> {
  const key = process.env.SERPER_API_KEY
  if (!key) return []

  const spots   = LOCAL_SPOTS[city]
  if (!spots) return []
  const cat     = vibeToCategory(vibe)
  const year    = new Date().getFullYear()

  // Search each known venue/brand for upcoming events
  const venueSearches = spots.venues.map(v => ({
    q:    `"${v}" Event Party ${year}`,
    type: "events" as const,
  }))
  const brandSearches = spots.brands.map(b => ({
    q:    `"${b}" ${year}`,
    type: "events" as const,
  }))

  const all = [...venueSearches, ...brandSearches].slice(0, 20) // cap at 20 queries

  const results = await Promise.allSettled(
    all.map(s => serperQuery(s.q, key, s.type))
  )

  const out: any[] = []
  results.forEach((r, i) => {
    if (r.status !== "fulfilled") return
    r.value.forEach((e: any, j: number) => out.push(mapEvent(e, city, cat, i * 100 + j)))
  })
  return out
}

// ─── 2. Social search: Instagram, Facebook, TikTok for local nightlife ────────
async function fetchSocials(city: string, vibe: string): Promise<any[]> {
  const key = process.env.SERPER_API_KEY
  if (!key) return []

  const label   = CITY_LABEL[city]
  const spots   = LOCAL_SPOTS[city]
  const cat     = vibeToCategory(vibe)
  const year    = new Date().getFullYear()

  // Vibe-specific keywords
  const vibeKw: Record<string, string> = {
    afro:    `Afrobeats Afrohouse Amapiano Dancehall`,
    latin:   `Reggaeton Latin Salsa Dembow`,
    hiphop:  `"Hip Hop" "Hip-Hop" RnB Trap`,
    student: `Studentenparty Uniparty AStA Semesterparty`,
    party:   `Clubnacht Party Rave Techno House`,
    music:   `Konzert "Live Music" Festival`,
    outside: `"Open Air" Stadtfest Outdoor Sommerfest`,
    chill:   `Bar Lounge Cocktail Weinbar`,
    all:     `Party Event Konzert Nightlife`,
  }
  const kw = vibeKw[vibe] ?? vibeKw.all

  const searches: { q: string; type: "events"|"search"|"news" }[] = [
    // Instagram — nightlife accounts for this city
    ...( spots?.accounts.map(q => ({ q: `${q} ${year}`, type: "search" as const })) ?? [] ),
    // Facebook Events — local specific
    { q: `site:facebook.com/events "${label}" ${kw} ${year}`,             type: "events" },
    { q: `site:facebook.com "${label}" Veranstaltung ${kw}`,              type: "search" },
    // Targeted Instagram for vibe
    { q: `site:instagram.com "${label}" ${kw} ${year}`,                   type: "search" },
    // Hidden gems / Geheimtipps
    { q: `"${label}" Geheimtipp Bar Lounge underground ${year}`,          type: "search" },
    { q: `"${label}" hidden bar insider tip nightlife ${year}`,           type: "search" },
    // Specific genre nights
    { q: `"${label}" Afrobeats Afrohouse ${year} Party`,                  type: "events" },
    { q: `"${label}" Reggaeton Latin Night ${year}`,                      type: "events" },
    { q: `"${label}" Hip-Hop RnB ${year} Club`,                           type: "events" },
    { q: `"${label}" Studentenparty AStA Uni ${year}`,                    type: "events" },
    // Local portals
    { q: `site:eventim.de "${label}" ${kw}`,                              type: "search" },
    { q: `site:reservix.de "${label}"`,                                   type: "search" },
    // WhatsApp / Telegram public channels
    { q: `"${label}" Party WhatsApp Gruppe ${year} Einladung`,            type: "search" },
    // News / announcements
    { q: `"${label}" ${kw} Ankündigung ${year}`,                          type: "news"   },
  ]

  const results = await Promise.allSettled(
    searches.map(s => serperQuery(s.q, key, s.type))
  )

  const out: any[] = []
  results.forEach((r, i) => {
    if (r.status !== "fulfilled") return
    const t = searches[i].type
    r.value.forEach((e: any, j: number) => {
      if (t === "events") out.push(mapEvent(e, city, cat, i * 100 + j))
      else                out.push(mapOrganic(e, city, cat, i * 100 + j))
    })
  })
  return out
}

// ─── 3. General event search ──────────────────────────────────────────────────
async function fetchSerper(city: string, vibe: string): Promise<any[]> {
  const key = process.env.SERPER_API_KEY
  if (!key) return []
  const label = CITY_LABEL[city]
  const cat   = vibeToCategory(vibe)
  const year  = new Date().getFullYear()

  const terms: Record<string, string[]> = {
    afro:    [`Afrobeats Afrohouse Amapiano ${label} ${year}`, `Afro Night ${label}`],
    latin:   [`Reggaeton Latin Night ${label} ${year}`, `Salsa ${label} Party`],
    hiphop:  [`Hip Hop RnB ${label} Club ${year}`, `"Hip-Hop" Night ${label}`],
    student: [`Studentenparty Uni ${label} ${year}`, `AStA Semesterparty ${label}`],
    party:   [`Clubnacht Party ${label} ${year}`, `Rave Techno ${label} Underground`],
    music:   [`Konzert Live ${label} ${year}`, `Festival ${label}`],
    outside: [`Open Air ${label} ${year}`, `Stadtfest ${label} Outdoor`],
    chill:   [`Bar Lounge ${label} ${year}`, `Cocktailbar ${label} Geheimtipp`],
    all:     [`Event Party ${label} ${year}`, `Nightlife ${label} Tonight`],
  }

  const queries = terms[vibe] ?? terms.all
  const results = await Promise.allSettled(
    queries.map(q => serperQuery(q, key, "events"))
  )
  const out: any[] = []
  results.forEach((r, i) => {
    if (r.status !== "fulfilled") return
    r.value.forEach((e: any, j: number) => out.push(mapEvent(e, city, cat, i * 100 + j)))
  })
  return out
}

// ─── 4. Resident Advisor ──────────────────────────────────────────────────────
async function fetchRA(city: string, vibe: string): Promise<any[]> {
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
            data { id event { id title date startTime contentUrl venue { name } } }
          }
        }`,
      }),
      next: { revalidate: 1800 },
    })
    if (!res.ok) return []
    const data = await res.json()
    return (data?.data?.eventListings?.data ?? []).map((l: any) => ({
      id: `ra-${l.event.id}`, source: "ra",
      title: l.event.title, venue: l.event.venue?.name ?? city, area: city,
      date: l.event.date?.split("T")[0] ?? "", time: l.event.startTime ?? "",
      url: l.event.contentUrl ? `https://ra.co${l.event.contentUrl}` : "",
      price: null, category: "Nightlife", city,
    }))
  } catch { return [] }
}

// ─── 5. Ticketmaster ──────────────────────────────────────────────────────────
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
      url: e.url ?? "", price: e.priceRanges ? `€${Math.round(e.priceRanges[0].min)}` : null,
      category: e.classifications?.[0]?.genre?.name ?? "Event", city,
    }))
  } catch { return [] }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function vibeToCategory(vibe: string): string {
  const map: Record<string,string> = {
    afro: "Afro", latin: "Latin", hiphop: "Hip-Hop",
    party: "Nightlife", music: "Music", culture: "Culture",
    food: "Food", student: "Uni", outside: "Outdoor", chill: "Bar",
  }
  return map[vibe] ?? "Event"
}

function dedupe(events: any[]): any[] {
  const seen = new Set<string>()
  return events.filter(e => {
    if (!e.title || e.title.length < 4) return false
    const key = e.title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 30)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "mannheim"
  const vibe = req.nextUrl.searchParams.get("vibe") ?? "all"

  // Run all sources in parallel — local + social first for relevance
  const [local, social, ra, tm, sr] = await Promise.allSettled([
    fetchLocal(city, vibe),        // Specific venues + party brands by name
    fetchSocials(city, vibe),      // Instagram, Facebook, hidden gems
    fetchRA(city, vibe),           // Resident Advisor (club/electronic)
    fetchTicketmaster(city, vibe), // Ticketmaster
    fetchSerper(city, vibe),       // General event search
  ])

  const get = (r: PromiseSettledResult<any[]>) => r.status === "fulfilled" ? r.value : []

  const merged = [
    ...get(local),   // local knowledge first
    ...get(ra),      // RA is high quality
    ...get(tm),
    ...get(social),
    ...get(sr),
  ]

  const deduped = dedupe(merged)
  deduped.sort((a, b) => {
    if (!a.date && !b.date) return 0
    if (!a.date) return 1
    if (!b.date) return -1
    return a.date > b.date ? 1 : -1
  })

  return NextResponse.json({
    events:  deduped,
    total:   deduped.length,
    sources: {
      local:        get(local).length,
      ra:           get(ra).length,
      ticketmaster: get(tm).length,
      social:       get(social).length,
      web:          get(sr).length,
    },
  })
}
