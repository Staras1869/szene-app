import { type NextRequest, NextResponse } from "next/server"

// Mock event data - in production this would come from your database
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
      "Experience summer nights on our spectacular rooftop terrace with panoramic city views. Join us for an unforgettable evening with live DJs, craft cocktails, and the best sunset views in Mannheim.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://example.com/tickets/rooftop-sessions",
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
    description:
      "Deep electronic beats in Mannheim's premier underground venue. Featuring international DJs and the best sound system in the region.",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://example.com/tickets/electronic-night",
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
    description: "Sophisticated evening with live jazz and premium wines in the historic setting of Heidelberg Castle.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://example.com/tickets/jazz-wine",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const eventId = params.id
    const event = mockEvents.find((e) => e.id === eventId)

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error("Error fetching event:", error)
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 })
  }
}
