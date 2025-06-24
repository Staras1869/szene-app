import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get("city")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const latitude = searchParams.get("lat")
    const longitude = searchParams.get("lng")
    const radius = searchParams.get("radius") || "5" // km
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const whereClause: any = {
      status: "active",
    }

    // Apply filters
    if (city) {
      whereClause.city = {
        equals: city,
        mode: "insensitive",
      }
    }

    if (category) {
      whereClause.category = {
        equals: category,
        mode: "insensitive",
      }
    }

    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ]
    }

    // Get venues
    const venues = await prisma.venue.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            reviews: true,
            favorites: true,
            checkIns: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { rating: "desc" }, { reviewCount: "desc" }],
      take: limit,
      skip: offset,
    })

    // If location provided, calculate distances
    let venuesWithDistance = venues
    if (latitude && longitude) {
      venuesWithDistance = venues
        .map((venue) => {
          if (venue.latitude && venue.longitude) {
            const distance = calculateDistance(
              Number.parseFloat(latitude),
              Number.parseFloat(longitude),
              Number.parseFloat(venue.latitude.toString()),
              Number.parseFloat(venue.longitude.toString()),
            )
            return { ...venue, distance }
          }
          return { ...venue, distance: null }
        })
        .filter((venue) => venue.distance === null || venue.distance <= Number.parseFloat(radius))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))
    }

    return NextResponse.json({
      venues: venuesWithDistance,
      total: venues.length,
      hasMore: venues.length === limit,
    })
  } catch (error) {
    console.error("Venues fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const venueData = await request.json()

    // Create venue
    const venue = await prisma.venue.create({
      data: {
        ...venueData,
        slug: generateSlug(venueData.name),
      },
    })

    return NextResponse.json(venue, { status: 201 })
  } catch (error) {
    console.error("Venue creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in kilometers
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
