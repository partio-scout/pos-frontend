/* eslint-disable no-restricted-globals, no-undef */

// See Workbox docs in https://developers.google.com/web/tools/workbox/modules/workbox-sw

self.importScripts('/workbox/workbox-v5.1.3/workbox-sw.js')

workbox.setConfig({ modulePathPrefix: '/workbox/workbox-v5.1.3' })
//self.workbox.logLevel = self.workbox.LOG_LEVEL.verbose;

const cacheName = 'request-cache-v1'

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', (event) =>
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          return caches.delete(cacheName)
        })
      )
    })
  )
)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request).then((response) => {
          return caches.open(cacheName).then((cache) => {
            cache.put(event.request.url, response.clone())
            return response
          })
        })
      })
      .catch((error) => {
        // TODO: Respond with custom offline page
        console.log('Error in service worker:', error)
      })
  )
})
// GENERATED FILES ARE INJECTED HERE BY build-service-worker.js
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

// API calls precache
workbox.precaching.precacheAndRoute([
  'https://pof-backend.partio.fi/spn-ohjelma-json-taysi/?postGUID=86b5b30817ce3649e590c5059ec88921',
  'https://pof-backend.partio.fi/tag-translations-json/',
])

// app-shell
workbox.routing.registerRoute('/', new workbox.strategies.NetworkFirst())

// webfont-cache
const webFontHandler = new workbox.strategies.CacheFirst({
  cacheName: 'webfont-cache',
  cacheExpiration: {
    maxEntries: 20,
  },
  cacheableResponse: { statuses: [0, 200] },
})
workbox.routing.registerRoute(
  /https:\/\/fonts.googleapis.com\/.*/,
  webFontHandler
)
