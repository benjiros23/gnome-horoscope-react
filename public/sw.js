// public/sw.js - Service Worker для Гномьего Гороскопа
const CACHE_NAME = 'gnome-horoscope-v2.1.0';
const OFFLINE_URL = '/offline.html';

// Ресурсы для кеширования
const CACHE_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  OFFLINE_URL
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Установка...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Кеширование ресурсов...');
        return cache.addAll(CACHE_RESOURCES);
      })
      .then(() => {
        console.log('✅ Service Worker: Установлен успешно');
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Активация...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Удаляем старый кеш:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Активирован');
      return self.clients.claim();
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  // Стратегия: сначала сеть, потом кеш
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Если запрос успешен, кешируем ответ
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
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Если это навигационный запрос, показываем offline страницу
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            // Для остальных запросов возвращаем базовый ответ
            return new Response('Ресурс недоступен оффлайн', {
              status: 404,
              statusText: 'Not Found'
            });
          });
      })
  );
});
