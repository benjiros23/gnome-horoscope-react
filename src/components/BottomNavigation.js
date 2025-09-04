// src/components/BottomNavigation.js
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BottomNavigation = ({ currentView, onNavigate }) => {
  const { theme } = useTheme();

  // Элементы нижней навигации
  // В src/components/BottomNavigation.js замените navItems:

const navItems = [
  { 
    id: 'zodiac-selector', 
    title: 'Гороскоп', 
    icon: '🔮',
    description: 'Персональный прогноз'
  },
  { 
    id: 'moon', 
    title: 'Луна', 
    icon: '🌙',
    description: 'Фазы и календарь'
  },
  { 
    id: 'numerology', // ✅ ДОБАВЛЕНА НУМЕРОЛОГИЯ
    title: 'Числа', 
    icon: '🔢',
    description: 'Нумерология и числа'
  },
  { 
    id: 'events', 
    title: 'События', 
    icon: '🌌',
    description: 'Астрологические события'
  },
  { 
    id: 'favorites', 
    title: 'Избранное', 
    icon: '⭐',
    description: 'Сохраненные прогнозы'
  }
];


  // Стили нижней навигации
  const navStyles = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: `${theme.colors.surface}F0`, // Полупрозрачность
      borderTop: `1px solid ${theme.colors.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: `${theme.spacing.sm} ${theme.spacing.xs}`,
      zIndex: 1000,
      backdropFilter: 'blur(15px)',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
      height: '70px',
      boxSizing: 'border-box'
    },

    item: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      cursor: 'pointer',
      transition: `all ${theme.animations.duration.normal} ease`,
      borderRadius: theme.borderRadius.md,
      minWidth: '60px',
      position: 'relative',
      flex: 1,
      maxWidth: '80px'
    },

    activeItem: {
      backgroundColor: `${theme.colors.primary}20`,
      transform: 'scale(1.1)',
      boxShadow: `0 2px 8px ${theme.colors.primary}40`
    },

    icon: {
      fontSize: '22px',
      marginBottom: '4px',
      transition: `all ${theme.animations.duration.fast} ease`,
      filter: 'none'
    },

    activeIcon: {
      transform: 'scale(1.2)',
      filter: 'drop-shadow(0 2px 4px rgba(244, 197, 66, 0.6))'
    },

    title: {
      fontSize: '11px',
      color: theme.colors.textSecondary,
      fontWeight: theme.typography.weights.medium,
      textAlign: 'center',
      lineHeight: 1,
      transition: `all ${theme.animations.duration.fast} ease`
    },

    activeTitle: {
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.bold,
      transform: 'scale(1.05)'
    },

    ripple: {
      position: 'absolute',
      borderRadius: '50%',
      backgroundColor: `${theme.colors.primary}30`,
      transform: 'scale(0)',
      animation: 'ripple 0.6s linear',
      pointerEvents: 'none'
    }
  };

  // Обработчик клика с анимацией
  const handleItemClick = (itemId, event) => {
    // Создаем эффект ripple
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background-color: ${theme.colors.primary}40;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (button.contains(ripple)) {
        button.removeChild(ripple);
      }
    }, 600);

    // Навигация
    onNavigate(itemId);
    
    // Safe Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      tg.HapticFeedback.impactOccurred('light');
    }

    console.log(`📱 Нижняя навигация: переход на ${itemId}`);
  };

  // CSS анимация для ripple эффекта
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-3px);
        }
        60% {
          transform: translateY(-2px);
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <nav style={navStyles.container}>
      {navItems.map((item, index) => {
        const isActive = currentView === item.id;
        
        return (
          <div
            key={item.id}
            style={{
              ...navStyles.item,
              ...(isActive ? navStyles.activeItem : {}),
              animationDelay: `${index * 0.1}s`
            }}
            onClick={(e) => handleItemClick(item.id, e)}
            title={item.description}
          >
            <span 
              style={{
                ...navStyles.icon,
                ...(isActive ? navStyles.activeIcon : {})
              }}
            >
              {item.icon}
            </span>
            <span 
              style={{
                ...navStyles.title,
                ...(isActive ? navStyles.activeTitle : {})
              }}
            >
              {item.title}
            </span>
            
            {/* Индикатор активности */}
            {isActive && (
              <div style={{
                position: 'absolute',
                bottom: '-1px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '30px',
                height: '3px',
                backgroundColor: theme.colors.primary,
                borderRadius: '2px 2px 0 0',
                boxShadow: `0 -1px 4px ${theme.colors.primary}60`
              }} />
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
