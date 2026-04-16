import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
    return NextResponse.json({ user: { id: payload.userId, email: payload.email } })
  } catch {
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
