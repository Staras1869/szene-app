"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Play, Pause, RefreshCw, AlertCircle, Clock, Zap } from "lucide-react"

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

export function AutomationStatus() {
  const [status, setStatus] = useState<AutomationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [nextUpdateCountdown, setNextUpdateCountdown] = useState<string>("")

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
        setNextUpdateCountdown("Updating now...")
      }
    }

    updateCountdown()
    const countdownInterval = setInterval(updateCountdown, 1000)

    return () => clearInterval(countdownInterval)
  }, [status]) // Updated to use the entire status object

  const fetchStatus = async () => {
    try {
      setError(null)
      console.log("Fetching automation status...")
      const response = await fetch("/api/automation")

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("Received automation status:", data)
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch automation status:", error)
      setError("Failed to load automation status")
      // Set fallback status
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
    setActionMessage(status?.isRunning ? "Stopping hourly automation..." : "Starting hourly automation...")

    try {
      const action = status?.isRunning ? "stop" : "start"
      console.log(`Sending ${action} request to automation API...`)

      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log("Automation toggle result:", result)

      // Update with the actual response data
      setStatus({
        isRunning: result.isRunning,
        stats: result.stats,
      })

      setActionMessage(
        status?.isRunning ? "Hourly automation stopped" : "Hourly automation started - updates every hour!",
      )

      // Clear message after 3 seconds
      setTimeout(() => setActionMessage(null), 3000)
    } catch (error) {
      console.error("Failed to toggle automation:", error)
      setError(`Failed to ${status?.isRunning ? "stop" : "start"} automation. Please try again.`)
    }
    setLoading(false)
  }

  const handleManualScrape = async () => {
    setLoading(true)
    setError(null)
    setActionMessage("Running comprehensive scraping cycle...")

    try {
      console.log("Sending run-cycle request to automation API...")
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run-cycle" }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log("Manual scrape result:", result)

      // Update with the actual response data
      setStatus({
        isRunning: result.isRunning,
        stats: result.stats,
      })

      setActionMessage("Comprehensive scraping completed successfully!")

      // Clear message after 3 seconds
      setTimeout(() => setActionMessage(null), 3000)
    } catch (error) {
      console.error("Failed to run manual scrape:", error)
      setError("Failed to run scraping cycle. Please try again.")
    }
    setLoading(false)
  }

  const handleForceUpdate = async () => {
    setLoading(true)
    setError(null)
    setActionMessage("Force updating all venues...")

    try {
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "force-update" }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const result = await response.json()
      setActionMessage("Force update completed!")
      setTimeout(() => setActionMessage(null), 3000)
      fetchStatus() // Refresh status
    } catch (error) {
      console.error("Failed to force update:", error)
      setError("Failed to force update. Please try again.")
    }
    setLoading(false)
  }

  // Don't render on server to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 p-4 bg-gray-50 rounded-lg">
        <Bot className="w-4 h-4 animate-pulse" />
        Loading automation status...
      </div>
    )
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">Hourly Event Automation</span>
          </div>
          <Badge variant={status?.isRunning ? "default" : "secondary"} className="text-sm">
            {status?.isRunning ? "🟢 Active" : "🔴 Stopped"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            {status?.stats?.updateFrequency || "Every 1 hour"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleToggleAutomation}
            disabled={loading}
            variant={status?.isRunning ? "destructive" : "default"}
            size="sm"
          >
            {status?.isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {status?.isRunning ? "Stop" : "Start"}
          </Button>
          <Button onClick={handleManualScrape} disabled={loading} variant="outline" size="sm">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Run Now
          </Button>
          <Button onClick={handleForceUpdate} disabled={loading} variant="outline" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Force Update
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      {status?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-blue-600">{status.stats.totalEvents}</div>
            <div className="text-sm text-gray-600">Total Events</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">{status.stats.pendingApproval}</div>
            <div className="text-sm text-gray-600">Pending Approval</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">{status.stats.approvedEvents}</div>
            <div className="text-sm text-gray-600">Approved Events</div>
          </div>
          <div className="bg-white p-3 rounded-lg border">
            <div className="text-2xl font-bold text-purple-600">{status.stats.venuesMonitored}</div>
            <div className="text-sm text-gray-600">Venues Monitored</div>
          </div>
        </div>
      )}

      {/* Next Update Countdown */}
      {status?.isRunning && nextUpdateCountdown && (
        <div className="flex items-center gap-2 text-sm bg-white p-3 rounded-lg border">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Next update in:</span>
          <Badge variant="outline" className="font-mono">
            {nextUpdateCountdown}
          </Badge>
        </div>
      )}

      {/* Event Sources */}
      {status?.stats?.eventsBySource && Object.keys(status.stats.eventsBySource).length > 0 && (
        <div className="bg-white p-3 rounded-lg border">
          <div className="text-sm font-medium mb-2">Events by Source:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(status.stats.eventsBySource).map(([source, count]) => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source}: {count}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Action Messages */}
      {actionMessage && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {actionMessage}
        </div>
      )}

      {/* Error Messages */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          <AlertCircle className="w-4 h-4" />
          {error}
          <Button onClick={fetchStatus} variant="ghost" size="sm" className="ml-auto">
            Retry
          </Button>
        </div>
      )}

      {/* System Status */}
      <div className="text-xs text-gray-500 text-center">
        System Status: {status?.stats?.systemStatus || "Unknown"} • Last Update:{" "}
        {status?.stats?.lastUpdate ? new Date(status.stats.lastUpdate).toLocaleString("de-DE") : "Never"}
      </div>
    </div>
  )
}
