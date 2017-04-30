var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
    '../demo2/index.html',
    '../demo2/styles/main.css',
    '../demo2/script/main.js'
];

self.addEventListener('install', function(event) {
    // Perform install steps
    event.waitUntil(
    caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});
