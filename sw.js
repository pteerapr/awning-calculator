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
const CACHE_NAME = 'sangthong-awning-v7';

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
  './rv-awning.html',
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
  event.respondWith(handleFetch(event.request));
});

async function handleFetch(request) {
  // 1) ลองใช้จากแคชก่อน (เร็ว + ใช้งานออฟไลน์ได้) / try cache first
  const cached = await caches.match(request);
  if (cached) return safeResponse(request, cached);

  // 2) ไม่มีในแคช → ดึงจากเน็ต แล้วเก็บลงแคช / not cached: fetch, then store
  try {
    const response = await fetch(request);
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
    }
    return safeResponse(request, response);
  } catch (err) {
    // 3) ออฟไลน์และไม่มีในแคช → คืนหน้าแรกเป็น fallback / offline fallback
    const fallback = await caches.match('./index.html');
    return fallback ? safeResponse(request, fallback) : Response.error();
  }
}

// เบราว์เซอร์ห้าม Service Worker ตอบ "การเปิดหน้า (navigation)" ด้วย response ที่ผ่าน
// การ redirect มา (เช่น Cloudflare Pages เปลี่ยน /page.html -> /page) ไม่งั้นจะขึ้น ERR_FAILED
// จึงสร้าง Response ขึ้นใหม่เพื่อล้างสถานะ "redirected" ทิ้ง
// (Browsers forbid a redirected response for a navigation; rebuild it to clear the flag.)
async function safeResponse(request, response) {
  if (request.mode === 'navigate' && response.redirected) {
    const body = await response.blob();
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }
  return response;
}
