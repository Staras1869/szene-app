"use client"

import { useEffect, useState } from "react"
import { Clock, MapPin } from "lucide-react"

const ALL_SLOTS = [
  // Morning / afternoon
  { name: "Café Vanille",            area: "Jungbusch",   type: "Café",      opens: 8,  closes: 18, emoji: "☕", price: null },
  { name: "Café Wien",               area: "Quadrate",    type: "Café",      opens: 8,  closes: 20, emoji: "🥐", price: null },
  { name: "Alter Messplatz",         area: "Neckarstadt", type: "Market",    opens: 10, closes: 20, emoji: "🍜", price: "Free" },
  // Evening
  { name: "Hemingway Bar",           area: "Innenstadt",  type: "Bar",       opens: 18, closes: 26, emoji: "🍸", price: null },
  { name: "Ella & Louis",            area: "Jungbusch",   type: "Jazz bar",  opens: 19, closes: 25, emoji: "🎷", price: null },
  { name: "Weinkeller Wasserturm",   area: "Wasserturm",  type: "Wine bar",  opens: 18, closes: 24, emoji: "🍷", price: null },
  { name: "Tapas Bar Mannheim",      area: "P-Quadrate",  type: "Bar",       opens: 17, closes: 25, emoji: "🫒", price: null },
  { name: "Skybar Mannheim",         area: "Quadrate",    type: "Rooftop",   opens: 18, closes: 25, emoji: "🏙️", price: null },
  // Late night
  { name: "Tiffany Club",            area: "C-Quadrat",   type: "Club",      opens: 22, closes: 30, emoji: "💜", price: "€10–15" },
  { name: "MS Connexion",            area: "Hafen",       type: "Club",      opens: 22, closes: 29, emoji: "🎧", price: "€15–20" },
  { name: "BASE Club",               area: "Jungbusch",   type: "Club",      opens: 22, closes: 29, emoji: "🔊", price: "€10–12" },
  { name: "Zeitraumexit",            area: "Jungbusch",   type: "Club",      opens: 23, closes: 30, emoji: "🖤", price: "€12" },
  { name: "Alte Feuerwache",         area: "Jungbusch",   type: "Culture",   opens: 18, closes: 24, emoji: "🎭", price: "Free–€15" },
]

function getHour() {
  return new Date().getHours()
}

function label(h: number) {
  if (h < 12) return "Good morning — open now"
  if (h < 17) return "This afternoon"
  if (h < 21) return "Opening soon tonight"
  return "Open right now"
}

export function Tonight() {
  const [hour, setHour] = useState(getHour())

  useEffect(() => {
    const t = setInterval(() => setHour(getHour()), 60_000)
    return () => clearInterval(t)
  }, [])

  // normalise hour: treat 0–6 as 24–30 for late-night overlap
  const h = hour < 6 ? hour + 24 : hour

  const open = ALL_SLOTS.filter((s) => h >= s.opens && h < s.closes)
  const opening = ALL_SLOTS.filter((s) => s.opens > h && s.opens <= h + 3 && !open.includes(s))

  if (open.length === 0 && opening.length === 0) return null

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{label(hour)}</h2>
            <p className="text-zinc-500 text-sm mt-0.5">
              {new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} · Mannheim
            </p>
          </div>
        </div>

        {/* Open now */}
        {open.length > 0 && (
          <>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Open now</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
              {open.map((v) => (
                <div key={v.name} className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08] transition-colors cursor-pointer group">
                  <span className="text-xl flex-shrink-0">{v.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">{v.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{v.type} · {v.area}</p>
                  </div>
                  {v.price && <span className="text-xs text-zinc-600 flex-shrink-0">{v.price}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Opening soon */}
        {opening.length > 0 && (
          <>
            <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Opening soon</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {opening.map((v) => (
                <div key={v.name} className="flex items-center gap-3 p-4 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer group">
                  <span className="text-xl flex-shrink-0 opacity-60">{v.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-400 group-hover:text-white transition-colors truncate">{v.name}</p>
                    <p className="text-xs text-zinc-600 truncate flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Opens {v.opens > 24 ? v.opens - 24 : v.opens}:00
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
