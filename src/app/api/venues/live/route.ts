import { type NextRequest, NextResponse } from "next/server"
import { getVenuesFromOSM, searchOSMVenues } from "@/lib/overpass-api"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") ?? ""
    const category = searchParams.get("category") ?? ""
    const city = searchParams.get("city") ?? ""
    const limit = Math.min(Number.parseInt(searchParams.get("limit") ?? "100"), 300)

    let amenityFilter: string | undefined
    if (category) {
      const map: Record<string, string> = {
        bar: "bar|pub",
        bars: "bar|pub",
        nightlife: "nightclub|bar|pub",
        nightclub: "nightclub",
        restaurant: "restaurant",
        restaurants: "restaurant",
        cafe: "cafe",
        cafes: "cafe",
        biergarten: "biergarten",
        food: "restaurant|cafe|biergarten|fast_food",
        all: "",
      }
      amenityFilter = map[category.toLowerCase()] || undefined
    }

    let venues = query
      ? await searchOSMVenues(query)
      : await getVenuesFromOSM(amenityFilter)

    if (city && city !== "all") {
      venues = venues.filter((v) => v.city.toLowerCase() === city.toLowerCase())
    }

    // Sort: nightclubs first, then bars, cafes, restaurants
    const order: Record<string, number> = {
      nightclub: 0,
      bar: 1,
      pub: 1,
      biergarten: 2,
      cafe: 3,
      restaurant: 4,
    }
    venues.sort((a, b) => (order[a.amenity] ?? 5) - (order[b.amenity] ?? 5))

    const total = venues.length
    const paged = venues.slice(0, limit)

    return NextResponse.json({
      venues: paged,
      total,
      source: "openstreetmap",
      cached: true,
    })
  } catch (err) {
    console.error("Live venues error:", err)
    return NextResponse.json({ error: "Failed to fetch live venues", venues: [], total: 0 }, { status: 500 })
  }
}
