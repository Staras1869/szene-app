import { NextResponse } from "next/server"
import { EnhancedSocialDiscovery } from "@/lib/enhanced-social-discovery"

export async function POST() {
  try {
    const discovery = new EnhancedSocialDiscovery()
    const results = await discovery.discoverEvents()

    return NextResponse.json({
      success: true,
      data: results,
      message: `Discovered ${results.events.length} events and ${results.venues.length} venues`,
    })
  } catch (error) {
    console.error("Enhanced discovery error:", error)
    return NextResponse.json({ success: false, error: "Enhanced discovery failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const discovery = new EnhancedSocialDiscovery()
    const results = await discovery.discoverEvents()

    return NextResponse.json({
      summary: results.stats,
      topEvents: results.events.slice(0, 10),
      topVenues: results.venues.slice(0, 5),
      breakdown: {
        bySource: {
          instagram: results.events.filter((e) => e.source === "instagram").length,
          facebook: results.events.filter((e) => e.source === "facebook").length,
        },
        byCity: {
          mannheim: results.events.filter((e) => e.city === "Mannheim").length,
          heidelberg: results.events.filter((e) => e.city === "Heidelberg").length,
        },
        avgConfidence: results.stats.avgConfidence,
      },
    })
  } catch (error) {
    console.error("Enhanced discovery error:", error)
    return NextResponse.json({ success: false, error: "Enhanced discovery failed" }, { status: 500 })
  }
}
