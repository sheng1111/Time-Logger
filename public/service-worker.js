// 在 Service Worker 安裝時，預緩存指定的資源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("TimeLoggerCache").then((cache) => {
      return cache.addAll([
        "/",
        "/css/styles.css",
        "/js/analytics.js",
        "/js/category.js",
        "/js/script.js",
        "/js/timerWorker.js",
        "/images/dog.png",
        "/images/favicon.ico",
      ]);
    })
  );
});

// 攔截網路請求並嘗試從緩存中提供響應，網路失敗時再使用緩存
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果請求成功，更新緩存中的請求
        return caches.open("TimeLoggerCache").then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // 如果網路請求失敗，則從緩存中查找匹配的請求
        return caches.match(event.request).then((cachedResponse) => {
          return cachedResponse || Promise.reject("no-match");
        });
      })
  );
});

// 啟用 Service Worker 並清除舊緩存
self.addEventListener("activate", (event) => {
  const cacheWhitelist = ["TimeLoggerCache"];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
