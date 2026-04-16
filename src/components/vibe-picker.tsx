"use client"

import { useState } from "react"

const VIBES = [
  {
    id: "party",
    label: "Party mode",
    sub: "Clubs & late nights",
    emoji: "🔥",
    bg: "from-rose-950 to-rose-900",
    border: "border-rose-500/30",
    glow: "group-hover:shadow-rose-500/20",
  },
  {
    id: "chill",
    label: "Chill vibes",
    sub: "Bars & wine spots",
    emoji: "🍷",
    bg: "from-violet-950 to-violet-900",
    border: "border-violet-500/30",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    id: "food",
    label: "I'm hungry",
    sub: "Restaurants & markets",
    emoji: "🍜",
    bg: "from-amber-950 to-amber-900",
    border: "border-amber-500/30",
    glow: "group-hover:shadow-amber-500/20",
  },
  {
    id: "music",
    label: "Live music",
    sub: "Concerts & jazz",
    emoji: "🎷",
    bg: "from-blue-950 to-blue-900",
    border: "border-blue-500/30",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    id: "culture",
    label: "Cultural",
    sub: "Art, theatre & film",
    emoji: "🎨",
    bg: "from-emerald-950 to-emerald-900",
    border: "border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    id: "outside",
    label: "Get outside",
    sub: "Parks & rooftops",
    emoji: "🌿",
    bg: "from-teal-950 to-teal-900",
    border: "border-teal-500/30",
    glow: "group-hover:shadow-teal-500/20",
  },
]

export function VibePicker() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">What's your vibe tonight?</h2>
          <p className="text-zinc-500 mt-2 text-sm">Pick a mood — we'll show you what fits</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {VIBES.map((vibe) => {
            const isSelected = selected === vibe.id
            return (
              <button
                key={vibe.id}
                onClick={() => setSelected(isSelected ? null : vibe.id)}
                className={`group relative flex flex-col items-center gap-3 p-5 rounded-2xl border bg-gradient-to-b transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 shadow-lg ${vibe.glow} ${
                  isSelected
                    ? `${vibe.bg} ${vibe.border} scale-105 shadow-xl`
                    : "from-zinc-900 to-zinc-900 border-white/6 hover:border-white/12 hover:scale-105 hover:shadow-xl"
                }`}
              >
                <span className="text-3xl">{vibe.emoji}</span>
                <div className="text-center">
                  <p className={`text-xs font-semibold leading-tight transition-colors ${isSelected ? "text-white" : "text-zinc-300 group-hover:text-white"}`}>
                    {vibe.label}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">{vibe.sub}</p>
                </div>

                {isSelected && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white/60" />
                )}
              </button>
            )
          })}
        </div>

        {selected && (
          <p className="text-center text-zinc-500 text-sm mt-8 animate-in fade-in duration-300">
            Showing <span className="text-white font-medium">{VIBES.find((v) => v.id === selected)?.label}</span> results below ↓
          </p>
        )}
      </div>
    </section>
  )
}
