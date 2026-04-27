"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, MapPin, Users, Search, Star, Check, ArrowUpRight, ExternalLink, Loader2, Share2, Copy, Sparkles, Navigation, ParkingCircle, Sun, Coffee, Bookmark } from "lucide-react"
import { triggerEventToast } from "./event-toast"
import { trackEventView } from "./browse-gate"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { SearchSystem } from "./search-system"

// ─── Follow store (localStorage) ─────────────────────────────────────────────
const FOLLOW_KEY  = "szene_followed_events"
const FOLLOW_META = "szene_followed_meta"
function getFollowed(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(FOLLOW_KEY) ?? "[]")) } catch { return new Set() }
}
function getFollowedMeta(): Record<string, { title: string; venue: string; emoji: string }> {
  try { return JSON.parse(localStorage.getItem(FOLLOW_META) ?? "{}") } catch { return {} }
}
function saveFollowed(s: Set<string>) {
  localStorage.setItem(FOLLOW_KEY, JSON.stringify([...s]))
}
function useFollowedEvents(events?: EventItem[]) {
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  useEffect(() => { setFollowed(getFollowed()) }, [])
  function toggle(id: string) {
    setFollowed(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        // Remove from meta
        const meta = getFollowedMeta(); delete meta[id]; localStorage.setItem(FOLLOW_META, JSON.stringify(meta))
      } else {
        next.add(id)
        // Save meta for profile display
        if (events) {
          const e = events.find(ev => ev.id === id)
          if (e) {
            const meta = getFollowedMeta()
            meta[id] = { title: e.title, venue: e.venue, emoji: e.emoji }
            localStorage.setItem(FOLLOW_META, JSON.stringify(meta))
          }
        }
      }
      saveFollowed(next)
      return next
    })
  }
  return { followed, toggle }
}

// ─── Cities ──────────────────────────────────────────────────────────────────
const CITIES = [
  { id: "mannheim",     label: "Mannheim" },
  { id: "heidelberg",   label: "Heidelberg" },
  { id: "frankfurt",    label: "Frankfurt" },
  { id: "stuttgart",    label: "Stuttgart" },
  { id: "karlsruhe",    label: "Karlsruhe" },
  { id: "berlin",       label: "Berlin" },
  { id: "munich",       label: "Munich" },
  { id: "cologne",      label: "Cologne" },
]

// ─── Vibes ───────────────────────────────────────────────────────────────────
const VIBES = [
  { id: "all",     label: "All",      emoji: "✦" },
  { id: "afro",    label: "Afro",     emoji: "🌍" },
  { id: "latin",   label: "Latin",    emoji: "🔥" },
  { id: "hiphop",  label: "Hip-Hop",  emoji: "🎤" },
  { id: "student", label: "Uni",      emoji: "🎓" },
  { id: "party",   label: "Party",    emoji: "🎉" },
  { id: "chill",   label: "Chill",    emoji: "🍷" },
  { id: "music",   label: "Live",     emoji: "🎷" },
  { id: "outside", label: "Outside",  emoji: "🌿" },
]

// ─── Events per city ──────────────────────────────────────────────────────────
type EventItem = {
  id: string; title: string; venue: string; date: string; time: string
  emoji: string; cat: string; grad: string; going: number; vibe: string
  price?: string; hot?: boolean; desc?: string
  dresscode?: string
  instagram?: string
  website?: string
  tickets?: string
  partner?: boolean
  image?: string   // photo URL
  day?: number     // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
}

// Returns "Fr 25 Apr" style label for the next occurrence of a weekday
function nextOccurrence(day: number): string {
  const today = new Date()
  const diff  = (day - today.getDay() + 7) % 7 || 7 // always future (min 1 day ahead)
  const d     = new Date(today)
  d.setDate(today.getDate() + diff)
  const days   = ["So","Mo","Di","Mi","Do","Fr","Sa"]
  const months = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"]
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
}

// Hydrate static event list with live dates
function hydrateDates(events: EventItem[]): EventItem[] {
  return events.map(e => ({
    ...e,
    date: e.day !== undefined ? nextOccurrence(e.day) : e.date,
  }))
}

const EVENTS: Record<string, EventItem[]> = {
  mannheim: [
    { id: "m1",  title: "UNME Party",              venue: "Uni Mannheim Aula",   day: 5, date: "", time: "22:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 412, vibe: "student", hot: true,  price: "Frei", dresscode: "Casual",          desc: "Die offizielle Uniparty — kostenlos mit Studierendenausweis", instagram: "unme.mannheim", website: "https://www.uni-mannheim.de/studium/campus-leben/partys/", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop&auto=format" },
    { id: "m2",  title: "Alma x Jungbusch Night",  venue: "Alte Feuerwache",     day: 6, date: "", time: "23:00", emoji: "🌃", cat: "Party",   grad: "from-violet-800 to-purple-900",  going: 287, vibe: "party",   hot: true,  price: "€5",   dresscode: "Streetwear",      desc: "Alma bringt die Jungbusch-Crew zusammen", instagram: "alma.mannheim", tickets: "https://www.altefeuerwache.com", image: "https://altefeuerwache.com/wp-content/uploads/2026/02/jean-philippe-kindler-2025_-10.jpg" },
    { id: "m3",  title: "Kaizen Cocktail Night",   venue: "Kaizen Mannheim",     day: 5, date: "", time: "20:00", emoji: "🍸", cat: "Chill",   grad: "from-stone-800 to-zinc-900",     going: 44,  vibe: "chill",              price: "—",    dresscode: "Casual",          desc: "Versteckter Geheimtipp — beste Cocktails in Mannheim", instagram: "kaizen.mannheim", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=500&fit=crop&auto=format" },
    { id: "m4",  title: "ZEPHYR Late Night",        venue: "ZEPHYR Bar",          day: 6, date: "", time: "21:00", emoji: "🌬️", cat: "Chill",   grad: "from-slate-800 to-zinc-900",     going: 31,  vibe: "chill",              price: "—",    dresscode: "Smart casual",    desc: "Intime Bar, kein Hype, nur gute Drinks", instagram: "zephyr.mannheim", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=500&fit=crop&auto=format" },
    { id: "m5",  title: "Afrobeats x Amapiano",    venue: "MS Connexion",        day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 189, vibe: "afro",    hot: true,  price: "€8",   dresscode: "Fashionable",     desc: "Afrobeats, Afrohouse & Amapiano — größte Afro-Night der Region", instagram: "msconnexion_mannheim", website: "https://www.msconnexion.de", tickets: "https://www.msconnexion.de", image: "https://www.msconnexion.com/assets/images/8/MSCC_Aussen_Highlight-7c0aff06.jpg" },
    { id: "m6",  title: "Reggaeton Saturdays",      venue: "BASE Club",           day: 6, date: "", time: "23:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 156, vibe: "latin",   hot: true,  price: "€6",   dresscode: "Streetwear",      desc: "Reggaeton, Dembow & Latin vibes", instagram: "baseclub_mannheim", website: "https://www.base-club.de", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format" },
    { id: "m7",  title: "Latin Night x Salsa",      venue: "Tiffany Club",        day: 5, date: "", time: "22:00", emoji: "💃", cat: "Latin",   grad: "from-rose-800 to-pink-900",      going: 93,  vibe: "latin",              price: "€5",   dresscode: "Elegant casual",  instagram: "tiffany_club_mannheim", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "m8",  title: "Trap & RnB Session",       venue: "Zeitraumexit",        day: 5, date: "", time: "23:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-zinc-800 to-neutral-900",   going: 88,  vibe: "hiphop",             price: "€6",   dresscode: "Streetwear",      desc: "Underground Hip-Hop im Jungbusch", instagram: "zeitraumexit", website: "https://www.zeitraumexit.de", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop&auto=format" },
    { id: "m9",  title: "Old School Hip-Hop Night", venue: "Plan B Mannheim",     day: 0, date: "", time: "21:00", emoji: "🎧", cat: "Hip-Hop", grad: "from-zinc-700 to-zinc-900",      going: 62,  vibe: "hiphop",             price: "€5",   dresscode: "Casual",          instagram: "planb_mannheim", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&auto=format" },
    { id: "m10", title: "Strandbar Rennwiese",      venue: "Strandbar Rennwiese", day: 6, date: "", time: "15:00", emoji: "🏖️", cat: "Outside", grad: "from-cyan-800 to-blue-900",      going: 320, vibe: "outside", hot: true,  price: "Frei", dresscode: "Beach vibes",     desc: "Beachbar direkt am Rhein — das Open-Air-Wohnzimmer", instagram: "strandbar.rennwiese", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "m11", title: "Afro House Night",         venue: "Alte Feuerwache",     day: 6, date: "", time: "21:00", emoji: "🌍", cat: "Afro",    grad: "from-yellow-800 to-amber-900",   going: 104, vibe: "afro",               price: "€7",   dresscode: "Fashionable",     instagram: "altefeuerwache_mannheim", website: "https://www.altefeuerwache.com", tickets: "https://www.altefeuerwache.com", image: "https://altefeuerwache.com/wp-content/uploads/2025/12/ab_1-480x300.jpg" },
    { id: "m12", title: "7Grad Underground Night",  venue: "7Grad Mannheim",      day: 5, date: "", time: "23:00", emoji: "❄️", cat: "Party",   grad: "from-fuchsia-800 to-violet-900", going: 77,  vibe: "party",              price: "€6",   dresscode: "Black preferred", desc: "Techno & Electronic im Untergrund", instagram: "7grad.mannheim", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop&auto=format" },
    { id: "m13", title: "Jazz & Cocktails",         venue: "Ella & Louis",        day: 5, date: "", time: "19:30", emoji: "🎷", cat: "Live",    grad: "from-amber-800 to-orange-900",   going: 41,  vibe: "music",              price: "Frei", dresscode: "Smart casual",    instagram: "ellaandlouis_mannheim", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop&auto=format" },
    { id: "m14", title: "AStA Semesterparty",       venue: "Galerie Kurzzeit",    day: 4, date: "", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-700 to-indigo-900",    going: 198, vibe: "student",            price: "€3",   dresscode: "Casual",          desc: "Vom AStA organisiert — günstig, voll, legendär", instagram: "asta_mannheim", website: "https://www.asta.uni-mannheim.de", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop&auto=format" },
    { id: "m17", title: "HARD IN DEN FRÜHLING",      venue: "MS Connexion Complex", date: "Do 30 Apr", time: "22:00", emoji: "⚡", cat: "Party",   grad: "from-violet-900 to-black",        going: 1840, vibe: "party",  hot: true, price: "€15",  dresscode: "Black preferred", desc: "5 Floors: Kolbenhalle, Mainfloor, Tanzsaal, Stahlwerk, Treibhaus — bis 10 Uhr morgens", instagram: "msconnexioncomplex", website: "https://www.msconnexion.com", tickets: "https://www.msconnexion.com", image: "https://www.msconnexion.com/assets/images/0/Hard%20In%20Quadrat-dbe52bf1.png" },
    { id: "m18", title: "SUPER SCHWARZES MANNHEIM", venue: "MS Connexion Complex", date: "Sa 2 Mai",  time: "22:00", emoji: "🖤", cat: "Afro",    grad: "from-zinc-900 to-black",          going: 2100, vibe: "afro",   hot: true, price: "€12",  dresscode: "Dark",            desc: "6 Floors, Mannheims größte Black Music Night — Afrobeats, R&B, Hip-Hop, House", instagram: "msconnexioncomplex", website: "https://www.msconnexion.com", image: "https://www.msconnexion.com/assets/images/8/MSCC_Aussen_Highlight-7c0aff06.jpg" },
    { id: "m19", title: "VIVA LA KOLLEKTIVA!",      venue: "MS Connexion Complex", date: "Sa 23 Mai", time: "22:00", emoji: "🌈", cat: "Party",   grad: "from-fuchsia-800 to-violet-900",  going: 960,  vibe: "party",  hot: true, price: "€12",  dresscode: "Colorful",        desc: "Queer-friendly Megaparty — Mainfloor, Tanzsaal, Stahlwerk, Treibhaus offen", instagram: "msconnexioncomplex", website: "https://www.msconnexion.com", image: "https://www.msconnexion.com/assets/images/9/23.5.viva%20la%20kollektiva_4x4-4d6e51de.jpg" },
    { id: "m20", title: "CIRCLES: Anniversary",     venue: "Lagerhaus Mannheim",   date: "Sa 9 Mai",  time: "22:00", emoji: "🎵", cat: "Party",   grad: "from-indigo-800 to-blue-900",     going: 340,  vibe: "party",             price: "€12",  dresscode: "Casual",          desc: "Mannheims Underground-Elektronik-Kollektiv feiert Jubiläum — Neurofunk & Drum & Bass", instagram: "circles_mannheim", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
    { id: "m15", title: "Maimarkt Mannheim",         venue: "Maimarkt Gelände",    date: "Sa 3 Mai", time: "10:00", emoji: "🎡", cat: "Messe",   grad: "from-yellow-700 to-orange-800",  going: 1840, vibe: "outside", hot: true, price: "€12", dresscode: "Casual", desc: "Größte regionale Verbrauchermesse — Essen, Musik, Aussteller aus ganz Deutschland", website: "https://www.maimarkt.de", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop&auto=format" },
    { id: "m16", title: "Pop-Up Art Fair Mannheim",  venue: "Rosengarten Congress", date: "Fr 25 Apr", time: "17:00", emoji: "🎨", cat: "Messe",  grad: "from-rose-800 to-pink-900",      going: 312, vibe: "outside",            price: "€8",  dresscode: "Smart", desc: "Zeitgenössische Kunst, Fotografie und Design. Vernissage mit Live-DJ.", website: "https://www.rosengarten-mannheim.de", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=500&fit=crop&auto=format" },
  ],
  heidelberg: [
    { id: "h1", title: "Afro Night HD",            venue: "halle02",            day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 112, vibe: "afro",    hot: true,  price: "€8",   dresscode: "Fashionable",  instagram: "halle02_heidelberg", website: "https://www.halle02.de", image: "https://b3310012.smushcdn.com/3310012/wp-content/uploads/2026/03/halle02_3000_felix-aspect-ratio-1920-1080.jpeg?lossy=2&strip=1&webp=1" },
    { id: "h2", title: "Latin Thursdays",          venue: "Nachtschicht",       day: 4, date: "", time: "22:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 84,  vibe: "latin",              price: "€5",   dresscode: "Casual",       instagram: "nachtschicht_hd", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "h3", title: "Uni HD Semesterparty",     venue: "Neue Uni Heidelberg",day: 5, date: "", time: "20:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-violet-900",    going: 310, vibe: "student", hot: true,  price: "Frei", dresscode: "Casual",       instagram: "uniheidelberg", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop&auto=format" },
    { id: "h4", title: "Cave 54 Student Night",    venue: "Cave 54",            day: 4, date: "", time: "22:00", emoji: "🎸", cat: "Uni",     grad: "from-indigo-800 to-blue-900",    going: 128, vibe: "student",            price: "€3",   dresscode: "Casual",       instagram: "cave54hd", website: "https://www.cave54.de", image: "https://static.wixstatic.com/media/11062b_1bca6513d1444afca6a2a1c0aae87b6df000.png/v1/fill/w_1920,h_1080,al_c,q_95,enc_avif,quality_auto/11062b_1bca6513d1444afca6a2a1c0aae87b6df000.png" },
    { id: "h5", title: "O'Brien's Pub Night",      venue: "O'Brien's",          day: 5, date: "", time: "20:00", emoji: "🍺", cat: "Chill",   grad: "from-amber-800 to-yellow-900",   going: 67,  vibe: "chill",              price: "—",    dresscode: "Casual",       image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=500&fit=crop&auto=format" },
    { id: "h6", title: "Billy Blues Live Music",   venue: "Billy Blues",        day: 6, date: "", time: "21:00", emoji: "🎸", cat: "Live",    grad: "from-blue-800 to-indigo-900",    going: 55,  vibe: "music",              price: "€7",   dresscode: "Smart casual", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop&auto=format" },
    { id: "h7", title: "Schloss Open Air",         venue: "Schloss Heidelberg", day: 6, date: "", time: "18:00", emoji: "🏰", cat: "Outside", grad: "from-stone-800 to-amber-900",    going: 220, vibe: "outside", hot: true,  price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "h8", title: "Harmoniegarten Sundowner", venue: "Harmoniegarten",     day: 0, date: "", time: "16:00", emoji: "🌿", cat: "Outside", grad: "from-emerald-800 to-teal-900",   going: 89,  vibe: "outside",            price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&auto=format" },
    { id: "h11", title: "Urbano — Afro, Reggaeton & Hip-Hop", venue: "halle02",        date: "Fr 24 Apr", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-teal-900",      going: 680,  vibe: "afro",   hot: true, price: "€10",  dresscode: "Fashionable", desc: "halle02's Flaggschiff-Format für Afrobeats, Reggaeton & Hip-Hop — ausverkauft in 2 Tagen", instagram: "halle02.heidelberg", website: "https://www.halle02.de", image: "https://b3310012.smushcdn.com/3310012/wp-content/uploads/2026/04/NMS-0905-3000-Assets-halle02-aspect-ratio-1920-1080.jpg?lossy=2&strip=1&webp=1" },
    { id: "h12", title: "XXL Tanz in den Mai",               venue: "halle02",        date: "Do 30 Apr", time: "21:00", emoji: "🎉", cat: "Party",   grad: "from-violet-800 to-purple-900",   going: 1100, vibe: "party",  hot: true, price: "€11",  dresscode: "Casual",      desc: "Dekade für Dekade durch die Nacht — 60s bis 2010er, jede Stunde neue Ära. 21–7 Uhr", instagram: "halle02.heidelberg", website: "https://www.halle02.de", image: "https://b3310012.smushcdn.com/3310012/wp-content/uploads/2026/03/90er-vs-2000er-Party-April26-3000er-aspect-ratio-1920-1080.jpg?lossy=2&strip=1&webp=1" },
    { id: "h13", title: "Reggaeton Anniversary",             venue: "Toniq Heidelberg",date: "Do 30 Apr", time: "23:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",      going: 290,  vibe: "latin",  hot: true, price: "€15",  dresscode: "Streetwear",  desc: "Toniq feiert 3 Jahre — Reggaeton, Salsa, Bachata. Nur Abendkasse, kein Vorverkauf", instagram: "toniq_heidelberg", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "h14", title: "Blank presents: Oppidan & Diffrent",venue: "halle02",        date: "Do 30 Apr", time: "23:00", emoji: "🎛️", cat: "Party",   grad: "from-slate-800 to-zinc-900",      going: 210,  vibe: "party",             price: "€12",  dresscode: "Casual",      desc: "Rave & Electronic mit dem Blank-Kollektiv — Oppidan & Diffrent als Headliner", instagram: "halle02.heidelberg", website: "https://www.halle02.de", image: "https://b3310012.smushcdn.com/3310012/wp-content/uploads/2026/03/halle02_3000_felix-aspect-ratio-1920-1080.jpeg?lossy=2&strip=1&webp=1" },
    { id: "h15", title: "Karlstorbahnhof Techno",            venue: "Karlstorbahnhof", date: "Do 30 Apr", time: "23:00", emoji: "🚂", cat: "Party",   grad: "from-zinc-800 to-slate-900",      going: 180,  vibe: "party",             price: "€14",  dresscode: "Dark",        desc: "YARAK & DISCOSCHORLE32 — Techno, Trance und ironische 2000er Referenzen. €10 Early Bird", instagram: "karlstorbahnhof", website: "https://www.karlstorbahnhof.de", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
    { id: "h9", title: "Heidelberger Frühling",   venue: "Stadthalle HD",      date: "So 27 Apr", time: "11:00", emoji: "🎻", cat: "Messe",   grad: "from-amber-700 to-yellow-800",  going: 520, vibe: "music",   hot: true, price: "€18", dresscode: "Smart casual", desc: "Das internationale Musikfestival mit Konzerten, Meisterkursen und Open-Air-Events am Neckar", website: "https://www.heidelberger-fruehling.de", image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=500&fit=crop&auto=format" },
    { id: "h10", title: "Heidelberg Design Fair", venue: "Print Media Academy", date: "Sa 3 Mai", time: "10:00", emoji: "🏛️", cat: "Messe",   grad: "from-slate-700 to-zinc-800",    going: 188, vibe: "outside",            price: "€6",  dresscode: "Casual",       desc: "Designmesse mit lokalen Kreativen, Vintage-Fashion und handgemachten Produkten", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=500&fit=crop&auto=format" },
  ],
  frankfurt: [
    { id: "f1", title: "Afrohouse Frankfurt",      venue: "Robert Johnson",     day: 6, date: "", time: "23:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-teal-900",     going: 280, vibe: "afro",    hot: true,  price: "€12",  dresscode: "Fashionable",  instagram: "robertjohnson_club", website: "https://www.robert-johnson.de", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop&auto=format" },
    { id: "f2", title: "Reggaeton Saturdays FFM",  venue: "King Kamehameha",    day: 6, date: "", time: "22:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 195, vibe: "latin",   hot: true,  price: "€8",   dresscode: "Streetwear",   instagram: "king.kamehameha", website: "https://www.king-kamehameha.de", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format" },
    { id: "f3", title: "Goethe Uni Party",         venue: "Club Voltaire",      day: 4, date: "", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 178, vibe: "student",            price: "€5",   dresscode: "Casual",       image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
    { id: "f4", title: "R&B Frankfurt",            venue: "Metropol",           day: 5, date: "", time: "22:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-fuchsia-800 to-pink-900",   going: 143, vibe: "hiphop",             price: "€8",   dresscode: "Streetwear",   instagram: "metropol_ffm", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop&auto=format" },
    { id: "f5", title: "Cocoon Night",             venue: "Cocoon Club",        day: 6, date: "", time: "23:00", emoji: "🔮", cat: "Party",   grad: "from-violet-900 to-black",       going: 310, vibe: "party",   hot: true,  price: "€15",  dresscode: "Dark / Techno",instagram: "cocoonclub", website: "https://www.cocoon.net", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop&auto=format" },
    { id: "f6", title: "Main Open Air",            venue: "Mainufer",           day: 0, date: "", time: "12:00", emoji: "🌅", cat: "Outside", grad: "from-amber-700 to-orange-800",   going: 520, vibe: "outside", hot: true,  price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "f7", title: "Latin x Afro Fusion",      venue: "Zoom Frankfurt",     day: 5, date: "", time: "22:00", emoji: "💃", cat: "Latin",   grad: "from-rose-800 to-orange-900",    going: 167, vibe: "latin",              price: "€9",   dresscode: "Fashionable",  image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "f8", title: "Musikmesse Frankfurt",     venue: "Messe Frankfurt",    date: "Fr 25 Apr", time: "09:00", emoji: "🎸", cat: "Messe",   grad: "from-red-800 to-rose-900",       going: 8400, vibe: "music",  hot: true, price: "€28", dresscode: "Casual", desc: "Weltgrößte Musikmesse — Instrumente, Live-Acts, Workshops von über 1.500 Ausstellern aus 50 Ländern", website: "https://musikmesse.com", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop&auto=format" },
    { id: "f9", title: "Ambiente Home & Living",   venue: "Messe Frankfurt",    date: "Mo 28 Apr", time: "09:00", emoji: "🏛️", cat: "Messe",   grad: "from-stone-700 to-zinc-800",     going: 5200, vibe: "outside",            price: "€22", dresscode: "Business", desc: "Internationale Konsumgütermesse — Wohnen, Schenken, Essen & Trinken. Tausende Aussteller, Trendshows.", website: "https://ambiente.messefrankfurt.com", image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=500&fit=crop&auto=format" },
    { id: "f10", title: "Street Food Festival FFM", venue: "Mainkai Frankfurt",  date: "Sa 3 Mai", time: "11:00", emoji: "🍜", cat: "Messe",   grad: "from-orange-700 to-amber-800",   going: 3100, vibe: "outside", hot: true, price: "Frei", dresscode: "Casual", desc: "Über 60 internationale Street Food Stände am Mainufer — Asiatisch, Latein, Medi und alles dazwischen", image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=800&h=500&fit=crop&auto=format" },
  ],
  stuttgart: [
    { id: "s1",  title: "Rave in den Mai",              venue: "Climax Institutes",     day: 4, date: "", time: "23:00", emoji: "🔊", cat: "Party",   grad: "from-violet-900 to-black",        going: 520, vibe: "party",   hot: true,  price: "€12",  dresscode: "Black",          desc: "Stuttgarts härteste Techno-Institution. Funktion-One, kein Limit bis Sonnenaufgang", instagram: "climax_stuttgart", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop&auto=format" },
    { id: "s2",  title: "Aftercito x Familia Latina",  venue: "7GradX Stuttgart",      day: 4, date: "", time: "20:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",      going: 320, vibe: "latin",   hot: true,  price: "€5",   dresscode: "Casual",         desc: "Reggaeton, Latin & Afrobeats auf 3 Floors — Stuttgart's heißeste Nacht", instagram: "7gradx_stuttgart", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "s3",  title: "Perreo Saturdays",            venue: "MICA Club",             day: 6, date: "", time: "22:00", emoji: "💃", cat: "Latin",   grad: "from-rose-800 to-pink-900",       going: 190, vibe: "latin",              price: "€9",   dresscode: "Streetwear",     desc: "MICA's Kultformat — jedes Wochenende Reggaeton ausverkauft", instagram: "micaclub_stuttgart", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format" },
    { id: "s4",  title: "Shockwerk x Feel Festival",  venue: "Fridas Pier",           day: 4, date: "",time: "23:00", emoji: "🌊", cat: "Party",   grad: "from-teal-800 to-cyan-900",       going: 380, vibe: "party",   hot: true,  price: "€16",  dresscode: "Festival",       desc: "House & Techno auf dem Wasser — das Oberdeck öffnet um 23h", instagram: "fridaspier_stgt", website: "https://www.fridas-pier.de", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop&auto=format" },
    { id: "s5",  title: "Saturdays at Perkins Park",  venue: "Perkins Park",          day: 6, date: "", time: "22:00", emoji: "🌆", cat: "Party",   grad: "from-amber-800 to-orange-900",    going: 410, vibe: "party",   hot: true,  price: "€15",  dresscode: "Smart",          desc: "Stuttgarts Premium-Club — Glasfront, Killesberg-Panorama, bis 6 Uhr früh", instagram: "perkinsparkstuttgart", website: "https://perkins-park.de", image: "https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=800&h=500&fit=crop&auto=format" },
    { id: "s6",  title: "SLICK w/ Sally C",           venue: "Lerche 22",             day: 5, date: "", time: "23:00", emoji: "🎛️", cat: "Party",   grad: "from-indigo-800 to-purple-900",   going: 165, vibe: "party",              price: "€16",  dresscode: "Casual",         desc: "Internationaler Gast-DJ trifft Stuttgarts Underground-Crowd", instagram: "lerche22_stuttgart", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
    { id: "s7",  title: "Hip-Hop Fridays",            venue: "Im Wizemann",           day: 5, date: "", time: "21:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-zinc-800 to-neutral-900",    going: 290, vibe: "hiphop",  hot: true,  price: "€12",  dresscode: "Streetwear",     desc: "Live-Venue meets Club Night — Stuttgarts beste Hip-Hop Kulisse", instagram: "imwizemann", website: "https://www.imwizemann.de", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop&auto=format" },
    { id: "s8",  title: "True Love w/ Konstantin Sibold", venue: "Kowalski Stuttgart", day: 4, date: "",time: "23:00", emoji: "🖤", cat: "Party",   grad: "from-zinc-900 to-black",          going: 240, vibe: "party",              price: "€18",  dresscode: "Dark",           desc: "Stuttgarts elegantester Elektroniksaal — Konstantin Sibold headlining", instagram: "kowalski_stgt", image: "https://images.unsplash.com/photo-1598387181032-a3103d8f5797?w=800&h=500&fit=crop&auto=format" },
    { id: "s9",  title: "I Love Reggaeton – Sunset Boat", venue: "Club-Schiff Partyfloß", day: 6, date: "Sa 16 Mai", time: "17:00", emoji: "⛵", cat: "Latin", grad: "from-red-800 to-orange-900", going: 430, vibe: "latin", hot: true, price: "€42", dresscode: "Summer", desc: "Salitos Sunset Boat — Open-Air Reggaeton auf dem Neckar bei Sonnenuntergang", instagram: "lovereggaeton", tickets: "https://www.lovereggaeton.de/", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "s10", title: "Lange Nacht der Clubs",      venue: "20+ Clubs Stuttgart",   date: "Sa 9 Mai", time: "22:00", emoji: "🌃", cat: "Party",   grad: "from-violet-800 to-fuchsia-900",  going: 3800, vibe: "party", hot: true, price: "€18", dresscode: "Anything", desc: "Eine Nacht, alle Clubs offen — 20+ Venues, ein Armband, unbegrenzt feiern", website: "https://langenachtderclubsstuttgart.de", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop&auto=format" },
    { id: "s11", title: "Romantica Fridays",          venue: "Romantica Stuttgart",   day: 5, date: "", time: "23:00", emoji: "🌹", cat: "Party",   grad: "from-rose-900 to-violet-900",     going: 175, vibe: "party",              price: "€8",   dresscode: "Chic",           desc: "Stuttgarts ikonischster Tanzboden — geht erst nach 1 Uhr wirklich los", instagram: "romantica.stgt", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=500&fit=crop&auto=format" },
    { id: "s12", title: "Schocken Opening Night",     venue: "Club Schocken",         day: 6, date: "", time: "23:00", emoji: "⚡", cat: "Party",   grad: "from-yellow-900 to-orange-950",   going: 310, vibe: "party",   hot: true,  price: "€10",  dresscode: "Casual",         desc: "Legendärer Stuttgarter Techno-Keller — low key entry, high key vibes", instagram: "clubschocken", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
  ],
  karlsruhe: [
    { id: "k1", title: "KIT Semesterparty",        venue: "Substage",           day: 5, date: "", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 220, vibe: "student", hot: true,  price: "€4",   dresscode: "Casual",       instagram: "substage_ka", website: "https://www.substage.de", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
    { id: "k2", title: "Afrobeats Karlsruhe",      venue: "Tollhaus",           day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 76,  vibe: "afro",               price: "€7",   dresscode: "Fashionable",  instagram: "tollhaus_ka", website: "https://www.tollhaus.de", image: "https://www.tollhaus.de/media/2560px-breit/20260428_klein_stefan_0067_slider_2.jpg?buster=1776677067" },
    { id: "k3", title: "Latin Night KA",           venue: "Substage",           day: 6, date: "", time: "23:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 58,  vibe: "latin",              price: "€6",   dresscode: "Streetwear",   image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "k4", title: "Kulturfestival Open Air",  venue: "Tollhaus Garten",    day: 0, date: "", time: "14:00", emoji: "🎭", cat: "Outside", grad: "from-emerald-800 to-teal-900",   going: 95,  vibe: "outside", hot: true,  price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&auto=format" },
  ],
  berlin: [
    { id: "b1",  title: "Berghain Friday",          venue: "Berghain",           day: 5, date: "", time: "00:00", emoji: "🖤", cat: "Party",   grad: "from-zinc-900 to-black",          going: 2800, vibe: "party",   hot: true,  price: "€20–25", dresscode: "Black only",      desc: "The world's most iconic club — Funktion-One, 3 floors, no photos, no tourist vibes", instagram: "berghain_official", website: "https://berghain.berlin", image: "https://cdn.berghain.berlin/media/images/berghain-april-HEADER-2000x800_Fl.2e16d0ba.fill-1000x400.jpg" },
    { id: "b2",  title: "Watergate Saturday",       venue: "Watergate",          day: 6, date: "", time: "23:00", emoji: "🌊", cat: "Party",   grad: "from-blue-900 to-teal-950",       going: 1100, vibe: "party",   hot: true,  price: "€15",    dresscode: "Dark",            desc: "Spree-facing floor-to-ceiling windows — best sunrise of Berlin", instagram: "watergateclubberlin", website: "https://water-gate.de", image: "https://water-gate.de/wp-content/uploads/2026/03/title.png" },
    { id: "b3",  title: "Tresor Saturday",          venue: "Tresor",             day: 6, date: "", time: "23:00", emoji: "⚙️", cat: "Party",   grad: "from-zinc-800 to-zinc-950",       going: 950,  vibe: "party",   hot: true,  price: "€20–30", dresscode: "Techno",          desc: "Berlin's original techno bunker — vault floor, industrial concrete, no compromise", instagram: "tresor_berlin", website: "https://tresorberlin.com", image: "https://tresorberlin.com/wp-content/uploads/2021/02/about-e1627478075677.png" },
    { id: "b4",  title: "Sisyphos Weekend",         venue: "Sisyphos",           day: 6, date: "", time: "22:00", emoji: "🏕️", cat: "Outside", grad: "from-emerald-800 to-teal-900",    going: 1800, vibe: "outside", hot: true,  price: "€15",    dresscode: "Festival",        desc: "Open-air festival club — hammerhalle, disko, outdoor stages. Opens Fri, closes Mon", instagram: "sisyphos_berlin", website: "https://sisyphos-berlin.net", image: "https://sisyphos-berlin.net/wp-content/uploads/2026/03/URSO-c-Randolfe-Camarotto-9-scaled.jpg" },
    { id: "b5",  title: "Wilde Renate House Night", venue: "Wilde Renate",       day: 6, date: "", time: "23:00", emoji: "🌿", cat: "Party",   grad: "from-violet-800 to-fuchsia-900",  going: 650,  vibe: "party",              price: "€12",    dresscode: "Colourful",       desc: "Multi-room labyrinth in a converted house — quirky, underground, authentic Berlin", instagram: "wilde_renate", image: "https://cdn.berghain.berlin/media/images/Halle_Square_bw.width-300.jpg" },
    { id: "b6",  title: "About Blank Queer Rave",   venue: "About Blank",        day: 5, date: "", time: "23:00", emoji: "🌈", cat: "Party",   grad: "from-rose-800 to-pink-900",       going: 480,  vibe: "party",              price: "€10",    dresscode: "Anything goes",   desc: "Berlin's most inclusive dancefloor — queer, safe, no dress code police", instagram: "aboutblank_berlin", image: "https://sisyphos-berlin.net/wp-content/uploads/2026/03/PUNKROCKPIANO-1024x683.jpg" },
    { id: "b7",  title: "Prince Charles House",     venue: "Prince Charles",     day: 4, date: "", time: "23:00", emoji: "🎛️", cat: "Party",   grad: "from-indigo-800 to-blue-900",     going: 380,  vibe: "party",              price: "€10",    dresscode: "Casual",          desc: "Former swimming pool turned intimate club — Kreuzberg underground house & techno", instagram: "prince_charles_berlin", image: "https://cdn.berghain.berlin/media/images/DSC00792.2e16d0ba.fill-200x200.jpg" },
    { id: "b8",  title: "Afrobeats Berlin Night",   venue: "Yaam Club",          day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",   going: 520,  vibe: "afro",    hot: true,  price: "€8",     dresscode: "Fashionable",     desc: "Beachclub on the Spree — Afrobeats, Dancehall and open-air vibes", instagram: "yaambeach", website: "https://yaam.de", image: "https://yaam.de/wp-content/uploads/2023/08/yaam_header_001.jpg" },
  ],
  munich: [
    { id: "mu1", title: "Harry Klein Friday",       venue: "Harry Klein",        day: 5, date: "", time: "23:00", emoji: "🔊", cat: "Party",   grad: "from-violet-900 to-black",        going: 680,  vibe: "party",   hot: true,  price: "€15–20", dresscode: "Black",           desc: "Munich's best techno club — intimate, Funktion-One, no tourists. Expect a queue", instagram: "harry_klein_munich", website: "https://harry-klein.de", image: "https://www.blitz.club/wp-content/uploads/2025/09/IMG_1355-Kopie-285x285.jpg" },
    { id: "mu2", title: "Rote Sonne Saturday",      venue: "Rote Sonne",         day: 6, date: "", time: "23:00", emoji: "🔴", cat: "Party",   grad: "from-red-900 to-rose-950",        going: 450,  vibe: "party",   hot: true,  price: "€12",    dresscode: "Dark",            desc: "Munich's oldest electronic club — low ceilings, 300 cap, legendary crowd", instagram: "rotesonne", website: "https://rote-sonne.com", image: "https://www.blitz.club/wp-content/uploads/2025/12/BlitzLive_2025_Dario2-285x285.jpg" },
    { id: "mu3", title: "P1 Premium Saturday",      venue: "P1 Munich",          day: 6, date: "", time: "22:00", emoji: "💎", cat: "Party",   grad: "from-amber-800 to-orange-900",    going: 820,  vibe: "party",   hot: true,  price: "€20",    dresscode: "Smart / No Sneakers",desc: "Munich's most exclusive club — Maximilianeum, strict door, celeb sightings", instagram: "p1munich", image: "https://perkins-park.de/wp-content/uploads/2026/03/Familiendisco1200x600_0706.png" },
    { id: "mu4", title: "Muffatwerk Electronic",    venue: "Muffatwerk",         day: 5, date: "", time: "22:00", emoji: "🏭", cat: "Party",   grad: "from-zinc-800 to-slate-900",      going: 390,  vibe: "party",              price: "€15",    dresscode: "Casual",          desc: "Converted power plant — indoor & outdoor, eclectic programming, riverside location", instagram: "muffatwerk", website: "https://www.muffatwerk.de", image: "https://sisyphos-berlin.net/wp-content/uploads/2026/03/VON.ORTEN_.jpg" },
    { id: "mu5", title: "Blitz Techno Friday",      venue: "Blitz Club",         day: 5, date: "", time: "23:00", emoji: "⚡", cat: "Party",   grad: "from-yellow-900 to-orange-950",   going: 520,  vibe: "party",   hot: true,  price: "€15",    dresscode: "Techno",          desc: "Underground bunker below a shopping centre — serious techno, no posing", instagram: "blitz_munich", website: "https://blitz.club", image: "https://www.blitz.club/wp-content/uploads/2026/04/Webposter_BLITZ_2026_April_01-750x1056.jpg" },
    { id: "mu6", title: "Latin x Afro Night MUC",   venue: "MMA Club",           day: 6, date: "", time: "22:00", emoji: "🔥", cat: "Afro",    grad: "from-orange-800 to-red-900",      going: 310,  vibe: "afro",    hot: true,  price: "€10",    dresscode: "Fashionable",     desc: "Munich's hottest Latin & Afrobeats night — 2 floors, all vibes", instagram: "mmaclub_munich", image: "https://yaam.de/wp-content/uploads/2023/10/yaam_eventt2_005.jpg" },
    { id: "mu7", title: "Atomic Café Indie Night",  venue: "Atomic Café",        day: 5, date: "", time: "22:00", emoji: "🎸", cat: "Live",    grad: "from-pink-800 to-rose-900",       going: 240,  vibe: "music",              price: "€8",     dresscode: "Casual",          desc: "Iconic Munich indie club — retro design, real music lovers, no mainstream BS", instagram: "atomic_cafe_munich", image: "https://yaam.de/wp-content/uploads/2023/10/yaam_eventt1_003.jpg" },
  ],
  cologne: [
    { id: "c1",  title: "Bootshaus Saturday",       venue: "Bootshaus",          day: 6, date: "", time: "23:00", emoji: "⛵", cat: "Party",   grad: "from-violet-900 to-black",        going: 1600, vibe: "party",   hot: true,  price: "€15–25", dresscode: "Techno",          desc: "World-class techno on 3 floors — voted best club in Germany. 90-min queue normal", instagram: "bootshaus_cologne", website: "https://www.bootshaus.tv", image: "https://s3.eu-central-1.amazonaws.com/cdn.pixend.de/CQYDNRZ9Q8QSS8D/media/Rungang_BH_new_2400x1200_525508085688172.jpg" },
    { id: "c2",  title: "CBE Club Friday",          venue: "Club Bahnhof Ehrenfeld", day: 5, date: "", time: "23:00", emoji: "🚂", cat: "Party",   grad: "from-zinc-800 to-slate-900",      going: 580,  vibe: "party",   hot: true,  price: "€10",    dresscode: "Casual",          desc: "Under the S-Bahn in Ehrenfeld — local techno and house, best sound in Cologne", instagram: "cbe_cologne", image: "https://s3.eu-central-1.amazonaws.com/cdn.pixend.de/CQYDNRZ9Q8QSS8D/gallery/3395305257161665912301887_7967216836418295496227325.jpeg" },
    { id: "c3",  title: "Yuca Latin Night",         venue: "Yuca Club",          day: 6, date: "", time: "22:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",      going: 920,  vibe: "latin",   hot: true,  price: "€12",    dresscode: "Streetwear",      desc: "1,500-cap Latin fortress in Ehrenfeld — Reggaeton, Bachata, Salsa. Get there early", instagram: "yuca_cologne", image: "https://s3.eu-central-1.amazonaws.com/cdn.pixend.de/CQYDNRZ9Q8QSS8D/gallery/9492774321784289392296429_1672994892345807243142462.jpeg" },
    { id: "c4",  title: "Gewölbe Electronic",       venue: "Gewölbe",            day: 6, date: "", time: "23:00", emoji: "🔮", cat: "Party",   grad: "from-indigo-800 to-purple-900",   going: 360,  vibe: "party",              price: "€10",    dresscode: "Dark",            desc: "Kalk's underground gem — relaxed door, good underground techno, no attitude", instagram: "gewoelbe_cologne", image: "https://s3.eu-central-1.amazonaws.com/cdn.pixend.de/CQYDNRZ9Q8QSS8D/gallery/1235417333943990394798223_7733062430259535474143462.jpeg" },
    { id: "c5",  title: "Odonien Open Air",         venue: "Odonien",            day: 0, date: "", time: "16:00", emoji: "🌿", cat: "Outside", grad: "from-emerald-800 to-teal-900",    going: 700,  vibe: "outside", hot: true,  price: "€8",     dresscode: "Festival",        desc: "Industrial sculpture garden turned open-air — only in summer, magical vibe", instagram: "odonien_koeln", image: "https://s3.eu-central-1.amazonaws.com/cdn.pixend.de/CQYDNRZ9Q8QSS8D/gallery/3689959145752154456922302_2283519875193106314700174.jpeg" },
    { id: "c6",  title: "Stadtgarten Jazz Night",   venue: "Stadtgarten",        day: 5, date: "", time: "20:00", emoji: "🎷", cat: "Live",    grad: "from-amber-800 to-orange-900",    going: 210,  vibe: "music",              price: "€15",    dresscode: "Smart casual",    desc: "Cologne's best jazz & world music venue — intimate hall + biergarten", instagram: "stadtgarten_koeln", website: "https://www.stadtgarten.de", image: "https://s3.eu-central-1.amazonaws.com/cdn.pixend.de/CQYDNRZ9Q8QSS8D/news/7521377512372910890540056_5799251604015692911232386.jpeg" },
    { id: "c7",  title: "Afrobeats Cologne",        venue: "Luxor Cologne",      day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",   going: 430,  vibe: "afro",    hot: true,  price: "€10",    dresscode: "Fashionable",     desc: "Ehrenfeld's best Afrobeats and Amapiano night — sweat and good energy", instagram: "luxor_cologne", image: "https://s3.eu-central-1.amazonaws.com/cdn.pixend.de/CQYDNRZ9Q8QSS8D/gallery/8881740552461014376487147_3441333055445871212200266.jpeg" },
  ],
}

// ─── Open now ─────────────────────────────────────────────────────────────────
const OPEN_NOW: Record<string, { name: string; area: string; type: string; emoji: string; opens: number; closes: number; hot: boolean; vibe: string }[]> = {
  mannheim: [
    { name: "Hemingway Bar",         area: "Innenstadt",  type: "Bar",      emoji: "🍸", opens: 18, closes: 26, hot: false, vibe: "chill" },
    { name: "Ella & Louis",          area: "Jungbusch",   type: "Jazz",     emoji: "🎷", opens: 19, closes: 25, hot: true,  vibe: "music" },
    { name: "Skybar Mannheim",       area: "Quadrate",    type: "Rooftop",  emoji: "🏙️", opens: 18, closes: 25, hot: true,  vibe: "outside" },
    { name: "Tapas Bar",             area: "P-Quadrate",  type: "Bar",      emoji: "🫒", opens: 17, closes: 25, hot: false, vibe: "chill" },
    { name: "Weinkeller Wasserturm", area: "Wasserturm",  type: "Wine bar", emoji: "🍷", opens: 18, closes: 24, hot: false, vibe: "chill" },
    { name: "Alte Feuerwache",       area: "Jungbusch",   type: "Culture",  emoji: "🎭", opens: 18, closes: 24, hot: false, vibe: "music" },
    { name: "Tiffany Club",          area: "C-Quadrat",   type: "Club",     emoji: "💜", opens: 22, closes: 30, hot: true,  vibe: "party" },
    { name: "MS Connexion",          area: "Hafen",       type: "Club",     emoji: "🎧", opens: 22, closes: 29, hot: true,  vibe: "afro" },
    { name: "BASE Club",             area: "Jungbusch",   type: "Club",     emoji: "🔊", opens: 22, closes: 29, hot: true,  vibe: "latin" },
    { name: "Zeitraumexit",          area: "Jungbusch",   type: "Club",     emoji: "🖤", opens: 23, closes: 30, hot: false, vibe: "hiphop" },
  ],
  heidelberg: [
    { name: "halle02",               area: "Bahnstadt",   type: "Club",     emoji: "🏭", opens: 22, closes: 30, hot: true,  vibe: "afro" },
    { name: "Cave 54",               area: "Altstadt",    type: "Club",     emoji: "🎸", opens: 22, closes: 30, hot: true,  vibe: "student" },
    { name: "Nachtschicht",          area: "Bergheim",    type: "Club",     emoji: "🎶", opens: 22, closes: 30, hot: false, vibe: "latin" },
    { name: "Destille",              area: "Altstadt",    type: "Bar",      emoji: "🍺", opens: 18, closes: 26, hot: false, vibe: "chill" },
    { name: "Schloss Biergarten",    area: "Schloss",     type: "Outside",  emoji: "🏰", opens: 11, closes: 22, hot: true,  vibe: "outside" },
  ],
  frankfurt: [
    { name: "Robert Johnson",        area: "Offenbach",   type: "Club",     emoji: "🎛️", opens: 23, closes: 32, hot: true,  vibe: "afro" },
    { name: "King Kamehameha",       area: "Sachsenhausen",type:"Club",     emoji: "🌴", opens: 22, closes: 30, hot: true,  vibe: "latin" },
    { name: "Cocoon Club",           area: "Messe",       type: "Club",     emoji: "🔮", opens: 23, closes: 32, hot: true,  vibe: "party" },
    { name: "Jazzkeller",            area: "Innenstadt",  type: "Jazz",     emoji: "🎺", opens: 20, closes: 28, hot: false, vibe: "music" },
    { name: "Main Tower Lounge",     area: "Bankenviertel",type:"Rooftop",  emoji: "🌆", opens: 18, closes: 25, hot: true,  vibe: "outside" },
    { name: "Metropol",              area: "Sachsenhausen",type:"Club",     emoji: "🎉", opens: 22, closes: 30, hot: false, vibe: "hiphop" },
  ],
  stuttgart: [
    { name: "Perkins Park",          area: "Killesberg",  type: "Club",     emoji: "🌆", opens: 22, closes: 30, hot: true,  vibe: "party" },
    { name: "Climax Institutes",     area: "Schlossgarten",type: "Club",    emoji: "🔊", opens: 23, closes: 32, hot: true,  vibe: "party" },
    { name: "Im Wizemann",           area: "Feuerbach",   type: "Live/Club",emoji: "🎤", opens: 21, closes: 27, hot: true,  vibe: "hiphop" },
    { name: "7GradX Stuttgart",      area: "West",        type: "Club",     emoji: "🔥", opens: 20, closes: 28, hot: false, vibe: "latin" },
    { name: "MICA Club",             area: "Innenstadt",  type: "Club",     emoji: "💃", opens: 22, closes: 28, hot: false, vibe: "latin" },
    { name: "Fridas Pier",           area: "Neckarufer",  type: "Club",     emoji: "🌊", opens: 23, closes: 29, hot: false, vibe: "party" },
    { name: "Kowalski Stuttgart",    area: "Süd",         type: "Club",     emoji: "🖤", opens: 23, closes: 30, hot: false, vibe: "party" },
  ],
  karlsruhe: [
    { name: "Substage",              area: "Südstadt",    type: "Club",     emoji: "🎸", opens: 21, closes: 30, hot: true,  vibe: "student" },
    { name: "Tollhaus",              area: "Oststadt",    type: "Culture",  emoji: "🎭", opens: 19, closes: 26, hot: false, vibe: "afro" },
    { name: "Hemingway KA",          area: "Innenstadt",  type: "Bar",      emoji: "🍸", opens: 18, closes: 25, hot: false, vibe: "chill" },
    { name: "Kühler Krug",           area: "Günther-K.",  type: "Garden",   emoji: "🌿", opens: 15, closes: 23, hot: false, vibe: "outside" },
  ],
  berlin: [
    { name: "Berghain",              area: "Friedrichshain",type: "Club",    emoji: "🖤", opens: 24, closes: 36, hot: true,  vibe: "party" },
    { name: "Watergate",             area: "Kreuzberg",   type: "Club",     emoji: "🌊", opens: 23, closes: 34, hot: true,  vibe: "party" },
    { name: "Tresor",                area: "Mitte",       type: "Club",     emoji: "⚙️", opens: 23, closes: 36, hot: true,  vibe: "party" },
    { name: "Sisyphos",              area: "Rummelsburg", type: "Open Air", emoji: "🏕️", opens: 22, closes: 36, hot: true,  vibe: "outside" },
    { name: "Wilde Renate",          area: "Friedrichshain",type: "Club",   emoji: "🌿", opens: 23, closes: 34, hot: false, vibe: "party" },
    { name: "About Blank",           area: "Kreuzberg",   type: "Club",     emoji: "🌈", opens: 23, closes: 34, hot: false, vibe: "party" },
    { name: "Yaam Club",             area: "Mitte",       type: "Beach",    emoji: "🌍", opens: 22, closes: 30, hot: true,  vibe: "afro" },
  ],
  munich: [
    { name: "Harry Klein",           area: "Innenstadt",  type: "Club",     emoji: "🔊", opens: 23, closes: 34, hot: true,  vibe: "party" },
    { name: "Rote Sonne",            area: "Maximiliansp.",type: "Club",    emoji: "🔴", opens: 23, closes: 34, hot: true,  vibe: "party" },
    { name: "P1 Munich",             area: "Maximilianeum",type:"Club",     emoji: "💎", opens: 22, closes: 30, hot: true,  vibe: "party" },
    { name: "Muffatwerk",            area: "Haidhausen",  type: "Venue",    emoji: "🏭", opens: 22, closes: 28, hot: false, vibe: "party" },
    { name: "Blitz Club",            area: "Innenstadt",  type: "Club",     emoji: "⚡", opens: 23, closes: 34, hot: true,  vibe: "party" },
    { name: "MMA Club",              area: "Innenstadt",  type: "Club",     emoji: "🔥", opens: 22, closes: 30, hot: false, vibe: "afro" },
  ],
  cologne: [
    { name: "Bootshaus",             area: "Deutz",       type: "Club",     emoji: "⛵", opens: 23, closes: 36, hot: true,  vibe: "party" },
    { name: "Club Bahnhof Ehrenfeld",area: "Ehrenfeld",   type: "Club",     emoji: "🚂", opens: 23, closes: 34, hot: true,  vibe: "party" },
    { name: "Yuca Club",             area: "Ehrenfeld",   type: "Club",     emoji: "🔥", opens: 22, closes: 30, hot: true,  vibe: "latin" },
    { name: "Gewölbe",               area: "Kalk",        type: "Club",     emoji: "🔮", opens: 23, closes: 34, hot: false, vibe: "party" },
    { name: "Stadtgarten",           area: "Innenstadt",  type: "Jazz",     emoji: "🎷", opens: 20, closes: 28, hot: false, vibe: "music" },
    { name: "Odonien",               area: "Ehrenfeld",   type: "Open Air", emoji: "🌿", opens: 16, closes: 26, hot: true,  vibe: "outside" },
  ],
}

// ─── Venues ───────────────────────────────────────────────────────────────────
const VENUES_BY_CITY: Record<string, { id: string; name: string; area: string; type: string; emoji: string; tag: string; vibe: string }[]> = {
  mannheim: [
    // Clubs
    { id: "ms-connexion",   name: "MS Connexion",        area: "Hafen",       type: "Club",        emoji: "🎧", tag: "Afro · Electronic",   vibe: "afro"    },
    { id: "base-club",      name: "BASE Club",           area: "Jungbusch",   type: "Club",        emoji: "🔊", tag: "Latin · Bass",         vibe: "latin"   },
    { id: "tiffany",        name: "Tiffany Club",        area: "C-Quadrat",   type: "Club",        emoji: "💜", tag: "Party · Premium",      vibe: "party"   },
    { id: "zeitraumexit",   name: "Zeitraumexit",        area: "Jungbusch",   type: "Club",        emoji: "🖤", tag: "Hip-Hop · Underground",vibe: "hiphop"  },
    { id: "7grad",          name: "7Grad",               area: "Jungbusch",   type: "Club",        emoji: "❄️", tag: "Techno · Underground", vibe: "party"   },
    { id: "alte-feuerwache",name: "Alte Feuerwache",     area: "Jungbusch",   type: "Culture",     emoji: "🎭", tag: "Afro · Live",          vibe: "afro"    },
    // Hidden bars — Geheimtipps
    { id: "kaizen",         name: "Kaizen",              area: "Innenstadt",  type: "Cocktail bar",emoji: "🍸", tag: "🔒 Hidden · Cocktails", vibe: "chill"   },
    { id: "zephyr",         name: "ZEPHYR Bar",          area: "Quadrate",    type: "Bar",         emoji: "🌬️", tag: "🔒 Hidden · Vibes",    vibe: "chill"   },
    { id: "plan-b",         name: "Plan B",              area: "Jungbusch",   type: "Bar",         emoji: "🎲", tag: "Local · Underground",  vibe: "chill"   },
    { id: "galerie-kurzzeit",name: "Galerie Kurzzeit",   area: "Jungbusch",   type: "Bar/Gallery", emoji: "🎨", tag: "Art · Late Night",      vibe: "chill"   },
    // Outdoor & live
    { id: "strandbar",      name: "Strandbar Rennwiese", area: "Rennwiese",   type: "Beach bar",   emoji: "🏖️", tag: "Outdoor · Summer",     vibe: "outside" },
    { id: "ella-louis",     name: "Ella & Louis",        area: "Jungbusch",   type: "Jazz bar",    emoji: "🎷", tag: "Jazz · Intimate",      vibe: "music"   },
    { id: "capitol",        name: "Capitol Mannheim",    area: "Innenstadt",  type: "Live venue",  emoji: "🎸", tag: "Concerts · Live",      vibe: "music"   },
    { id: "hemingway",      name: "Hemingway Bar",       area: "Innenstadt",  type: "Bar",         emoji: "🍹", tag: "Cocktails · Date",     vibe: "chill"   },
    { id: "weinkeller",     name: "Weinkeller Wasserturm",area:"Wasserturm",  type: "Wine bar",    emoji: "🍷", tag: "Wine · Upscale",       vibe: "chill"   },
  ],
  heidelberg: [
    { id: "halle02",        name: "halle02",             area: "Bahnstadt",   type: "Club",        emoji: "🏭", tag: "Afro · Electronic",   vibe: "afro"    },
    { id: "cave-54",        name: "Cave 54",             area: "Altstadt",    type: "Club",        emoji: "🎸", tag: "Student · Rock",      vibe: "student" },
    { id: "nachtschicht",   name: "Nachtschicht",        area: "Bergheim",    type: "Club",        emoji: "🎶", tag: "Latin · Electronic",  vibe: "latin"   },
    { id: "obrien",         name: "O'Brien's",           area: "Altstadt",    type: "Irish pub",   emoji: "🍺", tag: "Student · Chill",     vibe: "student" },
    { id: "billy-blues",    name: "Billy Blues",         area: "Altstadt",    type: "Music bar",   emoji: "🎸", tag: "Live Music · Rock",   vibe: "music"   },
    { id: "tangente",       name: "Tangente",            area: "Innenstadt",  type: "Bar",         emoji: "🌙", tag: "🔒 Hidden · Late",     vibe: "chill"   },
    { id: "green-apple",    name: "Green Apple",         area: "Altstadt",    type: "Bar",         emoji: "🍏", tag: "Student · Cocktails", vibe: "chill"   },
    { id: "destille",       name: "Destille",            area: "Altstadt",    type: "Bar",         emoji: "🥃", tag: "Classic · Local",     vibe: "chill"   },
    { id: "harmoniegarten", name: "Harmoniegarten",      area: "Weststadt",   type: "Garden bar",  emoji: "🌿", tag: "Outdoor · Chill",     vibe: "outside" },
    { id: "schloss-bg",     name: "Schloss Biergarten",  area: "Schloss",     type: "Outside",     emoji: "🏰", tag: "Views · Beer garden", vibe: "outside" },
  ],
  frankfurt: [
    { id: "robert-johnson", name: "Robert Johnson",      area: "Offenbach",   type: "Club",     emoji: "🎛️", tag: "Afrohouse · Techno",vibe: "afro"    },
    { id: "king-k",         name: "King Kamehameha",     area: "Sachsenhausen",type:"Club",     emoji: "🌴", tag: "Latin · Reggaeton", vibe: "latin"   },
    { id: "cocoon",         name: "Cocoon Club",         area: "Messe",       type: "Club",     emoji: "🔮", tag: "Electronic · Party",vibe: "party"   },
    { id: "metropol-ffm",   name: "Metropol",            area: "Sachsenhausen",type:"Club",     emoji: "🎉", tag: "Hip-Hop · R&B",     vibe: "hiphop"  },
    { id: "jazzkeller-ffm", name: "Jazzkeller",          area: "Innenstadt",  type: "Jazz",     emoji: "🎺", tag: "Jazz · Live",       vibe: "music"   },
    { id: "main-tower",     name: "Main Tower Lounge",   area: "Bankenviertel",type:"Rooftop",  emoji: "🌆", tag: "Views · Cocktails", vibe: "outside" },
  ],
  stuttgart: [
    { id: "perkins-park",   name: "Perkins Park",        area: "Killesberg",   type: "Club",        emoji: "🌆", tag: "Premium · Party",      vibe: "party"   },
    { id: "climax",         name: "Climax Institutes",   area: "Schlossgarten",type: "Club",        emoji: "🔊", tag: "Techno · Hard",         vibe: "party"   },
    { id: "im-wizemann",    name: "Im Wizemann",         area: "Feuerbach",    type: "Live / Club", emoji: "🎤", tag: "Hip-Hop · Live",        vibe: "hiphop"  },
    { id: "7gradx",         name: "7GradX Stuttgart",    area: "West",         type: "Club",        emoji: "🔥", tag: "Latin · Afrobeats",     vibe: "latin"   },
    { id: "mica-club",      name: "MICA Club",           area: "Innenstadt",   type: "Club",        emoji: "💃", tag: "Reggaeton · Latin",     vibe: "latin"   },
    { id: "fridas-pier",    name: "Fridas Pier",         area: "Neckarufer",   type: "Club/outdoor",emoji: "🌊", tag: "House · Open Air",      vibe: "party"   },
    { id: "kowalski",       name: "Kowalski Stuttgart",  area: "Süd",          type: "Club",        emoji: "🖤", tag: "Electronic · Minimal",  vibe: "party"   },
    { id: "romantica",      name: "Romantica",           area: "Mitte",        type: "Club",        emoji: "🌹", tag: "Dance · Iconic",        vibe: "party"   },
    { id: "schocken",       name: "Club Schocken",       area: "Innenstadt",   type: "Club",        emoji: "⚡", tag: "Techno · Underground",  vibe: "party"   },
    { id: "lerche22",       name: "Lerche 22",           area: "Innenstadt",   type: "Club",        emoji: "🎛️", tag: "House · International", vibe: "party"   },
    { id: "lka-longhorn",   name: "LKA Longhorn",        area: "Wangen",       type: "Live venue",  emoji: "🎸", tag: "Concerts · Live",       vibe: "music"   },
    { id: "bix-jazzclub",   name: "BIX Jazzclub",        area: "Innenstadt",   type: "Jazz club",   emoji: "🎺", tag: "Jazz · 🔒 Hidden",      vibe: "music"   },
  ],
  karlsruhe: [
    { id: "substage",       name: "Substage",            area: "Südstadt",    type: "Club",     emoji: "🎸", tag: "Student · Live",    vibe: "student" },
    { id: "tollhaus",       name: "Tollhaus",            area: "Oststadt",    type: "Culture",  emoji: "🎭", tag: "Afro · Culture",    vibe: "afro"    },
    { id: "hemingway-ka",   name: "Hemingway KA",        area: "Innenstadt",  type: "Bar",      emoji: "🍸", tag: "Cocktails · Chill", vibe: "chill"   },
    { id: "kuhler-krug",    name: "Kühler Krug",         area: "Günther-K.",  type: "Garden",   emoji: "🌿", tag: "Beer garden",       vibe: "outside" },
  ],
  berlin: [
    { id: "berghain",      name: "Berghain",            area: "Friedrichshain", type: "Club",     emoji: "🖤", tag: "Techno · Iconic",      vibe: "party"  },
    { id: "watergate",     name: "Watergate",           area: "Kreuzberg",      type: "Club",     emoji: "🌊", tag: "House · Spree view",   vibe: "party"  },
    { id: "tresor",        name: "Tresor",              area: "Mitte",          type: "Club",     emoji: "⚙️", tag: "Techno · Legendary",  vibe: "party"  },
    { id: "sisyphos",      name: "Sisyphos",            area: "Rummelsburg",    type: "Open Air", emoji: "🏕️", tag: "Festival · Weekend",  vibe: "outside" },
    { id: "wilde-renate",  name: "Wilde Renate",        area: "Friedrichshain", type: "Club",     emoji: "🌿", tag: "House · Quirky",       vibe: "party"  },
    { id: "about-blank",   name: "About Blank",         area: "Kreuzberg",      type: "Club",     emoji: "🌈", tag: "Queer · Inclusive",    vibe: "party"  },
    { id: "kitkat",        name: "KitKatClub",          area: "Mitte",          type: "Club",     emoji: "🐱", tag: "Fetish · Electronic",  vibe: "party"  },
    { id: "prince-charles",name: "Prince Charles",      area: "Kreuzberg",      type: "Club",     emoji: "🎛️", tag: "House · Pool club",   vibe: "party"  },
    { id: "yaam",          name: "Yaam Club",           area: "Mitte",          type: "Beach",    emoji: "🌍", tag: "Afrobeats · Outdoor",  vibe: "afro"   },
    { id: "five-elephant", name: "Five Elephant",       area: "Kreuzberg",      type: "Café",     emoji: "☕", tag: "Specialty · Brunch",  vibe: "chill"  },
  ],
  munich: [
    { id: "harry-klein",   name: "Harry Klein",         area: "Innenstadt",     type: "Club",     emoji: "🔊", tag: "Techno · Intimate",    vibe: "party"  },
    { id: "rote-sonne",    name: "Rote Sonne",          area: "Maximiliansp.",  type: "Club",     emoji: "🔴", tag: "Electronic · Classic", vibe: "party"  },
    { id: "p1-munich",     name: "P1 Munich",           area: "Maximilianeum",  type: "Club",     emoji: "💎", tag: "Exclusive · Premium",  vibe: "party"  },
    { id: "muffatwerk",    name: "Muffatwerk",          area: "Haidhausen",     type: "Venue",    emoji: "🏭", tag: "Eclectic · Riverside", vibe: "party"  },
    { id: "blitz-munich",  name: "Blitz Club",          area: "Innenstadt",     type: "Club",     emoji: "⚡", tag: "Techno · Bunker",     vibe: "party"  },
    { id: "backstage",     name: "Club Backstage",      area: "Neuhausen",      type: "Club",     emoji: "🎸", tag: "Rock · Live",          vibe: "music"  },
    { id: "mma-club",      name: "MMA Club",            area: "Innenstadt",     type: "Club",     emoji: "🔥", tag: "Latin · Afrobeats",   vibe: "afro"   },
    { id: "atomic-cafe",   name: "Atomic Café",         area: "Innenstadt",     type: "Club",     emoji: "🎸", tag: "Indie · Retro",        vibe: "music"  },
  ],
  cologne: [
    { id: "bootshaus",     name: "Bootshaus",           area: "Deutz",          type: "Club",     emoji: "⛵", tag: "Techno · World-class", vibe: "party"  },
    { id: "cbe",           name: "Club Bahnhof Ehrenfeld", area: "Ehrenfeld",   type: "Club",     emoji: "🚂", tag: "Techno · Underground", vibe: "party"  },
    { id: "yuca-cologne",  name: "Yuca Club",           area: "Ehrenfeld",      type: "Club",     emoji: "🔥", tag: "Latin · 1500 cap",    vibe: "latin"  },
    { id: "gewoelbe",      name: "Gewölbe",             area: "Kalk",           type: "Club",     emoji: "🔮", tag: "House · Chill door",  vibe: "party"  },
    { id: "odonien",       name: "Odonien",             area: "Ehrenfeld",      type: "Open Air", emoji: "🌿", tag: "Outdoor · Sculpture", vibe: "outside" },
    { id: "stadtgarten",   name: "Stadtgarten",         area: "Innenstadt",     type: "Jazz",     emoji: "🎷", tag: "Jazz · World music",  vibe: "music"  },
    { id: "luxor-cologne", name: "Luxor Cologne",       area: "Ehrenfeld",      type: "Club",     emoji: "🌍", tag: "Afrobeats · Energy",  vibe: "afro"   },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getH() { const h = new Date().getHours(); return h < 6 ? h + 24 : h }

function toSlug(name: string) {
  return name.toLowerCase().replace(/[&]/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const GRAD_BY_CAT: Record<string, string> = {
  Afro:    "from-green-800 to-emerald-900",
  Latin:   "from-orange-800 to-red-900",
  "Hip-Hop":"from-zinc-800 to-neutral-900",
  Uni:     "from-blue-800 to-indigo-900",
  Party:   "from-violet-800 to-purple-900",
  Chill:   "from-stone-800 to-zinc-900",
  Live:    "from-amber-800 to-orange-900",
  Outside: "from-emerald-800 to-teal-900",
  Messe:   "from-yellow-700 to-orange-800",
  Event:   "from-zinc-800 to-neutral-900",
}

// ─── Share ────────────────────────────────────────────────────────────────────
function ShareEvent({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen]     = useState(false)
  const [shareUrl, setShareUrl] = useState(url ?? "")
  useEffect(() => { if (!url) setShareUrl(window.location.href) }, [url])
  const text     = `${title} — found on Szene 🎉`

  function copyLink() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
    setOpen(false)
  }
  function wa() { window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + shareUrl)}`, "_blank"); setOpen(false) }

  return (
    <div className="relative flex-shrink-0">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1 text-xs text-faint hover:text-muted transition-colors px-2 py-1 rounded-lg hover:bg-surface">
        <Share2 className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-1 bg-szene border border-szene rounded-xl shadow-2xl overflow-hidden z-50 min-w-[140px]" style={{ boxShadow: "var(--shadow)" }}>
          <button onClick={wa} className="w-full text-left px-3 py-2.5 text-xs text-muted hover:text-szene hover:bg-surface flex items-center gap-2 transition-colors">
            <span>💬</span> WhatsApp
          </button>
          <button onClick={copyLink} className="w-full text-left px-3 py-2.5 text-xs text-muted hover:text-szene hover:bg-surface flex items-center gap-2 border-t border-szene transition-colors">
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Vibe bar ─────────────────────────────────────────────────────────────────
function VibeBar({ vibe, setVibe }: { vibe: string; setVibe: (v: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
      {VIBES.map(v => (
        <button key={v.id} onClick={() => setVibe(v.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-semibold transition-all ${
            vibe === v.id ? "vibe-active" : "vibe-inactive"
          }`}>
          <span>{v.emoji}</span>
          {v.label}
        </button>
      ))}
    </div>
  )
}

// ─── Event card ───────────────────────────────────────────────────────────────
function EventCard({ e, going, onToggle, user, city, followed, onFollow }: {
  e: EventItem; going: boolean; onToggle: () => void; user: any; city?: string
  followed?: boolean; onFollow?: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const mapQuery     = encodeURIComponent(`${e.venue}${city ? `, ${city}` : ""}`)

  function handleExpand() {
    if (!expanded) trackEventView()
    setExpanded(x => !x)
  }
  const parkingQuery = encodeURIComponent(`parking near ${e.venue}${city ? `, ${city}` : ""}`)
  return (
    <div className="szene-card group overflow-hidden">
      {/* Main row */}
      <button className="w-full text-left" onClick={handleExpand}>
        {/* Photo hero or gradient thumbnail */}
        {e.image ? (
          <div className="relative w-full h-40 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            {/* dark gradient overlay at bottom for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            {/* Badges top-right */}
            <div className="absolute top-2.5 right-2.5 flex gap-1.5">
              {e.hot && <span className="text-[9px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full">HOT</span>}
              {e.partner && <span className="text-[9px] font-black bg-violet-500 text-white px-2 py-0.5 rounded-full">✓ Partner</span>}
              <span className="text-[9px] text-white/70 bg-black/40 border border-white/[0.15] px-2 py-0.5 rounded-full">{e.cat}</span>
            </div>
            {/* Follow button top-left */}
            {onFollow && (
              <button onClick={ev => { ev.stopPropagation(); onFollow() }}
                className="absolute top-2.5 left-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                style={{ backgroundColor: followed ? "var(--accent)" : "rgba(0,0,0,0.45)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <Bookmark className="w-3.5 h-3.5" style={{ color: followed ? "#fff" : "rgba(255,255,255,0.7)", fill: followed ? "#fff" : "none" }} />
              </button>
            )}
            {/* Title overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-sm font-bold text-white leading-tight">{e.title}</p>
              <p className="text-xs text-white/65 mt-0.5">{e.venue}</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 p-4">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${e.grad} flex items-center justify-center flex-shrink-0 text-2xl relative`}>
              {e.emoji}
              {e.hot && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-full">HOT</span>}
              {e.partner && <span className="absolute -bottom-1.5 -right-1.5 text-[9px] font-black bg-violet-500 text-white px-1.5 py-0.5 rounded-full">✓</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-bold text-szene group-hover:text-violet-400 transition-colors truncate">{e.title}</p>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="text-[10px] text-faint border border-szene px-2 py-0.5 rounded-full">{e.cat}</span>
                  {onFollow && (
                    <button onClick={ev => { ev.stopPropagation(); onFollow() }}
                      className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                      style={{ backgroundColor: followed ? "var(--accent)" : "transparent", border: followed ? "none" : "1px solid var(--border)" }}>
                      <Bookmark className="w-3 h-3" style={{ color: followed ? "#fff" : "var(--text-faint)", fill: followed ? "#fff" : "none" }} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted mt-0.5 truncate">{e.venue}</p>
              {e.desc && <p className="text-xs text-faint mt-0.5 truncate">{e.desc}</p>}
            </div>
          </div>
        )}
        {/* Meta row — date/time/price always shown */}
        <div className="flex items-center gap-3 px-4 py-2.5 text-xs text-faint flex-wrap">
          {e.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>}
          {e.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>}
          {e.price && <span className={`font-semibold ${e.price === "Frei" ? "text-emerald-500" : "text-violet-400"}`}>{e.price}</span>}
          {e.dresscode && <span className="text-whisper">👔 {e.dresscode}</span>}
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-szene pt-3 space-y-3">
          {/* Info row */}
          <div className="flex flex-wrap gap-2">
            {e.dresscode && (
              <span className="flex items-center gap-1.5 text-xs bg-surface border border-szene px-3 py-1.5 rounded-full text-muted">
                👔 <span className="font-medium">{e.dresscode}</span>
              </span>
            )}
            {e.price && (
              <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${
                e.price === "Frei" ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/20"
                : "bg-violet-500/15 text-violet-400 border border-violet-500/20"
              }`}>
                🎟 {e.price}
              </span>
            )}
            {e.time && (
              <span className="flex items-center gap-1.5 text-xs bg-surface border border-szene px-3 py-1.5 rounded-full text-muted">
                🕙 Doors {e.time}
              </span>
            )}
          </div>

          {/* Map embed */}
          <div className="rounded-xl overflow-hidden border border-white/[0.10]" style={{ height: 160 }}>
            <iframe
              title={`Map — ${e.venue}`}
              src={`https://maps.google.com/maps?q=${mapQuery}&output=embed&z=15`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Map / Parking / Action links */}
          <div className="flex flex-wrap gap-2">
            <a href={`https://maps.google.com/?q=${mapQuery}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 hover:text-violet-300 hover:border-violet-400/50 transition-all font-semibold">
              <Navigation className="w-3 h-3" />
              Directions
            </a>
            <a href={`https://maps.google.com/maps?q=${parkingQuery}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-blue-600/15 border border-blue-500/25 text-blue-400 hover:text-blue-300 hover:border-blue-400/40 transition-all font-semibold">
              <ParkingCircle className="w-3 h-3" />
              Parking
            </a>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap gap-2">
            {e.instagram && (
              <a href={`https://instagram.com/${e.instagram}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-gradient-to-r from-pink-600/20 to-violet-600/20 border border-pink-500/20 text-pink-400 hover:text-pink-300 hover:border-pink-400/40 transition-all font-semibold">
                <ExternalLink className="w-3 h-3" />
                @{e.instagram}
              </a>
            )}
            {e.tickets && (
              <a href={e.tickets} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-400 hover:text-violet-300 hover:border-violet-400/50 transition-all font-semibold">
                <ExternalLink className="w-3 h-3" />
                Tickets
              </a>
            )}
            {e.website && (
              <a href={e.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-surface border border-szene text-muted hover:text-szene hover:border-strong transition-all font-semibold">
                <ExternalLink className="w-3 h-3" />
                Website
              </a>
            )}
            <ShareEvent title={e.title} />
            {user ? (
              <button onClick={(ev) => { ev.stopPropagation(); onToggle() }}
                className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl font-semibold transition-all ${
                  going ? "bg-violet-600 text-white" : "border border-szene text-muted hover:border-violet-400/50 hover:text-szene"
                }`}>
                {going ? <><Check className="w-3 h-3" /> Going</> : <><Users className="w-3 h-3" /> {e.going} going</>}
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-szene text-faint hover:text-muted transition-colors">
                <Users className="w-3 h-3" /> {e.going} going
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── For You tab (recommendations) ───────────────────────────────────────────
function ForYouTab({ city }: { city: string }) {
  const { user } = useAuth()
  const [going, setGoing] = useState<Set<string>>(new Set())
  const events = hydrateDates(EVENTS[city] ?? [])
  const { followed, toggle: toggleFollow } = useFollowedEvents(events)
  const hot    = events.filter(e => e.hot)
  const messe  = events.filter(e => e.cat === "Messe")
  const afro   = events.filter(e => e.vibe === "afro")
  const latin  = events.filter(e => e.vibe === "latin")
  const uni    = events.filter(e => e.vibe === "student")
  const hiphop = events.filter(e => e.vibe === "hiphop")

  useEffect(() => {
    if (!user) return
    fetch("/api/rsvp").then(r => r.json()).then(d => {
      if (d.eventIds) setGoing(new Set(d.eventIds))
    }).catch(() => {})
  }, [user])

  function toggle(id: string) {
    if (!user) return
    setGoing(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
    fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId: id }) }).catch(() => {})
  }

  function Section({ title, emoji, items }: { title: string; emoji: string; items: EventItem[] }) {
    if (!items.length) return null
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{emoji}</span>
          <p className="text-sm font-bold text-szene">{title}</p>
        </div>
        <div className="space-y-2">
          {items.slice(0, 3).map(e => (
            <EventCard key={e.id} e={e} going={going.has(e.id)} onToggle={() => toggle(e.id)} user={user} city={city} followed={followed.has(e.id)} onFollow={() => toggleFollow(e.id)} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {hot.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
            </span>
            <p className="text-sm font-bold text-szene">Trending tonight</p>
          </div>
          <div className="space-y-2">
            {hot.map(e => (
              <EventCard key={e.id} e={e} going={going.has(e.id)} onToggle={() => toggle(e.id)} user={user} city={city} followed={followed.has(e.id)} onFollow={() => toggleFollow(e.id)} />
            ))}
          </div>
        </div>
      )}
      <Section title="Messen & Märkte" emoji="🏛️" items={messe} />
      <Section title="Afro & Afrobeats" emoji="🌍" items={afro} />
      <Section title="Reggaeton & Latin" emoji="🔥" items={latin} />
      <Section title="University Events" emoji="🎓" items={uni} />
      <Section title="Hip-Hop & R&B" emoji="🎤" items={hiphop} />
    </div>
  )
}

// ─── Events tab ───────────────────────────────────────────────────────────────
function EventsTab({ city }: { city: string }) {
  const { user } = useAuth()
  const [vibe, setVibe]     = useState("all")
  const [query, setQuery]   = useState("")
  const [going, setGoing]   = useState<Set<string>>(new Set())
  const [liveEvents, setLiveEvents] = useState<any[]>([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [sources, setSources] = useState<any>(null)
  const staticForFollow = hydrateDates(EVENTS[city] ?? [])
  const { followed, toggle: toggleFollow } = useFollowedEvents(staticForFollow)

  useEffect(() => {
    setLiveLoading(true)
    setLiveEvents([])
    fetch(`/api/discover/live?city=${city}&vibe=${vibe}`)
      .then(r => r.json())
      .then(d => {
        const events = d.events ?? []
        setLiveEvents(events)
        setSources(d.sources)
        // Show in-app banner for the top new event
        const top = events[0]
        if (top) {
          const VIBE_EMOJI: Record<string, string> = {
            Afro: "🌍", Latin: "🔥", "Hip-Hop": "🎤", Uni: "🎓",
            Nightlife: "🎉", Music: "🎷", Outdoor: "🌿", Bar: "🍸", Event: "✦",
          }
          triggerEventToast({
            id:       top.id,
            title:    top.title,
            venue:    top.venue ?? city,
            city:     city.charAt(0).toUpperCase() + city.slice(1),
            category: top.category ?? "Event",
            emoji:    VIBE_EMOJI[top.category ?? ""] ?? "✦",
            url:      top.url || undefined,
          })
        }
      })
      .catch(() => {})
      .finally(() => setLiveLoading(false))
  }, [city, vibe])

  const q = query.trim().toLowerCase()
  const staticEvents = hydrateDates(EVENTS[city] ?? [])
    .filter(e => (vibe === "all" || e.vibe === vibe) && (!q || e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)))
  const allEvents    = liveEvents.length > 0 ? liveEvents : staticEvents

  useEffect(() => {
    if (!user) return
    fetch("/api/rsvp").then(r => r.json()).then(d => {
      if (d.eventIds) setGoing(new Set(d.eventIds))
    }).catch(() => {})
  }, [user])

  function toggle(id: string) {
    if (!user) return
    setGoing(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
    fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId: id }) }).catch(() => {})
  }

  return (
    <div className="space-y-5">
      <VibeBar vibe={vibe} setVibe={setVibe} />

      {sources && liveEvents.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {sources.ra > 0 && <span className="text-[10px] text-white/40 border border-white/[0.10] px-2 py-0.5 rounded-full">RA · {sources.ra}</span>}
          {sources.ticketmaster > 0 && <span className="text-[10px] text-white/40 border border-white/[0.10] px-2 py-0.5 rounded-full">Ticketmaster · {sources.ticketmaster}</span>}
          {sources.social > 0 && <span className="text-[10px] text-white/40 border border-white/[0.10] px-2 py-0.5 rounded-full">Social · {sources.social}</span>}
          <span className="text-[10px] text-emerald-400/70 border border-emerald-500/20 px-2 py-0.5 rounded-full">● Live</span>
        </div>
      )}

      {liveLoading ? (
        <div className="flex items-center justify-center py-16 gap-3">
          <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
          <span className="text-white/40 text-sm">Finding events…</span>
        </div>
      ) : allEvents.length === 0 ? (
        <p className="text-white/30 text-sm py-10 text-center">No events found — try another vibe.</p>
      ) : (
        <div className="space-y-3">
          {allEvents.map((e: any) => {
            const isLive = !!e.source
            // Static events — use full EventCard with follow support
            if (!isLive) {
              return <EventCard key={e.id} e={e} going={going.has(e.id)} onToggle={() => toggle(e.id)} user={user} city={city} followed={followed.has(e.id)} onFollow={() => toggleFollow(e.id)} />
            }
            // Live events — compact inline card with bookmark
            const cat   = e.category ?? e.cat ?? "Event"
            const grad  = e.grad ?? GRAD_BY_CAT[cat] ?? GRAD_BY_CAT.Event
            const emoji = e.emoji ?? "✦"
            const price = e.price ?? null
            const url   = e.url ?? null
            return (
              <div key={e.id} className="flex gap-4 p-4 rounded-2xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.07] transition-colors group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center flex-shrink-0 text-2xl`}>
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">{e.title}</p>
                      <p className="text-xs text-white/50 mt-0.5 truncate">{e.venue}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] text-white/40 border border-white/[0.10] px-2 py-0.5 rounded-full">{cat}</span>
                      <button onClick={() => toggleFollow(e.id)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0"
                        style={{ backgroundColor: followed.has(e.id) ? "var(--accent)" : "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <Bookmark className="w-3 h-3" style={{ color: followed.has(e.id) ? "#fff" : "rgba(255,255,255,0.4)", fill: followed.has(e.id) ? "#fff" : "none" }} />
                      </button>
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer"
                          className="text-white/30 hover:text-violet-400 transition-colors" onClick={ev => ev.stopPropagation()}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2.5 gap-2">
                    <div className="flex items-center gap-3 text-xs text-white/45 flex-wrap">
                      {e.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>}
                      {e.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>}
                      {price && <span className={`font-semibold ${price === "Frei" || price === "Free" ? "text-emerald-400" : "text-violet-400/80"}`}>{price}</span>}
                    </div>
                    <ShareEvent title={e.title} url={url ?? undefined} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Tonight tab ──────────────────────────────────────────────────────────────
function TonightTab({ city }: { city: string }) {
  const [vibe, setVibe] = useState("all")
  const hour    = getH()
  const all     = OPEN_NOW[city] ?? []
  const filtered = vibe === "all" ? all : all.filter(v => v.vibe === vibe)
  const open    = filtered.filter(s => hour >= s.opens && hour < s.closes)
  const soon    = filtered.filter(s => s.opens > hour && s.opens <= hour + 3 && !open.includes(s))
  const show    = open.length ? open : filtered.slice(0, 8)

  return (
    <div className="space-y-5">
      <VibeBar vibe={vibe} setVibe={setVibe} />
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="text-xs text-faint uppercase tracking-widest">
          {open.length ? `${open.length} open now` : "Opening soon"}
        </span>
      </div>
      {show.length === 0 ? (
        <p className="text-faint text-sm py-10 text-center">Nothing in this vibe right now — try another.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {show.map(v => (
            <Link key={v.name} href={`/venue/${toSlug(v.name)}`}
              className="szene-card flex items-center gap-3 p-4 group">
              <span className="text-2xl flex-shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-szene truncate group-hover:text-violet-400 transition-colors">{v.name}</p>
                  {v.hot && <span className="text-[9px] text-orange-400 font-bold bg-orange-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">Hot</span>}
                </div>
                <p className="text-xs text-muted mt-0.5">{v.type} · {v.area}</p>
              </div>
              <span className={`text-[10px] font-bold flex-shrink-0 ${open.includes(v) ? "text-emerald-500" : "text-faint"}`}>
                {open.includes(v) ? "Open" : `${v.opens}:00`}
              </span>
            </Link>
          ))}
        </div>
      )}
      {soon.length > 0 && (
        <div>
          <p className="text-[10px] text-faint uppercase tracking-widest mb-2 font-semibold">Opening within 3h</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {soon.map(v => (
              <div key={v.name} className="szene-card flex items-center gap-2 p-3 opacity-60">
                <span className="text-lg">{v.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-szene truncate">{v.name}</p>
                  <p className="text-[10px] text-faint flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{v.opens}:00</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Venues tab ───────────────────────────────────────────────────────────────
function VenuesTab({ city }: { city: string }) {
  const { user } = useAuth()
  const [vibe, setVibe] = useState("all")
  const cityVenues  = VENUES_BY_CITY[city] ?? []
  const filtered    = vibe === "all" ? cityVenues : cityVenues.filter(v => v.vibe === vibe)

  const isHidden = (tag: string) => tag.includes("🔒 Hidden")

  return (
    <div className="space-y-5">
      <VibeBar vibe={vibe} setVibe={setVibe} />

      {/* Hidden venues teaser for guests */}
      {!user && filtered.some(v => isHidden(v.tag)) && (
        <Link href="/register" className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-violet-500/30 bg-violet-500/8 group transition-all hover:border-violet-400/50">
          <span className="text-xl">🔒</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
              {filtered.filter(v => isHidden(v.tag)).length} hidden venues in {city.charAt(0).toUpperCase() + city.slice(1)}
            </p>
            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Geheimtipps only locals know — free to unlock</p>
          </div>
          <span className="text-[10px] font-bold text-violet-400 group-hover:text-violet-300 flex-shrink-0">Unlock →</span>
        </Link>
      )}

      {filtered.length === 0 ? (
        <p className="text-faint text-sm py-10 text-center">No venues in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(v => {
            const hidden = isHidden(v.tag) && !user
            return hidden ? (
              // Locked card for guests
              <Link key={v.id} href="/register" className="szene-card flex items-center gap-3 p-4 group relative overflow-hidden">
                <span className="text-2xl flex-shrink-0 grayscale opacity-50">{v.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate" style={{ color: "var(--text-primary)" }}>{v.name}</p>
                  <p className="text-xs mt-0.5 blur-sm select-none" style={{ color: "var(--text-muted)" }}>
                    ████████, {v.area}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-violet-400 border border-violet-500/30 bg-violet-500/10 px-2 py-1 rounded-full flex-shrink-0">
                  🔒 Unlock
                </span>
              </Link>
            ) : (
              <Link key={v.id} href={`/venue/${toSlug(v.name)}`}
                className="szene-card flex items-center gap-3 p-4 group">
                <span className="text-2xl flex-shrink-0">{v.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-szene group-hover:text-violet-400 transition-colors truncate">{v.name}</p>
                  <p className="text-xs text-muted mt-0.5">{v.area}</p>
                </div>
                <span className="text-[10px] text-violet-400/70 border border-violet-500/25 px-2 py-0.5 rounded-full flex-shrink-0 text-right leading-tight">{v.tag}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-faint group-hover:text-violet-400 transition-colors flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Friends tab ──────────────────────────────────────────────────────────────
function FriendsTab() {
  const { user, loading } = useAuth()
  if (!loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5">
          <Users className="w-7 h-7 text-violet-400/50" />
        </div>
        <h3 className="text-szene font-bold mb-2">See where your friends are</h3>
        <p className="text-muted text-sm mb-8 max-w-xs">Sign in to follow friends and see their check-ins live.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/login" className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold text-center hover:bg-white/90 transition-colors">Sign in</Link>
          <Link href="/register" className="w-full border border-white/[0.15] text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold text-center hover:border-white/30 transition-colors">Create account — free</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-faint text-sm">No activity yet — follow people from their profile.</p>
    </div>
  )
}

// ─── Onboarding ───────────────────────────────────────────────────────────────
const ONBOARDING_VIBES = [
  { id: "afro",    label: "Afrobeats",  emoji: "🌍" },
  { id: "latin",   label: "Latin",      emoji: "🔥" },
  { id: "hiphop",  label: "Hip-Hop",    emoji: "🎤" },
  { id: "student", label: "Uni",        emoji: "🎓" },
  { id: "party",   label: "Party",      emoji: "🎉" },
  { id: "chill",   label: "Chill",      emoji: "🍷" },
  { id: "music",   label: "Live Music", emoji: "🎷" },
  { id: "outside", label: "Outside",    emoji: "🌿" },
]

function Onboarding({ onDone }: { onDone: (city: string, vibes: string[]) => void }) {
  const [step, setStep]         = useState<"city" | "vibes">("city")
  const [city, setCity]         = useState("")
  const [vibes, setVibes]       = useState<string[]>([])
  const [leaving, setLeaving]   = useState(false)

  function pickCity(c: string) { setCity(c); setStep("vibes") }

  function toggleVibe(v: string) {
    setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  }

  function finish() {
    setLeaving(true)
    setTimeout(() => onDone(city, vibes), 400)
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-szene transition-opacity duration-400 ${leaving ? "opacity-0" : "opacity-100"}`}>
      <div className="w-full max-w-sm mx-auto px-6 flex flex-col items-center">

        {step === "city" && (
          <>
            <div className="mb-8 text-center">
              <p className="text-4xl font-black text-szene tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>SZENE</p>
              <p className="text-muted text-sm">Your city. Your night.</p>
            </div>
            <p className="text-szene font-bold text-lg mb-5 w-full">Where are you going out?</p>
            <div className="flex flex-col gap-2.5 w-full">
              {CITIES.map(c => (
                <button key={c.id} onClick={() => pickCity(c.id)}
                  className="w-full py-4 rounded-2xl border border-szene text-szene font-bold text-left px-5 hover:border-violet-400/60 hover:bg-surface transition-all flex items-center justify-between group">
                  {c.label}
                  <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-violet-400 transition-colors" />
                </button>
              ))}
            </div>
          </>
        )}

        {step === "vibes" && (
          <>
            <div className="mb-8 text-center">
              <p className="text-szene font-bold text-lg">What&apos;s your vibe?</p>
              <p className="text-muted text-sm mt-1">Pick everything that fits — we&apos;ll tailor your feed.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 w-full mb-8">
              {ONBOARDING_VIBES.map(v => {
                const on = vibes.includes(v.id)
                return (
                  <button key={v.id} onClick={() => toggleVibe(v.id)}
                    className={`py-4 px-4 rounded-2xl border font-semibold text-sm flex items-center gap-2.5 transition-all ${
                      on ? "vibe-active" : "vibe-inactive"
                    }`}>
                    <span className="text-xl">{v.emoji}</span>
                    {v.label}
                    {on && <Check className="w-3.5 h-3.5 text-violet-400 ml-auto" />}
                  </button>
                )
              })}
            </div>
            <button onClick={finish}
              className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-colors">
              {vibes.length > 0 ? `Let's go →` : "Skip for now →"}
            </button>
          </>
        )}

      </div>
    </div>
  )
}

// ─── Night Out Planner ────────────────────────────────────────────────────────
type Stop = { time: string; emoji: string; place: string; area: string; type: string; tip: string; price: string }
type Plan = { id: string; title: string; subtitle: string; emoji: string; grad: string; badge: string; stops: Stop[] }

const PLANS: Record<string, Plan[]> = {
  mannheim: [
    {
      id: "afro-night-ma",
      title: "Afro Night Route",
      subtitle: "Jungbusch crawl — deep cuts & big bass",
      emoji: "🌍", grad: "from-green-800 to-emerald-900", badge: "Popular",
      stops: [
        { time: "20:00", emoji: "🍸", place: "Kaizen",        area: "Innenstadt", type: "Cocktail bar", tip: "Best pre-game spot — order their signature rum sour",        price: "~€12" },
        { time: "22:00", emoji: "🎷", place: "Ella & Louis",  area: "Jungbusch",  type: "Jazz bar",     tip: "Warm up your night with live jazz and great cocktails",      price: "Frei" },
        { time: "23:30", emoji: "🌍", place: "MS Connexion",  area: "Hafen",      type: "Club",         tip: "Main floor for Afrobeats — side room for Amapiano. Dress up", price: "€8"   },
        { time: "02:00", emoji: "🌅", place: "Strandbar Rennwiese", area: "Rennwiese", type: "Afterhour", tip: "If it's summer — end at the Rhein. Best sunrise in Mannheim", price: "Frei" },
      ],
    },
    {
      id: "student-night-ma",
      title: "Student Budget Night",
      subtitle: "Max fun, min spend — under €15 total",
      emoji: "🎓", grad: "from-blue-800 to-indigo-900", badge: "€€",
      stops: [
        { time: "19:00", emoji: "🍺", place: "Plan B",         area: "Jungbusch",  type: "Bar",        tip: "Happy hour until 21:00 — Bier für €2,50",                   price: "€3"   },
        { time: "21:00", emoji: "🎨", place: "Galerie Kurzzeit",area: "Jungbusch", type: "Bar/Gallery", tip: "Local art on the walls, underground vibes, friendly crowd",  price: "Frei" },
        { time: "22:00", emoji: "🎓", place: "Uni Mannheim Aula", area: "Quadrate", type: "Uni Party",  tip: "Free with student ID — biggest student night in the region", price: "Frei" },
        { time: "01:00", emoji: "🍕", place: "L'Osteria Mannheim", area: "Innenstadt", type: "Late food", tip: "Grab a slice on the way home — open until 02:00",          price: "~€6"  },
      ],
    },
    {
      id: "date-night-ma",
      title: "Date Night",
      subtitle: "Impress someone — from cocktails to club",
      emoji: "🥂", grad: "from-rose-800 to-pink-900", badge: "Romantic",
      stops: [
        { time: "19:30", emoji: "🍷", place: "Weinkeller Wasserturm", area: "Wasserturm", type: "Wine bar", tip: "Rhine Valley wines, candlelight — start here. Book ahead", price: "~€20" },
        { time: "21:00", emoji: "🌬️", place: "ZEPHYR Bar",   area: "Quadrate",   type: "Cocktail bar", tip: "Dark, intimate, no tourists. Order whatever the bartender suggests", price: "~€14" },
        { time: "23:00", emoji: "💜", place: "Tiffany Club",  area: "C-Quadrat",  type: "Club",         tip: "Dresscode enforced — dress up. Great sound, premium crowd",  price: "€8"  },
      ],
    },
    {
      id: "techno-night-ma",
      title: "Underground Route",
      subtitle: "Black clothes only — deep techno all night",
      emoji: "❄️", grad: "from-fuchsia-900 to-black", badge: "After midnight",
      stops: [
        { time: "21:00", emoji: "🍸", place: "Hemingway Bar", area: "Innenstadt", type: "Bar",    tip: "Classic spirits, no nonsense. Fuel up before the long night", price: "~€13" },
        { time: "23:00", emoji: "❄️", place: "7Grad Mannheim", area: "Jungbusch", type: "Club",   tip: "Arrives after midnight for best atmosphere. Dress: all black", price: "€6"   },
        { time: "02:00", emoji: "🖤", place: "Zeitraumexit",  area: "Jungbusch",  type: "Club",   tip: "Experimental and raw — the real underground. ID required",    price: "€6"   },
      ],
    },
  ],
  heidelberg: [
    {
      id: "altstadt-crawl-hd",
      title: "Altstadt Crawl",
      subtitle: "Historic streets, great bars — the classic HD night",
      emoji: "🏰", grad: "from-stone-800 to-amber-900", badge: "Local favourite",
      stops: [
        { time: "18:00", emoji: "🏰", place: "Schloss Biergarten", area: "Schloss",  type: "Beer garden", tip: "Start with sunset views over the Neckar — pure magic",    price: "~€6"  },
        { time: "20:00", emoji: "🍏", place: "Green Apple",        area: "Altstadt", type: "Bar",         tip: "Popular student spot — cocktail pitchers, great DJ sets",  price: "~€8"  },
        { time: "22:00", emoji: "🍺", place: "O'Brien's",          area: "Altstadt", type: "Irish pub",   tip: "Packed with students and expats — great energy",           price: "~€5"  },
        { time: "23:30", emoji: "🎸", place: "Cave 54",            area: "Altstadt", type: "Club",        tip: "Heidelberg legend since 1969 — get there before 00:00",    price: "€3"   },
      ],
    },
    {
      id: "music-night-hd",
      title: "Music & Festival Night",
      subtitle: "Live music from sunset to last dance",
      emoji: "🎻", grad: "from-amber-700 to-yellow-800", badge: "Culture",
      stops: [
        { time: "17:00", emoji: "🎻", place: "Heidelberger Frühling", area: "Stadthalle", type: "Festival", tip: "World-class classical festival — book tickets in advance", price: "€18"  },
        { time: "20:00", emoji: "🌿", place: "Harmoniegarten",    area: "Weststadt",  type: "Garden bar",  tip: "Outdoor drinks after the concert — great Weizen",         price: "~€5"  },
        { time: "21:00", emoji: "🎸", place: "Billy Blues",       area: "Altstadt",   type: "Music bar",   tip: "Live band, great sound, small and intimate",              price: "€7"   },
        { time: "23:00", emoji: "🎶", place: "Nachtschicht",      area: "Bergheim",   type: "Club",        tip: "HD's biggest club — go to the main floor for house",      price: "€6"   },
      ],
    },
  ],
  frankfurt: [
    {
      id: "messe-afterparty-ffm",
      title: "Messe Day → Night",
      subtitle: "After a long day at the fair — where to go",
      emoji: "🎸", grad: "from-red-800 to-rose-900", badge: "Messe season",
      stops: [
        { time: "17:00", emoji: "🎸", place: "Musikmesse Frankfurt", area: "Messe",        type: "Trade fair", tip: "Catch the last sessions and artist showcases",                 price: "€28"  },
        { time: "20:00", emoji: "🌆", place: "Main Tower Lounge",    area: "Bankenviertel",type: "Rooftop bar", tip: "200m up — cocktails with Frankfurt skyline view. Dress smart", price: "~€15" },
        { time: "22:00", emoji: "🎺", place: "Jazzkeller Frankfurt", area: "Innenstadt",   type: "Jazz club",   tip: "Since 1952 — intimate, legendary, real Frankfurt vibe",         price: "€8"   },
        { time: "00:00", emoji: "🎛️", place: "Robert Johnson",      area: "Offenbach",    type: "Club",        tip: "World-class electronic — take the tram from Hauptwache",       price: "€12"  },
      ],
    },
    {
      id: "afro-night-ffm",
      title: "Afro Fusion Night",
      subtitle: "From Sachsenhausen to Offenbach",
      emoji: "🌍", grad: "from-green-800 to-teal-900", badge: "Hot",
      stops: [
        { time: "20:00", emoji: "🍜", place: "Street Food Festival", area: "Mainkai",      type: "Food market", tip: "If it's on — eat here first. 60+ stands on the Mainufer", price: "~€12" },
        { time: "22:00", emoji: "🌴", place: "King Kamehameha",      area: "Sachsenhausen",type: "Club",        tip: "Reggaeton + Latin first, then Afrobeats after midnight",  price: "€8"   },
        { time: "23:30", emoji: "🌍", place: "Robert Johnson",       area: "Offenbach",    type: "Club",        tip: "Afrohouse & Techno — the main event. Arrive after 01:00", price: "€12"  },
      ],
    },
    {
      id: "student-ffm",
      title: "Goethe Uni Night",
      subtitle: "Student budget, Frankfurt energy",
      emoji: "🎓", grad: "from-blue-800 to-indigo-900", badge: "Budget",
      stops: [
        { time: "19:00", emoji: "🏙️", place: "Sachsenhäuser Ufer", area: "Sachsenhausen", type: "Outdoor",    tip: "Free — just grab a beer from a Kiosk and sit by the Main", price: "~€3"  },
        { time: "21:00", emoji: "🎓", place: "Club Voltaire",       area: "Innenstadt",    type: "Uni Bar",    tip: "Artsy, political, cheap drinks — classic Frankfurt student", price: "€2"   },
        { time: "23:00", emoji: "🎉", place: "Metropol",            area: "Sachsenhausen", type: "Club",       tip: "R&B and Hip-Hop — always packed on weekends",              price: "€6"   },
      ],
    },
  ],
  stuttgart: [
    {
      id: "stgt-techno",
      title: "Stuttgarter Technonacht",
      subtitle: "Vom Vorglühen bis Sonnenaufgang",
      emoji: "🔊", grad: "from-violet-900 to-black", badge: "🔥 Hot",
      stops: [
        { time: "20:00", emoji: "🍸", place: "Bar Babette",      area: "Mitte",       type: "Bar",        tip: "Stuttgarts Insiderbar zum Starten — Naturweine & Negroni", price: "~€10" },
        { time: "22:00", emoji: "🖤", place: "Kowalski Stuttgart",area: "Süd",         type: "Club",       tip: "Elektro und Techno — komm früh für günstigeren Eintritt",  price: "€14"  },
        { time: "00:00", emoji: "🔊", place: "Climax Institutes", area: "Schlossgarten",type: "Club",      tip: "Stuttgart's härtestes Techno-Floor — Funktion-One Sound",   price: "€12"  },
      ],
    },
    {
      id: "stgt-latin",
      title: "Stuttgart Latin Night",
      subtitle: "Reggaeton, Salsa & Afrobeats auf 3 Floors",
      emoji: "🔥", grad: "from-orange-800 to-red-900", badge: "Latin",
      stops: [
        { time: "18:00", emoji: "🌅", place: "Dachterrasse Dorotheen",area: "Innenstadt", type: "Rooftop",  tip: "Beste Sonnenuntergang-Aussicht über Stuttgart — kostenlos", price: "Frei" },
        { time: "20:00", emoji: "🔥", place: "7GradX Stuttgart",  area: "West",        type: "Club",       tip: "Aftercito x Familia Latina — kein Dresscode, nur Heat",    price: "€5"   },
        { time: "23:00", emoji: "💃", place: "MICA Club",          area: "Innenstadt",  type: "Club",       tip: "Perreo Saturdays — Reggaeton bis 4 Uhr. Frühzeitig kommen",price: "€9"   },
      ],
    },
    {
      id: "stgt-premium",
      title: "Perkins Park Premium",
      subtitle: "Killesberg Panorama & Stuttgarts bestes Publikum",
      emoji: "🌆", grad: "from-amber-800 to-orange-900", badge: "Premium",
      stops: [
        { time: "19:00", emoji: "🍷", place: "Weinstube Fröhlich", area: "Bohnenviertel",type: "Wine bar", tip: "Historisches Bohnenviertel — Württemberger Weine, coole Crowd",price: "~€8"},
        { time: "21:00", emoji: "🎤", place: "Im Wizemann",        area: "Feuerbach",   type: "Live",       tip: "Liveset als Warm-Up — Einlass schon 21 Uhr, beste Plätze",  price: "€12" },
        { time: "23:00", emoji: "🌆", place: "Perkins Park",       area: "Killesberg",  type: "Club",       tip: "Glasfront mit Panoramablick — Stuttgarts schönster Club",   price: "€15"  },
      ],
    },
  ],
  karlsruhe: [
    {
      id: "kit-night-ka",
      title: "KIT Student Night",
      subtitle: "Substage to Tollhaus — the classic KA route",
      emoji: "🎓", grad: "from-blue-800 to-indigo-900", badge: "Student",
      stops: [
        { time: "19:00", emoji: "🌿", place: "Kühler Krug",     area: "Günther-K.",  type: "Beer garden", tip: "Best Biergarten in Karlsruhe — great for groups",           price: "~€5"  },
        { time: "21:00", emoji: "🍸", place: "Hemingway KA",     area: "Innenstadt",  type: "Cocktail bar", tip: "Pre-game cocktails — try the mojito",                       price: "~€12" },
        { time: "23:00", emoji: "🎸", place: "Substage",         area: "Südstadt",    type: "Club",        tip: "KIT Semesterparty — cheapest entry, biggest crowd",         price: "€4"   },
        { time: "01:30", emoji: "🎭", place: "Tollhaus",         area: "Oststadt",    type: "Club",        tip: "If Substage gets too packed — Tollhaus is 5 min walk away", price: "€6"   },
      ],
    },
  ],
  berlin: [
    {
      id: "berlin-techno-tour",
      title: "Berlin Techno Pilgrimage",
      subtitle: "Watergate → Berghain — the ultimate route",
      emoji: "🖤", grad: "from-zinc-900 to-black", badge: "Techno",
      stops: [
        { time: "22:00", emoji: "🍺", place: "Madame Claude",       area: "Kreuzberg",      type: "Bar",    tip: "Furniture on the ceiling, cheap beer, warm-up vibes",       price: "~€4"  },
        { time: "00:00", emoji: "🌊", place: "Watergate",           area: "Kreuzberg",      type: "Club",   tip: "Spree windows open at 2am — floor-to-ceiling sunrise view",  price: "€15"  },
        { time: "06:00", emoji: "🖤", place: "Berghain",            area: "Friedrichshain", type: "Club",   tip: "Go at 6am — shorter queue. Dress dark, no groups of 4+",    price: "€20"  },
      ],
    },
    {
      id: "berlin-festival-weekend",
      title: "Sisyphos Weekend",
      subtitle: "The festival club that doesn't stop",
      emoji: "🏕️", grad: "from-emerald-800 to-teal-900", badge: "Open Air",
      stops: [
        { time: "20:00", emoji: "🌿", place: "Holzmarkt 25",        area: "Friedrichshain", type: "Bar",    tip: "River bar with stunning Spree views — great food too",       price: "~€5"  },
        { time: "22:00", emoji: "🎛️", place: "Wilde Renate",        area: "Friedrichshain", type: "Club",   tip: "Multi-room labyrinth — get lost intentionally",              price: "€12"  },
        { time: "02:00", emoji: "🏕️", place: "Sisyphos",           area: "Rummelsburg",    type: "Open Air",tip: "Taxi from Ostkreuz — outdoor stages start at sunrise",       price: "€15"  },
      ],
    },
  ],
  munich: [
    {
      id: "munich-techno-night",
      title: "Munich Underground",
      subtitle: "Harry Klein & Rote Sonne — the real Munich",
      emoji: "🔊", grad: "from-violet-900 to-black", badge: "Techno",
      stops: [
        { time: "20:00", emoji: "🍺", place: "Augustiner Stammhaus", area: "Innenstadt",    type: "Bar",    tip: "Old Munich beer hall — litre Mass, no tourists know this one",price: "~€9" },
        { time: "23:00", emoji: "🔴", place: "Rote Sonne",           area: "Maximiliansp.", type: "Club",   tip: "300-cap legend — arrive before midnight for no queue",       price: "€12"  },
        { time: "02:00", emoji: "🔊", place: "Harry Klein",          area: "Innenstadt",    type: "Club",   tip: "Best techno in Munich — Funktion-One, serious crowd",        price: "€18"  },
      ],
    },
  ],
  cologne: [
    {
      id: "cologne-techno-night",
      title: "Cologne Club Night",
      subtitle: "Ehrenfeld to Bootshaus — the full route",
      emoji: "⛵", grad: "from-violet-900 to-black", badge: "Techno",
      stops: [
        { time: "21:00", emoji: "🍺", place: "Brauhaus Sion",        area: "Altstadt",       type: "Bar",    tip: "Real Kölsch brewery — locals only pub, no tourist trap",    price: "~€3"  },
        { time: "23:00", emoji: "🚂", place: "Club Bahnhof Ehrenfeld",area: "Ehrenfeld",     type: "Club",   tip: "Under the S-Bahn — best local techno. Queue at 11:30pm",   price: "€10"  },
        { time: "02:00", emoji: "⛵", place: "Bootshaus",            area: "Deutz",          type: "Club",   tip: "Take taxi across Rhine — 3 rooms, 6+ hours minimum",        price: "€20"  },
      ],
    },
    {
      id: "cologne-latin-night",
      title: "Cologne Latin Nights",
      subtitle: "Yuca Club to Odonien — sun & sound",
      emoji: "🔥", grad: "from-orange-800 to-red-900", badge: "Latin",
      stops: [
        { time: "20:00", emoji: "🌿", place: "Stadtgarten Biergarten",area: "Innenstadt",   type: "Garden", tip: "Pre-drinks in the jazz garden — outdoor, chill, great food",price: "~€6"  },
        { time: "22:00", emoji: "🔥", place: "Yuca Club",            area: "Ehrenfeld",      type: "Club",   tip: "1,500 cap Latin club — arrive early, it sells out",         price: "€12"  },
      ],
    },
  ],
}

function PlannerTab({ city }: { city: string }) {
  const plans = PLANS[city] ?? PLANS.mannheim
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-2">
        <p className="text-[10px] text-violet-400 uppercase tracking-[0.2em] font-semibold mb-1">Night Out Planner</p>
        <h2 className="text-xl font-black text-szene tracking-tight">Curated combos for tonight</h2>
        <p className="text-xs text-muted mt-1">Tap a plan to see the full itinerary — where to go and when.</p>
      </div>

      {plans.map(plan => (
        <div key={plan.id} className="szene-card overflow-hidden">
          {/* Plan header */}
          <button className="w-full text-left p-4" onClick={() => setActive(a => a === plan.id ? null : plan.id)}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.grad} flex items-center justify-center text-2xl flex-shrink-0`}>
                {plan.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-szene">{plan.title}</p>
                  <span className="text-[9px] text-violet-400 border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">{plan.badge}</span>
                </div>
                <p className="text-xs text-muted truncate">{plan.subtitle}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {plan.stops.map((s, i) => (
                    <span key={i} className="text-[10px] text-faint bg-surface border border-szene px-1.5 py-0.5 rounded-full">{s.time}</span>
                  ))}
                </div>
              </div>
              <span className="text-faint text-xs flex-shrink-0">{active === plan.id ? "▲" : "▼"}</span>
            </div>
          </button>

          {/* Expanded itinerary */}
          {active === plan.id && (
            <div className="border-t border-szene px-4 pb-4 pt-3">
              <div className="relative">
                {/* Vertical timeline line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/40 via-violet-500/20 to-transparent" />
                <div className="space-y-4">
                  {plan.stops.map((stop, i) => (
                    <div key={i} className="flex gap-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 w-10 flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-[10px] z-10">
                          {stop.emoji}
                        </div>
                      </div>
                      {/* Stop info */}
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-violet-400 font-mono">{stop.time}</span>
                          <p className="text-sm font-bold text-szene truncate">{stop.place}</p>
                        </div>
                        <p className="text-[10px] text-faint mb-1">{stop.type} · {stop.area}</p>
                        <p className="text-xs text-muted leading-relaxed">{stop.tip}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            stop.price === "Frei" || stop.price === "~€3" || stop.price === "~€4"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                              : "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                          }`}>🎟 {stop.price}</span>
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(stop.place + ", " + city)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-faint hover:text-muted border border-szene px-2 py-0.5 rounded-full transition-colors flex items-center gap-1">
                            <Navigation className="w-2.5 h-2.5" /> Map
                          </a>
                          <a
                            href={`https://maps.google.com/maps?q=${encodeURIComponent("parking near " + stop.place + ", " + city)}`}
                            target="_blank" rel="noopener noreferrer"
                            className="text-[10px] text-blue-400/70 hover:text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full transition-colors flex items-center gap-1">
                            <ParkingCircle className="w-2.5 h-2.5" /> P
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share plan */}
              <button
                onClick={() => {
                  const text = `${plan.title} — ${city.charAt(0).toUpperCase() + city.slice(1)}\n` +
                    plan.stops.map(s => `${s.time} ${s.emoji} ${s.place}`).join("\n") +
                    "\n\nvia Szene App 🎉"
                  navigator.clipboard.writeText(text)
                }}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-szene text-xs text-muted hover:text-szene hover:border-strong transition-all font-semibold">
                <Copy className="w-3 h-3" /> Copy plan to share
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Messe callout if no city-specific plans */}
      {(PLANS[city]?.length ?? 0) === 0 && (
        <div className="szene-card p-5 text-center">
          <p className="text-2xl mb-2">🏛️</p>
          <p className="text-sm font-bold text-szene mb-1">Plans coming soon for {city}</p>
          <p className="text-xs text-muted">Check the Events tab for Messen and local happenings.</p>
        </div>
      )}
    </div>
  )
}

// ─── Brunch / Daytime ────────────────────────────────────────────────────────
type BrunchSpot = { name: string; area: string; type: string; emoji: string; opens: number; closes: number; desc: string; hot?: boolean; price?: string; instagram?: string }
const BRUNCH_BY_CITY: Record<string, BrunchSpot[]> = {
  mannheim: [
    { name: "Emma Wolf",            area: "Jungbusch",   type: "Café",        emoji: "☕", opens: 8,  closes: 17, hot: true,  price: "~€8",  desc: "Mannheim's best specialty coffee, homemade cakes, terrace in summer", instagram: "emmawolf_mannheim" },
    { name: "Café Prag",            area: "Innenstadt",  type: "Café",        emoji: "🥐", opens: 8,  closes: 18, hot: false, price: "~€6",  desc: "Cosy Viennese-style café, excellent pastries, beloved by students" },
    { name: "Brunch & Co.",         area: "Quadrate",    type: "Brunch",      emoji: "🍳", opens: 9,  closes: 15, hot: true,  price: "~€15", desc: "Weekend brunch buffet — eggs 7 ways, prosecco included on Sundays" },
    { name: "Morgenstern",          area: "Lindenhof",   type: "Café",        emoji: "🌅", opens: 7,  closes: 16, hot: false, price: "~€7",  desc: "Local neighbourhood spot with fresh bakes every morning" },
    { name: "Weinkeller Wasserturm",area: "Wasserturm",  type: "Wine brunch", emoji: "🍷", opens: 11, closes: 15, hot: true,  price: "~€20", desc: "Sunday wine brunch with regional wines and charcuterie" },
  ],
  heidelberg: [
    { name: "Café Knösel",          area: "Altstadt",    type: "Café",        emoji: "🥐", opens: 9,  closes: 18, hot: true,  price: "~€8",  desc: "Heidelberg's oldest café — Studentenkuss chocolates, beautiful terrace", instagram: "cafe_knoesel" },
    { name: "Kulturbrauerei",       area: "Altstadt",    type: "Brunch",      emoji: "🍺", opens: 10, closes: 15, hot: true,  price: "~€14", desc: "Historic brewery turned brunch spot — Sunday buffet with live jazz" },
    { name: "Goldener Hecht",       area: "Altstadt",    type: "Café",        emoji: "🐟", opens: 9,  closes: 17, hot: false, price: "~€10", desc: "Classic old-town café with Neckar terrace views" },
    { name: "Backmulde",            area: "Altstadt",    type: "Bakery café", emoji: "🥖", opens: 7,  closes: 14, hot: false, price: "~€5",  desc: "Best bread in Heidelberg — sourdough, pastries, strong coffee" },
  ],
  frankfurt: [
    { name: "Metropol Café",        area: "Sachsenhausen",type: "Café",       emoji: "☕", opens: 8,  closes: 18, hot: true,  price: "~€9",  desc: "Hipster café in Sachsenhausen — filter coffee, avocado toast, long waits" },
    { name: "Café Liebfrauenberg",  area: "Innenstadt",  type: "Brunch",      emoji: "🍳", opens: 9,  closes: 16, hot: true,  price: "~€15", desc: "Weekend brunch buffet in the shadow of the Liebfrauenkirche" },
    { name: "Kleinmarkthalle",      area: "Innenstadt",  type: "Market",      emoji: "🛒", opens: 8,  closes: 18, hot: true,  price: "~€5",  desc: "Frankfurt's indoor market — cheeses, meats, fresh juice, street food" },
    { name: "Café Kante",           area: "Bornheim",    type: "Café",        emoji: "🌿", opens: 9,  closes: 17, hot: false, price: "~€8",  desc: "Quiet neighbourhood café with homemade food and natural light" },
  ],
  stuttgart: [
    { name: "Café Muse",            area: "Mitte",       type: "Café",        emoji: "☕", opens: 8,  closes: 17, hot: true,  price: "~€8",  desc: "Stuttgart's favourite specialty coffee spot — single origin, seasonal menu", instagram: "cafemuse_stgt" },
    { name: "Markthalle Stuttgart", area: "Innenstadt",  type: "Market",      emoji: "🛒", opens: 7,  closes: 18, hot: true,  price: "~€5",  desc: "Beautiful Art Nouveau market hall — best Maultaschen, local produce" },
    { name: "Stuttgarter Brunch",   area: "Schlossgarten",type: "Brunch",     emoji: "🍳", opens: 10, closes: 15, hot: true,  price: "~€18", desc: "Sunday brunch in the Schlossgarten — outdoor tables, full menu" },
    { name: "Café Rosenau",         area: "West",        type: "Café",        emoji: "🌹", opens: 9,  closes: 18, hot: false, price: "~€7",  desc: "Stuttgart West neighbourhood staple — locals only, great Kuchen" },
  ],
  karlsruhe: [
    { name: "Café Palaver",         area: "Innenstadt",  type: "Café",        emoji: "☕", opens: 9,  closes: 17, hot: true,  price: "~€7",  desc: "Students' favourite in the Kaiserstraße area — cozy, cheap, excellent coffee" },
    { name: "Badisches Brauhaus",   area: "Durlach",     type: "Brunch",      emoji: "🍺", opens: 10, closes: 15, hot: true,  price: "~€14", desc: "Local brewery brunch on Sundays — Baden specialties, Bier included" },
    { name: "Marktplatz Food",      area: "Marktplatz",  type: "Market",      emoji: "🛒", opens: 7,  closes: 13, hot: false, price: "~€5",  desc: "Sat & Wed market — fresh bread, local cheese, sausages, flowers" },
  ],
  berlin: [
    { name: "Silo Coffee",          area: "Friedrichshain",type: "Café",      emoji: "☕", opens: 8,  closes: 16, hot: true,  price: "~€10", desc: "Berlin's most hyped brunch — mushroom toast, flat whites, expect a queue", instagram: "silocoffee" },
    { name: "Five Elephant",        area: "Kreuzberg",   type: "Café",        emoji: "🐘", opens: 8,  closes: 18, hot: true,  price: "~€9",  desc: "World-class cheesecake and specialty coffee — a Berlin institution", instagram: "fiveelephant" },
    { name: "Bonanza Coffee",       area: "Prenzlauer Berg",type: "Café",     emoji: "🌿", opens: 8,  closes: 17, hot: true,  price: "~€6",  desc: "Berlin's original third-wave roaster — roastery café, outdoor courtyard", instagram: "bonanzacoffee" },
    { name: "Anna Blume",           area: "Prenzlauer Berg",type: "Brunch",   emoji: "🌸", opens: 9,  closes: 17, hot: true,  price: "~€16", desc: "Flower shop café — weekend brunch buffet, stunning floral interior, queue always there", instagram: "cafe_anna_blume" },
    { name: "Café Luzia",           area: "Kreuzberg",   type: "Café",        emoji: "🍹", opens: 9,  closes: 18, hot: false, price: "~€8",  desc: "Kreuzberg cool — morning cocktails, pancakes, tattooed baristas", instagram: "cafe_luzia" },
    { name: "Zola",                 area: "Prenzlauer Berg",type: "Brunch",   emoji: "🥂", opens: 10, closes: 16, hot: false, price: "~€18", desc: "Upscale weekend brunch with natural wines and French vibes" },
  ],
  munich: [
    { name: "Cotidiano",            area: "Schwabing",   type: "Café",        emoji: "🇮🇹", opens: 8,  closes: 17, hot: true,  price: "~€9",  desc: "Italian-style all-day café — best cornetto in Munich, strong espresso", instagram: "cotidiano_munich" },
    { name: "Park Café",            area: "Maximilianspark",type: "Brunch",   emoji: "🌳", opens: 9,  closes: 17, hot: true,  price: "~€18", desc: "Beautiful park setting — Sunday brunch with live music, great terrace" },
    { name: "Cafe Frischhut",       area: "Viktualienmarkt",type: "Traditional",emoji: "🥐", opens: 5, closes: 14, hot: true,  price: "~€4",  desc: "Old Munich institution — Schmalznudeln (fried pastry) eaten standing, cash only", instagram: "cafeschmalznudel" },
    { name: "Rosi",                 area: "Neuhausen",   type: "Café",        emoji: "🌹", opens: 8,  closes: 16, hot: false, price: "~€8",  desc: "Munich neighbourhood gem — excellent coffee, homemade pastries, no hype" },
    { name: "Viktualienmarkt",      area: "Innenstadt",  type: "Market",      emoji: "🛒", opens: 8,  closes: 18, hot: true,  price: "~€6",  desc: "Munich's daily food market — sausages, cheese, fresh bread, beer garden" },
  ],
  cologne: [
    { name: "Die Mehlwerkstatt",    area: "Ehrenfeld",   type: "Bakery café", emoji: "🥖", opens: 7,  closes: 15, hot: true,  price: "~€6",  desc: "Artisan sourdough bakery — long queues for a reason, best bread in Cologne", instagram: "mehlwerkstatt" },
    { name: "Café Caprista",        area: "Innenstadt",  type: "Café",        emoji: "🇮🇹", opens: 8,  closes: 17, hot: true,  price: "~€8",  desc: "Italian breakfast culture all day — proper espresso, tiramisu, cornetti" },
    { name: "Südlicht Cafe",        area: "Sülz",        type: "Café",        emoji: "☀️", opens: 9,  closes: 17, hot: false, price: "~€7",  desc: "Quiet student café in Sülz — natural light, homemade cakes, local crowd" },
    { name: "Markt am Rudolfplatz", area: "Innenstadt",  type: "Market",      emoji: "🛒", opens: 7,  closes: 14, hot: false, price: "~€5",  desc: "Weekly Saturday market — local farmers, bread, cheese, flowers" },
    { name: "Café Orlando",         area: "Friesenplatz",type: "Brunch",      emoji: "🍳", opens: 9,  closes: 16, hot: true,  price: "~€15", desc: "Cologne brunch institution — Sunday buffet, great Eggs Benny, always packed" },
  ],
}

function BrunchTab({ city }: { city: string }) {
  const h     = new Date().getHours()
  const spots = BRUNCH_BY_CITY[city] ?? BRUNCH_BY_CITY.mannheim
  const open  = spots.filter(s => h >= s.opens && h < s.closes)
  const later = spots.filter(s => h < s.opens)
  const closed= spots.filter(s => h >= s.closes)

  function Section({ title, items, dim }: { title: string; items: BrunchSpot[]; dim?: boolean }) {
    if (!items.length) return null
    return (
      <div className={dim ? "opacity-50" : ""}>
        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-3" style={{ color: "var(--accent)" }}>{title}</p>
        <div className="space-y-3">
          {items.map(s => (
            <div key={s.name} className="szene-card p-4 flex gap-3">
              <div className="text-2xl flex-shrink-0 mt-0.5">{s.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-sm font-bold text-szene">{s.name}</p>
                  {s.hot && <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">🔥 Hot</span>}
                </div>
                <p className="text-[10px] text-muted mb-1">{s.area} · {s.type}{s.price ? ` · ${s.price}` : ""}</p>
                <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-faint">⏰ {s.opens}:00–{s.closes > 23 ? `${s.closes - 24}:00+1` : `${s.closes}:00`}</span>
                  {s.instagram && (
                    <a href={`https://instagram.com/${s.instagram}`} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] transition-opacity hover:opacity-70" style={{ color: "var(--accent)" }}>
                      @{s.instagram}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <p className="text-[10px] text-violet-400 uppercase tracking-[0.2em] font-semibold mb-1">Daytime Guide</p>
        <h2 className="text-xl font-black text-szene tracking-tight">Cafés & Brunch spots</h2>
        <p className="text-xs text-muted mt-1">The best places to start your day in {city.charAt(0).toUpperCase() + city.slice(1)}</p>
      </div>
      {open.length === 0 && later.length === 0 && (
        <div className="szene-card p-6 text-center">
          <p className="text-2xl mb-2">😴</p>
          <p className="text-sm font-bold text-szene">Nothing open right now</p>
          <p className="text-xs text-muted mt-1">Most cafés open at 8am — check back in the morning</p>
        </div>
      )}
      <Section title={`Open now (${open.length})`} items={open} />
      <Section title="Opening later today" items={later} />
      <Section title="Closed today" items={closed} dim />
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "foryou",  label: "For You",  icon: Sparkles },
  { id: "events",  label: "Events",   icon: Calendar },
  { id: "tonight", label: "Tonight",  icon: MapPin },
  { id: "daytime", label: "Daytime",  icon: Sun },
  { id: "plan",    label: "Plan",     icon: ArrowUpRight },
  { id: "venues",  label: "Venues",   icon: Star },
  { id: "friends", label: "Friends",  icon: Users },
]

// ─── App Shell ────────────────────────────────────────────────────────────────
type Go = (opts: { city?: string; tab?: string }) => void

export function AppShell({
  city, go, tab, setTab,
}: {
  city: string; go: Go
  tab?: string; setTab?: (t: string) => void
}) {
  const [_tab, _setTab]     = useState("foryou")
  const activeTab           = tab ?? _tab
  const switchTab           = setTab ?? _setTab
  const [searchOpen, setSearchOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("szene_onboarded")) {
      setShowOnboarding(true)
    }
  }, [])

  function handleOnboardingDone(chosenCity: string, chosenVibes: string[]) {
    localStorage.setItem("szene_onboarded", "1")
    if (chosenVibes.length) localStorage.setItem("szene_vibes", JSON.stringify(chosenVibes))
    setShowOnboarding(false)
    go({ city: chosenCity || city })
  }

  function handleTabSwitch(t: string) {
    switchTab(t)
  }

  return (
    <div id="app-shell-top" className="min-h-screen bg-szene flex flex-col">
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      {/* Sticky bar */}
      <div className="sticky top-14 z-40 bg-sticky border-b border-szene">
        <div className="max-w-3xl mx-auto px-4">
          {searchOpen ? (
            <div className="py-3 flex gap-3 items-center">
              <div className="flex-1 bg-surface border border-szene rounded-xl px-4">
                <SearchSystem />
              </div>
              <button onClick={() => setSearchOpen(false)} className="text-muted hover:text-szene text-sm font-medium transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* City row */}
              <div className="flex items-center gap-2 pt-3 pb-2 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                {CITIES.map(c => (
                  <button key={c.id} onClick={() => go({ city: c.id })}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      city === c.id ? "pill-active" : "pill-inactive"
                    }`}>
                    {c.label}
                  </button>
                ))}
                <button onClick={() => setSearchOpen(true)}
                  className="ml-auto flex-shrink-0 w-8 h-8 rounded-xl bg-surface border border-szene flex items-center justify-center text-muted hover:text-szene hover:bg-surface transition-all">
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tab bar */}
              <div className="flex gap-1 pb-3 overflow-x-auto scrollbar-hide -mx-1 px-1">
                {TABS.map(t => {
                  const Icon   = t.icon
                  const active = activeTab === t.id
                  return (
                    <button key={t.id} onClick={() => handleTabSwitch(t.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        active ? "bg-accent text-white" : "text-muted hover:text-szene hover:bg-surface"
                      }`}>
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {activeTab === "foryou"  && <ForYouTab   city={city} />}
        {activeTab === "events"  && <EventsTab   city={city} />}
        {activeTab === "tonight" && <TonightTab  city={city} />}
        {activeTab === "daytime" && <BrunchTab   city={city} />}
        {activeTab === "plan"    && <PlannerTab  city={city} />}
        {activeTab === "venues"  && <VenuesTab   city={city} />}
        {activeTab === "friends" && <FriendsTab />}
      </div>
    </div>
  )
}
