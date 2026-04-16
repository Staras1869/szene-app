import { type NextRequest, NextResponse } from "next/server"
import webPush from "web-push"

const PUBLIC_KEY  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY  ?? ""
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY ?? ""
const VAPID_EMAIL = process.env.VAPID_EMAIL ?? "mailto:hello@szene.app"

if (PUBLIC_KEY && PRIVATE_KEY) {
  webPush.setVapidDetails(VAPID_EMAIL, PUBLIC_KEY, PRIVATE_KEY)
}

// In-memory store (replace with DB in production)
const subscriptions: webPush.PushSubscription[] = []

export async function POST(request: NextRequest) {
  try {
    if (!PUBLIC_KEY || !PRIVATE_KEY) {
      return NextResponse.json({ error: "Push notifications not configured" }, { status: 503 })
    }

    const sub: webPush.PushSubscription = await request.json()
    if (!sub?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
    }

    // Avoid duplicates
    const exists = subscriptions.some((s) => s.endpoint === sub.endpoint)
    if (!exists) subscriptions.push(sub)

    return NextResponse.json({ ok: true, total: subscriptions.length })
  } catch (err) {
    console.error("Push subscribe error:", err)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

// Send a test notification to all subscribers
export async function PUT(request: NextRequest) {
  try {
    if (!PUBLIC_KEY || !PRIVATE_KEY) {
      return NextResponse.json({ error: "Push not configured" }, { status: 503 })
    }

    const { title, body, url } = await request.json()
    const payload = JSON.stringify({ title: title ?? "Szene", body: body ?? "New event near you!", url: url ?? "/discover" })

    const results = await Promise.allSettled(
      subscriptions.map((sub) => webPush.sendNotification(sub, payload))
    )

    const sent = results.filter((r) => r.status === "fulfilled").length
    return NextResponse.json({ sent, total: subscriptions.length })
  } catch (err) {
    console.error("Push send error:", err)
    return NextResponse.json({ error: "Failed to send" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    configured: !!(PUBLIC_KEY && PRIVATE_KEY),
    publicKey: PUBLIC_KEY,
    subscribers: subscriptions.length,
  })
}
