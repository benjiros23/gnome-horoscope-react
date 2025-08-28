import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const FunctionTile = ({ 
  icon, 
  title, 
  subtitle, 
  onClick, 
  size = 'normal',
  disabled = false 
}) => {
  const { theme } = useTheme();

  const sizes = {
    small: { width: '100px', height: '100px', fontSize: '12px', iconSize: '24px' },
    normal: { width: '130px', height: '140px', fontSize: '13px', iconSize: '28px' },
    large: { width: '150px', height: '160px', fontSize: '14px', iconSize: '32px' }
  };

  const currentSize = sizes[size] || sizes.normal;

  const tileStyle = {
    width: currentSize.width,
    height: currentSize.height,
    background: theme.name === 'facebook' 
      ? '#FFFFFF'
      : theme.name === 'dark' 
        ? '#495057'
        : '#FFFFFF',
    border: theme.name === 'facebook'
      ? '1px solid #E4E6EA'
      : `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    boxShadow: theme.name === 'facebook'
      ? '0 1px 2px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
      : theme.name === 'dark'
        ? '0 2px 8px rgba(0,0,0,0.3)'
        : '0 2px 6px rgba(0,0,0,0.1)',
    color: theme.name === 'facebook' ? '#050505' : theme.card.color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px 12px',
    margin: '8px',
    textAlign: 'center',
    transition: 'all 0.3s ease',
    opacity: disabled ? 0.6 : 1,
    overflow: 'hidden',
    wordWrap: 'break-word',
    overflowWrap: 'break-word'
  };

  const iconStyle = {
    fontSize: currentSize.iconSize,
    marginBottom: '8px',
    flexShrink: 0
  };

  const titleStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: theme.name === 'facebook' ? '600' : '700',
    lineHeight: '1.2',
    marginBottom: subtitle ? '4px' : '0',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-word'
  };

  const subtitleStyle = {
    fontSize: Math.max(10, parseInt(currentSize.fontSize) - 2) + 'px',
    fontWeight: '400',
    lineHeight: '1.1',
    color: theme.name === 'facebook' ? '#65676B' : theme.colors.textSecondary,
    opacity: 0.85,
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
      if (theme.name === 'facebook') {
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.15)';
      } else {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = tileStyle.boxShadow;
    }
  };

  return (
    <div 
      style={tileStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
    >
      {icon && <div style={iconStyle}>{icon}</div>}
      {title && <div style={titleStyle}>{title}</div>}
      {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
    </div>
  );
};

export default FunctionTile;
