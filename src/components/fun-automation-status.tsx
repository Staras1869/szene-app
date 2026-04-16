"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Play, Pause, RefreshCw, AlertCircle, Clock, Zap, Heart, Sparkles } from "lucide-react"

interface AutomationStatus {
  isRunning: boolean
  stats?: {
    totalEvents: number
    pendingApproval: number
    approvedEvents: number
    eventsBySource: Record<string, number>
    eventsByVenue: Record<string, number>
    eventsByCity: Record<string, number>
    lastUpdate: string
    venuesMonitored: number
    systemStatus: string
    updateFrequency: string
    nextUpdate: string
  }
}

export function FunAutomationStatus() {
  const [status, setStatus] = useState<AutomationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [nextUpdateCountdown, setNextUpdateCountdown] = useState<string>("")
  const [celebrationMode, setCelebrationMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchStatus()

    // Refresh status every 30 seconds
    const statusInterval = setInterval(fetchStatus, 30000)

    return () => clearInterval(statusInterval)
  }, [])

  // Countdown to next update
  useEffect(() => {
    if (!status?.stats?.nextUpdate) return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const nextUpdate = new Date(status.stats!.nextUpdate).getTime()
      const difference = nextUpdate - now

      if (difference > 0) {
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setNextUpdateCountdown(`${minutes}m ${seconds}s`)
      } else {
        setNextUpdateCountdown("🎉 Updating now!")
      }
    }

    updateCountdown()
    const countdownInterval = setInterval(updateCountdown, 1000)

    return () => clearInterval(countdownInterval)
  }, [status])

  const fetchStatus = async () => {
    try {
      setError(null)
      const response = await fetch("/api/automation")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch automation status:", error)
      setError("Oops! Something went wrong 😅")
      setStatus({
        isRunning: false,
        stats: {
          totalEvents: 0,
          pendingApproval: 0,
          approvedEvents: 0,
          eventsBySource: {},
          eventsByVenue: {},
          eventsByCity: {},
          lastUpdate: new Date().toISOString(),
          venuesMonitored: 0,
          systemStatus: "Offline",
          updateFrequency: "Every 1 hour",
          nextUpdate: new Date().toISOString(),
        },
      })
    }
  }

  const handleToggleAutomation = async () => {
    setLoading(true)
    setError(null)
    setActionMessage(
      status?.isRunning ? "🛑 Stopping the party machine..." : "🚀 Starting the event discovery engine...",
    )

    try {
      const action = status?.isRunning ? "stop" : "start"
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      setStatus({
        isRunning: result.isRunning,
        stats: result.stats,
      })

      if (!status?.isRunning) {
        setCelebrationMode(true)
        setActionMessage("🎉 Event discovery is now LIVE! Finding amazing events every hour!")
        setTimeout(() => setCelebrationMode(false), 3000)
      } else {
        setActionMessage("😴 Automation paused - no worries, we'll be back!")
      }

      setTimeout(() => setActionMessage(null), 4000)
    } catch (error) {
      console.error("Failed to toggle automation:", error)
      setError(`😵 Oops! Failed to ${status?.isRunning ? "stop" : "start"} the magic. Try again?`)
    }
    setLoading(false)
  }

  const handleManualScrape = async () => {
    setLoading(true)
    setError(null)
    setActionMessage("🔍 Hunting for fresh events right now...")

    try {
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run-cycle" }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      setStatus({
        isRunning: result.isRunning,
        stats: result.stats,
      })

      setCelebrationMode(true)
      setActionMessage("✨ Fresh events discovered! Check them out below!")
      setTimeout(() => setCelebrationMode(false), 2000)
      setTimeout(() => setActionMessage(null), 4000)
    } catch (error) {
      console.error("Failed to run manual scrape:", error)
      setError("😅 Couldn't fetch new events right now. Try again in a moment!")
    }
    setLoading(false)
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <Bot className="w-5 h-5 animate-pulse text-blue-500" />
        <span>🤖 Waking up the event discovery bot...</span>
      </div>
    )
  }

  return (
    <div
      className={`p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border-2 space-y-6 transition-all duration-500 ${
        celebrationMode
          ? "border-yellow-300 shadow-2xl transform scale-105"
          : status?.isRunning
            ? "border-green-200 shadow-lg"
            : "border-gray-200 shadow-md"
      }`}
    >
      {/* Celebration confetti effect */}
      {celebrationMode && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bot className={`w-8 h-8 text-blue-600 ${status?.isRunning ? "animate-bounce" : ""}`} />
            {status?.isRunning && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-900">🎉 Event Discovery Bot</h3>
            <p className="text-sm text-gray-600">Your personal party finder</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={status?.isRunning ? "default" : "secondary"}
              className={`text-sm font-bold ${
                status?.isRunning
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status?.isRunning ? "🟢 LIVE & HUNTING" : "😴 SLEEPING"}
            </Badge>
            <Badge variant="outline" className="text-xs bg-white/50">
              <Zap className="w-3 h-3 mr-1 text-yellow-500" />
              {status?.stats?.updateFrequency || "Every 1 hour"}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleToggleAutomation}
            disabled={loading}
            variant={status?.isRunning ? "destructive" : "default"}
            size="lg"
            className={`font-bold transition-all duration-300 ${
              status?.isRunning
                ? "bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600"
                : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            }`}
          >
            {status?.isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause Hunt
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Hunt
              </>
            )}
          </Button>
          <Button
            onClick={handleManualScrape}
            disabled={loading}
            variant="outline"
            size="lg"
            className="font-bold bg-white/70 hover:bg-white border-2 border-purple-200 hover:border-purple-300"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />🔍 Hunt Now!
          </Button>
        </div>
      </div>

      {/* Fun Stats Grid */}
      {status?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-blue-600 flex items-center gap-2">
              🎪 {status.stats.totalEvents}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Events Found</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-orange-600 flex items-center gap-2">
              ⏳ {status.stats.pendingApproval}
            </div>
            <div className="text-sm text-gray-600 font-medium">Awaiting Review</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-green-600 flex items-center gap-2">
              ✅ {status.stats.approvedEvents}
            </div>
            <div className="text-sm text-gray-600 font-medium">Ready to Party</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 hover:scale-105 transition-transform">
            <div className="text-3xl font-bold text-purple-600 flex items-center gap-2">
              🏢 {status.stats.venuesMonitored}
            </div>
            <div className="text-sm text-gray-600 font-medium">Venues Watched</div>
          </div>
        </div>
      )}

      {/* Next Update Countdown */}
      {status?.isRunning && nextUpdateCountdown && (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-orange-600 animate-pulse" />
            <div>
              <div className="font-bold text-gray-900">🕐 Next Event Hunt</div>
              <div className="text-sm text-gray-600">
                Starting in{" "}
                <span className="font-mono font-bold text-orange-600 bg-white px-2 py-1 rounded">
                  {nextUpdateCountdown}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Sources with Fun Icons */}
      {status?.stats?.eventsBySource && Object.keys(status.stats.eventsBySource).length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
          <div className="text-sm font-bold mb-3 text-gray-900">🎯 Event Sources:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(status.stats.eventsBySource).map(([source, count]) => {
              const sourceEmojis = {
                website: "🌐",
                facebook: "📘",
                instagram: "📸",
                social_media: "📱",
                unknown: "❓",
              }
              return (
                <Badge
                  key={source}
                  variant="secondary"
                  className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 hover:scale-110 transition-transform"
                >
                  {sourceEmojis[source as keyof typeof sourceEmojis] || "🎉"} {source}: {count}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Action Messages with Fun Styling */}
      {actionMessage && (
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-xl border border-blue-200 animate-pulse">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="font-medium text-blue-800">{actionMessage}</span>
            <Heart className="w-4 h-4 text-pink-500 animate-bounce" />
          </div>
        </div>
      )}

      {/* Error Messages with Friendly Styling */}
      {error && (
        <div className="bg-gradient-to-r from-red-100 to-pink-100 p-4 rounded-xl border border-red-200">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-800">{error}</span>
            <Button onClick={fetchStatus} variant="ghost" size="sm" className="ml-auto">
              🔄 Try Again
            </Button>
          </div>
        </div>
      )}

      {/* Fun System Status */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-white/50">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-700">
            🤖 {status?.stats?.systemStatus || "Unknown"} • Last Hunt:{" "}
            {status?.stats?.lastUpdate ? new Date(status.stats.lastUpdate).toLocaleString("de-DE") : "Never"} • Made
            with 💜 for party lovers
          </span>
        </div>
      </div>
    </div>
  )
}
