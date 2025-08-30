import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('❌ useTheme должен использоваться внутри ThemeProvider');
    // Возвращаем fallback тему
    return {
      theme: {
        name: 'default',
        colors: {
          primary: '#667eea',
          secondary: '#764ba2',
          background: '#ffffff',
          text: '#333333',
          textSecondary: '#666666',
          border: '#e1e5e9',
          error: '#e74c3c',
          success: '#27ae60',
          warning: '#f39c12'
        },
        card: {
          background: '#ffffff',
          border: '#e1e5e9'
        }
      },
      isDark: false,
      toggleTheme: () => {}
    };
  }
  return context;
};

const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: '#f8f9fa',
      surface: '#ffffff',
      text: '#2c3e50',
      textSecondary: '#7f8c8d',
      border: '#e1e5e9',
      error: '#e74c3c',
      success: '#27ae60',
      warning: '#f39c12',
      info: '#3498db'
    },
    card: {
      background: '#ffffff',
      border: '#e1e5e9',
      shadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      accent: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#667eea',
      secondary: '#764ba2',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#ffffff',
      textSecondary: '#b0b0b0',
      border: '#404040',
      error: '#ff6b6b',
      success: '#51cf66',
      warning: '#ffd43b',
      info: '#74c0fc'
    },
    card: {
      background: '#2d2d2d',
      border: '#404040',
      shadow: '0 2px 8px rgba(0,0,0,0.3)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)',
      accent: 'linear-gradient(135deg, #74c0fc 0%, #667eea 100%)'
    }
  },
  facebook: {
    name: 'facebook',
    colors: {
      primary: '#1877F2',
      secondary: '#166fe5',
      background: '#f0f2f5',
      surface: '#ffffff',
      text: '#1c1e21',
      textSecondary: '#65676b',
      border: '#dadde1',
      error: '#fa3e3e',
      success: '#42b883',
      warning: '#ff7849',
      info: '#1877F2'
    },
    card: {
      background: '#ffffff',
      border: '#dadde1',
      shadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #1877F2 0%, #166fe5 100%)',
      secondary: 'linear-gradient(135deg, #42b883 0%, #36a870 100%)',
      accent: 'linear-gradient(135deg, #ff7849 0%, #ff6b35 100%)'
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('gnome-theme');
      return saved && themes[saved] ? saved : 'dark';
    } catch (error) {
      console.error('Ошибка загрузки темы:', error);
      return 'dark';
    }
  });

  const [isReady, setIsReady] = useState(false);

  const theme = useMemo(() => {
    const selectedTheme = themes[currentTheme] || themes.dark;
    return selectedTheme;
  }, [currentTheme]);

  const isDark = useMemo(() => {
    return currentTheme === 'dark';
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    
    try {
      localStorage.setItem('gnome-theme', newTheme);
    } catch (error) {
      console.error('Ошибка сохранения темы:', error);
    }
  };

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      
      try {
        localStorage.setItem('gnome-theme', themeName);
      } catch (error) {
        console.error('Ошибка сохранения темы:', error);
      }
    }
  };

  // Применяем CSS переменные
  useEffect(() => {
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Основные цвета
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-secondary', theme.colors.secondary);
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-text', theme.colors.text);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-error', theme.colors.error);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-info', theme.colors.info);
    
    // Карточки
    root.style.setProperty('--card-background', theme.card.background);
    root.style.setProperty('--card-border', theme.card.border);
    root.style.setProperty('--card-shadow', theme.card.shadow);
    
    // Градиенты
    root.style.setProperty('--gradient-primary', theme.gradients.primary);
    root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
    root.style.setProperty('--gradient-accent', theme.gradients.accent);
    
    // Устанавливаем цвет фона body
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;
    
    console.log('🎨 CSS переменные установлены');
    setIsReady(true);
  }, [theme]);

  // Инициализация темы
  useEffect(() => {
    console.log(`🎨 ThemeProvider: ${theme.name === 'dark' ? 'Темная' : theme.name === 'light' ? 'Светлая' : 'Facebook'} тема активна`);
  }, [theme]);

  const contextValue = useMemo(() => ({
    theme,
    currentTheme,
    isDark,
    isReady,
    toggleTheme,
    setTheme,
    availableThemes: Object.keys(themes)
  }), [theme, currentTheme, isDark, isReady]);

  // Показываем fallback пока тема не готова
  if (!isReady) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
          <div>Загружаем тему...</div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
