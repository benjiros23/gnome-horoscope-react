import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Создаем корневой элемент React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// ИСПРАВЛЕННАЯ регистрация Service Worker - убираем InvalidStateError
function cleanupAndRegisterSW() {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    // Сначала удаляем все старые Service Workers
    navigator.serviceWorker.getRegistrations().then(registrations => {
      const unregisterPromises = registrations.map(registration => 
        registration.unregister()
      );
      
      return Promise.all(unregisterPromises);
    }).then(() => {
      // Регистрируем новый после удаления старых
      return navigator.serviceWorker.register('/sw.js');
    }).then(registration => {
      console.log('✅ Service Worker успешно зарегистрирован:', registration.scope);
    }).catch(error => {
      console.log('❌ Service Worker ошибка (игнорируется):', error.message);
    });
  }
}

// Запускаем очистку и регистрацию SW после полной загрузки
window.addEventListener('load', cleanupAndRegisterSW);

console.log('🧙‍♂️ Гномий Гороскоп запущен!');
console.log('📱 Режим:', process.env.NODE_ENV || 'development');
