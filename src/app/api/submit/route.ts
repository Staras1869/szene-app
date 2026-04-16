import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Send to Slack webhook if configured
    const slackUrl = process.env.SLACK_WEBHOOK_URL
    if (slackUrl) {
      const isVenue = body.type === "venue"
      const text = isVenue
        ? `📍 *New venue submission*\n*Name:* ${body.name}\n*City:* ${body.city}\n*Type:* ${body.venueType}\n*Area:* ${body.area || "—"}\n*Address:* ${body.address || "—"}\n*Instagram:* ${body.instagram || "—"}\n*Website:* ${body.website || "—"}\n*Description:* ${body.description || "—"}`
        : `🎉 *New event submission*\n*Title:* ${body.title}\n*Venue:* ${body.venue}\n*City:* ${body.city}\n*Date:* ${body.date} ${body.time || ""}\n*Price:* ${body.price || "—"}\n*Instagram:* ${body.instagram || "—"}\n*Link:* ${body.link || "—"}\n*Description:* ${body.description || "—"}`

      await fetch(slackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).catch(() => {})
    }

    // Send email notification if configured
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      // Could add Resend/SendGrid here later
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
