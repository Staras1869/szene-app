"use client"

import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react"

const EVENTS = [
  {
    id: "1",
    title: "Rooftop Sessions",
    venue: "Sky Garden Mannheim",
    category: "Nightlife",
    date: "Fri 18 Apr",
    time: "20:00",
    location: "Quadrate, Mannheim",
    image: "🏙️",
    accent: "from-violet-900 to-violet-800",
  },
  {
    id: "2",
    title: "Jazz & Wine Evening",
    venue: "Weinkeller am Wasserturm",
    category: "Music",
    date: "Sat 19 Apr",
    time: "19:30",
    location: "Wasserturm, Mannheim",
    image: "🎷",
    accent: "from-amber-900 to-amber-800",
  },
  {
    id: "3",
    title: "Electronic Sunday",
    venue: "BASE Club",
    category: "Nightlife",
    date: "Sun 20 Apr",
    time: "22:00",
    location: "Jungbusch, Mannheim",
    image: "🎧",
    accent: "from-zinc-800 to-zinc-700",
  },
  {
    id: "4",
    title: "Street Food Market",
    venue: "Alter Messplatz",
    category: "Food & Drink",
    date: "Sat 19 Apr",
    time: "12:00",
    location: "Neckarstadt, Mannheim",
    image: "🍜",
    accent: "from-emerald-900 to-emerald-800",
  },
]

export function CuratedEvents() {
  return (
    <section className="py-20 bg-zinc-950" id="events">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Happening this week</h2>
            <p className="text-zinc-500 mt-1 text-sm">Hand-picked by the Szene team</p>
          </div>
          <button className="hidden sm:inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors">
            See all <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="group cursor-pointer rounded-2xl border border-white/6 bg-white/[0.02] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all duration-200 overflow-hidden"
            >
              {/* Image area */}
              <div className={`bg-gradient-to-br ${event.accent} h-40 flex items-center justify-center relative`}>
                <span className="text-5xl">{event.image}</span>
                <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest text-white/50 font-medium bg-black/30 px-2 py-0.5 rounded-full">
                  {event.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm group-hover:text-violet-300 transition-colors leading-snug mb-1">
                  {event.title}
                </h3>
                <p className="text-zinc-500 text-xs mb-3">{event.venue}</p>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Calendar className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    {event.date}
                    <Clock className="w-3 h-3 text-violet-400 ml-2 flex-shrink-0" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <MapPin className="w-3 h-3 text-violet-400 flex-shrink-0" />
                    {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
