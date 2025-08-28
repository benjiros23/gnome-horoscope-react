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

  const getTileStyle = () => {
    const baseStyle = {
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
      fontFamily: theme.container.fontFamily
    };

    if (theme.name === 'wooden') {
      return {
        ...baseStyle,
        background: disabled 
          ? 'linear-gradient(135deg, #999 0%, #666 50%, #444 100%)' 
          : 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
        border: disabled ? '3px solid #555' : '3px solid #8b4513',
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
        color: disabled ? '#aaa' : '#3e2723',
        textShadow: disabled ? 'none' : '1px 1px 2px rgba(0, 0, 0, 0.3)'
      };
    } else if (theme.name === 'neon') {
      return {
        ...baseStyle,
        background: disabled
          ? 'rgba(50, 50, 50, 0.8)'
          : 'linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.1))',
        border: disabled 
          ? '2px solid #333' 
          : '2px solid rgba(0, 255, 255, 0.5)',
        boxShadow: active 
          ? 'inset 0 0 20px rgba(0, 255, 255, 0.3)'
          : disabled 
            ? 'none'
            : '0 0 20px rgba(0, 255, 255, 0.2), 0 0 40px rgba(255, 0, 255, 0.1)',
        color: disabled ? '#666' : '#00ffff'
      };
    } else if (theme.name === 'dark') {
      return {
        ...baseStyle,
        background: disabled
          ? 'rgba(100, 100, 100, 0.3)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(12px)',
        border: disabled 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: active 
          ? 'inset 0 4px 8px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.3)',
        color: disabled ? '#999' : '#ffffff'
      };
    } else {
      // Glass theme (default)
      return {
        ...baseStyle,
        background: disabled
          ? 'rgba(200, 200, 200, 0.3)'
          : 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: disabled 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: active 
          ? 'inset 0 4px 8px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)'
          : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 16px rgba(0, 0, 0, 0.08)',
        color: disabled ? '#999' : theme.colors.text.primary
      };
    }
  };

  const getIconStyle = () => {
    return {
      fontSize: currentSize.iconSize,
      marginBottom: '8px',
      filter: disabled 
        ? 'grayscale(100%)' 
        : theme.name === 'neon'
          ? theme.effects.glow(theme.colors.primary)
          : theme.name === 'wooden'
            ? 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))'
            : theme.effects.glow(theme.colors.primary),
      transition: 'all 0.3s ease'
    };
  };

  const getTextStyle = (isSubtitle = false) => {
    const baseTextStyle = {
      lineHeight: '1.2',
      wordBreak: 'break-word',
      hyphens: 'auto'
    };

    if (isSubtitle) {
      return {
        ...baseTextStyle,
        fontSize: Math.max(10, parseInt(currentSize.fontSize) - 2) + 'px',
        fontWeight: '400',
        opacity: 0.8,
        fontStyle: theme.name === 'wooden' ? 'italic' : 'normal',
        marginTop: '4px'
      };
    }

    return {
      ...baseTextStyle,
      fontSize: currentSize.fontSize,
      fontWeight: theme.name === 'wooden' ? '700' : '600',
      letterSpacing: theme.name === 'wooden' ? '0.5px' : '0.3px',
      textTransform: theme.name === 'wooden' ? 'uppercase' : 'none',
      marginBottom: subtitle ? '4px' : '0'
    };
  };

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
      
      if (theme.name === 'wooden') {
        e.currentTarget.style.boxShadow = `
          inset 0 2px 0 0 rgba(255, 255, 255, 0.4),
          inset 0 -2px 0 0 rgba(0, 0, 0, 0.3),
          0 12px 32px 0 rgba(0, 0, 0, 0.3),
          0 4px 16px 0 rgba(0, 0, 0, 0.2)
        `;
      } else if (theme.name === 'neon') {
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)';
      } else {
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.16), 0 4px 20px rgba(0, 0, 0, 0.12)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !active) {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = getTileStyle().boxShadow;
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
    >
      {/* Деревянная текстура для wooden темы */}
      {theme.name === 'wooden' && !disabled && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          ...theme.texture
        }}></div>
      )}
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {icon && <div style={getIconStyle()}>{icon}</div>}
        {title && <div style={getTextStyle()}>{title}</div>}
        {subtitle && <div style={getTextStyle(true)}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default FunctionTile;
