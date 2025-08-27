import React, { useState, useEffect } from 'react';
// Импортируем только СУЩЕСТВУЮЩИЕ компоненты
import HoroscopeView from './components/HoroscopeView';
import ZodiacCarousel from './components/ZodiacCarousel';
import MoonView from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
import DayCardView from './components/DayCardView';
import MercuryView from './components/MercuryView';
import ButtonGrid from './components/ButtonGrid';
import { pixelTheme, pixelStyles } from './styles/pixelTheme';
import './App.css';

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

function App() {
  // ВСЕ ХУКИ В НАЧАЛЕ КОМПОНЕНТА
  const [currentView, setCurrentView] = useState('home');
  const [selectedSign, setSelectedSign] = useState('Лев');
  const [telegramApp, setTelegramApp] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Состояние избранного
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('gnome-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      return [];
    }
  });

  // Telegram WebApp интеграция
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setTelegramApp(tg);
      tg.ready();
      tg.expand();
      
      try {
        // Настройка главной кнопки
        tg.MainButton.setText('🃏 Получить карту дня');
        tg.MainButton.color = '#8BC34A';
        tg.MainButton.show();
        
        // Обработчик главной кнопки
        tg.MainButton.onClick(() => {
          setCurrentView('cards');
        });
      } catch (error) {
        console.log('MainButton недоступен:', error.message);
      }
      
      console.log('✅ Telegram WebApp инициализирован');
    } else {
      console.log('🔧 Работаем в браузере (демо-режим)');
    }
  }, []);

  // Обновляем состояние Back Button
  useEffect(() => {
    if (telegramApp?.BackButton) {
      try {
        if (currentView !== 'home') {
          telegramApp.BackButton.show();
          telegramApp.BackButton.onClick(() => {
            setCurrentView('home');
          });
        } else {
          telegramApp.BackButton.hide();
        }
      } catch (error) {
        console.log('BackButton недоступен:', error.message);
      }
    }
  }, [currentView, telegramApp]);

  // Отслеживание статуса сети
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

  // Сохранение избранного в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gnome-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Ошибка сохранения избранного:', error);
    }
  }, [favorites]);

  // ОБРАБОТЧИКИ СОБЫТИЙ
  const handleButtonClick = (buttonId) => {
    console.log('Выбрана функция:', buttonId);
    setCurrentView(buttonId);
    
    // Haptic feedback для Telegram
    if (telegramApp?.HapticFeedback) {
      try {
        telegramApp.HapticFeedback.selectionChanged();
      } catch (error) {
        console.log('Haptic feedback недоступен');
      }
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleSignSelect = (sign) => {
    setSelectedSign(sign);
    console.log(`Выбран знак: ${sign}`);
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
      
      if (telegramApp?.HapticFeedback) {
        try {
          telegramApp.HapticFeedback.impactOccurred('light');
        } catch (error) {
          console.log('Haptic feedback недоступен');
        }
      }
      
      console.log('✅ Добавлено в избранное:', newItem);
      
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
    }
  };

  const handleRemoveFromFavorites = (itemId) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId));
  };

  const handleClearFavorites = () => {
    if (telegramApp) {
      telegramApp.showConfirm('Удалить все избранные элементы?', (confirmed) => {
        if (confirmed) {
          setFavorites([]);
        }
      });
    } else {
      if (window.confirm('Удалить все избранные элементы?')) {
        setFavorites([]);
      }
    }
  };

  // СТИЛИ
const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: pixelTheme.colors.background,
    padding: '0',
    fontFamily: pixelTheme.fonts.pixel,
    imageRendering: 'pixelated'
  },
  
  backButton: {
    position: 'fixed',
    top: pixelTheme.spacing.lg,
    left: pixelTheme.spacing.lg,
    ...pixelStyles.button,
    backgroundColor: pixelTheme.colors.brown,
    color: pixelTheme.colors.white,
    padding: `${pixelTheme.spacing.sm} ${pixelTheme.spacing.md}`,
    fontSize: pixelTheme.fonts.size.small,
    zIndex: 1000,
    letterSpacing: '1px'
  },
  
  header: {
    textAlign: 'center',
    padding: pixelTheme.spacing.xl,
    backgroundColor: pixelTheme.colors.forest,
    margin: pixelTheme.spacing.lg,
    ...pixelStyles.card
  },
  
  title: {
    color: pixelTheme.colors.white,
    fontSize: pixelTheme.fonts.size.huge,
    fontWeight: 'bold',
    marginBottom: pixelTheme.spacing.sm,
    textShadow: '2px 2px 0px #000000',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  },
  
  subtitle: {
    color: pixelTheme.colors.background,
    fontSize: pixelTheme.fonts.size.small,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  
  offlineBadge: {
    backgroundColor: pixelTheme.colors.amber,
    color: pixelTheme.colors.white,
    padding: `${pixelTheme.spacing.xs} ${pixelTheme.spacing.md}`,
    borderRadius: '4px',
    fontSize: pixelTheme.fonts.size.tiny,
    marginTop: pixelTheme.spacing.md,
    display: 'inline-block',
    fontWeight: 'bold',
    border: pixelTheme.effects.pixelBorder,
    boxShadow: pixelTheme.effects.pixelShadow,
    textTransform: 'uppercase'
  }
};

  // РЕНДЕР ТЕКУЩЕГО ЭКРАНА
  const renderCurrentView = () => {
    switch (currentView) {
      case 'horoscope':
        return (
          <HoroscopeView
            selectedSign={selectedSign}
            onSignSelect={handleSignSelect}
            onAddToFavorites={handleAddToFavorites}
            telegramApp={telegramApp}
          />
        );
      
      case 'moon':
        return (
          <MoonView
            onAddToFavorites={handleAddToFavorites}
            telegramApp={telegramApp}
          />
        );
      
      case 'numerology':
        return (
          <NumerologyView
            onAddToFavorites={handleAddToFavorites}
            telegramApp={telegramApp}
          />
        );
      
      case 'compatibility':
        return (
          <CompatibilityView
            onAddToFavorites={handleAddToFavorites}
            telegramApp={telegramApp}
          />
        );
      
      case 'cards':
        return (
          <DayCardView
            onAddToFavorites={handleAddToFavorites}
            telegramApp={telegramApp}
          />
        );
      
      case 'events':
        return (
          <AstroEventsView
            onAddToFavorites={handleAddToFavorites}
            telegramApp={telegramApp}
          />
        );
      
      case 'mercury':
        return (
          <MercuryView
            onAddToFavorites={handleAddToFavorites}
            telegramApp={telegramApp}
          />
        );
      
      case 'favorites':
        return (
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ color: '#8BC34A', textAlign: 'center', marginBottom: '20px' }}>
              ❤️ Избранное
            </h3>
            
            {favorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                <h4>Здесь пока пусто</h4>
                <p>Добавляйте интересные гороскопы и предсказания в избранное!</p>
              </div>
            ) : (
              <>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '20px' 
                }}>
                  <p>Сохранено: <strong>{favorites.length}</strong></p>
                  <button 
                    onClick={handleClearFavorites}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Очистить
                  </button>
                </div>
                
                <div>
                  {favorites.map((item) => (
                    <div 
                      key={item.id} 
                      style={{
                        background: 'white',
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        marginBottom: '8px'
                      }}>
                        <h5 style={{ margin: 0, color: '#333' }}>{item.title}</h5>
                        <button 
                          onClick={() => handleRemoveFromFavorites(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: '#dc3545'
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                        {item.date}
                      </p>
                      <p style={{ margin: 0, color: '#333' }}>{item.content}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      
      case 'advice':
        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#8BC34A' }}>🚧 Совет дня</h3>
            <p>Этот раздел находится в разработке...</p>
            <p>📱 Подключение к API готово</p>
            <p>🔗 Скоро будет доступен</p>
          </div>
        );
      
      default:
        return (
          <div>
            {/* Заголовок */}
            <div style={styles.header}>
              <h1 style={styles.title}>🧙‍♂️ Гномий Гороскоп</h1>
              <p style={styles.subtitle}>Магические предсказания от древних гномов</p>
              {!isOnline && (
                <div style={styles.offlineBadge}>
                  📵 Оффлайн режим
                </div>
              )}
            </div>

            {/* Карточка профиля */}
            <div style={{
              background: 'white',
              margin: '20px',
              padding: '20px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h2 style={{ color: '#8BC34A', marginBottom: '8px' }}>
                {GNOME_PROFILES[selectedSign]?.name || 'Гном Мудрый'}
              </h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                {GNOME_PROFILES[selectedSign]?.title || 'Мастер предсказаний'}
              </p>
              <p style={{ color: '#333', marginBottom: '12px' }}>
                {GNOME_PROFILES[selectedSign]?.desc || 'Древняя мудрость гномов'}
              </p>
              <span style={{
                background: 'linear-gradient(135deg, #8BC34A, #FFC107)',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '12px'
              }}>
                {selectedSign} ({ZODIAC_SIGNS.find(s => s.sign === selectedSign)?.dates})
              </span>
            </div>

            {/* Карусель знаков */}
            {ZodiacCarousel && (
              <ZodiacCarousel
                selectedSign={selectedSign}
                onSignChange={handleSignSelect}
                telegramApp={telegramApp}
              />
            )}

            {/* Сетка кнопок */}
            <ButtonGrid onButtonClick={handleButtonClick} />
          </div>
        );
    }
  };

  return (
    <div style={styles.app}>
      {currentView !== 'home' && (
        <button style={styles.backButton} onClick={handleBackToHome}>
          ← Назад в главное меню
        </button>
      )}
      
      {renderCurrentView()}
    </div>
  );
}

export default App;
