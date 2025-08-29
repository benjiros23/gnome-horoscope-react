import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header = () => {
  const { theme } = useTheme();

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px', // Измените высоту под ваше изображение
    zIndex: 1000,
    background: `url('/assets/header.jpg') center center/cover no-repeat`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2))', // Лёгкий оверлей для лучшей читаемости
    pointerEvents: 'none'
  };

  return (
    <header style={headerStyle}>
      <div style={overlayStyle}></div>
      {/* Если хотите добавить дополнительные элементы поверх изображения */}
      {/* 
      <div style={{ position: 'relative', zIndex: 2 }}>
        <h1 style={{ color: '#F4C542', fontSize: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
          GNOME HOROSCOPE
        </h1>
      </div>
      */}
    </header>
  );
};

export default Header;
