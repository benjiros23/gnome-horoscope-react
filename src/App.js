import React, { useState, useEffect } from 'react';
import { ThemeProvider, injectGlobalStyles } from './contexts/ThemeContext';

// Импорт всех компонентов
import Header from './components/Header';
import ModernBurgerMenu from './components/ModernBurgerMenu'; // ✅ КРАСИВОЕ БУРГЕР-МЕНЮ
import LoadingScreen from './components/LoadingScreen';
import ZodiacCardsSelector from './components/ZodiacCardsSelector';
import HoroscopeView from './components/HoroscopeView';
import MoonView from './components/MoonView';
import LunarView from './components/LunarView'; // 🌙 НОВЫЙ ЛУННЫЙ КОМПОНЕНТ
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
import DayCardView from './components/DayCardView';
import MercuryView from './components/MercuryView';
import FavoritesView from './components/FavoritesView';
import UserSettingsView from './components/UserSettingsView'; // 🧙‍♂️ НОВЫЙ КОМПОНЕНТ
import GnomeMentorView from './components/GnomeMentorView'; // 🧙‍♂️ НОВЫЕ ГНОМЫ-НАСТАВНИКИ
import GnomeQuestsView from './components/GnomeQuestsView'; // 🎯 НОВЫЕ КВЕСТЫ ОТ ГНОМОВ
import ServerStatus from './components/ServerStatus'; // 📶 ИНДИКАТОР СТАТУСА СЕРВЕРА
import StarryBackground from './components/StarryBackground';
import serverTester from './utils/serverTest'; // 🔧 ТЕСТЕР СЕРВЕРА
import telegramBot from './services/telegramBot'; // 🤖 TELEGRAM BOT SERVICE

const App = () => {
  // Основное состояние приложения
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('zodiac-selector');
  const [selectedSign, setSelectedSign] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Telegram WebApp интеграция с проверкой версии
  useEffect(() => {
    const initializeTelegramApp = () => {
      try {
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          
          // Инициализируем приложение
          tg.ready();
          tg.expand();
          
          // Проверяем версию перед вызовом методов
          const versionOk = (min) => {
            if (!tg?.version) return false;
            const [maj, minr] = tg.version.split('.').map(n => parseInt(n, 10));
            const [reqMaj, reqMin] = String(min).split('.').map(n => parseInt(n, 10));
            return (maj > reqMaj) || (maj === reqMaj && minr >= reqMin);
          };

          // Настраиваем цвета только если поддерживается
          try {
            if (versionOk('6.1') && typeof tg.setHeaderColor === 'function') {
              tg.setHeaderColor('#1a1a2e');
            }
            if (versionOk('6.2') && typeof tg.setBackgroundColor === 'function') {
              tg.setBackgroundColor('#1a1a2e');
            }
          } catch (e) {
            console.log('🔵 Цвета не поддерживаются в этой версии Telegram');
          }
          
          // Получаем данные пользователя
          const user = tg.initDataUnsafe?.user;
          if (user) {
            setTelegramUser(user);
            console.log('Пользователь Telegram:', user);
          }
          
          // Настраиваем кнопку "Назад" только если поддерживается
          try {
            if (versionOk('6.1') && tg.BackButton && typeof tg.BackButton.onClick === 'function') {
              tg.BackButton.onClick(() => {
                handleBack();
              });
            }
          } catch (e) {
            console.log('🔵 BackButton не поддерживается в этой версии');
          }
          
          console.log('✅ Telegram WebApp инициализирован');
        }
      } catch (error) {
        console.warn('⚠️ Telegram WebApp недоступен:', error);
      }
    };

    initializeTelegramApp();
  }, []);

  // Add error handling
  useEffect(() => {
    const handleGlobalError = (event) => {
      console.error('🔴 Global error:', event.error);
      
      // Send to Telegram
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert('⚠️ Произошла неожиданная ошибка');
      }
    };

    const handlePromiseRejection = (event) => {
      console.error('🔴 Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    };
  }, []);

  // Инициализация приложения
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Инжектируем глобальные стили
        injectGlobalStyles();
        
        // 🔧 Добавляем глобальные функции для отладки
        window.testServer = () => serverTester.runFullTest();
        window.checkEndpoints = () => serverTester.checkEndpoints();
        window.testBot = () => telegramBot.testBotConnection(); // 🤖 ТЕСТ БОТА
        console.log('🧙‍♂️ Для тестирования сервера используйте: testServer() или checkEndpoints()');
        console.log('🤖 Для тестирования бота: testBot()');
        
        // Загружаем сохраненные данные
        const savedSign = localStorage.getItem('gnome-selected-sign');
        const savedView = localStorage.getItem('gnome-current-view');
        const savedFavorites = localStorage.getItem('gnome-favorites');
        
        if (savedSign) {
          try {
            const sign = JSON.parse(savedSign);
            setSelectedSign(sign);
          } catch (e) {
            console.warn('Ошибка парсинга сохраненного знака:', e);
          }
        }
        
        if (savedView && savedSign) {
          setCurrentView(savedView);
        }
        
        if (savedFavorites) {
          try {
            const parsedFavorites = JSON.parse(savedFavorites);
            setFavorites(parsedFavorites);
          } catch (e) {
            console.warn('Ошибка парсинга избранного:', e);
          }
        }
        
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 🤖 Инициализируем Telegram Bot
        const botInitialized = await telegramBot.initialize();
        if (botInitialized) {
          console.log('✅ Telegram Bot успешно подключен');
        }
        
      } catch (error) {
        console.error('Ошибка инициализации:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Получение заголовка для экрана
  const getHeaderTitle = () => {
    const titles = {
      'zodiac-selector': '🔮 Астро Гном',
      'horoscope': selectedSign ? `🔮 ${selectedSign.sign}` : '🔮 Гороскоп',
      'moon': '🌙 Лунный календарь',
      'lunar': '🌙 Лунные циклы', // 🌙 НОВОЕ
      'compatibility': '💕 Совместимость',
      'numerology': '🔢 Нумерология',
      'cards': '🃏 Карта дня',
      'events': '🌌 Астрособытия',
      'mercury': '🪐 Меркурий',
      'favorites': '⭐ Избранное',
      'settings': '🧙‍♂️ Настройки', // 🧙‍♂️ НОВОЕ
      'mentor': '🧙‍♂️ Наставники', // 🧙‍♂️ НОВОЕ
      'quests': '🎯 Квесты Гномов' // 🎯 НОВОЕ
    };
    return titles[currentView] || '🔮 Астро Гном';
  };

  // Навигация между экранами
  const handleNavigate = (view, options = {}) => {
    console.log(`📍 Навигация: ${currentView} -> ${view}`);
    
    // Устанавливаем новый экран
    setCurrentView(view);
    
    // Сохраняем текущий экран
    localStorage.setItem('gnome-current-view', view);
    
    // Safe Telegram API calls с проверкой версии
    const tg = window.Telegram?.WebApp;
    if (tg && tg.BackButton) {
      try {
        if (view === 'zodiac-selector') {
          if (typeof tg.BackButton.hide === 'function') {
            tg.BackButton.hide();
          }
        } else {
          if (typeof tg.BackButton.show === 'function') {
            tg.BackButton.show();
          }
        }
      } catch (e) {
        // Тихо игнорируем ошибки версии
      }
    }
    
    // Safe Haptic feedback
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        // Проверяем версию перед использованием
        const version = tg.version ? parseFloat(tg.version) : 0;
        if (version >= 6.1) {
          tg.HapticFeedback.impactOccurred('light');
        }
      } catch (e) {
        // Тихо игнорируем ошибки версии
      }
    }
  };

  // Кнопка "Назад"
  const handleBack = () => {
    if (currentView === 'horoscope' && selectedSign) {
      handleNavigate('zodiac-selector');
    } else {
      handleNavigate('zodiac-selector');
    }
  };

  // Выбор знака зодиака
  const handleSignSelect = (sign) => {
    console.log('🔮 Выбран знак:', sign);
    setSelectedSign(sign);
    localStorage.setItem('gnome-selected-sign', JSON.stringify(sign));
    handleNavigate('horoscope');
  };

  // Добавление в избранное
  const handleAddToFavorites = (item) => {
    try {
      const newItem = {
        ...item,
        id: item.id || `${item.type}_${Date.now()}`,
        addedAt: new Date().toISOString()
      };
      
      const updatedFavorites = [...favorites, newItem];
      setFavorites(updatedFavorites);
      localStorage.setItem('gnome-favorites', JSON.stringify(updatedFavorites));
      
      console.log('⭐ Добавлено в избранное:', newItem);
      
      // Показываем уведомление в Telegram
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert('✨ Добавлено в избранное!');
      }
      
      // Safe Haptic feedback
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
        try {
          tg.HapticFeedback.notificationOccurred('success');
        } catch (e) {
          // Тихо игнорируем ошибки версии
        }
      }
      
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  // Смена знака зодиака
  const handleSignChange = () => {
    handleNavigate('zodiac-selector');
  };

  // Рендер основного контента
  const renderMainContent = () => {
    switch (currentView) {
      case 'zodiac-selector':
        return (
          <ZodiacCardsSelector
            onSignSelect={handleSignSelect}
            selectedSign={selectedSign}
            showTitle={true}
            compact={false}
          />
        );

      case 'horoscope':
        return (
          <HoroscopeView
            onBack={handleBack}
            selectedSign={selectedSign}
            onSignChange={handleSignChange}
            onAddToFavorites={handleAddToFavorites}
          />
        );

      case 'moon':
        return (
          <MoonView
            onBack={handleBack}
            onAddToFavorites={handleAddToFavorites}
            selectedSign={selectedSign}
          />
        );

      case 'lunar': // 🌙 НОВЫЙ ЛУННЫЙ РАЗДЕЛ
        return (
          <LunarView
            onBack={handleBack}
            onAddToFavorites={handleAddToFavorites}
          />
        );

      case 'compatibility':
        return (
          <CompatibilityView
            onBack={handleBack}
            onAddToFavorites={handleAddToFavorites}
            selectedSign={selectedSign}
          />
        );

      case 'numerology':
        return (
          <NumerologyView
            onBack={handleBack}
            onAddToFavorites={handleAddToFavorites}
            selectedSign={selectedSign}
          />
        );

      case 'events':
        return (
          <AstroEventsView
            onBack={handleBack}
            onAddToFavorites={handleAddToFavorites}
            selectedSign={selectedSign}
          />
        );

      case 'cards':
        return (
          <DayCardView
            onBack={handleBack}
            onAddToFavorites={handleAddToFavorites}
            selectedSign={selectedSign}
          />
        );

      case 'mercury':
        return (
          <MercuryView
            onBack={handleBack}
            onAddToFavorites={handleAddToFavorites}
            selectedSign={selectedSign}
          />
        );

      case 'favorites':
        return (
          <FavoritesView
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        );

      case 'settings': // 🧙‍♂️ НОВЫЙ ЭКРАН НАСТРОЕК
        return (
          <UserSettingsView
            onBack={handleBack}
          />
        );

      case 'mentor': // 🧙‍♂️ НОВЫЕ ГНОМЫ-НАСТАВНИКИ
        return (
          <GnomeMentorView
            onBack={handleBack}
            selectedSign={selectedSign}
            onAddToFavorites={handleAddToFavorites}
          />
        );

      case 'quests': // 🎯 НОВЫЕ КВЕСТЫ ОТ ГНОМОВ
        return (
          <GnomeQuestsView
            onBack={handleBack}
            selectedSign={selectedSign}
            onAddToFavorites={handleAddToFavorites}
          />
        );

      default:
        return (
          <ZodiacCardsSelector
            onSignSelect={handleSignSelect}
            selectedSign={selectedSign}
            showTitle={true}
            compact={false}
          />
        );
    }
  };

  return (
    <ThemeProvider>
      <div className="App">
        {/* ЗВЕЗДНЫЙ ФОН */}
        <StarryBackground />
        
        {/* Экран загрузки */}
        {isLoading && (
          <LoadingScreen 
            message="🔮 Гномы готовят ваш персональный гороскоп..."
            showProgress={true}
          />
        )}
        
        {/* Основное приложение */}
        {!isLoading && (
          <>
            {/* 📶 ИНДИКАТОР СТАТУСА СЕРВЕРА */}
            <ServerStatus />
            
            {/* ✅ ХЕДЕР БЕЗ КНОПКИ МЕНЮ */}
            <Header 
              title={getHeaderTitle()}
              showMenuButton={false}
              showBackButton={currentView !== 'zodiac-selector'}
              onBack={handleBack}
            />

            {/* ✅ КРАСИВОЕ БУРГЕР-МЕНЮ С ВАШИМИ PNG ИКОНКАМИ */}
            <ModernBurgerMenu 
              currentView={currentView}
              onNavigate={handleNavigate}
            />

            {/* Основной контент */}
            <main style={{ 
              marginTop: '60px', 
              minHeight: 'calc(100vh - 60px)', 
              position: 'relative',
              zIndex: 1,
              overflowX: 'hidden',
              paddingBottom: '20px'
            }}>
              {renderMainContent()}
            </main>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default App;