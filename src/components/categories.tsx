"use client"

import { Music, Utensils, Palette, Users, TreePine, Zap, Calendar, MapPin } from "lucide-react"

const CATEGORIES = [
  { key: "events",    label: "Events",       icon: Calendar,  bg: "bg-violet-600", light: "bg-violet-50 hover:bg-violet-100 border-violet-200" },
  { key: "nightlife", label: "Nightlife",    icon: Zap,       bg: "bg-zinc-900",   light: "bg-gray-50 hover:bg-gray-100 border-gray-200" },
  { key: "music",     label: "Music",        icon: Music,     bg: "bg-pink-600",   light: "bg-pink-50 hover:bg-pink-100 border-pink-200" },
  { key: "food",      label: "Food & Drink", icon: Utensils,  bg: "bg-amber-500",  light: "bg-amber-50 hover:bg-amber-100 border-amber-200" },
  { key: "art",       label: "Art & Culture",icon: Palette,   bg: "bg-blue-600",   light: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { key: "social",    label: "Social",       icon: Users,     bg: "bg-emerald-600",light: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200" },
  { key: "outdoor",   label: "Outdoor",      icon: TreePine,  bg: "bg-teal-600",   light: "bg-teal-50 hover:bg-teal-100 border-teal-200" },
  { key: "map",       label: "Near Me",      icon: MapPin,    bg: "bg-rose-500",   light: "bg-rose-50 hover:bg-rose-100 border-rose-200" },
]

export function Categories() {
  return (
    <section className="py-16 bg-white" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900">Browse by category</h2>
          <p className="text-gray-500 mt-1 text-sm">What are you in the mood for?</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.key}
                className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${cat.light}`}
              >
                <div className={`w-10 h-10 rounded-xl ${cat.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
