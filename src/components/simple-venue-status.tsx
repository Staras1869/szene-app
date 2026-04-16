"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { MapPin, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface VenueStatus {
  id: string
  name: string
  city: string
  status: "online" | "offline"
  emoji: string
}

export function SimpleVenueStatus() {
  const { t } = useLanguage()
  const [venues, setVenues] = useState<VenueStatus[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    generateVenueStatuses()
    const interval = setInterval(generateVenueStatuses, 20000)
    return () => clearInterval(interval)
  }, [])

  const generateVenueStatuses = () => {
    const venueList = [
      { id: "tiffany-club", name: "Tiffany Club", city: "Mannheim", emoji: "🎭" },
      { id: "ms-connexion", name: "MS Connexion", city: "Mannheim", emoji: "🎵" },
      { id: "capitol-mannheim", name: "Capitol", city: "Mannheim", emoji: "🎪" },
      { id: "karlstorbahnhof", name: "Karlstorbahnhof", city: "Heidelberg", emoji: "🎨" },
      { id: "cave54", name: "Cave 54", city: "Heidelberg", emoji: "🕺" },
      { id: "villa-nachttanz", name: "Villa Nachttanz", city: "Heidelberg", emoji: "💃" },
    ]

    const statuses: VenueStatus[] = venueList.map((venue) => ({
      ...venue,
      status: Math.random() > 0.15 ? "online" : "offline", // 85% uptime
    }))

    setVenues(statuses)
  }

  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const onlineCount = venues.filter((v) => v.status === "online").length

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-bold text-xl text-gray-900">{t("venueStatus")}</h3>
            <p className="text-sm text-gray-600">{t("monitoringPartySpots")}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
          {onlineCount}/{venues.length} {t("online")}
        </Badge>
      </div>

      {/* Venue Grid */}
      <div className="grid grid-cols-2 gap-3">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className={`p-4 rounded-xl border-2 transition-all duration-300 ${
              venue.status === "online" ? "bg-green-50 border-green-200 hover:shadow-md" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">{venue.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">{venue.name}</h4>
                  {venue.status === "online" ? (
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{venue.city}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      venue.status === "online"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    {venue.status === "online" ? t("online") : t("offline")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
