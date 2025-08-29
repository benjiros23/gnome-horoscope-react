import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = ({
  onLoadingComplete,
  minLoadingTime = 3000,
  showProgress = true,
  // Кастомные изображения:
  backgroundImage = '/assets/my-space-bg.jpg',  // Фон всей сцены (ВЫ МОЖЕТЕ ЗАМЕНИТЬ)
  circleImage = '/assets/circle-background.png',// Круглая картинка под гномом
  gnomeImage = '/assets/gnome-astrologer.png',  // Гном
  headerImage = '/assets/header.png',           // Табличка «Gnome Horoscope»
}) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Прогресс
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / minLoadingTime) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => onLoadingComplete?.(), 400);
      }
    }, 50);
    return () => clearInterval(id);
  }, [minLoadingTime, onLoadingComplete]);

  // Точки
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? '' : d + '.')), 500);
    return () => clearInterval(id);
  }, []);

  // Фон: если указан backgroundImage — используем его, иначе градиент+звезды
  const backgroundLayer =
    backgroundImage
      ? `url("${backgroundImage}") center/cover no-repeat, `
      : '';

  const starfield = `
    url("data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'>
        <circle cx='20' cy='20' r='1' fill='white' opacity='0.8'/>
        <circle cx='80' cy='25' r='0.5' fill='white' opacity='0.6'/>
        <circle cx='40' cy='60' r='0.8' fill='white' opacity='0.7'/>
        <circle cx='90' cy='70' r='0.6' fill='white' opacity='0.5'/>
        <circle cx='10' cy='80' r='1.2' fill='white' opacity='0.9'/>
        <circle cx='70' cy='15' r='0.4' fill='white' opacity='0.4'/>
        <circle cx='25' cy='85' r='0.7' fill='white' opacity='0.6'/>
        <circle cx='60' cy='30' r='0.9' fill='white' opacity='0.8'/>
      </svg>
    `)}") repeat
  `;

  const screenStyle = {
    position: 'fixed',
    inset: 0,
    background: `
      ${backgroundLayer}
      radial-gradient(ellipse at center top, #2D1B69 0%, #1A1A2E 50%, #0F0F1A 100%),
      ${starfield}
    `,
    backgroundBlendMode: backgroundImage ? 'normal, multiply, screen' : 'normal, normal, screen',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#fff',
    zIndex: 9999,
    overflow: 'hidden',
  };

  const headerWrap = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 12,
    marginBottom: 12,
  };

  const headerImg = {
    width: 'min(92vw, 820px)',
    height: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
    pointerEvents: 'none',
    userSelect: 'none',
  };

  const stage = {
    flex: '1 1 auto',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 16px 24px',
    gap: 16,
  };

  const arena = {
    position: 'relative',
    width: 'clamp(240px, 40vw, 360px)',
    height: 'clamp(240px, 40vw, 360px)',
    marginBottom: 12,
  };

  const circleImg = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #F4C542',
    boxShadow: '0 0 30px rgba(244,197,66,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
    animation: 'rotate 20s linear infinite',
    filter: 'brightness(0.9) contrast(1.08)',
  };

  const gnome = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '60%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
    zIndex: 3,
    pointerEvents: 'none',
  };

  const moon = {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 40,
    animation: 'glow 2s ease-in-out infinite alternate',
  };

  const barWrap = {
    width: 'clamp(220px, 58vw, 360px)',
    height: 10,
    backgroundColor: 'rgba(244,197,66,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    border: '1px solid rgba(244,197,66,0.45)',
    position: 'relative',
  };

  const barFill = {
    height: '100%',
    width: `${progress}%`,
    background: 'linear-gradient(90deg, #F4C542, #FFD700, #F4C542)',
    borderRadius: 6,
    transition: 'width 0.1s ease-out',
    boxShadow: '0 0 10px rgba(244,197,66,0.6)',
    position: 'relative',
    overflow: 'hidden',
  };

  const barShimmer = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)',
    animation: progress > 0 ? 'shimmer 1.5s ease-in-out infinite' : 'none',
  };

  const title = { fontSize: 18, fontWeight: 800, color: '#F4C542', textShadow: '1px 1px 2px rgba(0,0,0,0.8)', letterSpacing: 1 };
  const sub = { fontSize: 16, color: 'rgba(255,255,255,0.85)', textShadow: '1px 1px 2px rgba(0,0,0,0.6)', fontStyle: 'italic', textAlign: 'center', maxWidth: '80%' };

  return (
    <div style={screenStyle}>
      <style>{`
        @keyframes rotate { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes glow {
          from { text-shadow: 0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700; transform: scale(1) }
          to   { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 25px #FFD700; transform: scale(1.08) }
        }
        @keyframes shimmer { 0% { left: -100% } 100% { left: 100% } }
      `}</style>

      {/* Табличка-хедер */}
      <div style={headerWrap}>
        <img src={headerImage} alt="Gnome Horoscope" style={headerImg} draggable={false} />
      </div>

  
      <div style={stage}>
        <div style={arena}>
          {/* Кастомный круг */}
          <img src={circleImage} alt="Magic Circle" style={circleImg} draggable={false} />

          {/* Гном */}
          <img
            src={gnomeImage}
            alt="Cosmic Gnome"
            style={gnome}
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.insertAdjacentHTML(
                'afterend',
                `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:72px;">🧙‍♂️</div>`
              );
            }}
          />
        </div>

        <div style={title}>LOADING{dots}</div>

        {showProgress && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
            <div style={barWrap}>
              <div style={barFill}>
                <div style={barShimmer} />
              </div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>{Math.round(progress)}%</div>
          </div>
        )}

        <p style={sub}>Consulting the Cosmic Gnomes{dots}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
