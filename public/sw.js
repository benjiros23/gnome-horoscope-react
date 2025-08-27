// public/sw.js - Минимальный Service Worker
const CACHE_NAME = 'gnome-horoscope-v1';

self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Установлен');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Активирован');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Простая стратегия: сначала сеть, потом кеш
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Кешируем успешные ответы
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, пытаемся найти в кеше
        return caches.match(event.request);
      })
  );
});
