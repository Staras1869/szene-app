"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Terminal, Folder } from "lucide-react"

interface SystemCheck {
  name: string
  status: "success" | "error" | "warning"
  message: string
  action?: string
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

    // Check if we can access the API
    try {
      const response = await fetch("/api/events", { method: "HEAD" })
      newChecks.push({
        name: "API Routes",
        status: response.ok ? "success" : "error",
        message: response.ok ? "API endpoints accessible" : "API routes not responding",
        action: response.ok ? undefined : "Check if server is running",
      })
    } catch {
      newChecks.push({
        name: "API Routes",
        status: "error",
        message: "Cannot connect to API endpoints",
        action: "Start development server with 'npm run dev'",
      })
    }

    // Check if we can access static files
    try {
      const response = await fetch("/placeholder.svg", { method: "HEAD" })
      newChecks.push({
        name: "Static Files",
        status: response.ok ? "success" : "warning",
        message: response.ok ? "Static files accessible" : "Some static files may be missing",
      })
    } catch {
      newChecks.push({
        name: "Static Files",
        status: "warning",
        message: "Static file access check failed",
      })
    }

    // Check local storage
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      newChecks.push({
        name: "Browser Storage",
        status: "success",
        message: "Local storage working correctly",
      })
    } catch {
      newChecks.push({
        name: "Browser Storage",
        status: "error",
        message: "Local storage not available",
      })
    }

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
        return "bg-green-100 text-green-800 border-green-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          System Debug Helper
          <Button
            variant="outline"
            size="sm"
            onClick={runSystemChecks}
            disabled={isLoading}
            className="ml-auto bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {checks.map((check, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getStatusColor(check.status)}`}>
              <div className="flex items-start gap-3">
                {getStatusIcon(check.status)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm mt-1">{check.message}</div>
                  {check.action && <div className="text-xs mt-2 font-medium">Action: {check.action}</div>}
                </div>
                <Badge variant="outline" className={getStatusColor(check.status)}>
                  {check.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Folder className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-900">Directory Navigation</h3>
            </div>
            <div className="space-y-1 text-sm font-mono text-blue-800">
              <div>pwd # Check current directory</div>
              <div>ls -la # List all files</div>
              <div>cd szene-app # Navigate to project</div>
            </div>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-green-900">Development Commands</h3>
            </div>
            <div className="space-y-1 text-sm font-mono text-green-800">
              <div>npm install # Install dependencies</div>
              <div>npm run dev # Start dev server</div>
              <div>open http://localhost:3000 # Open app</div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 border rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Current Status:</h3>
          <div className="text-sm text-gray-700">
            {checks.filter((c) => c.status === "success").length} of {checks.length} checks passing
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
