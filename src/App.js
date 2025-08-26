import React, { useState, useEffect } from 'react';
// Импортируем только СУЩЕСТВУЮЩИЕ компоненты
import HoroscopeView from './components/HoroscopeView';
import ZodiacCarousel from './components/ZodiacCarousel';
import MoonView from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
// Недостающие компоненты закомментированы
import DayCardView from './components/DayCardView';
// import AdviceView from './components/AdviceView';
import MercuryView from './components/MercuryView';
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
  // Основное состояние приложения
  const [selectedSign, setSelectedSign] = useState('Лев');
  const [currentScreen, setCurrentScreen] = useState('main');
  
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
  const [telegramApp, setTelegramApp] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Инициализация Telegram WebApp
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      setTelegramApp(tg);
      tg.ready();
      tg.expand();
      
      // Настройка главной кнопки
      tg.MainButton.setText('🃏 Получить карту дня');
      tg.MainButton.color = '#8BC34A';
      tg.MainButton.show();
      
      // Обработчик главной кнопки
      tg.MainButton.onClick(() => {
        setCurrentScreen('day-card');
      });
      
      console.log('✅ Telegram WebApp инициализирован');
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Работаем в браузере (демо-режим)');
      }
    }
  }, []);
  
  // Обновляем состояние Back Button
  useEffect(() => {
    if (telegramApp?.BackButton) {
      try {
        if (currentScreen !== 'main') {
          telegramApp.BackButton.show();
          telegramApp.BackButton.onClick(() => {
            setCurrentScreen('main');
          });
        } else {
          telegramApp.BackButton.hide();
        }
      } catch (error) {
        console.log('BackButton недоступен:', error.message);
      }
    }
  }, [currentScreen, telegramApp]);
  
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
  
  // Утилиты
  const hapticFeedback = (type = 'impact', style = 'medium') => {
    if (telegramApp?.HapticFeedback) {
      try {
        if (type === 'impact') {
          telegramApp.HapticFeedback.impactOccurred(style);
        } else if (type === 'selection') {
          telegramApp.HapticFeedback.selectionChanged();
        }
      } catch (error) {
        console.log('Haptic feedback недоступен:', error.message);
      }
    }
  };
  
  const showToast = (message) => {
    if (telegramApp) {
      telegramApp.showAlert(message);
    } else {
      alert(message);
    }
  };
  
  const handleSignSelect = (sign) => {
    setSelectedSign(sign);
    hapticFeedback('selection');
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
        showToast('Этот элемент уже в избранном!');
        return;
      }
      
      const newItem = {
        ...item,
        id: Date.now() + Math.random(),
        addedAt: new Date().toISOString()
      };
      
      setFavorites(prev => [newItem, ...prev]);
      
      if (favorites.length >= 50) {
        setFavorites(prev => prev.slice(0, 50));
      }
      
      hapticFeedback('impact', 'light');
      console.log('✅ Добавлено в избранное:', newItem);
      
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error);
      showToast('Ошибка при добавлении в избранное');
    }
  };
  
  const handleRemoveFromFavorites = (itemId) => {
    setFavorites(prev => prev.filter(item => item.id !== itemId));
    hapticFeedback('impact', 'light');
    showToast('Удалено из избранного');
  };
  
  const handleClearFavorites = () => {
    if (telegramApp) {
      telegramApp.showConfirm('Удалить все избранные элементы?', (confirmed) => {
        if (confirmed) {
          setFavorites([]);
          hapticFeedback('notification', 'warning');
        }
      });
    } else {
      if (window.confirm('Удалить все избранные элементы?')) {
        setFavorites([]);
      }
    }
  };
  
  const handleBack = () => {
    setCurrentScreen('main');
    hapticFeedback('impact', 'light');
  };
  
  // Получить текущий профиль гнома
  const currentProfile = GNOME_PROFILES[selectedSign] || GNOME_PROFILES['Лев'];
  const currentSignData = ZODIAC_SIGNS.find(s => s.sign === selectedSign) || ZODIAC_SIGNS[4];
  
  return (
    <div className="app-container">
      {/* Заголовок */}
      <div className="header">
        <h1>🧙‍♂️ Гномий Гороскоп</h1>
        <p>Магические предсказания от древних гномов</p>
        {!isOnline && (
          <div className="offline-badge">
            📵 Оффлайн режим
          </div>
        )}
      </div>
      
      {/* Основной экран */}
      {currentScreen === 'main' && (
        <div className="main-screen content-enter">
          {/* Карточка профиля */}
          <div className="card profile-card">
            <h2>{currentProfile.name}</h2>
            <p className="gnome-title">{currentProfile.title}</p>
            <p>{currentProfile.desc}</p>
            <span className="selected-sign">
              {selectedSign} ({currentSignData.dates})
            </span>
          </div>
          
          {/* Карусель знаков зодиака */}
          <ZodiacCarousel
            selectedSign={selectedSign}
            onSignChange={handleSignSelect}
            telegramApp={telegramApp}
          />
          
          {/* Меню кнопок */}
          <div className="menu-buttons">
            <button className="menu-btn" onClick={() => setCurrentScreen('horoscope')}>
              <div className="btn-icon">🔮</div>
              <div className="btn-content">
                <h3>Гороскоп дня</h3>
                <p>Узнайте что готовят звезды</p>
              </div>
            </button>
            
            <button className="menu-btn" onClick={() => setCurrentScreen('moon')}>
              <div className="btn-icon">🌙</div>
              <div className="btn-content">
                <h3>Лунный календарь</h3>
                <p>Фазы и влияние луны</p>
              </div>
            </button>
            
            <button className="menu-btn" onClick={() => setCurrentScreen('numerology')}>
              <div className="btn-icon">🔢</div>
              <div className="btn-content">
                <h3>Нумерология</h3>
                <p>Число судьбы и характер</p>
              </div>
            </button>
            
            <button className="menu-btn" onClick={() => setCurrentScreen('compatibility')}>
              <div className="btn-icon">👫</div>
              <div className="btn-content">
                <h3>Совместимость</h3>
                <p>Узнайте совместимость</p>
              </div>
            </button>
            
            <button className="menu-btn" onClick={() => setCurrentScreen('events')}>
              <div className="btn-icon">🌌</div>
              <div className="btn-content">
                <h3>Астрособытия</h3>
                <p>Небесные явления</p>
              </div>
            </button>
            
            {/* Кнопки для экранов в разработке */}
            <button className="menu-btn" onClick={() => setCurrentScreen('day-card')}>
              <div className="btn-icon">🃏</div>
              <div className="btn-content">
                <h3>Карта дня</h3>
                <p>Мудрость древних гномов</p>
              </div>
            </button>
            
            <button className="menu-btn" onClick={() => setCurrentScreen('advice')}>
              <div className="btn-icon">💡</div>
              <div className="btn-content">
                <h3>Совет дня</h3>
                <p>Личная рекомендация</p>
              </div>
            </button>
            
            <button className="menu-btn" onClick={() => setCurrentScreen('mercury')}>
              <div className="btn-icon">🪐</div>
              <div className="btn-content">
                <h3>Статус Меркурия</h3>
                <p>Влияние на неделю</p>
              </div>
            </button>
            
            <button className="menu-btn" onClick={() => setCurrentScreen('favorites')}>
              <div className="btn-icon">❤️</div>
              <div className="btn-content">
                <h3>Избранное</h3>
                <p>Сохранённые предсказания ({favorites.length})</p>
              </div>
            </button>
          </div>
        </div>
      )}
      
      {/* СУЩЕСТВУЮЩИЕ экраны */}
      {currentScreen === 'horoscope' && (
        <HoroscopeView
          selectedSign={selectedSign}
          onBack={handleBack}
          onAddToFavorites={handleAddToFavorites}
          telegramApp={telegramApp}
        />
      )}
      
      {currentScreen === 'moon' && (
        <MoonView
          onBack={handleBack}
          onAddToFavorites={handleAddToFavorites}
          telegramApp={telegramApp}
        />
      )}
      
      {currentScreen === 'numerology' && (
        <NumerologyView
          onBack={handleBack}
          onAddToFavorites={handleAddToFavorites}
          telegramApp={telegramApp}
        />
      )}
      
      {currentScreen === 'compatibility' && (
        <CompatibilityView
          onBack={handleBack}
          onAddToFavorites={handleAddToFavorites}
          telegramApp={telegramApp}
        />
      )}

{currentScreen === 'day-card' && (
  <DayCardView
    onBack={handleBack}
    onAddToFavorites={handleAddToFavorites}
    telegramApp={telegramApp}
  />
)}


      {currentScreen === 'events' && (
        <AstroEventsView
          onBack={handleBack}
          onAddToFavorites={handleAddToFavorites}
          telegramApp={telegramApp}
        />
      )}
{currentScreen === 'mercury' && (
  <MercuryView
    onBack={handleBack}
    onAddToFavorites={handleAddToFavorites}
    telegramApp={telegramApp}
  />
)}
      
      {/* Экран избранного */}
      {currentScreen === 'favorites' && (
        <div className="favorites-screen content-enter">
          <div className="card">
            <h3 className="content-title">❤️ Избранное</h3>
            
            {favorites.length === 0 ? (
              <div className="empty-favorites">
                <div className="empty-icon">📝</div>
                <h4>Здесь пока пусто</h4>
                <p>Добавляйте интересные гороскопы, карты и предсказания в избранное!</p>
                <small>Используйте кнопку "❤️ В избранное" при просмотре предсказаний</small>
              </div>
            ) : (
              <>
                <div className="favorites-header">
                  <p>У вас сохранено предсказаний: <strong>{favorites.length}</strong></p>
                  <button 
                    className="btn-danger" 
                    onClick={handleClearFavorites}
                    title="Очистить все"
                  >
                    🗑️ Очистить
                  </button>
                </div>
                
                <div className="favorites-list">
                  {favorites.map((item) => (
                    <div key={item.id} className="favorite-item">
                      <div className="favorite-header">
                        <h5>{item.title}</h5>
                        <button 
                          className="remove-btn"
                          onClick={() => handleRemoveFromFavorites(item.id)}
                          title="Удалить"
                        >
                          ×
                        </button>
                      </div>
                      <p className="favorite-date">{item.date}</p>
                      <p className="favorite-content">{item.content}</p>
                      {item.source && (
                        <span className={`source-badge ${item.source}`}>
                          {item.source === 'internet' ? '🌐' : '📱'} {item.source}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
            
            <div className="action-buttons">
              <button className="btn-secondary" onClick={handleBack}>
                ← Назад
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Заглушки для экранов в разработке */}
      {['advice'].includes(currentScreen) && (
        <div className="card content-enter">
          <h3>🚧 Экран: {currentScreen}</h3>
          <p>Этот раздел находится в разработке...</p>
          <div className="placeholder-info">
            <p>📱 <strong>{currentScreen}</strong> будет доступен в следующем обновлении</p>
            <p>🔗 Подключение к серверному API: готово</p>
            <p>⚡ Telegram WebApp: активно</p>
            <p>🎯 Сервер готов: все endpoints работают</p>
          </div>
          <div style={{ marginTop: '24px' }}>
            <button className="btn-secondary" onClick={handleBack}>
              ← Назад в главное меню
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
