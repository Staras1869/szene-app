"use client"

import { useEffect, useState } from "react"
import { Trophy, Users, CalendarCheck } from "lucide-react"

interface LeaderboardData {
  events: { rank: number; eventId: string; name: string; rsvps: number }[]
  venues: { rank: number; venueId: string; name: string; checkIns: number }[]
}

const RANK_COLORS = ["text-amber-400", "text-white/40", "text-amber-700/80"]

export function Leaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [tab, setTab] = useState<"events" | "venues">("events")

  useEffect(() => { fetch("/api/leaderboard").then(r => r.json()).then(setData).catch(() => {}) }, [])

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <p className="text-[11px] text-amber-400 uppercase tracking-[0.15em] font-semibold mb-1">Rankings</p>
            <h2 className="text-2xl font-black text-white tracking-tight">This week's top</h2>
          </div>

          <div className="flex gap-1 p-1 bg-white/[0.05] border border-white/[0.08] rounded-xl mb-6 w-fit">
            {(["events", "venues"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  tab === t ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {!data ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-white/[0.04] rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {(tab === "events" ? data.events : data.venues).map((item, i) => (
                <div
                  key={"eventId" in item ? item.eventId : item.venueId}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-500/25 transition-all cursor-pointer"
                >
                  <span className={`w-6 text-sm text-center font-bold ${RANK_COLORS[i] ?? "text-white/20"}`}>#{item.rank}</span>
                  <span className="flex-1 text-sm font-semibold text-white/80 truncate">{item.name}</span>
                  <div className="flex items-center gap-1 text-white/25 text-xs">
                    {tab === "events"
                      ? <><CalendarCheck className="w-3 h-3" /> {"rsvps" in item ? item.rsvps : 0} going</>
                      : <><Users className="w-3 h-3" /> {"checkIns" in item ? item.checkIns : 0} check-ins</>}
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
