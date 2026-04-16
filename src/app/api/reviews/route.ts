import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

const ReviewSchema = z.object({
  venueId: z.string().min(1).max(100),
  rating:  z.number().int().min(1).max(5),
  comment: z.string().max(1000).trim().optional().nullable(),
})

// GET /api/reviews?venueId=xxx
export async function GET(request: NextRequest) {
  const venueId = request.nextUrl.searchParams.get("venueId")
  if (!venueId || venueId.length > 100) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

  const reviews = await db.review.findMany({
    where: { venueId },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  const avg =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

  return NextResponse.json({ reviews, avg, count: reviews.length })
}

// POST /api/reviews
export async function POST(request: NextRequest) {
  const auth = getUserFromRequest(request)
  if (!auth) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = ReviewSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 })
  }

  const { venueId, rating, comment } = parsed.data

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
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const venueId = request.nextUrl.searchParams.get("venueId")
  if (!venueId || venueId.length > 100) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

  await db.review.deleteMany({ where: { userId: auth.userId, venueId } })
  return NextResponse.json({ ok: true })
}
