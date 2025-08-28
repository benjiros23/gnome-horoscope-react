import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from './Button';

const ThemeSelector = ({ style = {} }) => {
  const { currentTheme, switchTheme, getAvailableThemes, theme } = useTheme();

  const themeNames = {
    glass: '💎 Стекло',
    wooden: '🪵 Дерево',
    dark: '🌙 Темная',
    neon: '⚡ Неон'
  };

  const selectorStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    ...style
  };

  return (
    <div style={selectorStyle}>
      {getAvailableThemes().map((themeName) => (
        <Button
          key={themeName}
          variant={currentTheme === themeName ? 'primary' : 'ghost'}
          size="small"
          onClick={() => switchTheme(themeName)}
          style={{
            fontSize: '12px',
            padding: '6px 12px',
            minWidth: 'auto'
          }}
        >
          {themeNames[themeName] || themeName}
        </Button>
      ))}
    </div>
  );
};

export default ThemeSelector;
