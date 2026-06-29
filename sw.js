/*
  Service worker for the Sangthong Awning Calculator PWA.
  ทำให้เครื่องคำนวณใช้งานได้แบบออฟไลน์ (ไม่ต้องมีอินเทอร์เน็ต)

  - On install: pre-caches every calculator page + shared assets, so the whole
    app works offline after the first visit.
  - On fetch: serves from cache first (fast + offline), falling back to network
    and caching any new file it fetches.

  IMPORTANT: bump CACHE_NAME (v1 -> v2 ...) whenever you change any cached file,
  so visitors get the new version instead of the old cached copy.
*/
const CACHE_NAME = 'sangthong-awning-v2';

const ASSETS = [
  './',
  './manifest.json',
  './icon.svg',
  './prices.js',
  './aland_retractable_arm_awning.html',
  './chill-d1.html',
  './index.html',
  './ipergo-dt-1s.html',
  './ipergo-m6-pro-cf.html',
  './ipergo-m6-pro-cfw.html',
  './ipergo-pergo-e.html',
  './ipergo-pvc-f.html',
  './ipergo-pvc-fd.html',
  './ipergo-pvc-ft.html',
  './ipergo-pvc-fw.html',
  './ipergo-pvc-fwd.html',
  './ipergo-pvc-fwt.html',
  './ipergo-pvc-wh.html',
  './ipergo-pvc-whd.html',
  './ipergo-pvc-wht.html',
  './ipergo-pvc-wm.html',
  './ipergo-pvc-wmd.html',
  './ipergo-pvc-wmt.html',
  './ipergo-r500.html',
  './ipergo-t600-cf.html',
  './ipergo-t600-cfd.html',
  './ipergo-t600-cfw.html',
  './ipergo-t600-cfwd.html',
  './ipergo-t600-cwh.html',
  './ipergo-t600-cwhd.html',
  './ipergo-t600-cwm.html',
  './ipergo-t600-cwmd.html',
  './izip-screen.html',
  './ma4-calculator.html',
  './maintenance-guide.html',
  './seatel-st1000e-vertical-awning.html',
  './seatel-st2000.html',
  './solidux.html',
  './spettmann-star.html',
  './terra-fs-full-cassette-premium-price-with-LED.html',
  './terra-fs-full-cassette-standard-with-LED.html',
  './terra-fs-premium-without-LED.html',
  './terra-fs-standard-without-LED.html',
  './terra-ma3-LED.html',
  './terra-ma3.html',
  './veranda-lt06.html',
  './zipguide-expert.html',
  './zipguide-ultra.html'
];

// Pre-cache everything on install. Individual adds so one missing file
// doesn't abort the whole install.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(ASSETS.map(url =>
        cache.add(url).catch(err => console.warn('SW: could not cache', url, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

// Clean up old caches when a new version activates.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first: serve from cache, fall back to network (and cache the result).
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const copy = response.clone();
        if (response.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
