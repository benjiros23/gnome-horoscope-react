import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ZodiacCarousel = ({ selectedSign, onSignChange, telegramApp }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const zodiacSigns = [
    { sign: 'Овен', emoji: '♈', dates: '21.03-20.04', element: 'fire' },
    { sign: 'Телец', emoji: '♉', dates: '21.04-20.05', element: 'earth' },
    { sign: 'Близнецы', emoji: '♊', dates: '21.05-21.06', element: 'air' },
    { sign: 'Рак', emoji: '♋', dates: '22.06-22.07', element: 'water' },
    { sign: 'Лев', emoji: '♌', dates: '23.07-22.08', element: 'fire' },
    { sign: 'Дева', emoji: '♍', dates: '23.08-22.09', element: 'earth' },
    { sign: 'Весы', emoji: '♎', dates: '23.09-22.10', element: 'air' },
    { sign: 'Скорпион', emoji: '♏', dates: '23.10-22.11', element: 'water' },
    { sign: 'Стрелец', emoji: '♐', dates: '23.11-21.12', element: 'fire' },
    { sign: 'Козерог', emoji: '♑', dates: '22.12-20.01', element: 'earth' },
    { sign: 'Водолей', emoji: '♒', dates: '21.01-19.02', element: 'air' },
    { sign: 'Рыбы', emoji: '♓', dates: '20.02-20.03', element: 'water' }
  ];

  const getElementColor = (element) => {
    switch (element) {
      case 'fire': return '#FF6B6B';
      case 'earth': return '#96CEB4';
      case 'air': return '#45B7D1';
      case 'water': return '#4ECDC4';
      default: return theme.colors.primary;
    }
  };

  const handlePrevious = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
    
    try {
      if (telegramApp?.HapticFeedback) {
        telegramApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {}
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
    
    try {
      if (telegramApp?.HapticFeedback) {
        telegramApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {}
  };

  const handleSignClick = (sign) => {
    if (onSignChange) {
      onSignChange(sign.sign);
    }
    
    try {
      if (telegramApp?.HapticFeedback) {
        telegramApp.HapticFeedback.selectionChanged();
      }
    } catch (e) {}
  };

  const containerStyle = {
    ...theme.card,
    padding: '20px',
    margin: '16px 8px',
    position: 'relative',
    overflow: 'hidden'
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '18px',
    fontWeight: '600',
    color: theme.card.color
  };

  const carouselWrapperStyle = {
    position: 'relative',
    width: '100%'
  };

  const scrollContainerStyle = {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
    padding: '10px 0',
    '::-webkit-scrollbar': {
      display: 'none'
    }
  };

  const arrowButtonStyle = (position) => ({
    position: 'absolute',
    top: '50%',
    [position]: '10px',
    transform: 'translateY(-50%)',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: theme.name === 'facebook' 
      ? 'linear-gradient(135deg, #1877F2, #42A5F5)'
      : theme.name === 'dark'
        ? 'linear-gradient(135deg, #667eea, #764ba2)'
        : 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    color: '#ffffff',
    fontWeight: 'bold',
    zIndex: 10,
    boxShadow: theme.name === 'facebook'
      ? '0 4px 16px rgba(24, 119, 242, 0.4)'
      : '0 4px 16px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)'
  });

  const signCardStyle = (sign, isSelected) => ({
    minWidth: '130px',
    width: '130px',
    height: '160px',
    background: isSelected
      ? `linear-gradient(135deg, ${getElementColor(sign.element)}, ${getElementColor(sign.element)}cc)`
      : theme.name === 'facebook' 
        ? '#FFFFFF'
        : theme.name === 'dark' 
          ? '#495057'
          : '#FFFFFF',
    border: isSelected 
      ? `3px solid ${getElementColor(sign.element)}`
      : `2px solid ${theme.colors.border}`,
    borderRadius: '16px',
    padding: '16px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isSelected 
      ? `0 8px 24px ${getElementColor(sign.element)}40`
      : theme.name === 'facebook'
        ? '0 2px 8px rgba(0,0,0,0.1)'
        : '0 2px 8px rgba(0,0,0,0.15)',
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
    color: isSelected ? '#ffffff' : theme.card.color,
    position: 'relative',
    overflow: 'hidden'
  });

  const signEmojiStyle = {
    fontSize: '32px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
  };

  const signNameStyle = (isSelected) => ({
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '6px',
    textAlign: 'center',
    color: isSelected ? '#ffffff' : theme.card.color,
    textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
  });

  const signDatesStyle = (isSelected) => ({
    fontSize: '11px',
    fontWeight: '500',
    opacity: isSelected ? 0.9 : 0.7,
    textAlign: 'center',
    color: isSelected ? '#ffffff' : theme.colors.textSecondary,
    textShadow: isSelected ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
  });

  const elementBadgeStyle = (element, isSelected) => ({
    position: 'absolute',
    bottom: '8px',
    right: '8px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: isSelected ? 'rgba(255,255,255,0.8)' : getElementColor(element),
    border: isSelected ? '1px solid rgba(255,255,255,0.6)' : 'none'
  });

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        Выберите ваш знак зодиака
      </h3>
      
      <div style={carouselWrapperStyle}>
        {/* Левая стрелка */}
        <button
          style={arrowButtonStyle('left')}
          onClick={handlePrevious}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = theme.name === 'facebook'
              ? '0 6px 20px rgba(24, 119, 242, 0.5)'
              : '0 6px 20px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = arrowButtonStyle('left').boxShadow;
          }}
          aria-label="Предыдущий знак"
        >
          ←
        </button>

        {/* Правая стрелка */}
        <button
          style={arrowButtonStyle('right')}
          onClick={handleNext}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-50%) scale(1.1)';
            e.target.style.boxShadow = theme.name === 'facebook'
              ? '0 6px 20px rgba(24, 119, 242, 0.5)'
              : '0 6px 20px rgba(102, 126, 234, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(-50%) scale(1)';
            e.target.style.boxShadow = arrowButtonStyle('right').boxShadow;
          }}
          aria-label="Следующий знак"
        >
          →
        </button>

        {/* Карусель знаков */}
        <div 
          ref={scrollRef}
          style={scrollContainerStyle}
        >
          {zodiacSigns.map((sign) => {
            const isSelected = selectedSign === sign.sign;
            
            return (
              <div
                key={sign.sign}
                style={signCardStyle(sign, isSelected)}
                onClick={() => handleSignClick(sign)}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 16px ${getElementColor(sign.element)}30`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = signCardStyle(sign, isSelected).boxShadow;
                  }
                }}
              >
                <div style={signEmojiStyle}>{sign.emoji}</div>
                <div style={signNameStyle(isSelected)}>{sign.sign}</div>
                <div style={signDatesStyle(isSelected)}>{sign.dates}</div>
                <div style={elementBadgeStyle(sign.element, isSelected)}></div>
              </div>
            );
          })}
        </div>
      </div>
      
      <style>{`
        div[style*="overflowX: auto"]::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ZodiacCarousel;
