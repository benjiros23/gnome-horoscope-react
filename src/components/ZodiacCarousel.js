import React, { useState, useEffect } from 'react';

const ZODIAC_SIGNS = [
  { sign: 'Овен', emoji: '♈', dates: '21.03-20.04', color: '#FF6B6B', element: 'Огонь' },
  { sign: 'Телец', emoji: '♉', dates: '21.04-20.05', color: '#4ECDC4', element: 'Земля' },
  { sign: 'Близнецы', emoji: '♊', dates: '21.05-21.06', color: '#45B7D1', element: 'Воздух' },
  { sign: 'Рак', emoji: '♋', dates: '22.06-22.07', color: '#96CEB4', element: 'Вода' },
  { sign: 'Лев', emoji: '♌', dates: '23.07-22.08', color: '#FECA57', element: 'Огонь' },
  { sign: 'Дева', emoji: '♍', dates: '23.08-22.09', color: '#48CAE4', element: 'Земля' },
  { sign: 'Весы', emoji: '♎', dates: '23.09-22.10', color: '#F38BA8', element: 'Воздух' },
  { sign: 'Скорпион', emoji: '♏', dates: '23.10-22.11', color: '#A8DADC', element: 'Вода' },
  { sign: 'Стрелец', emoji: '♐', dates: '23.11-21.12', color: '#F1C0E8', element: 'Огонь' },
  { sign: 'Козерог', emoji: '♑', dates: '22.12-20.01', color: '#CFBAF0', element: 'Земля' },
  { sign: 'Водолей', emoji: '♒', dates: '21.01-19.02', color: '#A3C4F3', element: 'Воздух' },
  { sign: 'Рыбы', emoji: '♓', dates: '20.02-20.03', color: '#90DBF4', element: 'Вода' }
];

function ZodiacCarousel({ selectedSign, onSignChange, telegramApp }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Находим индекс выбранного знака при монтировании
  useEffect(() => {
    const index = ZODIAC_SIGNS.findIndex(item => item.sign === selectedSign);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [selectedSign]);

  // Haptic feedback
  const hapticFeedback = (type = 'selection') => {
    if (telegramApp?.HapticFeedback) {
      try {
        if (type === 'selection') {
          telegramApp.HapticFeedback.selectionChanged();
        } else {
          telegramApp.HapticFeedback.impactOccurred('light');
        }
      } catch (e) {
        console.log('Haptic feedback недоступен:', e.message);
      }
    }
  };

  // Переключение на предыдущий знак
  const handlePrevious = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newIndex = (currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length;
    setCurrentIndex(newIndex);
    onSignChange(ZODIAC_SIGNS[newIndex].sign);
    hapticFeedback('selection');

    setTimeout(() => setIsAnimating(false), 300);
  };

  // Переключение на следующий знак
  const handleNext = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const newIndex = (currentIndex + 1) % ZODIAC_SIGNS.length;
    setCurrentIndex(newIndex);
    onSignChange(ZODIAC_SIGNS[newIndex].sign);
    hapticFeedback('selection');

    setTimeout(() => setIsAnimating(false), 300);
  };

  // Прямой выбор знака по индикатору
  const handleSelectSign = (index) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setCurrentIndex(index);
    onSignChange(ZODIAC_SIGNS[index].sign);
    hapticFeedback('impact');

    setTimeout(() => setIsAnimating(false), 300);
  };

  const currentSign = ZODIAC_SIGNS[currentIndex];

  return (
    <div className="zodiac-carousel">
      <div className="carousel-header">
        <h3>Выберите ваш знак зодиака</h3>
        <p className="carousel-subtitle">Листайте или нажимайте на точки внизу</p>
      </div>

      <div className="carousel-container">
        {/* Кнопка "Назад" */}
        <button 
          className="carousel-nav-btn carousel-prev"
          onClick={handlePrevious}
          disabled={isAnimating}
          aria-label="Предыдущий знак"
        >
          <span className="nav-arrow">‹</span>
        </button>

        {/* Основная карточка знака */}
        <div className="carousel-main-item">
          <div 
            className={`sign-card ${isAnimating ? 'animating' : ''}`}
            style={{ '--sign-color': currentSign.color }}
          >
            <div className="sign-icon-container">
              <div className="sign-icon">{currentSign.emoji}</div>
              <div className="icon-glow"></div>
            </div>
            
            <div className="sign-info">
              <h2 className="sign-name">{currentSign.sign}</h2>
              <p className="sign-dates">{currentSign.dates}</p>
              <span className="sign-element">{currentSign.element}</span>
            </div>

            {/* Декоративные элементы */}
            <div className="card-decorations">
              <div className="star star-1">✨</div>
              <div className="star star-2">⭐</div>
              <div className="star star-3">🌟</div>
            </div>
          </div>
        </div>

        {/* Кнопка "Вперед" */}
        <button 
          className="carousel-nav-btn carousel-next"
          onClick={handleNext}
          disabled={isAnimating}
          aria-label="Следующий знак"
        >
          <span className="nav-arrow">›</span>
        </button>
      </div>

      {/* Превью соседних знаков */}
      <div className="carousel-preview">
        <div className="preview-item prev-preview">
          <span className="preview-emoji">
            {ZODIAC_SIGNS[(currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length].emoji}
          </span>
          <span className="preview-name">
            {ZODIAC_SIGNS[(currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length].sign}
          </span>
        </div>

        <div className="preview-current">
          <div className="current-indicator">Выбран</div>
        </div>

        <div className="preview-item next-preview">
          <span className="preview-emoji">
            {ZODIAC_SIGNS[(currentIndex + 1) % ZODIAC_SIGNS.length].emoji}
          </span>
          <span className="preview-name">
            {ZODIAC_SIGNS[(currentIndex + 1) % ZODIAC_SIGNS.length].sign}
          </span>
        </div>
      </div>

      {/* Индикаторы точек */}
      <div className="carousel-indicators">
        {ZODIAC_SIGNS.map((sign, index) => (
          <button
            key={sign.sign}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleSelectSign(index)}
            disabled={isAnimating}
            aria-label={`Выбрать ${sign.sign}`}
            title={`${sign.sign} (${sign.dates})`}
          >
            <span className="indicator-emoji">{sign.emoji}</span>
          </button>
        ))}
      </div>

      {/* Подсказка */}
      <div className="carousel-hint">
        <small>
          💡 Подсказка: смахивайте влево-вправо для быстрого переключения
        </small>
      </div>
    </div>
  );
}

export default ZodiacCarousel;
