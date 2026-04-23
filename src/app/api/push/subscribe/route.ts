import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { addSub } from "@/lib/push-store"

export const runtime = "nodejs"

const Schema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string(), auth: z.string() }),
  city:  z.string().optional(),
  vibes: z.array(z.string()).optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }) }

  const r = Schema.safeParse(body)
  if (!r.success) return NextResponse.json({ error: r.error.issues[0].message }, { status: 400 })

  await addSub(r.data)
  console.log(`[push] subscribed: ${r.data.city ?? "?"} vibes=${r.data.vibes?.join(",") ?? "all"}`)
  return NextResponse.json({ ok: true })
}

// Return VAPID public key so client can use it
export async function GET() {
  return NextResponse.json({ publicKey: process.env.VAPID_PUBLIC_KEY ?? "" })
}
