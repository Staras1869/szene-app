import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/reviews?venueId=xxx
export async function GET(request: NextRequest) {
  const venueId = request.nextUrl.searchParams.get("venueId")
  if (!venueId) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

  const reviews = await db.review.findMany({
    where: { venueId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  })

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

  return NextResponse.json({ reviews, avg, count: reviews.length })
}

// POST /api/reviews  — create or update the caller's review for a venue
export async function POST(request: NextRequest) {
  const auth = getUserFromRequest(request)
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { venueId, rating, comment } = await request.json()

  if (!venueId || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "venueId and rating (1–5) required" }, { status: 400 })
  }

  const review = await db.review.upsert({
    where: { userId_venueId: { userId: auth.userId, venueId } },
    create: { userId: auth.userId, venueId, rating, comment: comment ?? null },
    update: { rating, comment: comment ?? null },
  })

  return NextResponse.json({ review })
}

// DELETE /api/reviews?venueId=xxx
export async function DELETE(request: NextRequest) {
  const auth = getUserFromRequest(request)
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const venueId = request.nextUrl.searchParams.get("venueId")
  if (!venueId) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

  await db.review.deleteMany({ where: { userId: auth.userId, venueId } })
  return NextResponse.json({ ok: true })
}
