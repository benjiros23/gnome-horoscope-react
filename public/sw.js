// public/sw.js - Простой Service Worker без ошибок
const CACHE_NAME = 'gnome-horoscope-v3';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Установлен');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Активирован');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Простая обработка без сложной логики
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Offline', { status: 503 });
    })
  );
});
