/* eslint-disable no-restricted-globals, no-undef */

// See Workbox docs in https://developers.google.com/web/tools/workbox/modules/workbox-sw

self.importScripts('/workbox/workbox-v4.3.1/workbox-sw.js')

workbox.setConfig({ modulePathPrefix: '/workbox/workbox-v4.3.1' })
//self.workbox.logLevel = self.workbox.LOG_LEVEL.verbose;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()))
self.addEventListener('activate', event =>
  event.waitUntil(self.clients.claim())
)

// GENERATED FILES ARE INJECTED HERE BY build-service-worker.js
workbox.precaching.precacheAndRoute([])

// API calls precache
workbox.precaching.precacheAndRoute([
  'https://pof-backend-staging.partio.fi/spn-ohjelma-json-taysi/?postGUID=86b5b30817ce3649e590c5059ec88921',
  'https://pof-backend-staging.partio.fi/tag-translations-json/',
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
