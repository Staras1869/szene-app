import { type NextRequest, NextResponse } from "next/server"
import { MANNHEIM_HEIDELBERG_VENUES } from "@/lib/venues-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 100)
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let venues = [...MANNHEIM_HEIDELBERG_VENUES]

    if (city && city !== "all") {
      venues = venues.filter((v) => v.city.toLowerCase() === city.toLowerCase())
    }

    if (category && category !== "all") {
      venues = venues.filter((v) => v.category.toLowerCase() === category.toLowerCase())
    }

    if (search) {
      const q = search.toLowerCase()
      venues = venues.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.address.toLowerCase().includes(q)
      )
    }

    const total = venues.length
    const paginated = venues.slice(offset, offset + limit)

    return NextResponse.json({ venues: paginated, total, hasMore: offset + limit < total })
  } catch (error) {
    console.error("Venues GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, city, category, address } = body

    if (!name || !city || !category || !address) {
      return NextResponse.json(
        { error: "Missing required fields: name, city, category, address" },
        { status: 400 }
      )
    }

    // In production this would persist to the database
    const venue = { id: Date.now().toString(), ...body }
    return NextResponse.json(venue, { status: 201 })
  } catch (error) {
    console.error("Venues POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
