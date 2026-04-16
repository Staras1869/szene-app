"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, UserPlus } from "lucide-react"
import Link from "next/link"

interface FeedItem { id: string; type: "checkin"; userId: string; userName: string; venueName: string; venueId: string; createdAt: string }

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function FriendFeed() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState<FeedItem[]>([])
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if (loading || !user) { setFetched(true); return }
    fetch("/api/feed").then(r => r.json()).then(d => setItems(d.items ?? [])).catch(() => {}).finally(() => setFetched(true))
  }, [user, loading])

  if (!loading && !user) {
    return (
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-10 text-center">
            <UserPlus className="w-8 h-8 text-white/15 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-1">See where your friends are</h3>
            <p className="text-white/30 text-sm mb-6">Sign in to follow friends and see their check-ins live.</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (!fetched) return null

  if (items.length === 0) {
    return (
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black text-white mb-6 tracking-tight">Friend activity</h2>
          <div className="rounded-2xl border border-white/[0.07] p-8 text-center">
            <p className="text-white/25 text-sm">No activity yet — follow people from their profile to see their check-ins here.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-black text-white mb-6 tracking-tight">Friend activity</h2>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.06] hover:border-violet-500/20 transition-colors">
              <div className="w-9 h-9 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-violet-400">{item.userName[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/60">
                  <span className="font-bold text-white">{item.userName}</span>
                  {" checked in at "}
                  <span className="text-violet-400 font-semibold">{item.venueName}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-white/20 text-xs flex-shrink-0">
                <MapPin className="w-3 h-3" />
                {timeAgo(item.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
