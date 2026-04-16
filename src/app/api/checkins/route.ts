import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

const CheckInSchema = z.object({
  venueId: z.string().min(1).max(100),
})

// GET /api/checkins?venueId=xxx
export async function GET(request: NextRequest) {
  const venueId = request.nextUrl.searchParams.get("venueId")
  if (!venueId || venueId.length > 100) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

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

// POST /api/checkins
export async function POST(request: NextRequest) {
  const auth = getUserFromRequest(request)
  if (!auth) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = CheckInSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid venueId" }, { status: 400 })
  }

  const { venueId } = parsed.data
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
