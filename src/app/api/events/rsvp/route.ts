import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromRequest } from "@/lib/auth"
import { z } from "zod"

const Schema = z.object({ eventId: z.string().min(1) })

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const eventId = searchParams.get("eventId") ?? ""

  const count = await prisma.eventRSVP.count({ where: { eventId } })
  const user = getUserFromRequest(req)
  const going = user
    ? !!(await prisma.eventRSVP.findUnique({ where: { userId_eventId: { userId: user.userId, eventId } } }))
    : false

  return NextResponse.json({ count, going })
}

export async function POST(req: NextRequest) {
  const user = getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = Schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })

  const { eventId } = result.data

  const existing = await prisma.eventRSVP.findUnique({
    where: { userId_eventId: { userId: user.userId, eventId } },
  })

  if (existing) {
    await prisma.eventRSVP.delete({ where: { id: existing.id } })
    const count = await prisma.eventRSVP.count({ where: { eventId } })
    return NextResponse.json({ going: false, count })
  }

  await prisma.eventRSVP.create({ data: { userId: user.userId, eventId } })
  const count = await prisma.eventRSVP.count({ where: { eventId } })
  return NextResponse.json({ going: true, count })
}
