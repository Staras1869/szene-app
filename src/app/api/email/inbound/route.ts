import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { saveEmail, type EmailThread } from "@/lib/email-store"

export const runtime = "nodejs"

const anthropic = new Anthropic()

const SYSTEM = `You are the AI assistant for Szene — a nightlife discovery app in Germany (Mannheim, Heidelberg, Frankfurt, Ludwigshafen, Karlsruhe).
The app is run by Efstratios Kampourakis.

You draft professional, friendly email replies on behalf of Szene.

Types of emails you handle:
- Partner / venue inquiries → enthusiastic, explain the partner program, invite them to fill out the form at szene.app/partner
- Press / media inquiries → professional, offer a call or more info
- User support → helpful, explain features
- General questions → friendly and concise

Always write in the same language as the incoming email (German or English).
Sign off as: "Das Szene Team" (German) or "The Szene Team" (English).
Keep replies concise — max 150 words. Never make up facts about pricing or partnerships you don't know.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Resend inbound email webhook payload
    const from      = body.from ?? body.sender ?? "unknown@unknown.com"
    const fromName  = body.from_name ?? body.name ?? from.split("@")[0]
    const subject   = body.subject ?? "(no subject)"
    const text      = body.text ?? body.plain_text ?? body.html?.replace(/<[^>]+>/g, " ") ?? ""

    const id = `email_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    console.log(`📧 Inbound email from ${from}: ${subject}`)

    // Draft reply with Claude
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM,
      messages: [{
        role: "user",
        content: `Draft a reply to this email:\n\nFrom: ${fromName} <${from}>\nSubject: ${subject}\n\n${text}`,
      }],
    })

    const draft = response.content[0].type === "text" ? response.content[0].text : ""

    const email: EmailThread = {
      id,
      from,
      fromName,
      subject,
      body: text,
      receivedAt: new Date().toISOString(),
      draft,
      status: "pending",
    }

    saveEmail(email)
    console.log(`✅ Draft ready for email ${id}`)

    return NextResponse.json({ ok: true, id })
  } catch (err) {
    console.error("Inbound email error:", err)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
