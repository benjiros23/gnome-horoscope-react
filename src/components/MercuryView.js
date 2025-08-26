import React, { useState, useEffect, useRef } from 'react';
import { useAPI } from '../hooks/useAPI';
import { saveToCache, loadFromCache } from '../utils/cache';

function MercuryView({ onBack, onAddToFavorites, telegramApp }) {
  const { getMercuryStatus, loading, error, clearError } = useAPI();
  const [mercuryData, setMercuryData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [mercuryAnimation, setMercuryAnimation] = useState(false);
  const loadingTimeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // Загружаем данные о Меркурии при монтировании
  useEffect(() => {
    if (hasLoadedRef.current) return;

    const cacheKey = 'mercury_status';
    const cachedData = loadFromCache(cacheKey);
    
    if (cachedData) {
      const cacheAge = Date.now() - (cachedData.timestamp || 0);
      if (cacheAge < 1800000) { // 30 минут
        console.log('✅ Данные Меркурия из кеша');
        setMercuryData(cachedData);
        hasLoadedRef.current = true;
        setTimeout(() => setMercuryAnimation(true), 500);
        return;
      }
    }

    loadingTimeoutRef.current = setTimeout(async () => {
      try {
        clearError();
        console.log('🪐 Загружаем актуальные данные Меркурия...');
        const data = await getMercuryStatus();
        
        const dataWithTimestamp = { ...data, timestamp: Date.now() };
        saveToCache(cacheKey, dataWithTimestamp);
        setMercuryData(dataWithTimestamp);
        hasLoadedRef.current = true;
        
        setTimeout(() => setMercuryAnimation(true), 500);
        
        if (telegramApp?.HapticFeedback) {
          try {
            telegramApp.HapticFeedback.notificationOccurred('success');
          } catch (e) {
            console.log('Haptic feedback недоступен');
          }
        }
        
        console.log('✅ Данные Меркурия загружены:', data);
      } catch (err) {
        console.error('❌ Ошибка загрузки данных Меркурия:', err);
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
  }, [getMercuryStatus, clearError, telegramApp]);

  // Haptic feedback
  const hapticFeedback = (type = 'impact', style = 'medium') => {
    if (telegramApp?.HapticFeedback) {
      try {
        if (type === 'impact') {
          telegramApp.HapticFeedback.impactOccurred(style);
        } else if (type === 'selection') {
          telegramApp.HapticFeedback.selectionChanged();
        }
      } catch (e) {
        console.log('Haptic feedback недоступен:', e.message);
      }
    }
  };

  // Добавить в избранное
  const handleAddToFavorites = () => {
    if (mercuryData && onAddToFavorites) {
      const favoriteItem = {
        id: Date.now(),
        type: 'mercury-status',
        title: `🪐 Меркурий: ${mercuryData.isRetrograde ? 'Ретроградный' : 'Директный'}`,
        content: mercuryData.description,
        date: new Date().toLocaleDateString('ru-RU'),
        source: mercuryData.source || 'astrology'
      };
      
      onAddToFavorites(favoriteItem);
      hapticFeedback('impact', 'light');
      
      if (telegramApp) {
        telegramApp.showAlert('❤️ Статус Меркурия добавлен в избранное!');
      } else {
        alert('❤️ Статус Меркурия добавлен в избранное!');
      }
    }
  };

  // Поделиться
  const handleShare = () => {
    if (mercuryData && telegramApp) {
      const shareText = `🪐 Статус Меркурия сегодня:\n${mercuryData.period}\n\n${mercuryData.description}\n\n💡 ${mercuryData.advice}\n\n🧙‍♂️ #ГномийГороскоп #Меркурий`;
      
      telegramApp.sendData(JSON.stringify({
        action: 'share_mercury_status',
        isRetrograde: mercuryData.isRetrograde,
        period: mercuryData.period,
        description: mercuryData.description
      }));
      
      hapticFeedback('impact', 'medium');
    }
  };

  // Получить CSS класс для Меркурия
  const getMercuryClass = () => {
    if (!mercuryData) return 'mercury-loading';
    return mercuryData.isRetrograde ? 'mercury-retrograde' : 'mercury-direct';
  };

  // Получить иконку статуса
  const getStatusIcon = () => {
    if (!mercuryData) return '🪐';
    return mercuryData.isRetrograde ? '🔄' : '⚡';
  };

  // Получить цвет статуса
  const getStatusColor = () => {
    if (!mercuryData) return '#9C27B0';
    return mercuryData.isRetrograde ? '#FF5722' : '#4CAF50';
  };

  return (
    <div className="mercury-view content-enter">
      <div className="card">
        <h3 className="mercury-title">🪐 Статус Меркурия</h3>
        <p className="mercury-subtitle">Планета коммуникаций, технологий и путешествий</p>
        
        {loading && (
          <div className="loading-state">
            <div className="mercury-spinner">🪐</div>
            <p>Отслеживаем движение Меркурия...</p>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <p>❌ {error}</p>
            <small>Попробуйте обновить страницу</small>
          </div>
        )}
        
        {mercuryData && (
          <div className={`mercury-content ${mercuryAnimation ? 'animate' : ''}`}>
            {/* Главная карточка статуса */}
            <div className={`mercury-status-card ${getMercuryClass()}`}>
              <div className="mercury-icon" style={{ color: getStatusColor() }}>
                {getStatusIcon()}
              </div>
              
              <div className="mercury-status-info">
                <h2 className="status-title">
                  {mercuryData.isRetrograde ? 'РЕТРОГРАДНЫЙ' : 'ДИРЕКТНОЕ ДВИЖЕНИЕ'}
                </h2>
                <p className="status-period">{mercuryData.period}</p>
              </div>
              
              <div className={`status-indicator ${mercuryData.isRetrograde ? 'retrograde' : 'direct'}`}>
                {mercuryData.isRetrograde ? '↺' : '→'}
              </div>
            </div>
            
            {/* Описание влияния */}
            <div className="mercury-description">
              <h4>📝 Влияние на жизнь:</h4>
              <p>{mercuryData.description}</p>
            </div>
            
            {/* Советы */}
            <div className="mercury-advice">
              <h4>💡 Рекомендации гномов:</h4>
              <p>{mercuryData.advice}</p>
            </div>
            
            {/* Подробная информация */}
            <div className="mercury-details-toggle">
              <button 
                className="btn-secondary"
                onClick={() => {
                  setShowDetails(!showDetails);
                  hapticFeedback('selection');
                }}
              >
                {showDetails ? '📖 Скрыть детали' : '📚 Подробнее о Меркурии'}
              </button>
            </div>
            
            {showDetails && (
              <div className="mercury-details">
                <div className="detail-section">
                  <h5>🪐 О планете Меркурий:</h5>
                  <ul>
                    <li><strong>Управляет:</strong> коммуникации, мышление, технологии</li>
                    <li><strong>Влияет на:</strong> переговоры, поездки, обучение</li>
                    <li><strong>Ретроград:</strong> 3-4 раза в год по 3 недели</li>
                    <li><strong>Знаки:</strong> Близнецы и Дева</li>
                  </ul>
                </div>
                
                <div className="detail-section">
                  <h5>⚠️ Что НЕ стоит делать в ретроградный период:</h5>
                  <ul>
                    <li>Подписывать важные контракты</li>
                    <li>Покупать технику и автомобили</li>
                    <li>Начинать новые проекты</li>
                    <li>Планировать важные поездки</li>
                  </ul>
                </div>
                
                <div className="detail-section">
                  <h5>✅ Что ХОРОШО делать:</h5>
                  <ul>
                    <li>Пересматривать старые проекты</li>
                    <li>Восстанавливать связи с людьми</li>
                    <li>Изучать что-то глубже</li>
                    <li>Медитировать и рефлексировать</li>
                  </ul>
                </div>
                
                <div className="detail-section">
                  <h5>📅 Ретроградные периоды 2025:</h5>
                  <ul>
                    <li><span className="period-past">15 марта - 7 апреля</span> (завершён)</li>
                    <li><span className="period-past">18 июля - 11 августа</span> (завершён)</li>
                    <li><span className="period-future">9 ноября - 29 ноября</span> (предстоит)</li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* Кнопки действий */}
            <div className="mercury-actions">
              <button 
                className="btn-primary"
                onClick={handleAddToFavorites}
              >
                ❤️ В избранное
              </button>
              
              <button 
                className="btn-secondary"
                onClick={handleShare}
              >
                📤 Поделиться
              </button>
            </div>
          </div>
        )}
        
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onBack}>
            ← Назад в главное меню
          </button>
        </div>
      </div>
    </div>
  );
}

export default MercuryView;
