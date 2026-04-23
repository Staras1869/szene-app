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
      <section className="py-16" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl p-10 text-center szene-card">
            <UserPlus className="w-8 h-8 mx-auto mb-4" style={{ color: "var(--text-faint)" }} />
            <h3 className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>See where your friends are</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>Sign in to follow friends and see their check-ins live.</p>
            <Link href="/login" className="inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors" style={{ backgroundColor: "var(--accent)" }}>
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
      <section className="py-16" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-black mb-6 tracking-tight" style={{ color: "var(--text-primary)" }}>Friend activity</h2>
          <div className="rounded-2xl p-8 text-center szene-card">
            <p className="text-sm" style={{ color: "var(--text-faint)" }}>No activity yet — follow people from their profile to see their check-ins here.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16" style={{ backgroundColor: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-black mb-6 tracking-tight" style={{ color: "var(--text-primary)" }}>Friend activity</h2>
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl transition-colors szene-card">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{item.userName[0]?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  <span className="font-bold" style={{ color: "var(--text-primary)" }}>{item.userName}</span>
                  {" checked in at "}
                  <span className="font-semibold" style={{ color: "var(--accent)" }}>{item.venueName}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: "var(--text-faint)" }}>
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
