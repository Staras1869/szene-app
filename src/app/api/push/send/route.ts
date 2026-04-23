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
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret")
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  initWebPush()
  const subs = await getSubs()
  if (subs.length === 0) return NextResponse.json({ sent: 0, msg: "No subscribers yet" })

  const payload = JSON.stringify({
    title: "Szene — Tonight",
    body: "Doors are opening. Check what's on tonight 🎉",
    url: "/",
  })

  let sent = 0; let failed = 0
  await Promise.allSettled(
    subs.map(sub =>
      webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload)
        .then(() => sent++)
        .catch(() => failed++)
    )
  )

  console.log(`[push/send] sent=${sent} failed=${failed}`)
  return NextResponse.json({ sent, failed })
}

// Same for GET (easier to trigger from browser/cron)
export async function GET(req: NextRequest) {
  return POST(req)
}
