import React, { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import FunctionTile from './FunctionTile';

const FunctionCarousel = ({ items, onItemClick }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const carouselRef = useRef(null);
  const itemsPerView = 3;

  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Touch события для мобильных
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const x = e.touches[0].clientX;
    const diff = startX - x;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < maxIndex) {
        setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
        setIsDragging(false);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse события для десктопа
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const x = e.clientX;
    const diff = startX - x;
    
    if (Math.abs(diff) > 100) {
      if (diff > 0 && currentIndex < maxIndex) {
        setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
        setIsDragging(false);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
        setIsDragging(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(maxIndex, index)));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  // Стили на основе темы
  const getStyles = () => ({
    container: {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px 0'
    },
    
    carousel: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      padding: '20px',
      ...theme.card,
      margin: '0'
    },
    
    track: {
      display: 'flex',
      transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
      transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none'
    },
    
    item: {
      flex: `0 0 ${100 / itemsPerView}%`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    
    navButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      ...theme.button.primary,
      padding: '0',
      minWidth: 'auto'
    },
    
    indicators: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px'
    },
    
    indicator: (isActive) => ({
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: `2px solid ${theme.colors.primary}`,
      background: isActive 
        ? theme.colors.primary
        : (theme.name === 'wooden' ? 'rgba(139, 69, 19, 0.3)' : 'rgba(139, 195, 74, 0.3)'),
      boxShadow: isActive ? `0 2px 8px ${theme.colors.primary}40` : 'none'
    }),
    
    title: {
      textAlign: 'center',
      marginBottom: '16px',
      ...theme.typography.subtitle,
      color: theme.name === 'wooden' ? '#8b4513' : theme.colors.text.primary
    }
  });

  const styles = getStyles();

  return (
    <div style={styles.container}>
      <div style={styles.title}>🎮 Магические функции</div>
      
      <div style={styles.carousel}>
        {/* Текстура для wooden темы */}
        {theme.name === 'wooden' && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            ...theme.texture
          }}></div>
        )}

        {/* Кнопка "Назад" */}
        {currentIndex > 0 && (
          <button
            style={{...styles.navButton, left: '-20px'}}
            onClick={prevSlide}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.filter = 'brightness(1)';
            }}
          >
            ←
          </button>
        )}

        {/* Кнопка "Вперед" */}
        {currentIndex < maxIndex && (
          <button
            style={{...styles.navButton, right: '-20px'}}
            onClick={nextSlide}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.filter = 'brightness(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.filter = 'brightness(1)';
            }}
          >
            →
          </button>
        )}

        {/* Трек с элементами */}
        <div
          ref={carouselRef}
          style={styles.track}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, index) => (
            <div key={index} style={styles.item}>
              <FunctionTile
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                onClick={() => onItemClick && onItemClick(item)}
                size="normal"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Индикаторы */}
      {maxIndex > 0 && (
        <div style={styles.indicators}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <div
              key={index}
              style={styles.indicator(index === currentIndex)}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FunctionCarousel;
