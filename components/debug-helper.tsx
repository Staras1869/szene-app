"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertTriangle, Terminal, RefreshCw } from "lucide-react"

export function DebugHelper() {
  const [systemInfo, setSystemInfo] = useState({
    nodeVersion: "Checking...",
    npmVersion: "Checking...",
    currentPath: "Checking...",
    packageJsonExists: false,
    nodeModulesExists: false,
  })

  const [isChecking, setIsChecking] = useState(false)

  const runDiagnostics = async () => {
    setIsChecking(true)

    // Simulate system checks
    setTimeout(() => {
      setSystemInfo({
        nodeVersion: "v18.17.0",
        npmVersion: "9.6.7",
        currentPath: "/Users/gcentertainment/Desktop/szene-app",
        packageJsonExists: true,
        nodeModulesExists: false,
      })
      setIsChecking(false)
    }, 2000)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
  }

  return (
    <Card className="max-w-2xl mx-auto m-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="w-6 h-6" />
          System Diagnostics
          <Button
            variant="outline"
            size="sm"
            onClick={runDiagnostics}
            disabled={isChecking}
            className="ml-auto bg-transparent"
          >
            {isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-600">Node.js Version</div>
            <div className="font-mono text-lg">{systemInfo.nodeVersion}</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="text-sm text-gray-600">NPM Version</div>
            <div className="font-mono text-lg">{systemInfo.npmVersion}</div>
          </div>
        </div>

        <div className="p-3 border rounded-lg">
          <div className="text-sm text-gray-600">Current Directory</div>
          <div className="font-mono text-sm break-all">{systemInfo.currentPath}</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(systemInfo.packageJsonExists)}
              <span className="font-medium">package.json Found</span>
            </div>
            <Badge variant={systemInfo.packageJsonExists ? "default" : "destructive"}>
              {systemInfo.packageJsonExists ? "✓ Found" : "✗ Missing"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(systemInfo.nodeModulesExists)}
              <span className="font-medium">node_modules Installed</span>
            </div>
            <Badge variant={systemInfo.nodeModulesExists ? "default" : "destructive"}>
              {systemInfo.nodeModulesExists ? "✓ Installed" : "✗ Run npm install"}
            </Badge>
          </div>
        </div>

        {!systemInfo.packageJsonExists && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Action Required</span>
            </div>
            <div className="text-sm text-red-700 space-y-2">
              <p>Navigate to your project directory first:</p>
              <code className="block p-2 bg-red-100 rounded font-mono text-xs">
                cd ~/Desktop/szene-app
                <br /># OR
                <br />
                cd ~/Desktop/mannheim-restaurants
              </code>
            </div>
          </div>
        )}

        {systemInfo.packageJsonExists && !systemInfo.nodeModulesExists && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Ready to Install</span>
            </div>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>Run these commands:</p>
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
