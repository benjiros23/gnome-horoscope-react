import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick, 
  disabled = false,
  style = {},
  className = '',
  type = 'button',
  ...props 
}) => {
  const { theme } = useTheme();
  
  // КРИТИЧЕСКИ ВАЖНО: ПРОВЕРЯЕМ СУЩЕСТВОВАНИЕ ТЕМЫ
  if (!theme || !theme.colors) {
    console.error('❌ Theme не загружена в Button!', theme);
    
    // Используем fallback тему
    const fallbackTheme = {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2', 
        background: '#ffffff',
        text: '#333333',
        textSecondary: '#666666',
        border: '#e1e5e9',
        error: '#e74c3c',
        success: '#27ae60',
        warning: '#f39c12'
      }
    };
    
    const fallbackVariants = {
      primary: {
        background: `linear-gradient(135deg, ${fallbackTheme.colors.primary}, ${fallbackTheme.colors.secondary})`,
        color: '#ffffff',
        border: 'none'
      },
      secondary: {
        background: 'transparent',
        color: fallbackTheme.colors.primary,
        border: `2px solid ${fallbackTheme.colors.primary}`
      },
      ghost: {
        background: 'transparent',
        color: fallbackTheme.colors.text,
        border: `1px solid ${fallbackTheme.colors.border}`
      },
      error: {
        background: fallbackTheme.colors.error,
        color: '#ffffff',
        border: 'none'
      }
    };
    
    const fallbackSizes = {
      small: { padding: '6px 12px', fontSize: '12px' },
      medium: { padding: '12px 24px', fontSize: '16px' },
      large: { padding: '16px 32px', fontSize: '18px' }
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={className}
        style={{
          ...fallbackVariants[variant] || fallbackVariants.primary,
          ...fallbackSizes[size] || fallbackSizes.medium,
          borderRadius: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          transition: 'all 0.3s ease',
          fontWeight: '600',
          outline: 'none',
          fontFamily: 'inherit',
          ...style
        }}
        {...props}
      >
        {children}
      </button>
    );
  }

  // ОСНОВНАЯ ЛОГИКА С КОРРЕКТНОЙ ТЕМОЙ
  const variants = {
    primary: {
      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary || theme.colors.primary})`,
      color: '#ffffff',
      border: 'none',
      boxShadow: `0 4px 12px ${theme.colors.primary}40`
    },
    secondary: {
      background: 'transparent',
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: 'none'
    },
    error: {
      background: theme.colors.error || '#e74c3c',
      color: '#ffffff',
      border: 'none',
      boxShadow: `0 4px 12px ${theme.colors.error || '#e74c3c'}40`
    },
    success: {
      background: theme.colors.success || '#27ae60',
      color: '#ffffff',
      border: 'none',
      boxShadow: `0 4px 12px ${theme.colors.success || '#27ae60'}40`
    },
    warning: {
      background: theme.colors.warning || '#f39c12',
      color: '#ffffff',
      border: 'none',
      boxShadow: `0 4px 12px ${theme.colors.warning || '#f39c12'}40`
    }
  };

  const sizes = {
    small: { 
      padding: '6px 12px', 
      fontSize: '12px',
      borderRadius: '6px'
    },
    medium: { 
      padding: '12px 24px', 
      fontSize: '16px',
      borderRadius: '8px'
    },
    large: { 
      padding: '16px 32px', 
      fontSize: '18px',
      borderRadius: '10px'
    }
  };

  const buttonStyle = {
    ...variants[variant] || variants.primary,
    ...sizes[size] || sizes.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontWeight: '600',
    outline: 'none',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    
    // Создаем эффект ripple
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(-1px)';
      e.currentTarget.style.boxShadow = buttonStyle.boxShadow?.replace('40', '60') || '0 6px 20px rgba(0,0,0,0.15)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = buttonStyle.boxShadow || 'none';
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}
      </style>
      <button
        type={type}
        style={buttonStyle}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        className={className}
        {...props}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
