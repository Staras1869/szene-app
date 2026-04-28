import { type NextRequest } from "next/server"
import jwt from "jsonwebtoken"

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error("[security] JWT_SECRET is not set — auth will not work correctly in production.")
    }
    return "dev-only-insecure-secret-do-not-use-in-prod"
  }
  if (secret.length < 32) {
    console.warn("[security] JWT_SECRET is shorter than 32 characters — consider rotating to a stronger secret.")
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
