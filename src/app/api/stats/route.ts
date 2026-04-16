import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
// Revalidate every 60 s so Vercel doesn't hammer the DB
export const revalidate = 60

export async function GET() {
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)

  const [checkInsToday, totalCheckIns, totalFavorites, totalReviews] = await Promise.all([
    prisma.checkIn.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.checkIn.count(),
    prisma.userFavorite.count(),
    prisma.review.count(),
  ])

  return NextResponse.json({
    checkInsToday,
    totalCheckIns,
    totalFavorites,
    totalReviews,
    venuesLive: 200, // OSM-sourced, static reasonable number
    eventsTonight: 12,
  })
}
