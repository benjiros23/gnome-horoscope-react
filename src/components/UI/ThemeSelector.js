import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSelector = ({ style = {} }) => {
  const { currentTheme, switchTheme } = useTheme();

  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    gap: '8px',
    ...style
  };

  const buttonStyle = (isActive, theme) => ({
    background: isActive ? theme.colors.primary : theme.card.background,
    color: isActive ? '#ffffff' : theme.card.color,
    border: `1px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: isActive ? `0 2px 8px ${theme.colors.primary}40` : 'none'
  });

  const { theme } = useTheme();

  const handleThemeSwitch = (themeName) => {
    console.log('🎨 Переключаем тему на:', themeName);
    switchTheme(themeName);
  };

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle(currentTheme === 'light', theme)}
        onClick={() => handleThemeSwitch('light')}
        title="Светлая тема"
        onMouseEnter={(e) => {
          if (currentTheme !== 'light') {
            e.target.style.background = theme.colors.surface;
            e.target.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentTheme !== 'light') {
            e.target.style.background = theme.card.background;
            e.target.style.transform = 'scale(1)';
          }
        }}
      >
        <span>☀️</span>
        <span>Светлая</span>
      </button>
      
      <button
        style={buttonStyle(currentTheme === 'dark', theme)}
        onClick={() => handleThemeSwitch('dark')}
        title="Темная тема"
        onMouseEnter={(e) => {
          if (currentTheme !== 'dark') {
            e.target.style.background = theme.colors.surface;
            e.target.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentTheme !== 'dark') {
            e.target.style.background = theme.card.background;
            e.target.style.transform = 'scale(1)';
          }
        }}
      >
        <span>🌙</span>
        <span>Темная</span>
      </button>
    </div>
  );
};

export default ThemeSelector;
