import React, { useState, useRef, useEffect } from 'react';
import WoodenTile from './WoodenTile';

const WoodenCarousel = ({ items, onItemClick, variant = 'oak' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef(null);
  const itemsPerView = 3; // Количество элементов на экране

  const maxIndex = Math.max(0, items.length - itemsPerView);

  // Touch события для мобильных устройств
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setScrollLeft(currentIndex);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const x = e.touches[0].clientX;
    const diff = startX - x;
    const sensitivity = 0.8;
    
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
    setScrollLeft(currentIndex);
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

  // Навигация кнопками
  const goToSlide = (index) => {
    setCurrentIndex(Math.max(0, Math.min(maxIndex, index)));
  };

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const styles = {
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
      background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(160, 82, 45, 0.1))',
      padding: '20px',
      boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.15)',
      border: '2px solid rgba(139, 69, 19, 0.3)'
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
      background: 'linear-gradient(135deg, #8b4513, #a0522d)',
      border: '2px solid #654321',
      borderRadius: '50%',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      transition: 'all 0.3s ease',
      fontWeight: 'bold'
    },
    prevButton: {
      left: '-20px'
    },
    nextButton: {
      right: '-20px'
    },
    indicators: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '16px'
    },
    indicator: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid #8b4513'
    },
    indicatorActive: {
      background: 'linear-gradient(135deg, #8b4513, #a0522d)',
      boxShadow: '0 2px 8px rgba(139, 69, 19, 0.4)'
    },
    indicatorInactive: {
      background: 'rgba(139, 69, 19, 0.3)'
    },
    title: {
      textAlign: 'center',
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: '700',
      color: '#8b4513',
      fontFamily: '"Times New Roman", Georgia, serif',
      textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
      letterSpacing: '1px',
      textTransform: 'uppercase'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>🎮 Магические функции</div>
      
      <div style={styles.carousel}>
        {/* Кнопка "Назад" */}
        {currentIndex > 0 && (
          <button
            style={{...styles.navButton, ...styles.prevButton}}
            onClick={prevSlide}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
          >
            ←
          </button>
        )}

        {/* Кнопка "Вперед" */}
        {currentIndex < maxIndex && (
          <button
            style={{...styles.navButton, ...styles.nextButton}}
            onClick={nextSlide}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
              e.target.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) scale(1)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
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
              <WoodenTile
                icon={item.icon}
                title={item.title}
                subtitle={item.subtitle}
                variant={variant}
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
              style={{
                ...styles.indicator,
                ...(index === currentIndex ? styles.indicatorActive : styles.indicatorInactive)
              }}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WoodenCarousel;
