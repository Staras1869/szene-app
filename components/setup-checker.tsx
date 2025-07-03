"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Terminal, Globe } from "lucide-react"

export function SetupChecker() {
  const [checks, setChecks] = useState({
    nodeInstalled: false,
    dependenciesInstalled: false,
    serverRunning: false,
    browserAccess: false,
  })

  useEffect(() => {
    // Check if we're running in development
    const isDev = process.env.NODE_ENV === "development"
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")

    setChecks({
      nodeInstalled: true, // If this component loads, Node.js is working
      dependenciesInstalled: true, // If this component loads, dependencies are installed
      serverRunning: isDev && isLocalhost,
      browserAccess: typeof window !== "undefined",
    })
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="ml-2">
        {status ? "✓ Ready" : "✗ Needs Setup"}
      </Badge>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto m-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          Development Environment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(checks.nodeInstalled)}
            <span className="font-medium">Node.js Installed</span>
          </div>
          {getStatusBadge(checks.nodeInstalled)}
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(checks.dependenciesInstalled)}
            <span className="font-medium">Dependencies Installed</span>
          </div>
          {getStatusBadge(checks.dependenciesInstalled)}
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(checks.serverRunning)}
            <span className="font-medium">Development Server</span>
          </div>
          {getStatusBadge(checks.serverRunning)}
        </div>

        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            {getStatusIcon(checks.browserAccess)}
            <span className="font-medium">Browser Access</span>
          </div>
          {getStatusBadge(checks.browserAccess)}
        </div>

        {checks.serverRunning && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Your App is Running!</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <div>
                🖥️ Desktop: <strong>http://localhost:3000</strong>
              </div>
              <div>
                📱 Mobile: <strong>http://[your-ip]:3000</strong>
              </div>
            </div>
          </div>
        )}

        {!checks.serverRunning && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Ready to Start!</span>
            </div>
            <div className="text-sm text-yellow-700">
              <p className="mb-2">Run these commands in your terminal:</p>
              <code className="block p-2 bg-yellow-100 rounded font-mono text-xs">
                npm install
                <br />
                npm run dev
              </code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
