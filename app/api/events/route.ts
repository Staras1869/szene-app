import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { AutomationScheduler } from "@/lib/automation-scheduler"

// Use the same singleton pattern
let automationScheduler: AutomationScheduler | null = null

function getAutomationScheduler() {
  if (!automationScheduler) {
    automationScheduler = new AutomationScheduler(process.env.OPENAI_API_KEY || "")
  }
  return automationScheduler
}

// Fallback mock events if database is empty
const mockEvents = [
  {
    id: "1",
    title: "🌆 Rooftop Summer Sessions",
    venue: "Skybar Mannheim",
    date: "2024-07-15",
    time: "21:00",
    city: "Mannheim",
    category: "Nightlife",
    price: "€15",
    description:
      "Experience summer nights on our spectacular rooftop terrace with panoramic city views and craft cocktails.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.skybar-mannheim.de/events/rooftop-sessions",
    url: "https://www.skybar-mannheim.de/events/rooftop-sessions",
  },
  {
    id: "2",
    title: "🎵 Underground Electronic Night",
    venue: "MS Connexion",
    date: "2024-07-20",
    time: "23:00",
    city: "Mannheim",
    category: "Music",
    price: "€20",
    description: "Deep electronic beats in Mannheim's premier underground venue with state-of-the-art sound system.",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.msconnexion.de/events/electronic-night",
    url: "https://www.msconnexion.de/events/electronic-night",
  },
  {
    id: "3",
    title: "🎷 Jazz & Wine Evening",
    venue: "Heidelberg Castle",
    date: "2024-07-22",
    time: "19:30",
    city: "Heidelberg",
    category: "Art",
    price: "€25",
    description: "Sophisticated evening with live jazz performances and premium wine selection in historic setting.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.heidelberg-castle.de/events/jazz-wine",
    url: "https://www.heidelberg-castle.de/events/jazz-wine",
  },
  {
    id: "4",
    title: "🎨 Cultural Arts Festival",
    venue: "Alte Feuerwache",
    date: "2024-07-25",
    time: "18:00",
    city: "Mannheim",
    category: "Culture",
    price: "€12",
    description: "Celebrate local and international artists with exhibitions, performances, and interactive workshops.",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.altefeuerwache.com/kulturfestival",
    url: "https://www.altefeuerwache.com/kulturfestival",
  },
  {
    id: "5",
    title: "🍺 Beer Garden Concert",
    venue: "Luisenpark",
    date: "2024-07-28",
    time: "16:00",
    city: "Mannheim",
    category: "Social",
    price: "€8",
    description: "Relaxed afternoon concert in beautiful beer garden setting with local craft beers and live music.",
    imageUrl: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.luisenpark.de/biergartenkonzert",
    url: "https://www.luisenpark.de/biergartenkonzert",
  },
  {
    id: "6",
    title: "🎼 Classical Concert Series",
    venue: "Capitol Mannheim",
    date: "2024-07-30",
    time: "20:00",
    city: "Mannheim",
    category: "Music",
    price: "€35",
    description:
      "World-class classical music performance in Mannheim's premier concert hall with exceptional acoustics.",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.capitol-mannheim.de/konzerte/klassik-reihe",
    url: "https://www.capitol-mannheim.de/konzerte/klassik-reihe",
  },
  {
    id: "7",
    title: "🌃 Midnight Techno Rave",
    venue: "Zeitraumexit",
    date: "2024-08-02",
    time: "00:00",
    city: "Mannheim",
    category: "Nightlife",
    price: "€22",
    description: "Underground techno experience with international DJs and immersive light shows until dawn.",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.zeitraumexit.de/events/techno-rave",
    url: "https://www.zeitraumexit.de/events/techno-rave",
  },
  {
    id: "8",
    title: "🎪 Street Food Festival",
    venue: "Hauptstraße Heidelberg",
    date: "2024-08-05",
    time: "12:00",
    city: "Heidelberg",
    category: "Food",
    price: "Free",
    description:
      "International street food vendors, live cooking shows, and family-friendly atmosphere in the old town.",
    imageUrl: "https://images.unsplash.com/photo-155593959458d-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.heidelberg-marketing.de/event/street-food-festival",
    url: "https://www.heidelberg-marketing.de/event/street-food-festival",
  },
  {
    id: "9",
    title: "🎭 Theater Night",
    venue: "Karlstorbahnhof",
    date: "2024-08-08",
    time: "20:00",
    city: "Heidelberg",
    category: "Culture",
    price: "€18",
    description: "Contemporary theater performance exploring modern themes with innovative staging and lighting.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.karlstorbahnhof.de/programm/theater-nacht",
    url: "https://www.karlstorbahnhof.de/programm/theater-nacht",
  },
  {
    id: "10",
    title: "🎸 Indie Rock Showcase",
    venue: "halle02",
    date: "2024-08-10",
    time: "21:00",
    city: "Heidelberg",
    category: "Music",
    price: "€16",
    description: "Discover emerging indie rock bands from across Germany in an intimate venue setting.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.halle02.de/programm/indie-rock-showcase",
    url: "https://www.halle02.de/programm/indie-rock-showcase",
  },
  {
    id: "11",
    title: "🥂 Wine Tasting Evening",
    venue: "Villa Nachttanz",
    date: "2024-08-12",
    time: "19:00",
    city: "Heidelberg",
    category: "Social",
    price: "€28",
    description: "Guided wine tasting featuring regional wines paired with artisanal cheeses and live acoustic music.",
    imageUrl: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.villa-nachttanz.de/weinprobe",
    url: "https://www.villa-nachttanz.de/weinprobe",
  },
  {
    id: "12",
    title: "🎨 Art Gallery Opening",
    venue: "Kunstverein Mannheim",
    date: "2024-08-15",
    time: "18:30",
    city: "Mannheim",
    category: "Art",
    price: "€10",
    description: "Opening reception for contemporary art exhibition featuring local and international artists.",
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&auto=format",
    status: "approved",
    sourceUrl: "https://www.kunstverein-mannheim.de/eroeffnung",
    url: "https://www.kunstverein-mannheim.de/eroeffnung",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "approved"
    const city = searchParams.get("city") || "all"
    const category = searchParams.get("category") || "all"
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    console.log("Events API called with filters:", { status, city, category, limit })

    // Build the where clause for Prisma
    const whereClause: any = {}

    if (status !== "all") {
      whereClause.status = status
    }

    if (city !== "all") {
      whereClause.venue = {
        city: {
          equals: city,
          mode: "insensitive",
        },
      }
    }

    if (category !== "all") {
      whereClause.category = {
        equals: category,
        mode: "insensitive",
      }
    }

    try {
      // Try to get events from the database
      const events = await prisma.event.findMany({
        where: whereClause,
        include: {
          venue: {
            select: {
              name: true,
              city: true,
              address: true,
              images: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { eventDate: "asc" }],
        take: limit,
      })

      if (events && events.length > 0) {
        return NextResponse.json({
          events,
          total: events.length,
          timestamp: new Date().toISOString(),
        })
      }

      // If no events in database, try automation scheduler
      const scheduler = getAutomationScheduler()
      let schedulerEvents = []

      if (status === "pending") {
        schedulerEvents = await scheduler.getPendingEvents()
      } else if (status === "approved") {
        schedulerEvents = await scheduler.getApprovedEvents({ city, category, limit })
      } else {
        // Get all events
        const approved = await scheduler.getApprovedEvents()
        const pending = await scheduler.getPendingEvents()
        schedulerEvents = [...approved, ...pending]
      }

      if (schedulerEvents && schedulerEvents.length > 0) {
        if (limit) {
          schedulerEvents = schedulerEvents.slice(0, limit)
        }

        return NextResponse.json({
          events: schedulerEvents,
          total: schedulerEvents.length,
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error("Error getting events from database:", error)
      // Fall back to mock data
    }

    // Fallback to mock data with proper filtering
    let filteredEvents = mockEvents.filter((event) => {
      if (status !== "all" && event.status !== status) return false
      if (city !== "all" && event.city.toLowerCase() !== city.toLowerCase()) return false
      if (category !== "all" && event.category.toLowerCase() !== category.toLowerCase()) return false
      return true
    })

    if (limit) {
      filteredEvents = filteredEvents.slice(0, limit)
    }

    console.log(`Returning ${filteredEvents.length} mock events with catchy images`)

    return NextResponse.json({
      events: filteredEvents,
      total: filteredEvents.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Events API error:", error)
    return NextResponse.json(
      {
        events: mockEvents.slice(0, 6),
        error: "Failed to fetch events, using fallback data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }, // Return 200 even on error to prevent client crashes
    )
  }
}
