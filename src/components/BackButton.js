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
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: theme.name === 'facebook' 
      ? 'linear-gradient(135deg, #1877F2, #166fe5)'
      : theme.name === 'dark'
        ? 'linear-gradient(135deg, #495057, #343a40)'
        : 'linear-gradient(135deg, #667eea, #764ba2)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.name === 'facebook'
      ? '0 8px 24px rgba(24, 119, 242, 0.4)'
      : theme.name === 'dark'
        ? '0 8px 24px rgba(0, 0, 0, 0.5)'
        : '0 8px 24px rgba(102, 126, 234, 0.4)',
    zIndex: 999,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    fontSize: '28px',
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const indicatorStyle = {
    position: 'fixed',
    bottom: '92px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '12px',
    color: theme.colors.textSecondary,
    opacity: 0.6,
    pointerEvents: 'none',
    zIndex: 998,
    background: `${theme.card.background}cc`,
    padding: '4px 12px',
    borderRadius: '20px',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    border: `1px solid ${theme.colors.border}40`,
    fontWeight: '500',
    whiteSpace: 'nowrap'
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e) => {
    e.target.style.transform = 'translateX(-50%) translateY(-8px) scale(1.1)';
    e.target.style.boxShadow = theme.name === 'facebook'
      ? '0 12px 32px rgba(24, 119, 242, 0.5)'
      : theme.name === 'dark'
        ? '0 12px 32px rgba(0, 0, 0, 0.6)'
        : '0 12px 32px rgba(102, 126, 234, 0.5)';
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = 'translateX(-50%) scale(1)';
    e.target.style.boxShadow = buttonStyle.boxShadow;
  };

  const handleTouchStart = (e) => {
    e.target.style.transform = 'translateX(-50%) scale(0.95)';
  };

  const handleTouchEnd = (e) => {
    e.target.style.transform = 'translateX(-50%) scale(1)';
  };

  return (
    <>
      {/* Индикатор свайпа */}
      <div style={indicatorStyle}>
        ↑ Свайп вверх или нажмите
      </div>
      
      {/* Кнопка назад */}
      <button
        style={buttonStyle}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Назад на главную"
      >
        🏠
      </button>
    </>
  );
};

export default BackButton;
