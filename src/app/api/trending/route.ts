import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const revalidate = 120

// Curated fallback venues shown when DB has no recent check-in data
const CURATED: { venueId: string; name: string; area: string; type: string; emoji: string }[] = [
  { venueId: "osm-1", name: "Ella & Louis",       area: "Jungbusch",  type: "Bar",     emoji: "🎺" },
  { venueId: "osm-2", name: "BASE Club",           area: "Jungbusch",  type: "Club",    emoji: "🎧" },
  { venueId: "osm-3", name: "Café Wien",           area: "Quadrate",   type: "Café",    emoji: "☕" },
  { venueId: "osm-4", name: "Alte Feuerwache",     area: "Jungbusch",  type: "Culture", emoji: "🎭" },
  { venueId: "osm-5", name: "Hemingway Bar",       area: "Innenstadt", type: "Bar",     emoji: "🍸" },
  { venueId: "osm-6", name: "Tapas Bar Mannheim",  area: "P-Quadrate", type: "Food",    emoji: "🫒" },
]

export async function GET() {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000)

  // Group check-ins by venueId in the last 3h
  const hotVenues = await prisma.checkIn.groupBy({
    by: ["venueId"],
    where: { createdAt: { gte: threeHoursAgo } },
    _count: { venueId: true },
    orderBy: { _count: { venueId: "desc" } },
    take: 6,
  })

  if (hotVenues.length > 0) {
    return NextResponse.json({
      trending: hotVenues.map((v) => ({
        venueId: v.venueId,
        checkIns: v._count.venueId,
        name: `Venue ${v.venueId}`,
        area: "Mannheim",
        type: "Venue",
        emoji: "📍",
        isLive: true,
      })),
    })
  }

  // Fallback: curated list with simulated engagement for launch
  const trending = CURATED.map((v, i) => ({
    ...v,
    checkIns: Math.max(1, 18 - i * 3) + Math.floor(Math.random() * 4),
    isLive: false,
  }))

  return NextResponse.json({ trending })
}
