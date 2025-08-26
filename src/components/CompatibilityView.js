import React, { useState, useEffect, useRef } from 'react';
import { useAPI } from '../hooks/useAPI';
import { saveToCache, loadFromCache } from '../utils/cache';

function CompatibilityView({ onBack, onAddToFavorites, telegramApp }) {
  const { checkCompatibility, loading, error, clearError } = useAPI();
  
  // Состояния компонента
  const [selectedSign1, setSelectedSign1] = useState('Лев'); // Ваш знак
  const [selectedSign2, setSelectedSign2] = useState('Овен'); // Знак партнера
  const [compatibilityResult, setCompatibilityResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [animateHearts, setAnimateHearts] = useState(false);
  
  const resultRef = useRef(null);
  const hasCalculatedRef = useRef(false);

  // Данные знаков зодиака
  const zodiacSigns = [
    { sign: 'Овен', emoji: '♈', element: 'Огонь', color: '#FF6B6B' },
    { sign: 'Телец', emoji: '♉', element: 'Земля', color: '#4ECDC4' },
    { sign: 'Близнецы', emoji: '♊', element: 'Воздух', color: '#45B7D1' },
    { sign: 'Рак', emoji: '♋', element: 'Вода', color: '#96CEB4' },
    { sign: 'Лев', emoji: '♌', element: 'Огонь', color: '#FECA57' },
    { sign: 'Дева', emoji: '♍', element: 'Земля', color: '#48CAE4' },
    { sign: 'Весы', emoji: '♎', element: 'Воздух', color: '#F38BA8' },
    { sign: 'Скорпион', emoji: '♏', element: 'Вода', color: '#A8DADC' },
    { sign: 'Стрелец', emoji: '♐', element: 'Огонь', color: '#F1C0E8' },
    { sign: 'Козерог', emoji: '♑', element: 'Земля', color: '#CFBAF0' },
    { sign: 'Водолей', emoji: '♒', element: 'Воздух', color: '#A3C4F3' },
    { sign: 'Рыбы', emoji: '♓', element: 'Вода', color: '#90DBF4' }
  ];

  // Haptic feedback
  const hapticFeedback = (type = 'impact', style = 'medium') => {
    if (telegramApp?.HapticFeedback) {
      try {
        if (type === 'impact') {
          telegramApp.HapticFeedback.impactOccurred(style);
        } else if (type === 'selection') {
          telegramApp.HapticFeedback.selectionChanged();
        } else if (type === 'notification') {
          telegramApp.HapticFeedback.notificationOccurred(style);
        }
      } catch (e) {
        console.log('Haptic feedback недоступен:', e.message);
      }
    }
  };

  // Показать уведомление
  const showToast = (message) => {
    if (telegramApp) {
      telegramApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  // Получить данные знака
  const getSignData = (signName) => {
    return zodiacSigns.find(s => s.sign === signName) || zodiacSigns[4];
  };

  // Рассчитать совместимость
  const handleCalculateCompatibility = async () => {
    if (isCalculating || hasCalculatedRef.current) return;
    
    try {
      setIsCalculating(true);
      hasCalculatedRef.current = true;
      clearError();
      
      console.log(`💕 Рассчитываем совместимость: ${selectedSign1} + ${selectedSign2}`);
      
      // Проверяем кеш
      const cacheKey = `compatibility_${selectedSign1}_${selectedSign2}`;
      const cachedResult = loadFromCache(cacheKey);
      
      if (cachedResult) {
        console.log('✅ Результат совместимости из кеша');
        setCompatibilityResult(cachedResult);
        setShowResult(true);
        
        // Анимация сердечек
        setTimeout(() => setAnimateHearts(true), 500);
        
        hapticFeedback('notification', 'success');
        return;
      }
      
      // Получаем данные с API
      const result = await checkCompatibility(selectedSign1, selectedSign2);
      
      // Дополняем данными знаков
      const enrichedResult = {
        ...result,
        sign1Data: getSignData(selectedSign1),
        sign2Data: getSignData(selectedSign2),
        timestamp: Date.now()
      };
      
      // Сохраняем в кеш
      saveToCache(cacheKey, enrichedResult);
      
      setCompatibilityResult(enrichedResult);
      setShowResult(true);
      
      // Анимация сердечек
      setTimeout(() => setAnimateHearts(true), 500);
      
      // Прокручиваем к результату
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
      
      hapticFeedback('notification', 'success');
      console.log('✅ Совместимость рассчитана:', enrichedResult);
      
    } catch (err) {
      console.error('❌ Ошибка расчета совместимости:', err);
      hapticFeedback('notification', 'error');
      showToast('Произошла ошибка при расчете совместимости');
    } finally {
      setIsCalculating(false);
    }
  };

  // Сбросить результат и начать заново
  const handleReset = () => {
    setCompatibilityResult(null);
    setShowResult(false);
    setAnimateHearts(false);
    hasCalculatedRef.current = false;
    hapticFeedback('impact', 'light');
  };

  // Добавить в избранное
  const handleAddToFavorites = () => {
    if (compatibilityResult && onAddToFavorites) {
      const favoriteItem = {
        id: Date.now(),
        type: 'compatibility',
        title: `💕 ${selectedSign1} + ${selectedSign2}`,
        content: `Совместимость ${compatibilityResult.percentage}% - ${compatibilityResult.description}`,
        date: new Date().toLocaleDateString('ru-RU'),
        source: compatibilityResult.source || 'offline'
      };
      
      onAddToFavorites(favoriteItem);
      showToast('❤️ Совместимость добавлена в избранное!');
      hapticFeedback('impact', 'light');
    }
  };

  // Поделиться результатом
  const handleShare = () => {
    if (compatibilityResult && telegramApp) {
      const shareText = `💕 Совместимость знаков:\n${selectedSign1} ${compatibilityResult.sign1Data.emoji} + ${selectedSign2} ${compatibilityResult.sign2Data.emoji}\n\n🔥 Результат: ${compatibilityResult.percentage}%\n\n${compatibilityResult.description}\n\n🧙‍♂️ #ГномийГороскоп #Совместимость`;
      
      telegramApp.sendData(JSON.stringify({
        action: 'share_compatibility',
        sign1: selectedSign1,
        sign2: selectedSign2,
        percentage: compatibilityResult.percentage,
        description: compatibilityResult.description
      }));
      
      hapticFeedback('impact', 'medium');
    }
  };

  return (
    <div className="compatibility-view content-enter">
      <div className="card">
        <div className="content-header">
          <h3 className="content-title">💕 Совместимость знаков</h3>
          <p className="content-subtitle">Узнайте, насколько вы подходите друг другу</p>
        </div>

        {/* Селекторы знаков */}
        <div className="compatibility-selectors">
          {/* Первый знак - ВЫ */}
          <div className="sign-selector">
            <h4 className="selector-title">👤 Ваш знак</h4>
            <ZodiacCarousel
              signs={zodiacSigns}
              selectedSign={selectedSign1}
              onSignChange={setSelectedSign1}
              color="primary"
              hapticFeedback={hapticFeedback}
            />
          </div>

          {/* Иконка плюс */}
          <div className="compatibility-plus">
            <div className="plus-icon">
              <span className="plus-heart">💖</span>
              <span className="plus-symbol">+</span>
            </div>
          </div>

          {/* Второй знак - ПАРТНЕР */}
          <div className="sign-selector">
            <h4 className="selector-title">💑 Знак партнера</h4>
            <ZodiacCarousel
              signs={zodiacSigns}
              selectedSign={selectedSign2}
              onSignChange={setSelectedSign2}
              color="secondary"
              hapticFeedback={hapticFeedback}
            />
          </div>
        </div>

        {/* Кнопка расчета */}
        {!showResult && (
          <div className="calculate-section">
            <button 
              className={`btn-calculate ${isCalculating ? 'calculating' : ''}`}
              onClick={handleCalculateCompatibility}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <span className="loading-spinner"></span>
                  Гном-астролог вычисляет...
                </>
              ) : (
                <>
                  <span className="calculate-icon">🔮</span>
                  Узнать совместимость
                </>
              )}
            </button>
            
            <p className="calculate-hint">
              💡 Результат основан на астрологических расчетах и древней мудрости гномов
            </p>
          </div>
        )}

        {/* Результат совместимости */}
        {showResult && compatibilityResult && (
          <div ref={resultRef} className={`compatibility-result ${animateHearts ? 'animated' : ''}`}>
            {/* Летающие сердечки */}
            {animateHearts && (
              <div className="floating-hearts">
                <div className="heart heart-1">💖</div>
                <div className="heart heart-2">💕</div>
                <div className="heart heart-3">💗</div>
                <div className="heart heart-4">💓</div>
                <div className="heart heart-5">💝</div>
              </div>
            )}

            {/* Заголовок результата */}
            <div className="result-header">
              <h3 className="result-title">Результат совместимости</h3>
              <div className="result-signs">
                <div className="result-sign" style={{ '--sign-color': compatibilityResult.sign1Data.color }}>
                  <span className="result-emoji">{compatibilityResult.sign1Data.emoji}</span>
                  <span className="result-name">{selectedSign1}</span>
                </div>
                <div className="result-plus">💖</div>
                <div className="result-sign" style={{ '--sign-color': compatibilityResult.sign2Data.color }}>
                  <span className="result-emoji">{compatibilityResult.sign2Data.emoji}</span>
                  <span className="result-name">{selectedSign2}</span>
                </div>
              </div>
            </div>

            {/* Процент совместимости */}
            <div className="compatibility-score">
              <div className="score-circle">
                <svg className="score-svg" width="120" height="120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(139, 195, 74, 0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#compatibility-gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - compatibilityResult.percentage / 100)}`}
                    className="score-progress"
                  />
                  <defs>
                    <linearGradient id="compatibility-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8BC34A" />
                      <stop offset="100%" stopColor="#FFC107" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="score-content">
                  <span className="score-percentage">{compatibilityResult.percentage}%</span>
                  <span className="score-emoji">{compatibilityResult.emoji}</span>
                </div>
              </div>
              
              <div className="score-bars">
                <div className="score-bar">
                  <span className="bar-label">Любовь</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill love"
                      style={{ width: `${Math.min(compatibilityResult.percentage + 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="score-bar">
                  <span className="bar-label">Дружба</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill friendship"
                      style={{ width: `${Math.max(compatibilityResult.percentage - 5, 10)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="score-bar">
                  <span className="bar-label">Общение</span>
                  <div className="bar-track">
                    <div 
                      className="bar-fill communication"
                      style={{ width: `${compatibilityResult.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Описание совместимости */}
            <div className="compatibility-description">
              <h4 className="description-title">💫 Астрологический анализ</h4>
              <p className="description-text">{compatibilityResult.description}</p>
              
              {compatibilityResult.advice && (
                <div className="compatibility-advice">
                  <span className="advice-icon">💡</span>
                  <p className="advice-text">{compatibilityResult.advice}</p>
                </div>
              )}
            </div>

            {/* Источник данных */}
            <div className="result-source">
              {compatibilityResult.source === 'offline' ? (
                <span className="source-badge offline">📱 Расчетные данные</span>
              ) : (
                <span className="source-badge online">🌐 Астрологические данные</span>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="result-actions">
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
                  title="Поделиться результатом"
                >
                  📤 Поделиться
                </button>
              )}
              
              <button 
                className="btn-secondary" 
                onClick={handleReset}
                title="Попробовать с другими знаками"
              >
                🔄 Еще раз
              </button>
            </div>
          </div>
        )}

        {/* Кнопка назад */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onBack}>
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}

// Компонент карусели знаков зодиака
function ZodiacCarousel({ signs, selectedSign, onSignChange, color, hapticFeedback }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Находим индекс выбранного знака
  useEffect(() => {
    const index = signs.findIndex(s => s.sign === selectedSign);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [selectedSign, signs]);

  // Переключение знака
  const handleSignChange = (direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % signs.length
      : (currentIndex - 1 + signs.length) % signs.length;
    
    setCurrentIndex(newIndex);
    onSignChange(signs[newIndex].sign);
    hapticFeedback('selection');
    
    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentSign = signs[currentIndex];

  return (
    <div className="zodiac-carousel-mini">
      <button 
        className="carousel-nav prev"
        onClick={() => handleSignChange('prev')}
        disabled={isAnimating}
      >
        ‹
      </button>
      
      <div className={`carousel-item ${color} ${isAnimating ? 'animating' : ''}`}>
        <div 
          className="sign-card-mini"
          style={{ '--sign-color': currentSign.color }}
        >
          <div className="sign-emoji-large">{currentSign.emoji}</div>
          <div className="sign-info-mini">
            <h5 className="sign-name-mini">{currentSign.sign}</h5>
            <span className="sign-element-mini">{currentSign.element}</span>
          </div>
        </div>
      </div>
      
      <button 
        className="carousel-nav next"
        onClick={() => handleSignChange('next')}
        disabled={isAnimating}
      >
        ›
      </button>
    </div>
  );
}

export default CompatibilityView;
