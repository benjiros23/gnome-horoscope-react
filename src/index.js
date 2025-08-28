import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Создаем корневой элемент
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение
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
