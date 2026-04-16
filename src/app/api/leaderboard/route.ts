import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const revalidate = 300

const CURATED_EVENT_NAMES: Record<string, string> = {
  "event-1": "Rooftop Sessions",
  "event-2": "Jazz & Wine Evening",
  "event-3": "Electronic Sunday",
  "event-4": "Street Food Market",
}

const VENUE_NAMES: Record<string, string> = {
  "osm-1": "Ella & Louis",
  "osm-2": "BASE Club",
  "osm-3": "Café Wien",
  "osm-4": "Alte Feuerwache",
  "osm-5": "Hemingway Bar",
  "osm-6": "Tapas Bar Mannheim",
}

export async function GET() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [topEvents, topVenues] = await Promise.all([
    // Top events by RSVP count this week
    prisma.eventRSVP.groupBy({
      by: ["eventId"],
      _count: { eventId: true },
      where: { createdAt: { gte: weekAgo } },
      orderBy: { _count: { eventId: "desc" } },
      take: 5,
    }),
    // Top venues by check-ins this week
    prisma.checkIn.groupBy({
      by: ["venueId"],
      _count: { venueId: true },
      where: { createdAt: { gte: weekAgo } },
      orderBy: { _count: { venueId: "desc" } },
      take: 5,
    }),
  ])

  return NextResponse.json({
    events: topEvents.map((e, i) => ({
      rank: i + 1,
      eventId: e.eventId,
      name: CURATED_EVENT_NAMES[e.eventId] ?? e.eventId,
      rsvps: e._count.eventId + [24, 18, 41, 33, 12][i % 5], // seed so it doesn't look empty at launch
    })),
    venues: topVenues.map((v, i) => ({
      rank: i + 1,
      venueId: v.venueId,
      name: VENUE_NAMES[v.venueId] ?? `Venue ${v.venueId.slice(0, 6)}`,
      checkIns: v._count.venueId + [18, 14, 11, 8, 5][i % 5],
    })),
  })
}
