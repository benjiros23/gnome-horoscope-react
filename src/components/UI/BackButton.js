// src/components/UI/BackButton.js
import React from 'react';
import Button from './Button';
import { useTheme } from '../../contexts/ThemeContext';

const BackButton = ({
  onClick,
  label = 'Назад',
  size = 'md',
  variant = 'ghost',
  icon = '⬅️',
  showLabel = true,
  position = 'left', // left, right, center
  disabled = false,
  visible = true,
  animate = true,
  style = {},
  className = '',
  ...props
}) => {
  const { theme } = useTheme();

  // Позиционирование кнопки
  const positions = {
    left: {
      position: 'absolute',
      left: theme.spacing.md,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: theme.zIndex.header - 1
    },
    right: {
      position: 'absolute',
      right: theme.spacing.md,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: theme.zIndex.header - 1
    },
    center: {
      margin: '0 auto',
      display: 'block'
    }
  };

  // Обработчик клика с дополнительной логикой
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    } else {
      // Дефолтное поведение - попытка вернуться назад
      if (typeof window !== 'undefined') {
        if (window.history.length > 1) {
          window.history.back();
        } else {
          // Если истории нет, переходим на главную
          window.location.href = '/';
        }
      }
    }

    // Haptic feedback для Telegram
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  // Стили анимации появления
  const animationStyles = animate ? {
    animation: `fadeInLeft ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
    '@keyframes fadeInLeft': {
      '0%': {
        opacity: 0,
        transform: 'translateX(-20px) translateY(-50%)'
      },
      '100%': {
        opacity: 1,
        transform: 'translateX(0) translateY(-50%)'
      }
    }
  } : {};

  // Не рендерим если не видимая
  if (!visible) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      icon={showLabel ? icon : null}
      iconPosition="left"
      aria-label={`Вернуться назад: ${label}`}
      style={{
        ...positions[position],
        ...animationStyles,
        minWidth: showLabel ? 'auto' : '44px',
        padding: showLabel ? undefined : theme.spacing.sm,
        ...style
      }}
      className={className}
      {...props}
    >
      {showLabel ? label : (showLabel === false && !icon ? '⬅️' : '')}
    </Button>
  );
};

// Специализированные варианты BackButton
export const HeaderBackButton = ({ onBack, ...props }) => (
  <BackButton
    onClick={onBack}
    position="left"
    variant="ghost"
    size="md"
    showLabel={false}
    icon="⬅️"
    {...props}
  />
);

export const FloatingBackButton = ({ onBack, ...props }) => (
  <BackButton
    onClick={onBack}
    variant="primary"
    size="lg"
    style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      borderRadius: '50%',
      width: '56px',
      height: '56px',
      padding: '0',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}
    showLabel={false}
    icon="⬅️"
    {...props}
  />
);

export const InlineBackButton = ({ onBack, ...props }) => (
  <BackButton
    onClick={onBack}
    position="center"
    variant="outline"
    size="sm"
    {...props}
  />
);

export default BackButton;
