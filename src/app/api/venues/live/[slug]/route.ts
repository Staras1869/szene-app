import { type NextRequest, NextResponse } from "next/server"
import { getVenuesFromOSM } from "@/lib/overpass-api"
import { parseVenueSlug } from "@/lib/venue-slug"

export const dynamic = "force-dynamic"

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { nameQuery, cityGuess } = parseVenueSlug(params.slug)
    const allVenues = await getVenuesFromOSM()

    // Exact or fuzzy match by name, optional city filter
    const q = nameQuery.toLowerCase()
    const matches = allVenues
      .filter((v) => {
        const nameMatch = v.name.toLowerCase().includes(q) || q.includes(v.name.toLowerCase().slice(0, 5))
        const cityMatch = !cityGuess || v.city.toLowerCase() === cityGuess
        return nameMatch && cityMatch
      })
      .sort((a, b) => {
        // Prefer exact name match
        const aExact = a.name.toLowerCase() === q ? 0 : 1
        const bExact = b.name.toLowerCase() === q ? 0 : 1
        return aExact - bExact
      })

    const venue = matches[0] ?? null
    if (!venue) {
      return NextResponse.json({ error: "Venue not found", slug: params.slug }, { status: 404 })
    }

    return NextResponse.json({ venue })
  } catch (err) {
    console.error("Venue detail error:", err)
    return NextResponse.json({ error: "Failed to fetch venue" }, { status: 500 })
  }
}
