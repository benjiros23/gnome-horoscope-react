import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ===== ОБРАБОТКА ОШИБОК =====
const handleError = (error, errorInfo) => {
  console.error('🚨 Критическая ошибка приложения:', error);
  console.error('📍 Дополнительная информация:', errorInfo);
  
  // В production можно отправлять ошибки в сервис мониторинга
  if (process.env.NODE_ENV === 'production') {
    // Например: Sentry.captureException(error);
  }
};

// ===== ERROR BOUNDARY КОМПОНЕНТ =====
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    handleError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0f0f23',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '24px', 
              marginBottom: '16px',
              color: '#f44336'
            }}>
              🔮 Упс! Что-то пошло не так
            </h1>
            <p style={{ 
              marginBottom: '20px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Произошла ошибка в Гномьем Гороскопе. Пожалуйста, перезагрузите страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Перезагрузить
            </button>
            
            {process.env.NODE_ENV === 'development' && (
              <details style={{ 
                marginTop: '20px',
                textAlign: 'left',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  Техническая информация
                </summary>
                <pre style={{ 
                  background: 'rgba(0,0,0,0.3)',
                  padding: '8px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {this.state.error?.toString()}
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

// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
const initializeApp = () => {
  console.log('🚀 Инициализация Гномьего Гороскопа...');
  
  // Проверяем наличие root элемента
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('❌ Элемент #root не найден в DOM');
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
    
    console.log('✅ React приложение успешно смонтировано');
    
  } catch (error) {
    console.error('❌ Ошибка при создании React root:', error);
    
    // Fallback для старых браузеров
    try {
      ReactDOM.render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>,
        rootElement
      );
      console.log('✅ Fallback: Использован ReactDOM.render');
    } catch (fallbackError) {
      console.error('❌ Критическая ошибка инициализации:', fallbackError);
    }
  }
};

// ===== SERVICE WORKER УПРАВЛЕНИЕ =====
const manageServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      console.log('🧹 Отключаем Service Workers...');
      
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      const unregisterPromises = registrations.map(registration => {
        console.log('🗑️ Отключаем SW:', registration.scope);
        return registration.unregister();
      });
      
      await Promise.all(unregisterPromises);
      
      if (registrations.length > 0) {
        console.log(`✅ Отключено ${registrations.length} Service Workers`);
      }
      
    } catch (error) {
      console.warn('⚠️ Ошибка при отключении Service Workers:', error);
    }
  }
};

// ===== ГЛОБАЛЬНАЯ НАСТРОЙКА =====
const setupGlobalConfig = () => {
  // Настройка для мобильных устройств
  if (typeof window !== 'undefined') {
    // Предотвращаем зум при фокусе на input
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    }
    
    // Скрываем адресную строку на мобильных
    const hideAddressBar = () => {
      setTimeout(() => {
        if (window.scrollY === 0) {
          window.scrollTo(0, 1);
        }
      }, 100);
    };
    
    if (navigator.userAgent.match(/iPhone|Android/i)) {
      window.addEventListener('load', hideAddressBar);
    }
    
    // Дебаг информация
    if (process.env.NODE_ENV === 'development') {
      window.appDebug = {
        version: '1.0.0',
        buildTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      };
      console.log('🔧 Debug info доступна в window.appDebug');
    }
  }
};

// ===== ЗАПУСК ПРИЛОЖЕНИЯ =====
const startApp = async () => {
  console.log('🧙‍♂️ Запуск Гномьего Гороскопа...');
  
  try {
    // Настройка глобальной конфигурации
    setupGlobalConfig();
    
    // Управление Service Workers
    await manageServiceWorker();
    
    // Инициализация React приложения
    initializeApp();
    
    console.log('🎉 Гномий Гороскоп с единой системой стилей запущен!');
    
    // Уведомление пользователя о готовности (только в dev)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        console.log('🌟 Приложение готово к использованию!');
      }, 1000);
    }
    
  } catch (error) {
    console.error('💥 Критическая ошибка запуска приложения:', error);
  }
};

// ===== ПРОВЕРКА DOM ГОТОВНОСТИ =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

// ===== ОБРАБОТКА ГЛОБАЛЬНЫХ ОШИБОК =====
window.addEventListener('error', (event) => {
  console.error('🚨 Необработанная ошибка:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Необработанное отклонение Promise:', event.reason);
  event.preventDefault(); // Предотвращаем вывод в консоль браузера
});

// ===== HOT MODULE REPLACEMENT (для разработки) =====
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    console.log('🔥 Hot reload: App компонент обновлен');
  });
}

export default startApp;
