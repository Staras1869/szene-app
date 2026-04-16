import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserFromRequest } from "@/lib/auth"

// GET /api/favorites — returns all venue IDs the user has favorited
export async function GET(request: NextRequest) {
  const auth = getUserFromRequest(request)
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const favs = await db.userFavorite.findMany({
    where: { userId: auth.userId },
    select: { venueId: true },
  })

  return NextResponse.json({ venueIds: favs.map((f) => f.venueId) })
}

// POST /api/favorites — toggle a favorite (add if missing, remove if present)
export async function POST(request: NextRequest) {
  const auth = getUserFromRequest(request)
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { venueId } = await request.json()
  if (!venueId) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 })
  }

  const existing = await db.userFavorite.findUnique({
    where: { userId_venueId: { userId: auth.userId, venueId } },
  })

  if (existing) {
    await db.userFavorite.delete({ where: { id: existing.id } })
    return NextResponse.json({ favorited: false })
  } else {
    await db.userFavorite.create({ data: { userId: auth.userId, venueId } })
    return NextResponse.json({ favorited: true })
  }
}
