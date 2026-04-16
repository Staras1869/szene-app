"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

const ALL_SLOTS = [
  { name: "Café Vanille",           area: "Jungbusch",   type: "Café",      opens: 8,  closes: 18, emoji: "☕", price: null },
  { name: "Café Wien",              area: "Quadrate",    type: "Café",      opens: 8,  closes: 20, emoji: "🥐", price: null },
  { name: "Alter Messplatz",        area: "Neckarstadt", type: "Market",    opens: 10, closes: 20, emoji: "🍜", price: "Free" },
  { name: "Hemingway Bar",          area: "Innenstadt",  type: "Bar",       opens: 18, closes: 26, emoji: "🍸", price: null },
  { name: "Ella & Louis",           area: "Jungbusch",   type: "Jazz bar",  opens: 19, closes: 25, emoji: "🎷", price: null },
  { name: "Weinkeller Wasserturm",  area: "Wasserturm",  type: "Wine bar",  opens: 18, closes: 24, emoji: "🍷", price: null },
  { name: "Tapas Bar Mannheim",     area: "P-Quadrate",  type: "Bar",       opens: 17, closes: 25, emoji: "🫒", price: null },
  { name: "Skybar Mannheim",        area: "Quadrate",    type: "Rooftop",   opens: 18, closes: 25, emoji: "🏙️", price: null },
  { name: "Tiffany Club",           area: "C-Quadrat",   type: "Club",      opens: 22, closes: 30, emoji: "💜", price: "€10–15" },
  { name: "MS Connexion",           area: "Hafen",       type: "Club",      opens: 22, closes: 29, emoji: "🎧", price: "€15–20" },
  { name: "BASE Club",              area: "Jungbusch",   type: "Club",      opens: 22, closes: 29, emoji: "🔊", price: "€10–12" },
  { name: "Zeitraumexit",           area: "Jungbusch",   type: "Club",      opens: 23, closes: 30, emoji: "🖤", price: "€12" },
  { name: "Alte Feuerwache",        area: "Jungbusch",   type: "Culture",   opens: 18, closes: 24, emoji: "🎭", price: "Free–€15" },
]

function getH() { const h = new Date().getHours(); return h < 6 ? h + 24 : h }

export function Tonight() {
  const [hour, setHour] = useState(getH())
  useEffect(() => { const t = setInterval(() => setHour(getH()), 60_000); return () => clearInterval(t) }, [])

  const open    = ALL_SLOTS.filter(s => hour >= s.opens && hour < s.closes)
  const opening = ALL_SLOTS.filter(s => s.opens > hour && s.opens <= hour + 3 && !open.includes(s))

  if (!open.length && !opening.length) return null

  const label = hour < 12 ? "Good morning" : hour < 17 ? "This afternoon" : hour < 21 ? "Opening tonight" : "Open right now"

  return (
    <section className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{label}</h2>
            <p className="text-white/25 text-xs mt-0.5">
              {new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} · Mannheim
            </p>
          </div>
        </div>

        {open.length > 0 && (
          <>
            <p className="text-[11px] text-emerald-400 uppercase tracking-[0.15em] mb-3 font-semibold">Open now</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
              {open.map(v => (
                <div key={v.name} className="flex items-center gap-3 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] hover:bg-emerald-500/[0.10] transition-colors cursor-pointer group">
                  <span className="text-xl flex-shrink-0">{v.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white group-hover:text-emerald-300 truncate">{v.name}</p>
                    <p className="text-xs text-white/30 truncate">{v.type} · {v.area}</p>
                  </div>
                  {v.price && <span className="text-xs text-white/30 font-medium flex-shrink-0">{v.price}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {opening.length > 0 && (
          <>
            <p className="text-[11px] text-white/25 uppercase tracking-[0.15em] mb-3 font-semibold">Opening soon</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {opening.map(v => (
                <div key={v.name} className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer group">
                  <span className="text-xl flex-shrink-0 opacity-50">{v.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white/50 group-hover:text-white/80 truncate">{v.name}</p>
                    <p className="text-xs text-white/25 flex items-center gap-1">
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
