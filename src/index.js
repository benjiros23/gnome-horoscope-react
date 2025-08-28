// ================================================================
// ГЛАВНЫЙ ФАЙЛ ЗАПУСКА REACT ПРИЛОЖЕНИЯ "ГНОМИЙ ГОРОСКОП"
// Включает полную интеграцию с Telegram WebApp API
// ================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// ================================================================
// КОНСТАНТЫ И КОНФИГУРАЦИЯ
// ================================================================

const APP_NAME = 'Гномий Гороскоп';
const APP_VERSION = '2.1.0';
const TELEGRAM_SCRIPT_URL = 'https://telegram.org/js/telegram-web-app.js';

// Проверяем окружение
const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// ================================================================
// КЛАСС ДЛЯ ОБРАБОТКИ ОШИБОК REACT (ERROR BOUNDARY)
// ================================================================

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  // Ловим ошибки и обновляем состояние
  static getDerivedStateFromError(error) {
    console.error('🚨 React Error Boundary поймал ошибку:', error);
    return { hasError: true };
  }

  // Логируем подробную информацию об ошибке
  componentDidCatch(error, errorInfo) {
    console.error('🚨 Подробности ошибки:', error);
    console.error('📍 Место ошибки:', errorInfo);
    
    // Сохраняем ошибку в состояние для отображения
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Отправляем данные об ошибке в Telegram если доступно
    this.sendErrorToTelegram(error, errorInfo);
    
    // В development режиме также выводим в консоль
    if (isDevelopment) {
      console.group('🔧 Информация для разработчика:');
      console.log('Ошибка:', error.message);
      console.log('Stack:', error.stack);
      console.log('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  // Отправляем информацию об ошибке в Telegram бот
  sendErrorToTelegram(error, errorInfo) {
    try {
      if (window.Telegram?.WebApp?.sendData) {
        const errorData = {
          type: 'application_error',
          timestamp: new Date().toISOString(),
          error: {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo?.componentStack
          },
          userAgent: navigator.userAgent,
          url: window.location.href,
          appVersion: APP_VERSION
        };
        
        window.Telegram.WebApp.sendData(JSON.stringify(errorData));
        console.log('📤 Данные об ошибке отправлены в Telegram');
      }
    } catch (telegramError) {
      console.warn('⚠️ Не удалось отправить ошибку в Telegram:', telegramError.message);
    }
  }

  // Компонент для отображения ошибки пользователю
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
          backgroundColor: 'var(--tg-bg-color, #f8f9fa)',
          color: 'var(--tg-text-color, #333)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            maxWidth: '450px',
            width: '100%',
            border: '1px solid rgba(139, 195, 74, 0.2)'
          }}>
            {/* Иконка ошибки */}
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '20px',
              filter: 'grayscale(0.5)'
            }}>
              🧙‍♂️💥
            </div>
            
            {/* Заголовок */}
            <h2 style={{ 
              color: '#8BC34A', 
              marginBottom: '16px',
              fontSize: '24px',
              fontWeight: '700'
            }}>
              Упс! Магия дала сбой
            </h2>
            
            {/* Описание */}
            <p style={{ 
              color: '#666', 
              marginBottom: '24px',
              lineHeight: '1.5',
              fontSize: '16px'
            }}>
              Произошла ошибка в работе гномьего приложения. 
              Древние руны требуют перезагрузки!
            </p>
            
            {/* Кнопка перезагрузки */}
            <button
              onClick={() => window.location.reload()}
              style={{
                background: 'linear-gradient(135deg, #8BC34A 0%, #FFC107 100%)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 12px rgba(139, 195, 74, 0.3)'
              }}
              onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
              onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
            >
              🔄 Перезапустить магию
            </button>
            
            {/* Детали ошибки в development режиме */}
            {isDevelopment && this.state.error && (
              <details style={{ 
                marginTop: '24px', 
                textAlign: 'left',
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                <summary style={{ 
                  cursor: 'pointer', 
                  color: '#8BC34A',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}>
                  🔧 Техническая информация (только для разработки)
                </summary>
                <pre style={{ 
                  background: '#fff', 
                  padding: '12px', 
                  borderRadius: '4px', 
                  overflow: 'auto',
                  fontSize: '11px',
                  border: '1px solid #e0e0e0'
                }}>
                  <strong>Ошибка:</strong> {this.state.error.message}
                  {'\n\n'}
                  <strong>Stack Trace:</strong>
                  {'\n'}{this.state.error.stack}
                  {'\n\n'}
                  <strong>Component Stack:</strong>
                  {'\n'}{this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            {/* Дополнительные действия */}
            <div style={{ marginTop: '20px', opacity: '0.7' }}>
              <small>
                Если проблема повторяется, обратитесь к разработчикам через Telegram
              </small>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ================================================================
// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ TELEGRAM WEBAPP
// ================================================================

const initializeTelegramWebApp = () => {
  console.log('🔄 Начинаем инициализацию Telegram WebApp...');
  
  // Создаем script элемент для загрузки Telegram WebApp API
  const telegramScript = document.createElement('script');
  telegramScript.src = TELEGRAM_SCRIPT_URL;
  telegramScript.async = true;
  telegramScript.defer = true;
  
  // Обработчик успешной загрузки Telegram скрипта
  telegramScript.onload = () => {
    console.log('✅ Telegram WebApp скрипт загружен успешно');
    
    try {
      // Проверяем доступность Telegram WebApp API
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        
        console.log('🎉 Telegram WebApp API доступен!');
        console.log('📱 Версия API:', tg.version);
        console.log('🔧 Platform:', tg.platform);
        
        // ========== ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ TELEGRAM WEBAPP ==========
        
        // Сообщаем Telegram что приложение готово
        tg.ready();
        
        // Разворачиваем приложение на весь экран
        tg.expand();
        
        // Включаем закрытие при свайпе вниз
        tg.enableClosingConfirmation();
        
        // ========== НАСТРОЙКА ЦВЕТОВОЙ СХЕМЫ ==========
        
        if (tg.themeParams) {
          console.log('🎨 Применяем цветовую схему Telegram...');
          const root = document.documentElement;
          
          // Основные цвета
          if (tg.themeParams.bg_color) {
            root.style.setProperty('--tg-bg-color', tg.themeParams.bg_color);
            document.body.style.backgroundColor = tg.themeParams.bg_color;
          }
          
          if (tg.themeParams.text_color) {
            root.style.setProperty('--tg-text-color', tg.themeParams.text_color);
          }
          
          if (tg.themeParams.hint_color) {
            root.style.setProperty('--tg-hint-color', tg.themeParams.hint_color);
          }
          
          if (tg.themeParams.link_color) {
            root.style.setProperty('--tg-link-color', tg.themeParams.link_color);
          }
          
          if (tg.themeParams.button_color) {
            root.style.setProperty('--tg-button-color', tg.themeParams.button_color);
          }
          
          if (tg.themeParams.button_text_color) {
            root.style.setProperty('--tg-button-text-color', tg.themeParams.button_text_color);
          }
          
          // Дополнительные цвета для темной темы
          if (tg.themeParams.secondary_bg_color) {
            root.style.setProperty('--tg-secondary-bg-color', tg.themeParams.secondary_bg_color);
          }
        }
        
        // ========== НАСТРОЙКА ИНТЕРФЕЙСА ==========
        
        // Устанавливаем цвет заголовка (верхней панели)
        try {
          tg.setHeaderColor('bg_color');
        } catch (e) {
          console.warn('⚠️ Не удалось установить цвет заголовка:', e.message);
        }
        
        // Устанавливаем цвет фона
        try {
          tg.setBackgroundColor('#ffffff');
        } catch (e) {
          console.warn('⚠️ Не удалось установить цвет фона:', e.message);
        }
        
        // ========== ОБРАБОТЧИКИ СОБЫТИЙ TELEGRAM ==========
        
        // Обработчик закрытия приложения
        tg.onEvent('mainButtonClicked', () => {
          console.log('🔘 Главная кнопка нажата');
        });
        
        // Обработчик изменения области просмотра
        tg.onEvent('viewportChanged', (data) => {
          console.log('📱 Viewport изменен:', data);
        });
        
        // Обработчик изменения темы
        tg.onEvent('themeChanged', () => {
          console.log('🎨 Тема изменена, перезагружаем стили...');
          initializeTelegramWebApp(); // Повторная инициализация стилей
        });
        
        // ========== СОХРАНЯЕМ РЕФЕРЕНС В WINDOW ==========
        
        // Делаем Telegram WebApp доступным глобально для компонентов
        window.telegramWebApp = tg;
        
        // Информация о пользователе
        if (tg.initDataUnsafe?.user) {
          window.telegramUser = tg.initDataUnsafe.user;
          console.log('👤 Пользователь Telegram:', window.telegramUser);
        }
        
        // Отправляем событие о готовности Telegram WebApp
        window.dispatchEvent(new CustomEvent('telegramWebAppReady', {
          detail: { 
            webApp: tg,
            user: tg.initDataUnsafe?.user,
            platform: tg.platform
          }
        }));
        
        console.log('🎉 Telegram WebApp полностью инициализирован!');
        
      } else {
        // Telegram WebApp API недоступен (обычный браузер)
        console.log('🔧 Работаем в обычном браузере (демо-режим)');
        console.log('📱 Все функции приложения доступны, кроме Telegram-специфичных');
        
        // Эмулируем некоторые функции для демо-режима
        window.telegramWebApp = {
          platform: 'web',
          version: '6.0',
          isDemo: true,
          ready: () => console.log('Demo: ready()'),
          close: () => console.log('Demo: close()'),
          sendData: (data) => console.log('Demo: sendData:', data)
        };
        
        // Отправляем событие для демо-режима
        window.dispatchEvent(new CustomEvent('telegramWebAppReady', {
          detail: { 
            webApp: window.telegramWebApp,
            user: null,
            platform: 'web',
            isDemo: true
          }
        }));
      }
      
    } catch (error) {
      console.error('❌ Ошибка при инициализации Telegram WebApp:', error);
      
      // Отправляем событие об ошибке
      window.dispatchEvent(new CustomEvent('telegramWebAppError', {
        detail: { error: error.message }
      }));
    }
  };
  
  // Обработчик ошибки загрузки Telegram скрипта
  telegramScript.onerror = (event) => {
    console.warn('⚠️ Не удалось загрузить Telegram WebApp скрипт');
    console.log('📱 Это нормально для работы в обычном браузере');
    
    // Инициализируем демо-режим
    window.telegramWebApp = {
      platform: 'web',
      version: '6.0',
      isDemo: true,
      ready: () => console.log('Demo: ready()'),
      close: () => console.log('Demo: close()'),
      sendData: (data) => console.log('Demo: sendData:', data)
    };
    
    window.dispatchEvent(new CustomEvent('telegramWebAppReady', {
      detail: { 
        webApp: window.telegramWebApp,
        user: null,
        platform: 'web',
        isDemo: true
      }
    }));
  };
  
  // Добавляем скрипт в head документа
  document.head.appendChild(telegramScript);
};

// ================================================================
// ФУНКЦИЯ РЕГИСТРАЦИИ SERVICE WORKER
// ================================================================

const registerServiceWorker = () => {
  // Регистрируем Service Worker только в production
  if (isProduction && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('🔧 Регистрируем Service Worker...');
      
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker зарегистрирован успешно:', registration.scope);
          
          // Проверяем обновления каждые 60 секунд
          setInterval(() => {
            registration.update();
          }, 60000);
          
        })
        .catch((error) => {
          console.warn('❌ Ошибка регистрации Service Worker:', error.message);
        });
    });
  } else if (isDevelopment) {
    console.log('🔧 Service Worker отключен в режиме разработки');
  }
};

// ================================================================
// ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ WEB VITALS (МЕТРИКИ ПРОИЗВОДИТЕЛЬНОСТИ)
// ================================================================

const initializeWebVitals = () => {
  // Инициализируем метрики только в development для отладки
  if (isDevelopment) {
    const reportWebVitals = (metric) => {
      console.log('📊 Web Vitals:', {
        name: metric.name,
        value: Math.round(metric.value),
        rating: metric.rating,
        delta: Math.round(metric.delta)
      });
      
      // В development выводим советы по оптимизации
      if (metric.rating === 'poor') {
        console.warn(`⚠️ Метрика ${metric.name} требует оптимизации!`);
      }
    };
    
    // Динамически импортируем web-vitals для измерения производительности
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals);  // Cumulative Layout Shift
      getFID(reportWebVitals);  // First Input Delay
      getFCP(reportWebVitals);  // First Contentful Paint
      getLCP(reportWebVitals);  // Largest Contentful Paint
      getTTFB(reportWebVitals); // Time to First Byte
    }).catch(() => {
      console.log('📊 Web Vitals библиотека не найдена (это нормально)');
    });
  }
};

// ================================================================
// НАСТРОЙКА МОБИЛЬНОГО ИНТЕРФЕЙСА
// ================================================================

const setupMobileInterface = () => {
  // Предотвращаем контекстное меню (долгое нажатие) в Telegram
  document.addEventListener('contextmenu', (event) => {
    if (window.telegramWebApp && !window.telegramWebApp.isDemo) {
      event.preventDefault();
    }
  }, { passive: false });
  
  // Предотвращаем выделение текста в Telegram (кроме input полей)
  document.addEventListener('selectstart', (event) => {
    if (window.telegramWebApp && 
        !window.telegramWebApp.isDemo && 
        event.target.tagName !== 'INPUT' && 
        event.target.tagName !== 'TEXTAREA') {
      event.preventDefault();
    }
  }, { passive: false });
  
  // Предотвращаем zoom при двойном нажатии
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, { passive: false });
  
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
  
  // Настраиваем viewport для мобильных устройств
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no';
  }
};

// ================================================================
// ФУНКЦИЯ ЛОГИРОВАНИЯ ИНФОРМАЦИИ О ПРИЛОЖЕНИИ
// ================================================================

const logAppInfo = () => {
  console.group(`🧙‍♂️ ${APP_NAME} v${APP_VERSION}`);
  console.log('📱 Режим:', process.env.NODE_ENV || 'development');
  console.log('🌐 User Agent:', navigator.userAgent);
  console.log('📍 URL:', window.location.href);
  console.log('🔧 React версия:', React.version);
  console.log('⏰ Время запуска:', new Date().toLocaleString('ru-RU'));
  
  // Информация о Telegram WebApp (будет обновлена после инициализации)
  setTimeout(() => {
    console.log('🤖 Telegram WebApp:', window.telegramWebApp ? 'Активен' : 'Недоступен');
    if (window.telegramUser) {
      console.log('👤 Пользователь Telegram:', window.telegramUser.first_name);
    }
  }, 1000);
  
  console.groupEnd();
};

// ================================================================
// ГЛАВНАЯ ФУНКЦИЯ ИНИЦИАЛИЗАЦИИ ПРИЛОЖЕНИЯ
// ================================================================

const initializeApp = () => {
  console.log('🚀 Запускаем инициализацию приложения...');
  
  // 1. Логируем информацию о приложении
  logAppInfo();
  
  // 2. Инициализируем Telegram WebApp
  initializeTelegramWebApp();
  
  // 3. Настраиваем мобильный интерфейс
  setupMobileInterface();
  
  // 4. Регистрируем Service Worker
  registerServiceWorker();
  
  // 5. Инициализируем метрики производительности
  initializeWebVitals();
  
  console.log('✅ Инициализация приложения завершена');
};

// ================================================================
// СОЗДАНИЕ И РЕНДЕР REACT ПРИЛОЖЕНИЯ
// ================================================================

// Находим корневой элемент
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Не найден элемент #root в HTML!');
  throw new Error('Root element not found');
}

// Создаем корневой React элемент
const root = ReactDOM.createRoot(rootElement);

// Рендерим приложение с обработчиком ошибок
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// ================================================================
// ЗАПУСК ИНИЦИАЛИЗАЦИИ
// ================================================================

// Запускаем инициализацию приложения
initializeApp();

// ================================================================
// ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ СОБЫТИЙ
// ================================================================

// Обработчик ошибок JavaScript
window.addEventListener('error', (event) => {
  console.error('🚨 Глобальная ошибка JavaScript:', event.error);
  
  // Отправляем критические ошибки в Telegram
  if (window.telegramWebApp?.sendData && !window.telegramWebApp.isDemo) {
    try {
      window.telegramWebApp.sendData(JSON.stringify({
        type: 'javascript_error',
        message: event.error?.message || 'Unknown error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('⚠️ Не удалось отправить ошибку в Telegram:', e.message);
    }
  }
});

// Обработчик неперехваченных Promise ошибок
window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 Неперехваченная Promise ошибка:', event.reason);
  
  // Предотвращаем показ ошибки в консоли браузера
  event.preventDefault();
});

// Обработчик перед закрытием страницы
window.addEventListener('beforeunload', (event) => {
  console.log('👋 Приложение закрывается...');
  
  // В Telegram WebApp можно отправить финальные данные
  if (window.telegramWebApp?.sendData && !window.telegramWebApp.isDemo) {
    try {
      window.telegramWebApp.sendData(JSON.stringify({
        type: 'app_close',
        timestamp: new Date().toISOString(),
        sessionDuration: Date.now() - window.appStartTime
      }));
    } catch (e) {
      console.warn('⚠️ Не удалось отправить данные о закрытии в Telegram');
    }
  }
});

// Сохраняем время старта приложения
window.appStartTime = Date.now();

// ================================================================
// ЭКСПОРТ ДЛЯ ОТЛАДКИ (только в development)
// ================================================================

if (isDevelopment) {
  // Делаем некоторые функции доступными в консоли для отладки
  window.debugGnomeApp = {
    reinitializeTelegram: initializeTelegramWebApp,
    getAppInfo: () => ({
      name: APP_NAME,
      version: APP_VERSION,
      mode: process.env.NODE_ENV,
      telegramWebApp: window.telegramWebApp,
      telegramUser: window.telegramUser
    }),
    testTelegramData: (data) => {
      if (window.telegramWebApp?.sendData) {
        window.telegramWebApp.sendData(JSON.stringify(data));
      } else {
        console.log('Test data:', data);
      }
    }
  };
  
  console.log('🔧 Функции отладки доступны в window.debugGnomeApp');
}

// ================================================================
// КОНЕЦ ФАЙЛА
// ================================================================

console.log('📜 index.js загружен полностью ✨');
