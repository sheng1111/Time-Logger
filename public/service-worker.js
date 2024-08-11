self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("Time Logger").then((cache) => {
      return cache.addAll([
        "/",
        "/css/styles.css",
        "/js/analytics.js",
        "/js/category.js",
        "/js/script.js",
        "/images/dog.png",
        "/images/favicon.ico",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 嘗試從網路獲取最新資源，失敗則使用緩存
      return fetch(event.request).catch(() => response);
    })
  );
});

self.addEventListener("activate", (event) => {
  var cacheWhitelist = ["Time Logger"];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // 強制當前 Service Worker 成為活動的 Worker
});

// 確保在重新加載頁面時，舊的 Service Worker 被正確清除
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (let registration of registrations) {
      registration.unregister();
    }
  });
}
