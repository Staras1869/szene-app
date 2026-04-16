import { type NextRequest } from "next/server"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production"

export function getUserFromRequest(request: NextRequest): { userId: string; email: string } | null {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string }
  } catch {
    return null
  }
}
