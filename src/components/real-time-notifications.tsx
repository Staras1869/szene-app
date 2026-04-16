"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, X, CheckCircle, AlertCircle, Info, Zap } from "lucide-react"

interface Notification {
  id: number
  message: string
  timestamp: string
  type: "new_events" | "system" | "error" | "success"
  source?: string
  count?: number
  read?: boolean
}

export function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showPanel, setShowPanel] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load notifications from localStorage
    loadNotifications()

    // Check for new notifications every 5 seconds
    const interval = setInterval(loadNotifications, 5000)

    return () => clearInterval(interval)
  }, [])

  const loadNotifications = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("szene_notifications")
      if (stored) {
        const notifs = JSON.parse(stored)
        setNotifications(notifs)
        setUnreadCount(notifs.filter((n: Notification) => !n.read).length)
      }
    }
  }

  const markAsRead = (id: number) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    setNotifications(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("szene_notifications", JSON.stringify(updated))
    }
    setUnreadCount(updated.filter((n) => !n.read).length)
  }

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem("szene_notifications", JSON.stringify(updated))
    }
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    if (typeof window !== "undefined") {
      localStorage.removeItem("szene_notifications")
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_events":
        return <Zap className="w-4 h-4 text-blue-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "new_events":
        return "border-l-blue-500 bg-blue-50"
      case "success":
        return "border-l-green-500 bg-green-50"
      case "error":
        return "border-l-red-500 bg-red-50"
      default:
        return "border-l-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button variant="ghost" size="sm" onClick={() => setShowPanel(!showPanel)} className="relative">
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold">Real-time Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearNotifications}>
                Clear all
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowPanel(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-l-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${getNotificationColor(
                    notification.type,
                  )} ${!notification.read ? "bg-opacity-100" : "bg-opacity-50"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? "font-semibold" : ""}`}>{notification.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString("de-DE")}
                        </p>
                        {notification.source && (
                          <Badge variant="outline" className="text-xs">
                            {notification.source}
                          </Badge>
                        )}
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">
                            New
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
      )}
    </div>
  )
}
