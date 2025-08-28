import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeSelector = ({ style = {} }) => {
  const { currentTheme, switchTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = {
    light: { name: 'Светлая', icon: '☀️', color: '#007bff' },
    dark: { name: 'Темная', icon: '🌙', color: '#6c757d' },
    facebook: { name: 'Facebook', icon: '📘', color: '#1877F2' }
  };

  const { theme } = useTheme();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const selectTheme = (themeName) => {
    console.log('🎨 Переключаем тему на:', themeName);
    switchTheme(themeName);
    setIsOpen(false); // Закрываем меню после выбора
  };

  // Стили в зависимости от текущей темы
  const getStyles = () => ({
    container: {
      position: 'fixed',
      top: '15px',
      right: '15px',
      zIndex: 1000,
      fontFamily: theme.container.fontFamily,
      ...style
    },

    burgerButton: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: theme.name === 'facebook' 
        ? 'linear-gradient(135deg, #1877F2, #166fe5)'
        : theme.name === 'dark'
          ? 'linear-gradient(135deg, #495057, #343a40)'
          : 'linear-gradient(135deg, #007bff, #0056b3)',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: theme.name === 'facebook'
        ? '0 4px 12px rgba(24, 119, 242, 0.3)'
        : theme.name === 'dark'
          ? '0 4px 12px rgba(0, 0, 0, 0.4)'
          : '0 4px 12px rgba(0, 123, 255, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1)',
      backdropFilter: 'blur(10px)'
    },

    burgerIcon: {
      width: '20px',
      height: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    },

    burgerLine: (index) => ({
      width: isOpen ? (index === 1 ? '0px' : '20px') : '16px',
      height: '2px',
      backgroundColor: '#ffffff',
      margin: '2px 0',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: '2px',
      transform: isOpen 
        ? (index === 0 ? 'rotate(45deg) translate(6px, 6px)' : 
           index === 2 ? 'rotate(-45deg) translate(6px, -6px)' : 'none')
        : 'none',
      position: isOpen ? 'absolute' : 'relative'
    }),

    dropdown: {
      position: 'absolute',
      top: '60px',
      right: '0',
      background: theme.card.background,
      borderRadius: '16px',
      border: theme.card.border,
      boxShadow: theme.name === 'facebook'
        ? '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)'
        : theme.name === 'dark'
          ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 4px 16px rgba(0, 0, 0, 0.4)'
          : '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
      padding: '12px',
      minWidth: '200px',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transformOrigin: 'top right'
    },

    dropdownTitle: {
      ...theme.typography.subtitle,
      textAlign: 'center',
      marginBottom: '12px',
      color: theme.card.color,
      fontSize: '16px',
      fontWeight: '600',
      paddingBottom: '8px',
      borderBottom: `1px solid ${theme.colors.border}`
    },

    themeOption: (themeName, isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      margin: '4px 0',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: isActive 
        ? (theme.name === 'facebook' ? '#1877F2' : theme.colors.primary)
        : 'transparent',
      color: isActive ? '#ffffff' : theme.card.color,
      border: isActive 
        ? 'none' 
        : `1px solid ${theme.colors.border}`,
      boxShadow: isActive 
        ? `0 2px 8px ${theme.name === 'facebook' ? 'rgba(24, 119, 242, 0.3)' : theme.colors.primary + '40'}`
        : 'none',
      fontWeight: isActive ? '600' : '500'
    }),

    themeIcon: {
      fontSize: '20px',
      flexShrink: 0
    },

    themeName: {
      fontSize: '14px',
      fontWeight: 'inherit'
    },

    activeIndicator: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: '#ffffff',
      marginLeft: 'auto',
      flexShrink: 0
    }
  });

  const styles = getStyles();

  // Закрытие меню при клике вне его
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.theme-selector-container')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="theme-selector-container" style={styles.container}>
      {/* Кнопка-бургер */}
      <button
        style={styles.burgerButton}
        onClick={toggleMenu}
        aria-label={isOpen ? "Закрыть меню тем" : "Открыть меню тем"}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = theme.name === 'facebook'
              ? '0 6px 16px rgba(24, 119, 242, 0.4)'
              : theme.name === 'dark'
                ? '0 6px 16px rgba(0, 0, 0, 0.5)'
                : '0 6px 16px rgba(0, 123, 255, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = styles.burgerButton.boxShadow;
          }
        }}
      >
        <div style={styles.burgerIcon}>
          <div style={styles.burgerLine(0)}></div>
          <div style={styles.burgerLine(1)}></div>
          <div style={styles.burgerLine(2)}></div>
        </div>
      </button>

      {/* Выпадающее меню */}
      <div style={styles.dropdown}>
        <div style={styles.dropdownTitle}>
          🎨 Выбор темы
        </div>
        
        {availableThemes.map((themeName) => {
          const themeInfo = themes[themeName];
          const isActive = currentTheme === themeName;
          
          if (!themeInfo) return null;
          
          return (
            <div
              key={themeName}
              style={styles.themeOption(themeName, isActive)}
              onClick={() => selectTheme(themeName)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.background = theme.colors.surface;
                  e.target.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateX(0)';
                }
              }}
            >
              <div style={styles.themeIcon}>
                {themeInfo.icon}
              </div>
              <div style={styles.themeName}>
                {themeInfo.name}
              </div>
              {isActive && (
                <div style={styles.activeIndicator}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Фоновая подложка при открытом меню */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.1)',
            zIndex: -1,
            backdropFilter: 'blur(2px)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ThemeSelector;
