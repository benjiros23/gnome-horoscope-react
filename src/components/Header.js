const Header = () => (
  <header style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: 'clamp(60px, 15vw, 140px)',
    zIndex: 1000,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.4)'
  }}>
    <img 
      src="/assets/header.png"  // 🚀 ИСПРАВИЛ НА .png
      alt="Gnome Horoscope"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        display: 'block'
      }}
      onError={(e) => {
        console.error('Header image failed to load:', e.target.src);
        // Fallback: скрыть изображение и показать цветной фон
        e.target.style.display = 'none';
        e.target.parentElement.style.background = 'linear-gradient(135deg, #8B4513, #CD853F)';
      }}
    />
  </header>
);
