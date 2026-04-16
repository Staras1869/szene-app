"use client"

import { useState } from "react"
import { Clock } from "lucide-react"

const SECTIONS = [
  {
    id: "clubs", label: "Clubs", emoji: "🖤", time: "22:00 – 06:00",
    venues: [
      { name: "Tiffany Club",     area: "C-Quadrat",  style: "Electronic / House",   until: "06:00", emoji: "💜" },
      { name: "MS Connexion",     area: "Hafen",      style: "Techno / Multi-floor",  until: "05:00", emoji: "🎧" },
      { name: "BASE Club",        area: "Jungbusch",  style: "Bass / Electronic",    until: "05:00", emoji: "🔊" },
      { name: "Zeitraumexit",     area: "Jungbusch",  style: "Techno / Underground", until: "06:00", emoji: "🖤" },
      { name: "halle02",          area: "Heidelberg", style: "Festival / Electronic",until: "05:00", emoji: "🏭" },
      { name: "Schwimmbad Club",  area: "Heidelberg", style: "Indie / Alternative",  until: "04:00", emoji: "🎸" },
    ],
  },
  {
    id: "bars", label: "Bars", emoji: "🍸", time: "18:00 – 02:00",
    venues: [
      { name: "Hemingway Bar",         area: "Innenstadt", style: "Cocktails / Classic", until: "02:00", emoji: "🍸" },
      { name: "Ella & Louis",          area: "Jungbusch",  style: "Jazz / Wine",         until: "01:00", emoji: "🎷" },
      { name: "Weinkeller Wasserturm", area: "Wasserturm", style: "Wine / Upscale",      until: "00:00", emoji: "🍷" },
      { name: "Tapas Bar Mannheim",    area: "P-Quadrate", style: "Tapas / Spanish",     until: "01:00", emoji: "🫒" },
      { name: "Skybar Mannheim",       area: "Quadrate",   style: "Rooftop / Cocktails", until: "01:00", emoji: "🏙️" },
    ],
  },
  {
    id: "cafes", label: "Cafés", emoji: "☕", time: "08:00 – 18:00",
    venues: [
      { name: "Café Vanille", area: "Jungbusch",  style: "Brunch / Coffee",    until: "18:00", emoji: "☕" },
      { name: "Café Wien",    area: "Quadrate",   style: "Viennese / Coffee",  until: "20:00", emoji: "🥐" },
      { name: "Café Journal", area: "Heidelberg", style: "Coffee / Breakfast", until: "18:00", emoji: "📰" },
    ],
  },
  {
    id: "food", label: "Food", emoji: "🍜", time: "11:00 – 23:00",
    venues: [
      { name: "Alter Messplatz",     area: "Neckarstadt", style: "Street Food / Market", until: "20:00", emoji: "🍜" },
      { name: "Tapas Bar Mannheim",  area: "P-Quadrate",  style: "Spanish / Tapas",      until: "01:00", emoji: "🫒" },
      { name: "Reindl's Restaurant", area: "Innenstadt",  style: "German / Modern",      until: "22:00", emoji: "🍽️" },
    ],
  },
]

export function TimeBasedSections() {
  const [active, setActive] = useState("clubs")
  const section = SECTIONS.find(s => s.id === active)!

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Browse by type</h2>
          <p className="text-gray-500 text-sm mt-1">Filter by what you're looking for</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border-2 ${
                active === s.id
                  ? "bg-violet-600 border-violet-600 text-white shadow-md"
                  : "bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700"
              }`}
            >
              <span>{s.emoji}</span>{s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">Typical hours: {section.time}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {section.venues.map(v => (
            <div key={v.name} className="group flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50 transition-all cursor-pointer">
              <span className="text-2xl flex-shrink-0">{v.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 group-hover:text-violet-700 truncate">{v.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{v.style}</p>
                <p className="text-xs text-gray-300">{v.area}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">until</p>
                <p className="text-xs font-bold text-gray-600">{v.until}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
