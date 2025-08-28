import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const FunctionTile = ({ 
  icon,
  title, 
  subtitle,
  onClick,
  disabled = false,
  active = false,
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const { theme } = useTheme();

  const sizes = {
    small: { width: '80px', height: '80px', fontSize: '12px', iconSize: '24px' },
    normal: { width: '120px', height: '120px', fontSize: '14px', iconSize: '32px' },
    large: { width: '160px', height: '160px', fontSize: '16px', iconSize: '40px' }
  };

  const currentSize = sizes[size] || sizes.normal;

  // Базовые стили плитки
  const getBaseStyle = () => ({
    width: currentSize.width,
    height: currentSize.height,
    borderRadius: '16px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    margin: '8px',
    textAlign: 'center',
    userSelect: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    opacity: disabled ? 0.6 : 1,
    transform: active ? 'scale(0.95)' : 'scale(1)',
    fontFamily: theme.container.fontFamily || 'system-ui, sans-serif'
  });

  // Стили для разных тем
  const getTileStyle = () => {
    const baseStyle = getBaseStyle();

    if (disabled) {
      return {
        ...baseStyle,
        background: 'rgba(120, 120, 120, 0.3)',
        border: '2px solid rgba(120, 120, 120, 0.5)',
        color: '#999',
        filter: 'grayscale(100%)'
      };
    }

    switch (theme.name) {
      case 'wooden':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
          border: '3px solid #8b4513',
          boxShadow: active ? `
            inset 0 4px 0 0 rgba(0, 0, 0, 0.3),
            inset 0 -4px 0 0 rgba(255, 255, 255, 0.2),
            0 4px 12px 0 rgba(139, 69, 19, 0.3)
          ` : `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
            0 8px 24px 0 rgba(0, 0, 0, 0.25),
            0 2px 8px 0 rgba(0, 0, 0, 0.15)
          `,
          color: '#3e2723',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
        };

      case 'neon':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.1))',
          border: '2px solid rgba(0, 255, 255, 0.5)',
          boxShadow: active 
            ? 'inset 0 0 20px rgba(0, 255, 255, 0.3), 0 0 10px rgba(0, 255, 255, 0.2)'
            : '0 0 20px rgba(0, 255, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.1)',
          color: '#00ffff',
          textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
        };

      case 'dark':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: active 
            ? 'inset 0 4px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 16px rgba(0, 0, 0, 0.15)',
          color: '#ffffff'
        };

      default: // glass
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: active 
            ? 'inset 0 4px 8px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(0, 0, 0, 0.08)',
          color: theme.colors.text.primary
        };
    }
  };

  // Стили для иконки
  const getIconStyle = () => ({
    fontSize: currentSize.iconSize,
    marginBottom: '8px',
    filter: disabled 
      ? 'grayscale(100%)' 
      : theme.name === 'neon'
        ? 'drop-shadow(0 0 10px currentColor)'
        : theme.name === 'wooden'
          ? 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
          : theme.name === 'glass'
            ? `drop-shadow(0 0 8px ${theme.colors.primary}80)`
            : 'none',
    transition: 'all 0.3s ease'
  });

  // Стили для текста
  const getTitleStyle = () => ({
    fontSize: currentSize.fontSize,
    fontWeight: theme.name === 'wooden' ? '700' : '600',
    letterSpacing: theme.name === 'wooden' ? '0.5px' : '0.3px',
    textTransform: theme.name === 'wooden' ? 'uppercase' : 'none',
    marginBottom: subtitle ? '4px' : '0',
    lineHeight: '1.2',
    wordBreak: 'break-word'
  });

  const getSubtitleStyle = () => ({
    fontSize: Math.max(10, parseInt(currentSize.fontSize) - 2) + 'px',
    fontWeight: '400',
    opacity: 0.8,
    fontStyle: theme.name === 'wooden' ? 'italic' : 'normal',
    marginTop: '4px',
    lineHeight: '1.1',
    wordBreak: 'break-word'
  });

  // Обработчики событий
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !active) {
      const hoverTransform = theme.name === 'wooden' 
        ? 'translateY(-4px) scale(1.05)' 
        : 'translateY(-2px) scale(1.05)';
      
      e.currentTarget.style.transform = hoverTransform;
      
      // Применяем hover-эффекты в зависимости от темы
      switch (theme.name) {
        case 'wooden':
          e.currentTarget.style.boxShadow = `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.4),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.3),
            0 12px 32px 0 rgba(0, 0, 0, 0.3),
            0 4px 16px 0 rgba(0, 0, 0, 0.2)
          `;
          break;
        case 'neon':
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)';
          e.currentTarget.style.border = '2px solid rgba(0, 255, 255, 0.8)';
          break;
        case 'dark':
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 4px 20px rgba(255, 255, 255, 0.1)';
          break;
        default: // glass
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.16), 0 4px 20px rgba(0, 0, 0, 0.12)';
          break;
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !active) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      
      // Восстанавливаем исходные стили
      const originalStyle = getTileStyle();
      e.currentTarget.style.boxShadow = originalStyle.boxShadow;
      
      if (theme.name === 'neon') {
        e.currentTarget.style.border = originalStyle.border;
      }
    }
  };

  const handleMouseDown = (e) => {
    if (!disabled) {
      e.currentTarget.style.transform = 'translateY(1px) scale(0.98)';
    }
  };

  const handleMouseUp = (e) => {
    if (!disabled && !active) {
      const hoverTransform = theme.name === 'wooden' 
        ? 'translateY(-4px) scale(1.05)' 
        : 'translateY(-2px) scale(1.05)';
      e.currentTarget.style.transform = hoverTransform;
    }
  };

  return (
    <div 
      style={getTileStyle()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Деревянная текстура только для wooden темы */}
      {theme.name === 'wooden' && !disabled && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(
              90deg,
              rgba(0, 0, 0, 0.1) 0px,
              transparent 1px,
              transparent 3px,
              rgba(0, 0, 0, 0.05) 4px
            )
          `,
          opacity: 0.6,
          pointerEvents: 'none'
        }}></div>
      )}
      
      {/* Контент плитки */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Иконка */}
        {icon && (
          <div style={getIconStyle()}>
            {icon}
          </div>
        )}
        
        {/* Заголовок */}
        {title && (
          <div style={getTitleStyle()}>
            {title}
          </div>
        )}
        
        {/* Подзаголовок */}
        {subtitle && (
          <div style={getSubtitleStyle()}>
            {subtitle}
          </div>
        )}
      </div>

      {/* Декоративная подсветка для neon темы */}
      {theme.name === 'neon' && !disabled && (
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          borderRadius: '12px',
          pointerEvents: 'none',
          opacity: 0.5
        }}></div>
      )}
    </div>
  );
};

export default FunctionTile;
