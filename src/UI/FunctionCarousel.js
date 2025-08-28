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

  const getContainerStyle = () => {
    const baseStyle = {
      position: 'relative',
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px 0'
    };

    return baseStyle;
  };

  const getCarouselStyle = () => {
    const baseStyle = {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '24px',
      padding: '20px',
      ...theme.card,
      margin: '0'
    };

    return baseStyle;
  };

  const getTrackStyle = () => {
    return {
      display: 'flex',
      transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
      transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: isDragging ? 'grabbing' : 'grab',
      userSelect: 'none'
    };
  };

  const getNavButtonStyle = (position) => {
    const baseStyle = {
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
    };

    return {
      ...baseStyle,
      [position]: '-20px'
    };
  };

  const getIndicatorsStyle = () => {
    return {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px'
    };
  };

  const getIndicatorStyle = (isActive) => {
    const baseStyle = {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: `2px solid ${theme.colors.primary}`
    };

    if (isActive) {
      return {
        ...baseStyle,
        background: theme.colors.primary,
        boxShadow: `0 2px 8px ${theme.colors.primary}40`
      };
    }

    return {
      ...baseStyle,
      background: theme.name === 'wooden' 
        ? 'rgba(139, 69, 19, 0.3)' 
        : 'rgba(139, 195, 74, 0.3)'
    };
  };

  const getTitleStyle = () => {
    return {
      textAlign: 'center',
      marginBottom: '16px',
      ...theme.typography.subtitle,
      color: theme.name === 'wooden' ? '#8b4513' : theme.colors.text.primary
    };
  };

  return (
    <div style={getContainerStyle()}>
      <div style={getTitleStyle()}>🎮 Магические функции</div>
      
      <div style={getCarouselStyle()}>
        {/* Деревянная текстура для wooden темы */}
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
            style={getNavButtonStyle('left')}
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
            style={getNavButtonStyle('right')}
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
          style={getTrackStyle()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {items.map((item, index) => (
            <div key={index} style={{ flex: `0 0 ${100 / itemsPerView}%`, display: 'flex', justifyContent: 'center' }}>
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
        <div style={getIndicatorsStyle()}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <div
              key={index}
              style={getIndicatorStyle(index === currentIndex)}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FunctionCarousel;
