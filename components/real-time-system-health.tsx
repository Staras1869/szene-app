"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Wifi, Database, Zap, AlertTriangle, CheckCircle } from "lucide-react"

interface SystemHealth {
  overall: "healthy" | "warning" | "critical"
  uptime: string
  lastScrape: string
  eventsProcessed: number
  venuesOnline: number
  totalVenues: number
  apiResponseTime: number
  errorRate: number
  memoryUsage: number
  activeConnections: number
}

export function RealTimeSystemHealth() {
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    updateHealth()

    // Update health every 15 seconds
    const interval = setInterval(updateHealth, 15000)

    return () => clearInterval(interval)
  }, [])

  const updateHealth = () => {
    // Simulate real system health data
    const now = new Date()
    const uptime = Math.floor(Math.random() * 86400) + 3600 // 1-24 hours
    const venuesOnline = Math.floor(Math.random() * 3) + 13 // 13-15 venues
    const errorRate = Math.random() * 5 // 0-5% error rate

    const newHealth: SystemHealth = {
      overall: errorRate > 3 ? "warning" : venuesOnline < 14 ? "warning" : "healthy",
      uptime: formatUptime(uptime),
      lastScrape: new Date(now.getTime() - Math.random() * 300000).toISOString(), // Last 5 minutes
      eventsProcessed: Math.floor(Math.random() * 50) + 150, // 150-200 events
      venuesOnline,
      totalVenues: 15,
      apiResponseTime: Math.floor(Math.random() * 200) + 50, // 50-250ms
      errorRate: Math.round(errorRate * 10) / 10,
      memoryUsage: Math.floor(Math.random() * 30) + 45, // 45-75%
      activeConnections: Math.floor(Math.random() * 20) + 5, // 5-25 connections
    }

    setHealth(newHealth)
  }

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getHealthColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50 border-green-200"
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "critical":
        return "text-red-600 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getHealthIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-600" />
    }
  }

  if (!mounted || !health) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-lg border p-4 ${getHealthColor(health.overall)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getHealthIcon(health.overall)}
          <h3 className="font-semibold">System Health</h3>
          <Badge variant={health.overall === "healthy" ? "default" : "destructive"}>
            {health.overall.toUpperCase()}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs">Live</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Uptime</span>
            <span className="text-sm">{health.uptime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Events Processed</span>
            <span className="text-sm">{health.eventsProcessed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API Response</span>
            <span className="text-sm">{health.apiResponseTime}ms</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Venues Online</span>
            <span className="text-sm">
              {health.venuesOnline}/{health.totalVenues}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Error Rate</span>
            <span className="text-sm">{health.errorRate}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Connections</span>
            <span className="text-sm">{health.activeConnections}</span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Venues Online</span>
            <span className="text-xs">{Math.round((health.venuesOnline / health.totalVenues) * 100)}%</span>
          </div>
          <Progress value={(health.venuesOnline / health.totalVenues) * 100} className="h-2" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">Memory Usage</span>
            <span className="text-xs">{health.memoryUsage}%</span>
          </div>
          <Progress value={health.memoryUsage} className="h-2" />
        </div>
      </div>

      {/* Status Indicators */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-current border-opacity-20">
        <div className="flex items-center gap-1">
          <Wifi className="w-3 h-3" />
          <span className="text-xs">Connected</span>
        </div>
        <div className="flex items-center gap-1">
          <Database className="w-3 h-3" />
          <span className="text-xs">DB Active</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span className="text-xs">Auto-Scraping</span>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-xs opacity-75 mt-2">
        Last scrape: {new Date(health.lastScrape).toLocaleTimeString("de-DE")}
      </div>
    </div>
  )
}
