"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Play, Pause, RefreshCw, Heart, Sparkles, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface AutomationStatus {
  isRunning: boolean
  stats?: {
    totalEvents: number
    pendingApproval: number
    approvedEvents: number
    lastUpdate: string
    systemStatus: string
  }
}

export function SimpleFunAutomation() {
  const { t } = useLanguage()
  const [status, setStatus] = useState<AutomationStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const [celebrationMode, setCelebrationMode] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchStatus()
    const statusInterval = setInterval(fetchStatus, 30000)
    return () => clearInterval(statusInterval)
  }, [])

  const fetchStatus = async () => {
    try {
      const response = await fetch("/api/automation")
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to fetch automation status:", error)
      setStatus({
        isRunning: false,
        stats: {
          totalEvents: 0,
          pendingApproval: 0,
          approvedEvents: 0,
          lastUpdate: new Date().toISOString(),
          systemStatus: "Offline",
        },
      })
    }
  }

  const handleToggleAutomation = async () => {
    setLoading(true)
    setActionMessage(status?.isRunning ? "🛑 " + t("pauseHunt") + "..." : "🚀 " + t("startHunt") + "...")

    try {
      const action = status?.isRunning ? "stop" : "start"
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      setStatus({ isRunning: result.isRunning, stats: result.stats })

      if (!status?.isRunning) {
        setCelebrationMode(true)
        setActionMessage("🎉 " + t("liveHunting") + "!")
        setTimeout(() => setCelebrationMode(false), 3000)
      } else {
        setActionMessage("😴 " + t("sleeping"))
      }

      setTimeout(() => setActionMessage(null), 4000)
    } catch (error) {
      setActionMessage("😅 " + t("error"))
    }
    setLoading(false)
  }

  const handleManualScrape = async () => {
    setLoading(true)
    setActionMessage("🔍 " + t("huntNow"))

    try {
      const response = await fetch("/api/automation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run-cycle" }),
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      setStatus({ isRunning: result.isRunning, stats: result.stats })

      setCelebrationMode(true)
      setActionMessage("✨ " + t("eventsFound") + "!")
      setTimeout(() => setCelebrationMode(false), 2000)
      setTimeout(() => setActionMessage(null), 4000)
    } catch (error) {
      setActionMessage("😅 " + t("error"))
    }
    setLoading(false)
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
        <Bot className="w-6 h-6 animate-pulse text-blue-500 mr-3" />
        <span className="text-lg">{t("botWarmingUp")}</span>
      </div>
    )
  }

  return (
    <div
      className={`p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl border-2 space-y-6 transition-all duration-500 ${
        celebrationMode
          ? "border-yellow-300 shadow-2xl transform scale-105"
          : status?.isRunning
            ? "border-green-200 shadow-lg"
            : "border-gray-200 shadow-md"
      }`}
    >
      {/* Celebration confetti effect */}
      {celebrationMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="text-center space-y-6">
        {/* Bot Avatar */}
        <div className="relative mx-auto w-20 h-20">
          <div
            className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
              status?.isRunning ? "animate-bounce" : ""
            }`}
          >
            <Bot className="w-10 h-10 text-white" />
          </div>
          {status?.isRunning && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-pulse flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{t("eventDiscoveryBot")}</h3>
          <p className="text-lg text-gray-600">{t("personalPartyFinder")}</p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-3">
          <Badge
            variant={status?.isRunning ? "default" : "secondary"}
            className={`text-lg px-4 py-2 font-bold ${
              status?.isRunning
                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white animate-pulse"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {status?.isRunning ? t("liveHunting") : t("sleeping")}
          </Badge>
        </div>

        {/* Simple Stats */}
        {status?.stats && (
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">🎪 {status.stats.totalEvents}</div>
              <div className="text-sm text-gray-600">{t("eventsFound")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">✅ {status.stats.approvedEvents}</div>
              <div className="text-sm text-gray-600">{t("readyToParty")}</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleToggleAutomation}
            disabled={loading}
            size="lg"
            className={`font-bold px-8 py-3 rounded-full transition-all duration-300 ${
              status?.isRunning
                ? "bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600"
                : "bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600"
            }`}
          >
            {status?.isRunning ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                {t("pauseHunt")}
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                {t("startHunt")}
              </>
            )}
          </Button>
          <Button
            onClick={handleManualScrape}
            disabled={loading}
            variant="outline"
            size="lg"
            className="font-bold px-6 py-3 rounded-full bg-white/70 hover:bg-white border-2 border-purple-200 hover:border-purple-300"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${loading ? "animate-spin" : ""}`} />
            {t("huntNow")}
          </Button>
        </div>

        {/* Action Messages */}
        {actionMessage && (
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-2xl border border-blue-200 animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-800">{actionMessage}</span>
              <Heart className="w-4 h-4 text-pink-500 animate-bounce" />
            </div>
          </div>
        )}

        {/* Fun Footer */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full border border-white/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">{t("madeWithLove")}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
