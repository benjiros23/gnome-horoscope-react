// src/components/LoadingScreen.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import StarryBackground from './StarryBackground'; // ✅ ИМПОРТИРУЕМ НОВЫЙ ФОН
import { supportsWebM, canAutoplay } from '../utils/videoUtils'; // 🎥 УТИЛИТЫ ДЛЯ ВИДЕО

const LoadingScreen = ({ 
  message = "🔮 Гномы готовят ваш персональный гороскоп...", 
  onComplete = null 
}) => {
  const { theme, styles } = useTheme();
  const [progress, setProgress] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [videoSupported, setVideoSupported] = useState(true);

  // Проверяем поддержку видео при загрузке
  useEffect(() => {
    const checkVideoSupport = async () => {
      const webmSupported = supportsWebM();
      const autoplaySupported = await canAutoplay();
      
      console.log('🎥 Поддержка видео:', {
        webm: webmSupported,
        autoplay: autoplaySupported
      });
      
      setVideoSupported(webmSupported && autoplaySupported);
    };
    
    checkVideoSupport();
  }, []);

  // Слушаем изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Упрощенная анимация загрузки - только проценты
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.floor(Math.random() * 4) + 1;
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }
        
        return newProgress;
      });
    }, Math.random() * 150 + 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Стили компонента
  const loadingStyles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // ✅ УБИРАЕМ CSS ФОН - ТЕПЕРЬ БУДЕТ CANVAS
      background: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal || 1000,
      padding: theme.spacing.lg,
      overflow: 'hidden'
    },
    
    content: {
      textAlign: 'center',
      maxWidth: isMobile ? '300px' : '500px',
      width: '100%',
      position: 'relative',
      zIndex: 10 // ✅ ПОВЕРХ CANVAS
    },

    loadingTitle: {
      fontSize: isMobile ? theme.typography.sizes.lg : theme.typography.sizes.xl,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xxl,
      fontWeight: theme.typography.weights.bold,
      textShadow: `
        0 2px 10px ${theme.colors.primary}40,
        0 0 20px ${theme.colors.primary}60,
        0 0 40px ${theme.colors.primary}40
      `,
      position: 'relative',
      zIndex: 10
    },

    // КОНТЕЙНЕР ДЛЯ ЛУНЫ
    moonContainer: {
      position: 'relative',
      width: '100%',
      height: isMobile ? '300px' : '450px', // Увеличили высоту контейнера
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.xl,
      overflow: 'hidden',
      zIndex: 10
    },

    // ВАШЕ ВИДЕО ЛУНЫ - МАКСИМАЛЬНО БОЛЬШОЙ РАЗМЕР БЕЗ ОБРЕЗКИ И БЕЗ СВЕЧЕНИЯ
    moonVideo: {
      position: 'relative',
      width: isMobile ? '320px' : '500px', // Увеличили размер еще больше
      height: isMobile ? '240px' : '375px', // Увеличили размер еще больше
      zIndex: 2,
      objectFit: 'contain', // Показываем полное видео без обрезки
      borderRadius: '0', // Убираем любые закругления
      boxShadow: 'none', // Убираем любые тени/свечения
      filter: 'none' // Убираем любые фильтры
    },

    message: {
      fontSize: isMobile ? theme.typography.sizes.sm : theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      lineHeight: 1.6,
      textShadow: `
        2px 2px 4px rgba(0,0,0,0.9),
        0 0 10px rgba(0,0,0,0.8)
      `,
      position: 'relative',
      zIndex: 10
    },

    // БОЛЬШИЕ ЦИФРЫ ПРОЦЕНТОВ - УСИЛИМ ЭФФЕКТ
    percentageText: {
      fontSize: isMobile ? '4rem' : '6rem',
      color: theme.colors.primary,
      textAlign: 'center',
      textShadow: `
        0 0 20px ${theme.colors.primary}90,
        0 0 40px ${theme.colors.primary}70,
        0 0 60px ${theme.colors.primary}50,
        0 0 80px ${theme.colors.primary}30
      `,
      fontWeight: theme.typography.weights.bold,
      marginTop: theme.spacing.lg,
      fontFamily: theme.typography.fontFamily,
      animation: 'percentPulse 1s ease-in-out infinite alternate',
      position: 'relative',
      zIndex: 10
    }
  };

  // CSS АНИМАЦИИ
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('moon-loading-animations');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'moon-loading-animations';
        style.textContent = `
          /* Класс для видео - полный размер */
          .moon-video {
            object-fit: contain;
          }

          /* Анимация для fallback изображения */
          @keyframes moonRoll {
            0% {
              transform: translateX(-100px) rotate(0deg);
            }
            50% {
              transform: translateX(100px) rotate(180deg);
            }
            100% {
              transform: translateX(-100px) rotate(360deg);
            }
          }

          /* УСИЛЕННАЯ АНИМАЦИЯ ДЛЯ ПРОЦЕНТОВ */
          @keyframes percentPulse {
            0% {
              transform: scale(1);
              text-shadow: 
                0 0 20px rgba(244, 197, 66, 0.9),
                0 0 40px rgba(244, 197, 66, 0.7),
                0 0 60px rgba(244, 197, 66, 0.5),
                0 0 80px rgba(244, 197, 66, 0.3);
            }
            100% {
              transform: scale(1.05);
              text-shadow: 
                0 0 30px rgba(244, 197, 66, 1),
                0 0 60px rgba(244, 197, 66, 0.9),
                0 0 90px rgba(244, 197, 66, 0.7),
                0 0 120px rgba(244, 197, 66, 0.5);
            }
          }

          /* Мобильные стили - максимально большой размер */
          @media (max-width: 480px) {
            .moon-video {
              width: 320px !important;
              height: 240px !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              filter: none !important;
            }
          }
          
          /* Десктопные стили - максимально большой размер */
          @media (min-width: 481px) {
            .moon-video {
              width: 500px !important;
              height: 375px !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              filter: none !important;
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div style={loadingStyles.container}>
      {/* ✅ КРАСИВЫЙ ФОН С СОЗВЕЗДИЯМИ И КОМЕТАМИ */}
      <StarryBackground />
      
      <div style={loadingStyles.content}>
        {/* ЗАГОЛОВОК */}
        <h2 style={loadingStyles.loadingTitle}>
          🌙 Идет загрузка...
        </h2>

        {/* КОНТЕЙНЕР С ЛУНОЙ */}
        <div style={loadingStyles.moonContainer}>
          {/* УМНОЕ ОТОБРАЖЕНИЕ ВИДЕО ИЛИ ИЗОБРАЖЕНИЯ */}
          {videoSupported ? (
            <video
              src={`${process.env.PUBLIC_URL || ''}/assets/ezgif-23f5ca2e00951b.webm`}
              className="moon-video"
              style={loadingStyles.moonVideo}
              autoPlay
              loop
              muted
              playsInline
              onError={(e) => {
                console.log('⚠️ Ошибка воспроизведения видео, переключаемся на изображение');
                setVideoSupported(false);
              }}
            />
          ) : (
            <img
              src={`${process.env.PUBLIC_URL || ''}/assets/moonload.png`}
              alt="Loading Moon"
              style={{
                ...loadingStyles.moonVideo,
                animation: 'moonRoll 3s linear infinite' // Добавляем анимацию для fallback
              }}
              onError={(e) => {
                console.log('⚠️ Ошибка загрузки изображения');
                e.target.style.display = 'none';
                const fallbackDiv = document.createElement('div');
                fallbackDiv.innerHTML = '🌙';
                fallbackDiv.style.cssText = `
                  font-size: ${isMobile ? '6rem' : '8rem'};
                  animation: moonRoll 3s linear infinite;
                `;
                e.target.parentElement.appendChild(fallbackDiv);
              }}
            />
          )}
        </div>

        {/* СООБЩЕНИЕ */}
        <p style={loadingStyles.message}>
          {message}
        </p>

        {/* БОЛЬШИЕ ЦИФРЫ ПРОЦЕНТОВ */}
        <div style={loadingStyles.percentageText}>
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
