"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  MapPin, Clock, Euro, Search, Filter, RefreshCw, ExternalLink,
  Globe, Star, Music, Utensils, Coffee, Moon, Beer, Phone,
  Map, Loader2, Wifi, AlertCircle, ChevronDown,
} from "lucide-react"
import dynamic from "next/dynamic"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const VenuesMap = dynamic(() => import("@/components/venues-map"), { ssr: false })

// ── Types ─────────────────────────────────────────────────────────────────────

interface EventItem {
  id: string
  title: string
  venue: string
  date: string
  time: string
  city: string
  category: string
  price: string
  description: string
  imageUrl?: string
  sourceUrl?: string
  sourceName?: string
}

interface VenueItem {
  id: string
  name: string
  amenity: string
  category: string
  address: string
  city: string
  lat: number
  lon: number
  website?: string
  phone?: string
  openingHours?: string
  cuisine?: string
  googleMapsUrl: string
}

interface WebResult {
  id: string
  title: string
  subtitle: string
  snippet: string
  url: string
  imageUrl?: string
  date?: string
}

// ── Constants ─────────────────────────────────────────────────────────────────

const EVENT_CATEGORIES = ["All", "Music", "Nightlife", "Art & Culture", "Food", "Social", "Outdoor"]
const CITIES = ["All", "Mannheim", "Heidelberg", "Frankfurt"]
const VENUE_TYPES = [
  { label: "All", value: "", icon: Star },
  { label: "Nightclub", value: "nightclub", icon: Moon },
  { label: "Bar", value: "bar", icon: Beer },
  { label: "Restaurant", value: "restaurant", icon: Utensils },
  { label: "Café", value: "cafe", icon: Coffee },
  { label: "Live Music", value: "music", icon: Music },
]

// ── Amenity icon + colour ─────────────────────────────────────────────────────

function amenityIcon(amenity: string) {
  switch (amenity) {
    case "nightclub": return <Moon className="w-4 h-4" />
    case "bar":
    case "pub":
    case "biergarten": return <Beer className="w-4 h-4" />
    case "restaurant": return <Utensils className="w-4 h-4" />
    case "cafe": return <Coffee className="w-4 h-4" />
    default: return <MapPin className="w-4 h-4" />
  }
}

function amenityColor(amenity: string) {
  switch (amenity) {
    case "nightclub": return "bg-purple-100 text-purple-700 border-purple-200"
    case "bar":
    case "pub": return "bg-amber-100 text-amber-700 border-amber-200"
    case "biergarten": return "bg-green-100 text-green-700 border-green-200"
    case "restaurant": return "bg-orange-100 text-orange-700 border-orange-200"
    case "cafe": return "bg-sky-100 text-sky-700 border-sky-200"
    default: return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

// ── Cards ─────────────────────────────────────────────────────────────────────

function EventCard({ event }: { event: EventItem }) {
  const formattedDate = (() => {
    try {
      return new Date(event.date).toLocaleDateString("de-DE", { weekday: "short", day: "numeric", month: "short" })
    } catch { return event.date }
  })()

  return (
    <article
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
      onClick={() =>
        window.open(
          event.sourceUrl ?? `https://www.google.com/search?q=${encodeURIComponent(event.title + " " + event.venue)}`,
          "_blank", "noopener,noreferrer"
        )
      }
    >
      <div className="aspect-[16/9] overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 relative shrink-0">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎉</div>
        )}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className="bg-black/60 text-white border-0 text-xs backdrop-blur-sm">{event.category}</Badge>
          {event.sourceName && (
            <Badge className="bg-white/80 text-gray-700 border-0 text-xs backdrop-blur-sm">{event.sourceName}</Badge>
          )}
        </div>
      </div>

      <div className="p-5 space-y-3 flex flex-col flex-1">
        <div>
          <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{event.venue}</p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">{event.description}</p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.city}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formattedDate}</span>
          </div>
          <span className="flex items-center gap-1 font-semibold text-purple-600">
            <Euro className="w-3.5 h-3.5" />{event.price.replace("€", "").replace("Free", "Free")}
          </span>
        </div>
      </div>
    </article>
  )
}

function VenueCard({ venue }: { venue: VenueItem }) {
  return (
    <article className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-purple-600 transition-colors truncate">
            {venue.name}
          </h3>
          {venue.cuisine && (
            <p className="text-xs text-gray-400 mt-0.5 truncate">{venue.cuisine}</p>
          )}
        </div>
        <span className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${amenityColor(venue.amenity)}`}>
          {amenityIcon(venue.amenity)}
          {venue.category}
        </span>
      </div>

      {/* Address */}
      {venue.address && (
        <div className="flex items-start gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
          <span className="line-clamp-1">{venue.address}</span>
        </div>
      )}

      {/* Opening hours */}
      {venue.openingHours && (
        <div className="flex items-start gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
          <span className="line-clamp-1">{venue.openingHours}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-2">
        <a
          href={venue.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-600 transition-colors border border-gray-100"
        >
          <Map className="w-3.5 h-3.5" />
          Maps
        </a>
        {venue.website && (
          <a
            href={venue.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-600 transition-colors border border-gray-100"
          >
            <Globe className="w-3.5 h-3.5" />
            Website
          </a>
        )}
        {venue.phone && (
          <a
            href={`tel:${venue.phone}`}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium bg-gray-50 hover:bg-green-50 hover:text-green-700 text-gray-600 transition-colors border border-gray-100"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </article>
  )
}

function WebResultCard({ result }: { result: WebResult }) {
  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-5 items-start"
    >
      {result.imageUrl && (
        <img
          src={result.imageUrl}
          alt=""
          className="w-20 h-20 rounded-xl object-cover shrink-0"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm">
          {result.title}
        </h3>
        <p className="text-xs text-blue-500 mt-0.5 truncate">{result.subtitle}</p>
        <p className="text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{result.snippet}</p>
        {result.date && <p className="text-xs text-gray-400 mt-1">{result.date}</p>}
      </div>
      <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-purple-400 shrink-0 transition-colors" />
    </a>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Tab = "events" | "venues" | "web" | "map"

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<Tab>("venues")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [activeCity, setActiveCity] = useState("All")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeVenueType, setActiveVenueType] = useState("")

  // Events state
  const [events, setEvents] = useState<EventItem[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)

  // Venues state
  const [venues, setVenues] = useState<VenueItem[]>([])
  const [venuesLoading, setVenuesLoading] = useState(false)
  const [venueTotal, setVenueTotal] = useState(0)
  const [showAllVenues, setShowAllVenues] = useState(false)

  // Web search state
  const [webResults, setWebResults] = useState<WebResult[]>([])
  const [webLoading, setWebLoading] = useState(false)
  const [hasSearchProvider, setHasSearchProvider] = useState<boolean | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [search])

  // ── Fetch events ────────────────────────────────────────────────────────────
  const fetchEvents = useCallback(async () => {
    setEventsLoading(true)
    try {
      const params = new URLSearchParams({ limit: "60" })
      if (activeCity !== "All") params.set("city", activeCity)
      if (activeCategory !== "All") params.set("category", activeCategory)
      if (debouncedSearch) params.set("search", debouncedSearch)

      // Fetch from both API sources in parallel
      const [apiRes, scrapeRes] = await Promise.allSettled([
        fetch(`/api/events?${params}`).then((r) => r.ok ? r.json() : { events: [] }),
        fetch(`/api/search?mode=events&${params}`).then((r) => r.ok ? r.json() : { results: [] }),
      ])

      const apiEvents: EventItem[] = apiRes.status === "fulfilled" ? apiRes.value.events ?? [] : []
      const scrapeResults = scrapeRes.status === "fulfilled" ? scrapeRes.value.results ?? [] : []
      const scrapeEvents: EventItem[] = scrapeResults
        .filter((r: any) => r.type === "event")
        .map((r: any) => ({
          id: r.id,
          title: r.title,
          venue: r.sourceName ?? r.subtitle?.split("·")[0]?.trim() ?? "",
          date: r.date ?? new Date().toISOString().split("T")[0],
          time: r.time ?? "20:00",
          city: r.city ?? activeCity !== "All" ? activeCity : "Mannheim",
          category: r.category ?? "Music",
          price: r.price ?? "Free",
          description: r.description ?? "",
          imageUrl: r.imageUrl,
          sourceUrl: r.sourceUrl,
          sourceName: r.sourceName,
        }))

      // Merge & deduplicate by id
      const seen = new Set<string>()
      const merged: EventItem[] = []
      for (const e of [...apiEvents, ...scrapeEvents]) {
        if (!seen.has(e.id)) { seen.add(e.id); merged.push(e) }
      }
      setEvents(merged)
    } catch { setEvents([]) }
    finally { setEventsLoading(false) }
  }, [activeCity, activeCategory, debouncedSearch])

  // ── Fetch venues (OpenStreetMap) ────────────────────────────────────────────
  const fetchVenues = useCallback(async () => {
    setVenuesLoading(true)
    try {
      const params = new URLSearchParams({ limit: "200" })
      if (debouncedSearch) params.set("q", debouncedSearch)
      if (activeCity !== "All") params.set("city", activeCity)
      if (activeVenueType) params.set("category", activeVenueType)

      const res = await fetch(`/api/venues/live?${params}`)
      if (res.ok) {
        const data = await res.json()
        setVenues(data.venues ?? [])
        setVenueTotal(data.total ?? 0)
      }
    } catch { setVenues([]) }
    finally { setVenuesLoading(false) }
  }, [debouncedSearch, activeCity, activeVenueType])

  // ── Fetch web search ────────────────────────────────────────────────────────
  const fetchWebSearch = useCallback(async () => {
    setWebLoading(true)
    try {
      const params = new URLSearchParams({ mode: "web" })
      if (debouncedSearch) params.set("q", debouncedSearch)
      if (activeCity !== "All") params.set("city", activeCity)

      const res = await fetch(`/api/search?${params}`)
      if (res.ok) {
        const data = await res.json()
        setHasSearchProvider(data.hasSearchProvider ?? false)
        const webR = (data.results ?? [])
          .filter((r: any) => r.type === "web")
          .map((r: any) => ({
            id: r.id,
            title: r.title,
            subtitle: r.subtitle,
            snippet: r.snippet ?? "",
            url: r.url,
            imageUrl: r.imageUrl,
            date: r.date,
          }))
        setWebResults(webR)
      }
    } catch { setWebResults([]) }
    finally { setWebLoading(false) }
  }, [debouncedSearch, activeCity])

  // Trigger fetches based on active tab
  useEffect(() => {
    if (activeTab === "events") fetchEvents()
  }, [activeTab, fetchEvents])

  useEffect(() => {
    if (activeTab === "venues" || activeTab === "map") fetchVenues()
  }, [activeTab, fetchVenues])

  useEffect(() => {
    if (activeTab === "web") fetchWebSearch()
  }, [activeTab, fetchWebSearch])

  // Initial load
  useEffect(() => { fetchVenues() }, [fetchVenues])

  const isLoading = activeTab === "events" ? eventsLoading
    : activeTab === "venues" ? venuesLoading
    : webLoading

  const visibleVenues = showAllVenues ? venues : venues.slice(0, 30)

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-purple-700 via-violet-700 to-indigo-800 text-white pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Live data from OpenStreetMap + Web
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Discover Mannheim, Heidelberg & Frankfurt
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Every bar, club, restaurant — and tonight's events — sourced in real time across all three cities.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <Input
              type="text"
              placeholder={activeTab === "venues" ? "Search any venue, bar, club…" : "Search events, artists, venues…"}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 py-3 text-gray-900 bg-white border-0 rounded-xl shadow-xl text-base"
            />
            {isLoading && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
            )}
          </div>
        </div>
      </section>

      {/* ── Tabs ── */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2">
            {/* Tab buttons */}
            <div className="flex gap-1">
              {([
                { id: "venues", label: "Venues",     icon: MapPin, desc: "All bars, clubs & restaurants" },
                { id: "events", label: "Events",     icon: Clock,  desc: "Live & scraped events" },
                { id: "map",    label: "Map",        icon: Map,    desc: "Interactive map view" },
                { id: "web",    label: "Web Search", icon: Globe,  desc: "Google-powered results" },
              ] as const).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* City filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCity(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    activeCity === c
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-filters */}
          {activeTab === "events" && (
            <div className="flex items-center gap-1.5 flex-wrap pb-2">
              <Filter className="w-4 h-4 text-gray-400 shrink-0" />
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {activeTab === "venues" && (
            <div className="flex items-center gap-1.5 flex-wrap pb-2">
              {VENUE_TYPES.map((vt) => (
                <button
                  key={vt.value}
                  onClick={() => setActiveVenueType(vt.value)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeVenueType === vt.value
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <vt.icon className="w-3.5 h-3.5" />
                  {vt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats row */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-500">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                Searching live…
              </span>
            ) : activeTab === "venues" ? (
              <span>
                <strong className="text-gray-900">{venueTotal}</strong> real venues found
                <span className="ml-2 text-xs text-green-600 font-medium flex items-center gap-1 inline-flex">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Live from OpenStreetMap
                </span>
              </span>
            ) : activeTab === "events" ? (
              <span><strong className="text-gray-900">{events.length}</strong> events found</span>
            ) : (
              <span><strong className="text-gray-900">{webResults.length}</strong> web results</span>
            )}
          </div>

          <button
            onClick={() =>
              activeTab === "events" ? fetchEvents()
              : activeTab === "venues" ? fetchVenues()
              : fetchWebSearch()
            }
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── Events tab ── */}
        {activeTab === "events" && (
          <>
            {eventsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : events.length === 0 ? (
              <EmptyState
                emoji="🎪"
                title="No events found"
                subtitle="Try a different filter or search term."
                action={() => { setSearch(""); setActiveCategory("All"); setActiveCity("All") }}
                actionLabel="Clear filters"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {events.map((event) => <EventCard key={event.id} event={event} />)}
              </div>
            )}
          </>
        )}

        {/* ── Venues tab ── */}
        {activeTab === "venues" && (
          <>
            {venuesLoading && venues.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-44 animate-pulse" />
                ))}
              </div>
            ) : venues.length === 0 ? (
              <EmptyState
                emoji="🏠"
                title="No venues found"
                subtitle="Try a different filter or city."
                action={() => { setSearch(""); setActiveVenueType(""); setActiveCity("All") }}
                actionLabel="Clear filters"
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {visibleVenues.map((venue) => <VenueCard key={venue.id} venue={venue} />)}
                </div>

                {venues.length > 30 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={() => setShowAllVenues((v) => !v)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      {showAllVenues ? (
                        <>Show fewer venues</>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show all {venues.length} venues
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* OSM credit */}
                <div className="mt-10 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  Venue data from{" "}
                  <a href="https://www.openstreetmap.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">
                    OpenStreetMap
                  </a>
                  {" "}contributors · Updated hourly
                </div>
              </>
            )}
          </>
        )}

        {/* ── Map tab ── */}
        {activeTab === "map" && (
          <div>
            {venuesLoading && venues.length === 0 ? (
              <div className="flex items-center justify-center h-[600px] rounded-2xl bg-gray-100 animate-pulse" />
            ) : (
              <VenuesMap
                venues={venues}
                centerCity={activeCity === "All" ? "All" : activeCity}
                height="600px"
              />
            )}
          </div>
        )}

        {/* ── Web Search tab ── */}
        {activeTab === "web" && (
          <>
            {hasSearchProvider === false && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-900">Web search needs an API key</p>
                  <p className="text-amber-700 mt-1">
                    Add <code className="bg-amber-100 px-1 rounded">SERPER_API_KEY</code> (free at{" "}
                    <a href="https://serper.dev" target="_blank" rel="noopener noreferrer" className="underline">serper.dev</a>
                    ) or <code className="bg-amber-100 px-1 rounded">BRAVE_API_KEY</code> (free at{" "}
                    <a href="https://brave.com/search/api" target="_blank" rel="noopener noreferrer" className="underline">brave.com/search/api</a>
                    ) to your <code className="bg-amber-100 px-1 rounded">.env.local</code>.
                    The Venues tab works right now without any key.
                  </p>
                </div>
              </div>
            )}

            {webLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-24 animate-pulse" />
                ))}
              </div>
            ) : webResults.length === 0 ? (
              <EmptyState
                emoji="🔍"
                title={hasSearchProvider ? "No results found" : "Configure web search"}
                subtitle={hasSearchProvider ? "Try a different search." : "Add a Serper or Brave API key to enable Google-powered search."}
                action={hasSearchProvider ? () => setSearch("") : undefined}
                actionLabel="Clear search"
              />
            ) : (
              <div className="space-y-3">
                {webResults.map((r) => <WebResultCard key={r.id} result={r} />)}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

function EmptyState({
  emoji, title, subtitle, action, actionLabel,
}: {
  emoji: string
  title: string
  subtitle: string
  action?: () => void
  actionLabel?: string
}) {
  return (
    <div className="text-center py-24 space-y-4">
      <div className="text-6xl">{emoji}</div>
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
      {action && (
        <Button onClick={action} variant="outline" className="rounded-full">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
