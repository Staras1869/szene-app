import { db } from "@/lib/db"

export type Sub = {
  endpoint: string
  keys: { p256dh: string; auth: string }
  city?: string
  vibes?: string[]
}

export async function addSub(sub: Sub) {
  await db.pushSubscription.upsert({
    where: { endpoint: sub.endpoint },
    update: { p256dh: sub.keys.p256dh, auth: sub.keys.auth, city: sub.city, vibes: sub.vibes ?? [] },
    create: { endpoint: sub.endpoint, p256dh: sub.keys.p256dh, auth: sub.keys.auth, city: sub.city, vibes: sub.vibes ?? [] },
  })
}

export async function getSubs(): Promise<Sub[]> {
  const rows = await db.pushSubscription.findMany()
  return rows.map(r => ({ endpoint: r.endpoint, keys: { p256dh: r.p256dh, auth: r.auth }, city: r.city ?? undefined, vibes: r.vibes }))
}
