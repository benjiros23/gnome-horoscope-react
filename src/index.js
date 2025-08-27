import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { initTelegram } from './telegram';
import { ErrorBoundary } from './errorBoundary';
import { initServiceWorker } from './serviceWorker';

// Метрики
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Boot
initTelegram();
initServiceWorker();
reportWebVitals((metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vitals:', metric);
  }
});

// UI restrictions inside Telegram
document.addEventListener('contextmenu', (e) => {
  if (window.Telegram?.WebApp) e.preventDefault();
});
document.addEventListener('selectstart', (e) => {
  if (
    window.Telegram?.WebApp &&
    e.target.tagName !== 'INPUT' &&
    e.target.tagName !== 'TEXTAREA'
  ) {
    e.preventDefault();
  }
});

// Debug info
console.log('🧙‍♂️ Гномий Гороскоп запущен!');
console.log('📱 Режим:', process.env.NODE_ENV);
console.log('🌐 Telegram WebApp:', !!window.Telegram?.WebApp);
