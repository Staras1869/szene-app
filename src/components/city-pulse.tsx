"use client"

import { useEffect, useState } from "react"
import { Activity, Heart, Star, Users } from "lucide-react"

interface Stats { checkInsToday: number; totalFavorites: number; totalReviews: number; venuesLive: number }

function AnimatedCount({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!value) return
    let n = 0
    const step = Math.ceil(value / 30)
    const t = setInterval(() => { n = Math.min(n + step, value); setDisplay(n); if (n >= value) clearInterval(t) }, 30)
    return () => clearInterval(t)
  }, [value])
  return <>{display.toLocaleString()}</>
}

export function CityPulse() {
  const [stats, setStats] = useState<Stats | null>(null)
  useEffect(() => { fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {}) }, [])

  const items = stats ? [
    { icon: Activity, label: "Check-ins", value: stats.checkInsToday, color: "text-violet-400" },
    { icon: Users,    label: "Venues live",value: stats.venuesLive,   color: "text-emerald-400" },
    { icon: Heart,    label: "Saved",      value: stats.totalFavorites,color: "text-pink-400" },
    { icon: Star,     label: "Reviews",    value: stats.totalReviews, color: "text-amber-400" },
  ] : null

  return (
    <div className="bg-black border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            <span className="text-[11px] text-white/30 uppercase tracking-[0.15em] font-medium">Live · Mannheim</span>
          </div>
          <div className="flex flex-wrap gap-6">
            {items ? items.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="flex items-center gap-1.5">
                  <Icon className={`w-3 h-3 ${item.color}`} />
                  <span className="text-white text-xs font-bold"><AnimatedCount value={item.value} /></span>
                  <span className="text-white/25 text-xs">{item.label}</span>
                </div>
              )
            }) : Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-3 w-20 bg-white/[0.05] rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
