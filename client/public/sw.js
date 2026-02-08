/**
 * Haven - Service Worker
 * Minimal service worker for PWA install capability
 */

const CACHE_NAME = 'haven-v1';

// Install event - skip waiting to activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  globalThis.skipWaiting();

// Activate event - claim clients immediately
self.addEventListener('activate', (event) => {
  console.log('[SW] Service worker activated');
  event.waitUntil(
    // Clean up old caches if any
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => {
      // Take control of all clients immediately
      return clients.claim();
    })
  );
});

// Fetch event - network-first strategy (simple, no complex offline logic)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API calls and external resources
  if (event.request.url.includes('/api/') || 
      !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Optionally cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails
        return caches.match(event.request);
      })
  );
});

// Push notification event handler
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Haven Alert';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    tag: 'haven-incident',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
});
