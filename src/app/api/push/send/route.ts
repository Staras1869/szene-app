import { NextRequest, NextResponse } from "next/server"
import webpush from "web-push"
import { getSubs } from "@/lib/push-store"

export const runtime = "nodejs"

function initWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL ?? "mailto:hallo@szene.app",
    process.env.VAPID_PUBLIC_KEY ?? "",
    process.env.VAPID_PRIVATE_KEY ?? "",
  )
}

// Called by Vercel cron OR manually with ?secret=...
// Optional JSON body: { title, body, url, city }
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Allow caller to override the notification content
  let override: { title?: string; body?: string; url?: string; city?: string } = {}
  try { override = await req.json() } catch {}

  initWebPush()

  // Filter subs by city if provided
  const allSubs = await getSubs()
  const subs = override.city
    ? allSubs.filter((s: any) => !s.city || s.city === override.city)
    : allSubs

  if (subs.length === 0) return NextResponse.json({ sent: 0, msg: "No subscribers" })

  const payload = JSON.stringify({
    title: override.title ?? "Szene — Tonight",
    body:  override.body  ?? "Doors are opening. Check what's on tonight 🎉",
    url:   override.url   ?? "/",
    icon:  "/app-icon-192.png",
    badge: "/app-icon-192.png",
  })

  let sent = 0; let failed = 0
  await Promise.allSettled(
    subs.map((sub: any) =>
      webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload)
        .then(() => sent++)
        .catch(() => failed++)
    )
  )

  console.log(`[push/send] sent=${sent} failed=${failed} city=${override.city ?? "all"}`)
  return NextResponse.json({ sent, failed })
}

// Same for GET (easier to trigger from cron)
export async function GET(req: NextRequest) {
  return POST(req)
}
