import React, { createContext, useContext, useState, useEffect } from 'react';
import themes from '../styles/themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  // Загружаем сохраненную тему
  useEffect(() => {
    const savedTheme = localStorage.getItem('gnome-theme');
    console.log('🎨 Загружаем сохраненную тему:', savedTheme);
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
      console.log('✅ Тема установлена:', savedTheme);
    }
  }, []);

  // Сохраняем тему при изменении
  useEffect(() => {
    localStorage.setItem('gnome-theme', currentTheme);
    console.log('💾 Тема сохранена:', currentTheme);
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    console.log('🔄 Переключаем тему с', currentTheme, 'на', themeName);
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    } else {
      console.error('❌ Тема не найдена:', themeName);
    }
  };

  const getTheme = () => {
    const theme = themes[currentTheme];
    if (!theme) {
      console.error('❌ Не удалось найти тему:', currentTheme);
      return themes.light; // fallback
    }
    return theme;
  };

  const value = {
    currentTheme,
    theme: getTheme(),
    switchTheme,
    availableThemes: Object.keys(themes)
  };

  console.log('🎨 ThemeContext рендерится, текущая тема:', currentTheme);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
