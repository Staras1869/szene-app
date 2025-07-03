"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"

interface SystemCheck {
  name: string
  status: "success" | "error" | "warning"
  message: string
}

export function DebugHelper() {
  const [checks, setChecks] = useState<SystemCheck[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runSystemChecks = async () => {
    setIsLoading(true)
    const newChecks: SystemCheck[] = []

    // Check if we're in development mode
    newChecks.push({
      name: "Development Mode",
      status: process.env.NODE_ENV === "development" ? "success" : "warning",
      message: process.env.NODE_ENV === "development" ? "Running in development mode" : "Not in development mode",
    })

    // Check if package.json exists (simulated)
    try {
      const response = await fetch("/api/health", { method: "HEAD" })
      newChecks.push({
        name: "API Connection",
        status: response.ok ? "success" : "error",
        message: response.ok ? "API endpoints accessible" : "API connection failed",
      })
    } catch {
      newChecks.push({
        name: "API Connection",
        status: "error",
        message: "Cannot connect to API",
      })
    }

    // Check current directory (client-side approximation)
    newChecks.push({
      name: "Project Structure",
      status: window.location.pathname === "/" ? "success" : "warning",
      message:
        window.location.pathname === "/" ? "App is running from root" : "Check if you're in the correct directory",
    })

    setChecks(newChecks)
    setIsLoading(false)
  }

  useEffect(() => {
    runSystemChecks()
  }, [])

  const getStatusIcon = (status: SystemCheck["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: SystemCheck["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          System Debug Helper
          <Button variant="outline" size="sm" onClick={runSystemChecks} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(check.status)}
                <div>
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-gray-600">{check.message}</div>
                </div>
              </div>
              <Badge className={getStatusColor(check.status)}>{check.status}</Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Quick Fix Commands:</h3>
          <div className="space-y-1 text-sm font-mono text-blue-800">
            <div>pwd # Check current directory</div>
            <div>ls -la # List files</div>
            <div>cd szene-app # Navigate to project</div>
            <div>npm install # Install dependencies</div>
            <div>npm run dev # Start development server</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
