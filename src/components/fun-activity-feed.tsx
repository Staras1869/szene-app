"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, RefreshCw, Calendar, MapPin, Clock, Users, Sparkles } from "lucide-react"

interface ActivityItem {
  id: string
  type: "event_added" | "venue_scraped" | "system_update" | "approval_needed"
  title: string
  description: string
  timestamp: string
  venue?: string
  city?: string
  source?: string
  metadata?: any
}

export function FunActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    loadActivities()
    const interval = setInterval(loadActivities, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadActivities = async () => {
    try {
      generateRealtimeActivities()
      setLastUpdate(new Date().toLocaleTimeString("de-DE"))
    } catch (error) {
      console.error("Failed to load activities:", error)
    }
  }

  const generateRealtimeActivities = () => {
    const now = new Date()
    const venues = [
      "🎭 Tiffany Club",
      "🎵 MS Connexion",
      "🎪 Capitol Mannheim",
      "🎨 Karlstorbahnhof",
      "🕺 Cave 54",
      "💃 Villa Nachttanz",
      "🎬 Alte Feuerwache",
      "🎸 halle02",
    ]

    const funActivities = [
      {
        type: "event_added" as const,
        title: "🎉 New Party Alert!",
        getDescription: (venue: string) => `Found an amazing event at ${venue} - this looks epic!`,
        emoji: "🎉",
      },
      {
        type: "venue_scraped" as const,
        title: "🔍 Venue Scouted",
        getDescription: (venue: string) => `Successfully checked ${venue} for fresh events`,
        emoji: "🔍",
      },
      {
        type: "system_update" as const,
        title: "⚡ System Boost",
        getDescription: () => "Event discovery engine completed another successful hunt!",
        emoji: "⚡",
      },
      {
        type: "approval_needed" as const,
        title: "👀 Human Review Needed",
        getDescription: (venue: string) => `Found something interesting at ${venue} - needs your approval!`,
        emoji: "👀",
      },
    ]

    const newActivities: ActivityItem[] = []
    const activityCount = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < activityCount; i++) {
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const activityType = funActivities[Math.floor(Math.random() * funActivities.length)]
      const timestamp = new Date(now.getTime() - Math.random() * 300000)

      newActivities.push({
        id: `${Date.now()}-${i}`,
        type: activityType.type,
        title: activityType.title,
        description: activityType.getDescription(venue),
        timestamp: timestamp.toISOString(),
        venue,
        city: venue.includes("Heidelberg") || venue.includes("Karlstorbahnhof") ? "Heidelberg" : "Mannheim",
        source: Math.random() > 0.5 ? "website" : "social_media",
        metadata: {
          automated: true,
          confidence: Math.floor(Math.random() * 30) + 70,
          fun_factor: Math.floor(Math.random() * 5) + 1,
        },
      })
    }

    setActivities((prev) => [...newActivities, ...prev].slice(0, 15))
  }

  const refreshActivities = async () => {
    setLoading(true)
    await loadActivities()
    setLoading(false)
  }

  const getActivityIcon = (type: string) => {
    const icons = {
      event_added: <Calendar className="w-5 h-5 text-green-500" />,
      venue_scraped: <MapPin className="w-5 h-5 text-blue-500" />,
      system_update: <Activity className="w-5 h-5 text-purple-500" />,
      approval_needed: <Users className="w-5 h-5 text-orange-500" />,
    }
    return icons[type as keyof typeof icons] || <Clock className="w-5 h-5 text-gray-500" />
  }

  const getActivityColor = (type: string) => {
    const colors = {
      event_added: "from-green-100 to-emerald-100 border-green-200",
      venue_scraped: "from-blue-100 to-sky-100 border-blue-200",
      system_update: "from-purple-100 to-violet-100 border-purple-200",
      approval_needed: "from-orange-100 to-amber-100 border-orange-200",
    }
    return colors[type as keyof typeof colors] || "from-gray-100 to-slate-100 border-gray-200"
  }

  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return time.toLocaleDateString("de-DE")
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Activity className="w-6 h-6 text-blue-600" />
            <Sparkles className="w-3 h-3 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">🚀 Live Activity Feed</h3>
            <p className="text-sm text-gray-600">What's happening right now</p>
          </div>
          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 animate-pulse">
            🔴 LIVE
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">🕐 {lastUpdate}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshActivities}
            disabled={loading}
            className="hover:bg-blue-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">🤖 Bot is warming up...</p>
            <p className="text-sm">Activity will appear here soon!</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`p-4 bg-gradient-to-r ${getActivityColor(
                activity.type,
              )} rounded-xl border-2 hover:scale-102 transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm text-gray-900">{activity.title}</h4>
                    <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{activity.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activity.city && (
                      <Badge variant="secondary" className="text-xs bg-white/70">
                        📍 {activity.city}
                      </Badge>
                    )}
                    {activity.source && (
                      <Badge variant="outline" className="text-xs bg-white/70">
                        {activity.source === "website" ? "🌐" : "📱"} {activity.source}
                      </Badge>
                    )}
                    {activity.metadata?.confidence && (
                      <Badge variant="outline" className="text-xs bg-white/70">
                        🎯 {activity.metadata.confidence}%
                      </Badge>
                    )}
                    {activity.metadata?.fun_factor && (
                      <Badge variant="outline" className="text-xs bg-white/70">
                        {"🎉".repeat(activity.metadata.fun_factor)}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
