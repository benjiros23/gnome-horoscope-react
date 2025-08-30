import React, { useMemo, forwardRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = forwardRef(({ 
  children, 
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style = {},
  className = '',
  type = 'button',
  ...rest 
}, ref) => {
  const { theme } = useTheme();

  // Мемоизированные стили
  const buttonStyles = useMemo(() => {
    const baseStyle = {
      ...theme.components.button[variant],
      fontFamily: theme.container.fontFamily,
      outline: 'none',
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden',
      ...style
    };

    // Размеры кнопок
    const sizes = {
      sm: {
        padding: '8px 16px',
        fontSize: '14px',
        minHeight: '36px',
        borderRadius: '8px'
      },
      md: {
        padding: '12px 24px',
        fontSize: '16px',
        minHeight: '48px',
        borderRadius: '12px'
      },
      lg: {
        padding: '16px 32px',
        fontSize: '18px',
        minHeight: '56px',
        borderRadius: '14px'
      }
    };

    // Состояния
    const states = {
      disabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
        pointerEvents: 'none'
      },
      loading: {
        cursor: 'wait',
        pointerEvents: 'none'
      }
    };

    // Полная ширина
    const widthStyle = fullWidth ? { width: '100%' } : {};

    return {
      ...baseStyle,
      ...sizes[size],
      ...widthStyle,
      ...(disabled && states.disabled),
      ...(loading && states.loading)
    };
  }, [theme, variant, size, fullWidth, disabled, loading, style]);

  // Стили для контента кнопки
  const contentStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: loading ? 0 : 1,
    transition: 'opacity 0.2s ease'
  }), [loading]);

  // Стили для loader
  const loaderStyles = useMemo(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }), []);

  // Обработчик клика
  const handleClick = useMemo(() => {
    if (disabled || loading || !onClick) return undefined;
    
    return (event) => {
      // Добавляем эффект ripple
      const ripple = document.createElement('span');
      const rect = event.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
      `;
      
      event.currentTarget.appendChild(ripple);
      
      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 600);
      
      onClick(event);
    };
  }, [onClick, disabled, loading]);

  // Hover эффекты
  const handleMouseEnter = useMemo(() => {
    if (disabled || loading) return undefined;
    
    return (e) => {
      e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
      
      if (variant === 'primary') {
        e.currentTarget.style.boxShadow = `0 6px 20px ${theme.colors.primary}40`;
      } else {
        e.currentTarget.style.boxShadow = theme.shadows.md;
      }
    };
  }, [disabled, loading, variant, theme]);

  const handleMouseLeave = useMemo(() => {
    if (disabled || loading) return undefined;
    
    return (e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = buttonStyles.boxShadow;
    };
  }, [disabled, loading, buttonStyles.boxShadow]);

  // Компонент Loader
  const Loader = () => (
    <div style={loaderStyles}>
      <div style={{
        width: '20px',
        height: '20px',
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid #ffffff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <button
        ref={ref}
        type={type}
        className={className}
        style={buttonStyles}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        aria-disabled={disabled}
        aria-busy={loading}
        {...rest}
      >
        {/* Loader */}
        {loading && <Loader />}
        
        {/* Основной контент */}
        <span style={contentStyles}>
          {icon && iconPosition === 'left' && (
            <span style={{ fontSize: '1.2em' }}>{icon}</span>
          )}
          
          {children && (
            <span>{children}</span>
          )}
          
          {icon && iconPosition === 'right' && (
            <span style={{ fontSize: '1.2em' }}>{icon}</span>
          )}
        </span>
      </button>
    </>
  );
});

Button.displayName = 'Button';

export default Button;

// Специализированные кнопки
export const PrimaryButton = forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="primary" />
));

export const SecondaryButton = forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="secondary" />
));

export const GhostButton = forwardRef((props, ref) => (
  <Button {...props} ref={ref} variant="ghost" />
));

// Кнопка с иконкой
export const IconButton = forwardRef(({ icon, children, ...props }, ref) => (
  <Button 
    {...props} 
    ref={ref}
    icon={icon}
    size="sm"
    style={{ 
      minWidth: '40px', 
      padding: children ? '8px 12px' : '8px',
      ...props.style 
    }}
  >
    {children}
  </Button>
));

// Floating Action Button
export const FAB = forwardRef(({ icon, ...props }, ref) => (
  <Button
    {...props}
    ref={ref}
    variant="primary"
    style={{
      borderRadius: '50%',
      width: '56px',
      height: '56px',
      minHeight: '56px',
      padding: '0',
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
      ...props.style
    }}
  >
    <span style={{ fontSize: '24px' }}>{icon}</span>
  </Button>
));

// Кнопка загрузки
export const LoadingButton = forwardRef(({ 
  loading, 
  loadingText = 'Загрузка...', 
  children, 
  ...props 
}, ref) => (
  <Button {...props} ref={ref} loading={loading}>
    {loading ? loadingText : children}
  </Button>
));

PrimaryButton.displayName = 'PrimaryButton';
SecondaryButton.displayName = 'SecondaryButton';
GhostButton.displayName = 'GhostButton';
IconButton.displayName = 'IconButton';
FAB.displayName = 'FAB';
LoadingButton.displayName = 'LoadingButton';
