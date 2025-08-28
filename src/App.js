import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeSelector from './components/UI/ThemeSelector';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import HoroscopeView from './components/HoroscopeView';
import ZodiacCarousel from './components/ZodiacCarousel';
import MoonView from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
import DayCardView from './components/DayCardView';
import MercuryView from './components/MercuryView';
import ButtonGrid from './components/ButtonGrid';

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

function AppContent() {
  const { theme, currentTheme } = useTheme(); // ← ДОБАВИЛИ currentTheme для принудительного обновления
  const [currentView, setCurrentView] = useState('home');
  const [selectedSign, setSelectedSign] = useState('Лев');
  const [telegramApp, setTelegramApp] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [forceUpdate, setForceUpdate] = useState(0); // ← Принудительное обновление
  
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('gnome-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      return [];
    }
  });

  // Принудительное обновление при смене темы
  useEffect(() => {
    console.log('🎨 Тема изменилась на:', currentTheme);
    setForceUpdate(prev => prev + 1);
  }, [currentTheme]);

  // Telegram WebApp инициализация
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

  const silentTelegramAction = (action) => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && parseFloat(tg.version) >= 6.1) {
        action(tg);
      }
    } catch (error) {
      console.log('Telegram action error:', error);
    }
  };

  const safeHapticFeedback = (type) => {
    silentTelegramAction((tg) => {
      if (type === 'impact') {
        tg.HapticFeedback.impactOccurred('light');
      } else if (type === 'selection') {
        tg.HapticFeedback.selectionChanged();
      }
    });
  };

  useEffect(() => {
    silentTelegramAction((tg) => {
      if (currentView !== 'home') {
        tg.BackButton.show();
        tg.BackButton.onClick(() => setCurrentView('home'));
      } else {
        tg.BackButton.hide();
      }
    });
  }, [currentView]);

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

  useEffect(() => {
    try {
      localStorage.setItem('gnome-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Ошибка сохранения избранного:', error);
    }
  }, [favorites]);

  const handleButtonClick = (buttonId) => {
    console.log('🔘 Нажата кнопка:', buttonId);
    setCurrentView(buttonId);
    safeHapticFeedback('selection');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleSignSelect = (sign) => {
    setSelectedSign(sign);
    safeHapticFeedback('impact');
  };

  const handleAddToFavorites = (item) => {
    try {
      const exists = favorites.some(fav => 
        fav.type === item.type && 
        fav.title === item.title && 
        fav.date === item.date
      );
      
      if (exists) {
        if (telegramApp) {
          telegramApp.showAlert('Этот элемент уже в избранном!');
        } else {
          alert('Этот элемент уже в избранном!');
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
  };

  const renderCurrentView = () => {
    const viewProps = {
      onAddToFavorites: handleAddToFavorites,
      telegramApp,
      key: `${currentView}-${forceUpdate}` // ← Принудительное обновление компонентов
    };

    switch (currentView) {
      case 'horoscope':
        return (
          <HoroscopeView
            selectedSign={selectedSign}
            onSignSelect={handleSignSelect}
            {...viewProps}
          />
        );
      
      case 'moon':
        return <MoonView {...viewProps} />;
      
      case 'numerology':
        return <NumerologyView {...viewProps} />;
      
      case 'compatibility':
        return <CompatibilityView {...viewProps} />;
      
      case 'cards':
        return <DayCardView {...viewProps} />;
      
      case 'events':
        return <AstroEventsView {...viewProps} />;
      
      case 'mercury':
        return <MercuryView {...viewProps} />;
      
      case 'favorites':
        return (
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Card title="❤️ Избранное" key={`favorites-${forceUpdate}`}>
              {favorites.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <h4>Здесь пока пусто</h4>
                  <p>Добавляйте интересные гороскопы и предсказания в избранное!</p>
                </div>
              ) : (
                <div>
                  <p>Сохранено: <strong>{favorites.length}</strong></p>
                  {favorites.map((item) => (
                    <Card 
                      key={`${item.id}-${forceUpdate}`}
                      title={item.title}
                      style={{ margin: '8px 0' }}
                    >
                      <p style={{ fontSize: '12px', opacity: 0.7, margin: '0 0 8px 0' }}>
                        {item.date}
                      </p>
                      <p style={{ margin: 0 }}>{item.content}</p>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        );
      
      default:
        return (
          <div key={`home-${forceUpdate}`}>
            {/* Заголовок */}
            <Card 
              title="🧙‍♂️ Гномий Гороскоп" 
              subtitle="Магические предсказания от древних гномов"
              key={`header-${forceUpdate}`}
            >
              {!isOnline && (
                <div style={{
                  background: theme.colors.states.warning + '20',
                  color: theme.colors.states.warning,
                  padding: '8px 16px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  marginTop: '10px',
                  display: 'inline-block',
                  border: `1px solid ${theme.colors.states.warning}40`
                }}>
                  📵 Оффлайн режим
                </div>
              )}
            </Card>

            {/* Карточка профиля */}
            <Card 
              title={GNOME_PROFILES[selectedSign]?.name || 'Гном Мудрый'}
              subtitle={GNOME_PROFILES[selectedSign]?.title || 'Мастер предсказаний'}
              key={`profile-${forceUpdate}`}
            >
              <p style={{ ...theme.typography.body, marginBottom: '12px' }}>
                {GNOME_PROFILES[selectedSign]?.desc || 'Древняя мудрость гномов'}
              </p>
              <div style={{
                background: theme.colors.primary + '20',
                color: theme.name === 'wooden' ? theme.colors.primary : theme.colors.primary,
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-block',
                border: `1px solid ${theme.colors.primary}40`
              }}>
                {selectedSign} ({ZODIAC_SIGNS.find(s => s.sign === selectedSign)?.dates})
              </div>
            </Card>

            {/* Карусель знаков */}
            <ZodiacCarousel
              selectedSign={selectedSign}
              onSignChange={handleSignSelect}
              telegramApp={telegramApp}
              key={`zodiac-${forceUpdate}`}
            />

            {/* Сетка кнопок */}
            <ButtonGrid 
              onButtonClick={handleButtonClick} 
              key={`buttons-${forceUpdate}`}
            />
          </div>
        );
    }
  };

  const showFallbackBackButton = currentView !== 'home' && 
    (!telegramApp || !telegramApp.BackButton || parseFloat(telegramApp.version) < 6.1);

  console.log('🎨 App рендерится с темой:', currentTheme, 'forceUpdate:', forceUpdate);

  return (
    <div style={{...theme.container, transition: 'all 0.5s ease'}} key={`app-${forceUpdate}`}>
      {/* Переключатель тем */}
      <ThemeSelector key={`theme-selector-${forceUpdate}`} />

      {showFallbackBackButton && (
        <Button
          variant="ghost"
          onClick={handleBackToHome}
          style={{
            position: 'fixed',
            top: '70px',
            left: '20px',
            zIndex: 1000
          }}
          key={`back-button-${forceUpdate}`}
        >
          ← Назад
        </Button>
      )}
      
      {renderCurrentView()}

      {/* CSS анимации */}
      <style key={`styles-${forceUpdate}`}>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        ${theme.name === 'wooden' ? `
          @keyframes wobble {
            0%, 100% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
          }
          @keyframes carve {
            0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
            50% { transform: scale(1.1) rotate(2deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
        ` : ''}
      `}</style>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
