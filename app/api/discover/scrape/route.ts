import { NextResponse } from "next/server"
import { SocialDiscoveryEngine } from "@/lib/social-discovery-engine"

export async function GET() {
  try {
    const engine = new SocialDiscoveryEngine()
    const results = await engine.runFullDiscovery()

    return NextResponse.json({
      success: true,
      data: results,
      message: `Discovered ${results.events.length} events and ${results.venues.length} venues from social media`,
    })
  } catch (error) {
    console.error("Social discovery error:", error)
    return NextResponse.json({ success: false, error: "Social discovery failed" }, { status: 500 })
  }
}

export async function POST() {
  // Same as GET for now, but could accept parameters for custom discovery
  return GET()
}
