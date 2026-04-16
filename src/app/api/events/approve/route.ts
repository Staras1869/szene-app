import { type NextRequest, NextResponse } from "next/server"
import { AutomationScheduler } from "@/lib/automation-scheduler"

let automationScheduler: AutomationScheduler | null = null

function getAutomationScheduler() {
  if (!automationScheduler) {
    automationScheduler = new AutomationScheduler(process.env.OPENAI_API_KEY)
  }
  return automationScheduler
}

export async function POST(request: NextRequest) {
  try {
    const { eventId, action } = await request.json()

    if (!eventId || !action) {
      return NextResponse.json({ error: "Missing eventId or action" }, { status: 400 })
    }

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const scheduler = getAutomationScheduler()

    if (action === "approve") {
      await scheduler.approveEvent(eventId)
    } else {
      await scheduler.rejectEvent(eventId)
    }

    return NextResponse.json({ message: `Event ${action}d successfully` })
  } catch (error) {
    console.error("Event approval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
