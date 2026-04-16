import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"
// Cache live results for 30 minutes
export const revalidate = 1800

const CITY_IDS: Record<string, { tm: string; eb: string; lat: number; lng: number; countryCode: string }> = {
  mannheim:     { tm: "Mannheim",     eb: "Mannheim, Germany",     lat: 49.4875, lng: 8.4660,  countryCode: "DE" },
  heidelberg:   { tm: "Heidelberg",   eb: "Heidelberg, Germany",   lat: 49.3988, lng: 8.6724,  countryCode: "DE" },
  frankfurt:    { tm: "Frankfurt",    eb: "Frankfurt, Germany",     lat: 50.1109, lng: 8.6821,  countryCode: "DE" },
  ludwigshafen: { tm: "Ludwigshafen", eb: "Ludwigshafen, Germany", lat: 49.4772, lng: 8.4352,  countryCode: "DE" },
  karlsruhe:    { tm: "Karlsruhe",    eb: "Karlsruhe, Germany",    lat: 49.0069, lng: 8.4037,  countryCode: "DE" },
}

const VIBE_TO_SEGMENT: Record<string, string> = {
  party:   "KZFzniwnSyZfZ7v7nJ",  // Nightlife/clubs
  music:   "KZFzniwnSyZfZ7v7nE",  // Music
  culture: "KZFzniwnSyZfZ7v7na",  // Arts & Theatre
  food:    "",
}

// ── Ticketmaster ────────────────────────────────────────────────────────────

async function fetchTicketmaster(city: string, vibe: string) {
  const key = process.env.TICKETMASTER_API_KEY
  if (!key) return []

  const cityData = CITY_IDS[city]
  if (!cityData) return []

  const params = new URLSearchParams({
    apikey:      key,
    city:        cityData.tm,
    countryCode: cityData.countryCode,
    size:        "20",
    sort:        "date,asc",
    classificationName: vibe === "music" ? "music" : vibe === "culture" ? "arts" : "music,arts,family",
  })

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?${params}`, {
      next: { revalidate: 1800 }
    })
    if (!res.ok) return []
    const data = await res.json()
    const events = data._embedded?.events ?? []
    return events.map((e: any) => ({
      id:       `tm-${e.id}`,
      source:   "ticketmaster",
      title:    e.name,
      venue:    e._embedded?.venues?.[0]?.name ?? cityData.tm,
      area:     e._embedded?.venues?.[0]?.city?.name ?? city,
      date:     e.dates?.start?.localDate ?? "",
      time:     e.dates?.start?.localTime?.slice(0, 5) ?? "",
      url:      e.url ?? "",
      image:    e.images?.[0]?.url ?? "",
      price:    e.priceRanges ? `€${Math.round(e.priceRanges[0].min)}–€${Math.round(e.priceRanges[0].max)}` : null,
      category: e.classifications?.[0]?.genre?.name ?? "Event",
      city,
    }))
  } catch {
    return []
  }
}

// ── Eventbrite ──────────────────────────────────────────────────────────────

async function fetchEventbrite(city: string, vibe: string) {
  const key = process.env.EVENTBRITE_API_KEY
  if (!key) return []

  const cityData = CITY_IDS[city]
  if (!cityData) return []

  const categoryMap: Record<string, string> = {
    music:   "103",
    culture: "105",
    food:    "110",
    party:   "103",
  }

  const params = new URLSearchParams({
    token:        key,
    "location.address": cityData.eb,
    "location.within":  "25km",
    expand:        "venue",
    sort_by:       "date",
    "start_date.range_start": new Date().toISOString(),
    "start_date.range_end":   new Date(Date.now() + 30 * 24 * 3600_000).toISOString(),
    ...(categoryMap[vibe] ? { categories: categoryMap[vibe] } : {}),
  })

  try {
    const res = await fetch(`https://www.eventbriteapi.com/v3/events/search/?${params}`, {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 1800 }
    })
    if (!res.ok) return []
    const data = await res.json()
    const events = data.events ?? []
    return events.map((e: any) => ({
      id:       `eb-${e.id}`,
      source:   "eventbrite",
      title:    e.name?.text ?? "Event",
      venue:    e.venue?.name ?? cityData.eb,
      area:     e.venue?.address?.city ?? city,
      date:     e.start?.local?.split("T")[0] ?? "",
      time:     e.start?.local?.split("T")[1]?.slice(0, 5) ?? "",
      url:      e.url ?? "",
      image:    e.logo?.url ?? "",
      price:    e.is_free ? "Free" : null,
      category: e.category_id === "110" ? "Food" : e.category_id === "105" ? "Culture" : "Event",
      city,
    }))
  } catch {
    return []
  }
}

// ── Google search fallback via Serper ────────────────────────────────────────

async function fetchSerper(city: string, vibe: string) {
  const key = process.env.SERPER_API_KEY
  if (!key) return []

  const cityLabel = CITY_IDS[city] ? city.charAt(0).toUpperCase() + city.slice(1) : city
  const vibeTerms: Record<string, string> = {
    party:   "club party rave event",
    music:   "concert live music festival",
    culture: "exhibition theatre festival art",
    food:    "street food market pop-up",
    student: "studentenparty uni event",
    outside: "outdoor festival open air",
    chill:   "bar lounge evening",
    all:     "event party concert festival",
  }
  const query = `${vibeTerms[vibe] ?? "events"} ${cityLabel} 2025 ticket`

  try {
    const res = await fetch("https://google.serper.dev/events", {
      method: "POST",
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: JSON.stringify({ q: query, gl: "de", hl: "de", num: 10 }),
      next: { revalidate: 1800 }
    })
    if (!res.ok) return []
    const data = await res.json()
    const events = data.events ?? []
    return events.map((e: any, i: number) => ({
      id:       `sr-${city}-${vibe}-${i}`,
      source:   "web",
      title:    e.title ?? "Event",
      venue:    e.venue ?? cityLabel,
      area:     cityLabel,
      date:     e.date ?? "",
      time:     "",
      url:      e.link ?? "",
      image:    e.thumbnail ?? "",
      price:    null,
      category: vibeTerms[vibe]?.split(" ")[0] ?? "Event",
      city,
    }))
  } catch {
    return []
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") ?? "mannheim"
  const vibe = req.nextUrl.searchParams.get("vibe") ?? "all"

  const [tm, eb, sr] = await Promise.allSettled([
    fetchTicketmaster(city, vibe),
    fetchEventbrite(city, vibe),
    fetchSerper(city, vibe),
  ])

  const results = [
    ...(tm.status === "fulfilled" ? tm.value : []),
    ...(eb.status === "fulfilled" ? eb.value : []),
    ...(sr.status === "fulfilled" ? sr.value : []),
  ]

  // Deduplicate by title similarity
  const seen = new Set<string>()
  const deduped = results.filter(e => {
    const key = e.title.toLowerCase().replace(/\s+/g, "").slice(0, 20)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  // Sort by date
  deduped.sort((a, b) => (a.date > b.date ? 1 : -1))

  return NextResponse.json({
    events: deduped,
    sources: {
      ticketmaster: tm.status === "fulfilled" ? tm.value.length : 0,
      eventbrite:   eb.status === "fulfilled" ? eb.value.length : 0,
      web:          sr.status === "fulfilled" ? sr.value.length : 0,
    },
    hasTM: !!process.env.TICKETMASTER_API_KEY,
    hasEB: !!process.env.EVENTBRITE_API_KEY,
    hasSerper: !!process.env.SERPER_API_KEY,
  })
}
