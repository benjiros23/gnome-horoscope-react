import React, { useState, useEffect, useRef } from 'react';
import { useAPI } from '../hooks/useAPI';
import { saveToCache, loadFromCache } from '../utils/cache';

function AdviceView({ onBack, onAddToFavorites, telegramApp }) {
  const { getAdvice, loading, error, clearError } = useAPI();
  const [adviceData, setAdviceData] = useState(null);
  const [adviceAnimation, setAdviceAnimation] = useState(false);
  const loadingTimeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;

    const cacheKey = 'daily_advice';
    const cachedData = loadFromCache(cacheKey);
    
    if (cachedData) {
      const cacheAge = Date.now() - (cachedData.timestamp || 0);
      if (cacheAge < 3600000) { // 1 час
        setAdviceData(cachedData);
        hasLoadedRef.current = true;
        setTimeout(() => setAdviceAnimation(true), 500);
        return;
      }
    }

    loadingTimeoutRef.current = setTimeout(async () => {
      try {
        clearError();
        const data = await getAdvice();
        const dataWithTimestamp = { ...data, timestamp: Date.now() };
        saveToCache(cacheKey, dataWithTimestamp);
        setAdviceData(dataWithTimestamp);
        hasLoadedRef.current = true;
        setTimeout(() => setAdviceAnimation(true), 500);
      } catch (err) {
        console.error('Ошибка загрузки совета:', err);
      }
    }, 300);

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [getAdvice, clearError]);

  const handleAddToFavorites = () => {
    if (adviceData && onAddToFavorites) {
      const favoriteItem = {
        id: Date.now(),
        type: 'advice',
        title: '💡 Совет дня от гномов',
        content: adviceData.text,
        date: new Date().toLocaleDateString('ru-RU'),
        source: adviceData.source || 'offline'
      };
      onAddToFavorites(favoriteItem);
      
      if (telegramApp) {
        telegramApp.showAlert('❤️ Совет добавлен в избранное!');
      }
    }
  };

  return (
    <div className="advice-screen content-enter">
      <div className="card">
        <h3 className="content-title">💡 Совет дня</h3>
        
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner">🧙‍♂️</div>
            <p>Гном-мудрец размышляет над советом...</p>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <p>❌ {error}</p>
          </div>
        )}
        
        {adviceData && (
          <div className={`advice-content ${adviceAnimation ? 'animate' : ''}`}>
            <div className="advice-header">
              <p className="advice-date">{new Date().toLocaleDateString('ru-RU')}</p>
            </div>
            
            <div className="advice-body">
              <p className="advice-text">{adviceData.text}</p>
              <div className="advice-category">
                <span>Категория: {adviceData.category || 'Ежедневная мудрость'}</span>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={handleAddToFavorites}
                title="Добавить в избранное"
              >
                ❤️ В избранное
              </button>
            </div>
          </div>
        )}
        
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onBack}>
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdviceView;
