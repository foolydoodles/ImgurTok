// --- Service Worker ---
const CACHE_NAME = 'imgur-viewer-cache-v1';
const urlsToCache = [
    '/',
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    // We only want to cache GET requests for images and videos from Imgur
    if (event.request.method === 'GET' && event.request.url.includes('i.imgur.com')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return cache.match(event.request).then(response => {
                    // Return from cache if available, otherwise fetch from network and cache
                    return response || fetch(event.request).then(networkResponse => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        // For all other requests, just fetch from the network
        event.respondWith(fetch(event.request));
    }
});
