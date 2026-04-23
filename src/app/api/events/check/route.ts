import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"

const client = new Anthropic()

const ADMIN_PW = process.env.ADMIN_PASSWORD ?? "szene2026"

export async function POST(req: NextRequest) {
  const pw = req.nextUrl.searchParams.get("pw") ?? ""
  if (pw !== ADMIN_PW) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let sub: any
  try { sub = await req.json() } catch { return NextResponse.json({ error: "Bad JSON" }, { status: 400 }) }

  const prompt = `You are a credibility checker for Szene, a nightlife platform covering Mannheim, Heidelberg, Frankfurt, Ludwigshafen, and Karlsruhe.

A promoter has submitted an event. Assess its credibility based on what you know about real venues, typical event formats, and red flags.

SUBMISSION:
- Title: ${sub.title}
- Venue: ${sub.venue}
- City: ${sub.city}
- Date: ${sub.date} at ${sub.time}
- Genre: ${sub.genre}
- Price: ${sub.price}
- Dress code: ${sub.dresscode || "none given"}
- Description: ${sub.description}
- Event Instagram: ${sub.instagram ? "@" + sub.instagram : "none"}
- Ticket URL: ${sub.ticketUrl || "none"}
- Website: ${sub.website || "none"}
- Promoter name: ${sub.promoterName}
- Promoter email: ${sub.promoterEmail}
- Promoter Instagram: ${sub.promoterInstagram ? "@" + sub.promoterInstagram : "none"}

Respond ONLY in this exact JSON format:
{
  "verdict": "credible" | "suspicious" | "likely_fake",
  "score": 0-100,
  "summary": "1-2 sentence overall assessment",
  "checks": [
    { "label": "Venue", "ok": true|false, "note": "brief note" },
    { "label": "Pricing", "ok": true|false, "note": "brief note" },
    { "label": "Description", "ok": true|false, "note": "brief note" },
    { "label": "Contact", "ok": true|false, "note": "brief note" },
    { "label": "Consistency", "ok": true|false, "note": "brief note" }
  ],
  "flags": ["list of specific red flags if any"],
  "recommendation": "approve" | "investigate" | "reject"
}`

  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    })
    const text = res.content[0].type === "text" ? res.content[0].text : ""
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ error: "AI parse error" }, { status: 500 })
    return NextResponse.json(JSON.parse(match[0]))
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 503 })
  }
}
