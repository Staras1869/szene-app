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
    accent: "from-violet-900/80 to-violet-800/80",
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
    accent: "from-amber-900/80 to-amber-800/80",
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
    accent: "from-zinc-800/80 to-zinc-700/80",
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
    accent: "from-emerald-900/80 to-emerald-800/80",
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
      .then((d) => {
        setGoing(d.going ?? false)
        setCount((d.count ?? 0) + seed)
      })
      .catch(() => {})
  }, [eventId, seed])

  const toggle = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })
      const d = await res.json()
      setGoing(d.going)
      setCount((d.count ?? 0) + seed)
    } catch {}
    setLoading(false)
  }, [user, eventId, seed])

  if (!user) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 transition-colors"
      >
        <Users className="w-3 h-3" />
        {count} going
      </Link>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
        going
          ? "bg-violet-600 text-white"
          : "border-2 border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50"
      }`}
    >
      {going ? <Check className="w-3 h-3" /> : <Users className="w-3 h-3" />}
      {going ? "Going" : `${count} going`}
    </button>
  )
}

export function CuratedEvents() {
  return (
    <section className="py-20 bg-white" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Happening this week</h2>
            <p className="text-gray-500 mt-1 text-sm">Hand-picked by the Szene team</p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            See all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="group cursor-pointer rounded-2xl border-2 border-gray-100 bg-white hover:border-violet-200 hover:bg-violet-50 transition-all duration-200 overflow-hidden shadow-sm"
            >
              {/* Image area */}
              <div className={`bg-gradient-to-br ${event.accent} h-40 flex items-center justify-center relative backdrop-blur-sm`}>
                <span className="text-5xl">{event.emoji}</span>
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/60 font-medium bg-black/40 px-2 py-0.5 rounded-full">
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-violet-600 transition-colors leading-snug mb-0.5">
                  {event.title}
                </h3>
                <p className="text-gray-500 text-xs mb-3">{event.venue}</p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <Calendar className="w-3 h-3 text-violet-500 flex-shrink-0" />
                    {event.date}
                    <Clock className="w-3 h-3 text-violet-500 ml-1 flex-shrink-0" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                    <MapPin className="w-3 h-3 text-violet-500 flex-shrink-0" />
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
