import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = ({ 
  onLoadingComplete, 
  minLoadingTime = 3000,
  showProgress = true 
}) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // Анимация прогресс-бара
  useEffect(() => {
    let progressInterval;
    let startTime = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(100, (elapsed / minLoadingTime) * 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => onLoadingComplete?.(), 500);
      }
    };

    progressInterval = setInterval(updateProgress, 50);
    return () => clearInterval(progressInterval);
  }, [minLoadingTime, onLoadingComplete]);

  // Анимация точек в тексте
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Стили экрана загрузки
  const screenStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(ellipse at center top, #2D1B69 0%, #1A1A2E 50%, #0F0F1A 100%),
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
      `)}")
    `,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#FFFFFF',
    fontFamily: 'serif',
    zIndex: 9999,
    overflow: 'hidden'
  };

  const headerStyle = {
    fontSize: 'clamp(24px, 5vw, 36px)',
    fontWeight: 'bold',
    color: '#F4C542',
    textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
    marginBottom: '20px',
    letterSpacing: '2px',
    textAlign: 'center'
  };

  const gnomeContainerStyle = {
    position: 'relative',
    width: 'clamp(250px, 40vw, 350px)',
    height: 'clamp(250px, 40vw, 350px)',
    marginBottom: '30px'
  };

  // 🚀 ЗАМЕНИЛИ ЖЕЛТЫЙ КРУГ НА ВАШУ КАРТИНКУ
  const circleImageStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover', // Обрезает картинку под круг
    border: '3px solid #F4C542',
    boxShadow: '0 0 30px rgba(244,197,66,0.5), inset 0 0 20px rgba(0,0,0,0.3)',
    animation: 'rotate 20s linear infinite',
    filter: 'brightness(0.9) contrast(1.1)', // Делаем картинку чуть темнее для эффекта
  };

  const gnomeImageStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '60%',
    objectFit: 'contain',
    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.5))',
    zIndex: 3 // Поверх круглой картинки
  };

  const moonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '40px',
    animation: 'glow 2s ease-in-out infinite alternate'
  };

  const loadingBarContainerStyle = {
    width: 'clamp(200px, 50vw, 300px)',
    height: '8px',
    backgroundColor: 'rgba(244,197,66,0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid rgba(244,197,66,0.4)',
    marginBottom: '20px',
    position: 'relative'
  };

  const loadingBarFillStyle = {
    height: '100%',
    width: `${progress}%`,
    background: 'linear-gradient(90deg, #F4C542, #FFD700, #F4C542)',
    borderRadius: '4px',
    transition: 'width 0.1s ease-out',
    boxShadow: '0 0 10px rgba(244,197,66,0.6)',
    position: 'relative',
    overflow: 'hidden'
  };

  const loadingBarGlowStyle = {
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
    animation: progress > 0 ? 'shimmer 1.5s ease-in-out infinite' : 'none'
  };

  const loadingTextStyle = {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#F4C542',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
    marginBottom: '10px',
    letterSpacing: '1px'
  };

  const consultingTextStyle = {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.8)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
    fontStyle: 'italic',
    textAlign: 'center',
    maxWidth: '80%'
  };

  return (
    <div style={screenStyle}>
      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes glow {
            from { 
              text-shadow: 0 0 5px #FFD700, 0 0 10px #FFD700, 0 0 15px #FFD700;
              transform: scale(1);
            }
            to { 
              text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 25px #FFD700;
              transform: scale(1.1);
            }
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
        `}
      </style>

      <div style={moonStyle}>🌙</div>
      
      <h1 style={headerStyle}>GNOME HOROSCOPE</h1>
      
      <div style={gnomeContainerStyle}>
        {/* 🚀 ВМЕСТО ЖЕЛТОГО КРУГА - ВАША КАРТИНКА */}
        <img 
          src="/assets/circle-background.jpg" // 🚀 ЗАМЕНИТЕ НА ПУТЬ К ВАШЕЙ КРУГЛОЙ КАРТИНКЕ
          alt="Magic Circle" 
          style={circleImageStyle}
          onError={(e) => {
            // Fallback: показываем желтый круг если картинка не загрузилась
            e.target.style.display = 'none';
            const fallbackCircle = document.createElement('div');
            fallbackCircle.style.cssText = `
              position: absolute; inset: 0; border-radius: 50%; 
              background: conic-gradient(#F4C542 0deg, #D4A843 30deg, #F4C542 60deg, #E8B84A 90deg, #F4C542 120deg, #D4A843 150deg, #F4C542 180deg, #E8B84A 210deg, #F4C542 240deg, #D4A843 270deg, #F4C542 300deg, #E8B84A 330deg, #F4C542 360deg);
              border: 3px solid #F4C542; animation: rotate 20s linear infinite;
            `;
            e.target.parentNode.appendChild(fallbackCircle);
          }}
        />
        
        <img 
          src="/assets/gnome-astrologer.png" // 🚀 ЗАМЕНИТЕ НА ПУТЬ К ИЗОБРАЖЕНИЮ ГНОМА
          alt="Cosmic Gnome" 
          style={gnomeImageStyle}
          onError={(e) => {
            // Fallback: показываем эмоджи если картинка не загрузилась
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '80px',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}>
          🧙‍♂️
        </div>
      </div>

      <div style={loadingTextStyle}>LOADING{dots}</div>
      
      {showProgress && (
        <div style={loadingBarContainerStyle}>
          <div style={loadingBarFillStyle}>
            <div style={loadingBarGlowStyle}></div>
          </div>
        </div>
      )}
      
      <p style={consultingTextStyle}>
        Consulting the Cosmic Gnomes{dots}
      </p>
    </div>
  );
};

export default LoadingScreen;
