"use client"

import { useState } from "react"
import { Clock, Calendar, MapPin, Users, Search, Zap, Check, ArrowUpRight, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { SearchSystem } from "./search-system"

// ─── Cities ──────────────────────────────────────────────────────────────────

const CITIES = [
  { id: "mannheim",    label: "Mannheim" },
  { id: "heidelberg",  label: "Heidelberg" },
  { id: "frankfurt",   label: "Frankfurt" },
  { id: "ludwigshafen",label: "Ludwigshafen" },
  { id: "karlsruhe",   label: "Karlsruhe" },
]

// ─── Vibes / categories ───────────────────────────────────────────────────────

const VIBES = [
  { id: "all",     label: "All",      emoji: "✦" },
  { id: "party",   label: "Party",    emoji: "🔥" },
  { id: "chill",   label: "Chill",    emoji: "🍷" },
  { id: "music",   label: "Music",    emoji: "🎷" },
  { id: "food",    label: "Food",     emoji: "🍜" },
  { id: "culture", label: "Culture",  emoji: "🎨" },
  { id: "student", label: "Student",  emoji: "🎓" },
  { id: "outside", label: "Outside",  emoji: "🌿" },
]

// ─── Data per city ────────────────────────────────────────────────────────────

const OPEN_NOW: Record<string, { name: string; area: string; type: string; emoji: string; opens: number; closes: number; hot: boolean; vibe: string }[]> = {
  mannheim: [
    { name: "Hemingway Bar",         area: "Innenstadt",  type: "Bar",      emoji: "🍸", opens: 18, closes: 26, hot: false, vibe: "chill" },
    { name: "Ella & Louis",          area: "Jungbusch",   type: "Jazz",     emoji: "🎷", opens: 19, closes: 25, hot: true,  vibe: "music" },
    { name: "Skybar Mannheim",       area: "Quadrate",    type: "Rooftop",  emoji: "🏙️", opens: 18, closes: 25, hot: true,  vibe: "outside" },
    { name: "Tapas Bar",             area: "P-Quadrate",  type: "Bar",      emoji: "🫒", opens: 17, closes: 25, hot: false, vibe: "food" },
    { name: "Weinkeller Wasserturm", area: "Wasserturm",  type: "Wine bar", emoji: "🍷", opens: 18, closes: 24, hot: false, vibe: "chill" },
    { name: "Alte Feuerwache",       area: "Jungbusch",   type: "Culture",  emoji: "🎭", opens: 18, closes: 24, hot: false, vibe: "culture" },
    { name: "Tiffany Club",          area: "C-Quadrat",   type: "Club",     emoji: "💜", opens: 22, closes: 30, hot: true,  vibe: "party" },
    { name: "MS Connexion",          area: "Hafen",       type: "Club",     emoji: "🎧", opens: 22, closes: 29, hot: true,  vibe: "party" },
    { name: "BASE Club",             area: "Jungbusch",   type: "Club",     emoji: "🔊", opens: 22, closes: 29, hot: true,  vibe: "party" },
    { name: "Zeitraumexit",          area: "Jungbusch",   type: "Club",     emoji: "🖤", opens: 23, closes: 30, hot: false, vibe: "party" },
  ],
  heidelberg: [
    { name: "Nachtschicht",          area: "Bergheim",    type: "Club",     emoji: "🎶", opens: 22, closes: 30, hot: true,  vibe: "party" },
    { name: "Destille",              area: "Altstadt",    type: "Bar",      emoji: "🍺", opens: 18, closes: 26, hot: false, vibe: "chill" },
    { name: "Goldener Engel",        area: "Altstadt",    type: "Bar",      emoji: "🍷", opens: 17, closes: 25, hot: false, vibe: "chill" },
    { name: "Cave 54",               area: "Altstadt",    type: "Club",     emoji: "🎸", opens: 22, closes: 30, hot: true,  vibe: "music" },
    { name: "Schloss Biergarten",    area: "Schloss",     type: "Outside",  emoji: "🏰", opens: 11, closes: 22, hot: true,  vibe: "outside" },
    { name: "Café Knösel",           area: "Altstadt",    type: "Café",     emoji: "☕", opens: 8,  closes: 18, hot: false, vibe: "chill" },
  ],
  frankfurt: [
    { name: "Robert Johnson",        area: "Offenbach",   type: "Club",     emoji: "🎛️", opens: 23, closes: 32, hot: true,  vibe: "party" },
    { name: "Cocoon Club",           area: "Messe",       type: "Club",     emoji: "🔮", opens: 23, closes: 32, hot: true,  vibe: "party" },
    { name: "Freßgass Bars",         area: "Innenstadt",  type: "Bar",      emoji: "🥂", opens: 18, closes: 26, hot: false, vibe: "chill" },
    { name: "Main Tower Lounge",     area: "Bankenviertel",type:"Rooftop",  emoji: "🌆", opens: 18, closes: 25, hot: true,  vibe: "outside" },
    { name: "Kleinmarkthalle",       area: "Innenstadt",  type: "Food",     emoji: "🍜", opens: 7,  closes: 18, hot: false, vibe: "food" },
    { name: "Jazzkeller",            area: "Innenstadt",  type: "Jazz",     emoji: "🎺", opens: 20, closes: 28, hot: true,  vibe: "music" },
    { name: "King Kamehameha",       area: "Sachsenhausen",type:"Club",     emoji: "🌴", opens: 22, closes: 30, hot: false, vibe: "party" },
    { name: "Metropol",              area: "Sachsenhausen",type:"Club",     emoji: "🎉", opens: 22, closes: 30, hot: false, vibe: "party" },
  ],
  ludwigshafen: [
    { name: "Das Haus",              area: "Mitte",       type: "Club",     emoji: "🏠", opens: 22, closes: 29, hot: false, vibe: "party" },
    { name: "Hemshof Café",          area: "Hemshof",     type: "Café",     emoji: "☕", opens: 8,  closes: 18, hot: false, vibe: "chill" },
    { name: "Rheinufer Bar",         area: "Rheinufer",   type: "Bar",      emoji: "🌊", opens: 17, closes: 25, hot: true,  vibe: "outside" },
  ],
  karlsruhe: [
    { name: "Substage",              area: "Südstadt",    type: "Club",     emoji: "🎸", opens: 21, closes: 30, hot: true,  vibe: "music" },
    { name: "Tollhaus",              area: "Oststadt",    type: "Culture",  emoji: "🎭", opens: 19, closes: 26, hot: false, vibe: "culture" },
    { name: "Hemingway",             area: "Innenstadt",  type: "Bar",      emoji: "🍸", opens: 18, closes: 25, hot: false, vibe: "chill" },
    { name: "Kühler Krug",           area: "Günther-K.",  type: "Beer garden",emoji:"🌿",opens:15, closes: 23, hot: false, vibe: "outside" },
  ],
}

const EVENTS: Record<string, { id: string; title: string; venue: string; date: string; time: string; emoji: string; cat: string; grad: string; going: number; vibe: string }[]> = {
  mannheim: [
    { id: "e1", title: "Rooftop Sessions",  venue: "Sky Garden",       date: "Fr 18 Apr", time: "20:00", emoji: "🏙️", cat: "Nightlife", grad: "from-violet-800 to-purple-900", going: 24, vibe: "outside" },
    { id: "e2", title: "Jazz & Wine",        venue: "Weinkeller",       date: "Sa 19 Apr", time: "19:30", emoji: "🎷", cat: "Music",     grad: "from-amber-800 to-orange-900",  going: 18, vibe: "music"   },
    { id: "e3", title: "Electronic Sunday",  venue: "BASE Club",        date: "So 20 Apr", time: "22:00", emoji: "🎧", cat: "Nightlife", grad: "from-zinc-800 to-neutral-900",  going: 41, vibe: "party"   },
    { id: "e4", title: "Street Food Market", venue: "Alter Messplatz",  date: "Sa 19 Apr", time: "12:00", emoji: "🍜", cat: "Food",      grad: "from-emerald-800 to-teal-900",  going: 33, vibe: "food"    },
    { id: "e5", title: "UNMA Campus Party",  venue: "Uni Mannheim",     date: "Do 17 Apr", time: "21:00", emoji: "🎓", cat: "Student",   grad: "from-blue-800 to-indigo-900",   going: 87, vibe: "student" },
    { id: "e6", title: "Jungbusch Nacht",    venue: "Jungbusch Area",   date: "Sa 19 Apr", time: "20:00", emoji: "🌃", cat: "Culture",   grad: "from-rose-800 to-pink-900",     going: 52, vibe: "culture" },
  ],
  heidelberg: [
    { id: "h1", title: "Schloss Open Air",   venue: "Schloss Heidelberg", date: "Sa 19 Apr", time: "19:00", emoji: "🏰", cat: "Culture",  grad: "from-stone-800 to-amber-900",  going: 120, vibe: "culture" },
    { id: "h2", title: "Student Night",       venue: "Cave 54",            date: "Fr 18 Apr", time: "22:00", emoji: "🎓", cat: "Student",  grad: "from-blue-800 to-violet-900",  going: 65,  vibe: "student" },
    { id: "h3", title: "Jazz im Hof",         venue: "Kulturhaus Heidelberg",date:"So 20 Apr",time: "18:00", emoji: "🎺", cat: "Music",   grad: "from-amber-800 to-orange-900", going: 38,  vibe: "music"   },
  ],
  frankfurt: [
    { id: "f1", title: "Cocoon Night",        venue: "Cocoon Club",      date: "Sa 19 Apr", time: "23:00", emoji: "🔮", cat: "Nightlife", grad: "from-violet-900 to-black",    going: 210, vibe: "party"   },
    { id: "f2", title: "Mainfest Brunch",     venue: "Mainufer",         date: "So 20 Apr", time: "11:00", emoji: "🌅", cat: "Food",      grad: "from-amber-700 to-orange-800", going: 88,  vibe: "food"    },
    { id: "f3", title: "Jazz Cellar Night",   venue: "Jazzkeller",       date: "Fr 18 Apr", time: "20:00", emoji: "🎺", cat: "Music",     grad: "from-zinc-800 to-neutral-900", going: 44,  vibe: "music"   },
  ],
  ludwigshafen: [
    { id: "l1", title: "Rhein Beach Party",  venue: "Rheinufer",        date: "Sa 19 Apr", time: "16:00", emoji: "🌊", cat: "Outdoor",  grad: "from-cyan-800 to-blue-900",    going: 55,  vibe: "outside" },
  ],
  karlsruhe: [
    { id: "k1", title: "Substage Live",       venue: "Substage",         date: "Fr 18 Apr", time: "21:00", emoji: "🎸", cat: "Music",    grad: "from-red-800 to-rose-900",     going: 73,  vibe: "music"   },
    { id: "k2", title: "Kulturfestival",      venue: "Tollhaus",         date: "Sa 19 Apr", time: "18:00", emoji: "🎭", cat: "Culture",  grad: "from-emerald-800 to-teal-900", going: 41,  vibe: "culture" },
  ],
}

const VENUES_BY_CITY: Record<string, { id: string; name: string; area: string; type: string; emoji: string; tag: string; vibe: string }[]> = {
  mannheim: [
    { id: "v1", name: "BASE Club",           area: "Jungbusch",    type: "Club",     emoji: "🔊", tag: "Techno",       vibe: "party"   },
    { id: "v2", name: "MS Connexion",        area: "Hafen",        type: "Club",     emoji: "🎧", tag: "Electronic",   vibe: "party"   },
    { id: "v3", name: "Ella & Louis",        area: "Jungbusch",    type: "Jazz bar", emoji: "🎷", tag: "Jazz",         vibe: "music"   },
    { id: "v4", name: "Skybar Mannheim",     area: "Quadrate",     type: "Rooftop",  emoji: "🏙️", tag: "Views",        vibe: "outside" },
    { id: "v5", name: "Hemingway Bar",       area: "Innenstadt",   type: "Bar",      emoji: "🍸", tag: "Cocktails",    vibe: "chill"   },
    { id: "v6", name: "Zeitraumexit",        area: "Jungbusch",    type: "Club",     emoji: "🖤", tag: "Experimental", vibe: "party"   },
    { id: "v7", name: "Weinkeller",          area: "Wasserturm",   type: "Wine bar", emoji: "🍷", tag: "Wine",         vibe: "chill"   },
    { id: "v8", name: "Alte Feuerwache",     area: "Jungbusch",    type: "Culture",  emoji: "🎭", tag: "Art",          vibe: "culture" },
    { id: "v9", name: "Tiffany Club",        area: "C-Quadrat",    type: "Club",     emoji: "💜", tag: "Party",        vibe: "party"   },
  ],
  heidelberg: [
    { id: "h1", name: "Cave 54",             area: "Altstadt",     type: "Club",     emoji: "🎸", tag: "Rock/Pop",     vibe: "music"   },
    { id: "h2", name: "Nachtschicht",        area: "Bergheim",     type: "Club",     emoji: "🎶", tag: "Electronic",   vibe: "party"   },
    { id: "h3", name: "Destille",            area: "Altstadt",     type: "Bar",      emoji: "🍺", tag: "Classic",      vibe: "chill"   },
    { id: "h4", name: "Schloss Biergarten",  area: "Schloss",      type: "Outside",  emoji: "🏰", tag: "Views",        vibe: "outside" },
    { id: "h5", name: "Goldener Engel",      area: "Altstadt",     type: "Bar",      emoji: "🍷", tag: "Wine",         vibe: "chill"   },
  ],
  frankfurt: [
    { id: "f1", name: "Robert Johnson",      area: "Offenbach",    type: "Club",     emoji: "🎛️", tag: "Techno",       vibe: "party"   },
    { id: "f2", name: "Cocoon Club",         area: "Messe",        type: "Club",     emoji: "🔮", tag: "Electronic",   vibe: "party"   },
    { id: "f3", name: "Jazzkeller",          area: "Innenstadt",   type: "Jazz",     emoji: "🎺", tag: "Jazz",         vibe: "music"   },
    { id: "f4", name: "Main Tower Lounge",   area: "Bankenviertel",type: "Rooftop",  emoji: "🌆", tag: "Views",        vibe: "outside" },
    { id: "f5", name: "King Kamehameha",     area: "Sachsenhausen",type: "Club",     emoji: "🌴", tag: "Party",        vibe: "party"   },
    { id: "f6", name: "Metropol",            area: "Sachsenhausen",type: "Club",     emoji: "🎉", tag: "Party",        vibe: "party"   },
  ],
  ludwigshafen: [
    { id: "l1", name: "Rheinufer Bar",       area: "Rheinufer",    type: "Bar",      emoji: "🌊", tag: "Outdoor",      vibe: "outside" },
    { id: "l2", name: "Das Haus",            area: "Mitte",        type: "Club",     emoji: "🏠", tag: "Party",        vibe: "party"   },
  ],
  karlsruhe: [
    { id: "k1", name: "Substage",            area: "Südstadt",     type: "Club",     emoji: "🎸", tag: "Live music",   vibe: "music"   },
    { id: "k2", name: "Tollhaus",            area: "Oststadt",     type: "Culture",  emoji: "🎭", tag: "Art",          vibe: "culture" },
    { id: "k3", name: "Hemingway",           area: "Innenstadt",   type: "Bar",      emoji: "🍸", tag: "Cocktails",    vibe: "chill"   },
    { id: "k4", name: "Kühler Krug",         area: "Günther-K.",   type: "Garden",   emoji: "🌿", tag: "Beer garden",  vibe: "outside" },
  ],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getH() { const h = new Date().getHours(); return h < 6 ? h + 24 : h }

function VibeBar({ vibe, setVibe }: { vibe: string; setVibe: (v: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
      {VIBES.map(v => (
        <button
          key={v.id}
          onClick={() => setVibe(v.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full font-semibold transition-all ${
            vibe === v.id
              ? "bg-violet-600 text-white"
              : "border border-white/[0.10] text-white/40 hover:border-white/25 hover:text-white"
          }`}
        >
          <span>{v.emoji}</span>
          {v.label}
        </button>
      ))}
    </div>
  )
}

// ─── Tonight tab ─────────────────────────────────────────────────────────────

function TonightTab({ city }: { city: string }) {
  const [vibe, setVibe] = useState("all")
  const hour  = getH()
  const all   = OPEN_NOW[city] ?? []
  const filtered = vibe === "all" ? all : all.filter(v => v.vibe === vibe)
  const open  = filtered.filter(s => hour >= s.opens && hour < s.closes)
  const soon  = filtered.filter(s => s.opens > hour && s.opens <= hour + 3 && !open.includes(s))
  const show  = open.length ? open : filtered.slice(0, 8)

  return (
    <div className="space-y-5">
      <VibeBar vibe={vibe} setVibe={setVibe} />

      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="text-xs text-white/25 uppercase tracking-widest">
          {open.length ? `${open.length} open now` : "Opening soon"}
        </span>
      </div>

      {show.length === 0 ? (
        <p className="text-white/20 text-sm py-10 text-center">Nothing in this vibe right now — try another.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {show.map(v => (
            <div key={v.name} className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] transition-colors cursor-pointer group">
              <span className="text-2xl flex-shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">{v.name}</p>
                  {v.hot && <span className="text-[9px] text-orange-400 font-bold uppercase bg-orange-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">Hot</span>}
                </div>
                <p className="text-xs text-white/25 mt-0.5">{v.type} · {v.area}</p>
              </div>
              <span className={`text-[10px] font-bold flex-shrink-0 ${open.includes(v) ? "text-emerald-400" : "text-white/20"}`}>
                {open.includes(v) ? "Open" : `${v.opens}:00`}
              </span>
            </div>
          ))}
        </div>
      )}

      {soon.length > 0 && (
        <div>
          <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-semibold">Opening within 3h</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {soon.map(v => (
              <div key={v.name} className="flex items-center gap-2 p-3 rounded-xl border border-white/[0.05] opacity-40">
                <span className="text-lg">{v.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-white/60 truncate">{v.name}</p>
                  <p className="text-[10px] text-white/25 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{v.opens}:00</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Events tab ──────────────────────────────────────────────────────────────

function EventsTab({ city }: { city: string }) {
  const { user } = useAuth()
  const [vibe, setVibe] = useState("all")
  const [going, setGoing] = useState<Set<string>>(new Set())
  const cityEvents = EVENTS[city] ?? []
  const filtered   = vibe === "all" ? cityEvents : cityEvents.filter(e => e.vibe === vibe)

  function toggle(id: string) {
    if (!user) return
    setGoing(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  return (
    <div className="space-y-5">
      <VibeBar vibe={vibe} setVibe={setVibe} />

      {filtered.length === 0 ? (
        <p className="text-white/20 text-sm py-10 text-center">No events in this category yet.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(e => (
            <div key={e.id} className="flex gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] transition-colors group cursor-pointer">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${e.grad} flex items-center justify-center flex-shrink-0 text-2xl`}>
                {e.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{e.title}</p>
                    <p className="text-xs text-white/30 mt-0.5">{e.venue}</p>
                  </div>
                  <span className="text-[10px] text-white/20 border border-white/[0.08] px-2 py-0.5 rounded-full flex-shrink-0">{e.cat}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 text-xs text-white/25">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
                  </div>
                  {user ? (
                    <button
                      onClick={() => toggle(e.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                        going.has(e.id) ? "bg-violet-600 text-white" : "border border-white/[0.12] text-white/40 hover:border-violet-400/50 hover:text-white"
                      }`}
                    >
                      {going.has(e.id) ? <><Check className="w-3 h-3" /> Going</> : <><Users className="w-3 h-3" /> {e.going}</>}
                    </button>
                  ) : (
                    <Link href="/login" className="text-xs text-white/20 hover:text-white/50 transition-colors flex items-center gap-1">
                      <Users className="w-3 h-3" /> {e.going} going
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Venues tab ──────────────────────────────────────────────────────────────

function VenuesTab({ city }: { city: string }) {
  const [vibe, setVibe] = useState("all")
  const cityVenues = VENUES_BY_CITY[city] ?? []
  const filtered   = vibe === "all" ? cityVenues : cityVenues.filter(v => v.vibe === vibe)

  return (
    <div className="space-y-5">
      <VibeBar vibe={vibe} setVibe={setVibe} />

      {filtered.length === 0 ? (
        <p className="text-white/20 text-sm py-10 text-center">No venues in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filtered.map(v => (
            <div key={v.id} className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:border-violet-500/25 transition-all cursor-pointer group">
              <span className="text-2xl flex-shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">{v.name}</p>
                <p className="text-xs text-white/25 mt-0.5">{v.area}</p>
              </div>
              <span className="text-[10px] text-violet-400/50 border border-violet-500/20 px-2 py-0.5 rounded-full flex-shrink-0">{v.tag}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-violet-400 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Friends tab ─────────────────────────────────────────────────────────────

function FriendsTab() {
  const { user, loading } = useAuth()
  if (!loading && !user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-violet-600/10 border border-violet-500/20 flex items-center justify-center mb-5">
          <Users className="w-7 h-7 text-violet-400/40" />
        </div>
        <h3 className="text-white font-bold mb-2">See where your friends are</h3>
        <p className="text-white/30 text-sm mb-8 max-w-xs">Sign in to follow friends and see their check-ins live.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/login" className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold text-center hover:bg-white/90 transition-colors">Sign in</Link>
          <Link href="/register" className="w-full border border-white/[0.12] text-white/60 hover:text-white py-3 rounded-xl text-sm font-semibold text-center hover:border-white/25 transition-colors">Create account — free</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-white/20 text-sm">No activity yet — follow people from their profile.</p>
    </div>
  )
}

// ─── Main tabs ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "tonight", label: "Tonight", icon: Zap },
  { id: "events",  label: "Events",  icon: Calendar },
  { id: "venues",  label: "Venues",  icon: MapPin },
  { id: "friends", label: "Friends", icon: Users },
]

// ─── App Shell ────────────────────────────────────────────────────────────────

export function AppShell() {
  const [tab, setTab]       = useState("tonight")
  const [city, setCity]     = useState("mannheim")
  const [cityOpen, setCityOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const currentCity = CITIES.find(c => c.id === city)!

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Sticky top bar */}
      <div className="sticky top-14 z-40 bg-black/95 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4">

          {searchOpen ? (
            <div className="py-3 flex gap-3 items-center">
              <div className="flex-1 bg-white/[0.07] border border-white/[0.12] rounded-xl px-4">
                <SearchSystem />
              </div>
              <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white text-sm transition-colors">
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between py-3 gap-3">
              {/* City switcher */}
              <div className="relative">
                <button
                  onClick={() => setCityOpen(!cityOpen)}
                  className="flex items-center gap-1.5 text-white font-black text-lg tracking-tight hover:text-violet-300 transition-colors"
                >
                  {currentCity.label}
                  <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
                </button>
                {cityOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-white/[0.10] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 min-w-[160px] z-50">
                    {CITIES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setCity(c.id); setCityOpen(false) }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                          city === c.id ? "text-violet-400 font-bold bg-violet-600/10" : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[10px] text-white/20 uppercase tracking-widest hidden sm:inline">Live</span>
              </div>

              <button
                onClick={() => setSearchOpen(true)}
                className="ml-auto w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tab bar */}
          {!searchOpen && (
            <div className="flex gap-1 pb-3">
              {TABS.map(t => {
                const Icon = t.icon
                const active = tab === t.id
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      active ? "bg-violet-600 text-white" : "text-white/30 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {t.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        {tab === "tonight" && <TonightTab city={city} />}
        {tab === "events"  && <EventsTab  city={city} />}
        {tab === "venues"  && <VenuesTab  city={city} />}
        {tab === "friends" && <FriendsTab />}
      </div>
    </div>
  )
}
