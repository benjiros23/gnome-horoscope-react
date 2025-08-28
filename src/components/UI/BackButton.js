import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const BackButton = ({ onClick, show = true }) => {
  const { theme } = useTheme();

  if (!show) return null;

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: theme.name === 'facebook' 
      ? 'linear-gradient(135deg, #1877F2, #166fe5)'
      : theme.name === 'dark'
        ? 'linear-gradient(135deg, #495057, #343a40)'
        : 'linear-gradient(135deg, #007bff, #0056b3)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.name === 'facebook'
      ? '0 8px 24px rgba(24, 119, 242, 0.4)'
      : theme.name === 'dark'
        ? '0 8px 24px rgba(0, 0, 0, 0.5)'
        : '0 8px 24px rgba(0, 123, 255, 0.4)',
    zIndex: 999,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    fontSize: '24px',
    color: '#ffffff',
    fontWeight: 'bold'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'translateX(-50%) translateY(-5px) scale(1.1)';
    e.target.style.boxShadow = theme.name === 'facebook'
      ? '0 12px 32px rgba(24, 119, 242, 0.5)'
      : theme.name === 'dark'
        ? '0 12px 32px rgba(0, 0, 0, 0.6)'
        : '0 12px 32px rgba(0, 123, 255, 0.5)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateX(-50%) scale(1)';
    e.target.style.boxShadow = buttonStyle.boxShadow;
  };

  return (
    <>
      <button
        style={buttonStyle}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label="Назад"
      >
        ←
      </button>
      
      {/* Индикатор для свайпа */}
      <div style={{
        position: 'fixed',
        bottom: '90px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '12px',
        color: theme.colors.textSecondary,
        opacity: 0.6,
        pointerEvents: 'none',
        zIndex: 998
      }}>
        ↑ Свайп вверх
      </div>
    </>
  );
};

export default BackButton;
