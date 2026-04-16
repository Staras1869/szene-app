"use client"

import { useEffect, useState } from "react"
import { Users, ArrowUpRight } from "lucide-react"
import Link from "next/link"

interface TrendingVenue { venueId: string; name: string; area: string; type: string; emoji: string; checkIns: number; isLive: boolean }

export function TrendingVenues() {
  const [venues, setVenues] = useState<TrendingVenue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/trending").then(r => r.json()).then(d => setVenues(d.trending ?? [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-16 bg-zinc-950" id="venues">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] text-violet-400 uppercase tracking-[0.15em] font-semibold mb-1">Right now</p>
            <h2 className="text-2xl font-black text-white tracking-tight">Trending</h2>
          </div>
          <span className="text-xs text-white/20">Most active · 3h</span>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-20 bg-white/[0.04] rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {venues.map((venue, rank) => (
              <Link
                key={venue.venueId}
                href={`/venue/${venue.venueId}`}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:border-violet-500/30 transition-all duration-200"
              >
                <span className="text-xs font-bold text-white/20 w-5 flex-shrink-0">#{rank + 1}</span>
                <span className="text-2xl flex-shrink-0">{venue.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate group-hover:text-violet-300 transition-colors">{venue.name}</p>
                  <p className="text-xs text-white/30 mt-0.5">{venue.area} · {venue.type}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-1 text-white/30">
                  <Users className="w-3 h-3" />
                  <span className="text-xs font-semibold">{venue.checkIns}</span>
                </div>
                {venue.isLive && (
                  <span className="flex-shrink-0 text-[9px] text-emerald-400 font-bold uppercase tracking-wider bg-emerald-400/10 px-1.5 py-0.5 rounded-full">Live</span>
                )}
                <ArrowUpRight className="w-3.5 h-3.5 text-white/10 group-hover:text-violet-400 transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
