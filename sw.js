const CACHE = 'lis-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/articles/',
  '/articles/index.html',
  '/a-propos.html',
  '/contact.html',
  '/assets/site.css',
  '/assets/site.js',
  '/assets/articles-filter.js',
  '/favicon.svg',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/site.webmanifest',
  '/og-image.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Ne gérer que les requêtes GET same-origin
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const network = fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
