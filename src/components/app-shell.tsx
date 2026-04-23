"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, MapPin, Users, Search, Star, Check, ArrowUpRight, ExternalLink, Loader2, Share2, Copy, Sparkles, Navigation, ParkingCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { SearchSystem } from "./search-system"

// ─── Cities ──────────────────────────────────────────────────────────────────
const CITIES = [
  { id: "mannheim",     label: "Mannheim" },
  { id: "heidelberg",   label: "Heidelberg" },
  { id: "frankfurt",    label: "Frankfurt" },
  { id: "ludwigshafen", label: "Ludwigshafen" },
  { id: "karlsruhe",    label: "Karlsruhe" },
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
    { id: "m2",  title: "Alma x Jungbusch Night",  venue: "Alte Feuerwache",     day: 6, date: "", time: "23:00", emoji: "🌃", cat: "Party",   grad: "from-violet-800 to-purple-900",  going: 287, vibe: "party",   hot: true,  price: "€5",   dresscode: "Streetwear",      desc: "Alma bringt die Jungbusch-Crew zusammen", instagram: "alma.mannheim", tickets: "https://www.altefeuerwache.com", image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
    { id: "m3",  title: "Kaizen Cocktail Night",   venue: "Kaizen Mannheim",     day: 5, date: "", time: "20:00", emoji: "🍸", cat: "Chill",   grad: "from-stone-800 to-zinc-900",     going: 44,  vibe: "chill",              price: "—",    dresscode: "Casual",          desc: "Versteckter Geheimtipp — beste Cocktails in Mannheim", instagram: "kaizen.mannheim", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=500&fit=crop&auto=format" },
    { id: "m4",  title: "ZEPHYR Late Night",        venue: "ZEPHYR Bar",          day: 6, date: "", time: "21:00", emoji: "🌬️", cat: "Chill",   grad: "from-slate-800 to-zinc-900",     going: 31,  vibe: "chill",              price: "—",    dresscode: "Smart casual",    desc: "Intime Bar, kein Hype, nur gute Drinks", instagram: "zephyr.mannheim", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=500&fit=crop&auto=format" },
    { id: "m5",  title: "Afrobeats x Amapiano",    venue: "MS Connexion",        day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 189, vibe: "afro",    hot: true,  price: "€8",   dresscode: "Fashionable",     desc: "Afrobeats, Afrohouse & Amapiano — größte Afro-Night der Region", instagram: "msconnexion_mannheim", website: "https://www.msconnexion.de", tickets: "https://www.msconnexion.de", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop&auto=format" },
    { id: "m6",  title: "Reggaeton Saturdays",      venue: "BASE Club",           day: 6, date: "", time: "23:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 156, vibe: "latin",   hot: true,  price: "€6",   dresscode: "Streetwear",      desc: "Reggaeton, Dembow & Latin vibes", instagram: "baseclub_mannheim", website: "https://www.base-club.de", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format" },
    { id: "m7",  title: "Latin Night x Salsa",      venue: "Tiffany Club",        day: 5, date: "", time: "22:00", emoji: "💃", cat: "Latin",   grad: "from-rose-800 to-pink-900",      going: 93,  vibe: "latin",              price: "€5",   dresscode: "Elegant casual",  instagram: "tiffany_club_mannheim", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "m8",  title: "Trap & RnB Session",       venue: "Zeitraumexit",        day: 5, date: "", time: "23:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-zinc-800 to-neutral-900",   going: 88,  vibe: "hiphop",             price: "€6",   dresscode: "Streetwear",      desc: "Underground Hip-Hop im Jungbusch", instagram: "zeitraumexit", website: "https://www.zeitraumexit.de", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop&auto=format" },
    { id: "m9",  title: "Old School Hip-Hop Night", venue: "Plan B Mannheim",     day: 0, date: "", time: "21:00", emoji: "🎧", cat: "Hip-Hop", grad: "from-zinc-700 to-zinc-900",      going: 62,  vibe: "hiphop",             price: "€5",   dresscode: "Casual",          instagram: "planb_mannheim", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&auto=format" },
    { id: "m10", title: "Strandbar Rennwiese",      venue: "Strandbar Rennwiese", day: 6, date: "", time: "15:00", emoji: "🏖️", cat: "Outside", grad: "from-cyan-800 to-blue-900",      going: 320, vibe: "outside", hot: true,  price: "Frei", dresscode: "Beach vibes",     desc: "Beachbar direkt am Rhein — das Open-Air-Wohnzimmer", instagram: "strandbar.rennwiese", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "m11", title: "Afro House Night",         venue: "Alte Feuerwache",     day: 6, date: "", time: "21:00", emoji: "🌍", cat: "Afro",    grad: "from-yellow-800 to-amber-900",   going: 104, vibe: "afro",               price: "€7",   dresscode: "Fashionable",     instagram: "altefeuerwache_mannheim", website: "https://www.altefeuerwache.com", tickets: "https://www.altefeuerwache.com", image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=500&fit=crop&auto=format" },
    { id: "m12", title: "7Grad Underground Night",  venue: "7Grad Mannheim",      day: 5, date: "", time: "23:00", emoji: "❄️", cat: "Party",   grad: "from-fuchsia-800 to-violet-900", going: 77,  vibe: "party",              price: "€6",   dresscode: "Black preferred", desc: "Techno & Electronic im Untergrund", instagram: "7grad.mannheim", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop&auto=format" },
    { id: "m13", title: "Jazz & Cocktails",         venue: "Ella & Louis",        day: 5, date: "", time: "19:30", emoji: "🎷", cat: "Live",    grad: "from-amber-800 to-orange-900",   going: 41,  vibe: "music",              price: "Frei", dresscode: "Smart casual",    instagram: "ellaandlouis_mannheim", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop&auto=format" },
    { id: "m14", title: "AStA Semesterparty",       venue: "Galerie Kurzzeit",    day: 4, date: "", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-700 to-indigo-900",    going: 198, vibe: "student",            price: "€3",   dresscode: "Casual",          desc: "Vom AStA organisiert — günstig, voll, legendär", instagram: "asta_mannheim", website: "https://www.asta.uni-mannheim.de", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop&auto=format" },
  ],
  heidelberg: [
    { id: "h1", title: "Afro Night HD",            venue: "halle02",            day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 112, vibe: "afro",    hot: true,  price: "€8",   dresscode: "Fashionable",  instagram: "halle02_heidelberg", website: "https://www.halle02.de", image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=500&fit=crop&auto=format" },
    { id: "h2", title: "Latin Thursdays",          venue: "Nachtschicht",       day: 4, date: "", time: "22:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 84,  vibe: "latin",              price: "€5",   dresscode: "Casual",       instagram: "nachtschicht_hd", image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "h3", title: "Uni HD Semesterparty",     venue: "Neue Uni Heidelberg",day: 5, date: "", time: "20:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-violet-900",    going: 310, vibe: "student", hot: true,  price: "Frei", dresscode: "Casual",       instagram: "uniheidelberg", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop&auto=format" },
    { id: "h4", title: "Cave 54 Student Night",    venue: "Cave 54",            day: 4, date: "", time: "22:00", emoji: "🎸", cat: "Uni",     grad: "from-indigo-800 to-blue-900",    going: 128, vibe: "student",            price: "€3",   dresscode: "Casual",       instagram: "cave54hd", website: "https://www.cave54.de", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop&auto=format" },
    { id: "h5", title: "O'Brien's Pub Night",      venue: "O'Brien's",          day: 5, date: "", time: "20:00", emoji: "🍺", cat: "Chill",   grad: "from-amber-800 to-yellow-900",   going: 67,  vibe: "chill",              price: "—",    dresscode: "Casual",       image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=500&fit=crop&auto=format" },
    { id: "h6", title: "Billy Blues Live Music",   venue: "Billy Blues",        day: 6, date: "", time: "21:00", emoji: "🎸", cat: "Live",    grad: "from-blue-800 to-indigo-900",    going: 55,  vibe: "music",              price: "€7",   dresscode: "Smart casual", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop&auto=format" },
    { id: "h7", title: "Schloss Open Air",         venue: "Schloss Heidelberg", day: 6, date: "", time: "18:00", emoji: "🏰", cat: "Outside", grad: "from-stone-800 to-amber-900",    going: 220, vibe: "outside", hot: true,  price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "h8", title: "Harmoniegarten Sundowner", venue: "Harmoniegarten",     day: 0, date: "", time: "16:00", emoji: "🌿", cat: "Outside", grad: "from-emerald-800 to-teal-900",   going: 89,  vibe: "outside",            price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&auto=format" },
  ],
  frankfurt: [
    { id: "f1", title: "Afrohouse Frankfurt",      venue: "Robert Johnson",     day: 6, date: "", time: "23:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-teal-900",     going: 280, vibe: "afro",    hot: true,  price: "€12",  dresscode: "Fashionable",  instagram: "robertjohnson_club", website: "https://www.robert-johnson.de", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop&auto=format" },
    { id: "f2", title: "Reggaeton Saturdays FFM",  venue: "King Kamehameha",    day: 6, date: "", time: "22:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 195, vibe: "latin",   hot: true,  price: "€8",   dresscode: "Streetwear",   instagram: "king.kamehameha", website: "https://www.king-kamehameha.de", image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format" },
    { id: "f3", title: "Goethe Uni Party",         venue: "Club Voltaire",      day: 4, date: "", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 178, vibe: "student",            price: "€5",   dresscode: "Casual",       image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&h=500&fit=crop&auto=format" },
    { id: "f4", title: "R&B Frankfurt",            venue: "Metropol",           day: 5, date: "", time: "22:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-fuchsia-800 to-pink-900",   going: 143, vibe: "hiphop",             price: "€8",   dresscode: "Streetwear",   instagram: "metropol_ffm", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop&auto=format" },
    { id: "f5", title: "Cocoon Night",             venue: "Cocoon Club",        day: 6, date: "", time: "23:00", emoji: "🔮", cat: "Party",   grad: "from-violet-900 to-black",       going: 310, vibe: "party",   hot: true,  price: "€15",  dresscode: "Dark / Techno",instagram: "cocoonclub", website: "https://www.cocoon.net", image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=500&fit=crop&auto=format" },
    { id: "f6", title: "Main Open Air",            venue: "Mainufer",           day: 0, date: "", time: "12:00", emoji: "🌅", cat: "Outside", grad: "from-amber-700 to-orange-800",   going: 520, vibe: "outside", hot: true,  price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "f7", title: "Latin x Afro Fusion",      venue: "Zoom Frankfurt",     day: 5, date: "", time: "22:00", emoji: "💃", cat: "Latin",   grad: "from-rose-800 to-orange-900",    going: 167, vibe: "latin",              price: "€9",   dresscode: "Fashionable",  image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
  ],
  ludwigshafen: [
    { id: "l1", title: "Afro Night LU",            venue: "Das Haus",           day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 54,  vibe: "afro",               price: "€5",   dresscode: "Casual",       instagram: "dashaus_lu", image: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=500&fit=crop&auto=format" },
    { id: "l2", title: "Rhein Beach Party",        venue: "Rheinufer",          day: 6, date: "", time: "16:00", emoji: "🌊", cat: "Outside", grad: "from-cyan-800 to-blue-900",      going: 88,  vibe: "outside", hot: true,  price: "Frei", dresscode: "Beach vibes",  image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format" },
    { id: "l3", title: "Latin Sundays",            venue: "Rheinufer Bar",      day: 0, date: "", time: "15:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 41,  vibe: "latin",              price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=500&fit=crop&auto=format" },
    { id: "l4", title: "Hip-Hop im Hemshof",       venue: "Hemshof Café",       day: 5, date: "", time: "21:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-zinc-800 to-neutral-900",   going: 33,  vibe: "hiphop",             price: "€4",   dresscode: "Streetwear",   image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=500&fit=crop&auto=format" },
  ],
  karlsruhe: [
    { id: "k1", title: "KIT Semesterparty",        venue: "Substage",           day: 5, date: "", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 220, vibe: "student", hot: true,  price: "€4",   dresscode: "Casual",       instagram: "substage_ka", website: "https://www.substage.de", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=500&fit=crop&auto=format" },
    { id: "k2", title: "Afrobeats Karlsruhe",      venue: "Tollhaus",           day: 6, date: "", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 76,  vibe: "afro",               price: "€7",   dresscode: "Fashionable",  instagram: "tollhaus_ka", website: "https://www.tollhaus.de", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=500&fit=crop&auto=format" },
    { id: "k3", title: "Latin Night KA",           venue: "Substage",           day: 6, date: "", time: "23:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 58,  vibe: "latin",              price: "€6",   dresscode: "Streetwear",   image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=500&fit=crop&auto=format" },
    { id: "k4", title: "Kulturfestival Open Air",  venue: "Tollhaus Garten",    day: 0, date: "", time: "14:00", emoji: "🎭", cat: "Outside", grad: "from-emerald-800 to-teal-900",   going: 95,  vibe: "outside", hot: true,  price: "Frei", dresscode: "Casual",       image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=500&fit=crop&auto=format" },
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
  ludwigshafen: [
    { name: "Das Haus",              area: "Mitte",       type: "Club",     emoji: "🏠", opens: 22, closes: 29, hot: false, vibe: "afro" },
    { name: "Rheinufer Bar",         area: "Rheinufer",   type: "Bar",      emoji: "🌊", opens: 17, closes: 25, hot: true,  vibe: "outside" },
    { name: "Hemshof Café",          area: "Hemshof",     type: "Café",     emoji: "☕", opens: 8,  closes: 22, hot: false, vibe: "chill" },
  ],
  karlsruhe: [
    { name: "Substage",              area: "Südstadt",    type: "Club",     emoji: "🎸", opens: 21, closes: 30, hot: true,  vibe: "student" },
    { name: "Tollhaus",              area: "Oststadt",    type: "Culture",  emoji: "🎭", opens: 19, closes: 26, hot: false, vibe: "afro" },
    { name: "Hemingway KA",          area: "Innenstadt",  type: "Bar",      emoji: "🍸", opens: 18, closes: 25, hot: false, vibe: "chill" },
    { name: "Kühler Krug",           area: "Günther-K.",  type: "Garden",   emoji: "🌿", opens: 15, closes: 23, hot: false, vibe: "outside" },
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
  ludwigshafen: [
    { id: "das-haus",       name: "Das Haus",            area: "Mitte",       type: "Club",     emoji: "🏠", tag: "Afro · Party",      vibe: "afro"    },
    { id: "rheinufer-bar",  name: "Rheinufer Bar",       area: "Rheinufer",   type: "Bar",      emoji: "🌊", tag: "Outdoor · Views",   vibe: "outside" },
    { id: "hemshof",        name: "Hemshof Café",        area: "Hemshof",     type: "Café",     emoji: "☕", tag: "Chill · Local",     vibe: "chill"   },
  ],
  karlsruhe: [
    { id: "substage",       name: "Substage",            area: "Südstadt",    type: "Club",     emoji: "🎸", tag: "Student · Live",    vibe: "student" },
    { id: "tollhaus",       name: "Tollhaus",            area: "Oststadt",    type: "Culture",  emoji: "🎭", tag: "Afro · Culture",    vibe: "afro"    },
    { id: "hemingway-ka",   name: "Hemingway KA",        area: "Innenstadt",  type: "Bar",      emoji: "🍸", tag: "Cocktails · Chill", vibe: "chill"   },
    { id: "kuhler-krug",    name: "Kühler Krug",         area: "Günther-K.",  type: "Garden",   emoji: "🌿", tag: "Beer garden",       vibe: "outside" },
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
function EventCard({ e, going, onToggle, user, city }: {
  e: EventItem; going: boolean; onToggle: () => void; user: any; city?: string
}) {
  const [expanded, setExpanded] = useState(false)
  const mapQuery     = encodeURIComponent(`${e.venue}${city ? `, ${city}` : ""}`)
  const parkingQuery = encodeURIComponent(`parking near ${e.venue}${city ? `, ${city}` : ""}`)
  return (
    <div className="szene-card group overflow-hidden">
      {/* Main row */}
      <button className="w-full text-left" onClick={() => setExpanded(x => !x)}>
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
                <span className="text-[10px] text-faint border border-szene px-2 py-0.5 rounded-full flex-shrink-0">{e.cat}</span>
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
  const hot    = events.filter(e => e.hot)
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
            <EventCard key={e.id} e={e} going={going.has(e.id)} onToggle={() => toggle(e.id)} user={user} city={city} />
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
              <EventCard key={e.id} e={e} going={going.has(e.id)} onToggle={() => toggle(e.id)} user={user} city={city} />
            ))}
          </div>
        </div>
      )}
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
  const [going, setGoing]   = useState<Set<string>>(new Set())
  const [liveEvents, setLiveEvents] = useState<any[]>([])
  const [liveLoading, setLiveLoading] = useState(false)
  const [sources, setSources] = useState<any>(null)

  useEffect(() => {
    setLiveLoading(true)
    setLiveEvents([])
    fetch(`/api/discover/live?city=${city}&vibe=${vibe}`)
      .then(r => r.json())
      .then(d => { setLiveEvents(d.events ?? []); setSources(d.sources) })
      .catch(() => {})
      .finally(() => setLiveLoading(false))
  }, [city, vibe])

  const staticEvents = hydrateDates(EVENTS[city] ?? []).filter(e => vibe === "all" || e.vibe === vibe)
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
            const isLive  = !!e.source
            const cat     = e.category ?? e.cat ?? "Event"
            const grad    = e.grad ?? GRAD_BY_CAT[cat] ?? GRAD_BY_CAT.Event
            const emoji   = e.emoji ?? "✦"
            const price   = e.price ?? null
            const url     = e.url ?? null
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
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <ShareEvent title={e.title} url={url ?? undefined} />
                      {!isLive && (
                        user ? (
                          <button onClick={() => toggle(e.id)}
                            className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold transition-all flex-shrink-0 ${
                              going.has(e.id) ? "bg-violet-600 text-white" : "border border-white/[0.15] text-white/50 hover:border-violet-400/50 hover:text-white"
                            }`}>
                            {going.has(e.id) ? <><Check className="w-3 h-3" /> Going</> : <><Users className="w-3 h-3" /> {e.going ?? 0}</>}
                          </button>
                        ) : (
                          <Link href="/login" className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
                            <Users className="w-3 h-3" /> {e.going ?? 0}
                          </Link>
                        )
                      )}
                    </div>
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
  const [vibe, setVibe] = useState("all")
  const cityVenues  = VENUES_BY_CITY[city] ?? []
  const filtered    = vibe === "all" ? cityVenues : cityVenues.filter(v => v.vibe === vibe)

  return (
    <div className="space-y-5">
      <VibeBar vibe={vibe} setVibe={setVibe} />
      {filtered.length === 0 ? (
        <p className="text-faint text-sm py-10 text-center">No venues in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(v => (
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
          ))}
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

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "foryou",  label: "For You",  icon: Sparkles },
  { id: "events",  label: "Events",   icon: Calendar },
  { id: "tonight", label: "Tonight",  icon: MapPin },
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
        {activeTab === "foryou"  && <ForYouTab  city={city} />}
        {activeTab === "events"  && <EventsTab  city={city} />}
        {activeTab === "tonight" && <TonightTab city={city} />}
        {activeTab === "venues"  && <VenuesTab  city={city} />}
        {activeTab === "friends" && <FriendsTab />}
      </div>
    </div>
  )
}
