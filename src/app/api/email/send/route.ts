import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { getEmail, updateEmail } from "@/lib/email-store"

export const runtime = "nodejs"

function getResend() { return new Resend(process.env.RESEND_API_KEY ?? "") }

export async function POST(req: NextRequest) {
  const { id, body } = await req.json()

  const email = getEmail(id)
  if (!email) return NextResponse.json({ error: "Email not found" }, { status: 404 })

  try {
    const resend = getResend()
    await resend.emails.send({
      from: "Szene <hallo@szene.app>",
      to:   email.from,
      subject: email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
      text: body ?? email.draft,
    })

    updateEmail(id, { status: "sent", sentAt: new Date().toISOString() })
    console.log(`📤 Reply sent to ${email.from}`)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Send error:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}
