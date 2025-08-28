import React, { useState } from 'react';
import WoodenCarousel from './WoodenCarousel';
import WoodenTile from './WoodenTile';

const ButtonGrid = ({ onButtonClick }) => {
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' или 'grid'

  // Функции приложения
  const functions = [
    {
      id: 'horoscope',
      icon: '🔮',
      title: 'Гороскоп',
      subtitle: 'На сегодня'
    },
    {
      id: 'moon',
      icon: '🌙',
      title: 'Луна',
      subtitle: 'Календарь'
    },
    {
      id: 'cards',
      icon: '🃏',
      title: 'Карты',
      subtitle: 'Дня'
    },
    {
      id: 'events',
      icon: '🌌',
      title: 'События',
      subtitle: 'Астро'
    },
    {
      id: 'numerology',
      icon: '🔢',
      title: 'Число',
      subtitle: 'Судьбы'
    },
    {
      id: 'compatibility',
      icon: '💕',
      title: 'Любовь',
      subtitle: 'Совместимость'
    },
    {
      id: 'mercury',
      icon: '🪐',
      title: 'Меркурий',
      subtitle: 'Ретроград'
    },
    {
      id: 'favorites',
      icon: '⭐',
      title: 'Избранное',
      subtitle: 'Сохраненное'
    }
  ];

  const handleItemClick = (item) => {
    if (onButtonClick) {
      onButtonClick(item.id);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    toggleContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
      gap: '10px'
    },
    toggleButton: {
      background: 'linear-gradient(135deg, #8b4513, #a0522d)',
      color: 'white',
      border: '2px solid #654321',
      borderRadius: '20px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: '"Times New Roman", Georgia, serif',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    toggleButtonActive: {
      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(139, 69, 19, 0.4)',
      transform: 'scale(0.95)'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '16px',
      justifyItems: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.1), rgba(160, 82, 45, 0.1))',
      borderRadius: '20px',
      border: '2px solid rgba(139, 69, 19, 0.3)',
      boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.1)'
    }
  };

  return (
    <div style={styles.container}>
      {/* Переключатель режимов */}
      <div style={styles.toggleContainer}>
        <button
          style={{
            ...styles.toggleButton,
            ...(viewMode === 'carousel' ? styles.toggleButtonActive : {})
          }}
          onClick={() => setViewMode('carousel')}
          onMouseEnter={(e) => {
            if (viewMode !== 'carousel') {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 16px rgba(139, 69, 19, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'carousel') {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          🎠 Карусель
        </button>
        
        <button
          style={{
            ...styles.toggleButton,
            ...(viewMode === 'grid' ? styles.toggleButtonActive : {})
          }}
          onClick={() => setViewMode('grid')}
          onMouseEnter={(e) => {
            if (viewMode !== 'grid') {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 16px rgba(139, 69, 19, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'grid') {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }
          }}
        >
          📱 Сетка
        </button>
      </div>

      {/* Отображение в зависимости от режима */}
      {viewMode === 'carousel' ? (
        <WoodenCarousel
          items={functions}
          onItemClick={handleItemClick}
          variant="oak"
        />
      ) : (
        <div style={styles.gridContainer}>
          {functions.map((item) => (
            <WoodenTile
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              variant="oak"
              onClick={() => handleItemClick(item)}
              size="normal"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ButtonGrid;
