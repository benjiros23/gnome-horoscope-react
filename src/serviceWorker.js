// src/serviceWorker.js
export const initServiceWorker = () => {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('✅ Service Worker зарегистрирован:', reg))
        .catch((err) => console.log('❌ Ошибка SW:', err));
    });
  }
};
