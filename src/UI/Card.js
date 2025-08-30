import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({ 
  title, 
  subtitle, 
  children, 
  variant = 'default',
  className = '', 
  style = {},
  onClick,
  hoverable = false
}) => {
  const { theme } = useTheme();

  const cardStyle = {
    ...theme.card,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style
  };

  const titleStyle = {
    ...theme.typography.title,
    color: theme.name === 'wooden' ? '#3e2723' : theme.colors.text.primary
  };

  const subtitleStyle = {
    ...theme.typography.caption,
    marginBottom: '16px'
  };

  const handleMouseEnter = (e) => {
    if (hoverable || onClick) {
      Object.assign(e.target.style, theme.effects.hover);
    }
  };

  const handleMouseLeave = (e) => {
    if (hoverable || onClick) {
      e.target.style.transform = 'none';
      e.target.style.boxShadow = theme.card.boxShadow;
    }
  };

  return (
    <div 
      style={cardStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Деревянная текстура для wooden темы */}
      {theme.name === 'wooden' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          ...theme.texture
        }}></div>
      )}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {title && <h3 style={titleStyle}>{title}</h3>}
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default Card;
