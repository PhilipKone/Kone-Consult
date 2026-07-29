/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'kone-consult-cache-v9';
const urlsToCache = [
  './',
  './index.html',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Ignore non-GET requests (e.g. POST for login/signup)
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignore Firebase Auth, Firestore, Google Sign-In, and API endpoints
  if (
    url.includes('firebase') || 
    url.includes('googleapis.com') || 
    url.includes('accounts.google.com') || 
    url.includes('identitytoolkit') ||
    url.includes('securetoken')
  ) {
    return;
  }

  // Network-first for HTML navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match('./index.html') || await cache.match('/offline.html');
        return cachedResponse || fetch(event.request);
      })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
