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
  { id: 'horoscope', label: '🔮 Гороскоп', title: 'Гороскоп на день' },
  { id: 'moon', label: '🌙 Луна', title: 'Лунный календарь' },
  { id: 'compatibility', label: '💕 Совместимость', title: 'Совместимость знаков' },
  { id: 'numerology', label: '🔢 Нумерология', title: 'Число судьбы' },
  { id: 'events', label: '🌌 События', title: 'Астрологические события' },
  { id: 'cards', label: '🃏 Карта дня', title: 'Карта дня' },
  { id: 'mercury', label: '🪐 Меркурий', title: 'Ретроград Меркурия' },
  { id: 'favorites', label: '⭐ Избранное', title: 'Сохраненное' }
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
const useTelegram = () => {
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
      
      // Убираем MainButton так как теперь навигация через нижнее меню
      try {
        if (tg.MainButton) {
          tg.MainButton.hide();
        }
      } catch (error) {
        console.log('Ошибка скрытия MainButton:', error);
      }

      console.log('✅ Telegram WebApp инициализирован');
    }
  }, []);

  return { telegramApp, silentTelegramAction, safeHapticFeedback };
};

// ===== КОМПОНЕНТЫ =====

// 🚀 ПОЛНОЭКРАННЫЙ HEADER НА ВСЮ ШИРИНУ МОБИЛЬНОГО УСТРОЙСТВА
const Header = React.memo(() => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100vw',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '20px 16px',
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '22px',
    zIndex: 100,
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  }}>
    🔮 Гномий Гороскоп
  </div>
));

// 🍔 НИЖНЕЕ БУРГЕР-МЕНЮ ДЛЯ УДОБСТВА
const BottomBurgerMenu = React.memo(({ open, onClose, onNavigate, currentView }) => {
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 998
        }}
        onClick={onClose}
      />

      {/* Нижнее меню */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100vw',
        background: '#1a1a2e',
        zIndex: 999,
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderBottom: 'none',
        maxHeight: '70vh',
        overflowY: 'auto',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Хэндл для перетаскивания */}
        <div style={{
          width: '40px',
          height: '4px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '2px',
          margin: '12px auto 20px auto'
        }} />
        
        <div style={{ padding: '0 20px 20px 20px' }}>
          <div style={{ 
            marginBottom: '24px', 
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Выберите функцию
          </div>

          {MENU_ITEMS.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              style={{
                padding: '16px 20px',
                margin: '8px 0',
                borderRadius: '12px',
                cursor: 'pointer',
                color: '#ffffff',
                backgroundColor: currentView === item.id 
                  ? 'rgba(100, 126, 234, 0.8)' 
                  : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${currentView === item.id 
                  ? 'rgba(100, 126, 234, 1)' 
                  : 'rgba(255, 255, 255, 0.1)'}`,
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>
                  {item.label.split(' ')[0]}
                </span>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {item.label.substring(2)}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255,255,255,0.7)',
                    marginTop: '2px'
                  }}>
                    {item.title}
                  </div>
                </div>
              </div>
              {currentView === item.id && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ffffff'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

// 🏠 ГЛАВНЫЙ ЭКРАН БЕЗ ПЛИТОК
const HomeScreen = React.memo(({ selectedSign, moonData, gnomeProfile, onSignSelect }) => {
  const currentDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ padding: '20px' }}>
      {/* Приветствие */}
      <Card style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h2 style={{ 
          margin: '0 0 12px 0', 
          color: '#ffffff',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          Добро пожаловать!
        </h2>
        <p style={{ 
          color: 'rgba(255,255,255,0.8)', 
          margin: '0 0 16px 0',
          fontSize: '14px'
        }}>
          {currentDate}
        </p>
        <p style={{ 
          color: 'rgba(255,255,255,0.9)', 
          margin: 0,
          fontSize: '16px'
        }}>
          Выберите функцию в меню снизу для начала работы с астрологическими данными
        </p>
      </Card>

      {/* Информация о выбранном знаке */}
      <Card title={`Ваш знак: ${selectedSign} ${ZODIAC_SIGNS.find(z => z.sign === selectedSign)?.emoji || ''}`}>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ color: '#ffffff', margin: '0 0 8px 0' }}>
            {gnomeProfile.name}
          </h3>
          <p style={{ 
            color: 'rgba(100, 126, 234, 1)', 
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            {gnomeProfile.title}
          </p>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            margin: 0,
            fontSize: '14px'
          }}>
            {gnomeProfile.desc}
          </p>
        </div>
        
        <Button 
          onClick={() => onSignSelect && onSignSelect()}
          style={{
            width: '100%',
            background: 'rgba(100, 126, 234, 0.8)',
            border: '1px solid rgba(100, 126, 234, 1)',
            color: '#ffffff'
          }}
        >
          Изменить знак зодиака
        </Button>
      </Card>

      {/* Текущая лунная фаза */}
      {moonData && (
        <Card title="🌙 Сегодняшняя лунная фаза">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', margin: '12px 0' }}>
              {moonData.emoji}
            </div>
            <h3 style={{ color: '#ffffff', margin: '0 0 8px 0' }}>
              {moonData.phase}
            </h3>
            <p style={{ 
              color: 'rgba(255,255,255,0.7)', 
              margin: '0 0 12px 0',
              fontSize: '14px'
            }}>
              Освещенность: {moonData.illumination}%
            </p>
            <p style={{ 
              color: 'rgba(255,255,255,0.6)', 
              margin: 0,
              fontSize: '12px'
            }}>
              {moonData.lunarDay} лунный день
            </p>
          </div>
        </Card>
      )}
    </div>
  );
});

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
function AppContent() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Кастомные хуки
  const [currentView, setCurrentView] = useLocalStorage('gnome-current-view', 'home');
  const [selectedSign, setSelectedSign] = useLocalStorage('gnome-selected-sign', 'Лев');
  const [favorites, setFavorites] = useLocalStorage('gnome-favorites', []);

  const { telegramApp, silentTelegramAction, safeHapticFeedback } = useTelegram();

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
  const handleNavigate = useCallback((viewId) => {
    console.log('🔘 Навигация к:', viewId);
    setCurrentView(viewId);
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
    safeHapticFeedback('selection');
  }, [safeHapticFeedback]);

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
          <div style={{ padding: '20px' }}>
            <Card title="⭐ Избранное">
              {favorites.length > 0 ? (
                <div>
                  {favorites.map(item => (
                    <div key={item.id} style={{ 
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      margin: '12px 0',
                      padding: '16px'
                    }}>
                      <strong style={{ color: '#ffffff' }}>{item.title}</strong>
                      <p style={{ color: 'rgba(255,255,255,0.8)', margin: '8px 0' }}>{item.content}</p>
                      <small style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Добавлено: {new Date(item.addedAt).toLocaleDateString('ru-RU')}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  <h3>Пока что здесь пусто</h3>
                  <p>Добавляйте интересные гороскопы и предсказания в избранное!</p>
                </div>
              )}
            </Card>
          </div>
        );
      default:
        return (
          <HomeScreen 
            selectedSign={selectedSign}
            moonData={astrologyData.moon}
            gnomeProfile={currentGnomeProfile}
            onSignSelect={() => handleNavigate('horoscope')}
          />
        );
    }
  };

  const currentTitle = MENU_ITEMS.find(item => item.id === currentView)?.title || 'Гномий Гороскоп';

  return (
    <div style={{
      background: '#0f0f23',
      minHeight: '100vh',
      position: 'relative',
      paddingTop: '80px', // Отступ для фиксированного хедера
      paddingBottom: '80px' // Отступ для кнопок снизу
    }}>
      {/* Фиксированный хедер на всю ширину */}
      <Header />

      {/* Основной контент */}
      <main>
        {renderCurrentView()}
      </main>

      {/* Нижнее бургер-меню */}
      <BottomBurgerMenu
        open={menuOpen}
        onClose={handleCloseMenu}
        onNavigate={handleNavigate}
        currentView={currentView}
      />

      {/* Кнопка открытия меню снизу */}
      <button
        onClick={handleToggleMenu}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
          zIndex: 100,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateX(-50%) scale(1.1)';
          e.target.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateX(-50%) scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        }}
      >
        {menuOpen ? '×' : '☰'}
      </button>

      {/* Back Button - показывается только не на главной странице */}
      <BackButton
        show={currentView !== 'home'}
        onClick={handleBackToHome}
      />

      {/* Индикатор офлайн */}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ff6b6b',
          color: '#ffffff',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
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
