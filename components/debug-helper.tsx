"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface SystemCheck {
  name: string
  status: "success" | "error" | "warning"
  message: string
}

export function DebugHelper() {
  const [checks, setChecks] = useState<SystemCheck[]>([])

  useEffect(() => {
    const runChecks = async () => {
      const systemChecks: SystemCheck[] = []

      // Check if we're in development mode
      systemChecks.push({
        name: "Development Mode",
        status: process.env.NODE_ENV === "development" ? "success" : "warning",
        message: process.env.NODE_ENV === "development" ? "Running in dev mode" : "Not in development mode",
      })

      // Check if API routes are accessible
      try {
        const response = await fetch("/api/events")
        systemChecks.push({
          name: "API Routes",
          status: response.ok ? "success" : "error",
          message: response.ok ? "API routes accessible" : "API routes not responding",
        })
      } catch (error) {
        systemChecks.push({
          name: "API Routes",
          status: "error",
          message: "Failed to connect to API",
        })
      }

      // Check local storage
      try {
        localStorage.setItem("test", "test")
        localStorage.removeItem("test")
        systemChecks.push({
          name: "Local Storage",
          status: "success",
          message: "Local storage working",
        })
      } catch (error) {
        systemChecks.push({
          name: "Local Storage",
          status: "error",
          message: "Local storage not available",
        })
      }

      setChecks(systemChecks)
    }

    runChecks()
  }, [])

  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          System Debug Helper
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                {getIcon(check.status)}
                <span className="font-medium">{check.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{check.message}</span>
                <Badge className={getStatusColor(check.status)}>{check.status}</Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>
              Run <code className="bg-blue-100 px-1 rounded">npm install</code> in terminal
            </li>
            <li>
              Run <code className="bg-blue-100 px-1 rounded">npm run dev</code> to start server
            </li>
            <li>
              Open <code className="bg-blue-100 px-1 rounded">http://localhost:3000</code> in browser
            </li>
            <li>Check that all system checks show green status</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
