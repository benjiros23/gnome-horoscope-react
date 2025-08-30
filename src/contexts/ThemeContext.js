import React, { createContext, useContext, useMemo } from 'react';

// ===== ЕДИНАЯ ЧЕРНАЯ ТЕМА =====
const DARK_THEME = {
  name: 'dark',
  colors: {
    // Основные цвета
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    
    // Фоны
    background: '#0f0f23',
    surface: '#1a1a2e',
    surfaceLight: '#16213e',
    
    // Текст
    text: '#ffffff',
    textSecondary: '#b8b8cc',
    textMuted: '#8a8a9a',
    
    // Границы и разделители
    border: 'rgba(255, 255, 255, 0.1)',
    divider: 'rgba(255, 255, 255, 0.05)',
    
    // Состояния
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    
    // Наложения
    overlay: 'rgba(0, 0, 0, 0.7)',
    backdrop: 'rgba(15, 15, 35, 0.95)'
  },
  
  // Готовые стили для компонентов
  components: {
    // Контейнер приложения
    container: {
      backgroundColor: '#0f0f23',
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      lineHeight: '1.6',
      minHeight: '100vh'
    },
    
    // Карточки
    card: {
      background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9) 0%, rgba(22, 33, 62, 0.8) 100%)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      padding: '24px',
      margin: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      color: '#ffffff',
      position: 'relative',
      overflow: 'hidden'
    },
    
    // Кнопки
    button: {
      primary: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '48px'
      },
      
      secondary: {
        background: 'rgba(255, 255, 255, 0.05)',
        color: '#ffffff',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '48px'
      },
      
      ghost: {
        background: 'transparent',
        color: 'rgba(255, 255, 255, 0.8)',
        border: 'none',
        borderRadius: '12px',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '48px'
      }
    },
    
    // Инпуты
    input: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '12px 16px',
      fontSize: '16px',
      color: '#ffffff',
      outline: 'none',
      transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box'
    }
  },
  
  // Анимации и переходы
  animations: {
    // Базовые переходы
    fast: '0.15s ease',
    normal: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Специальные эффекты
    bounce: '0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    
    // Фейды
    fadeIn: 'fadeIn 0.3s ease-in-out',
    slideUp: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Размеры и отступы
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  // Радиусы скругления
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '9999px'
  },
  
  // Тени
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    md: '0 4px 16px rgba(0, 0, 0, 0.15)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.2)',
    xl: '0 16px 64px rgba(0, 0, 0, 0.25)'
  },
  
  // Типография
  typography: {
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1.2',
      color: '#ffffff',
      margin: '0 0 24px 0'
    },
    h2: {
      fontSize: '24px',
      fontWeight: '600',
      lineHeight: '1.3',
      color: '#ffffff',
      margin: '0 0 20px 0'
    },
    h3: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.4',
      color: '#ffffff',
      margin: '0 0 16px 0'
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.6',
      color: '#ffffff'
    },
    caption: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'rgba(255, 255, 255, 0.7)'
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: '500',
      lineHeight: '1.5',
      color: 'rgba(255, 255, 255, 0.9)'
    }
  }
};

// ===== КОНТЕКСТ =====
const ThemeContext = createContext();

// ===== ХУКИ =====
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// ===== ПРОВАЙДЕР =====
export const ThemeProvider = ({ children }) => {
  // Мемоизируем значение контекста для оптимизации
  const value = useMemo(() => ({
    theme: DARK_THEME,
    currentTheme: 'dark',
    // Для совместимости со старым API
    colors: DARK_THEME.colors,
    components: DARK_THEME.components,
    animations: DARK_THEME.animations,
    spacing: DARK_THEME.spacing,
    typography: DARK_THEME.typography
  }), []);

  console.log('🎨 ThemeProvider: Темная тема активна');

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// ===== ХЕЛПЕРЫ ДЛЯ СТИЛЕЙ =====

// Генератор градиентов
export const createGradient = (color1, color2, direction = '135deg') => 
  `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`;

// Генератор теней с цветом
export const createColoredShadow = (color, opacity = 0.3, blur = 16) =>
  `0 4px ${blur}px ${color}${Math.round(opacity * 255).toString(16)}`;

// Генератор glassmorphism эффекта
export const createGlassmorphism = (background, blur = 10, opacity = 0.1) => ({
  background: `rgba(${background}, ${opacity})`,
  backdropFilter: `blur(${blur}px)`,
  WebkitBackdropFilter: `blur(${blur}px)`,
  border: '1px solid rgba(255, 255, 255, 0.1)'
});

// Адаптивные размеры
export const responsive = {
  mobile: '(max-width: 768px)',
  tablet: '(max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  
  // Хелперы для стилей
  isMobile: () => window.innerWidth <= 768,
  isTablet: () => window.innerWidth <= 1024 && window.innerWidth > 768,
  isDesktop: () => window.innerWidth >= 1025
};

// ===== CSS-IN-JS ХЕЛПЕРЫ =====

// Создание hover эффектов
export const createHoverEffect = (baseStyles, hoverStyles) => ({
  ...baseStyles,
  transition: DARK_THEME.animations.normal,
  ':hover': {
    ...baseStyles,
    ...hoverStyles
  }
});

// Создание анимации появления
export const createFadeInAnimation = (duration = '0.3s') => ({
  opacity: 0,
  animation: `fadeIn ${duration} ease-in-out forwards`,
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  }
});

// ===== ЭКСПОРТЫ =====
export default ThemeContext;

// Именованные экспорты для удобства
export {
  DARK_THEME as theme,
  DARK_THEME as darkTheme
};

// CSS переменные для глобального использования
if (typeof document !== 'undefined') {
  const root = document.documentElement;
  const colors = DARK_THEME.colors;
  
  // Устанавливаем CSS переменные
  Object.entries(colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  console.log('🎨 CSS переменные установлены');
}
