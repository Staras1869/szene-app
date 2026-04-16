import { NextResponse } from "next/server"
import { SocialMediaDiscovery } from "@/lib/social-media-discovery"

export async function POST() {
  try {
    const discovery = new SocialMediaDiscovery()
    const results = await discovery.runComprehensiveDiscovery()

    return NextResponse.json({
      success: true,
      data: results,
      message: `Found ${results.events.length} events and ${results.newVenues.length} new venues`,
    })
  } catch (error) {
    console.error("Discovery error:", error)
    return NextResponse.json({ success: false, error: "Discovery failed" }, { status: 500 })
  }
}

export async function GET() {
  // Quick discovery for testing
  const discovery = new SocialMediaDiscovery()
  const results = await discovery.runComprehensiveDiscovery()

  return NextResponse.json({
    summary: results.stats,
    sampleEvents: results.events.slice(0, 5),
    sampleVenues: results.newVenues.slice(0, 3),
  })
}
