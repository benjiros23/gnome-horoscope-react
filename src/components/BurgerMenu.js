// src/components/BurgerMenu.js
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BurgerMenu = ({
  isOpen = false,
  onClose,
  onNavigate,
  currentView = 'zodiac-selector',
  userProfile = null
}) => {
  const { theme, createGradientStyle } = useTheme();

  // ✅ ИСПРАВЛЕННЫЙ массив menuItems без синтаксических ошибок
  const menuItems = [
    { 
      id: 'zodiac-selector', 
      title: 'Выбор знака', 
      icon: '🔮',
      description: 'Выберите знак зодиака'
    },
    { 
      id: 'horoscope', 
      title: 'Гороскоп', 
      icon: '⭐',
      description: 'Персональный прогноз'
    },
    { 
      id: 'moon', 
      title: 'Лунный календарь', 
      icon: '🌙',
      description: 'Фазы и влияние Луны'
    },
    { 
      id: 'compatibility', 
      title: 'Совместимость', 
      icon: '💕',
      description: 'Отношения знаков'
    },
    { 
      id: 'cards', 
      title: 'Карта дня', 
      icon: '🃏',
      description: 'Магическое предсказание'
    },
    { 
      id: 'numerology', 
      title: 'Нумерология', 
      icon: '🔢',
      description: 'Сила чисел'
    },
    { 
      id: 'events', 
      title: 'Астрособытия', 
      icon: '🌌', 
      description: 'Космические события' 
    },
    { 
      id: 'mercury', 
      title: 'Меркурий', 
      icon: '🪐', 
      description: 'Ретроградные периоды' 
    },
    { 
      id: 'favorites', 
      title: 'Избранное', 
      icon: '⭐', 
      description: 'Сохраненные предсказания' 
    }
  ];

  const menuStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 10000,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(4px)'
    },

    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '320px',
      height: '100vh',
      backgroundColor: theme.colors.surface,
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
      zIndex: 10001,
      overflowY: 'auto'
    },

    header: {
      padding: theme.spacing.xl,
      background: createGradientStyle([theme.colors.primary, theme.colors.secondary], '135deg').background,
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    },

    headerDecoration: {
      position: 'absolute',
      top: '-20px',
      right: '-20px',
      fontSize: '80px',
      opacity: 0.2,
      pointerEvents: 'none'
    },

    headerContent: {
      position: 'relative',
      zIndex: 2
    },

    title: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      margin: '0 0 4px 0',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    subtitle: {
      fontSize: theme.typography.sizes.sm,
      opacity: 0.9,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    closeButton: {
      position: 'absolute',
      top: theme.spacing.md,
      right: theme.spacing.md,
      backgroundColor: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: '#ffffff',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 3
    },

    menuList: {
      flex: 1,
      padding: theme.spacing.md,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing.xs
    },

    menuItem: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.md,
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textAlign: 'left',
      width: '100%',
      position: 'relative',
      overflow: 'hidden'
    },

    menuItemActive: {
      backgroundColor: `${theme.colors.primary}20`,
      borderLeft: `4px solid ${theme.colors.primary}`
    },

    menuIcon: {
      fontSize: '24px',
      width: '32px',
      textAlign: 'center'
    },

    menuContent: {
      flex: 1
    },

    menuTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      margin: '0 0 2px 0'
    },

    menuDescription: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      margin: 0,
      opacity: 0.8
    },

    footer: {
      padding: theme.spacing.lg,
      borderTop: `1px solid ${theme.colors.border}`,
      backgroundColor: `${theme.colors.background}50`
    },

    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.sm
    }
  };

  const handleItemClick = (itemId) => {
    console.log(`🔗 Бургер меню: переход на ${itemId}`);
    
    if (onNavigate) {
      onNavigate(itemId);
    }
    if (onClose) {
      onClose();
    }
    
    // Safe Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      tg.HapticFeedback.impactOccurred('light');
    }
  };

  const handleCloseClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    e.preventDefault();
    handleCloseClick();
  };

  return (
    <>
      <div style={menuStyles.overlay} onClick={handleOverlayClick} />
      
      <div style={menuStyles.sidebar} onClick={(e) => e.stopPropagation()}>
        
        <div style={menuStyles.header}>
          <div style={menuStyles.headerDecoration}>🔮</div>
          
          <button
            style={menuStyles.closeButton}
            onClick={handleCloseClick}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
          
          <div style={menuStyles.headerContent}>
            <h3 style={menuStyles.title}>Астро Гном</h3>
            <p style={menuStyles.subtitle}>Ваш персональный астролог</p>
          </div>
        </div>

        <div style={menuStyles.menuList}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              style={{
                ...menuStyles.menuItem,
                ...(currentView === item.id ? menuStyles.menuItemActive : {})
              }}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={(e) => {
                if (currentView !== item.id) {
                  e.target.style.backgroundColor = `${theme.colors.primary}10`;
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentView !== item.id) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <div style={menuStyles.menuIcon}>{item.icon}</div>
              <div style={menuStyles.menuContent}>
                <div style={menuStyles.menuTitle}>{item.title}</div>
                <div style={menuStyles.menuDescription}>{item.description}</div>
              </div>
            </button>
          ))}
        </div>

        <div style={menuStyles.footer}>
          <div style={menuStyles.userInfo}>
            <span style={{ fontSize: '20px' }}>👤</span>
            <span>{userProfile?.first_name || 'Астрологический пользователь'}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
