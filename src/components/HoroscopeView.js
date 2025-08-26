import React, { useState, useEffect, useRef } from 'react';
import { useAPI } from '../hooks/useAPI';
import { saveToCache, loadFromCache, clearCache } from '../utils/cache';

function HoroscopeView({ selectedSign, onBack, onAddToFavorites, telegramApp }) {
  const { getHoroscope, loading, error, clearError } = useAPI();
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isFromCache, setIsFromCache] = useState(false);
  const loadingTimeoutRef = useRef(null);
  const lastLoadedSignRef = useRef(null);

  // Отслеживаем статус сети
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

  // Загружаем гороскоп с кешированием на день
  useEffect(() => {
    // Если знак не изменился - не загружаем
    if (lastLoadedSignRef.current === selectedSign) {
      return;
    }

    if (!selectedSign) {
      return;
    }

    // Очищаем предыдущий таймаут
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    const cacheKeyName = `horoscope_${selectedSign}`;

    // Проверяем кеш сначала
    const cachedData = loadFromCache(cacheKeyName);
    if (cachedData) {
      console.log(`✅ Гороскоп для ${selectedSign} загружен из кеша`);
      setHoroscopeData(cachedData);
      setIsFromCache(true);
      lastLoadedSignRef.current = selectedSign;
      return;
    }

    // Загружаем с сервера, если нет кеша
    loadingTimeoutRef.current = setTimeout(async () => {
      try {
        clearError();
        setIsFromCache(false);
        console.log(`🔮 Загружаем новый гороскоп для ${selectedSign}...`);
        
        const data = await getHoroscope(selectedSign);
        
        // Сохраняем в кеш на весь день
        saveToCache(cacheKeyName, data);
        
        setHoroscopeData(data);
        lastLoadedSignRef.current = selectedSign;
        
        // Haptic feedback при успешной загрузке
        if (telegramApp?.HapticFeedback) {
          try {
            telegramApp.HapticFeedback.notificationOccurred('success');
          } catch (e) {
            console.log('Haptic feedback недоступен:', e.message);
          }
        }
        
        console.log('✅ Гороскоп загружен и сохранен в кеш:', data);
      } catch (err) {
        console.error('❌ Ошибка загрузки гороскопа:', err);
        setIsFromCache(false);
        
        // Haptic feedback при ошибке
        if (telegramApp?.HapticFeedback) {
          try {
            telegramApp.HapticFeedback.notificationOccurred('error');
          } catch (e) {
            console.log('Haptic feedback недоступен:', e.message);
          }
        }
      }
    }, 300);

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [selectedSign, getHoroscope, clearError, telegramApp]);

  // Добавить в избранное
  const handleAddToFavorites = () => {
    if (horoscopeData && onAddToFavorites) {
      const favoriteItem = {
        id: Date.now(),
        type: 'horoscope',
        title: `🔮 Гороскоп для ${selectedSign}`,
        content: horoscopeData.text,
        date: new Date().toLocaleDateString('ru-RU'),
        source: horoscopeData.source || 'internet'
      };
      
      onAddToFavorites(favoriteItem);
      
      if (telegramApp) {
        telegramApp.showAlert('❤️ Добавлено в избранное!');
      } else {
        alert('❤️ Добавлено в избранное!');
      }
      
      if (telegramApp?.HapticFeedback) {
        try {
          telegramApp.HapticFeedback.impactOccurred('light');
        } catch (e) {
          console.log('Haptic feedback недоступен:', e.message);
        }
      }
    }
  };

  // Получить новый гороскоп (принудительно)
  const handleGetNewHoroscope = async () => {
    if (selectedSign) {
      try {
        const cacheKeyName = `horoscope_${selectedSign}`;
        clearCache(cacheKeyName); // Очищаем кеш
        
        lastLoadedSignRef.current = null; // Сбрасываем состояние
        clearError();
        setIsFromCache(false);
        console.log('🔄 Принудительное получение нового гороскопа...');
        
        const data = await getHoroscope(selectedSign);
        
        // Сохраняем новый гороскоп в кеш
        saveToCache(cacheKeyName, data);
        
        setHoroscopeData(data);
        lastLoadedSignRef.current = selectedSign;
        
        if (telegramApp?.HapticFeedback) {
          try {
            telegramApp.HapticFeedback.impactOccurred('medium');
          } catch (e) {
            console.log('Haptic feedback недоступен:', e.message);
          }
        }
        
        console.log('✅ Новый гороскоп получен и сохранен:', data);
      } catch (err) {
        console.error('Ошибка получения нового гороскопа:', err);
        lastLoadedSignRef.current = selectedSign;
      }
    }
  };

  // Поделиться гороскопом
  const handleShare = () => {
    if (horoscopeData && telegramApp) {
      const shareText = `🧙‍♂️ Гномий гороскоп для ${selectedSign}:\n\n${horoscopeData.text}\n\n#ГномийГороскоп`;
      
      telegramApp.sendData(JSON.stringify({
        action: 'share_horoscope',
        sign: selectedSign,
        text: horoscopeData.text
      }));
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Сегодня';
    }
  };

  // Получаем бейдж источника
  const getSourceBadge = () => {
    if (!horoscopeData) return null;
    
    if (isFromCache) {
      return (
        <div className="source-badge cached">
          💾 Сохранен на день
        </div>
      );
    } else if (horoscopeData.source === 'offline') {
      return (
        <div className="source-badge offline">
          📱 Оффлайн режим
        </div>
      );
    } else {
      return (
        <div className="source-badge online">
          🌐 Живые данные
        </div>
      );
    }
  };

  return (
    <div className="horoscope-view content-enter">
      <div className="card">
        <div className="content-header">
          <h3 className="content-title">🔮 Гороскоп на сегодня</h3>
          {!isOnline && (
            <div className="offline-indicator">
              📵 Нет интернета
            </div>
          )}
        </div>

        {/* Индикатор загрузки */}
        {loading && (
          <div className="loading-container">
            <div className="loading-indicator">
              Звезды шепчут гному-звездочету...
            </div>
            <p>Загружаем актуальный гороскоп для {selectedSign}</p>
          </div>
        )}

        {/* Ошибка загрузки */}
        {error && !loading && (
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h4>Не удалось загрузить гороскоп</h4>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button className="btn-primary" onClick={handleGetNewHoroscope}>
                🔄 Попробовать снова
              </button>
              <button className="btn-secondary" onClick={onBack}>
                ← Назад
              </button>
            </div>
          </div>
        )}

        {/* Контент гороскопа */}
        {horoscopeData && !loading && (
          <div className="horoscope-content">
            {/* Заголовок */}
            <div className="horoscope-header">
              <div className="sign-info">
                <h4 className="sign-name">{selectedSign}</h4>
                <p className="date-info">{formatDate(horoscopeData.date)}</p>
              </div>
              {getSourceBadge()}
            </div>

            {/* Текст гороскопа */}
            <div className="horoscope-text-container">
              <div className="content-highlight">
                <p className="horoscope-text">{horoscopeData.text}</p>
              </div>
            </div>

            {/* Дополнительная информация */}
            {horoscopeData.mood && (
              <div className="extra-info">
                <h5>🎭 Настроение:</h5>
                <p>{horoscopeData.mood}</p>
              </div>
            )}

            {horoscopeData.color && (
              <div className="extra-info">
                <h5>🎨 Цвет дня:</h5>
                <span className="lucky-color" style={{ backgroundColor: horoscopeData.color }}>
                  {horoscopeData.color}
                </span>
              </div>
            )}

            {horoscopeData.luckyNumber && (
              <div className="extra-info">
                <h5>🍀 Счастливое число:</h5>
                <span className="lucky-number">{horoscopeData.luckyNumber}</span>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="action-buttons">
              <button 
                className="btn-favorite" 
                onClick={handleAddToFavorites}
                title="Добавить в избранное"
              >
                ❤️ В избранное
              </button>
              
              {telegramApp && (
                <button 
                  className="btn-primary" 
                  onClick={handleShare}
                  title="Поделиться"
                >
                  📤 Поделиться
                </button>
              )}
              
              <button 
                className="btn-secondary" 
                onClick={handleGetNewHoroscope}
                title="Получить новый гороскоп (обновляет кеш)"
              >
                🔄 Новый гороскоп
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={onBack}
              >
                ← Назад
              </button>
            </div>

            {/* Информация об источнике */}
            <div className="source-info">
              <small>
                {isFromCache 
                  ? '💾 Гороскоп сохранен на весь день. Завтра будет новый!'
                  : horoscopeData.source === 'offline' 
                    ? '📱 Данные из кэша. Подключитесь к интернету для актуальной информации.'
                    : '🌐 Свежий гороскоп от гномьих астрологов'
                }
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HoroscopeView;
