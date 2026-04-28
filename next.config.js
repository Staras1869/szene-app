/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevent MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send referrer on same origin / HTTPS downgrade
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 1 year (prod only — harmless on dev)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Restrict browser features
  {
    key: "Permissions-Policy",
    value: [
      "camera=(self)",          // needed for profile/venue photo uploads
      "geolocation=(self)",     // needed for nearby venue discovery
      "microphone=()",          // not used
      "payment=()",             // not used
      "usb=()",                 // not used
    ].join(", "),
  },
  // DNS prefetch for performance while keeping security
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy
  // Leaflet tiles come from openstreetmap.org and unpkg.com
  // Images are scraped from arbitrary domains — img-src must remain permissive
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Next.js inline. 'unsafe-eval' removed — not needed by Next.js 14+ in prod.
      // If a third-party lib breaks, add it here explicitly rather than re-enabling unsafe-eval.
      "script-src 'self' 'unsafe-inline' https://unpkg.com",
      // Styles: self + inline (Tailwind/Leaflet need this)
      "style-src 'self' 'unsafe-inline' https://unpkg.com",
      // Images: self + data URIs + all HTTPS (scraped venue/event images)
      "img-src 'self' data: blob: https: http:",
      // Fonts: self
      "font-src 'self' data:",
      // Connections: self + OSM Overpass + weather API + Neon DB is server-side only
      "connect-src 'self' https://overpass-api.de https://api.openweathermap.org https://nominatim.openstreetmap.org wss://szene-app.vercel.app",
      // Map tiles via worker
      "worker-src 'self' blob:",
      // Leaflet loads tiles in an iframe-less way but needs frame-src for embed protection
      "frame-src 'none'",
      // Object/media
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },

  images: {
    unoptimized: false,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "**" },
      { protocol: "http",  hostname: "**" },
    ],
  },
}

module.exports = nextConfig
