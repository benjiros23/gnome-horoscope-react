import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Telegram WebApp Script
const telegramScript = document.createElement('script');
telegramScript.src = 'https://telegram.org/js/telegram-web-app.js';
telegramScript.async = true;
document.head.appendChild(telegramScript);

// Инициализация Telegram WebApp
telegramScript.onload = () => {
  if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    
    // Применяем цветовую схему Telegram
    if (tg.themeParams) {
      const root = document.documentElement;
      
      if (tg.themeParams.bg_color) {
        root.style.setProperty('--bg-main', tg.themeParams.bg_color);
      }
      if (tg.themeParams.text_color) {
        root.style.setProperty('--text-primary', tg.themeParams.text_color);
      }
      if (tg.themeParams.hint_color) {
        root.style.setProperty('--text-muted', tg.themeParams.hint_color);
      }
    }
    
    console.log('🎉 Telegram WebApp готов к работе!');
  }
};

// Обработчик ошибок загрузки Telegram скрипта
telegramScript.onerror = () => {
  console.log('📱 Telegram WebApp скрипт не загрузился (это нормально для браузера)');
};

// Компонент обертка для обработки ошибок
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Ошибка приложения:', error, errorInfo);
    
    // В Telegram WebApp отправляем данные об ошибке
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.sendData(JSON.stringify({
          action: 'error',
          error: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        console.log('Не удалось отправить данные об ошибке в Telegram');
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px 20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E8 100%)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
            <h2 style={{ color: '#8BC34A', marginBottom: '16px' }}>Упс! Что-то пошло не так</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Произошла ошибка в работе приложения. Попробуйте обновить страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #8BC34A 0%, #FFC107 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔄 Обновить страницу
            </button>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '20px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#8BC34A' }}>
                  Детали ошибки (только в разработке)
                </summary>
                <pre style={{ 
                  background: '#f5f5f5', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  overflow: 'auto',
                  marginTop: '8px'
                }}>
                  {this.state.error?.stack || this.state.error?.message || 'Неизвестная ошибка'}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Создаем корневой элемент React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Рендерим приложение с обработчиком ошибок
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Service Worker - исправленная версия
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker зарегистрирован:', registration);
      })
      .catch((error) => {
        console.log('❌ Ошибка регистрации Service Worker:', error);
      });
  });
}

// Отправляем метрики производительности (опционально)
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Используем reportWebVitals
reportWebVitals((metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Web Vitals:', metric);
  }
});

// Логируем информацию о приложении
console.log('🧙‍♂️ Гномий Гороскоп запущен!');
console.log('📱 Режим:', process.env.NODE_ENV);
console.log('🌐 Telegram WebApp:', !!window.Telegram?.WebApp);

// Предотвращаем контекстное меню для Telegram WebApp
document.addEventListener('contextmenu', (e) => {
  if (window.Telegram?.WebApp) {
    e.preventDefault();
  }
});

// Предотвращаем выделение текста для мобильных устройств в Telegram
document.addEventListener('selectstart', (e) => {
  if (window.Telegram?.WebApp && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
  }
});
