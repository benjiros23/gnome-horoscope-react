import React, { useState, useEffect, useRef } from 'react';
import { useAPI } from '../hooks/useAPI';
import { saveToCache, loadFromCache } from '../utils/cache';

function MoonView({ onBack, onAddToFavorites, telegramApp }) {
  const { getMoonData, loading, error, clearError } = useAPI();
  const [moonData, setMoonData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [moonAnimation, setMoonAnimation] = useState(false);
  const loadingTimeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

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

  // Загружаем данные о луне при монтировании
 // В useEffect замените на:
// В компоненте MoonView.js добавьте принудительное обновление:
useEffect(() => {
  // Обновляем лунные данные каждые 6 часов
  const interval = setInterval(() => {
    getMoonData();
  }, 6 * 60 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);

  const cacheKey = 'moon_data';
  
  // Проверяем кеш (актуален 1 час)
  const cachedData = loadFromCache(cacheKey);
  if (cachedData) {
    const cacheAge = Date.now() - (cachedData.timestamp || 0);
    if (cacheAge < 3600000) { // 1 час
      console.log('✅ Лунные данные из кеша (актуальны)');
      setMoonData(cachedData);
      hasLoadedRef.current = true;
      setTimeout(() => setMoonAnimation(true), 500);
      return;
    } else {
      console.log('🗑️ Кеш устарел, удаляем');
      localStorage.removeItem('gnome_cache_moon_data');
    }
  }

  // Загружаем актуальные данные
  loadingTimeoutRef.current = setTimeout(async () => {
    try {
      clearError();
      console.log('🌙 Загружаем актуальные лунные данные...');
      
      const data = await getMoonData();
      
      // Сохраняем в кеш с timestamp
      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now()
      };
      
      saveToCache(cacheKey, dataWithTimestamp);
      setMoonData(dataWithTimestamp);
      hasLoadedRef.current = true;
      
      setTimeout(() => setMoonAnimation(true), 500);
      
      if (telegramApp?.HapticFeedback) {
        try {
          telegramApp.HapticFeedback.notificationOccurred('success');
        } catch (e) {
          console.log('Haptic feedback недоступен');
        }
      }
      
      console.log('✅ Лунные данные загружены:', data);
    } catch (err) {
      console.error('❌ Ошибка загрузки лунных данных:', err);
      
      if (telegramApp?.HapticFeedback) {
        try {
          telegramApp.HapticFeedback.notificationOccurred('error');
        } catch (e) {
          console.log('Haptic feedback недоступен');
        }
      }
    }
  }, 300);

  return () => {
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
  };
}, [getMoonData, clearError, telegramApp]);


  // Добавить в избранное
  const handleAddToFavorites = () => {
    if (moonData && onAddToFavorites) {
      const favoriteItem = {
        id: Date.now(),
        type: 'moon-phase',
        title: `🌙 ${moonData.current.phase}`,
        content: moonData.current.advice.text,
        date: new Date().toLocaleDateString('ru-RU'),
        source: moonData.source || 'offline'
      };
      
      onAddToFavorites(favoriteItem);
      
      if (telegramApp) {
        telegramApp.showAlert('❤️ Лунная информация добавлена в избранное!');
      } else {
        alert('❤️ Лунная информация добавлена в избранное!');
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

  // Обновить данные
  const handleRefresh = async () => {
    try {
      hasLoadedRef.current = false;
      clearError();
      
      // Очищаем кеш для принудительного обновления
      localStorage.removeItem('gnome_cache_moon_data');
      
      const data = await getMoonData();
      const dataWithTimestamp = {
        ...data,
        timestamp: new Date().toISOString()
      };
      
      saveToCache('moon_data', dataWithTimestamp);
      setMoonData(dataWithTimestamp);
      hasLoadedRef.current = true;
      
      if (telegramApp?.HapticFeedback) {
        try {
          telegramApp.HapticFeedback.impactOccurred('medium');
        } catch (e) {
          console.log('Haptic feedback недоступен:', e.message);
        }
      }
    } catch (err) {
      console.error('Ошибка обновления лунных данных:', err);
      hasLoadedRef.current = true;
    }
  };

  // Выбрать день в календаре
  const handleSelectDay = (index) => {
    setSelectedDay(index);
    if (telegramApp?.HapticFeedback) {
      try {
        telegramApp.HapticFeedback.selectionChanged();
      } catch (e) {
        console.log('Haptic feedback недоступен:', e.message);
      }
    }
  };

  // Поделиться лунной информацией
  const handleShare = () => {
    if (moonData && telegramApp) {
      const shareText = `🌙 Сегодня ${moonData.current.phase} (${moonData.current.illumination}% освещенности)\n\n${moonData.current.advice.text}\n\n🧙‍♂️ #ГномийГороскоп #ЛунныйКалендарь`;
      
      telegramApp.sendData(JSON.stringify({
        action: 'share_moon_phase',
        phase: moonData.current.phase,
        text: moonData.current.advice.text
      }));
    }
  };

  // Получаем CSS класс для луны
  const getMoonClass = () => {
    if (!moonData) return 'moon-new';
    
    const phase = moonData.current.phase;
    const classMap = {
      'Новолуние': 'moon-new',
      'Молодая луна': 'moon-waxing-crescent',
      'Первая четверть': 'moon-first-quarter',
      'Растущая луна': 'moon-waxing-gibbous',
      'Полнолуние': 'moon-full',
      'Убывающая луна': 'moon-waning-gibbous',
      'Последняя четверть': 'moon-last-quarter',
      'Старая луна': 'moon-waning-crescent'
    };
    
    return classMap[phase] || 'moon-new';
  };

  return (
    <div className="moon-view content-enter">
      <div className="card">
        <div className="content-header">
          <h3 className="content-title">🌙 Лунный календарь</h3>
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
              Гном-астроном изучает луну...
            </div>
            <p>Получаем актуальные лунные данные</p>
            <div className="loading-moon">
              <div className="moon-orbit">
                <div className="moon-loading">🌙</div>
              </div>
            </div>
          </div>
        )}

        {/* Ошибка загрузки */}
        {error && !loading && (
          <div className="error-container">
            <div className="error-icon">🌙</div>
            <h4>Луна скрыта облаками</h4>
            <p className="error-message">{error}</p>
            <div className="error-actions">
              <button className="btn-primary" onClick={handleRefresh}>
                🔄 Попробовать снова
              </button>
              <button className="btn-secondary" onClick={onBack}>
                ← Назад
              </button>
            </div>
          </div>
        )}

        {/* Контент лунных данных */}
        {moonData && !loading && (
          <div className="moon-content">
            {/* Главная луна */}
            <div className={`moon-display ${moonAnimation ? 'animated' : ''}`}>
              <div className="moon-container">
                <div className={`moon ${getMoonClass()}`}>
                  <div className="moon-surface">
                    <div className="crater crater-1"></div>
                    <div className="crater crater-2"></div>
                    <div className="crater crater-3"></div>
                  </div>
                  <div className="moon-glow"></div>
                </div>
                <div className="moon-stars">
                  <div className="star star-1">✨</div>
                  <div className="star star-2">⭐</div>
                  <div className="star star-3">🌟</div>
                  <div className="star star-4">💫</div>
                </div>
              </div>
              
              <div className="moon-info">
                <h2 className="moon-phase-name">{moonData.current.phase}</h2>
                <div className="moon-details">
                  <div className="moon-stat">
                    <span className="stat-label">Освещенность</span>
                    <span className="stat-value">{moonData.current.illumination}%</span>
                  </div>
                  <div className="moon-stat">
                    <span className="stat-label">Возраст</span>
                    <span className="stat-value">{Math.round(moonData.current.age)} дней</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Время восхода/захода (если есть) */}
            {moonData.moonrise && moonData.moonset && (
              <div className="moon-times">
                <div className="time-item">
                  <span className="time-icon">🌅</span>
                  <span className="time-label">Восход</span>
                  <span className="time-value">{moonData.moonrise}</span>
                </div>
                <div className="time-item">
                  <span className="time-icon">🌇</span>
                  <span className="time-label">Заход</span>
                  <span className="time-value">{moonData.moonset}</span>
                </div>
              </div>
            )}

            {/* Советы гномов */}
            <div className="moon-advice">
              <h4 className="advice-title">{moonData.current.advice.title}</h4>
              <div className="advice-content">
                <p className="advice-text">{moonData.current.advice.text}</p>
                
                <div className="advice-activities">
                  <div className="activity-section">
                    <h5>✅ Рекомендуется:</h5>
                    <div className="activity-tags">
                      {moonData.current.advice.activities.map((activity, index) => (
                        <span key={index} className="activity-tag positive">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="activity-section">
                    <h5>❌ Избегать:</h5>
                    <div className="activity-tags">
                      {moonData.current.advice.avoid.map((activity, index) => (
                        <span key={index} className="activity-tag negative">
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Календарь на неделю */}
            <div className="moon-calendar">
              <h4>Лунный календарь на неделю</h4>
              <div className="calendar-days">
                {moonData.calendar && moonData.calendar.map((day, index) => (
                  <button
                    key={index}
                    className={`calendar-day ${index === selectedDay ? 'selected' : ''}`}
                    onClick={() => handleSelectDay(index)}
                  >
                    <div className="day-emoji">{day.emoji}</div>
                    <div className="day-date">{day.displayDate}</div>
                    <div className="day-illumination">{day.illumination}%</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Следующие важные фазы */}
            {moonData.nextFullMoon && moonData.nextNewMoon && (
              <div className="upcoming-phases">
                <h4>Ближайшие фазы</h4>
                <div className="phase-predictions">
                  <div className="phase-item">
                    <span className="phase-emoji">🌕</span>
                    <span className="phase-name">Полнолуние</span>
                    <span className="phase-date">{moonData.nextFullMoon}</span>
                  </div>
                  <div className="phase-item">
                    <span className="phase-emoji">🌑</span>
                    <span className="phase-name">Новолуние</span>
                    <span className="phase-date">{moonData.nextNewMoon}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Источник данных */}
            <div className="source-badge-container">
              {moonData.source === 'offline' ? (
                <div className="source-badge offline">
                  📱 Расчетные данные
                </div>
              ) : (
                <div className="source-badge online">
                  🌐 Актуальные данные
                </div>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="action-buttons">
              <button 
                className="btn-favorite" 
                onClick={handleAddToFavorites}
                title="Добавить в избранное"
              >
                ❤️ В избранное
              </button>
              
              <button 
                className="btn-primary" 
                onClick={handleRefresh}
                title="Обновить данные"
              >
                🔄 Обновить
              </button>
              
              {telegramApp && (
                <button 
                  className="btn-secondary" 
                  onClick={handleShare}
                  title="Поделиться"
                >
                  📤 Поделиться
                </button>
              )}
              
              <button 
                className="btn-secondary" 
                onClick={onBack}
              >
                ← Назад
              </button>
            </div>

            {/* Информация */}
            <div className="moon-info-footer">
              <small>
                {moonData.source === 'offline' 
                  ? '📊 Данные рассчитаны по астрономическим алгоритмам'
                  : '🌐 Данные получены от астрономических служб'
                }
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MoonView;
