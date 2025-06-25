
const CACHE_NAME = 'toko-sederhana-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/index-struk.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/minas-ayam.png',
  '/minas-sate.png',
  '/minas-telor.png',
  '/minuman.png'
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  self.skipWaiting(); // Activate worker immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline page');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
