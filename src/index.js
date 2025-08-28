import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ОТКЛЮЧАЕМ Service Worker - он мешает API запросам
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('🗑️ Service Worker удален:', registration.scope);
    });
  });
}

console.log('🧙‍♂️ Гномий Гороскоп запущен без Service Worker!');
console.log('📱 Режим:', process.env.NODE_ENV || 'development');
