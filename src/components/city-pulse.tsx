"use client"

import { useEffect, useState } from "react"
import { Activity, Heart, Star, Users } from "lucide-react"

interface Stats {
  checkInsToday: number
  totalFavorites: number
  totalReviews: number
  venuesLive: number
  eventsTonight: number
}

function AnimatedCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (value === 0) return
    let start = 0
    const step = Math.ceil(value / 30)
    const timer = setInterval(() => {
      start = Math.min(start + step, value)
      setDisplay(start)
      if (start >= value) clearInterval(timer)
    }, 30)
    return () => clearInterval(timer)
  }, [value])

  return <>{display.toLocaleString()}</>
}

export function CityPulse() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/stats").then((r) => r.json()).then(setStats).catch(() => {})
  }, [])

  const items = stats
    ? [
        { icon: Activity, label: "Check-ins today",   value: stats.checkInsToday,   accent: "text-violet-400" },
        { icon: Users,    label: "Venues live",        value: stats.venuesLive,       accent: "text-emerald-400" },
        { icon: Heart,    label: "Saved places",       value: stats.totalFavorites,  accent: "text-rose-400"   },
        { icon: Star,     label: "Reviews",            value: stats.totalReviews,    accent: "text-amber-400"  },
      ]
    : null

  return (
    <section className="bg-zinc-900/60 border-y border-white/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {/* Live indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Live · Mannheim</span>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {items
              ? items.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${item.accent}`} />
                      <span className="text-white text-sm font-semibold">
                        <AnimatedCount value={item.value} />
                      </span>
                      <span className="text-zinc-500 text-xs">{item.label}</span>
                    </div>
                  )
                })
              : Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                ))}
          </div>
        </div>
      </div>
    </section>
  )
}
