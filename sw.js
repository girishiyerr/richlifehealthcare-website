const CACHE_NAME = 'rich-life-health-v2';
const urlsToCache = [
    '/',
    '/styles.css',
    '/script.js',
    '/PHOTOS/51uAEUBdUVL.jpg',
    '/PHOTOS/images.jpeg',
    '/PHOTOS/images%20(1).jpeg',
    '/PHOTOS/My-S052j-Medical-Products-Portable-Quantum-Magnetic-Resonance-Body-Analyzer.avif',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache if available
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 