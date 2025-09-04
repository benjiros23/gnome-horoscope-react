// src/components/UI/Button.js
import React, { useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, ghost, danger
  size = 'md', // xs, sm, md, lg, xl
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left', // left, right
  onClick,
  onMouseEnter,
  onMouseLeave,
  type = 'button',
  style = {},
  className = '',
  ...props
}) => {
  const { theme } = useTheme();

  // Размеры кнопок
  const sizes = {
    xs: {
      fontSize: theme.typography.sizes.xs,
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.sm,
      height: '28px',
      minWidth: '60px'
    },
    sm: {
      fontSize: theme.typography.sizes.sm,
      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.sm,
      height: '32px',
      minWidth: '80px'
    },
    md: {
      fontSize: theme.typography.sizes.md,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.md,
      height: '40px',
      minWidth: '100px'
    },
    lg: {
      fontSize: theme.typography.sizes.lg,
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      borderRadius: theme.borderRadius.lg,
      height: '48px',
      minWidth: '120px'
    },
    xl: {
      fontSize: theme.typography.sizes.xl,
      padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
      borderRadius: theme.borderRadius.lg,
      height: '56px',
      minWidth: '140px'
    }
  };

  // Варианты стилей
  const variants = {
    primary: {
      backgroundColor: theme.colors.primary,
      color: theme.colors.background,
      border: 'none',
      boxShadow: `0 4px 12px ${theme.colors.primary}40`,
      '&:hover': {
        backgroundColor: theme.colors.secondary,
        boxShadow: `0 6px 16px ${theme.colors.primary}60`,
        transform: 'translateY(-2px)'
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: `0 2px 8px ${theme.colors.primary}60`
      }
    },
    secondary: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadows.sm,
      '&:hover': {
        backgroundColor: theme.colors.borderLight,
        boxShadow: theme.shadows.md,
        transform: 'translateY(-2px)'
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: theme.shadows.sm
      }
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary,
      border: `2px solid ${theme.colors.primary}`,
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: theme.colors.primary,
        color: theme.colors.background,
        boxShadow: `0 4px 12px ${theme.colors.primary}40`
      },
      '&:active': {
        transform: 'scale(0.98)'
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.text,
      border: 'none',
      boxShadow: 'none',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: theme.colors.primary
      },
      '&:active': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    },
    danger: {
      backgroundColor: theme.colors.danger,
      color: '#ffffff',
      border: 'none',
      boxShadow: `0 4px 12px ${theme.colors.danger}40`,
      '&:hover': {
        backgroundColor: '#b91c1c',
        boxShadow: `0 6px 16px ${theme.colors.danger}60`,
        transform: 'translateY(-2px)'
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: `0 2px 8px ${theme.colors.danger}60`
      }
    }
  };

  // Добавляем анимацию спиннера
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('button-animations');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'button-animations';
        style.textContent = `
          @keyframes button-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes button-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Обработчик клика с haptic feedback
  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }

    // Haptic feedback для Telegram WebApp
    if (window.Telegram?.WebApp?.HapticFeedback) {
      const feedbackType = variant === 'danger' ? 'medium' : 'light';
      window.Telegram.WebApp.HapticFeedback.impactOccurred(feedbackType);
    }
  };

  // Обработчики hover эффектов
  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      const variantStyles = variants[variant];
      const hoverStyles = variantStyles['&:hover'];
      
      if (hoverStyles) {
        Object.assign(e.currentTarget.style, {
          backgroundColor: hoverStyles.backgroundColor || variantStyles.backgroundColor,
          color: hoverStyles.color || variantStyles.color,
          boxShadow: hoverStyles.boxShadow || variantStyles.boxShadow,
          transform: hoverStyles.transform || 'none'
        });
      }
    }
    
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      const variantStyles = variants[variant];
      Object.assign(e.currentTarget.style, {
        backgroundColor: variantStyles.backgroundColor,
        color: variantStyles.color,
        boxShadow: variantStyles.boxShadow,
        transform: 'none'
      });
    }
    
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  };

  const handleMouseDown = (e) => {
    if (!disabled && !loading) {
      const variantStyles = variants[variant];
      const activeStyles = variantStyles['&:active'];
      
      if (activeStyles) {
        Object.assign(e.currentTarget.style, {
          transform: activeStyles.transform || 'scale(0.98)',
          boxShadow: activeStyles.boxShadow || variantStyles.boxShadow
        });
      }
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled && !loading) {
      e.currentTarget.style.transform = 'none';
    }
  };

  // Стили для кнопки
  const buttonStyle = {
    ...sizes[size],
    ...variants[variant],
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : loading ? 'wait' : 'pointer',
    userSelect: 'none',
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    WebkitTapHighlightColor: 'transparent',
    ...style
  };

  // Компонент иконки загрузки
  const LoadingSpinner = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        animation: 'button-spin 1s linear infinite'
      }}
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );

  return (
    <button
      type={type}
      className={className}
      style={buttonStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || loading}
      {...props}
    >
      {/* Анимация пульсации при loading */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            animation: 'button-pulse 1.5s ease-in-out infinite'
          }}
        />
      )}

      {/* Иконка слева */}
      {icon && iconPosition === 'left' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}

      {/* Спиннер загрузки */}
      {loading && <LoadingSpinner />}

      {/* Текст кнопки */}
      <span style={{ 
        position: 'relative',
        zIndex: 1,
        opacity: loading ? 0.7 : 1
      }}>
        {children}
      </span>

      {/* Иконка справа */}
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
    </button>
  );
};

export default Button;
