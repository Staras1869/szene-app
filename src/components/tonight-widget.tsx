"use client"

import { useState, useEffect } from "react"
import { Clock, MapPin, Euro, ArrowRight } from "lucide-react"
import Link from "next/link"

interface TonightEvent {
  id: string
  title: string
  venue: string
  time: string
  city: string
  category: string
  price: string
  imageUrl?: string
  sourceUrl?: string
}

const EMOJI: Record<string, string> = {
  Music:         "🎵",
  Nightlife:     "🌙",
  "Art & Culture": "🎨",
  Art:           "🎨",
  Food:          "🍽️",
  Social:        "🎉",
  Outdoor:       "🌿",
}

export function TonightWidget() {
  const [events, setEvents] = useState<TonightEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/events?date=today&limit=10")
      .then((r) => r.ok ? r.json() : { events: [] })
      .then((d) => setEvents(d.events ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && events.length === 0) return null

  return (
    <section className="py-12 bg-gradient-to-r from-violet-950 via-purple-900 to-indigo-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-500 text-white rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              TONIGHT
            </span>
            <h2 className="text-2xl font-bold text-white">What&apos;s on tonight</h2>
          </div>
          <Link
            href="/discover?tab=events&date=today"
            className="flex items-center gap-1.5 text-sm text-purple-300 hover:text-white transition-colors"
          >
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-64 h-44 bg-white/10 rounded-2xl animate-pulse" />
              ))
            : events.map((event) => (
                <a
                  key={event.id}
                  href={event.sourceUrl ?? `/discover`}
                  target={event.sourceUrl ? "_blank" : undefined}
                  rel={event.sourceUrl ? "noopener noreferrer" : undefined}
                  className="snap-start shrink-0 w-64 group cursor-pointer"
                >
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-800 to-blue-800">
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Category chip */}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm text-white rounded-full px-2.5 py-1">
                        {EMOJI[event.category] ?? "🎉"} {event.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-sm leading-tight line-clamp-2 mb-1.5">
                        {event.title}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.venue}
                        </span>
                        <span className="flex items-center gap-0.5 font-semibold text-white">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-purple-300 font-medium">
                        <Euro className="w-3 h-3" />
                        {event.price}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
        </div>
      </div>
    </section>
  )
}
