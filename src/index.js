import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Telegram WebApp интеграция
const initTelegramWebApp = () => {
  // Загружаем Telegram скрипт
  const telegramScript = document.createElement('script');
  telegramScript.src = 'https://telegram.org/js/telegram-web-app.js';
  telegramScript.async = true;
  
  // Обработчик успешной загрузки
  telegramScript.onload = () => {
    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Инициализация Telegram WebApp
        tg.ready();
        tg.expand();
        
        // Применяем цветовую схему Telegram
        if (tg.themeParams?.bg_color) {
          document.documentElement.style.setProperty('--tg-bg', tg.themeParams.bg_color);
        }
        if (tg.themeParams?.text_color) {
          document.documentElement.style.setProperty('--tg-text', tg.themeParams.text_color);
        }
        
        // Настройки для мобильного интерфейса
        tg.setHeaderColor('bg_color');
        tg.setBackgroundColor('#ffffff');
        
        console.log('🎉 Telegram WebApp готов к работе!');
      } else {
        console.log('🔧 Работаем в браузере (демо-режим)');
      }
    } catch (error) {
      console.warn('⚠️ Ошибка инициализации Telegram WebApp:', error.message);
    }
  };
  
  // Обработчик ошибки загрузки
  telegramScript.onerror = () => {
    console.log('📱 Telegram WebApp скрипт не загрузился (это нормально для обычного браузера)');
  };
  
  // Добавляем скрипт в head
  document.head.appendChild(telegramScript);
};

// Простой обработчик ошибок React
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Ошибка React приложения:', error);
    
    // Отправляем ошибку в Telegram если доступно
    if (window.Telegram?.WebApp?.sendData) {
      try {
        window.Telegram.WebApp.sendData(JSON.stringify({
          type: 'error',
          message: error.message,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.log('Не удалось отправить ошибку в Telegram');
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: 'var(--tg-bg, #f8f9fa)',
          color: 'var(--tg-text, #333)',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div>
            <h2 style={{ color: '#8BC34A', marginBottom: '16px' }}>
              🔧 Что-то пошло не так
            </h2>
            <p style={{ marginBottom: '20px', opacity: 0.8 }}>
              Произошла ошибка. Попробуйте обновить страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #8BC34A, #FFC107)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              🔄 Обновить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Инициализация React приложения
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендер с обработчиком ошибок
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Инициализируем Telegram WebApp после рендера
initTelegramWebApp();

// Предотвращаем контекстное меню в Telegram
document.addEventListener('contextmenu', (event) => {
  if (window.Telegram?.WebApp) {
    event.preventDefault();
  }
});

// Предотвращаем выделение текста в Telegram
document.addEventListener('selectstart', (event) => {
  if (window.Telegram?.WebApp && 
      event.target.tagName !== 'INPUT' && 
      event.target.tagName !== 'TEXTAREA') {
    event.preventDefault();
  }
});

// Регистрация Service Worker (только в production)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => {
        console.log('✅ Service Worker зарегистрирован');
      })
      .catch((error) => {
        console.log('❌ Service Worker не зарегистрирован:', error.message);
      });
  });
}

// Базовые Web Vitals (упрощенно)
if (process.env.NODE_ENV === 'development') {
  const logWebVitals = (metric) => {
    console.log('📊 Web Vitals:', metric);
  };
  
  // Динамический импорт web-vitals только в development
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(logWebVitals);
    getFID(logWebVitals);
    getFCP(logWebVitals);
    getLCP(logWebVitals);
    getTTFB(logWebVitals);
  }).catch(() => {
    // web-vitals не найден, продолжаем без метрик
  });
}

// Информация о запуске
console.log('🧙‍♂️ Гномий Гороскоп запущен!');
console.log('📱 Режим:', process.env.NODE_ENV || 'development');
console.log('🌐 Telegram WebApp:', !!window.Telegram?.WebApp);
