"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Euro, Calendar, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

export default function EventDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEventDetails()
  }, [params.id])

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`/api/events/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setEvent(data)
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("eventNotFound")}</h1>
          <Link href="/">
            <Button>{t("backToHome")}</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("backToEvents")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Event Details */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          {/* Event Image */}
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={event.imageUrl || "/placeholder.svg?height=400&width=800&query=event"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Info */}
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <p className="text-xl text-gray-600">{event.venue}</p>
              </div>
              <Badge variant="secondary" className="text-sm">
                {event.category}
              </Badge>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">{event.description}</p>

            {/* Event Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{t("date")}</p>
                    <p className="text-gray-600">{event.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{t("time")}</p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{t("location")}</p>
                    <p className="text-gray-600">{event.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Euro className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{t("price")}</p>
                    <p className="text-gray-600">{event.price}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {event.sourceUrl && (
                <Button size="lg" className="flex-1" onClick={() => window.open(event.sourceUrl, "_blank")}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("getTickets")}
                </Button>
              )}

              <Button variant="outline" size="lg" className="flex-1">
                <Users className="w-4 h-4 mr-2" />
                {t("shareEvent")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
