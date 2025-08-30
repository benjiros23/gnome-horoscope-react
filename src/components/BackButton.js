import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

// ===== КОНФИГУРАЦИЯ КОМПОНЕНТА =====
const BUTTON_CONFIG = {
  size: {
    small: { width: 48, height: 48, fontSize: 20 },
    medium: { width: 64, height: 64, fontSize: 28 },
    large: { width: 80, height: 80, fontSize: 36 }
  },
  position: {
    bottomCenter: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
    bottomLeft: { bottom: '20px', left: '20px' },
    bottomRight: { bottom: '20px', right: '20px' },
    topLeft: { top: '20px', left: '20px' },
    topRight: { top: '20px', right: '20px' }
  },
  animation: {
    duration: '0.3s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

// ===== УТИЛИТЫ ДЛЯ ЖЕСТОВ =====
class GestureHandler {
  static detectSwipe(startY, endY, threshold = 50) {
    const deltaY = startY - endY;
    return Math.abs(deltaY) > threshold ? (deltaY > 0 ? 'up' : 'down') : null;
  }

  static vibrate(pattern = [50]) {
    if (navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }
}

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const BackButton = React.memo(({ 
  onClick,
  show = true,
  size = 'medium',
  position = 'bottomCenter',
  icon = '🏠',
  label = 'Назад на главную',
  showTooltip = true,
  enableSwipe = true,
  enableVibration = true,
  telegramApp = null,
  customStyle = {},
  timeout = null // Автоскрытие через N миллисекунд
}) => {
  const { theme } = useTheme();
  
  const [isVisible, setIsVisible] = useState(show);
  const [isPressed, setIsPressed] = useState(false);
  const [showHint, setShowHint] = useState(showTooltip);
  const [swipeStartY, setSwipeStartY] = useState(null);
  
  const buttonRef = useRef(null);
  const touchStartRef = useRef(null);
  const timeoutRef = useRef(null);

  // Мемоизированные стили
  const styles = useMemo(() => {
    const sizeConfig = BUTTON_CONFIG.size[size];
    const positionConfig = BUTTON_CONFIG.position[position];
    
    const baseButtonStyle = {
      position: 'fixed',
      ...positionConfig,
      width: `${sizeConfig.width}px`,
      height: `${sizeConfig.height}px`,
      borderRadius: '50%',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: `${sizeConfig.fontSize}px`,
      color: '#ffffff',
      fontWeight: 'bold',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      zIndex: 999,
      transition: `all ${BUTTON_CONFIG.animation.duration} ${BUTTON_CONFIG.animation.easing}`,
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      userSelect: 'none',
      outline: 'none',
      ...customStyle
    };

    // Тематические стили
    const themeStyles = {
      facebook: {
        background: 'linear-gradient(135deg, #1877F2, #166fe5)',
        boxShadow: '0 8px 24px rgba(24, 119, 242, 0.4)'
      },
      dark: {
        background: 'linear-gradient(135deg, #495057, #343a40)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
      },
      default: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
      }
    };

    const currentTheme = themeStyles[theme.name] || themeStyles.default;

    return {
      button: {
        ...baseButtonStyle,
        ...currentTheme,
        transform: `${positionConfig.transform || ''} ${isPressed ? 'scale(0.9)' : 'scale(1)'}`,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      },

      tooltip: {
        position: 'fixed',
        bottom: position.includes('bottom') ? `${sizeConfig.width + 40}px` : 'auto',
        top: position.includes('top') ? `${sizeConfig.width + 40}px` : 'auto',
        left: position === 'bottomCenter' ? '50%' : position.includes('Left') ? '20px' : 'auto',
        right: position.includes('Right') ? '20px' : 'auto',
        transform: position === 'bottomCenter' ? 'translateX(-50%)' : '',
        fontSize: '12px',
        color: theme.colors.textSecondary,
        opacity: showHint ? 0.8 : 0,
        pointerEvents: 'none',
        zIndex: 998,
        background: `${theme.colors.surface || theme.card.background}dd`,
        padding: '6px 12px',
        borderRadius: '16px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: `1px solid ${theme.colors.border}40`,
        fontWeight: '500',
        whiteSpace: 'nowrap',
        transition: `opacity ${BUTTON_CONFIG.animation.duration} ease`,
        maxWidth: '200px',
        textAlign: 'center'
      },

      hoverEnhanced: {
        transform: `${positionConfig.transform || ''} translateY(-4px) scale(1.05)`,
        boxShadow: theme.name === 'facebook'
          ? '0 12px 32px rgba(24, 119, 242, 0.6)'
          : theme.name === 'dark'
            ? '0 12px 32px rgba(0, 0, 0, 0.7)'
            : '0 12px 32px rgba(102, 126, 234, 0.6)'
      }
    };
  }, [theme, size, position, isPressed, isVisible, showHint, customStyle]);

  // Обработчики событий
  const handleClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    if (enableVibration) {
      GestureHandler.vibrate([30]);
    }

    // Haptic feedback для Telegram
    try {
      telegramApp?.HapticFeedback?.impactOccurred('light');
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }

    onClick?.();
  }, [onClick, enableVibration, telegramApp]);

  const handleMouseEnter = useCallback((e) => {
    if (!buttonRef.current) return;
    
    Object.assign(buttonRef.current.style, styles.hoverEnhanced);
    setShowHint(true);
  }, [styles.hoverEnhanced]);

  const handleMouseLeave = useCallback((e) => {
    if (!buttonRef.current) return;
    
    buttonRef.current.style.transform = styles.button.transform;
    buttonRef.current.style.boxShadow = styles.button.boxShadow;
    
    setTimeout(() => setShowHint(false), 2000);
  }, [styles.button]);

  const handleTouchStart = useCallback((e) => {
    setIsPressed(true);
    
    if (enableSwipe) {
      const touch = e.touches[0];
      setSwipeStartY(touch.clientY);
      touchStartRef.current = touch.clientY;
    }

    if (enableVibration) {
      GestureHandler.vibrate([10]);
    }
  }, [enableSwipe, enableVibration]);

  const handleTouchEnd = useCallback((e) => {
    setIsPressed(false);
    
    if (enableSwipe && swipeStartY !== null) {
      const touch = e.changedTouches[0];
      const swipeDirection = GestureHandler.detectSwipe(swipeStartY, touch.clientY);
      
      if (swipeDirection === 'up') {
        handleClick(e);
      }
      
      setSwipeStartY(null);
    }
  }, [enableSwipe, swipeStartY, handleClick]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    } else if (e.key === 'Escape') {
      setIsVisible(false);
    }
  }, [handleClick]);

  // Эффект для показа/скрытия кнопки
  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  // Эффект для автоскрытия подсказки
  useEffect(() => {
    if (showTooltip && showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showTooltip, showHint]);

  // Эффект для автоскрытия кнопки
  useEffect(() => {
    if (timeout && isVisible) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, timeout);
      
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [timeout, isVisible]);

  // Эффект для клавиатурной навигации
  useEffect(() => {
    if (isVisible) {
      const handleGlobalKeyDown = (e) => {
        // Глобальные горячие клавиши
        if (e.altKey && e.key === 'h') { // Alt+H для Home
          e.preventDefault();
          handleClick(e);
        }
      };

      document.addEventListener('keydown', handleGlobalKeyDown);
      return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }
  }, [isVisible, handleClick]);

  // Эффект для обработки свайпов на всем экране
  useEffect(() => {
    if (enableSwipe && isVisible) {
      let startY = null;
      
      const handleGlobalTouchStart = (e) => {
        startY = e.touches[0].clientY;
      };
      
      const handleGlobalTouchEnd = (e) => {
        if (startY !== null) {
          const endY = e.changedTouches[0].clientY;
          const swipeDirection = GestureHandler.detectSwipe(startY, endY, 80);
          
          if (swipeDirection === 'up' && startY > window.innerHeight * 0.7) {
            handleClick(e);
          }
          
          startY = null;
        }
      };

      document.addEventListener('touchstart', handleGlobalTouchStart, { passive: true });
      document.addEventListener('touchend', handleGlobalTouchEnd, { passive: true });
      
      return () => {
        document.removeEventListener('touchstart', handleGlobalTouchStart);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [enableSwipe, isVisible, handleClick]);

  if (!isVisible) return null;

  return (
    <>
      {/* Подсказка/тултип */}
      {showTooltip && (
        <div style={styles.tooltip}>
          {enableSwipe ? '↑ Свайп вверх или нажмите' : 'Нажмите для возврата'}
        </div>
      )}
      
      {/* Основная кнопка */}
      <button
        ref={buttonRef}
        style={styles.button}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        aria-label={label}
        role="button"
        tabIndex={0}
      >
        {typeof icon === 'string' ? (
          <span role="img" aria-hidden="true">
            {icon}
          </span>
        ) : (
          icon
        )}
      </button>
    </>
  );
});

BackButton.displayName = 'BackButton';

// ===== СПЕЦИАЛИЗИРОВАННЫЕ ВАРИАНТЫ =====

// Кнопка возврата для навигации
export const NavigationBackButton = React.memo((props) => (
  <BackButton
    {...props}
    icon="←"
    label="Назад"
    position="topLeft"
    size="small"
  />
));

// Кнопка домой
export const HomeButton = React.memo((props) => (
  <BackButton
    {...props}
    icon="🏠"
    label="На главную"
    position="bottomCenter"
  />
));

// Кнопка закрытия
export const CloseButton = React.memo((props) => (
  <BackButton
    {...props}
    icon="✕"
    label="Закрыть"
    position="topRight"
    size="small"
  />
));

// Плавающая кнопка действия
export const FloatingActionButton = React.memo(({ 
  icon = "+", 
  label = "Действие",
  ...props 
}) => (
  <BackButton
    {...props}
    icon={icon}
    label={label}
    position="bottomRight"
    size="large"
    showTooltip={false}
  />
));

NavigationBackButton.displayName = 'NavigationBackButton';
HomeButton.displayName = 'HomeButton';
CloseButton.displayName = 'CloseButton';
FloatingActionButton.displayName = 'FloatingActionButton';

export default BackButton;
