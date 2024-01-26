self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('Time Logger').then((cache) => {
      return cache.addAll([
        '/',
        '/css/styles.css',
        '/js/analytics.js',
        '/js/category.js',
        '/js/script.js',
        '/images/dog.png',
        '/images/favicon.ico'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch((error) => {
        console.error('Failed to fetch resource:', error);
      });
    })
  );
});
