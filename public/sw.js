// ─── Cache ────────────────────────────────────────────────────────────────────
const cacheName = "szene-cache-v3"
const precacheResources = ["/", "/offline.html", "/app-icon-192.png", "/app-icon-512.png", "/manifest.json"]

self.addEventListener("install", (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(precacheResources).catch(() => {}))
  )
})

self.addEventListener("activate", (event) => {
  // Delete old caches
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return

  const url = new URL(event.request.url)

  // For API routes and external requests — network only, no cache
  if (url.pathname.startsWith("/api/") || url.origin !== self.location.origin) {
    return
  }

  // For navigation requests — network first, fall back to cached page, then offline.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          // Cache a fresh copy of the page
          const clone = res.clone()
          caches.open(cacheName).then(cache => cache.put(event.request, clone))
          return res
        })
        .catch(() =>
          caches.match(event.request)
            .then(cached => cached || caches.match("/offline.html"))
        )
    )
    return
  }

  // For static assets — cache first, then network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached
      return fetch(event.request).then(res => {
        if (res.ok) {
          const clone = res.clone()
          caches.open(cacheName).then(cache => cache.put(event.request, clone))
        }
        return res
      }).catch(() => new Response("", { status: 503 }))
    })
  )
})

// ─── Push ─────────────────────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  let data = { title: "Szene", body: "Check out tonight's events!", url: "/" }
  try { data = { ...data, ...event.data.json() } } catch {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/app-icon-192.png",
      badge: "/app-icon-192.png",
      data: { url: data.url },
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? "/"
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((wins) => {
      const w = wins.find((c) => c.url === url && "focus" in c)
      if (w) return w.focus()
      return clients.openWindow(url)
    })
  )
})
