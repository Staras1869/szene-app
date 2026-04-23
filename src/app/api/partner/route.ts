import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

export const runtime = "nodejs"

const Schema = z.object({
  venue:     z.string().min(1).max(200),
  city:      z.string().min(1).max(100),
  instagram: z.string().max(100).optional(),
  website:   z.string().max(500).optional(),
  contact:   z.string().email(),
  message:   z.string().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = Schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })

  const d = result.data

  // Log to console (visible in Vercel logs) — simple, no email service needed yet
  console.log("🤝 Partner application:", JSON.stringify(d))

  // If you later add Resend/SendGrid, put it here
  // For now the submission is captured in Vercel function logs
  // and we respond with success so the user sees the confirmation screen

  return NextResponse.json({ ok: true })
}
