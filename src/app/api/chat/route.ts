import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"

export const runtime = "nodejs"

const client = new Anthropic()

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  // 500 chars per history message — prevents flooding context with injected content
  content: z.string().min(1).max(500),
})

const Schema = z.object({
  message: z.string().min(1).max(1000),
  // Whitelist cities to prevent injection via city field
  city: z.enum(["mannheim","heidelberg","frankfurt","stuttgart","karlsruhe","berlin","munich","cologne"]).optional(),
  history: z.array(MessageSchema).max(10).optional(),
})

// Prompt injection guard — patterns that try to override the system prompt
const INJECTION_PATTERNS = [
  /ignore (previous|above|all) instructions/i,
  /you are now/i,
  /new (system|persona|role|identity)/i,
  /forget (your|the) (instructions|rules|system)/i,
  /disregard (your|the|all)/i,
  /act as (if you are|a|an)/i,
  /pretend (you are|to be)/i,
  /system:\s/i,
  /<\|.*?\|>/,   // LLM control token patterns
]

function hasInjection(text: string): boolean {
  return INJECTION_PATTERNS.some(p => p.test(text))
}

const SYSTEM = `You are Szene — an AI nightlife concierge for Germany's Rhine-Neckar region and Frankfurt.
You know every venue, event genre, and neighbourhood intimately.
You have personality: direct, insider, never boring.

Cities you cover:
- Mannheim: Jungbusch (BASE Club, MS Connexion, Zeitraumexit, Ella & Louis, 7Grad, Alte Feuerwache, Plan B), C-Quadrate (Tiffany), Wasserturm (Weinkeller, jazz), Hafen (Hafen 49, Musikpark, Speicher 7), Innenstadt (Kaizen cocktail bar — hidden gem, ZEPHYR bar — hidden, Hemingway Bar), Rennwiese (Strandbar — outdoor/beach bar), Capitol (live concerts). Student brands: UNME parties, Alma nights, AStA Semesterparty, Galerie Kurzzeit.
- Heidelberg: Altstadt (Cave 54, Destille, Jazzhaus, Club 1900), Bergheim (Nachtschicht), Bahnstadt (halle02)
- Frankfurt: Offenbach (Robert Johnson), Sachsenhausen (King Kamehameha, Metropol, Gibson), Messe (Cocoon), Innenstadt (Jazzkeller), Bockenheim (Tanzhaus West)
- Stuttgart: Killesberg (Perkins Park), Schlossgarten (Climax), West (7GradX, Lehmann), Innenstadt (MICA Club, Romantica, Schocken, Detroit), Neckarufer (Fridas Pier), Süd (Kowalski), Feuerbach (Im Wizemann)
- Karlsruhe: Südstadt (Substage, Fettschmelze), Oststadt (Tollhaus), Innenstadt (Agostea, Gotec, Jazzclub KA), KIT Campus (Krokokeller)
- Berlin: Friedrichshain (Berghain, Watergate, Wilde Renate, Kater Blau, Cassiopeia), Kreuzberg (About Blank, Prince Charles, SO36, Lido, Festsaal), Mitte (Tresor, KitKatClub, Weekend Club, Golden Gate), Rummelsburg (Sisyphos), Treptow (MS Hoppetosse, Arena Club), Mitte (Yaam — Afrobeats)
- Munich: Innenstadt (Harry Klein, Rote Sonne, Blitz Club, MMA Club, Atomic Café, Neuraum, STROM, Pacha), Maximilianeum (P1), Haidhausen (Muffatwerk), Maxvorstadt (Milla), Sendling (STROM)
- Cologne: Deutz (Bootshaus), Ehrenfeld (CBE, Yuca Club, Odonien, Luxor, Helios 37, Niehler Freiheit), Kalk (Gewölbe, Die Halle Tor 2), Innenstadt (Stadtgarten, Nachtflug), Zülpicher Str. (MTC, Das Ding), Südstadt (JAKI, Trafic)

Event genres: Afrobeats, Afrohouse, Amapiano, Reggaeton, Latin, Hip-Hop, R&B, Techno, Electronic, Jazz, Student parties, Open Air, Street food.

When the user's message contains a JSON format instruction, respond ONLY with valid JSON matching exactly that format.
CRITICAL: Always reply in the same language the user writes in. German → German. English → English. Never switch.
When it's a normal conversation, reply in 2-3 sentences max — concise, smart, confident.
Never use bullet lists. Never add filler. Always feel like a local friend who knows everything.`

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) }

  const result = Schema.safeParse(body)
  if (!result.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

  const { message, city, history = [] } = result.data

  // ── Prompt injection guard ────────────────────────────────────────────────
  if (hasInjection(message) || history.some(h => hasInjection(h.content))) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const wantsJson = message.includes("JSON format ONLY")

  // City is whitelisted by Zod enum above — safe to interpolate
  const system = city
    ? `${SYSTEM}\n\nThe user is currently browsing ${city.charAt(0).toUpperCase() + city.slice(1)}. Prioritise ${city} recommendations unless they ask about another city.`
    : SYSTEM

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
    // Log internally but never expose error details to the client
    console.error("Chat API error:", err instanceof Error ? err.message : String(err))
    return NextResponse.json({ error: "AI unavailable. Please try again." }, { status: 503 })
  }
}
