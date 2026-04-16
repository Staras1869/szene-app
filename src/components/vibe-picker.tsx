"use client"

import { useState } from "react"

const VIBES = [
  { id: "party",   label: "Party",    sub: "Clubs & late nights",   emoji: "🔥", grad: "from-rose-500 to-orange-500" },
  { id: "chill",   label: "Chill",    sub: "Bars & wine",           emoji: "🍷", grad: "from-violet-500 to-purple-600" },
  { id: "food",    label: "Hungry",   sub: "Food & markets",        emoji: "🍜", grad: "from-amber-400 to-orange-500" },
  { id: "music",   label: "Music",    sub: "Live & concerts",       emoji: "🎷", grad: "from-blue-500 to-cyan-500" },
  { id: "culture", label: "Culture",  sub: "Art & theatre",         emoji: "🎨", grad: "from-emerald-500 to-teal-500" },
  { id: "outside", label: "Outside",  sub: "Parks & rooftops",      emoji: "🌿", grad: "from-teal-400 to-green-500" },
]

export function VibePicker() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <section className="py-16 bg-zinc-950" id="discover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white tracking-tight">What's your vibe?</h2>
          <p className="text-white/30 mt-1 text-sm">Pick a mood — we filter the night for you</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {VIBES.map((vibe) => {
            const isSelected = selected === vibe.id
            return (
              <button
                key={vibe.id}
                onClick={() => setSelected(isSelected ? null : vibe.id)}
                className={`group relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-200 focus:outline-none overflow-hidden ${
                  isSelected
                    ? "border-transparent scale-[1.03]"
                    : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20"
                }`}
              >
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${vibe.grad} opacity-20`} />
                )}
                <span className="relative text-2xl">{vibe.emoji}</span>
                <div className="relative text-center">
                  <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-white/70"}`}>{vibe.label}</p>
                  <p className={`text-[10px] mt-0.5 leading-tight ${isSelected ? "text-white/60" : "text-white/30"}`}>{vibe.sub}</p>
                </div>
                {isSelected && (
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${vibe.grad}`} />
                )}
              </button>
            )
          })}
        </div>

        {selected && (
          <p className="text-white/30 text-sm mt-5">
            Showing <span className="text-white font-semibold">{VIBES.find(v => v.id === selected)?.label}</span> picks ↓
          </p>
        )}
      </div>
    </section>
  )
}
