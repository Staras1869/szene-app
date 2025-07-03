"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Server, Smartphone, Globe } from "lucide-react"

export function DevelopmentHelper() {
  const [isLocal, setIsLocal] = useState(false)
  const [networkIP, setNetworkIP] = useState<string>("")

  useEffect(() => {
    setIsLocal(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

    // Try to get network IP for mobile testing
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      if (hostname.startsWith("192.168.") || hostname.startsWith("10.") || hostname.startsWith("172.")) {
        setNetworkIP(hostname)
      }
    }
  }, [])

  if (!isLocal) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2 text-green-800">
            <Code className="w-4 h-4" />
            Development Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Local server running</span>
            <Badge variant="outline" className="text-xs border-green-300 text-green-700">
              Active
            </Badge>
          </div>

          <div className="text-xs text-green-600 space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3" />
              <span>Desktop: localhost:3000</span>
            </div>
            {networkIP && (
              <div className="flex items-center gap-2">
                <Smartphone className="w-3 h-3" />
                <span>Mobile: {networkIP}:3000</span>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-green-200">
            <p className="text-xs text-green-600 mb-2">Quick Actions:</p>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-6 px-2 border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                onClick={() => window.location.reload()}
              >
                Reload
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-6 px-2 border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                onClick={() => console.clear()}
              >
                Clear Console
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
