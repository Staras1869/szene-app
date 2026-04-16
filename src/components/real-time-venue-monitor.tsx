"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Globe, Facebook, Instagram, CheckCircle, AlertCircle, Clock } from "lucide-react"

interface VenueStatus {
  id: string
  name: string
  city: string
  status: "online" | "offline" | "checking"
  lastScrape: string
  eventsFound: number
  responseTime: number
  sources: {
    website: boolean
    facebook: boolean
    instagram: boolean
  }
  nextScrape: string
}

export function RealTimeVenueMonitor() {
  const [venues, setVenues] = useState<VenueStatus[]>([])
  const [mounted, setMounted] = useState(false)
  const [selectedCity, setSelectedCity] = useState<"all" | "Mannheim" | "Heidelberg">("all")

  useEffect(() => {
    setMounted(true)
    generateVenueStatuses()

    // Update venue statuses every 20 seconds
    const interval = setInterval(generateVenueStatuses, 20000)

    return () => clearInterval(interval)
  }, [])

  const generateVenueStatuses = () => {
    const venueList = [
      { id: "tiffany-club", name: "Tiffany Club", city: "Mannheim" },
      { id: "ms-connexion", name: "MS Connexion", city: "Mannheim" },
      { id: "capitol-mannheim", name: "Capitol Mannheim", city: "Mannheim" },
      { id: "alte-feuerwache", name: "Alte Feuerwache", city: "Mannheim" },
      { id: "zeitraumexit", name: "Zeitraumexit", city: "Mannheim" },
      { id: "karlstorbahnhof", name: "Karlstorbahnhof", city: "Heidelberg" },
      { id: "halle02", name: "halle02", city: "Heidelberg" },
      { id: "cave54", name: "Cave 54", city: "Heidelberg" },
      { id: "villa-nachttanz", name: "Villa Nachttanz", city: "Heidelberg" },
      { id: "schwimmbad-club", name: "Schwimmbad Club", city: "Heidelberg" },
    ]

    const statuses: VenueStatus[] = venueList.map((venue) => {
      const now = new Date()
      const lastScrape = new Date(now.getTime() - Math.random() * 1800000) // Last 30 minutes
      const nextScrape = new Date(now.getTime() + Math.random() * 3600000) // Next hour
      const isOnline = Math.random() > 0.1 // 90% uptime

      return {
        id: venue.id,
        name: venue.name,
        city: venue.city,
        status: isOnline ? "online" : Math.random() > 0.5 ? "offline" : "checking",
        lastScrape: lastScrape.toISOString(),
        eventsFound: Math.floor(Math.random() * 8) + 1, // 1-8 events
        responseTime: Math.floor(Math.random() * 300) + 100, // 100-400ms
        sources: {
          website: isOnline && Math.random() > 0.2,
          facebook: isOnline && Math.random() > 0.3,
          instagram: isOnline && Math.random() > 0.4,
        },
        nextScrape: nextScrape.toISOString(),
      }
    })

    setVenues(statuses)
  }

  const filteredVenues = venues.filter((venue) => selectedCity === "all" || venue.city === selectedCity)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-50"
      case "offline":
        return "text-red-600 bg-red-50"
      case "checking":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "offline":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "checking":
        return <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getTimeUntilNext = (nextScrape: string) => {
    const now = new Date()
    const next = new Date(nextScrape)
    const diffInMinutes = Math.floor((next.getTime() - now.getTime()) / 60000)

    if (diffInMinutes < 1) return "Now"
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    return `${Math.floor(diffInMinutes / 60)}h ${diffInMinutes % 60}m`
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Venue Monitor</h3>
          <Badge variant="outline" className="text-xs">
            {filteredVenues.filter((v) => v.status === "online").length}/{filteredVenues.length} Online
          </Badge>
        </div>

        {/* City Filter */}
        <div className="flex gap-1">
          {["all", "Mannheim", "Heidelberg"].map((city) => (
            <Button
              key={city}
              variant={selectedCity === city ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCity(city as any)}
              className="text-xs"
            >
              {city === "all" ? "All" : city}
            </Button>
          ))}
        </div>
      </div>

      {/* Venue List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredVenues.map((venue) => (
          <div key={venue.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{venue.name}</h4>
                <Badge variant="secondary" className="text-xs">
                  {venue.city}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(venue.status)}
                <Badge variant="outline" className={`text-xs ${getStatusColor(venue.status)}`}>
                  {venue.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 mb-2">
              <div>
                Events Found: <span className="font-medium">{venue.eventsFound}</span>
              </div>
              <div>
                Response: <span className="font-medium">{venue.responseTime}ms</span>
              </div>
              <div>
                Last Scrape:{" "}
                <span className="font-medium">
                  {new Date(venue.lastScrape).toLocaleTimeString("de-DE", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div>
                Next: <span className="font-medium">{getTimeUntilNext(venue.nextScrape)}</span>
              </div>
            </div>

            {/* Source Status */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Globe className={`w-3 h-3 ${venue.sources.website ? "text-green-500" : "text-gray-300"}`} />
                <span className="text-xs">Web</span>
              </div>
              <div className="flex items-center gap-1">
                <Facebook className={`w-3 h-3 ${venue.sources.facebook ? "text-blue-500" : "text-gray-300"}`} />
                <span className="text-xs">FB</span>
              </div>
              <div className="flex items-center gap-1">
                <Instagram className={`w-3 h-3 ${venue.sources.instagram ? "text-pink-500" : "text-gray-300"}`} />
                <span className="text-xs">IG</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
        Total venues monitored: {filteredVenues.length} • Average response time:{" "}
        {Math.round(filteredVenues.reduce((acc, v) => acc + v.responseTime, 0) / filteredVenues.length)}ms
      </div>
    </div>
  )
}
