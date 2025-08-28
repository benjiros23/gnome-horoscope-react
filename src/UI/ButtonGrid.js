import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import FunctionCarousel from './UI/FunctionCarousel';
import FunctionTile from './UI/FunctionTile';
import Button from './UI/Button';

const ButtonGrid = ({ onButtonClick }) => {
  const { theme } = useTheme();
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

  const getContainerStyle = () => {
    return {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    };
  };

  const getToggleContainerStyle = () => {
    return {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '20px',
      gap: '10px'
    };
  };

  const getGridContainerStyle = () => {
    return {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '16px',
      justifyItems: 'center',
      padding: '20px',
      ...theme.card,
      margin: '0'
    };
  };

  return (
    <div style={getContainerStyle()}>
      {/* Переключатель режимов */}
      <div style={getToggleContainerStyle()}>
        <Button
          variant={viewMode === 'carousel' ? 'primary' : 'ghost'}
          size="small"
          onClick={() => setViewMode('carousel')}
        >
          🎠 Карусель
        </Button>
        
        <Button
          variant={viewMode === 'grid' ? 'primary' : 'ghost'}
          size="small"
          onClick={() => setViewMode('grid')}
        >
          📱 Сетка
        </Button>
      </div>

      {/* Отображение в зависимости от режима */}
      {viewMode === 'carousel' ? (
        <FunctionCarousel
          items={functions}
          onItemClick={handleItemClick}
        />
      ) : (
        <div style={getGridContainerStyle()}>
          {/* Деревянная текстура для wooden темы */}
          {theme.name === 'wooden' && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              ...theme.texture
            }}></div>
          )}
          
          <div style={{ position: 'relative', zIndex: 1, display: 'contents' }}>
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
        </div>
      )}
    </div>
  );
};

export default ButtonGrid;
