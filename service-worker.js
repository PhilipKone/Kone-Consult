/**
 * PHconsult Service Worker
 * Enables offline functionality and improves performance
 */

// Cache version identifier
const CACHE_NAME = 'phconsult-cache-v1';

// Assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/login.html',
  '/register.html',
  '/service-detail.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/images/Logo.png',
  '/assets/images/hero-bg.jpg',
  '/offline.html' // Fallback page for when offline
];

// Install event - cache static assets
self.addEventListener('install', event => {
  // Skip waiting to ensure the new service worker takes over immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        // Claim clients to ensure the service worker controls all pages
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip POST requests or any API calls
  if (event.request.method !== 'GET' || event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if available
        if (cachedResponse) {
          // Also update cache in background (stale-while-revalidate)
          fetchAndUpdateCache(event.request);
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetchAndUpdateCache(event.request)
          .catch(error => {
            console.error('Fetch failed:', error);
            
            // Check if it's an HTML request
            const url = new URL(event.request.url);
            if (event.request.headers.get('Accept').includes('text/html') || 
                url.pathname.endsWith('.html') || 
                url.pathname === '/') {
              return caches.match('/offline.html');
            }
            
            // For image requests, return a fallback image
            if (event.request.headers.get('Accept').includes('image')) {
              return caches.match('/assets/images/image-placeholder.png');
            }
            
            // For other resources, just return an empty response
            return new Response('', { status: 408, statusText: 'Request timed out' });
          });
      })
  );
});

// Helper function to fetch and update cache
function fetchAndUpdateCache(request) {
  return fetch(request)
    .then(response => {
      // Check if we received a valid response
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      
      // Clone the response as it can only be consumed once
      const responseToCache = response.clone();
      
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, responseToCache);
        })
        .catch(error => {
          console.error('Failed to update cache:', error);
        });
      
      return response;
    });
}

// Background sync for contact form submissions when offline
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(syncContactForms());
  }
});

// Process queued contact form submissions
function syncContactForms() {
  return self.clients.matchAll()
    .then(clients => {
      // Get the client window to access IndexedDB
      if (clients.length === 0) return;
      
      // Send message to client to process pending submissions
      clients[0].postMessage({
        type: 'SYNC_CONTACTS'
      });
    });
}

// Push notification event handler
self.addEventListener('push', event => {
  const data = event.data.json();
  
  const options = {
    body: data.message || 'New notification from PHconsult',
    icon: '/assets/images/Logo.png',
    badge: '/assets/images/badge.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('PHconsult', options)
  );
});

// Notification click event handler
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
