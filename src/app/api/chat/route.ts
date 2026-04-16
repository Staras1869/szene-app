import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

export const runtime = "nodejs"

const client = new Anthropic()

const Schema = z.object({
  message: z.string().min(1).max(500),
})

const SYSTEM = `You are Szene's AI concierge for Mannheim and the Rhine-Neckar region (Heidelberg, Ludwigshafen).
Your job: help users discover the perfect venue or event for their mood, in a friendly, direct, insider tone.
Keep replies short — 2-4 sentences max. No bullet lists unless explicitly useful. No emojis overload.

Mannheim neighbourhoods: Jungbusch (edgy, nightlife, BASE Club, Ella & Louis), Quadrate (central, sky bar),
Wasserturm (upscale, wine bars, jazz), Neckarstadt (local, food markets), P-Quadrate (tapas, bistros).

Categories you can recommend: clubs, bars, wine bars, jazz venues, rooftop bars, cafés, art galleries,
street food markets, live music venues, restaurants, parks, rooftop spots.

If asked about booking, pricing, or exact hours — say you'd recommend checking Google Maps or calling the venue directly.
Always end with a light follow-up question to keep the conversation going.`

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = Schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })

  const { message } = result.data

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: SYSTEM,
      messages: [{ role: "user", content: message }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return NextResponse.json({ reply: text })
  } catch (err) {
    console.error("Chat API error:", err)
    return NextResponse.json({ error: "AI unavailable" }, { status: 503 })
  }
}
