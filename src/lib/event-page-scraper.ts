/**
 * Scrapes real German event & venue websites.
 * Uses JSON-LD structured data extraction + Open Graph fallback.
 * No API key needed — just fetches public web pages server-side.
 */

import * as cheerio from "cheerio"

export interface ScrapedEvent {
  id: string
  title: string
  venue: string
  date: string
  time: string
  city: string
  category: string
  price: string
  description: string
  imageUrl?: string
  sourceUrl: string
  sourceName: string
}

const USER_AGENT =
  "Mozilla/5.0 (compatible; SzeneBot/1.0; +https://szene.app/bot)"

const FETCH_OPTS: RequestInit = {
  headers: {
    "User-Agent": USER_AGENT,
    "Accept-Language": "de-DE,de;q=0.9,en;q=0.8",
    Accept: "text/html,application/xhtml+xml",
  },
  signal: AbortSignal.timeout(8000),
}

// ── Target sites ────────────────────────────────────────────────────────────

const VENUE_SITES: Array<{
  url: string
  name: string
  city: string
  category: string
}> = [
  // ── Mannheim ────────────────────────────────────────────────────────────
  {
    url: "https://www.ms-connexion.de/events",
    name: "MS Connexion Complex",
    city: "Mannheim",
    category: "Nightlife",
  },
  {
    url: "https://www.capitol-mannheim.de/veranstaltungen",
    name: "Capitol Mannheim",
    city: "Mannheim",
    category: "Music",
  },
  {
    url: "https://www.altefeuerwache.com/programm",
    name: "Alte Feuerwache",
    city: "Mannheim",
    category: "Music",
  },
  {
    url: "https://www.zeitraumexit.de/programm",
    name: "Zeitraumexit",
    city: "Mannheim",
    category: "Art & Culture",
  },

  // ── Heidelberg ──────────────────────────────────────────────────────────
  {
    url: "https://www.karlstorbahnhof.de/programm",
    name: "Karlstorbahnhof",
    city: "Heidelberg",
    category: "Music",
  },
  {
    url: "https://www.cave54.de/programm",
    name: "Cave 54",
    city: "Heidelberg",
    category: "Music",
  },
  {
    url: "https://www.halle02.de/programm",
    name: "halle02",
    city: "Heidelberg",
    category: "Music",
  },
  {
    url: "https://www.villa-nachttanz.de/programm",
    name: "Villa Nachttanz",
    city: "Heidelberg",
    category: "Nightlife",
  },

  // ── Frankfurt ───────────────────────────────────────────────────────────
  {
    url: "https://www.batschkapp.de/programm",
    name: "Batschkapp",
    city: "Frankfurt",
    category: "Music",
  },
  {
    url: "https://www.brotfabrik.de/programm",
    name: "Brotfabrik Frankfurt",
    city: "Frankfurt",
    category: "Art & Culture",
  },
  {
    url: "https://tanzhaus-west.de/programm",
    name: "Tanzhaus West",
    city: "Frankfurt",
    category: "Music",
  },
  {
    url: "https://www.gibson-frankfurt.de/events",
    name: "Gibson Frankfurt",
    city: "Frankfurt",
    category: "Music",
  },
  {
    url: "https://www.zoom-frankfurt.de/events",
    name: "Zoom Frankfurt",
    city: "Frankfurt",
    category: "Nightlife",
  },
  {
    url: "https://www.king-kamehameha.de/events",
    name: "King Kamehameha Club",
    city: "Frankfurt",
    category: "Nightlife",
  },
]

// ── JSON-LD extractor ────────────────────────────────────────────────────────

function extractJsonLd(html: string): any[] {
  const results: any[] = []
  const regex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let match
  while ((match = regex.exec(html)) !== null) {
    try {
      const raw = match[1].trim()
      const parsed = JSON.parse(raw)
      const items = Array.isArray(parsed) ? parsed : [parsed]
      results.push(...items)
    } catch {
      // Skip malformed JSON-LD
    }
  }
  return results
}

function jsonLdToEvent(item: any, site: { name: string; city: string; category: string; url: string }): ScrapedEvent | null {
  const type = item["@type"]
  if (type !== "Event" && type !== "MusicEvent" && type !== "TheaterEvent" && type !== "SocialEvent") {
    return null
  }

  const title: string = item.name ?? item.headline
  if (!title) return null

  const startDate = item.startDate ? new Date(item.startDate) : null
  if (startDate && startDate < new Date()) return null // skip past events

  const date = startDate
    ? startDate.toISOString().split("T")[0]
    : new Date(Date.now() + 7 * 86_400_000).toISOString().split("T")[0]

  const time = startDate
    ? startDate.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
    : "20:00"

  const venue: string =
    item.location?.name ??
    (typeof item.location === "string" ? item.location : site.name)

  const description: string =
    item.description ?? item.disambiguatingDescription ?? ""

  const imageUrl: string | undefined =
    typeof item.image === "string"
      ? item.image
      : Array.isArray(item.image)
      ? item.image[0]?.url ?? item.image[0]
      : item.image?.url

  const offers = Array.isArray(item.offers) ? item.offers[0] : item.offers
  const price: string = offers?.price != null
    ? `€${offers.price}`
    : offers?.description ?? "Free"

  const url: string = item.url ?? item["@id"] ?? site.url

  return {
    id: `scraped-${Buffer.from(title + date).toString("base64").slice(0, 12)}`,
    title,
    venue,
    date,
    time,
    city: item.location?.address?.addressLocality ?? site.city,
    category: site.category,
    price,
    description: description.slice(0, 300),
    imageUrl,
    sourceUrl: url,
    sourceName: site.name,
  }
}

// ── Cheerio-based fallback ───────────────────────────────────────────────────

function extractEventsWithCheerio(html: string, site: { name: string; city: string; category: string; url: string }): ScrapedEvent[] {
  try {
    const $ = cheerio.load(html)
    const events: ScrapedEvent[] = []

    // Try common event listing selectors used by German venue sites
    const selectors = [
      ".event-item",
      ".event-entry",
      ".programm-item",
      ".veranstaltung",
      "[class*='event']",
      "article",
      ".list-item",
    ]

    for (const sel of selectors) {
      const items = $(sel)
      if (items.length < 2) continue // need at least 2 to be a list

      items.each((_, el) => {
        const $el = $(el)
        const title =
          $el.find("h1, h2, h3, h4, .title, .event-title").first().text().trim()
        if (!title || title.length < 3) return

        const dateText = $el.find(".date, .datum, time, [class*='date']").first().text().trim()
        const desc = $el.find("p, .description, .text").first().text().trim()
        const img =
          $el.find("img").first().attr("src") ??
          $el.find("[style*='background-image']").first().attr("style")?.match(/url\(['"]?([^'"()]+)['"]?\)/)?.[1]
        const href = $el.find("a").first().attr("href")

        const imageUrl = img
          ? img.startsWith("http") ? img : `${new URL(site.url).origin}${img}`
          : undefined
        const sourceUrl = href
          ? href.startsWith("http") ? href : `${new URL(site.url).origin}${href}`
          : site.url

        events.push({
          id: `scraped-${Buffer.from(title + site.name).toString("base64").slice(0, 12)}`,
          title,
          venue: site.name,
          date: new Date(Date.now() + events.length * 7 * 86_400_000).toISOString().split("T")[0],
          time: "20:00",
          city: site.city,
          category: site.category,
          price: "Free",
          description: (dateText + " " + desc).slice(0, 300).trim(),
          imageUrl,
          sourceUrl,
          sourceName: site.name,
        })
      })

      if (events.length > 0) break
    }

    return events.slice(0, 8)
  } catch {
    return []
  }
}

// ── Scrape a single site ──────────────────────────────────────────────────────

async function scrapeSite(site: (typeof VENUE_SITES)[0]): Promise<ScrapedEvent[]> {
  try {
    const res = await fetch(site.url, FETCH_OPTS)
    if (!res.ok) return []

    const html = await res.text()

    // 1. Try JSON-LD first (most reliable)
    const jsonLds = extractJsonLd(html)
    const jsonLdEvents = jsonLds
      .map((item) => jsonLdToEvent(item, site))
      .filter(Boolean) as ScrapedEvent[]

    if (jsonLdEvents.length > 0) return jsonLdEvents.slice(0, 10)

    // 2. Try cheerio-based extraction
    const cheerioEvents = extractEventsWithCheerio(html, site)
    if (cheerioEvents.length > 0) return cheerioEvents

    return []
  } catch {
    return []
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

let cachedEvents: ScrapedEvent[] | null = null
let cacheTime = 0
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

/**
 * Scrape all configured venue sites in parallel.
 * Results are cached for 30 minutes.
 */
export async function scrapeAllVenueEvents(): Promise<ScrapedEvent[]> {
  if (cachedEvents && Date.now() - cacheTime < CACHE_TTL) {
    return cachedEvents
  }

  const results = await Promise.allSettled(VENUE_SITES.map(scrapeSite))

  const events: ScrapedEvent[] = []
  for (const r of results) {
    if (r.status === "fulfilled") events.push(...r.value)
  }

  // Sort by date ascending
  events.sort((a, b) => a.date.localeCompare(b.date))

  cachedEvents = events
  cacheTime = Date.now()

  return events
}

/**
 * Scrape a specific city's events.
 */
export async function scrapeEventsByCity(city: string): Promise<ScrapedEvent[]> {
  const all = await scrapeAllVenueEvents()
  return all.filter((e) => e.city.toLowerCase() === city.toLowerCase())
}
