// src/contexts/ThemeContext.js
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const theme = {
  colors: {
    primary: '#F4C542',
    secondary: '#4ECDC4',
    background: '#1a1a2e',
    surface: '#16213e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#2d3748',
    borderLight: '#4a5568',
    success: '#16a34a',
    danger: '#dc2626',
    warning: '#f59e0b',
    // 🧙‍♂️ ГНОМЬИ ЦВЕТА
    gnomeGold: '#FFD700',
    gnomeMagic: '#9370DB',
    gnomeHat: '#B22222',
    gnomeBeard: '#F5DEB3',
    gnomeForest: '#228B22'
  },
  // 🧙‍♂️ МАГИЧЕСКИЕ ЭФФЕКТЫ ГНОМОВ
  gnomeEffects: {
    goldGlow: '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2)',
    magicGlow: '0 0 20px rgba(147, 112, 219, 0.4), 0 0 40px rgba(147, 112, 219, 0.2)',
    forestGlow: '0 0 15px rgba(34, 139, 34, 0.3)'
  },
  typography: {
    // ✅ ДОБАВЛЕН ШРИФТ UNBOUNDED
    fontFamily: '"Unbounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    sizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      title: '32px'
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '24px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12)',
    md: '0 4px 12px rgba(0,0,0,0.15)',
    lg: '0 8px 24px rgba(0,0,0,0.12)'
  },
  animations: {
    duration: {
      fast: '0.15s',
      normal: '0.3s',
      slow: '0.5s'
    },
    easing: {
      default: 'ease',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  zIndex: {
    header: 100,
    modal: 1000,
    tooltip: 1100
  }
};

const styles = {
  heading: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
    lineHeight: 1.2
  }
};

// Утилита для создания градиентов
const createGradientStyle = (colors, direction = '135deg') => ({
  background: `linear-gradient(${direction}, ${colors.join(', ')})`
});

// ✅ ФУНКЦИЯ ИНЖЕКЦИИ ГЛОБАЛЬНЫХ СТИЛЕЙ С ДЫМКОЙ
export const injectGlobalStyles = () => {
  const styleId = 'gnome-global-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    * {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow-x: hidden;
    }

    body {
      font-family: ${theme.typography.fontFamily};
      /* ЗВЕЗДНЫЙ ФОН */
      background:
        radial-gradient(2px 2px at 20px 30px, #fff, transparent),
        radial-gradient(2px 2px at 40px 70px, #fff, transparent),
        radial-gradient(1px 1px at 90px 40px, #fff, transparent),
        radial-gradient(1px 1px at 130px 80px, #fff, transparent),
        radial-gradient(2px 2px at 160px 120px, #fff, transparent),
        radial-gradient(1px 1px at 200px 180px, #fff, transparent),
        radial-gradient(2px 2px at 240px 60px, #fff, transparent),
        radial-gradient(1px 1px at 280px 140px, #fff, transparent),
        radial-gradient(2px 2px at 320px 200px, #fff, transparent),
        radial-gradient(1px 1px at 360px 100px, #fff, transparent),
        /* Градиент звездного неба */
        linear-gradient(180deg, #000428 0%, #004e92 100%);
      background-size: 400px 300px, 400px 300px, 400px 300px, 400px 300px, 400px 300px, 400px 300px, 400px 300px, 400px 300px, 400px 300px, 400px 300px, 100% 100%;
      background-repeat: repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, repeat, no-repeat;
      background-attachment: fixed;
      color: ${theme.colors.text};
      line-height: 1.6;
      position: relative;
    }

    /* ✅ ДЫМКА СНИЗУ ВО ВСЕМ ПРИЛОЖЕНИИ - ОСНОВНОЙ СЛОЙ */
    body::after {
      content: '';
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40vh; /* 40% высоты экрана */
      background: linear-gradient(
        to top,
        rgba(255, 255, 255, 0.15) 0%,
        rgba(200, 220, 255, 0.12) 15%,
        rgba(180, 200, 255, 0.08) 30%,
        rgba(150, 180, 255, 0.05) 50%,
        rgba(120, 160, 255, 0.03) 70%,
        transparent 100%
      );
      pointer-events: none;
      z-index: 999;
      animation: fogFlow 8s ease-in-out infinite alternate;
    }

    /* ✅ ДОПОЛНИТЕЛЬНАЯ ДЫМКА ДЛЯ ГЛУБИНЫ - ВТОРОЙ СЛОЙ */
    body::before {
      content: '';
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 25vh; /* 25% высоты экрана */
      background: radial-gradient(
        ellipse at center bottom,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(200, 220, 255, 0.06) 20%,
        rgba(180, 200, 255, 0.04) 40%,
        rgba(150, 180, 255, 0.02) 60%,
        transparent 80%
      );
      pointer-events: none;
      z-index: 998;
      animation: fogFlow 12s ease-in-out infinite alternate-reverse;
    }

    /* ✅ АНИМАЦИЯ ДВИЖЕНИЯ ДЫМКИ */
    @keyframes fogFlow {
      0% {
        opacity: 0.6;
        transform: translateY(10px) scaleY(0.95);
      }
      50% {
        opacity: 0.85;
        transform: translateY(0px) scaleY(1.02);
      }
      100% {
        opacity: 0.7;
        transform: translateY(-5px) scaleY(0.98);
      }
    }

    #root {
      min-height: 100vh;
      position: relative;
    }

    /* Исправляем скролл для всех контейнеров */
    .scroll-container {
      overflow-y: auto;
      height: 100%;
    }

    /* Горизонтальный скролл */
    .horizontal-scroll {
      overflow-x: auto;
      overflow-y: hidden;
      scrollbar-width: thin;
      scrollbar-color: ${theme.colors.primary} ${theme.colors.border};
    }

    .horizontal-scroll::-webkit-scrollbar {
      height: 8px;
    }

    .horizontal-scroll::-webkit-scrollbar-track {
      background: ${theme.colors.border};
      border-radius: 4px;
    }

    .horizontal-scroll::-webkit-scrollbar-thumb {
      background: ${theme.colors.primary};
      border-radius: 4px;
    }

    .horizontal-scroll::-webkit-scrollbar-thumb:hover {
      background: ${theme.colors.secondary};
    }

    /* Скрываем стандартные скроллбары для некоторых контейнеров */
    .hide-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }

    /* Анимации */
    @keyframes pulse {
      0%, 100% {
        opacity: 0.6;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
    }

    @keyframes slideInUp {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    /* Мерцание звезд */
    @keyframes starTwinkle {
      0%, 100% {
        opacity: 0.8;
      }
      50% {
        opacity: 1;
      }
    }

    /* Дополнительные эффекты для карточек на звездном фоне */
    .card-on-stars {
      backdrop-filter: blur(10px);
      background: rgba(22, 33, 62, 0.85) !important;
      border: 1px solid rgba(244, 197, 66, 0.3);
    }

    /* Улучшенная читаемость текста на звездном фоне */
    .text-on-stars {
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    }

    /* ✅ АДАПТИВНАЯ ДЫМКА ДЛЯ МОБИЛЬНЫХ */
    @media (max-width: 768px) {
      body::after {
        height: 35vh; /* Немного меньше на мобильных */
        background: linear-gradient(
          to top,
          rgba(255, 255, 255, 0.12) 0%,
          rgba(200, 220, 255, 0.08) 15%,
          rgba(180, 200, 255, 0.05) 30%,
          rgba(150, 180, 255, 0.03) 50%,
          transparent 100%
        );
      }
      
      body::before {
        height: 20vh;
        background: radial-gradient(
          ellipse at center bottom,
          rgba(255, 255, 255, 0.08) 0%,
          rgba(200, 220, 255, 0.04) 30%,
          transparent 70%
        );
      }
    }

    /* ✅ ДОПОЛНИТЕЛЬНЫЕ ЭФФЕКТЫ ДЛЯ ОСОБО МАЛЕНЬКИХ ЭКРАНОВ */
    @media (max-width: 480px) {
      body::after {
        height: 30vh;
      }
      
      body::before {
        height: 18vh;
      }
    }

    /* Accessibility improvements */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Focus styles */
    button:focus, 
    [role="button"]:focus {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .card-on-stars {
        border: 2px solid ${theme.colors.primary} !important;
      }
    }

  `;

  document.head.appendChild(style);
};

export const ThemeProvider = ({ children }) => {
  const themeValue = {
    theme,
    styles,
    createGradientStyle
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
