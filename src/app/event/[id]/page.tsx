"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, MapPin, Clock, Euro, Calendar, Users, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getBestImage } from "@/lib/image-utils"

export default function EventDetailPage() {
  const { t } = useLanguage()
  const params = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchEventDetails = useCallback(async () => {
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
  }, [params.id])

  useEffect(() => {
    fetchEventDetails()
  }, [fetchEventDetails])

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : event?.sourceUrl || ""
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: event.title, text: event.description, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        alert(t("linkCopied") || "Link copied to clipboard")
      } else {
        // fallback
        window.prompt(t("copyLinkPrompt") || "Copy this link:", url)
      }
    } catch (err) {
      console.error("Share failed:", err)
    }
  }

  const [showInstaGate, setShowInstaGate] = useState(false)

  const openSource = () => {
    if (!event?.sourceUrl) return
    const url: string = event.sourceUrl
    if (url.includes("instagram.com")) {
      const seen = typeof window !== 'undefined' ? localStorage.getItem(`insta_followed_${url}`) : null
      if (seen === "1") {
        window.open(url, "_blank")
        return
      }
      setShowInstaGate(true)
      return
    }
    window.open(url, "_blank")
  }

  const confirmFollowAndOpen = () => {
    if (!event?.sourceUrl) return
    localStorage.setItem(`insta_followed_${event.sourceUrl}`, "1")
    window.open(event.sourceUrl, "_blank")
    setShowInstaGate(false)
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
          <div className="aspect-[16/9] overflow-hidden relative">
            <img
              src={getBestImage(event)}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            {event.logoUrl && (
              <div className="absolute top-4 left-4 z-10">
                <img src={event.logoUrl} alt="logo" className="h-12 w-12 rounded-full object-contain bg-white/80 p-1" />
              </div>
            )}
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
                <Button size="lg" className="flex-1" onClick={openSource}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t("getTickets")}
                </Button>
              )}

              <Button variant="outline" size="lg" className="flex-1" onClick={handleShare}>
                <Users className="w-4 h-4 mr-2" />
                {t("shareEvent")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {showInstaGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowInstaGate(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-sm mx-4 w-full shadow-lg">
            <div className="flex items-center gap-4">
              {event.logoUrl && <img src={event.logoUrl} alt="logo" className="h-12 w-12 rounded object-contain" />}
              <div>
                <h3 className="text-lg font-semibold">Follow on Instagram</h3>
                <p className="text-sm text-gray-600">Please follow the host on Instagram to view the original post.</p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowInstaGate(false)}>
                Cancel
              </Button>
              <Button onClick={confirmFollowAndOpen}>I followed — open Instagram</Button>
            </div>
          </div>
        </div>
      )}
    </div >
  )
}
