"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users } from "lucide-react"

interface TrendingVenue {
  venueId: string
  name: string
  area: string
  type: string
  emoji: string
  checkIns: number
  isLive: boolean
}

export function TrendingVenues() {
  const [venues, setVenues] = useState<TrendingVenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/trending")
      .then((r) => r.json())
      .then((d) => setVenues(d.trending ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 bg-zinc-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-rose-500/15 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Trending right now</h2>
            <p className="text-zinc-500 text-xs mt-0.5">Most active in the last 3 hours</p>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-white/[0.03] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {venues.map((venue, rank) => (
              <div
                key={venue.venueId}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-200 cursor-pointer"
              >
                {/* Rank */}
                <div className="w-7 h-7 flex-shrink-0 rounded-full bg-white/5 flex items-center justify-center">
                  <span className="text-xs font-bold text-zinc-500">#{rank + 1}</span>
                </div>

                {/* Emoji */}
                <div className="text-2xl flex-shrink-0">{venue.emoji}</div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate group-hover:text-violet-300 transition-colors">
                    {venue.name}
                  </p>
                  <p className="text-zinc-500 text-xs mt-0.5">{venue.area} · {venue.type}</p>
                </div>

                {/* Check-ins */}
                <div className="flex-shrink-0 flex items-center gap-1 text-zinc-400">
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-semibold">{venue.checkIns}</span>
                </div>

                {/* Live badge */}
                {venue.isLive && (
                  <span className="flex-shrink-0 text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                    Live
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
