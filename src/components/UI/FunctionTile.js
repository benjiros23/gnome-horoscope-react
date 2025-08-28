import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const FunctionTile = ({ 
  icon,
  title, 
  subtitle,
  onClick,
  disabled = false,
  active = false,
  size = 'normal'
}) => {
  const { theme } = useTheme();

  const sizes = {
    small: { width: '80px', height: '80px', fontSize: '12px', iconSize: '20px' },
    normal: { width: '120px', height: '120px', fontSize: '14px', iconSize: '28px' },
    large: { width: '140px', height: '140px', fontSize: '16px', iconSize: '32px' }
  };

  const currentSize = sizes[size] || sizes.normal;

  // Простые стили плитки
  const getTileStyle = () => ({
    width: currentSize.width,
    height: currentSize.height,
    background: disabled 
      ? (theme.name === 'dark' ? '#495057' : '#e9ecef')
      : theme.card.background,
    border: theme.card.border,
    borderRadius: theme.card.borderRadius,
    boxShadow: active 
      ? `0 0 0 2px ${theme.colors.primary}`
      : theme.card.boxShadow,
    color: disabled 
      ? theme.colors.textSecondary
      : theme.card.color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    margin: '8px',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    transform: active ? 'scale(0.98)' : 'scale(1)',
    fontFamily: theme.container.fontFamily
  });

  const getIconStyle = () => ({
    fontSize: currentSize.iconSize,
    marginBottom: '8px',
    opacity: disabled ? 0.5 : 1
  });

  const getTitleStyle = () => ({
    fontSize: currentSize.fontSize,
    fontWeight: '600',
    marginBottom: subtitle ? '4px' : '0',
    lineHeight: '1.2'
  });

  const getSubtitleStyle = () => ({
    fontSize: Math.max(10, parseInt(currentSize.fontSize) - 2) + 'px',
    fontWeight: '400',
    opacity: 0.7,
    lineHeight: '1.1'
  });

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !active) {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
      e.currentTarget.style.boxShadow = theme.name === 'dark' 
        ? '0 4px 8px rgba(0,0,0,0.4)'
        : '0 4px 8px rgba(0,0,0,0.15)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !active) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = theme.card.boxShadow;
    }
  };

  return (
    <div 
      style={getTileStyle()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {icon && <div style={getIconStyle()}>{icon}</div>}
      {title && <div style={getTitleStyle()}>{title}</div>}
      {subtitle && <div style={getSubtitleStyle()}>{subtitle}</div>}
    </div>
  );
};

export default FunctionTile;
