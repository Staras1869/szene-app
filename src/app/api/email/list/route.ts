import { NextRequest, NextResponse } from "next/server"
import { getEmails, updateEmail } from "@/lib/email-store"

export const runtime = "nodejs"

const INBOX_PASSWORD = process.env.INBOX_PASSWORD ?? "szene2026"

export async function GET(req: NextRequest) {
  const pwd = req.nextUrl.searchParams.get("pwd")
  if (pwd !== INBOX_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ emails: getEmails() })
}

export async function PATCH(req: NextRequest) {
  const pwd = req.nextUrl.searchParams.get("pwd")
  if (pwd !== INBOX_PASSWORD) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, draft, status } = await req.json()
  updateEmail(id, { ...(draft !== undefined && { draft }), ...(status && { status }) })
  return NextResponse.json({ ok: true })
}
