import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { addSubmission } from "@/lib/event-submissions"

export const runtime = "nodejs"

const Schema = z.object({
  promoterName:      z.string().min(2).max(100),
  promoterEmail:     z.string().email(),
  promoterInstagram: z.string().max(60).optional(),
  title:             z.string().min(3).max(120),
  venue:             z.string().min(2).max(120),
  city:              z.enum(["mannheim", "heidelberg", "frankfurt", "stuttgart", "karlsruhe"]),
  date:              z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time:              z.string().regex(/^\d{2}:\d{2}$/),
  genre:             z.string().min(2).max(60),
  price:             z.string().min(1).max(30),
  dresscode:         z.string().max(60).optional(),
  description:       z.string().min(20).max(600),
  ticketUrl:         z.string().url().optional().or(z.literal("")),
  instagram:         z.string().max(60).optional(),
  website:           z.string().url().optional().or(z.literal("")),
})

function getResend() {
  const { Resend } = require("resend")
  return new Resend(process.env.RESEND_API_KEY ?? "")
}

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const r = Schema.safeParse(body)
  if (!r.success) return NextResponse.json({ error: r.error.issues[0].message }, { status: 400 })

  const sub = await addSubmission(r.data)
  console.log(`[events/submit] new submission: ${sub.id} — "${sub.title}" by ${sub.promoterEmail}`)

  // Email notification to admin
  try {
    const resend = getResend()
    await resend.emails.send({
      from: "Szene <hallo@szene.app>",
      to:   "hallo@szene.app",
      subject: `🎉 Neues Event eingereicht: ${sub.title}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a">
          <h2 style="margin-bottom:4px">${sub.title}</h2>
          <p style="color:#666;margin-top:0">${sub.venue} · ${sub.city} · ${sub.date} ${sub.time}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p><strong>Genre:</strong> ${sub.genre}</p>
          <p><strong>Preis:</strong> ${sub.price}${sub.dresscode ? ` &nbsp;·&nbsp; Dress code: ${sub.dresscode}` : ""}</p>
          <p><strong>Beschreibung:</strong><br/>${sub.description}</p>
          ${sub.instagram ? `<p><strong>Instagram:</strong> @${sub.instagram}</p>` : ""}
          ${sub.ticketUrl ? `<p><strong>Tickets:</strong> <a href="${sub.ticketUrl}">${sub.ticketUrl}</a></p>` : ""}
          ${sub.website   ? `<p><strong>Website:</strong> <a href="${sub.website}">${sub.website}</a></p>` : ""}
          <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
          <p style="color:#666;font-size:13px"><strong>Von:</strong> ${sub.promoterName} · ${sub.promoterEmail}${sub.promoterInstagram ? ` · @${sub.promoterInstagram}` : ""}</p>
          <p style="font-size:13px">
            <a href="https://www.szene.app/admin/events" style="background:#a855f7;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600">
              → Im Admin-Panel prüfen
            </a>
          </p>
        </div>
      `,
    })
  } catch (e) {
    console.error("[events/submit] email failed:", e)
    // Don't fail the submission if email fails
  }

  return NextResponse.json({ ok: true, id: sub.id })
}
