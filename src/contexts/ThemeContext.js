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
  const [currentTheme, setCurrentTheme] = useState('glass');

  // Загружаем сохраненную тему из localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('gnome-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Сохраняем тему в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('gnome-theme', currentTheme);
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      console.log(`🎨 Тема изменена на: ${themeName}`);
    }
  };

  const getTheme = () => themes[currentTheme];
  
  const getAvailableThemes = () => Object.keys(themes);

  const value = {
    currentTheme,
    theme: getTheme(),
    switchTheme,
    getAvailableThemes,
    themes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
