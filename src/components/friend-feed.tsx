"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { MapPin, UserPlus } from "lucide-react"
import Link from "next/link"

interface FeedItem {
  id: string
  type: "checkin"
  userId: string
  userName: string
  venueName: string
  venueId: string
  createdAt: string
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-9 h-9 rounded-full bg-violet-600/20 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-violet-300">{name[0]?.toUpperCase()}</span>
    </div>
  )
}

export function FriendFeed() {
  const { user, loading } = useAuth()
  const [items, setItems] = useState<FeedItem[]>([])
  const [fetched, setFetched] = useState(false)

  useEffect(() => {
    if (loading || !user) { setFetched(true); return }
    fetch("/api/feed")
      .then((r) => r.json())
      .then((d) => setItems(d.items ?? []))
      .catch(() => {})
      .finally(() => setFetched(true))
  }, [user, loading])

  // Not logged in
  if (!loading && !user) {
    return (
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-10 text-center">
            <UserPlus className="w-8 h-8 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">See where your friends are</h3>
            <p className="text-zinc-500 text-sm mb-6">Sign in to follow friends and see their check-ins in real time.</p>
            <Link href="/login" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Loading
  if (!fetched) {
    return (
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-white/[0.03] rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // No activity yet
  if (items.length === 0) {
    return (
      <section className="py-16 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white">Friend activity</h2>
              <p className="text-zinc-500 text-xs mt-0.5">What people you follow are doing</p>
            </div>
          </div>
          <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-10 text-center">
            <p className="text-zinc-500 text-sm">No activity yet — follow people from their profile to see where they check in.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-white">Friend activity</h2>
            <p className="text-zinc-500 text-xs mt-0.5">What people you follow are doing</p>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <Avatar name={item.userName} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200">
                  <span className="font-semibold text-white">{item.userName}</span>
                  {" checked in at "}
                  <span className="text-violet-300 font-medium">{item.venueName}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-600 text-xs flex-shrink-0">
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
