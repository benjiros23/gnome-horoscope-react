import React, { useState, useEffect } from 'react';
import HoroscopeView from './components/HoroscopeView';
import ZodiacCarousel from './components/ZodiacCarousel';
import MoonView from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
import DayCardView from './components/DayCardView';
import MercuryView from './components/MercuryView';
import ButtonGrid from './components/ButtonGrid';
import GlassCard from './components/GlassCard';
import WoodenCard from './components/WoodenCard';
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
  const [currentView, setCurrentView] = useState('home');
  const [selectedSign, setSelectedSign] = useState('Лев');
  const [telegramApp, setTelegramApp] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [designTheme, setDesignTheme] = useState('glass'); // 'glass' или 'wooden'
  
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('gnome-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      return [];
    }
  });

  // Безопасные функции Telegram
  const silentTelegramAction = (action) => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg && parseFloat(tg.version) >= 6.1) {
        action(tg);
      }
    } catch (error) {
      // Тихо игнорируем ошибки
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
          tg.MainButton.color = '#8BC34A';
          tg.MainButton.show();
          tg.MainButton.onClick(() => setCurrentView('cards'));
        }
      } catch (error) {
        // Игнорируем ошибки
      }
      
      console.log('✅ Telegram WebApp инициализирован (версия:', tg.version + ')');
    }
  }, []);

  // BackButton
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
    console.log('Выбрана функция:', buttonId);
    setCurrentView(buttonId);
    safeHapticFeedback('selection');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  const handleSignSelect = (sign) => {
    setSelectedSign(sign);
    safeHapticFeedback('impact');
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
      
      safeHapticFeedback('impact');
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

  // Выбор компонента карточки
  const Card = designTheme === 'wooden' ? WoodenCard : GlassCard;

  const styles = {
    app: {
      minHeight: '100vh',
      background: designTheme === 'wooden' 
        ? 'linear-gradient(135deg, #8b4513 0%, #d2691e 50%, #cd853f 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '0',
      fontFamily: 'system-ui, sans-serif'
    },
    backButton: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: designTheme === 'wooden'
        ? 'linear-gradient(135deg, #8b4513, #a0522d)'
        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
      color: 'white',
      border: designTheme === 'wooden' ? '2px solid #654321' : '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '12px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: 1000,
      backdropFilter: designTheme === 'wooden' ? 'none' : 'blur(10px)'
    },
    themeToggle: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '50px',
      padding: '8px 16px',
      color: 'white',
      fontSize: '12px',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      zIndex: 1000
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'horoscope':
  return (
    <HoroscopeView
      selectedSign={selectedSign}
      onSignSelect={handleSignSelect}
      onAddToFavorites={handleAddToFavorites}
      telegramApp={telegramApp}
      designTheme={designTheme} // Добавить эту строку
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
      designTheme={designTheme} // Добавить эту строку
    />
  );
      
      case 'favorites':
        return (
          <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Card title="❤️ Избранное">
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
                      <Card 
                        key={item.id}
                        title={item.title}
                        style={{ margin: '8px 0' }}
                      >
                        <p style={{ fontSize: '12px', color: '#666', margin: '0 0 8px 0' }}>
                          {item.date}
                        </p>
                        <p style={{ margin: 0 }}>{item.content}</p>
                        <button 
                          onClick={() => handleRemoveFromFavorites(item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: '#dc3545',
                            float: 'right'
                          }}
                        >
                          ×
                        </button>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </div>
        );
      
      case 'advice':
        return (
          <div style={{ padding: '20px' }}>
            <Card title="🚧 Совет дня">
              <p>Этот раздел находится в разработке...</p>
              <p>📱 Подключение к API готово</p>
              <p>🔗 Скоро будет доступен</p>
            </Card>
          </div>
        );
      
      default:
        return (
          <div>
            {/* Заголовок */}
            <Card title="🧙‍♂️ Гномий Гороскоп" subtitle="Магические предсказания от древних гномов">
              {!isOnline && (
                <div style={{
                  background: '#ff9800',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  marginTop: '10px',
                  display: 'inline-block'
                }}>
                  📵 Оффлайн режим
                </div>
              )}
            </Card>

            {/* Карточка профиля */}
            <Card 
              title={GNOME_PROFILES[selectedSign]?.name || 'Гnom Мудрый'}
              subtitle={GNOME_PROFILES[selectedSign]?.title || 'Мастер предсказаний'}
            >
              <p style={{ marginBottom: '12px' }}>
                {GNOME_PROFILES[selectedSign]?.desc || 'Древняя мудрость гномов'}
              </p>
              <div style={{
                background: 'rgba(139, 195, 74, 0.2)',
                color: '#2e7d0f',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                display: 'inline-block',
                border: '1px solid rgba(139, 195, 74, 0.3)'
              }}>
                {selectedSign} ({ZODIAC_SIGNS.find(s => s.sign === selectedSign)?.dates})
              </div>
            </Card>

            {/* Карусель знаков */}
          {ZodiacCarousel && (
  <ZodiacCarousel
    selectedSign={selectedSign}
    onSignChange={handleSignSelect}
    telegramApp={telegramApp}
    designTheme={designTheme} // Добавить эту строку
  />
)}

            {/* Сетка кнопок */}
            <ButtonGrid onButtonClick={handleButtonClick} />
          </div>
        );
    }
  };

  const showFallbackBackButton = currentView !== 'home' && 
    (!telegramApp || !telegramApp.BackButton || parseFloat(telegramApp.version) < 6.1);

  return (
    <div style={styles.app}>
      {/* Переключатель темы */}
      <button 
        style={styles.themeToggle}
        onClick={() => setDesignTheme(designTheme === 'glass' ? 'wooden' : 'glass')}
      >
        {designTheme === 'glass' ? '🪵 Дерево' : '💎 Стекло'}
      </button>

      {showFallbackBackButton && (
        <button style={styles.backButton} onClick={handleBackToHome}>
          ← Назад в главное меню
        </button>
      )}
      
      {renderCurrentView()}
    </div>
  );
}

export default App;
