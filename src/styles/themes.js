// Единые цвета и настройки
const COLORS = {
  // Основные цвета
  primary: '#8BC34A',
  secondary: '#FFC107',
  accent: '#FF6B6B',
  
  // Градиенты
  gradients: {
    primary: 'linear-gradient(135deg, #8BC34A, #4CAF50)',
    secondary: 'linear-gradient(135deg, #FFC107, #FF9800)',
    danger: 'linear-gradient(135deg, #FF6B6B, #F44336)',
    success: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
    info: 'linear-gradient(135deg, #2196F3, #03DAC6)',
  },
  
  // Текст
  text: {
    primary: '#2d3748',
    secondary: '#4a5568',
    muted: '#718096',
    light: '#a0aec0'
  },
  
  // Элементы зодиака
  elements: {
    fire: '#FF6B6B',
    water: '#4ECDC4', 
    air: '#45B7D1',
    earth: '#96CEB4'
  },
  
  // Состояния
  states: {
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8'
  }
};

// Glass тема (стеклянный дизайн)
export const glassTheme = {
  name: 'glass',
  colors: COLORS,
  
  // Основные компоненты
  card: {
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12), 0 2px 16px 0 rgba(0, 0, 0, 0.08)',
    padding: '24px',
    margin: '16px',
    color: COLORS.text.primary,
    position: 'relative',
    overflow: 'hidden'
  },
  
  button: {
    primary: {
      background: COLORS.gradients.primary,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 16px rgba(139, 195, 74, 0.3)',
      backdropFilter: 'blur(8px)'
    },
    secondary: {
      background: COLORS.gradients.secondary,
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 16px rgba(255, 193, 7, 0.3)',
      backdropFilter: 'blur(8px)'
    },
    ghost: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      color: COLORS.text.primary,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  },
  
  // Специальные эффекты
  effects: {
    glow: (color) => `drop-shadow(0 0 20px ${color}80)`,
    hover: {
      transform: 'translateY(-2px) scale(1.02)',
      boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.16)'
    }
  },
  
  // Анимации
  animations: {
    fadeIn: 'fadeIn 0.6s ease-out',
    slideUp: 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    pulse: 'pulse 2s ease-in-out infinite',
    spin: 'spin 2s linear infinite'
  },
  
  // Типография
  typography: {
    title: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '0.5px',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.3',
      marginBottom: '12px'
    },
    body: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      marginBottom: '12px'
    },
    caption: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1.4',
      opacity: 0.8
    },
    small: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
      opacity: 0.7
    }
  }
};

// Wooden тема (деревянный дизайн)
export const woodenTheme = {
  name: 'wooden',
  colors: {
    ...COLORS,
    primary: '#8b4513',
    secondary: '#a0522d',
    wood: {
      oak: 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
      mahogany: 'linear-gradient(135deg, #c04000 0%, #8b0000 50%, #5d4037 100%)',
      pine: 'linear-gradient(135deg, #deb887 0%, #bc9a6a 50%, #8d6e63 100%)'
    }
  },
  
  card: {
    background: 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
    border: '3px solid #8b4513',
    borderRadius: '20px',
    boxShadow: `
      inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
      0 8px 24px 0 rgba(0, 0, 0, 0.25),
      0 2px 8px 0 rgba(0, 0, 0, 0.15)
    `,
    padding: '24px',
    margin: '16px',
    color: '#3e2723',
    fontFamily: '"Times New Roman", Georgia, serif',
    position: 'relative',
    overflow: 'hidden',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
  },
  
  button: {
    primary: {
      background: 'linear-gradient(135deg, #8b4513, #a0522d)',
      color: 'white',
      border: '2px solid #654321',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(139, 69, 19, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #a0522d, #8d6e63)',
      color: 'white',
      border: '2px solid #6d4c41',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(160, 82, 45, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
    },
    ghost: {
      background: 'rgba(139, 69, 19, 0.1)',
      color: '#8b4513',
      border: '2px solid rgba(139, 69, 19, 0.3)',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  },
  
  container: {
    background: 'linear-gradient(135deg, #8b4513 0%, #d2691e 50%, #cd853f 100%)',
    minHeight: '100vh',
    fontFamily: '"Times New Roman", Georgia, serif'
  },
  
  // Деревянная текстура
  texture: {
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
  },
  
  effects: {
    glow: (color) => `drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))`,
    hover: {
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow: `
        inset 0 2px 0 0 rgba(255, 255, 255, 0.4),
        inset 0 -2px 0 0 rgba(0, 0, 0, 0.3),
        0 12px 32px 0 rgba(0, 0, 0, 0.35)
      `
    }
  },
  
  animations: {
    fadeIn: 'fadeIn 0.8s ease-out',
    slideUp: 'slideUp 0.5s ease-out',
    wobble: 'wobble 0.3s ease-in-out',
    carve: 'carve 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },
  
  typography: {
    title: {
      fontSize: '26px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '16px',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'
    },
    subtitle: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '0.5px',
      marginBottom: '12px',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
    },
    body: {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '1.5',
      marginBottom: '12px'
    },
    caption: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1.4',
      opacity: 0.9,
      fontStyle: 'italic'
    },
    small: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
      opacity: 0.8
    }
  }
};

// Дополнительные темы
export const darkTheme = {
  ...glassTheme,
  name: 'dark',
  container: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#ffffff'
  },
  card: {
    ...glassTheme.card,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#ffffff'
  }
};

export const neonTheme = {
  ...glassTheme,
  name: 'neon',
  container: {
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 50%, #000000 100%)',
    minHeight: '100vh',
    fontFamily: '"Orbitron", monospace',
    color: '#00ffff'
  },
  card: {
    ...glassTheme.card,
    background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 0, 255, 0.05) 100%)',
    border: '2px solid rgba(0, 255, 255, 0.3)',
    boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), inset 0 0 30px rgba(255, 0, 255, 0.1)',
    color: '#00ffff'
  },
  effects: {
    glow: (color) => `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${color}) drop-shadow(0 0 30px ${color})`
  }
};

// Экспорт всех тем
export const themes = {
  glass: glassTheme,
  wooden: woodenTheme,
  dark: darkTheme,
  neon: neonTheme
};

export default themes;
