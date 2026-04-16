import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/checkins?venueId=xxx — returns tonight's check-in count + whether current user checked in
export async function GET(request: NextRequest) {
  const venueId = request.nextUrl.searchParams.get("venueId")
  if (!venueId) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

  // "Tonight" = past 8 hours (covers evening + night)
  const since = new Date(Date.now() - 8 * 60 * 60 * 1000)

  const count = await db.checkIn.count({
    where: { venueId, createdAt: { gte: since } },
  })

  const auth = getUserFromRequest(request)
  let userCheckedIn = false
  if (auth) {
    const mine = await db.checkIn.findFirst({
      where: { userId: auth.userId, venueId, createdAt: { gte: since } },
    })
    userCheckedIn = !!mine
  }

  return NextResponse.json({ count, userCheckedIn })
}

// POST /api/checkins — check in (once per 8h per venue per user)
export async function POST(request: NextRequest) {
  const auth = getUserFromRequest(request)
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { venueId } = await request.json()
  if (!venueId) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

  const since = new Date(Date.now() - 8 * 60 * 60 * 1000)
  const existing = await db.checkIn.findFirst({
    where: { userId: auth.userId, venueId, createdAt: { gte: since } },
  })

  if (existing) {
    return NextResponse.json({ error: "Already checked in recently" }, { status: 409 })
  }

  const checkIn = await db.checkIn.create({
    data: { userId: auth.userId, venueId },
  })

  return NextResponse.json({ checkIn })
}
