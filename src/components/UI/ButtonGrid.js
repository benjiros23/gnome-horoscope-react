import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FunctionCarousel from './UI/FunctionCarousel';
import FunctionTile from './UI/FunctionTile';

const ButtonGrid = ({ onButtonClick }) => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState('carousel');

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
    margin: '0 auto'
  };

  const toggleContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    gap: '10px'
  };

  const toggleButtonStyle = (isActive) => ({
    ...theme.button[isActive ? 'primary' : 'ghost'],
    borderRadius: '20px'
  });

  const gridContainerStyle = {
    ...theme.card,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
    justifyItems: 'center',
    padding: '20px',
    margin: '0'
  };

  return (
    <div style={containerStyle}>
      {/* Переключатель режимов */}
      <div style={toggleContainerStyle}>
        <button
          style={toggleButtonStyle(viewMode === 'carousel')}
          onClick={() => setViewMode('carousel')}
        >
          🎠 Карусель
        </button>
        
        <button
          style={toggleButtonStyle(viewMode === 'grid')}
          onClick={() => setViewMode('grid')}
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
