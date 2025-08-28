import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({ title, subtitle, children, style = {}, onClick }) => {
  const { theme } = useTheme();

  const cardStyle = {
    ...theme.card,
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <div style={cardStyle} onClick={onClick}>
      {title && <h3 style={theme.typography.title}>{title}</h3>}
      {subtitle && <p style={theme.typography.caption}>{subtitle}</p>}
      {children}
    </div>
  );
};

export default Card;
