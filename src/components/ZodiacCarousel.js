import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

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
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const index = ZODIAC_SIGNS.findIndex(item => item.sign === selectedSign);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [selectedSign]);

  const hapticFeedback = (type = 'selection') => {
    try {
      if (telegramApp?.HapticFeedback && parseFloat(telegramApp.version) >= 6.1) {
        if (type === 'selection') {
          telegramApp.HapticFeedback.selectionChanged();
        } else {
          telegramApp.HapticFeedback.impactOccurred('light');
        }
      }
    } catch (e) {}
  };

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = (currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length;
    setCurrentIndex(newIndex);
    onSignChange(ZODIAC_SIGNS[newIndex].sign);
    hapticFeedback('selection');
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const newIndex = (currentIndex + 1) % ZODIAC_SIGNS.length;
    setCurrentIndex(newIndex);
    onSignChange(ZODIAC_SIGNS[newIndex].sign);
    hapticFeedback('selection');
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleSelectSign = (index) => {
    if (isAnimating || index === currentIndex) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    onSignChange(ZODIAC_SIGNS[index].sign);
    hapticFeedback('impact');
    setTimeout(() => setIsAnimating(false), 400);
  };

  const currentSign = ZODIAC_SIGNS[currentIndex];

  // Стили на основе темы
  const getStyles = () => {
    const elementColor = currentSign.color;
    
    return {
      container: {
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        fontFamily: theme.container.fontFamily
      },
      
      header: {
        textAlign: 'center',
        marginBottom: '20px'
      },
      
      title: {
        ...theme.typography.subtitle,
        color: theme.name === 'wooden' ? '#8b4513' : theme.colors.text.primary,
        marginBottom: '8px'
      },
      
      subtitle: {
        ...theme.typography.small,
        color: theme.name === 'wooden' ? '#a0522d' : theme.colors.text.secondary,
        opacity: 0.8
      },
      
      carouselContainer: {
        ...theme.card,
        position: 'relative',
        overflow: 'hidden',
        padding: '24px',
        margin: '0'
      },
      
      signCard: {
        background: theme.name === 'wooden' 
          ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))'
          : `linear-gradient(135deg, ${elementColor}15, ${elementColor}05)`,
        backdropFilter: 'blur(12px)',
        borderRadius: '20px',
        border: theme.name === 'wooden' 
          ? '2px solid rgba(139, 69, 19, 0.3)'
          : `2px solid ${elementColor}40`,
        padding: '24px',
        textAlign: 'center',
        color: theme.name === 'wooden' ? '#3e2723' : theme.colors.text.primary,
        boxShadow: theme.name === 'wooden' 
          ? 'inset 0 2px 8px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.15)'
          : `0 8px 24px ${elementColor}20, inset 0 1px 0 rgba(255,255,255,0.2)`,
        transform: isAnimating ? 'scale(0.95) rotateY(10deg)' : 'scale(1) rotateY(0deg)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      },
      
      navButton: {
        ...theme.button.primary,
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        fontSize: '20px',
        fontWeight: '600',
        zIndex: 10,
        padding: '0',
        minWidth: 'auto'
      }
    };
  };

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Выберите ваш знак зодиака</h3>
        <p style={styles.subtitle}>Листайте или выберите из списка ниже</p>
      </div>

      <div style={styles.carouselContainer}>
        {/* Деревянная текстура для wooden темы */}
        {theme.name === 'wooden' && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            ...theme.texture
          }}></div>
        )}

        {/* Кнопка назад */}
        <button 
          style={{...styles.navButton, left: '-25px'}}
          onClick={handlePrevious}
          disabled={isAnimating}
        >
          ‹
        </button>

        {/* Основная карточка знака */}
        <div style={styles.signCard}>
          {/* Иконка знака */}
          <div style={{
            fontSize: '64px',
            marginBottom: '16px',
            filter: theme.name === 'glass' 
              ? `drop-shadow(0 0 20px ${currentSign.color}80)` 
              : theme.name === 'wooden'
                ? 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                : 'none',
            transition: 'all 0.3s ease',
            transform: isAnimating ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}>
            {currentSign.emoji}
          </div>
          
          {/* Анимированное кольцо для glass темы */}
          {theme.name === 'glass' && (
            <div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -60px)',
              width: '100px', height: '100px',
              border: `2px solid ${currentSign.color}60`,
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite',
              pointerEvents: 'none'
            }}></div>
          )}

          {/* Информация о знаке */}
          <h2 style={{
            ...theme.typography.title,
            color: theme.name === 'wooden' ? '#3e2723' : currentSign.color,
            marginBottom: '8px'
          }}>
            {currentSign.sign}
          </h2>
          
          <p style={{
            ...theme.typography.caption,
            marginBottom: '12px'
          }}>
            {currentSign.dates}
          </p>
          
          <span style={{
            background: theme.name === 'wooden' 
              ? 'rgba(139, 69, 19, 0.2)' 
              : `${currentSign.color}20`,
            color: theme.name === 'wooden' ? '#8b4513' : currentSign.color,
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            border: theme.name === 'wooden' 
              ? '1px solid rgba(139, 69, 19, 0.3)' 
              : `1px solid ${currentSign.color}40`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {currentSign.element}
          </span>
        </div>

        {/* Кнопка вперед */}
        <button 
          style={{...styles.navButton, right: '-25px'}}
          onClick={handleNext}
          disabled={isAnimating}
        >
          ›
        </button>
      </div>

      {/* Превью соседних знаков */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '16px',
        padding: '0 40px'
      }}>
        <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '12px' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>
            {ZODIAC_SIGNS[(currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length].emoji}
          </div>
          <span>{ZODIAC_SIGNS[(currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length].sign}</span>
        </div>

        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: '600',
          color: theme.name === 'wooden' ? '#8b4513' : currentSign.color
        }}>
          Выбран
        </div>

        <div style={{ textAlign: 'center', opacity: 0.6, fontSize: '12px' }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>
            {ZODIAC_SIGNS[(currentIndex + 1) % ZODIAC_SIGNS.length].emoji}
          </div>
          <span>{ZODIAC_SIGNS[(currentIndex + 1) % ZODIAC_SIGNS.length].sign}</span>
        </div>
      </div>

      {/* Индикаторы-эмодзи */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '20px',
        padding: '16px',
        ...theme.card,
        margin: '16px 0 0 0'
      }}>
        {theme.name === 'wooden' && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            ...theme.texture
          }}></div>
        )}
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {ZODIAC_SIGNS.map((sign, index) => (
            <button
              key={sign.sign}
              onClick={() => handleSelectSign(index)}
              disabled={isAnimating}
              title={`${sign.sign} (${sign.dates})`}
              style={{
                background: index === currentIndex 
                  ? (theme.name === 'wooden' 
                    ? 'linear-gradient(135deg, #8b4513, #a0522d)' 
                    : `linear-gradient(135deg, ${sign.color}40, ${sign.color}20)`)
                  : 'transparent',
                border: index === currentIndex 
                  ? (theme.name === 'wooden' ? '2px solid #654321' : `2px solid ${sign.color}60`)
                  : '2px solid transparent',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)',
                boxShadow: index === currentIndex 
                  ? `0 4px 12px ${theme.name === 'wooden' ? 'rgba(139, 69, 19, 0.3)' : sign.color}40`
                  : 'none',
                filter: index === currentIndex 
                  ? (theme.name === 'glass' ? `drop-shadow(0 0 8px ${sign.color}80)` : 'none')
                  : 'grayscale(50%)',
                opacity: index === currentIndex ? 1 : 0.7
              }}
            >
              {sign.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* CSS анимации */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -60px) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -60px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default ZodiacCarousel;
