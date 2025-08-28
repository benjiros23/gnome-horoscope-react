import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FunctionCarousel from './UI/FunctionCarousel';
import FunctionTile from './UI/FunctionTile';

const ButtonGrid = ({ onButtonClick }) => {
  const { theme, currentTheme } = useTheme();
  const [viewMode, setViewMode] = useState('carousel');

  // Функции приложения
  const functions = [
    { id: 'horoscope', icon: '🔮', title: 'Гороскоп', subtitle: 'На сегодня' },
    { id: 'moon', icon: '🌙', title: 'Луна', subtitle: 'Календарь' },
    { id: 'cards', icon: '🃏', title: 'Карты', subtitle: 'Дня' },
    { id: 'events', icon: '🌌', title: 'События', subtitle: 'Астро' },
    { id: 'numerology', icon: '🔢', title: 'Число', subtitle: 'Судьбы' },
    { id: 'compatibility', icon: '💕', title: 'Любовь', subtitle: 'Совместимость' },
    { id: 'mercury', icon: '🪐', title: 'Меркурий', subtitle: 'Ретроград' },
    { id: 'favorites', icon: '⭐', title: 'Избранное', subtitle: 'Сохраненное' }
  ];

  const handleItemClick = (item) => {
    if (onButtonClick) {
      onButtonClick(item.id);
    }
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: theme.container.fontFamily
  };

  const toggleContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px'
  };

  const toggleButtonStyle = (isActive) => {
    const baseStyle = isActive ? theme.button.primary : theme.button.ghost;
    return {
      ...baseStyle,
      borderRadius: '20px',
      transition: 'all 0.2s ease'
    };
  };

  const gridContainerStyle = {
    ...theme.card,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    justifyItems: 'center',
    padding: '20px',
    margin: '0',
    position: 'relative'
  };

  console.log('🎮 ButtonGrid рендерится с темой:', currentTheme);

  return (
    <div style={containerStyle}>
      {/* Переключатель режимов */}
      <div style={toggleContainerStyle}>
        <button
          style={toggleButtonStyle(viewMode === 'carousel')}
          onClick={() => setViewMode('carousel')}
          onMouseEnter={(e) => {
            if (viewMode !== 'carousel') {
              e.target.style.background = theme.colors.surface;
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'carousel') {
              e.target.style.background = theme.button.ghost.background;
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          🎠 Карусель
        </button>
        
        <button
          style={toggleButtonStyle(viewMode === 'grid')}
          onClick={() => setViewMode('grid')}
          onMouseEnter={(e) => {
            if (viewMode !== 'grid') {
              e.target.style.background = theme.colors.surface;
              e.target.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (viewMode !== 'grid') {
              e.target.style.background = theme.button.ghost.background;
              e.target.style.transform = 'scale(1)';
            }
          }}
        >
          📱 Сетка
        </button>
      </div>

      {/* Отображение в зависимости от режима */}
      {viewMode === 'carousel' ? (
        <FunctionCarousel
          items={functions}
          onItemClick={handleItemClick}
        />
      ) : (
        <div style={gridContainerStyle}>
          {functions.map((item) => (
            <FunctionTile
              key={item.id}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
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
