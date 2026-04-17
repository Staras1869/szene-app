import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

export const runtime = "nodejs"

const client = new Anthropic()

const Schema = z.object({
  message: z.string().min(1).max(1000),
})

const SYSTEM = `You are Szene — an AI nightlife concierge for Germany's Rhine-Neckar region and Frankfurt.
You know every venue, event genre, and neighbourhood intimately.
You have personality: direct, insider, never boring.

Cities you cover:
- Mannheim: Jungbusch (BASE Club, MS Connexion, Zeitraumexit, Ella & Louis), C-Quadrate (Tiffany), Wasserturm (wine bars, jazz), Hafen
- Heidelberg: Altstadt (Cave 54, Destille), Bergheim (Nachtschicht), Bahnstadt (halle02)
- Frankfurt: Offenbach (Robert Johnson), Sachsenhausen (King Kamehameha, Metropol), Messe (Cocoon), Innenstadt (Jazzkeller)
- Ludwigshafen: Mitte (Das Haus), Rheinufer, Hemshof
- Karlsruhe: Südstadt (Substage), Oststadt (Tollhaus)

Event genres you know: Afrobeats, Afrohouse, Amapiano, Reggaeton, Latin, Hip-Hop, R&B, Techno, Electronic, Jazz, Student parties, Open Air, Street food.

When the user's message contains a JSON format instruction, respond ONLY with valid JSON matching exactly that format.
When it's a normal conversation, reply in 2-3 sentences max — concise, smart, confident.
Never use bullet lists. Never add filler. Always feel like a local friend who knows everything.`

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = Schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })

  const { message } = result.data
  const wantsJson   = message.includes("JSON format ONLY")

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: wantsJson ? 600 : 200,
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
