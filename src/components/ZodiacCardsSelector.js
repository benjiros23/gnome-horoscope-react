// src/components/ZodiacCardsSelector.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/carousel.css';

const ZodiacCardsSelector = ({ 
  onSignSelect, 
  selectedSign = null,
  showTitle = true,
  compact = false 
}) => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [tapCount, setTapCount] = useState(0);
  const [tapTimer, setTapTimer] = useState(null);
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);

  // Данные знаков зодиака
  const zodiacSigns = [
    { id: 'aries', sign: 'Овен', emoji: '♈', dates: '21.03 - 20.04', element: 'Огонь',
      gnome: { name: 'Гном Огнебород', title: 'Боевой кузнец', image: 'aries.png', colors: ['#FF6B6B', '#FF8E53'] }},
    { id: 'taurus', sign: 'Телец', emoji: '♉', dates: '21.04 - 20.05', element: 'Земля',
      gnome: { name: 'Гном Златоруд', title: 'Мастер сокровищ', image: 'taurus.png', colors: ['#4ECDC4', '#44A08D'] }},
    { id: 'gemini', sign: 'Близнецы', emoji: '♊', dates: '21.05 - 21.06', element: 'Воздух',
      gnome: { name: 'Гном Двойняшка', title: 'Мастер слова', image: 'gemini.png', colors: ['#A8E6CF', '#7FCDCD'] }},
    { id: 'cancer', sign: 'Рак', emoji: '♋', dates: '22.06 - 22.07', element: 'Вода',
      gnome: { name: 'Гном Домовой', title: 'Хранитель очага', image: 'cancer.png', colors: ['#FFB6C1', '#FFA07A'] }},
    { id: 'leo', sign: 'Лев', emoji: '♌', dates: '23.07 - 22.08', element: 'Огонь',
      gnome: { name: 'Гном Златогрив', title: 'Король подземелий', image: 'leo.png', colors: ['#FF6B6B', '#FF8E53'] }},
    { id: 'virgo', sign: 'Дева', emoji: '♍', dates: '23.08 - 22.09', element: 'Земля',
      gnome: { name: 'Гном Аккуратный', title: 'Мастер деталей', image: 'virgo.png', colors: ['#4ECDC4', '#44A08D'] }},
    { id: 'libra', sign: 'Весы', emoji: '♎', dates: '23.09 - 22.10', element: 'Воздух',
      gnome: { name: 'Гном Справедливый', title: 'Судья гор', image: 'libra.png', colors: ['#A8E6CF', '#7FCDCD'] }},
    { id: 'scorpio', sign: 'Скорпион', emoji: '♏', dates: '23.10 - 22.11', element: 'Вода',
      gnome: { name: 'Гном Тайновед', title: 'Хранитель секретов', image: 'scorpio.png', colors: ['#FFB6C1', '#FFA07A'] }},
    { id: 'sagittarius', sign: 'Стрелец', emoji: '♐', dates: '23.11 - 21.12', element: 'Огонь',
      gnome: { name: 'Гном Путешественник', title: 'Исследователь пещер', image: 'sagittarius.png', colors: ['#FF6B6B', '#FF8E53'] }},
    { id: 'capricorn', sign: 'Козерог', emoji: '♑', dates: '22.12 - 20.01', element: 'Земля',
      gnome: { name: 'Гном Горовосходитель', title: 'Строитель империй', image: 'capricorn.png', colors: ['#4ECDC4', '#44A08D'] }},
    { id: 'aquarius', sign: 'Водолей', emoji: '♒', dates: '21.01 - 19.02', element: 'Воздух',
      gnome: { name: 'Гном Изобретатель', title: 'Гений механизмов', image: 'aquarius.png', colors: ['#A8E6CF', '#7FCDCD'] }},
    { id: 'pisces', sign: 'Рыбы', emoji: '♓', dates: '20.02 - 20.03', element: 'Вода',
      gnome: { name: 'Гном Мечтатель', title: 'Пророк глубин', image: 'pisces.png', colors: ['#FFB6C1', '#FFA07A'] }}
  ];

  // Создаем расширенный массив для плавного зацикливания
  const extendedSigns = [
    ...zodiacSigns.slice(-2), // Последние 2 элемента в начале
    ...zodiacSigns,           // Основной массив
    ...zodiacSigns.slice(0, 2) // Первые 2 элемента в конце
  ];
  
  // Корректируем активный индекс для расширенного массива
  const extendedActiveIndex = activeIndex + 2;

  // Отслеживание размера экрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ ОБРАБОТЧИК ДВОЙНОГО КЛИКА
  const handleDoubleClick = () => {
    handleSignSelect();
  };

  // ✅ ОБРАБОТЧИК ДВОЙНОГО ТАПА ДЛЯ МОБИЛЬНЫХ
  const handleTouchEnd = () => {
    setTapCount(prev => prev + 1);
    
    if (tapCount === 0) {
      setTapTimer(setTimeout(() => {
        setTapCount(0);
      }, 300));
    } else if (tapCount === 1) {
      clearTimeout(tapTimer);
      setTapCount(0);
      handleSignSelect();
    }
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (tapTimer) {
        clearTimeout(tapTimer);
      }
    };
  }, [tapTimer]);

  // Инициализация позиции скролла для зацикленной карусели
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = isMobile ? 260 : 280;
      const gap = isMobile ? 16 : 20;
      const itemWidth = cardWidth + gap;
      
      // Устанавливаем начальную позицию на первый реальный элемент (индекс 2 в extended array)
      const initialPosition = 2 * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);
      container.scrollLeft = initialPosition;
    }
  }, [isMobile]);

  // Обработчик прокрутки с плавным зацикливанием
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = isMobile ? 260 : 280;
    const gap = isMobile ? 16 : 20;
    const itemWidth = cardWidth + gap;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
      const scrollLeft = container.scrollLeft;
      const centerPosition = scrollLeft + container.clientWidth / 2;
      
      // Определяем индекс в расширенном массиве
      const extendedIndex = Math.round((centerPosition - (isMobile ? 50 : 60)) / itemWidth);
      
      // Преобразуем в реальный индекс зодиака
      let realIndex;
      if (extendedIndex < 2) {
        realIndex = zodiacSigns.length + extendedIndex - 2;
      } else if (extendedIndex >= zodiacSigns.length + 2) {
        realIndex = extendedIndex - zodiacSigns.length - 2;
      } else {
        realIndex = extendedIndex - 2;
      }
      
      realIndex = Math.max(0, Math.min(realIndex, zodiacSigns.length - 1));
      
      if (realIndex !== activeIndex) {
        setActiveIndex(realIndex);
        
        // Haptic feedback
        const tg = window.Telegram?.WebApp;
        if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
          try {
            tg.HapticFeedback.impactOccurred('light');
          } catch (e) {}
        }
      }
      
      // Плавное зацикливание при достижении краев
      if (extendedIndex <= 0) {
        // Перемещаемся к концу основного массива без анимации
        setTimeout(() => {
          const newPosition = (zodiacSigns.length + 1) * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);
          container.scrollTo({ left: newPosition, behavior: 'auto' });
        }, 150);
      } else if (extendedIndex >= extendedSigns.length - 1) {
        // Перемещаемся к началу основного массива без анимации
        setTimeout(() => {
          const newPosition = 2 * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);
          container.scrollTo({ left: newPosition, behavior: 'auto' });
        }, 150);
      }
    }, 100);
  }, [isMobile, activeIndex, zodiacSigns.length, extendedSigns.length]);

  // Навигация стрелками с плавным зацикливанием
  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = isMobile ? 260 : 280;
    const gap = isMobile ? 16 : 20;
    const itemWidth = cardWidth + gap;

    // Преобразуем реальный индекс в расширенный
    const extendedIndex = index + 2;
    const targetScroll = extendedIndex * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setActiveIndex(index);
  }, [isMobile]);

  // Зацикленная навигация
  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : zodiacSigns.length - 1; // Зацикливание
    scrollToIndex(newIndex);
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  const handleNext = () => {
    const newIndex = activeIndex < zodiacSigns.length - 1 ? activeIndex + 1 : 0; // Зацикливание
    scrollToIndex(newIndex);
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  // Определение класса карточки для расширенного массива
  const getCardClass = (extendedIndex) => {
    // Преобразуем расширенный индекс в реальный
    let realIndex;
    if (extendedIndex < 2) {
      realIndex = zodiacSigns.length + extendedIndex - 2;
    } else if (extendedIndex >= zodiacSigns.length + 2) {
      realIndex = extendedIndex - zodiacSigns.length - 2;
    } else {
      realIndex = extendedIndex - 2;
    }
    
    const isActive = realIndex === activeIndex;
    const isNearby = Math.abs(realIndex - activeIndex) === 1 || 
                     (activeIndex === 0 && realIndex === zodiacSigns.length - 1) ||
                     (activeIndex === zodiacSigns.length - 1 && realIndex === 0);
    
    let className = 'modern-carousel-card';
    if (isActive) className += ' active';
    else if (isNearby) className += ' nearby';
    
    return className;
  };

  // Обработчик выбора знака
  const handleSignSelect = () => {
    const selectedSign = zodiacSigns[activeIndex];
    
    if (onSignSelect) {
      onSignSelect(selectedSign);
    }

    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }

    localStorage.setItem('gnome-selected-sign', JSON.stringify(selectedSign));
    console.log('🔮 Выбран знак:', selectedSign);
  };

  const getCurrentSign = () => zodiacSigns[activeIndex];

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: isMobile ? '10px' : '20px',
      paddingBottom: '120px',
      justifyContent: 'flex-start',
      boxSizing: 'border-box',
      overflow: 'visible'
    }}>
      
      {/* Заголовок */}
      {showTitle && (
        <div style={{
          textAlign: 'center',
          marginBottom: theme.spacing.md,
          padding: `0 ${theme.spacing.md}`,
          flexShrink: 0
        }}>
          <h1 style={{
            fontSize: isMobile ? theme.typography.sizes.lg : theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            margin: 0
          }}>
            🔮 Выберите знак зодиака
          </h1>
          <p style={{
            fontSize: isMobile ? theme.typography.sizes.sm : theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            margin: 0,
            textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
          }}>
            {isMobile ? "Прокрутите или двойной тап для выбора" : "Прокрутите или используйте стрелки, двойной клик для выбора"}
          </p>
        </div>
      )}

      {/* Карусель */}
      <div className="modern-carousel-container">
        
        {/* Левая стрелка */}
        <div className="carousel-arrow left" onClick={handlePrevious}>
          ←
        </div>
        
        {/* Правая стрелка */}
        <div className="carousel-arrow right" onClick={handleNext}>
          →
        </div>
        
        {/* Трек с карточками */}
        <div
          ref={scrollRef}
          className="carousel-track"
          onScroll={handleScroll}
        >
          {extendedSigns.map((sign, extendedIndex) => {
            // Определяем реальный индекс для проверки активности
            let realIndex;
            if (extendedIndex < 2) {
              realIndex = zodiacSigns.length + extendedIndex - 2;
            } else if (extendedIndex >= zodiacSigns.length + 2) {
              realIndex = extendedIndex - zodiacSigns.length - 2;
            } else {
              realIndex = extendedIndex - 2;
            }
            
            return (
              <div
                key={`${sign.id}-${extendedIndex}`}
                className={getCardClass(extendedIndex)}
                onDoubleClick={handleDoubleClick}
                onTouchEnd={handleTouchEnd}
                style={{ 
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
              <img
                src={`${process.env.PUBLIC_URL || ''}/assets/gnomes/${sign.gnome.image}`}
                alt={sign.gnome.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      height: 100%; 
                      font-size: 4rem; 
                      background: linear-gradient(135deg, ${sign.gnome.colors[0]}, ${sign.gnome.colors[1]});
                      color: white;
                      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                      border-radius: 16px;
                    ">
                      ${sign.emoji}
                    </div>
                    <div class="card-gradient"></div>
                    <div class="element-badge">${sign.element}</div>
                    <div class="card-text-area">
                      <h3 class="card-sign-name">${sign.sign}</h3>
                      <p class="card-dates">${sign.dates}</p>
                      <h4 class="card-gnome-name">${sign.gnome.name}</h4>
                      <p class="card-gnome-title">${sign.gnome.title}</p>
                      ${realIndex === activeIndex ? `<div style="
                        position: absolute; 
                        bottom: -15px; 
                        left: 50%; 
                        transform: translateX(-50%); 
                        font-size: 11px; 
                        color: rgba(255,255,255,0.7); 
                        font-style: italic; 
                        text-align: center;
                      ">${isMobile ? "Двойной тап для выбора" : "Двойной клик для выбора"}</div>` : ''}
                    </div>`;
                }}
                loading="lazy"
              />
              
              <div className="card-gradient" />
              
              <div className="element-badge">
                {sign.element}
              </div>

              <div className="card-text-area">
                <h3 className="card-sign-name">{sign.sign}</h3>
                <p className="card-dates">{sign.dates}</p>
                <h4 className="card-gnome-name">{sign.gnome.name}</h4>
                <p className="card-gnome-title">{sign.gnome.title}</p>
                
                {realIndex === activeIndex && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-15px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.7)',
                    fontStyle: 'italic',
                    textAlign: 'center'
                  }}>
                    {isMobile ? "Двойной тап для выбора" : "Двойной клик для выбора"}
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
        
        {/* Индикаторы зацикленной карусели */}
        <div className="carousel-indicators">
          {zodiacSigns.map((_, index) => (
            <div
              key={index}
              className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
              style={{
                opacity: index === activeIndex ? 1 : 0.6
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ZodiacCardsSelector;
