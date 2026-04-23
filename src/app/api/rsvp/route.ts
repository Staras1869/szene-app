import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/rsvp — returns event IDs the current user has RSVP'd to
export async function GET(req: NextRequest) {
  const auth = getUserFromRequest(req)
  if (!auth) return NextResponse.json({ eventIds: [] })

  const rsvps = await db.eventRSVP.findMany({
    where: { userId: auth.userId },
    select: { eventId: true },
  })
  return NextResponse.json({ eventIds: rsvps.map(r => r.eventId) })
}

// POST /api/rsvp — toggle RSVP for an event { eventId }
export async function POST(req: NextRequest) {
  const auth = getUserFromRequest(req)
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { eventId } = await req.json()
  if (!eventId) return NextResponse.json({ error: "eventId required" }, { status: 400 })

  const existing = await db.eventRSVP.findUnique({
    where: { userId_eventId: { userId: auth.userId, eventId } },
  })

  if (existing) {
    await db.eventRSVP.delete({ where: { userId_eventId: { userId: auth.userId, eventId } } })
    const count = await db.eventRSVP.count({ where: { eventId } })
    return NextResponse.json({ going: false, count })
  } else {
    await db.eventRSVP.create({ data: { userId: auth.userId, eventId } })
    const count = await db.eventRSVP.count({ where: { eventId } })
    return NextResponse.json({ going: true, count })
  }
}

// GET /api/rsvp/count?eventId=m1 — public count for any event
export async function HEAD(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId")
  if (!eventId) return NextResponse.json({ count: 0 })
  const count = await db.eventRSVP.count({ where: { eventId } })
  return NextResponse.json({ count })
}
