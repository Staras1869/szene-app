"use client"

import { useState } from "react"
import { Clock, Calendar, MapPin, Users, Search, Zap, Check, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { SearchSystem } from "./search-system"

// ─── Static data ────────────────────────────────────────────────────────────

const OPEN_NOW = [
  { name: "Hemingway Bar",         area: "Innenstadt",  type: "Bar",      emoji: "🍸", opens: 18, closes: 26, hot: false },
  { name: "Ella & Louis",          area: "Jungbusch",   type: "Jazz",     emoji: "🎷", opens: 19, closes: 25, hot: true  },
  { name: "Skybar Mannheim",       area: "Quadrate",    type: "Rooftop",  emoji: "🏙️", opens: 18, closes: 25, hot: true  },
  { name: "Tapas Bar Mannheim",    area: "P-Quadrate",  type: "Bar",      emoji: "🫒", opens: 17, closes: 25, hot: false },
  { name: "Weinkeller Wasserturm", area: "Wasserturm",  type: "Wine bar", emoji: "🍷", opens: 18, closes: 24, hot: false },
  { name: "Alte Feuerwache",       area: "Jungbusch",   type: "Culture",  emoji: "🎭", opens: 18, closes: 24, hot: false },
  { name: "Tiffany Club",          area: "C-Quadrat",   type: "Club",     emoji: "💜", opens: 22, closes: 30, hot: true  },
  { name: "MS Connexion",          area: "Hafen",       type: "Club",     emoji: "🎧", opens: 22, closes: 29, hot: true  },
  { name: "BASE Club",             area: "Jungbusch",   type: "Club",     emoji: "🔊", opens: 22, closes: 29, hot: true  },
  { name: "Zeitraumexit",          area: "Jungbusch",   type: "Club",     emoji: "🖤", opens: 23, closes: 30, hot: false },
]

const EVENTS = [
  { id: "e1", title: "Rooftop Sessions",    venue: "Sky Garden",        date: "Fr 18 Apr", time: "20:00", emoji: "🏙️", cat: "Nightlife", grad: "from-violet-800 to-purple-900",  going: 24 },
  { id: "e2", title: "Jazz & Wine",          venue: "Weinkeller",        date: "Sa 19 Apr", time: "19:30", emoji: "🎷", cat: "Music",     grad: "from-amber-800 to-orange-900",   going: 18 },
  { id: "e3", title: "Electronic Sunday",    venue: "BASE Club",         date: "So 20 Apr", time: "22:00", emoji: "🎧", cat: "Nightlife", grad: "from-zinc-800 to-neutral-900",   going: 41 },
  { id: "e4", title: "Street Food Market",   venue: "Alter Messplatz",   date: "Sa 19 Apr", time: "12:00", emoji: "🍜", cat: "Food",      grad: "from-emerald-800 to-teal-900",   going: 33 },
  { id: "e5", title: "UNMA Campus Party",    venue: "Uni Mannheim",      date: "Do 17 Apr", time: "21:00", emoji: "🎓", cat: "Student",   grad: "from-blue-800 to-indigo-900",    going: 87 },
  { id: "e6", title: "Jungbusch Nacht",      venue: "Jungbusch Area",    date: "Sa 19 Apr", time: "20:00", emoji: "🌃", cat: "Culture",   grad: "from-rose-800 to-pink-900",      going: 52 },
]

const VENUES = [
  { id: "v1", name: "BASE Club",           area: "Jungbusch",   type: "Club",     emoji: "🔊", tag: "Techno" },
  { id: "v2", name: "MS Connexion",        area: "Hafen",       type: "Club",     emoji: "🎧", tag: "Electronic" },
  { id: "v3", name: "Ella & Louis",        area: "Jungbusch",   type: "Jazz bar", emoji: "🎷", tag: "Jazz" },
  { id: "v4", name: "Skybar Mannheim",     area: "Quadrate",    type: "Rooftop",  emoji: "🏙️", tag: "Views" },
  { id: "v5", name: "Hemingway Bar",       area: "Innenstadt",  type: "Bar",      emoji: "🍸", tag: "Cocktails" },
  { id: "v6", name: "Zeitraumexit",        area: "Jungbusch",   type: "Club",     emoji: "🖤", tag: "Experimental" },
  { id: "v7", name: "Weinkeller",          area: "Wasserturm",  type: "Wine bar", emoji: "🍷", tag: "Wine" },
  { id: "v8", name: "Alte Feuerwache",     area: "Jungbusch",   type: "Culture",  emoji: "🎭", tag: "Art" },
  { id: "v9", name: "Tiffany Club",        area: "C-Quadrat",   type: "Club",     emoji: "💜", tag: "Party" },
]

const CATEGORIES = ["All", "Club", "Bar", "Jazz", "Rooftop", "Wine bar", "Culture"]

// ─── Tonight tab ─────────────────────────────────────────────────────────────

function getH() { const h = new Date().getHours(); return h < 6 ? h + 24 : h }

function TonightTab() {
  const hour = getH()
  const open = OPEN_NOW.filter(s => hour >= s.opens && hour < s.closes)
  const soon = OPEN_NOW.filter(s => s.opens > hour && s.opens <= hour + 3 && !open.includes(s))
  const all  = open.length ? open : OPEN_NOW.slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Live pulse */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span className="text-xs text-white/30 uppercase tracking-widest">
          {open.length ? `${open.length} places open now` : "Opening soon"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {all.map(v => (
          <div key={v.name} className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] transition-colors cursor-pointer group">
            <span className="text-2xl flex-shrink-0">{v.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">{v.name}</p>
                {v.hot && <span className="text-[9px] text-orange-400 font-bold uppercase tracking-wider bg-orange-400/10 px-1.5 py-0.5 rounded-full flex-shrink-0">Hot</span>}
              </div>
              <p className="text-xs text-white/30 mt-0.5">{v.type} · {v.area}</p>
            </div>
            <div className="flex-shrink-0">
              {open.includes(v)
                ? <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Open</span>
                : <span className="text-[9px] text-white/20 font-semibold">{v.opens}:00</span>}
            </div>
          </div>
        ))}
      </div>

      {soon.length > 0 && (
        <div>
          <p className="text-[10px] text-white/20 uppercase tracking-widest mb-2 font-semibold">Opening within 3h</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {soon.map(v => (
              <div key={v.name} className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.05] opacity-50">
                <span className="text-xl">{v.emoji}</span>
                <div>
                  <p className="text-xs font-semibold text-white/60">{v.name}</p>
                  <p className="text-[10px] text-white/25 flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> {v.opens}:00</p>
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

function EventsTab() {
  const { user } = useAuth()
  const [going, setGoing] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    if (!user) return
    setGoing(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  return (
    <div className="space-y-3">
      {EVENTS.map(e => (
        <div key={e.id} className="flex gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] transition-colors group cursor-pointer">
          {/* Emoji card */}
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${e.grad} flex items-center justify-center flex-shrink-0 text-2xl`}>
            {e.emoji}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">{e.title}</p>
                <p className="text-xs text-white/30 mt-0.5">{e.venue}</p>
              </div>
              <span className="text-[10px] text-white/25 font-semibold uppercase tracking-wider flex-shrink-0 border border-white/[0.08] px-2 py-0.5 rounded-full">{e.cat}</span>
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
  )
}

// ─── Venues tab ──────────────────────────────────────────────────────────────

function VenuesTab() {
  const [cat, setCat] = useState("All")
  const filtered = cat === "All" ? VENUES : VENUES.filter(v => v.type === cat)

  return (
    <div className="space-y-4">
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
              cat === c ? "bg-violet-600 text-white" : "border border-white/[0.10] text-white/40 hover:border-white/25 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Venue list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map(v => (
          <div key={v.id} className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:border-violet-500/25 transition-all cursor-pointer group">
            <span className="text-2xl flex-shrink-0">{v.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">{v.name}</p>
              <p className="text-xs text-white/25 mt-0.5">{v.area}</p>
            </div>
            <span className="text-[10px] text-violet-400/60 font-semibold border border-violet-500/20 px-2 py-0.5 rounded-full flex-shrink-0">{v.tag}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-violet-400 transition-colors flex-shrink-0" />
          </div>
        ))}
      </div>
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
          <Users className="w-7 h-7 text-violet-400/50" />
        </div>
        <h3 className="text-white font-bold mb-2">See where your friends are</h3>
        <p className="text-white/30 text-sm mb-8 max-w-xs">Sign in to follow friends and see their check-ins in real time.</p>
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

// ─── Main shell ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "tonight", label: "Tonight",  icon: Zap },
  { id: "events",  label: "Events",   icon: Calendar },
  { id: "venues",  label: "Venues",   icon: MapPin },
  { id: "friends", label: "Friends",  icon: Users },
]

export function AppShell() {
  const [tab, setTab] = useState("tonight")
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top bar */}
      <div className="sticky top-14 z-40 bg-black/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4">
          {/* Search bar */}
          {searchOpen ? (
            <div className="py-3 flex gap-3 items-center">
              <div className="flex-1 bg-white/[0.07] border border-white/[0.12] rounded-xl px-4">
                <SearchSystem />
              </div>
              <button onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white text-sm">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center justify-between py-3">
              <div>
                <h1 className="text-lg font-black text-white tracking-tight">
                  {TABS.find(t => t.id === tab)?.label}
                </h1>
                <p className="text-[10px] text-white/25 uppercase tracking-widest">Mannheim · Live</p>
              </div>
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/[0.09] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.10] transition-all"
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
                      active
                        ? "bg-violet-600 text-white"
                        : "text-white/30 hover:text-white hover:bg-white/[0.05]"
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
        {tab === "tonight" && <TonightTab />}
        {tab === "events"  && <EventsTab />}
        {tab === "venues"  && <VenuesTab />}
        {tab === "friends" && <FriendsTab />}
      </div>
    </div>
  )
}
