"use client"

import { useState, useEffect, useCallback } from "react"
import { Calendar, Clock, MapPin, ArrowRight, Check, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

const EVENTS = [
  {
    id: "event-1",
    title: "Rooftop Sessions",
    venue: "Sky Garden Mannheim",
    category: "Nightlife",
    date: "Fri 18 Apr",
    time: "20:00",
    location: "Quadrate, Mannheim",
    emoji: "🏙️",
    grad: "from-violet-900 via-violet-800 to-purple-900",
    seed: 24,
  },
  {
    id: "event-2",
    title: "Jazz & Wine Evening",
    venue: "Weinkeller am Wasserturm",
    category: "Music",
    date: "Sat 19 Apr",
    time: "19:30",
    location: "Wasserturm, Mannheim",
    emoji: "🎷",
    grad: "from-amber-900 via-orange-900 to-red-900",
    seed: 18,
  },
  {
    id: "event-3",
    title: "Electronic Sunday",
    venue: "BASE Club",
    category: "Nightlife",
    date: "Sun 20 Apr",
    time: "22:00",
    location: "Jungbusch, Mannheim",
    emoji: "🎧",
    grad: "from-zinc-900 via-zinc-800 to-neutral-900",
    seed: 41,
  },
  {
    id: "event-4",
    title: "Street Food Market",
    venue: "Alter Messplatz",
    category: "Food & Drink",
    date: "Sat 19 Apr",
    time: "12:00",
    location: "Neckarstadt, Mannheim",
    emoji: "🍜",
    grad: "from-emerald-900 via-teal-900 to-cyan-900",
    seed: 33,
  },
]

function RSVPButton({ eventId, seed }: { eventId: string; seed: number }) {
  const { user } = useAuth()
  const [going, setGoing] = useState(false)
  const [count, setCount] = useState(seed)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/events/rsvp?eventId=${eventId}`)
      .then((r) => r.json())
      .then((d) => { setGoing(d.going ?? false); setCount((d.count ?? 0) + seed) })
      .catch(() => {})
  }, [eventId, seed])

  const toggle = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch("/api/events/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ eventId }) })
      const d = await res.json()
      setGoing(d.going)
      setCount((d.count ?? 0) + seed)
    } catch {}
    setLoading(false)
  }, [user, eventId, seed])

  if (!user) {
    return (
      <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors">
        <Users className="w-3 h-3" />{count} going
      </Link>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
        going ? "bg-violet-600 text-white" : "border border-white/15 text-white/50 hover:border-violet-400/50 hover:text-white"
      }`}
    >
      {going ? <Check className="w-3 h-3" /> : <Users className="w-3 h-3" />}
      {going ? "Going" : `${count} going`}
    </button>
  )
}

export function CuratedEvents() {
  return (
    <section className="py-16 bg-black" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] text-fuchsia-400 uppercase tracking-[0.15em] font-semibold mb-1">This week</p>
            <h2 className="text-2xl font-black text-white tracking-tight">Happening now</h2>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white transition-colors">
            See all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="group cursor-pointer rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-violet-500/25 transition-all duration-300 overflow-hidden"
            >
              {/* Image area */}
              <div className={`bg-gradient-to-br ${event.grad} h-44 flex items-center justify-center relative`}>
                <span className="text-6xl">{event.emoji}</span>
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/50 font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-white text-sm group-hover:text-violet-300 transition-colors leading-snug mb-0.5">
                  {event.title}
                </h3>
                <p className="text-white/30 text-xs mb-3">{event.venue}</p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Calendar className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    {event.date}
                    <Clock className="w-3 h-3 text-violet-400 ml-1 flex-shrink-0" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-white/30 text-xs">
                    <MapPin className="w-3 h-3 text-fuchsia-400 flex-shrink-0" />
                    {event.location}
                  </div>
                </div>

                <RSVPButton eventId={event.id} seed={event.seed} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
