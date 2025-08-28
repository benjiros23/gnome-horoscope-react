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

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(maxIndex, index)));
  };

  const containerStyle = {
    position: 'relative',
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px 0'
  };

  const carouselStyle = {
    ...theme.card,
    position: 'relative',
    overflow: 'hidden',
    padding: '20px',
    margin: '0'
  };

  const trackStyle = {
    display: 'flex',
    transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease',
    cursor: isDragging ? 'grabbing' : 'grab',
    userSelect: 'none'
  };

  const navButtonStyle = (position) => ({
    ...theme.button.primary,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    [position]: '-20px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    fontSize: '18px',
    fontWeight: 'bold',
    zIndex: 10,
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const indicatorsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px'
  };

  const indicatorStyle = (isActive) => ({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: isActive ? theme.colors.primary : theme.colors.textSecondary,
    border: 'none'
  });

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '16px',
    fontSize: '18px',
    fontWeight: '600',
    color: theme.card.color
  };

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>🎮 Функции приложения</div>
      
      <div style={carouselStyle}>
        {/* Кнопка "Назад" */}
        {currentIndex > 0 && (
          <button
            style={navButtonStyle('left')}
            onClick={prevSlide}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.primary;
              e.target.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.button.primary.background;
              e.target.style.opacity = '1';
            }}
          >
            ←
          </button>
        )}

        {/* Кнопка "Вперед" */}
        {currentIndex < maxIndex && (
          <button
            style={navButtonStyle('right')}
            onClick={nextSlide}
            onMouseEnter={(e) => {
              e.target.style.background = theme.colors.primary;
              e.target.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = theme.button.primary.background;
              e.target.style.opacity = '1';
            }}
          >
            →
          </button>
        )}

        {/* Трек с элементами */}
        <div
          ref={carouselRef}
          style={trackStyle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
        <div style={indicatorsStyle}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              style={indicatorStyle(index === currentIndex)}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FunctionCarousel;
