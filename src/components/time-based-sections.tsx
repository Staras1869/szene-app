"use client"

import { useState } from "react"
import { Clock } from "lucide-react"

const SECTIONS = [
  {
    id: "clubs",
    label: "Clubs",
    emoji: "🖤",
    time: "22:00 – 06:00",
    venues: [
      { name: "Tiffany Club",    area: "C-Quadrat",  style: "Electronic / House",  until: "06:00", emoji: "💜" },
      { name: "MS Connexion",    area: "Hafen",       style: "Techno / Multi-floor", until: "05:00", emoji: "🎧" },
      { name: "BASE Club",       area: "Jungbusch",   style: "Bass / Electronic",   until: "05:00", emoji: "🔊" },
      { name: "Zeitraumexit",    area: "Jungbusch",   style: "Techno / Underground", until: "06:00", emoji: "🖤" },
      { name: "halle02",         area: "Heidelberg",  style: "Festival / Electronic", until: "05:00", emoji: "🏭" },
      { name: "Schwimmbad Club", area: "Heidelberg",  style: "Indie / Alternative",  until: "04:00", emoji: "🎸" },
    ],
  },
  {
    id: "bars",
    label: "Bars",
    emoji: "🍸",
    time: "18:00 – 02:00",
    venues: [
      { name: "Hemingway Bar",          area: "Innenstadt",  style: "Cocktails / Classic",  until: "02:00", emoji: "🍸" },
      { name: "Ella & Louis",           area: "Jungbusch",   style: "Jazz / Wine",          until: "01:00", emoji: "🎷" },
      { name: "Weinkeller Wasserturm",  area: "Wasserturm",  style: "Wine / Upscale",       until: "00:00", emoji: "🍷" },
      { name: "Tapas Bar Mannheim",     area: "P-Quadrate",  style: "Tapas / Spanish",      until: "01:00", emoji: "🫒" },
      { name: "Skybar Mannheim",        area: "Quadrate",    style: "Rooftop / Cocktails",  until: "01:00", emoji: "🏙️" },
    ],
  },
  {
    id: "cafes",
    label: "Cafés",
    emoji: "☕",
    time: "08:00 – 18:00",
    venues: [
      { name: "Café Vanille",     area: "Jungbusch",   style: "Brunch / Coffee",    until: "18:00", emoji: "☕" },
      { name: "Café Wien",        area: "Quadrate",    style: "Viennese / Coffee",  until: "20:00", emoji: "🥐" },
      { name: "Café Journal",     area: "Heidelberg",  style: "Coffee / Breakfast", until: "18:00", emoji: "📰" },
    ],
  },
  {
    id: "food",
    label: "Food",
    emoji: "🍜",
    time: "11:00 – 23:00",
    venues: [
      { name: "Alter Messplatz",       area: "Neckarstadt",  style: "Street Food / Market", until: "20:00", emoji: "🍜" },
      { name: "Tapas Bar Mannheim",    area: "P-Quadrate",   style: "Spanish / Tapas",      until: "01:00", emoji: "🫒" },
      { name: "Reindl's Restaurant",   area: "Innenstadt",   style: "German / Modern",      until: "22:00", emoji: "🍽️" },
    ],
  },
]

export function TimeBasedSections() {
  const [active, setActive] = useState("clubs")
  const section = SECTIONS.find((s) => s.id === active)!

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">By type</h2>
          <p className="text-zinc-500 text-sm mt-1">Filter by what you're looking for</p>
        </div>

        {/* Tab row */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                active === s.id
                  ? "bg-violet-600 text-white"
                  : "border border-white/10 text-zinc-400 hover:text-white hover:border-white/20"
              }`}
            >
              <span>{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>

        {/* Time badge */}
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-3.5 h-3.5 text-zinc-600" />
          <span className="text-xs text-zinc-600">Typical hours: {section.time}</span>
        </div>

        {/* Venue grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {section.venues.map((v) => (
            <div
              key={v.name}
              className="flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-200 cursor-pointer group"
            >
              <span className="text-2xl flex-shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors truncate">{v.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{v.style}</p>
                <p className="text-xs text-zinc-600">{v.area}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider">until</p>
                <p className="text-xs font-semibold text-zinc-400">{v.until}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
