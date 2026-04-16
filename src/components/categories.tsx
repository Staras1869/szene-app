"use client"

import { Music, Utensils, Palette, Users, TreePine, Zap, Calendar, MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const CATEGORIES = [
  { key: "events",      label: "Events",        icon: Calendar,  accent: "bg-violet-600" },
  { key: "nightlife",   label: "Nightlife",      icon: Zap,       accent: "bg-zinc-800"  },
  { key: "music",       label: "Music",          icon: Music,     accent: "bg-zinc-800"  },
  { key: "food",        label: "Food & Drink",   icon: Utensils,  accent: "bg-zinc-800"  },
  { key: "art",         label: "Art & Culture",  icon: Palette,   accent: "bg-zinc-800"  },
  { key: "social",      label: "Social",         icon: Users,     accent: "bg-zinc-800"  },
  { key: "outdoor",     label: "Outdoor",        icon: TreePine,  accent: "bg-zinc-800"  },
  { key: "locations",   label: "Near Me",        icon: MapPin,    accent: "bg-zinc-800"  },
]

export function Categories() {
  return (
    <section className="py-20 bg-zinc-950" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white tracking-tight">Browse by category</h2>
          <p className="text-zinc-500 mt-2 text-sm">What are you in the mood for?</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon
            return (
              <button
                key={cat.key}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/6 hover:border-violet-500/40 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${cat.accent} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors text-center leading-tight">
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
