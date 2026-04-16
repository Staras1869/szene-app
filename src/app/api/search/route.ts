import { type NextRequest, NextResponse } from "next/server"
import { webSearch, searchEvents, hasSearchProvider } from "@/lib/web-search"
import { scrapeAllVenueEvents } from "@/lib/event-page-scraper"
import { searchOSMVenues } from "@/lib/overpass-api"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") ?? ""
    const mode = (searchParams.get("mode") ?? "all") as "events" | "venues" | "web" | "all"
    const city = searchParams.get("city") ?? ""

    if (!query && mode !== "events") {
      return NextResponse.json({ results: [], total: 0, sources: [] })
    }

    const sources: string[] = []
    const results: any[] = []

    await Promise.allSettled([
      // 1. OpenStreetMap venues
      (mode === "venues" || mode === "all") &&
        searchOSMVenues(query || city || "bar")
          .then((venues) => {
            const filtered = city
              ? venues.filter((v) => v.city.toLowerCase() === city.toLowerCase())
              : venues
            if (filtered.length > 0) {
              sources.push("OpenStreetMap")
              results.push(
                ...filtered.slice(0, 30).map((v) => ({
                  type: "venue" as const,
                  id: v.id,
                  title: v.name,
                  subtitle: v.address,
                  category: v.category,
                  city: v.city,
                  lat: v.lat,
                  lon: v.lon,
                  website: v.website,
                  googleMapsUrl: v.googleMapsUrl,
                  openingHours: v.openingHours,
                  amenity: v.amenity,
                  source: "openstreetmap",
                }))
              )
            }
          })
          .catch(() => {}),

      // 2. Scraped events from venue websites
      (mode === "events" || mode === "all") &&
        scrapeAllVenueEvents()
          .then((events) => {
            const filtered = events.filter((e) => {
              const matchCity = !city || e.city.toLowerCase() === city.toLowerCase()
              const matchQuery =
                !query ||
                e.title.toLowerCase().includes(query.toLowerCase()) ||
                e.venue.toLowerCase().includes(query.toLowerCase()) ||
                e.description.toLowerCase().includes(query.toLowerCase())
              return matchCity && matchQuery
            })
            if (filtered.length > 0) {
              sources.push("Venue Websites")
              results.push(
                ...filtered.slice(0, 20).map((e) => ({
                  type: "event" as const,
                  id: e.id,
                  title: e.title,
                  subtitle: `${e.venue} · ${new Date(e.date).toLocaleDateString("de-DE", { day: "numeric", month: "short" })}`,
                  category: e.category,
                  city: e.city,
                  date: e.date,
                  time: e.time,
                  price: e.price,
                  description: e.description,
                  imageUrl: e.imageUrl,
                  sourceUrl: e.sourceUrl,
                  sourceName: e.sourceName,
                  source: "scraper",
                }))
              )
            }
          })
          .catch(() => {}),

      // 3. Web search (Serper / Brave)
      (mode === "web" || mode === "all") &&
        (query
          ? webSearch(
              city
                ? `${query} ${city} event veranstaltung`
                : `${query} Mannheim Heidelberg Frankfurt event`,
              15
            )
          : searchEvents(city || "Mannheim Heidelberg Frankfurt")
        )
          .then((webResults) => {
            if (webResults.length > 0) {
              sources.push("Web Search")
              results.push(
                ...webResults.map((r) => ({
                  type: "web" as const,
                  id: `web-${r.position}`,
                  title: r.title,
                  subtitle: new URL(r.url).hostname.replace("www.", ""),
                  snippet: r.snippet,
                  url: r.url,
                  imageUrl: r.imageUrl,
                  date: r.date,
                  source: r.source,
                }))
              )
            }
          })
          .catch(() => {}),
    ])

    return NextResponse.json({
      results,
      total: results.length,
      sources,
      hasSearchProvider: hasSearchProvider(),
      query,
    })
  } catch (err) {
    console.error("Search error:", err)
    return NextResponse.json({ error: "Search failed", results: [], total: 0 }, { status: 500 })
  }
}
