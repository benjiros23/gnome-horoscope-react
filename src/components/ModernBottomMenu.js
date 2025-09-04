// src/components/ModernBottomMenu.js - Современное нижнее меню с видимыми лейблами
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import ExtraMenuModal from './ExtraMenuModal';

const ModernBottomMenu = ({ currentView, onNavigate }) => {
  const { theme, createGradientStyle } = useTheme();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isExtraMenuOpen, setIsExtraMenuOpen] = useState(false);

  // ✅ ОСНОВНЫЕ ПУНКТЫ МЕНЮ (5 ГЛАВНЫХ)
  const mainMenuItems = [
    { id: 'zodiac-selector', title: 'Гороскоп', icon: '🔮', color: '#FF6B6B' },
    { id: 'horoscope', title: 'Прогноз', icon: '⭐', color: '#4ECDC4' },
    { id: 'lunar', title: 'Луна', icon: '🌙', color: '#A8E6CF' },
    { id: 'compatibility', title: 'Любовь', icon: '💕', color: '#FFB6C1' },
    { id: 'favorites', title: 'Избранное', icon: '✨', color: '#FFD700' }
  ];

  // Добавляем CSS анимации
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes menuItemPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes menuItemSlideUp {
        from { 
          transform: translateY(20px); 
          opacity: 0; 
        }
        to { 
          transform: translateY(0); 
          opacity: 1; 
        }
      }
      
      @keyframes iconBounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
        40% { transform: translateY(-8px) scale(1.1); }
        60% { transform: translateY(-4px) scale(1.05); }
      }
      
      @keyframes labelGlow {
        0%, 100% { text-shadow: 0 0 5px currentColor; }
        50% { text-shadow: 0 0 15px currentColor, 0 0 25px currentColor; }
      }
      
      @keyframes rippleEffect {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(4); opacity: 0; }
      }
      
      @keyframes fabPulse {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(180deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const styles = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(22, 33, 62, 0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(244, 197, 66, 0.3)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      padding: '8px 4px 20px 4px',
      zIndex: 1000,
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3)',
      height: '85px',
      background: createGradientStyle([
        'rgba(22, 33, 62, 0.98)',
        'rgba(26, 26, 46, 0.95)'
      ], '180deg').background
    },

    menuItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px 4px',
      cursor: 'pointer',
      borderRadius: '16px',
      minWidth: '60px',
      maxWidth: '70px',
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      animation: 'menuItemSlideUp 0.5s ease-out',
      overflow: 'visible'
    },

    activeItem: {
      backgroundColor: 'rgba(244, 197, 66, 0.15)',
      transform: 'scale(1.1) translateY(-6px)',
      boxShadow: '0 8px 25px rgba(244, 197, 66, 0.4)',
      borderRadius: '18px'
    },

    hoveredItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.05) translateY(-3px)',
      boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)'
    },

    iconContainer: {
      position: 'relative',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '40px',
      height: '40px',
      borderRadius: '12px',
      transition: 'all 0.3s ease'
    },

    icon: {
      fontSize: '24px',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
      position: 'relative',
      zIndex: 2
    },

    activeIcon: {
      fontSize: '26px',
      animation: 'iconBounce 1s ease-in-out',
      filter: 'drop-shadow(0 4px 8px rgba(244, 197, 66, 0.6))'
    },

    hoveredIcon: {
      fontSize: '28px',
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 4px 12px rgba(255, 255, 255, 0.5))'
    },

    label: {
      fontSize: '11px',
      fontWeight: '600',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: '1.2',
      transition: 'all 0.3s ease',
      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '60px',
      marginTop: '2px'
    },

    activeLabel: {
      color: theme.colors.primary,
      fontWeight: '700',
      fontSize: '12px',
      animation: 'labelGlow 2s ease-in-out infinite'
    },

    hoveredLabel: {
      color: '#ffffff',
      fontWeight: '700',
      transform: 'scale(1.05)'
    },

    ripple: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(244, 197, 66, 0.6)',
      transform: 'scale(0)',
      animation: 'rippleEffect 0.6s linear',
      pointerEvents: 'none',
      zIndex: 1
    },

    activeIndicator: {
      position: 'absolute',
      bottom: '-2px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '30px',
      height: '3px',
      background: createGradientStyle([theme.colors.primary, theme.colors.secondary]).background,
      borderRadius: '2px 2px 0 0',
      boxShadow: `0 -2px 8px ${theme.colors.primary}60`
    },

    fab: {
      position: 'fixed',
      bottom: '95px',
      right: '20px',
      width: '56px',
      height: '56px',
      backgroundColor: theme.colors.primary,
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(244, 197, 66, 0.4)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      zIndex: 1001,
      color: 'rgba(22, 33, 62, 0.9)',
      fontSize: '24px',
      fontWeight: 'bold'
    },

    fabHovered: {
      transform: 'scale(1.1)',
      boxShadow: '0 12px 30px rgba(244, 197, 66, 0.6)',
      animation: 'fabPulse 1s ease-in-out infinite'
    }
  };

  // Обработчик клика с эффектом ripple
  const handleItemClick = (itemId, event) => {
    // Создаем ripple эффект
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(244, 197, 66, 0.6);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: rippleEffect 0.6s linear;
      pointer-events: none;
      z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (button.contains(ripple)) {
        button.removeChild(ripple);
      }
    }, 600);

    // Навигация
    onNavigate(itemId);
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }
  };

  const handleFabClick = () => {
    setIsExtraMenuOpen(true);
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  return (
    <>
      <nav style={styles.container}>
        {mainMenuItems.map((item, index) => {
          const isActive = currentView === item.id;
          const isHovered = hoveredItem === item.id;
          
          return (
            <div
              key={item.id}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.activeItem : {}),
                ...(isHovered && !isActive ? styles.hoveredItem : {}),
                animationDelay: `${index * 0.1}s`
              }}
              onClick={(e) => handleItemClick(item.id, e)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Контейнер иконки */}
              <div style={styles.iconContainer}>
                <span 
                  style={{
                    ...styles.icon,
                    color: item.color,
                    ...(isActive ? styles.activeIcon : {}),
                    ...(isHovered && !isActive ? styles.hoveredIcon : {})
                  }}
                >
                  {item.icon}
                </span>
              </div>
              
              {/* Лейбл (всегда видимый) */}
              <span 
                style={{
                  ...styles.label,
                  ...(isActive ? styles.activeLabel : {}),
                  ...(isHovered && !isActive ? styles.hoveredLabel : {})
                }}
              >
                {item.title}
              </span>
              
              {/* Индикатор активности */}
              {isActive && <div style={styles.activeIndicator} />}
            </div>
          );
        })}
      </nav>

      {/* Floating Action Button для дополнительного меню */}
      <button
        style={{
          ...styles.fab,
          ...(isExtraMenuOpen ? styles.fabHovered : {})
        }}
        onClick={handleFabClick}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 30px rgba(244, 197, 66, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 20px rgba(244, 197, 66, 0.4)';
        }}
        title="Дополнительные разделы"
      >
        ⋯
      </button>

      {/* Модальное окно с дополнительными пунктами */}
      <ExtraMenuModal
        isOpen={isExtraMenuOpen}
        onClose={() => setIsExtraMenuOpen(false)}
        onNavigate={onNavigate}
        currentView={currentView}
      />
    </>
  );
};

export default ModernBottomMenu;