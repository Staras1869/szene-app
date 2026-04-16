import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const me = getUserFromRequest(req)
  if (!me) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: me.userId },
    select: {
      id: true, email: true, name: true,
      displayName: true, bio: true, avatarEmoji: true, avatarColor: true,
      neighborhood: true, musicTaste: true, vibes: true, instagram: true, onboarded: true,
      createdAt: true,
    },
  })

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ user })
}

const UpdateSchema = z.object({
  displayName:  z.string().max(40).optional(),
  bio:          z.string().max(160).optional(),
  avatarEmoji:  z.string().max(4).optional(),
  avatarColor:  z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  neighborhood: z.string().max(60).optional(),
  musicTaste:   z.array(z.string()).max(5).optional(),
  vibes:        z.array(z.string()).max(5).optional(),
  instagram:    z.string().max(40).optional(),
  onboarded:    z.boolean().optional(),
})

export async function PATCH(req: NextRequest) {
  const me = getUserFromRequest(req)
  if (!me) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = UpdateSchema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })

  const user = await prisma.user.update({
    where: { id: me.userId },
    data: result.data,
    select: {
      id: true, displayName: true, bio: true, avatarEmoji: true, avatarColor: true,
      neighborhood: true, musicTaste: true, vibes: true, instagram: true, onboarded: true,
    },
  })

  return NextResponse.json({ user })
}
