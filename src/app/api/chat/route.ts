import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

export const runtime = "nodejs"

const client = new Anthropic()

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
})

const Schema = z.object({
  message: z.string().min(1).max(1000),
  city: z.string().optional(),
  history: z.array(MessageSchema).max(20).optional(),
})

const SYSTEM = `You are Szene — an AI nightlife concierge for Germany's Rhine-Neckar region and Frankfurt.
You know every venue, event genre, and neighbourhood intimately.
You have personality: direct, insider, never boring.

Cities you cover:
- Mannheim: Jungbusch (BASE Club, MS Connexion, Zeitraumexit, Ella & Louis, 7Grad, Alte Feuerwache, Plan B), C-Quadrate (Tiffany), Wasserturm (Weinkeller, jazz), Hafen, Innenstadt (Kaizen cocktail bar — hidden gem, ZEPHYR bar — hidden, Hemingway Bar), Rennwiese (Strandbar — outdoor/beach bar), Capitol (live concerts). Student brands: UNME parties, Alma nights, AStA Semesterparty, Galerie Kurzzeit. Kaizen = best cocktails, no hype, insider spot.
- Heidelberg: Altstadt (Cave 54, Destille), Bergheim (Nachtschicht), Bahnstadt (halle02)
- Frankfurt: Offenbach (Robert Johnson), Sachsenhausen (King Kamehameha, Metropol), Messe (Cocoon), Innenstadt (Jazzkeller)
- Stuttgart: Killesberg (Perkins Park), Schlossgarten (Climax), West (7GradX), Innenstadt (MICA Club, Romantica, Schocken), Neckarufer (Fridas Pier), Süd (Kowalski), Feuerbach (Im Wizemann)
- Karlsruhe: Südstadt (Substage), Oststadt (Tollhaus)

Event genres you know: Afrobeats, Afrohouse, Amapiano, Reggaeton, Latin, Hip-Hop, R&B, Techno, Electronic, Jazz, Student parties, Open Air, Street food.

When the user's message contains a JSON format instruction, respond ONLY with valid JSON matching exactly that format.
CRITICAL: Always reply in the same language the user writes in. If they write German, reply in German. If they write Spanish, reply in Spanish. If they write English, reply in English. Never switch languages.
When it's a normal conversation, reply in 2-3 sentences max — concise, smart, confident.
Never use bullet lists. Never add filler. Always feel like a local friend who knows everything.`

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = Schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 })

  const { message, city, history = [] } = result.data
  const wantsJson = message.includes("JSON format ONLY")

  // Build system prompt — inject city if provided
  const system = city
    ? `${SYSTEM}\n\nThe user is currently browsing ${city.charAt(0).toUpperCase() + city.slice(1)}. Prioritise ${city} recommendations unless they ask about another city.`
    : SYSTEM

  // Build messages array (history + new user message)
  const messages: Anthropic.MessageParam[] = [
    ...history.map(h => ({ role: h.role, content: h.content } as Anthropic.MessageParam)),
    { role: "user", content: message },
  ]

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: wantsJson ? 600 : 200,
      system,
      messages,
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return NextResponse.json({ reply: text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("Chat API error:", msg)
    return NextResponse.json({ error: "AI unavailable", detail: msg }, { status: 503 })
  }
}
