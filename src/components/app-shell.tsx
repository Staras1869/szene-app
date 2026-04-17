"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, MapPin, Users, Search, Star, Check, ArrowUpRight, ExternalLink, Loader2, Share2, Copy, Sparkles } from "lucide-react"
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
}

const EVENTS: Record<string, EventItem[]> = {
  mannheim: [
    { id: "m1",  title: "Afrobeats Friday",       venue: "MS Connexion",      date: "Fr 18 Apr", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 143, vibe: "afro",    hot: true,  price: "€8",   desc: "Afrobeats, Afrohouse & Dancehall all night" },
    { id: "m2",  title: "Reggaeton Saturdays",     venue: "BASE Club",         date: "Sa 19 Apr", time: "23:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 118, vibe: "latin",   hot: true,  price: "€6",   desc: "Reggaeton, Dembow & Latin hits" },
    { id: "m3",  title: "UNMA Semesterparty",      venue: "Uni Mannheim Aula", date: "Do 17 Apr", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 312, vibe: "student", hot: true,  price: "Frei", desc: "Official Uni Mannheim semester kick-off" },
    { id: "m4",  title: "Latin Night Mannheim",    venue: "Tiffany Club",      date: "Sa 19 Apr", time: "22:30", emoji: "💃", cat: "Latin",   grad: "from-rose-800 to-pink-900",      going: 89,  vibe: "latin",   price: "€5" },
    { id: "m5",  title: "Hip-Hop Sessions",        venue: "Zeitraumexit",      date: "Fr 18 Apr", time: "22:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-zinc-800 to-neutral-900",   going: 76,  vibe: "hiphop",  price: "€6" },
    { id: "m6",  title: "Jungbusch Open Air",      venue: "Jungbusch Str.",    date: "Sa 19 Apr", time: "16:00", emoji: "🌆", cat: "Outside", grad: "from-violet-800 to-purple-900",  going: 201, vibe: "outside", hot: true,  price: "Frei" },
    { id: "m7",  title: "R&B & Soul Night",        venue: "Hemingway Bar",     date: "So 20 Apr", time: "20:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-amber-800 to-orange-900",   going: 54,  vibe: "hiphop" },
    { id: "m8",  title: "Electronic Sunday",       venue: "BASE Club",         date: "So 20 Apr", time: "22:00", emoji: "🎧", cat: "Party",   grad: "from-fuchsia-800 to-violet-900", going: 97,  vibe: "party" },
    { id: "m9",  title: "Afro House x Amapiano",  venue: "Alte Feuerwache",   date: "Sa 19 Apr", time: "21:00", emoji: "🌍", cat: "Afro",    grad: "from-yellow-800 to-amber-900",   going: 88,  vibe: "afro",    price: "€7" },
    { id: "m10", title: "Street Food Festival",    venue: "Alter Messplatz",   date: "Sa 19 Apr", time: "12:00", emoji: "🍜", cat: "Outside", grad: "from-emerald-800 to-teal-900",   going: 430, vibe: "outside", hot: true,  price: "Frei" },
    { id: "m11", title: "Jazz & Cocktails",        venue: "Ella & Louis",      date: "Fr 18 Apr", time: "19:30", emoji: "🎷", cat: "Live",    grad: "from-stone-800 to-zinc-900",     going: 38,  vibe: "music" },
    { id: "m12", title: "90s & 2000s Party",       venue: "Tiffany Club",      date: "Fr 18 Apr", time: "23:00", emoji: "💿", cat: "Party",   grad: "from-cyan-800 to-blue-900",      going: 134, vibe: "party",   price: "€6" },
  ],
  heidelberg: [
    { id: "h1",  title: "Afro Night Heidelberg",   venue: "halle02",           date: "Sa 19 Apr", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 97,  vibe: "afro",    hot: true,  price: "€8" },
    { id: "h2",  title: "Latin Thursdays",         venue: "Nachtschicht",      date: "Do 17 Apr", time: "22:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 73,  vibe: "latin",   price: "€5" },
    { id: "h3",  title: "Uni HD Semesterfeier",    venue: "Neue Uni Heidelberg",date:"Fr 18 Apr", time: "20:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-violet-900",    going: 245, vibe: "student", hot: true,  price: "Frei" },
    { id: "h4",  title: "Cave 54 Student Night",   venue: "Cave 54",           date: "Do 17 Apr", time: "22:00", emoji: "🎸", cat: "Uni",     grad: "from-indigo-800 to-blue-900",    going: 112, vibe: "student", price: "€3" },
    { id: "h5",  title: "Schloss Open Air",        venue: "Schloss Heidelberg",date: "Sa 19 Apr", time: "18:00", emoji: "🏰", cat: "Outside", grad: "from-stone-800 to-amber-900",    going: 189, vibe: "outside", hot: true },
    { id: "h6",  title: "Hip-Hop Basement",        venue: "halle02",           date: "Fr 18 Apr", time: "23:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-zinc-800 to-neutral-900",   going: 65,  vibe: "hiphop",  price: "€7" },
  ],
  frankfurt: [
    { id: "f1",  title: "Afrohouse Frankfurt",     venue: "Robert Johnson",    date: "Sa 19 Apr", time: "23:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-teal-900",     going: 280, vibe: "afro",    hot: true,  price: "€12" },
    { id: "f2",  title: "Reggaeton Saturdays FFM", venue: "King Kamehameha",   date: "Sa 19 Apr", time: "22:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 195, vibe: "latin",   hot: true,  price: "€8" },
    { id: "f3",  title: "Goethe Uni Party",        venue: "Club Voltaire",     date: "Do 17 Apr", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 178, vibe: "student", price: "€5" },
    { id: "f4",  title: "R&B Frankfurt",           venue: "Metropol",          date: "Fr 18 Apr", time: "22:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-fuchsia-800 to-pink-900",   going: 143, vibe: "hiphop",  price: "€8" },
    { id: "f5",  title: "Cocoon Night",            venue: "Cocoon Club",       date: "Sa 19 Apr", time: "23:00", emoji: "🔮", cat: "Party",   grad: "from-violet-900 to-black",       going: 310, vibe: "party",   hot: true,  price: "€15" },
    { id: "f6",  title: "Mainfest Open Air",       venue: "Mainufer",          date: "So 20 Apr", time: "12:00", emoji: "🌅", cat: "Outside", grad: "from-amber-700 to-orange-800",   going: 520, vibe: "outside", hot: true,  price: "Frei" },
    { id: "f7",  title: "Latin x Afro Fusion",     venue: "Zoom Frankfurt",    date: "Fr 18 Apr", time: "22:00", emoji: "💃", cat: "Latin",   grad: "from-rose-800 to-orange-900",    going: 167, vibe: "latin",   price: "€9" },
  ],
  ludwigshafen: [
    { id: "l1",  title: "Afro Night LU",           venue: "Das Haus",          date: "Sa 19 Apr", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 54,  vibe: "afro",    price: "€5" },
    { id: "l2",  title: "Rhein Beach Party",       venue: "Rheinufer",         date: "Sa 19 Apr", time: "16:00", emoji: "🌊", cat: "Outside", grad: "from-cyan-800 to-blue-900",      going: 88,  vibe: "outside", hot: true,  price: "Frei" },
    { id: "l3",  title: "Latin Sundays",           venue: "Rheinufer Bar",     date: "So 20 Apr", time: "15:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 41,  vibe: "latin",   price: "Frei" },
    { id: "l4",  title: "Hip-Hop im Hemshof",      venue: "Hemshof Café",      date: "Fr 18 Apr", time: "21:00", emoji: "🎤", cat: "Hip-Hop", grad: "from-zinc-800 to-neutral-900",   going: 33,  vibe: "hiphop" },
  ],
  karlsruhe: [
    { id: "k1",  title: "KIT Semesterparty",       venue: "Substage",          date: "Fr 18 Apr", time: "21:00", emoji: "🎓", cat: "Uni",     grad: "from-blue-800 to-indigo-900",    going: 220, vibe: "student", hot: true,  price: "€4" },
    { id: "k2",  title: "Afrobeats Karlsruhe",     venue: "Tollhaus",          date: "Sa 19 Apr", time: "22:00", emoji: "🌍", cat: "Afro",    grad: "from-green-800 to-emerald-900",  going: 76,  vibe: "afro",    price: "€7" },
    { id: "k3",  title: "Latin Night KA",          venue: "Substage",          date: "Sa 19 Apr", time: "23:00", emoji: "🔥", cat: "Latin",   grad: "from-orange-800 to-red-900",     going: 58,  vibe: "latin",   price: "€6" },
    { id: "k4",  title: "Kulturfestival Open Air", venue: "Tollhaus Garten",   date: "So 20 Apr", time: "14:00", emoji: "🎭", cat: "Outside", grad: "from-emerald-800 to-teal-900",   going: 95,  vibe: "outside", hot: true,  price: "Frei" },
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
    { id: "ms-connexion",   name: "MS Connexion",        area: "Hafen",       type: "Club",     emoji: "🎧", tag: "Afro · Electronic", vibe: "afro"    },
    { id: "base-club",      name: "BASE Club",           area: "Jungbusch",   type: "Club",     emoji: "🔊", tag: "Latin · Bass",      vibe: "latin"   },
    { id: "tiffany",        name: "Tiffany Club",        area: "C-Quadrat",   type: "Club",     emoji: "💜", tag: "Party · Premium",   vibe: "party"   },
    { id: "zeitraumexit",   name: "Zeitraumexit",        area: "Jungbusch",   type: "Club",     emoji: "🖤", tag: "Hip-Hop · Techno",  vibe: "hiphop"  },
    { id: "alte-feuerwache",name: "Alte Feuerwache",     area: "Jungbusch",   type: "Culture",  emoji: "🎭", tag: "Afro · Live",       vibe: "afro"    },
    { id: "ella-louis",     name: "Ella & Louis",        area: "Jungbusch",   type: "Jazz bar", emoji: "🎷", tag: "Jazz · Chill",      vibe: "music"   },
    { id: "skybar",         name: "Skybar Mannheim",     area: "Quadrate",    type: "Rooftop",  emoji: "🏙️", tag: "Views · Cocktails", vibe: "outside" },
    { id: "hemingway",      name: "Hemingway Bar",       area: "Innenstadt",  type: "Bar",      emoji: "🍸", tag: "Cocktails · Chill", vibe: "chill"   },
    { id: "weinkeller",     name: "Weinkeller",          area: "Wasserturm",  type: "Wine bar", emoji: "🍷", tag: "Wine · Jazz",       vibe: "chill"   },
  ],
  heidelberg: [
    { id: "halle02",        name: "halle02",             area: "Bahnstadt",   type: "Club",     emoji: "🏭", tag: "Afro · Electronic", vibe: "afro"    },
    { id: "cave-54",        name: "Cave 54",             area: "Altstadt",    type: "Club",     emoji: "🎸", tag: "Student · Rock",    vibe: "student" },
    { id: "nachtschicht",   name: "Nachtschicht",        area: "Bergheim",    type: "Club",     emoji: "🎶", tag: "Latin · Electronic",vibe: "latin"   },
    { id: "destille",       name: "Destille",            area: "Altstadt",    type: "Bar",      emoji: "🍺", tag: "Classic · Chill",   vibe: "chill"   },
    { id: "schloss-bg",     name: "Schloss Biergarten",  area: "Schloss",     type: "Outside",  emoji: "🏰", tag: "Views · Outdoor",   vibe: "outside" },
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
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "")
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
        className="flex items-center gap-1 text-xs text-white/40 hover:text-white/80 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.06]">
        <Share2 className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-1 bg-zinc-900 border border-white/[0.15] rounded-xl shadow-2xl overflow-hidden z-50 min-w-[140px]">
          <button onClick={wa} className="w-full text-left px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.07] flex items-center gap-2 transition-colors">
            <span>💬</span> WhatsApp
          </button>
          <button onClick={copyLink} className="w-full text-left px-3 py-2.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.07] flex items-center gap-2 border-t border-white/[0.08] transition-colors">
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
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
            vibe === v.id
              ? "bg-violet-600 text-white"
              : "border border-white/[0.15] text-white/55 hover:border-white/40 hover:text-white"
          }`}>
          <span>{v.emoji}</span>
          {v.label}
        </button>
      ))}
    </div>
  )
}

// ─── Event card ───────────────────────────────────────────────────────────────
function EventCard({ e, going, onToggle, user }: {
  e: EventItem; going: boolean; onToggle: () => void; user: any
}) {
  const isLive = !!(e as any).source
  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.07] transition-colors group">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${e.grad} flex items-center justify-center flex-shrink-0 text-2xl relative`}>
        {e.emoji}
        {e.hot && <span className="absolute -top-1.5 -right-1.5 text-[9px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-full">HOT</span>}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">{e.title}</p>
            <p className="text-xs text-white/50 mt-0.5 truncate">{e.venue}</p>
            {e.desc && <p className="text-xs text-white/35 mt-0.5 truncate">{e.desc}</p>}
          </div>
          <span className="text-[10px] text-white/40 border border-white/[0.12] px-2 py-0.5 rounded-full flex-shrink-0">{e.cat}</span>
        </div>
        <div className="flex items-center justify-between mt-2.5 gap-2">
          <div className="flex items-center gap-3 text-xs text-white/45 flex-wrap">
            {e.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>}
            {e.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>}
            {e.price && <span className={`font-semibold ${e.price === "Frei" ? "text-emerald-400" : "text-violet-400/80"}`}>{e.price}</span>}
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <ShareEvent title={e.title} />
            {user ? (
              <button onClick={onToggle}
                className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold transition-all flex-shrink-0 ${
                  going ? "bg-violet-600 text-white" : "border border-white/[0.15] text-white/50 hover:border-violet-400/50 hover:text-white"
                }`}>
                {going ? <><Check className="w-3 h-3" /> Going</> : <><Users className="w-3 h-3" /> {e.going}</>}
              </button>
            ) : (
              <Link href="/login" className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
                <Users className="w-3 h-3" /> {e.going}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── For You tab (recommendations) ───────────────────────────────────────────
function ForYouTab({ city }: { city: string }) {
  const { user } = useAuth()
  const [going, setGoing] = useState<Set<string>>(new Set())
  const events = EVENTS[city] ?? []
  const hot    = events.filter(e => e.hot)
  const afro   = events.filter(e => e.vibe === "afro")
  const latin  = events.filter(e => e.vibe === "latin")
  const uni    = events.filter(e => e.vibe === "student")
  const hiphop = events.filter(e => e.vibe === "hiphop")

  function toggle(id: string) {
    if (!user) return
    setGoing(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  function Section({ title, emoji, items }: { title: string; emoji: string; items: EventItem[] }) {
    if (!items.length) return null
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">{emoji}</span>
          <p className="text-sm font-bold text-white">{title}</p>
        </div>
        <div className="space-y-2">
          {items.slice(0, 3).map(e => (
            <EventCard key={e.id} e={e} going={going.has(e.id)} onToggle={() => toggle(e.id)} user={user} />
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
            <p className="text-sm font-bold text-white">Trending tonight</p>
          </div>
          <div className="space-y-2">
            {hot.map(e => (
              <EventCard key={e.id} e={e} going={going.has(e.id)} onToggle={() => toggle(e.id)} user={user} />
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

  const staticEvents = (EVENTS[city] ?? []).filter(e => vibe === "all" || e.vibe === vibe)
  const allEvents    = liveEvents.length > 0 ? liveEvents : staticEvents

  function toggle(id: string) {
    if (!user) return
    setGoing(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
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
        <span className="text-xs text-white/45 uppercase tracking-widest">
          {open.length ? `${open.length} open now` : "Opening soon"}
        </span>
      </div>
      {show.length === 0 ? (
        <p className="text-white/30 text-sm py-10 text-center">Nothing in this vibe right now — try another.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {show.map(v => (
            <Link key={v.name} href={`/venue/${toSlug(v.name)}`}
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.09] hover:border-violet-500/30 transition-colors group">
              <span className="text-2xl flex-shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">{v.name}</p>
                  {v.hot && <span className="text-[9px] text-orange-400 font-bold bg-orange-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">Hot</span>}
                </div>
                <p className="text-xs text-white/45 mt-0.5">{v.type} · {v.area}</p>
              </div>
              <span className={`text-[10px] font-bold flex-shrink-0 ${open.includes(v) ? "text-emerald-400" : "text-white/30"}`}>
                {open.includes(v) ? "Open" : `${v.opens}:00`}
              </span>
            </Link>
          ))}
        </div>
      )}
      {soon.length > 0 && (
        <div>
          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2 font-semibold">Opening within 3h</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {soon.map(v => (
              <div key={v.name} className="flex items-center gap-2 p-3 rounded-xl border border-white/[0.08] opacity-50">
                <span className="text-lg">{v.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-white/70 truncate">{v.name}</p>
                  <p className="text-[10px] text-white/40 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{v.opens}:00</p>
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
        <p className="text-white/30 text-sm py-10 text-center">No venues in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(v => (
            <Link key={v.id} href={`/venue/${toSlug(v.name)}`}
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.10] bg-white/[0.04] hover:bg-white/[0.09] hover:border-violet-500/30 transition-all group">
              <span className="text-2xl flex-shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">{v.name}</p>
                <p className="text-xs text-white/45 mt-0.5">{v.area}</p>
              </div>
              <span className="text-[10px] text-violet-400/60 border border-violet-500/20 px-2 py-0.5 rounded-full flex-shrink-0 text-right leading-tight">{v.tag}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 transition-colors flex-shrink-0" />
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
        <h3 className="text-white font-bold mb-2">See where your friends are</h3>
        <p className="text-white/40 text-sm mb-8 max-w-xs">Sign in to follow friends and see their check-ins live.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/login" className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold text-center hover:bg-white/90 transition-colors">Sign in</Link>
          <Link href="/register" className="w-full border border-white/[0.15] text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold text-center hover:border-white/30 transition-colors">Create account — free</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-white/30 text-sm">No activity yet — follow people from their profile.</p>
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
export function AppShell({
  city, setCity, tab, setTab,
}: {
  city: string; setCity: (c: string) => void
  tab?: string; setTab?: (t: string) => void
}) {
  const [_tab, _setTab]     = useState("foryou")
  const activeTab           = tab ?? _tab
  const switchTab           = setTab ?? _setTab
  const [searchOpen, setSearchOpen] = useState(false)

  function handleTabSwitch(t: string) {
    switchTab(t)
    document.getElementById("app-shell-top")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div id="app-shell-top" className="min-h-screen bg-black flex flex-col">
      {/* Sticky bar */}
      <div className="sticky top-14 z-40 bg-black/95 backdrop-blur-xl border-b border-white/[0.10]">
        <div className="max-w-3xl mx-auto px-4">
          {searchOpen ? (
            <div className="py-3 flex gap-3 items-center">
              <div className="flex-1 bg-white/[0.06] border border-white/[0.15] rounded-xl px-4">
                <SearchSystem />
              </div>
              <button onClick={() => setSearchOpen(false)} className="text-white/50 hover:text-white text-sm font-medium transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <>
              {/* City row */}
              <div className="flex items-center gap-2 pt-3 pb-2 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                {CITIES.map(c => (
                  <button key={c.id} onClick={() => setCity(c.id)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      city === c.id
                        ? "bg-white text-black"
                        : "border border-white/[0.15] text-white/55 hover:border-white/35 hover:text-white"
                    }`}>
                    {c.label}
                  </button>
                ))}
                <button onClick={() => setSearchOpen(true)}
                  className="ml-auto flex-shrink-0 w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.15] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.10] transition-all">
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
                        active ? "bg-violet-600 text-white" : "text-white/50 hover:text-white hover:bg-white/[0.06]"
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
