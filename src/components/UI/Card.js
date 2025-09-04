// src/components/UI/Card.js
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  borderRadius = 'md',
  clickable = false,
  hoverable = true,
  fullHeight = false,
  fullWidth = false,
  gradient = null,
  glowEffect = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style = {},
  className = '',
  ...props
}) => {
  const { theme, createGradientStyle } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Размеры отступов
  const paddingSizes = {
    none: '0',
    xs: theme.spacing.xs,
    sm: theme.spacing.sm,
    md: theme.spacing.md,
    lg: theme.spacing.lg,
    xl: theme.spacing.xl
  };

  // Размеры скругления углов
  const borderRadiusSizes = {
    sm: theme.borderRadius.sm,
    md: theme.borderRadius.md,
    lg: theme.borderRadius.lg,
    xl: theme.borderRadius.xl
  };

  // Варианты стилей карточек
  const variants = {
    default: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadows.sm
    },
    elevated: {
      backgroundColor: theme.colors.surface,
      border: 'none',
      boxShadow: theme.shadows.md
    },
    outlined: {
      backgroundColor: 'transparent',
      border: `2px solid ${theme.colors.border}`,
      boxShadow: 'none'
    },
    gradient: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      boxShadow: theme.shadows.sm,
      position: 'relative',
      overflow: 'hidden'
    }
  };

  // Hover эффекты
  const hoverEffects = {
    default: {
      boxShadow: hoverable ? theme.shadows.md : theme.shadows.sm,
      transform: hoverable && clickable ? 'translateY(-2px)' : 'none'
    },
    elevated: {
      boxShadow: hoverable ? theme.shadows.lg : theme.shadows.md,
      transform: hoverable && clickable ? 'translateY(-4px)' : 'none'
    },
    outlined: {
      borderColor: hoverable ? theme.colors.primary : theme.colors.border,
      boxShadow: hoverable ? `0 0 0 1px ${theme.colors.primary}33` : 'none'
    },
    gradient: {
      boxShadow: hoverable ? theme.shadows.lg : theme.shadows.sm,
      transform: hoverable && clickable ? 'translateY(-2px) scale(1.02)' : 'none'
    }
  };

  // Базовые стили карточки
  const baseStyles = {
    borderRadius: borderRadiusSizes[borderRadius] || theme.borderRadius.md,
    padding: paddingSizes[padding] || theme.spacing.md,
    transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
    cursor: clickable ? 'pointer' : 'default',
    userSelect: clickable ? 'none' : 'auto',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: fullWidth ? '100%' : 'auto',
    height: fullHeight ? '100%' : 'auto',
    minHeight: fullHeight ? '200px' : 'auto',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent'
  };

  // Объединяем все стили
  const cardStyles = {
    ...baseStyles,
    ...variants[variant],
    ...(isHovered ? hoverEffects[variant] : {}),
    ...style
  };

  // Обработчики событий
  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }

    // Haptic feedback для Telegram
    if (clickable && window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleMouseEnter = (e) => {
    if (hoverable) {
      setIsHovered(true);
    }
    if (onMouseEnter) {
      onMouseEnter(e);
    }
  };

  const handleMouseLeave = (e) => {
    setIsHovered(false);
    if (onMouseLeave) {
      onMouseLeave(e);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      handleClick(e);
    }
  };

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {/* Градиентный фон */}
      {(variant === 'gradient' || gradient) && createGradientStyle && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            ...createGradientStyle(
              gradient || [theme.colors.primary, theme.colors.secondary],
              '135deg'
            ),
            opacity: 0.1,
            zIndex: 0
          }}
        />
      )}

      {/* Эффект свечения */}
      {glowEffect && isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            borderRadius: borderRadiusSizes[borderRadius] || theme.borderRadius.md,
            background: `linear-gradient(135deg, ${theme.colors.primary}66, ${theme.colors.secondary}66)`,
            filter: 'blur(6px)',
            zIndex: -1,
            opacity: 0.7
          }}
        />
      )}

      {/* Основной контент */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Card;

// Специализированные варианты Card
export const HoroscopeCard = ({ children, ...props }) => (
  <Card
    variant="gradient"
    borderRadius="lg"
    padding="lg"
    glowEffect
    hoverable
    {...props}
  >
    {children}
  </Card>
);

export const StatsCard = ({ children, ...props }) => (
  <Card
    variant="elevated"
    borderRadius="md"
    padding="md"
    hoverable={false}
    {...props}
  >
    {children}
  </Card>
);

export const NavigationCard = ({ children, onClick, ...props }) => (
  <Card
    variant="default"
    clickable
    hoverable
    onClick={onClick}
    {...props}
  >
    {children}
  </Card>
);

export const FormCard = ({ children, ...props }) => (
  <Card
    variant="outlined"
    borderRadius="md"
    padding="lg"
    hoverable={false}
    {...props}
  >
    {children}
  </Card>
);
