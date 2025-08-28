import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const FunctionTile = ({ icon, title, subtitle, onClick, size = 'normal' }) => {
  const { theme } = useTheme();

  const tileStyle = {
    width: '120px',
    height: '120px',
    ...theme.card,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    margin: '8px',
    transition: 'all 0.2s ease'
  };

  return (
    <div 
      style={tileStyle} 
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px) scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0) scale(1)';
      }}
    >
      {icon && <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>}
      {title && <div style={{ fontSize: '14px', fontWeight: '600' }}>{title}</div>}
      {subtitle && <div style={{ fontSize: '12px', opacity: 0.7 }}>{subtitle}</div>}
    </div>
  );
};

export default FunctionTile;
