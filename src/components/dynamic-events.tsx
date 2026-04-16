"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Euro, RefreshCw, ExternalLink } from "lucide-react"

const FALLBACK = [
  { id: "f1", title: "Rooftop Summer Sessions",       venue: "Skybar Mannheim",          date: "", time: "21:00", city: "Mannheim",   category: "Nightlife",  price: "€15", description: "Panoramic city views, craft cocktails, DJ sets.",                    sourceUrl: "https://www.google.com/search?q=Skybar+Mannheim",       imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop" },
  { id: "f2", title: "Underground Electronic Night",  venue: "MS Connexion",             date: "", time: "23:00", city: "Mannheim",   category: "Music",      price: "€20", description: "Deep electronic beats in Mannheim's premier underground venue.",      sourceUrl: "https://www.msconnexion.de",                            imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop" },
  { id: "f3", title: "Jazz & Wine Evening",           venue: "Heidelberg Castle Gardens", date: "", time: "19:30", city: "Heidelberg", category: "Culture",    price: "€25", description: "Live jazz trio and Rhine Valley wines in a historic setting.",         sourceUrl: "https://www.heidelberg-marketing.de",                  imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop" },
  { id: "f4", title: "Techno Rave — Zeitraumexit",   venue: "Zeitraumexit",             date: "", time: "00:00", city: "Mannheim",   category: "Nightlife",  price: "€12", description: "All-night techno in Mannheim's iconic underground art space.",         sourceUrl: "https://www.zeitraumexit.de",                          imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop" },
  { id: "f5", title: "Indie & Alternative Night",    venue: "Schwimmbad Club",          date: "", time: "22:00", city: "Heidelberg", category: "Music",      price: "€10", description: "Heidelberg's beloved weekly indie and post-punk night.",               sourceUrl: "https://www.schwimmbad-club.de",                       imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&h=400&fit=crop" },
  { id: "f6", title: "Kulturherbst: Art & Music",    venue: "Alte Feuerwache",          date: "", time: "18:00", city: "Mannheim",   category: "Culture",    price: "Free", description: "Local art installations, live performances, and community spirit.",  sourceUrl: "https://www.altefeuerwache.com",                       imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop" },
]

const CATEGORY_COLORS: Record<string, string> = {
  Nightlife: "text-violet-400 bg-violet-400/10",
  Music:     "text-blue-400   bg-blue-400/10",
  Culture:   "text-amber-400  bg-amber-400/10",
  Food:      "text-emerald-400 bg-emerald-400/10",
  Student:   "text-pink-400   bg-pink-400/10",
  Social:    "text-teal-400   bg-teal-400/10",
}

export function DynamicEvents() {
  const [events, setEvents] = useState<any[]>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState("all")

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setRefreshing(true)
      const res = await fetch("/api/events?status=approved&limit=9")
      if (!res.ok) throw new Error()
      const data = await res.json()
      if (data.events?.length > 0) setEvents(data.events)
      else setEvents(FALLBACK)
    } catch {
      setEvents(FALLBACK)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const cities = ["all", ...Array.from(new Set(events.map((e) => e.city)))]
  const filtered = filter === "all" ? events : events.filter((e) => e.city === filter)

  return (
    <section className="py-20 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">More events</h2>
            <p className="text-zinc-500 text-sm mt-1">Updated regularly across the region</p>
          </div>

          {/* City filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-white/[0.04] rounded-xl">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filter === c ? "bg-white/10 text-white" : "text-zinc-500 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 bg-white/[0.03] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event) => {
              const catStyle = CATEGORY_COLORS[event.category] ?? "text-zinc-400 bg-zinc-400/10"
              return (
                <div
                  key={event.id}
                  onClick={() => event.sourceUrl && window.open(event.sourceUrl, "_blank", "noopener,noreferrer")}
                  className="group cursor-pointer rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-200 overflow-hidden"
                >
                  {/* Image */}
                  {event.imageUrl && (
                    <div className="h-40 overflow-hidden relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-75"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
                      <span className={`absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${catStyle}`}>
                        {event.category}
                      </span>
                      {event.sourceUrl && (
                        <ExternalLink className="absolute top-3 right-3 w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors leading-snug mb-0.5 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-zinc-500 text-xs mb-3 truncate">{event.venue}</p>
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-4">{event.description}</p>

                    <div className="flex items-center justify-between text-xs text-zinc-600">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.city}</span>
                        {event.time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time}</span>}
                      </div>
                      {event.price && (
                        <span className={`font-semibold ${event.price === "Free" ? "text-emerald-400" : "text-zinc-400"}`}>
                          {event.price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Refresh */}
        <div className="flex justify-center mt-10">
          <button
            onClick={load}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing…" : "Load more events"}
          </button>
        </div>
      </div>
    </section>
  )
}
