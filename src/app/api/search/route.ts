import { type NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

export const runtime = "nodejs"

const client = new Anthropic()

// ── Comprehensive local venue + event database ───────────────────────────────

export const VENUES = [
  { id: "tiffany",        name: "Tiffany Club",                    area: "C-Quadrat",   city: "Mannheim",   type: "Club",         emoji: "💜", tags: ["nightlife","club","party","dance","premium"], address: "C4 9-10, Mannheim", description: "Premium nightclub in the Quadrate" },
  { id: "ms-connexion",   name: "MS Connexion Complex",            area: "Hafen",       city: "Mannheim",   type: "Music venue",  emoji: "🎧", tags: ["electronic","music","club","techno","rave","multi-floor"], address: "Hafenstraße 25-27, Mannheim", description: "Multi-floor electronic music complex at the harbour" },
  { id: "zeitraumexit",   name: "Zeitraumexit",                    area: "Jungbusch",   city: "Mannheim",   type: "Club",         emoji: "🖤", tags: ["nightlife","techno","underground","art","rave"], address: "Hafenstraße 68, Mannheim", description: "Underground art and techno space in Jungbusch" },
  { id: "base-club",      name: "BASE Club",                       area: "Jungbusch",   city: "Mannheim",   type: "Club",         emoji: "🔊", tags: ["nightlife","club","bass","electronic","jungbusch"], address: "Jungbuschstraße, Mannheim", description: "Bass music and club nights in Jungbusch" },
  { id: "halle02",        name: "halle02",                         area: "Bahnstadt",   city: "Heidelberg", type: "Club",         emoji: "🏭", tags: ["nightlife","electronic","festival","techno","heidelberg","club"], address: "Eppelheimer Str. 5, Heidelberg", description: "Heidelberg's biggest club venue" },
  { id: "schwimmbad",     name: "Schwimmbad Club",                 area: "Altstadt",    city: "Heidelberg", type: "Club",         emoji: "🎸", tags: ["nightlife","indie","alternative","student","heidelberg"], address: "Tiergartenstr. 13, Heidelberg", description: "Beloved student club with indie and alternative nights" },
  { id: "ella-louis",     name: "Ella & Louis",                    area: "Jungbusch",   city: "Mannheim",   type: "Bar",          emoji: "🎷", tags: ["bar","jazz","cocktails","music","chill","live","jungbusch"], address: "Jungbuschstraße 14, Mannheim", description: "Intimate jazz bar with live music in Jungbusch" },
  { id: "hemingway",      name: "Hemingway Bar",                   area: "Innenstadt",  city: "Mannheim",   type: "Bar",          emoji: "🍸", tags: ["bar","cocktails","chill","date","romantic"], address: "N7, Mannheim", description: "Classic cocktail bar, great for dates" },
  { id: "tapas-bar",      name: "Tapas Bar Mannheim",              area: "P-Quadrate",  city: "Mannheim",   type: "Bar",          emoji: "🫒", tags: ["bar","tapas","spanish","food","wine","social"], address: "P2 1, Mannheim", description: "Spanish tapas and wine bar" },
  { id: "weinkeller",     name: "Weinkeller Wasserturm",           area: "Wasserturm",  city: "Mannheim",   type: "Wine bar",     emoji: "🍷", tags: ["wine","bar","jazz","upscale","date","romantic","chill"], address: "Wasserturm, Mannheim", description: "Upscale wine bar near the Wasserturm" },
  { id: "skybar",         name: "Skybar Mannheim",                 area: "Quadrate",    city: "Mannheim",   type: "Rooftop bar",  emoji: "🏙️", tags: ["rooftop","bar","cocktails","views","summer","outdoor","nightlife"], address: "Quadrate, Mannheim", description: "Rooftop bar with panoramic city views" },
  { id: "alte-fw",        name: "Alte Feuerwache",                 area: "Jungbusch",   city: "Mannheim",   type: "Culture",      emoji: "🎭", tags: ["culture","music","art","concert","social","community"], address: "Alten Feuerwache 1, Mannheim", description: "Cultural centre with concerts, theatre, and community events" },
  { id: "capitol",        name: "Capitol Mannheim",                area: "Käfertal",    city: "Mannheim",   type: "Concert hall", emoji: "🎤", tags: ["music","concert","rock","pop","live","big"], address: "Waldhofstraße 2, Mannheim", description: "Mannheim's main concert hall" },
  { id: "nationaltheater",name: "Nationaltheater Mannheim",        area: "Innenstadt",  city: "Mannheim",   type: "Theatre",      emoji: "🎼", tags: ["theatre","opera","culture","classical","art","drama"], address: "Mozartstraße 9, Mannheim", description: "One of Germany's top theatres — opera, drama, dance" },
  { id: "kunsthalle",     name: "Kunsthalle Mannheim",             area: "Innenstadt",  city: "Mannheim",   type: "Museum",       emoji: "🖼️", tags: ["art","museum","culture","gallery","exhibition","modern"], address: "Friedrichsplatz 4, Mannheim", description: "Major contemporary art museum at Friedrichsplatz" },
  { id: "karlstorbahnhof",name: "Karlstorbahnhof",                 area: "Südstadt",    city: "Heidelberg", type: "Culture",      emoji: "🌍", tags: ["culture","music","world","concert","art","heidelberg","live"], address: "Am Karlstor 1, Heidelberg", description: "Heidelberg's favourite cultural venue" },
  { id: "unma-schloss",   name: "Universität Mannheim (Schloss)",  area: "Schloss",     city: "Mannheim",   type: "University",   emoji: "🏛️", tags: ["university","student","unma","mannheim uni","academic","events","campus","uni"], address: "Schloss Mannheim, 68131 Mannheim", description: "University of Mannheim in the Baroque Schloss — student events, concerts, open days" },
  { id: "mensabar",       name: "Mensabar / Schneckenhof",         area: "Schloss",     city: "Mannheim",   type: "Student bar",  emoji: "🎓", tags: ["student","university","unma","bar","cheap","social","mannheim uni","campus","party","thursday"], address: "Schloss Schneckenhof, Mannheim", description: "Student bar inside the Schloss — cheap drinks, student parties every Thursday" },
  { id: "asta-mannheim",  name: "AStA Mannheim",                   area: "Schloss",     city: "Mannheim",   type: "Student union",emoji: "📚", tags: ["student","university","unma","events","campus","party","social","free"], address: "Schloss, Mannheim", description: "Student union of Mannheim University — organises campus parties and events" },
  { id: "uni-heidelberg", name: "Universität Heidelberg",          area: "Altstadt",    city: "Heidelberg", type: "University",   emoji: "🏫", tags: ["university","student","heidelberg","academic","events","campus","lecture"], address: "Grabengasse 1, Heidelberg", description: "Germany's oldest university — campus events, open lectures, student life" },
  { id: "alter-messplatz",name: "Alter Messplatz",                 area: "Neckarstadt", city: "Mannheim",   type: "Market",       emoji: "🍜", tags: ["food","market","street food","outdoor","social","weekend","cheap"], address: "Alter Messplatz, Mannheim", description: "Outdoor market and street food events in Neckarstadt" },
  { id: "batschkapp",     name: "Batschkapp",                      area: "Rödelheim",   city: "Frankfurt",  type: "Concert hall", emoji: "🤘", tags: ["music","rock","concert","live","frankfurt"], address: "Gwinnerstr. 5, Frankfurt", description: "Frankfurt's legendary rock and live music venue" },
]

const dd = (n: number) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().split("T")[0] }
const fd = (iso: string) => { const d = new Date(iso + "T00:00:00"); return d.toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" }) }

export const EVENTS_DB = [
  { id: "ev-1",  title: "UNMA Campus Party",            venue: "Mensabar / Schneckenhof", date: dd(3),  time: "22:00", city: "Mannheim",   category: "Student",   price: "€5",   tags: ["student","unma","university","party","campus","mannheim uni","thursday"], description: "Mannheim's biggest student night — the Schneckenhof courtyard opens up." },
  { id: "ev-2",  title: "AStA Semester Opening Party",  venue: "Schloss Mannheim",        date: dd(7),  time: "20:00", city: "Mannheim",   category: "Student",   price: "Free", tags: ["student","unma","university","events","campus","academic","free"],       description: "Official AStA opening party for the new semester. Free with student ID." },
  { id: "ev-3",  title: "Mensabar Thursday Special",    venue: "Mensabar, Schloss",       date: dd(4),  time: "21:00", city: "Mannheim",   category: "Student",   price: "€3",   tags: ["student","unma","cheap","bar","thursday","campus","social"],            description: "Cheapest drinks in Mannheim — student card gets you in for €3." },
  { id: "ev-4",  title: "Rooftop Sessions",             venue: "Skybar Mannheim",         date: dd(2),  time: "20:00", city: "Mannheim",   category: "Nightlife", price: "€15",  tags: ["rooftop","bar","cocktails","views","nightlife","summer"],               description: "Panoramic city views, craft cocktails, DJ sets." },
  { id: "ev-5",  title: "Jazz & Wine Evening",          venue: "Weinkeller Wasserturm",   date: dd(1),  time: "19:30", city: "Mannheim",   category: "Music",     price: "€20",  tags: ["jazz","wine","music","date","romantic","chill"],                        description: "Live jazz trio and curated Rhine Valley wines." },
  { id: "ev-6",  title: "Electronic Sunday",            venue: "BASE Club",               date: dd(4),  time: "22:00", city: "Mannheim",   category: "Nightlife", price: "€12",  tags: ["electronic","techno","club","bass","nightlife"],                        description: "Deep techno and bass music at BASE Club." },
  { id: "ev-7",  title: "Street Food Market",           venue: "Alter Messplatz",         date: dd(5),  time: "12:00", city: "Mannheim",   category: "Food",      price: "Free", tags: ["food","market","street food","outdoor","weekend","social","cheap"],     description: "40+ street food stands, live music, craft beer garden." },
  { id: "ev-8",  title: "Techno Rave — Zeitraumexit",  venue: "Zeitraumexit",            date: dd(6),  time: "00:00", city: "Mannheim",   category: "Nightlife", price: "€12",  tags: ["techno","underground","rave","nightlife","electronic"],                 description: "Underground techno in Mannheim's iconic art space." },
  { id: "ev-9",  title: "Kulturherbst: Art & Music",   venue: "Alte Feuerwache",         date: dd(10), time: "18:00", city: "Mannheim",   category: "Culture",   price: "Free", tags: ["culture","art","music","community","social","free"],                    description: "Local art installations, live performances, and community spirit." },
  { id: "ev-10", title: "Capitol: Live Concert",        venue: "Capitol Mannheim",        date: dd(14), time: "20:00", city: "Mannheim",   category: "Music",     price: "€28",  tags: ["music","concert","rock","pop","live"],                                  description: "Live concert night at Mannheim's legendary Capitol." },
  { id: "ev-11", title: "Indie & Alternative Night",   venue: "Schwimmbad Club",         date: dd(3),  time: "22:00", city: "Heidelberg", category: "Music",     price: "€10",  tags: ["indie","alternative","student","music","heidelberg"],                   description: "Heidelberg's weekly indie and post-punk night." },
  { id: "ev-12", title: "halle02: Festival Warm-Up",   venue: "halle02",                 date: dd(12), time: "22:00", city: "Heidelberg", category: "Nightlife", price: "€22",  tags: ["festival","electronic","heidelberg","nightlife","club"],                description: "Pre-summer festival warm-up, top-tier DJs." },
  { id: "ev-13", title: "Karlstorbahnhof: World Music",venue: "Karlstorbahnhof",         date: dd(7),  time: "21:00", city: "Heidelberg", category: "Music",     price: "€18",  tags: ["world music","culture","heidelberg","live","music"],                    description: "A vibrant evening of world music and culture." },
  { id: "ev-14", title: "Uni HD: Open Lecture Night",  venue: "Universität Heidelberg",  date: dd(5),  time: "19:00", city: "Heidelberg", category: "Student",   price: "Free", tags: ["university","student","heidelberg","academic","culture","free"],        description: "Open lecture series — free for everyone, great discussions." },
]

// AI system prompt for query parsing
const SYSTEM = `You are a search assistant for Szene, a nightlife/events app for Mannheim, Heidelberg, and Frankfurt.
Parse the user's query and return ONLY valid JSON:
{
  "tags": [relevant lowercase tags],
  "cities": [relevant cities if mentioned],
  "summary": "one short sentence of what they want"
}

Tag mappings:
- "unma", "uni mannheim", "mannheim uni", "university mannheim", "schloss" → ["student","unma","university","campus","mannheim uni"]
- "heidelberg uni", "uni heidelberg", "uniHD" → ["university","student","heidelberg"]
- "techno", "rave", "underground" → ["techno","rave","electronic","nightlife"]
- "cheap", "günstig", "student bar" → ["cheap","student","bar"]
- "date", "romantic" → ["date","romantic","bar","cocktails"]
- "food", "essen", "hungry" → ["food","restaurant","market","street food"]
Be generous with abbreviations and misspellings. Return valid JSON only.`

export async function GET(req: NextRequest) {
  // Backward compat for old GET-based search
  const q = req.nextUrl.searchParams.get("q") ?? ""
  return search(q)
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  return search(body.query ?? "")
}

async function search(query: string): Promise<NextResponse> {
  if (!query.trim()) return NextResponse.json({ venues: [], events: [], summary: "" })

  const q = query.toLowerCase().trim()
  const words = q.split(/\s+/)

  const score = (tags: string[], name: string, desc: string) => {
    let s = 0
    for (const w of words) {
      if (name.toLowerCase().includes(w)) s += 10
      if (tags.some((t) => t.includes(w) || w.includes(t))) s += 7
      if (desc.toLowerCase().includes(w)) s += 3
    }
    return s
  }

  let venueResults = VENUES.map((v) => ({ ...v, score: score(v.tags, v.name, v.description) })).filter((v) => v.score > 0).sort((a, b) => b.score - a.score).slice(0, 6)
  let eventResults = EVENTS_DB.map((e) => ({ ...e, score: score(e.tags, e.title, e.description), dateLabel: fd(e.date) })).filter((e) => e.score > 0).sort((a, b) => b.score - a.score).slice(0, 5)

  let summary = ""

  try {
    const aiRes = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      system: SYSTEM,
      messages: [{ role: "user", content: query }],
    })
    const parsed = JSON.parse(aiRes.content[0].type === "text" ? aiRes.content[0].text : "{}")
    summary = parsed.summary ?? ""

    if ((venueResults.length === 0 || eventResults.length === 0) && parsed.tags?.length) {
      const aiTags: string[] = parsed.tags
      const aiScore = (tags: string[]) => aiTags.filter((t) => tags.some((vt) => vt.includes(t) || t.includes(vt))).length * 6

      if (venueResults.length === 0) {
        venueResults = VENUES.map((v) => ({ ...v, score: aiScore(v.tags) + score(v.tags, v.name, v.description) })).filter((v) => v.score > 0).sort((a, b) => b.score - a.score).slice(0, 6)
      }
      if (eventResults.length === 0) {
        eventResults = EVENTS_DB.map((e) => ({ ...e, score: aiScore(e.tags) + score(e.tags, e.title, e.description), dateLabel: fd(e.date) })).filter((e) => e.score > 0).sort((a, b) => b.score - a.score).slice(0, 5)
      }
    }
  } catch { /* AI unavailable — local results are fine */ }

  return NextResponse.json({ venues: venueResults, events: eventResults, summary, query })
}
