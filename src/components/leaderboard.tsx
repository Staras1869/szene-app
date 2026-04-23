"use client"

import { useEffect, useState } from "react"
import { CalendarCheck, Users } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface LeaderboardData {
  events: { rank: number; eventId: string; name: string; rsvps: number }[]
  venues: { rank: number; venueId: string; name: string; checkIns: number }[]
}

const RANK_COLORS = ["text-amber-400", "text-zinc-400", "text-amber-700"]

export function Leaderboard() {
  const { t } = useLanguage()
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [tab, setTab] = useState<"events" | "venues">("events")

  useEffect(() => { fetch("/api/leaderboard").then(r => r.json()).then(setData).catch(() => {}) }, [])

  return (
    <section className="py-16" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <p className="text-[11px] text-amber-400 uppercase tracking-[0.15em] font-semibold mb-1">Rankings</p>
            <h2 className="text-2xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>This week&apos;s top</h2>
          </div>

          <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            {(["events", "venues"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all"
                style={tab === t
                  ? { backgroundColor: "var(--card-bg)", color: "var(--text-primary)" }
                  : { color: "var(--text-muted)" }}
              >
                {t}
              </button>
            ))}
          </div>

          {!data ? (
            <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl animate-pulse" style={{ backgroundColor: "var(--bg-surface)" }} />
            ))}</div>
          ) : (
            <div className="space-y-2">
              {(tab === "events" ? data.events : data.venues).map((item, i) => (
                <div
                  key={"eventId" in item ? item.eventId : item.venueId}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all cursor-pointer szene-card"
                >
                  <span className={`w-6 text-sm text-center font-bold ${RANK_COLORS[i] ?? "text-zinc-600"}`}>#{item.rank}</span>
                  <span className="flex-1 text-sm font-semibold truncate" style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-faint)" }}>
                    {tab === "events"
                      ? <><CalendarCheck className="w-3 h-3" /> {"rsvps" in item ? item.rsvps : 0} {t("going")}</>
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
