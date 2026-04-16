import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

// GET /api/follow?userId=xxx  → { following, followers, isFollowing }
export async function GET(req: NextRequest) {
  const targetId = req.nextUrl.searchParams.get("userId")
  const me = getUserFromRequest(req)

  if (!targetId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  const [followers, following, isFollowing] = await Promise.all([
    prisma.userFollow.count({ where: { followingId: targetId } }),
    prisma.userFollow.count({ where: { followerId: targetId } }),
    me
      ? prisma.userFollow.findUnique({ where: { followerId_followingId: { followerId: me.userId, followingId: targetId } } }).then(Boolean)
      : Promise.resolve(false),
  ])

  return NextResponse.json({ followers, following, isFollowing })
}

const Schema = z.object({ targetId: z.string().cuid() })

// POST /api/follow  → toggle follow
export async function POST(req: NextRequest) {
  const me = getUserFromRequest(req)
  if (!me) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = Schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })

  const { targetId } = result.data
  if (targetId === me.userId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })

  const existing = await prisma.userFollow.findUnique({
    where: { followerId_followingId: { followerId: me.userId, followingId: targetId } },
  })

  if (existing) {
    await prisma.userFollow.delete({ where: { id: existing.id } })
    const count = await prisma.userFollow.count({ where: { followingId: targetId } })
    return NextResponse.json({ following: false, followers: count })
  }

  await prisma.userFollow.create({ data: { followerId: me.userId, followingId: targetId } })
  const count = await prisma.userFollow.count({ where: { followingId: targetId } })
  return NextResponse.json({ following: true, followers: count })
}
