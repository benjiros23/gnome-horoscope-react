import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Импорты компонентов
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import BackButton from './components/UI/BackButton';
import HoroscopeView from './components/HoroscopeView';
import ZodiacCardsSelector from './components/ZodiacCardsSelector';
import MoonView from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
import DayCardView from './components/DayCardView';
import MercuryView from './components/MercuryView';
import ButtonGrid from './components/ButtonGrid';
import BentoGrid from './components/BentoGrid';
import LoadingScreen from './components/LoadingScreen';

// Хуки и утилиты
import { EnhancedMoonPhase } from './enhanced_moonPhase';
import { useAstrologyData } from './hooks/useAstrologyData';

// ===== КОНСТАНТЫ =====
const ZODIAC_SIGNS = [
  { sign: 'Овен', emoji: '♈', dates: '21.03-20.04' },
  { sign: 'Телец', emoji: '♉', dates: '21.04-20.05' },
  { sign: 'Близнецы', emoji: '♊', dates: '21.05-21.06' },
  { sign: 'Рак', emoji: '♋', dates: '22.06-22.07' },
  { sign: 'Лев', emoji: '♌', dates: '23.07-22.08' },
  { sign: 'Дева', emoji: '♍', dates: '23.08-22.09' },
  { sign: 'Весы', emoji: '♎', dates: '23.09-22.10' },
  { sign: 'Скорпион', emoji: '♏', dates: '23.10-22.11' },
  { sign: 'Стрелец', emoji: '♐', dates: '23.11-21.12' },
  { sign: 'Козерог', emoji: '♑', dates: '22.12-20.01' },
  { sign: 'Водолей', emoji: '♒', dates: '21.01-19.02' },
  { sign: 'Рыбы', emoji: '♓', dates: '20.02-20.03' }
];

const GNOME_PROFILES = {
  'Овен': { name: 'Гном Огнебород', title: 'Боевой кузнец', desc: 'Смелый, активный, любит приключения' },
  'Телец': { name: 'Гном Златоруд', title: 'Мастер сокровищ', desc: 'Упорный, надежный, ценит комфорт' },
  'Близнецы': { name: 'Гном Двойняшка', title: 'Мудрый летописец', desc: 'Любознательный, общительный' },
  'Рак': { name: 'Гном Домовой', title: 'Хранитель очага', desc: 'Заботливый, чувствительный' },
  'Лев': { name: 'Гном Златогрив', title: 'Королевский советник', desc: 'Гордый, щедрый, любит внимание' },
  'Дева': { name: 'Гном Аккуратный', title: 'Мастер точности', desc: 'Практичный, внимательный к деталям' },
  'Весы': { name: 'Гном Справедливый', title: 'Мирный судья', desc: 'Дипломатичный, ищет баланс' },
  'Скорпион': { name: 'Гном Тайновед', title: 'Хранитель секретов', desc: 'Глубокий, интуитивный' },
  'Стрелец': { name: 'Гном Путешественник', title: 'Искатель приключений', desc: 'Свободолюбивый, оптимистичный' },
  'Козерог': { name: 'Гном Горовосходитель', title: 'Мастер достижений', desc: 'Целеустремленный, терпеливый' },
  'Водолей': { name: 'Гном Изобретатель', title: 'Новатор будущего', desc: 'Независимый, оригинальный' },
  'Рыбы': { name: 'Гном Мечтатель', title: 'Морской волшебник', desc: 'Творческий, эмпатичный' }
};

const MENU_ITEMS = [
  { id: 'home', label: '🏠 Главная' },
  { id: 'horoscope', label: '🔮 Гороскоп' },
  { id: 'moon', label: '🌙 Лунный календарь' },
  { id: 'compatibility', label: '💕 Совместимость' },
  { id: 'numerology', label: '🔢 Нумерология' },
  { id: 'events', label: '🌌 События' },
  { id: 'cards', label: '🃏 Карта дня' },
  { id: 'mercury', label: '🪐 Меркурий' },
  { id: 'favorites', label: '⭐ Избранное' }
];

// ===== КАСТОМНЫЕ ХУКИ =====

// Хук для localStorage с обработкой ошибок
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Ошибка загрузки ${key}:`, error);
      return defaultValue;
    }
  });

  const updateValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
      console.log(`💾 Сохранен ${key}:`, newValue);
    } catch (error) {
      console.error(`Ошибка сохранения ${key}:`, error);
    }
  }, [key]);

  return [value, updateValue];
};

// Хук для Telegram WebApp
const useTelegram = (theme) => {
  const [telegramApp, setTelegramApp] = useState(null);

  const silentTelegramAction = useCallback((action) => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && parseFloat(tg.version) >= 6.1) {
        action(tg);
      }
    } catch (error) {
      console.log('Telegram action error:', error);
    }
  }, []);

  const safeHapticFeedback = useCallback((type) => {
    silentTelegramAction((tg) => {
      if (type === 'impact') {
        tg.HapticFeedback.impactOccurred('light');
      } else if (type === 'selection') {
        tg.HapticFeedback.selectionChanged();
      }
    });
  }, [silentTelegramAction]);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setTelegramApp(tg);
      tg.ready();
      tg.expand();

      try {
        if (tg.MainButton) {
          tg.MainButton.setText('🃏 Получить карту дня');
          tg.MainButton.color = theme.colors.primary;
          tg.MainButton.show();
          tg.MainButton.onClick(() => setCurrentView('cards'));
        }
      } catch (error) {
        console.log('Ошибка MainButton:', error);
      }

      console.log('✅ Telegram WebApp инициализирован');
    }
  }, [theme.colors.primary]);

  return { telegramApp, silentTelegramAction, safeHapticFeedback };
};

// ===== КОМПОНЕНТЫ =====

// Header компонент
const Header = React.memo(() => (
  <div style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '24px',
    marginBottom: '20px'
  }}>
    🔮 Гномий Гороскоп
  </div>
));

// BurgerMenu компонент
const BurgerMenu = React.memo(({ open, onClose, onNavigate, theme, currentView }) => {
  const handleItemClick = useCallback((id) => {
    onNavigate(id);
    onClose();
  }, [onNavigate, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 998
        }}
        onClick={onClose}
      />

      {/* Menu */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '280px',
        height: '100vh',
        background: theme.card.background,
        zIndex: 999,
        padding: '20px',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.1)',
        borderLeft: `1px solid ${theme.colors.border}`,
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h3 style={{ color: theme.card.color, margin: 0 }}>Меню</h3>
        </div>

        {MENU_ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            style={{
              padding: '15px 20px',
              margin: '5px 0',
              borderRadius: '12px',
              cursor: 'pointer',
              color: theme.card.color,
              backgroundColor: currentView === item.id ? theme.colors.primary : 'transparent',
              border: `1px solid ${currentView === item.id ? theme.colors.primary : theme.colors.border}`,
              transition: 'all 0.2s ease'
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </>
  );
});

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
function AppContent() {
  const { theme, currentTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Кастомные хуки
  const [currentView, setCurrentView] = useLocalStorage('gnome-current-view', 'home');
  const [selectedSign, setSelectedSign] = useLocalStorage('gnome-selected-sign', 'Лев');
  const [favorites, setFavorites] = useLocalStorage('gnome-favorites', []);

  const { telegramApp, silentTelegramAction, safeHapticFeedback } = useTelegram(theme);

  // Астрологические данные
  const astrologyData = useAstrologyData({
    autoUpdate: true,
    updateInterval: 6 * 60 * 60 * 1000, // 6 часов
    coordinates: { lat: 55.7558, lng: 37.6173 }, // Москва
    enableHoroscope: false
  });

  // ===== MEMOIZED VALUES =====
  const currentGnomeProfile = useMemo(() => {
    return GNOME_PROFILES[selectedSign] || GNOME_PROFILES['Лев'];
  }, [selectedSign]);

  // ===== EFFECTS =====

  // Инициализация SunCalc
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.SunCalc) {
        console.log('✅ SunCalc готов к использованию');
        const debugInfo = EnhancedMoonPhase.debugInfo();
        console.log('🌙 Enhanced MoonPhase status:', debugInfo);
      } else {
        console.warn('⚠️ SunCalc не загружен. Добавьте скрипт в index.html');
      }
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Отслеживание изменения темы
  useEffect(() => {
    console.log('🎨 Тема изменилась на:', currentTheme);
    setForceUpdate(prev => prev + 1);
  }, [currentTheme]);

  // Логирование лунных данных
  useEffect(() => {
    if (astrologyData.moon) {
      console.log('🌙 Актуальные лунные данные обновлены:', {
        phase: astrologyData.moon.phase,
        source: astrologyData.source,
        lastUpdated: astrologyData.lastUpdated
      });
    }
  }, [astrologyData.moon, astrologyData.lastUpdated]);

  // Управление Telegram BackButton
  useEffect(() => {
    silentTelegramAction((tg) => {
      if (currentView !== 'home') {
        tg.BackButton.show();
        tg.BackButton.onClick(() => setCurrentView('home'));
      } else {
        tg.BackButton.hide();
      }
    });
  }, [currentView, silentTelegramAction, setCurrentView]);

  // Отслеживание онлайн статуса
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ===== HANDLERS =====
  const handleButtonClick = useCallback((buttonId) => {
    console.log('🔘 Нажата кнопка:', buttonId);
    setCurrentView(buttonId);
    safeHapticFeedback('selection');
  }, [setCurrentView, safeHapticFeedback]);

  const handleBackToHome = useCallback(() => {
    setCurrentView('home');
  }, [setCurrentView]);

  const handleSignSelect = useCallback((sign) => {
    console.log('🌟 Выбран знак:', sign);
    setSelectedSign(sign);
    safeHapticFeedback('impact');
  }, [setSelectedSign, safeHapticFeedback]);

  const handleAddToFavorites = useCallback((item) => {
    try {
      const exists = favorites.some(fav => 
        fav.type === item.type && 
        fav.title === item.title && 
        fav.date === item.date
      );

      if (exists) {
        const message = 'Этот элемент уже в избранном!';
        if (telegramApp) {
          telegramApp.showAlert(message);
        } else {
          alert(message);
        }
        return;
      }

      const newItem = {
        ...item,
        id: Date.now() + Math.random(),
        addedAt: new Date().toISOString()
      };

      setFavorites(prev => {
        const updated = [newItem, ...prev];
        return updated.length > 50 ? updated.slice(0, 50) : updated;
      });

      safeHapticFeedback('impact');
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  }, [favorites, telegramApp, setFavorites, safeHapticFeedback]);

  const handleToggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  // ===== RENDER =====
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderCurrentView = () => {
    const commonProps = {
      selectedSign,
      onSignSelect: handleSignSelect,
      onAddToFavorites: handleAddToFavorites,
      moonData: astrologyData.moon,
      isOnline,
      gnomeProfile: currentGnomeProfile
    };

    switch (currentView) {
      case 'horoscope':
        return <HoroscopeView {...commonProps} />;
      case 'moon':
        return <MoonView {...commonProps} />;
      case 'compatibility':
        return <CompatibilityView {...commonProps} />;
      case 'numerology':
        return <NumerologyView {...commonProps} />;
      case 'events':
        return <AstroEventsView {...commonProps} />;
      case 'cards':
        return <DayCardView {...commonProps} />;
      case 'mercury':
        return <MercuryView {...commonProps} />;
      case 'favorites':
        return (
          <Card title="⭐ Избранное">
            {favorites.length > 0 ? (
              <div>
                {favorites.map(item => (
                  <div key={item.id} style={{ 
                    ...theme.card,
                    margin: '10px 0',
                    padding: '15px'
                  }}>
                    <strong>{item.title}</strong>
                    <p>{item.content}</p>
                    <small>Добавлено: {new Date(item.addedAt).toLocaleDateString('ru-RU')}</small>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                color: theme.colors.textSecondary
              }}>
                <h3>Пока что здесь пусто</h3>
                <p>Добавляйте интересные гороскопы и предсказания в избранное!</p>
              </div>
            )}
          </Card>
        );
      default:
        return (
          <div>
            <Header />
            <BentoGrid 
              moonData={astrologyData.moon}
              selectedSign={selectedSign}
              gnomeProfile={currentGnomeProfile}
              onButtonClick={handleButtonClick}
              isOnline={isOnline}
            />
            <ButtonGrid onButtonClick={handleButtonClick} />
          </div>
        );
    }
  };

  return (
    <div style={{
      ...theme.container,
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Burger Menu Toggle */}
      <button
        onClick={handleToggleMenu}
        style={{
          position: 'fixed',
          top: '15px',
          right: '15px',
          zIndex: 1000,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: theme.colors.primary,
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}
      >
        {menuOpen ? '×' : '☰'}
      </button>

      {/* Burger Menu */}
      <BurgerMenu
        open={menuOpen}
        onClose={handleCloseMenu}
        onNavigate={setCurrentView}
        theme={theme}
        currentView={currentView}
      />

      {/* Main Content */}
      <main style={{ 
        padding: currentView === 'home' ? '0' : '20px',
        paddingTop: currentView === 'home' ? '0' : '80px'
      }}>
        {renderCurrentView()}
      </main>

      {/* Back Button */}
      <BackButton
        show={currentView !== 'home'}
        onClick={handleBackToHome}
      />

      {/* Offline Indicator */}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          bottom: currentView !== 'home' ? '100px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ff6b6b',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          zIndex: 1000
        }}>
          📡 Офлайн режим
        </div>
      )}
    </div>
  );
}

// ===== MAIN APP WITH PROVIDERS =====
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
export { ZODIAC_SIGNS, GNOME_PROFILES };
