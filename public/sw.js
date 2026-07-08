const CACHE_NAME = 'myle-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/offline',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension, supabase auth api, and local dev hot reloads (sockjs/webpack)
  const url = new URL(event.request.url);
  if (
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('webpack')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Dynamically cache static assets
          if (
            url.pathname.match(/\.(png|jpg|jpeg|gif|svg|woff2|css|js)$/) &&
            !url.pathname.startsWith('/_next/')
          ) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // If offline and requesting a page, return the offline fallback
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/offline') || Response.error();
          }
        });
    })
  );
});
