// src/components/LoadingScreen.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingScreen = ({ 
  message = "🔮 Гномы готовят ваш персональный гороскоп...",
  showProgress = false,
  onComplete = null 
}) => {
  const { theme, styles } = useTheme();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Подключаемся к звездам');

  // Определяем размер экрана через JavaScript вместо CSS медиа-запросов
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  // Слушаем изменения размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Анимация загрузки
  useEffect(() => {
    if (!showProgress) return;

    const loadingSteps = [
      'Настраиваем магические энергии...',
      'Консультируемся с древними гномами...',
      'Изучаем положение планет...',
      'Готовим персональные предсказания...',
      'Почти готово!'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        
        if (newProgress >= 100) {
          if (onComplete) {
            setTimeout(onComplete, 500);
          }
          return 100;
        }

        // Меняем текст в зависимости от прогресса
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex]);
        }

        return newProgress;
      });
    }, Math.random() * 300 + 200);

    return () => clearInterval(interval);
  }, [showProgress, onComplete]);

  // Стили с учетом размера экрана
  const loadingStyles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal || 1000,
      padding: theme.spacing.lg
    },

    content: {
      textAlign: 'center',
      maxWidth: isMobile ? '300px' : '500px', // Адаптивная ширина через JS
      width: '100%'
    },

    icon: {
      fontSize: isMobile ? '4rem' : '6rem', // Адаптивный размер через JS
      marginBottom: theme.spacing.xl,
      animation: 'magicPulse 2s ease-in-out infinite',
      filter: 'drop-shadow(0 0 20px rgba(244, 197, 66, 0.6))'
    },

    title: {
      ...styles.heading,
      fontSize: isMobile ? theme.typography.sizes.lg : theme.typography.sizes.xl, // Адаптивно
      color: theme.colors.primary,
      marginBottom: theme.spacing.lg,
      fontWeight: theme.typography.weights.bold,
      textShadow: `0 2px 10px ${theme.colors.primary}40`
    },

    message: {
      fontSize: isMobile ? theme.typography.sizes.sm : theme.typography.sizes.md, // Адаптивно
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xl,
      lineHeight: 1.6
    },

    progressContainer: {
      width: '100%',
      marginTop: theme.spacing.lg
    },

    progressBar: {
      width: '100%',
      height: '6px',
      backgroundColor: theme.colors.border,
      borderRadius: '3px',
      overflow: 'hidden',
      marginBottom: theme.spacing.md
    },

    progressFill: {
      height: '100%',
      background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
      borderRadius: '3px',
      transition: 'width 0.3s ease',
      width: `${progress}%`
    },

    progressText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      textAlign: 'center'
    },

    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.lg
    },

    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
      animation: 'dotPulse 1.5s ease-in-out infinite'
    }
  };

  // Добавляем CSS анимации
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('loading-animations');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'loading-animations';
        style.textContent = `
          @keyframes magicPulse {
            0%, 100% { 
              transform: scale(1) rotate(0deg);
              filter: drop-shadow(0 0 20px rgba(244, 197, 66, 0.6));
            }
            50% { 
              transform: scale(1.1) rotate(5deg);
              filter: drop-shadow(0 0 30px rgba(244, 197, 66, 1));
            }
          }
          
          @keyframes dotPulse {
            0%, 80%, 100% { 
              opacity: 0.3;
              transform: scale(1);
            }
            40% { 
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  return (
    <div style={loadingStyles.container}>
      <div style={loadingStyles.content}>
        
        {/* Магическая иконка */}
        <div style={loadingStyles.icon}>
          🔮
        </div>

        {/* Заголовок */}
        <h2 style={loadingStyles.title}>
          Астро Гном
        </h2>

        {/* Сообщение */}
        <p style={loadingStyles.message}>
          {message}
        </p>

        {/* Прогресс бар */}
        {showProgress && (
          <div style={loadingStyles.progressContainer}>
            <div style={loadingStyles.progressBar}>
              <div style={loadingStyles.progressFill} />
            </div>
            <div style={loadingStyles.progressText}>
              {loadingText} ({Math.round(progress)}%)
            </div>
          </div>
        )}

        {/* Анимированные точки */}
        <div style={loadingStyles.dots}>
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              style={{
                ...loadingStyles.dot,
                animationDelay: `${index * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
