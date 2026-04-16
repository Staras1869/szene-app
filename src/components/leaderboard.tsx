"use client"

import { useEffect, useState } from "react"
import { Trophy, Users, CalendarCheck } from "lucide-react"

interface LeaderboardData {
  events: { rank: number; eventId: string; name: string; rsvps: number }[]
  venues: { rank: number; venueId: string; name: string; checkIns: number }[]
}

const RANK_STYLES = [
  "text-amber-400 font-bold",   // #1
  "text-zinc-300 font-semibold", // #2
  "text-amber-700 font-semibold", // #3
]

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [tab, setTab] = useState<"events" | "venues">("events")

  useEffect(() => {
    fetch("/api/leaderboard").then((r) => r.json()).then(setData).catch(() => {})
  }, [])

  return (
    <section className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-amber-500/15 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">This week's top</h2>
              <p className="text-zinc-500 text-xs mt-0.5">Most popular in Mannheim right now</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl mb-6 w-fit">
            {(["events", "venues"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  tab === t ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* List */}
          {!data ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 bg-white/[0.03] rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {(tab === "events" ? data.events : data.venues).map((item, i) => (
                <div
                  key={"eventId" in item ? item.eventId : item.venueId}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                >
                  <span className={`w-6 text-sm text-center ${RANK_STYLES[i] ?? "text-zinc-500"}`}>
                    #{item.rank}
                  </span>
                  <span className="flex-1 text-sm text-zinc-200 font-medium truncate">{item.name}</span>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs">
                    {tab === "events"
                      ? <><CalendarCheck className="w-3 h-3" /> {"rsvps" in item ? item.rsvps : 0} going</>
                      : <><Users className="w-3 h-3" /> {"checkIns" in item ? item.checkIns : 0} check-ins</>
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
