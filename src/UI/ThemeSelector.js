import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSelector = ({ style = {} }) => {
  const { currentTheme, switchTheme, availableThemes } = useTheme();

  // Названия и иконки тем
  const themeConfig = {
    glass: {
      name: '💎 Стекло',
      icon: '💎',
      color: '#667eea',
      description: 'Прозрачный стеклянный дизайн'
    },
    wooden: {
      name: '🪵 Дерево',
      icon: '🪵',
      color: '#8b4513',
      description: 'Теплый деревянный стиль'
    },
    dark: {
      name: '🌙 Темная',
      icon: '🌙',
      color: '#1a1a2e',
      description: 'Темная элегантная тема'
    },
    neon: {
      name: '⚡ Неон',
      icon: '⚡',
      color: '#00ffff',
      description: 'Яркий неоновый стиль'
    }
  };

  const handleThemeSwitch = (themeName) => {
    console.log('🎨 Переключаем тему на:', themeName);
    switchTheme(themeName);
  };

  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    padding: '12px',
    transition: 'all 0.3s ease',
    ...style
  };

  const titleStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: '4px',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    letterSpacing: '0.5px'
  };

  const buttonStyle = (themeName, isActive) => ({
    background: isActive 
      ? `linear-gradient(135deg, ${themeConfig[themeName]?.color || '#8BC34A'}, ${themeConfig[themeName]?.color || '#8BC34A'}dd)`
      : 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(8px)',
    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
    border: isActive 
      ? `2px solid ${themeConfig[themeName]?.color || '#8BC34A'}`
      : '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: isActive ? '700' : '500',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    minWidth: '80px',
    justifyContent: 'center',
    textShadow: isActive ? '1px 1px 2px rgba(0, 0, 0, 0.5)' : 'none',
    boxShadow: isActive 
      ? `0 4px 16px ${themeConfig[themeName]?.color || '#8BC34A'}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transform: isActive ? 'scale(1.05)' : 'scale(1)',
    letterSpacing: '0.3px'
  });

  const iconStyle = (themeName, isActive) => ({
    fontSize: '14px',
    filter: isActive 
      ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))'
      : 'none',
    transition: 'all 0.3s ease'
  });

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>🎨 ТЕМА</div>
      
      {availableThemes.map((themeName) => {
        const config = themeConfig[themeName];
        const isActive = currentTheme === themeName;
        
        if (!config) return null;
        
        return (
          <button
            key={themeName}
            style={buttonStyle(themeName, isActive)}
            onClick={() => handleThemeSwitch(themeName)}
            title={config.description}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.background = `linear-gradient(135deg, ${config.color}20, ${config.color}10)`;
                e.target.style.border = `1px solid ${config.color}60`;
                e.target.style.boxShadow = `0 4px 12px ${config.color}20`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }
            }}
            onMouseDown={(e) => {
              e.target.style.transform = isActive ? 'scale(1.03)' : 'scale(0.98)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = isActive ? 'scale(1.05)' : 'scale(1.02)';
            }}
          >
            <span style={iconStyle(themeName, isActive)}>
              {config.icon}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 'inherit' }}>
              {config.name.split(' ')[1] || config.name}
            </span>
          </button>
        );
      })}
      
      {/* Индикатор активной темы */}
      <div style={{
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.6)',
        textAlign: 'center',
        marginTop: '4px',
        fontStyle: 'italic'
      }}>
        {themeConfig[currentTheme]?.description || 'Активная тема'}
      </div>
    </div>
  );
};

export default ThemeSelector;
