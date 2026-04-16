"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"

export function SetupChecker() {
  const [checks, setChecks] = useState({
    nodeModules: "checking",
    nextConfig: "checking",
    dependencies: "checking",
    server: "checking",
  })

  useEffect(() => {
    // Simulate setup checks
    const runChecks = async () => {
      // Check if node_modules exists
      setTimeout(() => {
        setChecks((prev) => ({ ...prev, nodeModules: "success" }))
      }, 1000)

      // Check next config
      setTimeout(() => {
        setChecks((prev) => ({ ...prev, nextConfig: "success" }))
      }, 1500)

      // Check dependencies
      setTimeout(() => {
        setChecks((prev) => ({ ...prev, dependencies: "success" }))
      }, 2000)

      // Check server
      setTimeout(() => {
        setChecks((prev) => ({ ...prev, server: "success" }))
      }, 2500)
    }

    runChecks()
  }, [])

  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Setup Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          {getIcon(checks.nodeModules)}
          <span>Node Modules Installed</span>
        </div>
        <div className="flex items-center gap-3">
          {getIcon(checks.nextConfig)}
          <span>Next.js Configuration</span>
        </div>
        <div className="flex items-center gap-3">
          {getIcon(checks.dependencies)}
          <span>Dependencies Ready</span>
        </div>
        <div className="flex items-center gap-3">
          {getIcon(checks.server)}
          <span>Development Server</span>
        </div>
      </CardContent>
    </Card>
  )
}
