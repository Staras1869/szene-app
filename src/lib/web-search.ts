/**
 * Multi-provider web search.
 * Supports Serper.dev and Brave Search API.
 * Set SERPER_API_KEY or BRAVE_API_KEY in .env.local.
 * Without keys, returns empty results (OpenStreetMap still works for venues).
 */

export interface WebSearchResult {
  title: string
  url: string
  snippet: string
  date?: string
  imageUrl?: string
  position: number
  source: "serper" | "brave" | "direct"
}

// ── Serper.dev ──────────────────────────────────────────────────────────────
async function serperSearch(query: string, num = 10): Promise<WebSearchResult[]> {
  const apiKey = process.env.SERPER_API_KEY
  if (!apiKey) return []

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query, num, gl: "de", hl: "de" }),
    })

    if (!res.ok) return []
    const data = await res.json()

    return (data.organic ?? []).map((r: any, i: number) => ({
      title: r.title ?? "",
      url: r.link ?? "",
      snippet: r.snippet ?? "",
      date: r.date,
      imageUrl: r.imageUrl,
      position: i + 1,
      source: "serper" as const,
    }))
  } catch {
    return []
  }
}

// ── Brave Search API ────────────────────────────────────────────────────────
async function braveSearch(query: string, num = 10): Promise<WebSearchResult[]> {
  const apiKey = process.env.BRAVE_API_KEY
  if (!apiKey) return []

  try {
    const url = new URL("https://api.search.brave.com/res/v1/web/search")
    url.searchParams.set("q", query)
    url.searchParams.set("count", String(num))
    url.searchParams.set("country", "de")
    url.searchParams.set("search_lang", "de")
    url.searchParams.set("freshness", "pm") // past month

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
    })

    if (!res.ok) return []
    const data = await res.json()

    return (data.web?.results ?? []).map((r: any, i: number) => ({
      title: r.title ?? "",
      url: r.url ?? "",
      snippet: r.description ?? "",
      date: r.page_age,
      imageUrl: r.thumbnail?.src,
      position: i + 1,
      source: "brave" as const,
    }))
  } catch {
    return []
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Search the web with the best available provider.
 * Falls back gracefully if no keys are configured.
 */
export async function webSearch(query: string, num = 10): Promise<WebSearchResult[]> {
  if (process.env.SERPER_API_KEY) return serperSearch(query, num)
  if (process.env.BRAVE_API_KEY) return braveSearch(query, num)
  return []
}

/**
 * Search for events in a city.
 */
export async function searchEvents(city: string, query?: string): Promise<WebSearchResult[]> {
  const month = new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })
  const q = query
    ? `${query} ${city} event veranstaltung`
    : `events veranstaltungen ${city} ${month}`
  return webSearch(q, 15)
}

/**
 * Search for venues/bars/clubs by type and city.
 */
export async function searchVenuesByType(type: string, city: string): Promise<WebSearchResult[]> {
  return webSearch(`beste ${type} in ${city} 2024`, 10)
}

export function hasSearchProvider(): boolean {
  return !!(process.env.SERPER_API_KEY || process.env.BRAVE_API_KEY)
}
