import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getSubmissions, updateStatus } from "@/lib/event-submissions"

export const runtime = "nodejs"

const ADMIN_PW = process.env.ADMIN_PASSWORD ?? "szene2026"

function auth(req: NextRequest): boolean {
  const pw = req.nextUrl.searchParams.get("pw") ?? req.headers.get("x-admin-pw") ?? ""
  return pw === ADMIN_PW
}

// GET /api/events/review?pw=szene2026[&status=pending]
export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const status = req.nextUrl.searchParams.get("status") as "pending" | "approved" | "rejected" | null
  const allSubs = await getSubmissions()
  const subs = status ? allSubs.filter(s => s.status === status) : allSubs
  return NextResponse.json(subs)
}

// PATCH /api/events/review?pw=szene2026  body: { id, action: "approve"|"reject", note? }
export async function PATCH(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const Schema = z.object({
    id:     z.string(),
    action: z.enum(["approve", "reject"]),
    note:   z.string().max(300).optional(),
  })
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }) }
  const r = Schema.safeParse(body)
  if (!r.success) return NextResponse.json({ error: r.error.issues[0].message }, { status: 400 })

  const { id, action, note } = r.data
  const updated = await updateStatus(id, action === "approve" ? "approved" : "rejected", note)
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Notify promoter by email
  try {
    const { Resend } = require("resend")
    const resend = new Resend(process.env.RESEND_API_KEY ?? "")
    const isApproved = action === "approve"
    await resend.emails.send({
      from: "Szene <hallo@szene.app>",
      to:   updated.promoterEmail,
      subject: isApproved
        ? `✅ Dein Event "${updated.title}" ist jetzt live auf Szene!`
        : `Update zu deiner Einreichung: ${updated.title}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
          <h2>${isApproved ? "🎉 Dein Event ist live!" : "Update zu deiner Einreichung"}</h2>
          <p><strong>${updated.title}</strong> — ${updated.venue}, ${updated.city}</p>
          ${isApproved
            ? `<p>Dein Event ist jetzt auf <a href="https://www.szene.app">szene.app</a> sichtbar. Danke fürs Vertrauen!</p>`
            : `<p>Leider konnten wir dein Event diesmal nicht aufnehmen.${note ? `<br/>Grund: ${note}` : ""}</p><p>Du kannst jederzeit ein neues Event einreichen.</p>`
          }
          <p style="margin-top:24px;color:#999;font-size:12px">Szene · hallo@szene.app</p>
        </div>
      `,
    })
  } catch (e) {
    console.error("[events/review] notify email failed:", e)
  }

  return NextResponse.json({ ok: true, submission: updated })
}
