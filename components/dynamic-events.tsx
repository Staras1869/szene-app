"use client"

import { useState, useEffect } from "react"
import { MapPin, Clock, Euro, AlertCircle, RefreshCw, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

const fallbackEvents = [
  {
    id: "1",
    title: "🌆 Rooftop Summer Sessions",
    venue: "Skybar Mannheim",
    date: "2024-07-15",
    time: "21:00",
    city: "Mannheim",
    category: "Nightlife",
    price: "€15",
    description: "Experience summer nights on our spectacular rooftop terrace with panoramic city views.",
    imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
  },
  {
    id: "2",
    title: "🎵 Underground Electronic Night",
    venue: "MS Connexion",
    date: "2024-07-20",
    time: "23:00",
    city: "Mannheim",
    category: "Music",
    price: "€20",
    description: "Deep electronic beats in Mannheim's premier underground venue.",
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format",
  },
  {
    id: "3",
    title: "🎷 Jazz & Wine Evening",
    venue: "Heidelberg Castle",
    date: "2024-07-22",
    time: "19:30",
    city: "Heidelberg",
    category: "Art",
    price: "€25",
    description: "Sophisticated evening with live jazz and premium wines.",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
  },
]

export function DynamicEvents() {
  const { t } = useLanguage()
  const [events, setEvents] = useState<any[]>(fallbackEvents)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set())

  useEffect(() => {
    setMounted(true)
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setError(null)
      setRefreshing(true)
      console.log("Fetching events with catchy images...")
      const response = await fetch("/api/events?status=approved&limit=9")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("Received events with images:", data)

      if (data.events && data.events.length > 0) {
        setEvents(data.events)
      } else {
        console.log("No events returned, using fallback events")
        setEvents(fallbackEvents)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
      setError("Using demo events - automation system starting up")
      setEvents(fallbackEvents)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleImageError = (eventId: string) => {
    setImageLoadErrors((prev) => new Set(prev).add(eventId))
  }

  const getCategoryFallbackImage = (category: string) => {
    const fallbackImages = {
      Nightlife: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
      Music: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&auto=format",
      Food: "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop&auto=format",
      Art: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&auto=format",
      Culture: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
      Social: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop&auto=format",
    }
    return fallbackImages[category as keyof typeof fallbackImages] || fallbackImages.Social
  }

  const handleEventClick = (event: any) => {
    const eventUrl = event.sourceUrl || event.url || `#event-${event.id}`
    window.open(eventUrl, "_blank", "noopener,noreferrer")
  }

  if (!mounted) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900">{t("thisWeeksHighlights")}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t("loading")}...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-gray-900">{t("thisWeeksHighlights")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {error ? "Demo events while system initializes" : t("eventsDescription")}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              {t("autoUpdated")}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {t("realVenueImages")}
            </Badge>
            {error && (
              <Badge variant="secondary" className="text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                {t("demoMode")}
              </Badge>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  {!imageLoadErrors.has(event.id) ? (
                    <img
                      src={event.imageUrl || getCategoryFallbackImage(event.category)}
                      alt={`${event.title} at ${event.venue}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={() => handleImageError(event.id)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                        <div className="text-sm font-medium">{event.category}</div>
                        <div className="text-xs">{event.venue}</div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                      {t("realImage")}
                    </Badge>
                  </div>
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-blue-500 text-white border-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {t("clickToOpen")}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600">{event.venue}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {event.category}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{event.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.city}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Euro className="w-4 h-4" />
                      <span>{event.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="rounded-full px-8" onClick={fetchEvents} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                {t("refreshingImages")}...
              </>
            ) : error ? (
              t("retryLoadingEvents")
            ) : (
              t("loadMoreEvents")
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}
