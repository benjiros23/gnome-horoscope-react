import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import FunctionTile from './FunctionTile';

const FunctionCarousel = ({ items, onItemClick }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div style={{
      ...theme.card,
      padding: '20px',
      textAlign: 'center'
    }}>
      <h3 style={theme.typography.subtitle}>🎮 Функции приложения</h3>
      <div style={{ 
        display: 'flex', 
        overflowX: 'auto', 
        gap: '10px',
        padding: '10px 0'
      }}>
        {items.map((item, index) => (
          <FunctionTile
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            onClick={() => onItemClick && onItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default FunctionCarousel;
