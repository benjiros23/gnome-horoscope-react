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

function ZodiacCarousel({ selectedSign, onSignChange, telegramApp, designTheme = 'glass' }) {
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
    } catch (e) {
      console.log('Haptic недоступен');
    }
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

  // Стили в зависимости от темы
  const getStyles = () => {
    const baseStyles = {
      container: {
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        fontFamily: designTheme === 'wooden' ? '"Times New Roman", Georgia, serif' : 'system-ui, sans-serif'
      },
      header: {
        textAlign: 'center',
        marginBottom: '20px'
      },
      title: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '8px',
        color: designTheme === 'wooden' ? '#8b4513' : '#2d3748',
        letterSpacing: designTheme === 'wooden' ? '1px' : '0.5px',
        textTransform: designTheme === 'wooden' ? 'uppercase' : 'none'
      },
      subtitle: {
        fontSize: '14px',
        color: designTheme === 'wooden' ? '#a0522d' : '#4a5568',
        opacity: 0.8
      }
    };

    if (designTheme === 'wooden') {
      return {
        ...baseStyles,
        carouselContainer: {
          background: 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
          borderRadius: '20px',
          border: '3px solid #8b4513',
          boxShadow: `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
            0 8px 24px 0 rgba(0, 0, 0, 0.25)
          `,
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        },
        signCard: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
          backdropFilter: 'blur(8px)',
          borderRadius: '16px',
          border: '2px solid rgba(139, 69, 19, 0.3)',
          padding: '20px',
          textAlign: 'center',
          color: '#3e2723',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.15)',
          transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        navButton: {
          background: 'linear-gradient(135deg, #8b4513, #a0522d)',
          border: '2px solid #654321',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease',
          zIndex: 10
        }
      };
    } else {
      return {
        ...baseStyles,
        carouselContainer: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden'
        },
        signCard: {
          background: `linear-gradient(135deg, ${currentSign.color}15, ${currentSign.color}05)`,
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          border: `2px solid ${currentSign.color}40`,
          padding: '24px',
          textAlign: 'center',
          color: '#2d3748',
          boxShadow: `0 8px 24px ${currentSign.color}20, inset 0 1px 0 rgba(255,255,255,0.2)`,
          transform: isAnimating ? 'scale(0.95) rotateY(10deg)' : 'scale(1) rotateY(0deg)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          perspective: '1000px'
        },
        navButton: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: '#2d3748',
          fontSize: '20px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 10
        }
      };
    }
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
        {designTheme === 'wooden' && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 3px, rgba(0,0,0,0.05) 4px)
            `,
            opacity: 0.6,
            pointerEvents: 'none'
          }}></div>
        )}

        {/* Кнопка назад */}
        <button 
          style={{...styles.navButton, left: '-25px'}}
          onClick={handlePrevious}
          disabled={isAnimating}
          onMouseEnter={(e) => {
            if (!isAnimating) {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = designTheme === 'wooden' 
                ? '0 6px 16px rgba(0,0,0,0.4)' 
                : '0 6px 20px rgba(0,0,0,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = designTheme === 'wooden'
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 16px rgba(0,0,0,0.1)';
          }}
        >
          ‹
        </button>

        {/* Основная карточка знака */}
        <div style={styles.signCard}>
          {/* Иконка знака с глоу-эффектом */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div style={{
              fontSize: '64px',
              marginBottom: '8px',
              filter: designTheme === 'glass' 
                ? `drop-shadow(0 0 20px ${currentSign.color}80)` 
                : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              transition: 'all 0.3s ease',
              transform: isAnimating ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}>
              {currentSign.emoji}
            </div>
            
            {/* Анимированное кольцо вокруг эмодзи */}
            {designTheme === 'glass' && (
              <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px', height: '100px',
                border: `2px solid ${currentSign.color}60`,
                borderRadius: '50%',
                animation: 'pulse 2s ease-in-out infinite'
              }}></div>
            )}
          </div>

          {/* Информация о знаке */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: designTheme === 'wooden' ? '#3e2723' : currentSign.color,
            letterSpacing: '1px',
            textShadow: designTheme === 'wooden' ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
          }}>
            {currentSign.sign}
          </h2>
          
          <p style={{
            fontSize: '14px',
            marginBottom: '12px',
            opacity: 0.8
          }}>
            {currentSign.dates}
          </p>
          
          <span style={{
            background: designTheme === 'wooden' 
              ? 'rgba(139, 69, 19, 0.2)' 
              : `${currentSign.color}20`,
            color: designTheme === 'wooden' ? '#8b4513' : currentSign.color,
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '600',
            border: designTheme === 'wooden' 
              ? '1px solid rgba(139, 69, 19, 0.3)' 
              : `1px solid ${currentSign.color}40`,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {currentSign.element}
          </span>

          {/* Декоративные звезды */}
          <div style={{
            position: 'absolute',
            top: '10px', right: '10px',
            fontSize: '12px',
            opacity: 0.6,
            animation: 'twinkle 1.5s ease-in-out infinite'
          }}>
            ✨
          </div>
        </div>

        {/* Кнопка вперед */}
        <button 
          style={{...styles.navButton, right: '-25px'}}
          onClick={handleNext}
          disabled={isAnimating}
          onMouseEnter={(e) => {
            if (!isAnimating) {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = designTheme === 'wooden' 
                ? '0 6px 16px rgba(0,0,0,0.4)' 
                : '0 6px 20px rgba(0,0,0,0.15)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = designTheme === 'wooden'
              ? '0 4px 12px rgba(0,0,0,0.3)'
              : '0 4px 16px rgba(0,0,0,0.1)';
          }}
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
        <div style={{
          textAlign: 'center',
          opacity: 0.6,
          fontSize: '12px'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>
            {ZODIAC_SIGNS[(currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length].emoji}
          </div>
          <span>{ZODIAC_SIGNS[(currentIndex - 1 + ZODIAC_SIGNS.length) % ZODIAC_SIGNS.length].sign}</span>
        </div>

        <div style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: '600',
          color: designTheme === 'wooden' ? '#8b4513' : currentSign.color
        }}>
          Выбран
        </div>

        <div style={{
          textAlign: 'center',
          opacity: 0.6,
          fontSize: '12px'
        }}>
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
        background: designTheme === 'wooden'
          ? 'rgba(139, 69, 19, 0.1)'
          : 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(8px)',
        border: designTheme === 'wooden'
          ? '1px solid rgba(139, 69, 19, 0.2)'
          : '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {ZODIAC_SIGNS.map((sign, index) => (
          <button
            key={sign.sign}
            onClick={() => handleSelectSign(index)}
            disabled={isAnimating}
            title={`${sign.sign} (${sign.dates})`}
            style={{
              background: index === currentIndex 
                ? (designTheme === 'wooden' 
                  ? 'linear-gradient(135deg, #8b4513, #a0522d)' 
                  : `linear-gradient(135deg, ${sign.color}40, ${sign.color}20)`)
                : 'transparent',
              border: index === currentIndex 
                ? (designTheme === 'wooden' ? '2px solid #654321' : `2px solid ${sign.color}60`)
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
                ? `0 4px 12px ${designTheme === 'wooden' ? 'rgba(139, 69, 19, 0.3)' : sign.color}40`
                : 'none',
              filter: index === currentIndex 
                ? (designTheme === 'glass' ? `drop-shadow(0 0 8px ${sign.color}80)` : 'none')
                : 'grayscale(50%)',
              opacity: index === currentIndex ? 1 : 0.7
            }}
            onMouseEnter={(e) => {
              if (index !== currentIndex) {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.opacity = '1';
                e.target.style.filter = 'grayscale(0%)';
              }
            }}
            onMouseLeave={(e) => {
              if (index !== currentIndex) {
                e.target.style.transform = 'scale(1)';
                e.target.style.opacity = '0.7';
                e.target.style.filter = 'grayscale(50%)';
              }
            }}
          >
            {sign.emoji}
          </button>
        ))}
      </div>

      {/* Подсказка */}
      <div style={{
        textAlign: 'center',
        marginTop: '12px',
        fontSize: '12px',
        opacity: 0.6,
        fontStyle: 'italic'
      }}>
        💡 Нажмите на символы или используйте стрелки для навигации
      </div>

      {/* CSS анимации */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}

export default ZodiacCarousel;
