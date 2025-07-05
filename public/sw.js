// Choose a cache name
const cacheName = "szene-cache-v1"
// List the files to precache
const precacheResources = ["/", "/offline.html"]

// When the service worker is installed, open a new cache and add all resources
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)))
})

self.addEventListener("activate", (event) => {
  console.log("Service worker activate event!")
})

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }
      return fetch(event.request)
    }),
  )
})
