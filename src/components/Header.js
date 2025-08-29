import React from 'react';

const Header = ({ src = '/assets/header.jpg', sticky = true }) => {
  const wrap = {
    position: sticky ? 'fixed' : 'relative',
    top: 0,
    left: 0,
    width: '100vw',
    maxWidth: '100%',
    // Два режима высоты: через aspectRatio или через clamp высоты:
    // aspectRatio: '2000 / 430',          // включите, если знаете пропорции
    height: 'clamp(56px, 12vw, 120px)',    // адаптивная высота
    zIndex: 1000,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
    backgroundColor: '#2a1e14',
  };

  const img = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',    // заполняет от края до края
    display: 'block',
    userSelect: 'none',
    pointerEvents: 'none',
  };

  return (
    <div style={wrap} role="banner" aria-label="Gnome Horoscope Header">
      <img src={src} alt="Gnome Horoscope" style={img} />
    </div>
  );
};

export default Header;
