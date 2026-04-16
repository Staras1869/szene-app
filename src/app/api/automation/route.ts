import { type NextRequest, NextResponse } from "next/server"
import { ComprehensiveAutomation } from "@/lib/comprehensive-automation"

// Create a singleton instance of the comprehensive automation
let comprehensiveAutomation: ComprehensiveAutomation | null = null

function getComprehensiveAutomation() {
  if (!comprehensiveAutomation) {
    comprehensiveAutomation = new ComprehensiveAutomation({
      openaiApiKey: process.env.OPENAI_API_KEY || "",
      facebookAccessToken: process.env.FACEBOOK_ACCESS_TOKEN || "demo_mode",
      instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "demo_mode",
    })
    console.log("🚀 Initialized HOURLY comprehensive automation system")
  }
  return comprehensiveAutomation
}

export async function POST(request: NextRequest) {
  try {
    const { action, venue } = await request.json()
    console.log("HOURLY automation API called with action:", action)

    const automation = getComprehensiveAutomation()

    switch (action) {
      case "start":
        await automation.startComprehensiveAutomation()
        return NextResponse.json({
          message: "HOURLY comprehensive automation started successfully",
          isRunning: true,
          stats: await automation.getComprehensiveStats(),
        })

      case "stop":
        automation.stopAutomation()
        return NextResponse.json({
          message: "Hourly automation stopped",
          isRunning: false,
          stats: await automation.getComprehensiveStats(),
        })

      case "run-cycle":
        await automation.runComprehensiveScrape()
        return NextResponse.json({
          message: "Comprehensive scraping cycle completed",
          isRunning: automation.getStatus().isRunning,
          stats: await automation.getComprehensiveStats(),
        })

      case "force-update":
        await automation.forceUpdateAllVenues()
        return NextResponse.json({
          message: "Force update of all venues completed",
          isRunning: automation.getStatus().isRunning,
          stats: await automation.getComprehensiveStats(),
        })

      case "social-monitoring":
        await automation.runSocialMediaMonitoring()
        return NextResponse.json({
          message: "Social media monitoring completed",
          isRunning: automation.getStatus().isRunning,
          stats: await automation.getComprehensiveStats(),
        })

      case "search-venue":
        if (!venue) {
          return NextResponse.json({ error: "Venue name required" }, { status: 400 })
        }
        const events = await automation.searchSpecificVenue(venue)
        return NextResponse.json({
          message: `Found ${events.length} events for ${venue}`,
          events,
          stats: await automation.getComprehensiveStats(),
        })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("HOURLY automation API error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const automation = getComprehensiveAutomation()
    const stats = await automation.getComprehensiveStats()

    return NextResponse.json({
      isRunning: automation.getStatus().isRunning,
      stats,
      timestamp: new Date().toISOString(),
      system: "hourly_comprehensive",
      features: [
        "HOURLY website scraping",
        "30-min social media monitoring",
        "Facebook integration (demo mode)",
        "Instagram monitoring (demo mode)",
        "AI content enhancement",
        "Real-time updates",
        "15+ venue monitoring",
      ],
    })
  } catch (error) {
    console.error("HOURLY automation GET error:", error)
    return NextResponse.json(
      {
        error: "Failed to get automation status",
        details: error instanceof Error ? error.message : "Unknown error",
        isRunning: false,
        stats: {
          totalEvents: 0,
          pendingApproval: 0,
          approvedEvents: 0,
          eventsBySource: {},
          eventsByVenue: {},
          eventsByCity: {},
          lastUpdate: new Date().toISOString(),
          venuesMonitored: 0,
          systemStatus: "Offline",
          updateFrequency: "Every 1 hour",
          nextUpdate: new Date().toISOString(),
        },
      },
      { status: 200 },
    )
  }
}
