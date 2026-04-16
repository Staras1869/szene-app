"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, RefreshCw, Calendar, MapPin, Clock, Users } from "lucide-react"

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

export function RealTimeActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    loadActivities()

    // Update activities every 10 seconds
    const interval = setInterval(loadActivities, 10000)

    return () => clearInterval(interval)
  }, [])

  const loadActivities = async () => {
    try {
      // Simulate real-time activity generation
      generateRealtimeActivities()
      setLastUpdate(new Date().toLocaleTimeString("de-DE"))
    } catch (error) {
      console.error("Failed to load activities:", error)
    }
  }

  const generateRealtimeActivities = () => {
    const now = new Date()
    const venues = [
      "Tiffany Club",
      "MS Connexion",
      "Capitol Mannheim",
      "Karlstorbahnhof",
      "Cave 54",
      "Villa Nachttanz",
      "Alte Feuerwache",
      "halle02",
    ]

    const activityTypes = [
      {
        type: "event_added" as const,
        title: "New Event Discovered",
        getDescription: (venue: string) => `Found new event at ${venue}`,
      },
      {
        type: "venue_scraped" as const,
        title: "Venue Scraped",
        getDescription: (venue: string) => `Successfully scraped ${venue} for events`,
      },
      {
        type: "system_update" as const,
        title: "System Update",
        getDescription: () => "Automation system completed hourly cycle",
      },
      {
        type: "approval_needed" as const,
        title: "Approval Required",
        getDescription: (venue: string) => `New event from ${venue} needs approval`,
      },
    ]

    // Generate 1-3 new activities
    const newActivities: ActivityItem[] = []
    const activityCount = Math.floor(Math.random() * 3) + 1

    for (let i = 0; i < activityCount; i++) {
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const timestamp = new Date(now.getTime() - Math.random() * 300000) // Last 5 minutes

      newActivities.push({
        id: `${Date.now()}-${i}`,
        type: activityType.type,
        title: activityType.title,
        description: activityType.getDescription(venue),
        timestamp: timestamp.toISOString(),
        venue,
        city:
          venue.includes("Heidelberg") || venue === "Karlstorbahnhof" || venue === "Cave 54"
            ? "Heidelberg"
            : "Mannheim",
        source: Math.random() > 0.5 ? "website" : "social_media",
        metadata: {
          automated: true,
          confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        },
      })
    }

    // Add new activities and keep only last 20
    setActivities((prev) => [...newActivities, ...prev].slice(0, 20))
  }

  const refreshActivities = async () => {
    setLoading(true)
    await loadActivities()
    setLoading(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "event_added":
        return <Calendar className="w-4 h-4 text-green-500" />
      case "venue_scraped":
        return <MapPin className="w-4 h-4 text-blue-500" />
      case "system_update":
        return <Activity className="w-4 h-4 text-purple-500" />
      case "approval_needed":
        return <Users className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "event_added":
        return "border-l-green-500"
      case "venue_scraped":
        return "border-l-blue-500"
      case "system_update":
        return "border-l-purple-500"
      case "approval_needed":
        return "border-l-orange-500"
      default:
        return "border-l-gray-500"
    }
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
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Real-time Activity</h3>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Last update: {lastUpdate}</span>
          <Button variant="ghost" size="sm" onClick={refreshActivities} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No recent activity
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`p-3 border-l-4 bg-gray-50 rounded-r-lg ${getActivityColor(activity.type)}`}
            >
              <div className="flex items-start gap-3">
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <span className="text-xs text-gray-500">{getTimeAgo(activity.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {activity.city && (
                      <Badge variant="secondary" className="text-xs">
                        {activity.city}
                      </Badge>
                    )}
                    {activity.source && (
                      <Badge variant="outline" className="text-xs">
                        {activity.source}
                      </Badge>
                    )}
                    {activity.metadata?.confidence && (
                      <Badge variant="outline" className="text-xs">
                        {activity.metadata.confidence}% confidence
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
