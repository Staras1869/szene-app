"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, AlertCircle, Terminal, Folder, Play } from "lucide-react"

export function DevelopmentHelper() {
  const [nodeVersion, setNodeVersion] = useState<string | null>(null)
  const [projectPath, setProjectPath] = useState<string>("")
  const [isServerRunning, setIsServerRunning] = useState(false)

  useEffect(() => {
    // Check if we're in development mode
    if (typeof window !== "undefined") {
      setProjectPath(window.location.origin)
      setIsServerRunning(window.location.hostname === "localhost")
    }
  }, [])

  const steps = [
    {
      id: 1,
      title: "Clone Repository",
      description: "Download your code from GitHub",
      status: projectPath ? "complete" : "pending",
      command: "git clone https://github.com/Staras1869/szene-app.git",
    },
    {
      id: 2,
      title: "Install Dependencies",
      description: "Install all required packages",
      status: "pending",
      command: "npm install",
    },
    {
      id: 3,
      title: "Start Development Server",
      description: "Run your app locally",
      status: isServerRunning ? "complete" : "pending",
      command: "npm run dev",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Terminal className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold">Development Setup Helper</h2>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
            <div className="flex-grow">
              <h3 className="font-semibold text-lg">{step.title}</h3>
              <p className="text-gray-600 mb-2">{step.description}</p>
              <code className="block p-2 bg-gray-100 rounded text-sm font-mono">{step.command}</code>
            </div>
          </div>
        ))}
      </div>

      {isServerRunning && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-green-800">Development server is running!</span>
          </div>
          <p className="text-green-700 mt-1">
            Your app is available at: <strong>{projectPath}</strong>
          </p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Folder className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-blue-800">Recommended Project Structure:</span>
        </div>
        <code className="block text-sm text-blue-700">~/Documents/Projects/szene-app/</code>
      </div>
    </div>
  )
}
