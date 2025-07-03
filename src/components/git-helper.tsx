"use client"

import { useState } from "react"

interface GitHelperProps {
  repoUrl: string
}

export function GitHelper({ repoUrl }: GitHelperProps) {
  const [protocol, setProtocol] = useState<"https" | "ssh">("https")

  // Extract username and project from URL
  const urlParts = repoUrl
    .replace(/^(https:\/\/|git@)gitlab\.com[/:]/, "")
    .replace(/\.git$/, "")
    .split("/")
  const username = urlParts[0]
  const project = urlParts[1]

  const httpsUrl = `https://gitlab.com/${username}/${project}.git`
  const sshUrl = `git@gitlab.com:${username}/${project}.git`

  const cloneCommand = protocol === "https" ? `git clone ${httpsUrl}` : `git clone ${sshUrl}`

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-bold mb-4">Git Repository Setup</h2>

      <div className="mb-4">
        <label className="block mb-2">Choose protocol:</label>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded ${protocol === "https" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setProtocol("https")}
          >
            HTTPS
          </button>
          <button
            className={`px-4 py-2 rounded ${protocol === "ssh" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setProtocol("ssh")}
          >
            SSH
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Repository URL:</h3>
        <code className="block p-2 bg-gray-800 text-white rounded">{protocol === "https" ? httpsUrl : sshUrl}</code>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Clone Command:</h3>
        <code className="block p-2 bg-gray-800 text-white rounded">{cloneCommand}</code>
      </div>

      {protocol === "ssh" && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm">
            <strong>Note:</strong> SSH requires setting up SSH keys. See the SSH setup guide for instructions.
          </p>
        </div>
      )}
    </div>
  )
}
