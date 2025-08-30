import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = ({
  onLoadingComplete,
  minLoadingTime = 3000,
  showProgress = true,
  // Кастомные изображения
  backgroundImage = '/assets/my-space-bg.jpg',
  circleImage = '/assets/circle-background.png',
  gnomeImage = '/assets/gnome-astrologer.png',
  headerImage = '/assets/header.png'
}) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // Прогресс загрузки
  useEffect(() => {
    const start = Date.now();
    
    const updateProgress = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(100, (elapsed / minLoadingTime) * 100);
      setProgress(p);
      
      if (p >= 100 && imagesLoaded) {
        setTimeout(() => {
          onLoadingComplete?.();
        }, 400);
      }
    };

    const interval = setInterval(updateProgress, 50);
    return () => clearInterval(interval);
  }, [minLoadingTime, onLoadingComplete, imagesLoaded]);

  // Анимация точек
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Предзагрузка изображений
  useEffect(() => {
    const imagesToLoad = [backgroundImage, circleImage, gnomeImage, headerImage];
    let loadedCount = 0;
    const errors = {};

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === imagesToLoad.length) {
        setImagesLoaded(true);
      }
    };

    const handleImageError = (src) => {
      errors[src] = true;
      setImageErrors(prev => ({ ...prev, [src]: true }));
      loadedCount++;
      if (loadedCount === imagesToLoad.length) {
        setImagesLoaded(true);
      }
    };

    imagesToLoad.forEach(src => {
      if (src) {
        const img = new Image();
        img.onload = handleImageLoad;
        img.onerror = () => handleImageError(src);
        img.src = src;
      } else {
        handleImageLoad();
      }
    });
  }, [backgroundImage, circleImage, gnomeImage, headerImage]);

  // CSS анимации через стили
  const keyframes = useMemo(() => `
    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    @keyframes glow {
      0% { text-shadow: 0 0 5px rgba(255,255,255,0.5); }
      100% { text-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(244,197,66,0.6); }
    }
    
    @keyframes shimmer {
      0% { left: -100%; }
      100% { left: 100%; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes twinkle {
      0%, 100% { opacity: 0.3; }
      50% { opacity: 1; }
    }
  `, []);

  // Генерация звездного поля
  const starfield = useMemo(() => {
    const stars = Array.from({ length: 50 }, (_, i) => {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const delay = Math.random() * 4;
      
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            background: '#ffffff',
            borderRadius: '50%',
            animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            opacity: 0.3
          }}
        />
      );
    });
    
    return stars;
  }, []);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    screen: {
      position: 'fixed',
      inset: 0,
      background: backgroundImage && !imageErrors[backgroundImage]
        ? `linear-gradient(rgba(15, 15, 35, 0.7), rgba(26, 26, 46, 0.8)), url("${backgroundImage}") center/cover no-repeat`
        : 'radial-gradient(ellipse at center top, #2D1B69 0%, #1A1A2E 50%, #0F0F1A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      zIndex: 9999,
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },

    headerWrap: {
      position: 'absolute',
      top: '20px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '0 16px',
      animation: 'fadeIn 1s ease-out'
    },

    headerImg: {
      width: 'min(90vw, 300px)',
      height: 'auto',
      objectFit: 'contain',
      filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.5))',
      pointerEvents: 'none',
      userSelect: 'none'
    },

    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '20px',
      animation: 'fadeIn 1.5s ease-out 0.5s both'
    },

    arena: {
      position: 'relative',
      width: 'clamp(200px, 35vw, 280px)',
      height: 'clamp(200px, 35vw, 280px)',
      marginBottom: '16px'
    },

    circleImg: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #F4C542',
      boxShadow: `
        0 0 30px rgba(244,197,66,0.5),
        inset 0 0 20px rgba(0,0,0,0.3),
        0 0 60px rgba(244,197,66,0.3)
      `,
      animation: 'rotate 20s linear infinite',
      filter: 'brightness(0.9) contrast(1.08)'
    },

    gnome: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '65%',
      height: '65%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.6))',
      zIndex: 3,
      pointerEvents: 'none',
      animation: 'pulse 3s ease-in-out infinite'
    },

    moon: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      fontSize: '32px',
      animation: 'glow 2s ease-in-out infinite alternate',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
    },

    progressSection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      maxWidth: '320px'
    },

    barWrap: {
      width: '100%',
      height: '8px',
      backgroundColor: 'rgba(244,197,66,0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      border: '1px solid rgba(244,197,66,0.4)',
      position: 'relative'
    },

    barFill: {
      height: '100%',
      width: `${progress}%`,
      background: 'linear-gradient(90deg, #F4C542, #FFD700, #F4C542)',
      borderRadius: '4px',
      transition: 'width 0.2s ease-out',
      boxShadow: '0 0 10px rgba(244,197,66,0.6)',
      position: 'relative',
      overflow: 'hidden'
    },

    barShimmer: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
      animation: progress > 0 ? 'shimmer 1.5s ease-in-out infinite' : 'none'
    },

    title: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#F4C542',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      letterSpacing: '1px',
      textAlign: 'center',
      marginBottom: '8px'
    },

    subtitle: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.85)',
      textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
      fontStyle: 'italic',
      textAlign: 'center',
      maxWidth: '280px',
      lineHeight: '1.4'
    },

    progressText: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.7)',
      fontWeight: '500'
    }
  }), [progress, backgroundImage, imageErrors]);

  // Fallback изображения
  const renderImage = useCallback((src, style, alt, fallback) => {
    if (imageErrors[src]) {
      return fallback || (
        <div style={{
          ...style,
          background: 'rgba(244,197,66,0.1)',
          border: '2px dashed rgba(244,197,66,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px'
        }}>
          {alt}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        style={style}
        loading="eager"
        onError={() => setImageErrors(prev => ({ ...prev, [src]: true }))}
      />
    );
  }, [imageErrors]);

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.screen}>
        {/* Звездное поле */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {starfield}
        </div>

        {/* Заголовок */}
        {headerImage && (
          <div style={styles.headerWrap}>
            {renderImage(
              headerImage,
              styles.headerImg,
              'Gnome Horoscope',
              <div style={{
                ...styles.headerImg,
                background: 'linear-gradient(135deg, #F4C542, #FFD700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1a1a2e'
              }}>
                🔮 Gnome Horoscope
              </div>
            )}
          </div>
        )}

        {/* Основной контент */}
        <div style={styles.content}>
          {/* Арена с гномом */}
          <div style={styles.arena}>
            {/* Фоновый круг */}
            {circleImage && renderImage(
              circleImage,
              styles.circleImg,
              'Magical Circle',
              <div style={{
                ...styles.circleImg,
                background: 'radial-gradient(circle, #2D1B69, #1A1A2E)',
                border: '3px solid #F4C542'
              }} />
            )}

            {/* Гном */}
            {gnomeImage && renderImage(
              gnomeImage,
              styles.gnome,
              'Astrologer Gnome',
              <div style={{
                ...styles.gnome,
                background: 'linear-gradient(135deg, #F4C542, #FFD700)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                🧙‍♂️
              </div>
            )}

            {/* Луна */}
            <div style={styles.moon}>🌙</div>
          </div>

          {/* Текст и прогресс */}
          <div style={styles.progressSection}>
            <div style={styles.title}>
              Consulting the Cosmic Gnomes{dots}
            </div>
            
            <div style={styles.subtitle}>
              Загружаем звездные карты и настраиваем кристальный шар...
            </div>

            {showProgress && (
              <>
                <div style={styles.barWrap}>
                  <div style={styles.barFill}>
                    <div style={styles.barShimmer} />
                  </div>
                </div>
                
                <div style={styles.progressText}>
                  {Math.round(progress)}% готово
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadingScreen;
