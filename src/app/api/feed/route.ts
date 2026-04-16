import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"

export const runtime = "nodejs"

// Venue name lookup — real names for OSM-seeded venues
const VENUE_NAMES: Record<string, string> = {
  "osm-1": "Ella & Louis",
  "osm-2": "BASE Club",
  "osm-3": "Café Wien",
  "osm-4": "Alte Feuerwache",
  "osm-5": "Hemingway Bar",
  "osm-6": "Tapas Bar Mannheim",
}

function venueName(id: string) {
  return VENUE_NAMES[id] ?? `Venue ${id.slice(0, 6)}`
}

export async function GET(req: NextRequest) {
  const me = getUserFromRequest(req)
  if (!me) return NextResponse.json({ items: [] })

  // Who I follow
  const follows = await prisma.userFollow.findMany({
    where: { followerId: me.userId },
    select: { followingId: true },
  })
  const followingIds = follows.map((f) => f.followingId)

  if (followingIds.length === 0) return NextResponse.json({ items: [] })

  // Recent check-ins from people I follow
  const checkIns = await prisma.checkIn.findMany({
    where: { userId: { in: followingIds } },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  const items = checkIns.map((c) => ({
    id: c.id,
    type: "checkin" as const,
    userId: c.user.id,
    userName: c.user.name ?? c.user.email?.split("@")[0] ?? "Someone",
    venueName: venueName(c.venueId),
    venueId: c.venueId,
    createdAt: c.createdAt.toISOString(),
  }))

  return NextResponse.json({ items })
}
