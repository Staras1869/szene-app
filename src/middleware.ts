import { type NextRequest, NextResponse } from "next/server"

/**
 * Edge middleware — runs before every request on Vercel's edge network.
 *
 * Responsibilities:
 *  1. Rate-limit auth + write endpoints (sliding-window, per IP)
 *  2. Block obviously malformed requests
 *  3. Strip server-identifying headers added by the runtime
 */

// ---------------------------------------------------------------------------
// Sliding-window rate-limiter (in-memory per edge instance)
// For production scale swap the Map for Upstash Redis:
//   https://upstash.com/docs/redis/sdks/ratelimit-ts/overview
// ---------------------------------------------------------------------------

interface RateEntry { count: number; windowStart: number }
const rateLimitStore = new Map<string, RateEntry>()

const RULES: { pattern: RegExp; limit: number; windowMs: number }[] = [
  // Auth endpoints — tightest limits
  { pattern: /^\/api\/auth\/login/,    limit: 10,  windowMs: 60_000 },  // 10/min
  { pattern: /^\/api\/auth\/register/, limit: 5,   windowMs: 60_000 },  // 5/min
  // Write endpoints — moderate
  { pattern: /^\/api\/reviews/,        limit: 30,  windowMs: 60_000 },
  { pattern: /^\/api\/checkins/,       limit: 20,  windowMs: 60_000 },
  { pattern: /^\/api\/favorites/,      limit: 60,  windowMs: 60_000 },
  // Discovery / read endpoints — generous
  { pattern: /^\/api\//,              limit: 200, windowMs: 60_000 },
]

function rateLimit(ip: string, path: string): { ok: boolean; remaining: number; resetMs: number } {
  const rule = RULES.find((r) => r.pattern.test(path))
  if (!rule) return { ok: true, remaining: 999, resetMs: 0 }

  const key = `${ip}:${rule.pattern.source}`
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || now - entry.windowStart > rule.windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now })
    return { ok: true, remaining: rule.limit - 1, resetMs: now + rule.windowMs }
  }

  entry.count += 1
  const remaining = Math.max(0, rule.limit - entry.count)
  const resetMs = entry.windowStart + rule.windowMs

  if (entry.count > rule.limit) {
    return { ok: false, remaining: 0, resetMs }
  }

  return { ok: true, remaining, resetMs }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // ── Strip fingerprinting headers ──────────────────────────────────────────
  response.headers.delete("X-Powered-By")
  response.headers.delete("Server")

  // ── Rate limiting (API routes only) ───────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown"

    const { ok, remaining, resetMs } = rateLimit(ip, pathname)

    response.headers.set("X-RateLimit-Remaining", String(remaining))
    response.headers.set("X-RateLimit-Reset", String(Math.ceil(resetMs / 1000)))

    if (!ok) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }
  }

  // ── Block obvious attack patterns ─────────────────────────────────────────
  const suspicious = /(\.\.|\/etc\/passwd|<script|union\s+select|drop\s+table)/i
  if (suspicious.test(pathname) || suspicious.test(request.nextUrl.search)) {
    return new NextResponse(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  return response
}

export const config = {
  matcher: [
    // Apply to all routes except static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)",
  ],
}
