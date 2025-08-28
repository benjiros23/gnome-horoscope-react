import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSelector = ({ style = {} }) => {
  const { currentTheme, switchTheme } = useTheme();

  const containerStyle = {
    position: 'fixed',
    top: '10px',                        // Уменьшили отступ сверху
    right: '10px',                      // Уменьшили отступ справа
    zIndex: 1000,
    display: 'flex',
    flexWrap: 'wrap',                   // Перенос на новую строку
    gap: '6px',                         // Уменьшили gap
    maxWidth: '200px',                  // Ограничили ширину
    ...style
  };

  const buttonStyle = (isActive, theme) => ({
    background: isActive ? theme.colors.primary : theme.card.background,
    color: isActive ? '#ffffff' : theme.card.color,
    border: `1px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    borderRadius: '16px',               // Более скругленные углы
    padding: '4px 8px',                 // Уменьшили padding
    fontSize: '11px',                   // Уменьшили шрифт
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '3px',                         // Уменьшили gap между иконкой и текстом
    boxShadow: isActive ? `0 2px 8px ${theme.colors.primary}40` : 'none',
    whiteSpace: 'nowrap'
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

      {/* Новая Facebook кнопка */}
      <button
        style={buttonStyle(currentTheme === 'facebook', theme)}
        onClick={() => handleThemeSwitch('facebook')}
        title="Facebook тема"
        onMouseEnter={(e) => {
          if (currentTheme !== 'facebook') {
            e.target.style.background = theme.colors.surface;
            e.target.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentTheme !== 'facebook') {
            e.target.style.background = theme.card.background;
            e.target.style.transform = 'scale(1)';
          }
        }}
      >
        <span>📘</span>
        <span>FB</span>
      </button>
    </div>
  );
};

export default ThemeSelector;
