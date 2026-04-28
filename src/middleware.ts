import { type NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Edge middleware — runs before every request on Vercel's edge network.
 *
 * Responsibilities:
 *  1. Rate-limit endpoints via Upstash Redis (globally consistent across all edge instances)
 *  2. CORS — restrict API calls to same origin + app domain
 *  3. Block obviously malformed / attack requests
 *  4. Enforce request body size limits
 *  5. Strip server-identifying headers
 */

// ---------------------------------------------------------------------------
// Upstash Redis rate limiters — one per tier
// Falls back to in-memory if env vars not set (local dev)
// ---------------------------------------------------------------------------

function makeRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null
  return new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

const redis = makeRedis()

// Sliding window limiters per endpoint tier
const limiters = redis ? {
  auth:      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5,  "60 s"), prefix: "rl:auth"      }),
  register:  new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3,  "60 s"), prefix: "rl:register"  }),
  chat:      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "60 s"), prefix: "rl:chat"      }),
  push:      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "60 s"), prefix: "rl:push"      }),
  write:     new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "60 s"), prefix: "rl:write"     }),
  api:       new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(200,"60 s"), prefix: "rl:api"       }),
} : null

// Fallback in-memory limiter when Upstash not configured (dev)
interface RateEntry { count: number; windowStart: number }
const fallbackStore = new Map<string, RateEntry>()
let lastCleanup = Date.now()

function fallbackLimit(ip: string, limit: number, windowMs: number, prefix: string): boolean {
  const now = Date.now()
  if (now - lastCleanup > 120_000) {
    lastCleanup = now
    for (const [k, e] of fallbackStore) if (now - e.windowStart > 300_000) fallbackStore.delete(k)
  }
  const key   = `${prefix}:${ip}`
  const entry = fallbackStore.get(key)
  if (!entry || now - entry.windowStart > windowMs) {
    fallbackStore.set(key, { count: 1, windowStart: now })
    return true
  }
  entry.count += 1
  return entry.count <= limit
}

function pickLimiter(pathname: string) {
  if (/^\/api\/auth\/login/.test(pathname))    return { limiter: limiters?.auth,     limit: 5,   prefix: "rl:auth"     }
  if (/^\/api\/auth\/register/.test(pathname)) return { limiter: limiters?.register, limit: 3,   prefix: "rl:register" }
  if (/^\/api\/chat/.test(pathname))           return { limiter: limiters?.chat,     limit: 20,  prefix: "rl:chat"     }
  if (/^\/api\/push/.test(pathname))           return { limiter: limiters?.push,     limit: 10,  prefix: "rl:push"     }
  if (/^\/api\/(reviews|checkins|rsvp|submit|newsletter|favorites)/.test(pathname))
                                               return { limiter: limiters?.write,    limit: 30,  prefix: "rl:write"    }
  if (/^\/api\//.test(pathname))               return { limiter: limiters?.api,      limit: 200, prefix: "rl:api"      }
  return null
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------

const ALLOWED_ORIGINS = new Set([
  "https://szene.app",
  "https://www.szene.app",
])

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true
  if (ALLOWED_ORIGINS.has(origin)) return true
  if (/^https:\/\/szene-[a-z0-9]+-stratos-projects-[a-z0-9]+\.vercel\.app$/.test(origin)) return true
  if (process.env.NODE_ENV !== "production" && /^http:\/\/localhost(:\d+)?$/.test(origin)) return true
  return false
}

// ---------------------------------------------------------------------------
// Attack pattern detection
// ---------------------------------------------------------------------------

const URL_ATTACK = /(\.\.[/\\]|\/etc\/passwd|\/proc\/self|<script[\s>]|javascript:|union[\s+]select|drop[\s+]table|exec[\s+(]|0x[0-9a-f]{4,})/i

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get("origin")
  const method = request.method

  // ── CORS preflight ────────────────────────────────────────────────────────
  if (method === "OPTIONS" && pathname.startsWith("/api/")) {
    if (!isAllowedOrigin(origin)) return new NextResponse(null, { status: 403 })
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin":  origin ?? "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age":       "86400",
        "Vary": "Origin",
      },
    })
  }

  // ── Block cross-origin API calls from unknown origins ────────────────────
  if (pathname.startsWith("/api/") && origin && !isAllowedOrigin(origin)) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    })
  }

  const response = NextResponse.next()

  // ── CORS headers on actual API responses ─────────────────────────────────
  if (pathname.startsWith("/api/") && origin && isAllowedOrigin(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Vary", "Origin")
  }

  // ── Strip fingerprinting headers ──────────────────────────────────────────
  response.headers.delete("X-Powered-By")
  response.headers.delete("Server")

  // ── Block obvious URL-level attack patterns ───────────────────────────────
  const urlToCheck = pathname + (request.nextUrl.search ?? "")
  if (URL_ATTACK.test(decodeURIComponent(urlToCheck))) {
    return new NextResponse(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // ── Request body size guard ───────────────────────────────────────────────
  const contentLength = request.headers.get("content-length")
  if (contentLength) {
    const bytes = parseInt(contentLength, 10)
    const limit = pathname.startsWith("/api/chat") ? 32_768 : 65_536
    if (!isNaN(bytes) && bytes > limit) {
      return new NextResponse(JSON.stringify({ error: "Request too large" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      })
    }
  }

  // ── Rate limiting ─────────────────────────────────────────────────────────
  const picked = pickLimiter(pathname)
  if (picked) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "anonymous"

    let allowed = true

    if (picked.limiter) {
      // Upstash global rate limit
      const result = await picked.limiter.limit(ip)
      allowed = result.success
      response.headers.set("X-RateLimit-Remaining", String(result.remaining))
      response.headers.set("X-RateLimit-Reset",     String(result.reset))
    } else {
      // In-memory fallback (dev only)
      allowed = fallbackLimit(ip, picked.limit, 60_000, picked.prefix)
    }

    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: "Too many requests. Please slow down." }),
        {
          status: 429,
          headers: {
            "Content-Type":          "application/json",
            "Retry-After":           "60",
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.ico$).*)",
  ],
}
