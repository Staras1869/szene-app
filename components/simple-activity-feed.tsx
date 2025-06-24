"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, RefreshCw, Sparkles } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ActivityItem {
  id: string
  type: "event_added" | "venue_scraped" | "system_update"
  emoji: string
  title: string
  description: string
  timestamp: string
  venue?: string
  city?: string
}

export function SimpleActivityFeed() {
  const { t } = useLanguage()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadActivities()
    const interval = setInterval(loadActivities, 15000)
    return () => clearInterval(interval)
  }, [])

  const loadActivities = async () => {
    try {
      generateSimpleActivities()
    } catch (error) {
      console.error("Failed to load activities:", error)
    }
  }

  const generateSimpleActivities = () => {
    const now = new Date()
    const venues = [
      "🎭 Tiffany Club",
      "🎵 MS Connexion",
      "🎪 Capitol Mannheim",
      "🎨 Karlstorbahnhof",
      "🕺 Cave 54",
      "💃 Villa Nachttanz",
    ]

    const funActivities = [
      {
        type: "event_added" as const,
        emoji: "🎉",
        title: t("newPartyFound"),
        getDescription: (venue: string) => `${t("eventsFound")} ${venue}`,
      },
      {
        type: "venue_scraped" as const,
        emoji: "🔍",
        title: t("venueChecked"),
        getDescription: (venue: string) => `${t("venueChecked")} ${venue}`,
      },
      {
        type: "system_update" as const,
        emoji: "⚡",
        title: t("systemActive"),
        getDescription: () => t("systemActive"),
      },
    ]

    const newActivities: ActivityItem[] = []
    const activityCount = Math.floor(Math.random() * 2) + 1

    for (let i = 0; i < activityCount; i++) {
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const activityType = funActivities[Math.floor(Math.random() * funActivities.length)]
      const timestamp = new Date(now.getTime() - Math.random() * 600000) // Last 10 minutes

      newActivities.push({
        id: `${Date.now()}-${i}`,
        type: activityType.type,
        emoji: activityType.emoji,
        title: activityType.title,
        description: activityType.getDescription(venue),
        timestamp: timestamp.toISOString(),
        venue,
        city: venue.includes("Heidelberg") ? "Heidelberg" : "Mannheim",
      })
    }

    setActivities((prev) => [...newActivities, ...prev].slice(0, 8))
  }

  const refreshActivities = async () => {
    setLoading(true)
    await loadActivities()
    setLoading(false)
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / 60000)

    if (diffInMinutes < 1) return t("justNow")
    if (diffInMinutes < 60) return `${diffInMinutes}${t("minutesAgo")}`
    return `${Math.floor(diffInMinutes / 60)}${t("hoursAgo")}`
  }

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-6 h-6 text-purple-600" />
            <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">{t("liveUpdates")}</h3>
            <p className="text-sm text-gray-600">{t("whatsHappening")}</p>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 animate-pulse">
            {t("live")}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshActivities}
          disabled={loading}
          className="hover:bg-purple-100 rounded-full"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Activity List */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">{t("botWarmingUp")}</p>
            <p className="text-sm">{t("updatesWillAppear")}</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl">{activity.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-gray-900">{activity.title}</h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {getTimeAgo(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                {activity.city && (
                  <Badge variant="secondary" className="text-xs mt-2">
                    📍 {activity.city}
                  </Badge>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
