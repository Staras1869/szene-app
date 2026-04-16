"use client"

import { useState, useEffect } from "react"
import { Heart, MapPin, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useFavorites } from "@/hooks/use-favorites"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { OSMVenue } from "@/lib/overpass-api"
import { makeVenueSlug } from "@/lib/venue-slug"

export default function FavoritesPage() {
  const { favorites, toggleFavorite, loaded } = useFavorites()
  const [venues, setVenues] = useState<OSMVenue[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loaded || favorites.size === 0) return
    // Fetch all live venues once and filter to favorites
    setLoading(true)
    fetch("/api/venues/live?limit=300")
      .then((r) => r.ok ? r.json() : { venues: [] })
      .then((d) => {
        const favSet = favorites
        setVenues((d.venues ?? []).filter((v: OSMVenue) => favSet.has(v.id)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [loaded, favorites])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/discover" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Discover
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-7 h-7 text-red-500 fill-current" />
              My Favourites
            </h1>
            <p className="text-gray-500 mt-1">{favorites.size} saved venue{favorites.size !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {!loaded || loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : favorites.size === 0 ? (
          <div className="text-center py-24 space-y-4">
            <div className="text-6xl">💔</div>
            <h2 className="text-2xl font-bold text-gray-900">No saved venues yet</h2>
            <p className="text-gray-500">Browse the discover page and tap the heart on any venue to save it here.</p>
            <Link href="/discover" className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">
              Explore venues
            </Link>
          </div>
        ) : venues.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p>Your saved venues aren't in our current database view. <br />
              <Link href="/discover" className="text-purple-600 underline">Browse live venues</Link> and re-save them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {venues.map((venue) => (
              <div key={venue.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link href={`/venue/${makeVenueSlug(venue.name, venue.city)}`}
                      className="font-bold text-gray-900 hover:text-purple-600 transition-colors">
                      {venue.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{venue.category} · {venue.city}</p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(venue.id)}
                    className="p-1.5 rounded-full text-red-400 hover:bg-red-50 transition-colors shrink-0"
                    title="Remove from favourites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {venue.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
                    <span>{venue.address}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-auto">
                  <a href={venue.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 text-center py-1.5 px-3 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-700 text-gray-600 text-xs font-medium transition-colors border border-gray-100">
                    Maps
                  </a>
                  {venue.website && (
                    <a href={venue.website} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 px-3 rounded-xl bg-gray-50 hover:bg-blue-50 hover:text-blue-700 text-gray-600 text-xs font-medium transition-colors border border-gray-100">
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
