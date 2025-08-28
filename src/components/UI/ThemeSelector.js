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
    gap: '4px'
  });

  const { theme } = useTheme();

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle(currentTheme === 'light', theme)}
        onClick={() => switchTheme('light')}
        title="Светлая тема"
        onMouseEnter={(e) => {
          if (currentTheme !== 'light') {
            e.target.style.background = theme.colors.surface;
          }
        }}
        onMouseLeave={(e) => {
          if (currentTheme !== 'light') {
            e.target.style.background = theme.card.background;
          }
        }}
      >
        ☀️ Светлая
      </button>
      
      <button
        style={buttonStyle(currentTheme === 'dark', theme)}
        onClick={() => switchTheme('dark')}
        title="Темная тема"
        onMouseEnter={(e) => {
          if (currentTheme !== 'dark') {
            e.target.style.background = theme.colors.surface;
          }
        }}
        onMouseLeave={(e) => {
          if (currentTheme !== 'dark') {
            e.target.style.background = theme.card.background;
          }
        }}
      >
        🌙 Темная
      </button>
    </div>
  );
};

export default ThemeSelector;
