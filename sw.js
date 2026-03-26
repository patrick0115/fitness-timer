const CACHE = 'fitness-timer-v1.0.0';
const FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

// 安裝：把所有檔案存進快取
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES.filter(f => !f.includes('.png') || true)))
      .catch(() => caches.open(CACHE).then(c => c.addAll(['/', '/index.html', '/manifest.json'])))
  );
  self.skipWaiting();
});

// 啟動：清除舊版快取
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 攔截請求：優先用快取，失敗才連網
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
