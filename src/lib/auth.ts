import { type NextRequest } from "next/server"
import jwt from "jsonwebtoken"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is not set. This is a critical security error.")
    }
    // Development only — never reaches production
    return "dev-only-insecure-secret-do-not-use-in-prod"
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.")
  }
  return secret
}

const JWT_SECRET = getJwtSecret()

export function getUserFromRequest(request: NextRequest): { userId: string; email: string } | null {
  const token = request.cookies.get("auth-token")?.value
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as { userId: string; email: string }
    // Verify expected fields exist
    if (typeof payload.userId !== "string" || typeof payload.email !== "string") return null
    return payload
  } catch {
    return null
  }
}
