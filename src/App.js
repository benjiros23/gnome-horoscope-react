import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ThemeSelector from './components/UI/ThemeSelector';
import Card from './components/UI/Card';
import Button from './components/UI/Button';
import BackButton from './components/UI/BackButton';
import HoroscopeView from './components/HoroscopeView';
import ZodiacCardsSelector from './components/ZodiacCardsSelector'; // 🚀 ЗАМЕНИЛИ на новый компонент
import MoonView from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
import DayCardView from './components/DayCardView';
import MercuryView from './components/MercuryView';
import ButtonGrid from './components/ButtonGrid';
import BentoGrid from './components/BentoGrid';

// 🚀 НОВЫЕ ИМПОРТЫ для актуальных данных
import { EnhancedMoonPhase } from './enhanced_moonPhase';
import { useAstrologyData } from './hooks/useAstrologyData';

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
  const { theme, currentTheme } = useTheme();

  // 🚀 ХУК для актуальных астрологических данных
  const astrologyData = useAstrologyData({
    autoUpdate: true,
    updateInterval: 6 * 60 * 60 * 1000, // 6 часов
    coordinates: { lat: 55.7558, lng: 37.6173 }, // Москва
    enableHoroscope: false
  });

  // Состояние приложения
  const [currentView, setCurrentView] = useState(() => {
    try {
      const savedView = localStorage.getItem('gnome-current-view');
      return savedView || 'home';
    } catch (error) {
      console.error('Ошибка загрузки сохраненного view:', error);
      return 'home';
    }
  });

  const [selectedSign, setSelectedSign] = useState(() => {
    try {
      const savedSign = localStorage.getItem('gnome-selected-sign');
      return savedSign || 'Лев';
    } catch (error) {
      console.error('Ошибка загрузки сохраненного знака:', error);
      return 'Лев';
    }
  });

  const [telegramApp, setTelegramApp] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('gnome-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      return [];
    }
  });

  // 🚀 ИНИЦИАЛИЗАЦИЯ SunCalc при загрузке приложения
  useEffect(() => {
    const initSunCalc = () => {
      if (typeof window !== 'undefined' && window.SunCalc) {
        console.log('✅ SunCalc готов к использованию');
        const debugInfo = EnhancedMoonPhase.debugInfo();
        console.log('🌙 Enhanced MoonPhase status:', debugInfo);
      } else {
        console.warn('⚠️ SunCalc не загружен. Добавьте скрипт в index.html');
      }
    };
    setTimeout(initSunCalc, 1000);
  }, []);

  // Эффекты для сохранения состояния
  useEffect(() => {
    try {
      localStorage.setItem('gnome-current-view', currentView);
      console.log('💾 Сохранен view:', currentView);
    } catch (error) {
      console.error('Ошибка сохранения view:', error);
    }
  }, [currentView]);

  useEffect(() => {
    try {
      localStorage.setItem('gnome-selected-sign', selectedSign);
      console.log('💾 Сохранен знак:', selectedSign);
    } catch (error) {
      console.error('Ошибка сохранения знака:', error);
    }
  }, [selectedSign]);

  useEffect(() => {
    console.log('🎨 Тема изменилась на:', currentTheme);
    setForceUpdate(prev => prev + 1);
  }, [currentTheme]);

  useEffect(() => {
    if (astrologyData.moon) {
      console.log('🌙 Актуальные лунные данные обновлены:', {
        phase: astrologyData.moon.phase,
        source: astrologyData.source,
        lastUpdated: astrologyData.lastUpdated
      });
    }
  }, [astrologyData.moon, astrologyData.lastUpdated]);

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

  // Утилиты для Telegram
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

  // Обработчики сети
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

  // Обработчики событий
  const handleButtonClick = (buttonId) => {
    console.log('🔘 Нажата кнопка:', buttonId);
    setCurrentView(buttonId);
    safeHapticFeedback('selection');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    try {
      localStorage.setItem('gnome-current-view', 'home');
    } catch (error) {
      console.error('Ошибка сохранения home view:', error);
    }
  };

  // 🚀 ОБНОВЛЕННЫЙ обработчик выбора знака для ZodiacCardsSelector
  const handleSignSelect = (sign) => {
    console.log('🌟 Выбран знак:', sign);
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

  // 🚀 ОБНОВЛЕННЫЙ рендер с новым ZodiacCardsSelector
  const renderCurrentView = () => {
    const viewProps = {
      onAddToFavorites: handleAddToFavorites,
      telegramApp,
      key: `${currentView}-${forceUpdate}`,
      astrologyData,
      enhancedMoonPhase: EnhancedMoonPhase
    };

    switch (currentView) {
      case 'horoscope':
        return (
          <Card title="🔮 Гороскоп" subtitle="Ваш персональный гороскоп на сегодня">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              <span>Сохранено: <strong>{favorites.filter(f => f.type === 'horoscope').length}</strong></span>
              {astrologyData.lastUpdated && (
                <span style={{ fontSize: '12px', opacity: 0.7 }}>
                  Обновлено: {astrologyData.lastUpdated.toLocaleTimeString('ru-RU')}
                </span>
              )}
            </div>

            {/* 🚀 ЗАМЕНИЛИ ZodiacCarousel на ZodiacCardsSelector */}
            <ZodiacCardsSelector 
              selectedSign={selectedSign}
              onSignSelect={handleSignSelect}
              showHero={true}
            />
            
            <HoroscopeView 
              selectedSign={selectedSign} 
              gnomeProfile={GNOME_PROFILES[selectedSign]}
              {...viewProps}
            />
          </Card>
        );

      case 'moon':
        return (
          <Card title="🌙 Лунный календарь" subtitle="Следите за фазами луны и получайте советы гномов">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              <span>Сохранено: <strong>{favorites.filter(f => f.type === 'moon').length}</strong></span>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                {astrologyData.loading ? (
                  <span>🔄 Обновление...</span>
                ) : astrologyData.source ? (
                  <span>✅ Источник: {astrologyData.source}</span>
                ) : null}
              </div>
            </div>

            <MoonView 
              {...viewProps}
              realTimeMoonData={astrologyData.moon}
              onRefreshMoonData={astrologyData.refresh}
            />
          </Card>
        );

      case 'compatibility':
        return (
          <Card title="💕 Совместимость знаков" subtitle="Узнайте совместимость между знаками зодиака">
            <CompatibilityView {...viewProps} />
          </Card>
        );

      case 'numerology':
        return (
          <Card title="🔢 Нумерология" subtitle="Откройте тайны чисел вашей судьбы">
            <NumerologyView {...viewProps} />
          </Card>
        );

      case 'events':
        return (
          <Card title="🌌 Астрологические события" subtitle="Важные астрономические события и их влияние">
            <AstroEventsView {...viewProps} />
          </Card>
        );

      case 'cards':
        return (
          <Card title="🃏 Карта дня" subtitle="Получите совет и предсказание на сегодня">
            <DayCardView {...viewProps} />
          </Card>
        );

      case 'mercury':
        return (
          <Card title="🪐 Меркурий в ретрограде" subtitle="Влияние ретроградного Меркурия на вашу жизнь">
            <MercuryView {...viewProps} />
          </Card>
        );

      case 'favorites':
        return (
          <Card title="⭐ Избранное" subtitle="Ваши сохраненные гороскопы и предсказания">
            <div style={{ minHeight: '200px' }}>
              {favorites.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px 20px',
                  color: theme.colors.textSecondary 
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📫</div>
                  <p>Пока что здесь пусто</p>
                  <p style={{ fontSize: '14px' }}>
                    Добавляйте интересные гороскопы и предсказания в избранное!
                  </p>
                </div>
              ) : (
                <div>
                  {favorites.map((item, index) => (
                    <div 
                      key={item.id || index}
                      style={{
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '8px',
                        backgroundColor: theme.colors.surface
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '8px' 
                      }}>
                        <span style={{ fontWeight: '600' }}>{item.title}</span>
                        <span style={{ fontSize: '12px', opacity: 0.7 }}>
                          {item.date}
                        </span>
                      </div>
                      <p style={{ 
                        margin: 0, 
                        fontSize: '14px', 
                        lineHeight: '1.4',
                        color: theme.colors.text 
                      }}>
                        {item.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        );

      default:
        return (
          <div>
            {/* Заголовок приложения */}
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '32px',
              padding: '20px 16px'
            }}>
              <h1 style={{ 
                fontSize: '32px', 
                margin: '0 0 12px 0',
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                🧙‍♂️ Астро Гном
              </h1>
              <p style={{ 
                fontSize: '18px', 
                margin: 0, 
                opacity: 0.8,
                color: theme.colors.textSecondary
              }}>
                {GNOME_PROFILES[selectedSign]?.desc || 'Древняя мудрость гномов'}
              </p>
            </div>

            {/* 🚀 НОВЫЙ ZodiacCardsSelector на главной */}
            <div style={{ marginBottom: '24px' }}>
              <ZodiacCardsSelector 
                selectedSign={selectedSign}
                onSignSelect={handleSignSelect}
                showHero={true}
              />
            </div>
            
            {/* Bento-сетка */}
            <BentoGrid 
              astrologyData={astrologyData}
              selectedSign={selectedSign}
              gnomeProfiles={GNOME_PROFILES}
              onButtonClick={handleButtonClick}
              onSignSelect={handleSignSelect}
            />
          </div>
        );
    }
  };

  return (
    <div style={{
      ...theme.container,
      position: 'relative',
      minHeight: '100vh',
      paddingBottom: '20px'
    }}>
      <ThemeSelector />
      
      {currentView !== 'home' && (
        <BackButton 
          onClick={handleBackToHome}
          style={{ 
            position: 'fixed',
            top: '20px',
            left: '20px',
            zIndex: 999
          }}
        />
      )}
      
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          backgroundColor: theme.colors.danger,
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          fontSize: '14px',
          zIndex: 1001
        }}>
          🔌 Нет подключения к интернету
        </div>
      )}

      <div style={{
        padding: '80px 16px 20px 16px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {renderCurrentView()}
      </div>
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
