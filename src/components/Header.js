// src/components/Header.js - Звездный параллакс хедер
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ 
  title = "🔮 Астро Гном", 
  showMenuButton = true,
  onMenuToggle,
  showBackButton = false, 
  onBack 
}) => {
  const { theme } = useTheme();
  const headerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [stars, setStars] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480); // Добавляем отслеживание мобильной версии

  // Генерируем звезды для параллакс эффекта
  useEffect(() => {
    const generateStars = () => {
      const starArray = [];
      for (let i = 0; i < 50; i++) {
        starArray.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.5 + 0.1
        });
      }
      setStars(starArray);
    };

    generateStars();
  }, []);

  // Обработчик скролла для параллакс эффекта
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Отслеживание размера экрана для адаптивности
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CSS анимации
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes starTwinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes floatPlanet {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(180deg); }
      }
      
      @keyframes cosmicGlow {
        0%, 100% { box-shadow: 0 0 20px rgba(244, 197, 66, 0.3); }
        50% { box-shadow: 0 0 40px rgba(244, 197, 66, 0.6), 0 0 60px rgba(78, 205, 196, 0.3); }
      }
      
      @keyframes titlePulse {
        0%, 100% { text-shadow: 0 0 5px rgba(244, 197, 66, 0.5); }
        50% { text-shadow: 0 0 20px rgba(244, 197, 66, 0.8), 0 0 30px rgba(78, 205, 196, 0.4); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const headerStyles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '120px', // Увеличил высоту для эффекта
      background: `linear-gradient(135deg, 
        rgba(22, 33, 62, 0.95) 0%, 
        rgba(42, 47, 78, 0.95) 50%, 
        rgba(16, 26, 50, 0.95) 100%)`,
      borderBottom: `2px solid rgba(244, 197, 66, 0.3)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: `0 ${theme.spacing.lg}`,
      zIndex: 1000,
      backdropFilter: 'blur(25px)',
      boxShadow: `
        0 8px 32px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1)
      `,
      overflow: 'hidden',
      position: 'relative'
    },

    // Параллакс слои
    parallaxLayer1: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 20% 30%, rgba(244, 197, 66, 0.1) 0%, transparent 50%),
                   radial-gradient(circle at 80% 70%, rgba(78, 205, 196, 0.1) 0%, transparent 50%)`,
      transform: `translateY(${scrollY * 0.3}px)`,
      transition: 'transform 0.1s ease-out'
    },

    parallaxLayer2: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transform: `translateY(${scrollY * 0.5}px)`,
      transition: 'transform 0.1s ease-out'
    },

    // Плавающие астрологические символы
    floatingSymbols: {
      position: 'absolute',
      top: '50%',
      left: '10%',
      transform: 'translateY(-50%)',
      fontSize: '24px',
      opacity: 0.3,
      animation: 'floatPlanet 6s ease-in-out infinite'
    },

    floatingSymbols2: {
      position: 'absolute',
      top: '30%',
      right: '15%',
      fontSize: '20px',
      opacity: 0.25,
      animation: 'floatPlanet 8s ease-in-out infinite reverse'
    },

    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      minWidth: '80px',
      zIndex: 2
    },

    rightSection: {
      minWidth: '80px',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 2
    },

    // Улучшенные кнопки с cosmic эффектами
    menuButton: {
      backgroundColor: 'rgba(244, 197, 66, 0.1)',
      border: '2px solid rgba(244, 197, 66, 0.3)',
      color: theme.colors.primary,
      fontSize: '24px',
      cursor: 'pointer',
      padding: '12px',
      borderRadius: '50%',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      height: '50px',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    },

    backButton: {
      backgroundColor: 'rgba(78, 205, 196, 0.1)',
      border: '2px solid rgba(78, 205, 196, 0.3)',
      color: '#4ECDC4',
      fontSize: '22px',
      cursor: 'pointer',
      padding: '12px',
      borderRadius: '50%',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '50px',
      height: '50px',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    },

    // Магический заголовок
    titleContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 2,
      position: 'relative',
      padding: `0 ${isMobile ? '10px' : '20px'}`, // Добавляем отступы для предотвращения обрезки
      minWidth: 0 // Позволяем flex элементу сжиматься
    },

    title: {
      fontSize: isMobile ? '20px' : '28px', // Меньший размер на мобильных
      fontWeight: '800',
      background: `linear-gradient(135deg, 
        ${theme.colors.primary} 0%, 
        #4ECDC4 50%, 
        ${theme.colors.primary} 100%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
      textAlign: 'center',
      animation: 'titlePulse 3s ease-in-out infinite',
      textShadow: 'none',
      letterSpacing: isMobile ? '0.5px' : '1px', // Меньший интервал на мобильных
      whiteSpace: 'nowrap', // Предотвращаем перенос строк
      overflow: 'hidden', // Прячем переполнение
      textOverflow: 'ellipsis', // Добавляем троеточие при обрезке
      maxWidth: isMobile ? '200px' : '300px' // Ограничиваем максимальную ширину
    },

    subtitle: {
      fontSize: isMobile ? '10px' : '12px', // Меньший размер на мобильных
      color: 'rgba(255, 255, 255, 0.6)',
      marginTop: '4px',
      textAlign: 'center',
      fontWeight: '400',
      letterSpacing: isMobile ? '1px' : '2px', // Меньший интервал на мобильных
      textTransform: 'uppercase',
      whiteSpace: 'nowrap', // Предотвращаем перенос строк
      overflow: 'hidden', // Прячем переполнение
      textOverflow: 'ellipsis', // Добавляем троеточие при обрезке
      maxWidth: isMobile ? '200px' : '300px' // Ограничиваем максимальную ширину
    }
  };

  // Обработчики кнопок с Haptic feedback
  const handleMenuClick = () => {
    if (onMenuToggle) {
      onMenuToggle();
    }
    
    // Telegram haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
    
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  return (
    <header ref={headerRef} style={headerStyles.container}>
      
      {/* Параллакс слой 1 */}
      <div style={headerStyles.parallaxLayer1} />
      
      {/* Параллакс слой 2 со звездами */}
      <div style={headerStyles.parallaxLayer2}>
        {stars.map(star => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: '#F4C542',
              borderRadius: '50%',
              opacity: star.opacity,
              animation: `starTwinkle ${2 + star.speed * 3}s ease-in-out infinite`,
              transform: `translateY(${scrollY * star.speed}px)`,
              boxShadow: `0 0 ${star.size * 2}px rgba(244, 197, 66, 0.8)`
            }}
          />
        ))}
      </div>

      {/* Плавающие астрологические символы */}
      <div style={headerStyles.floatingSymbols}>🌙</div>
      <div style={headerStyles.floatingSymbols2}>✨</div>

      {/* Левая секция */}
      <div style={headerStyles.leftSection}>
        {showMenuButton && (
          <button
            style={headerStyles.menuButton}
            onClick={handleMenuClick}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(244, 197, 66, 0.2)';
              e.target.style.transform = 'scale(1.1)';
              e.target.style.borderColor = 'rgba(244, 197, 66, 0.6)';
              e.target.style.animation = 'cosmicGlow 2s ease-in-out infinite';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(244, 197, 66, 0.1)';
              e.target.style.transform = 'scale(1)';
              e.target.style.borderColor = 'rgba(244, 197, 66, 0.3)';
              e.target.style.animation = 'none';
            }}
            title="Открыть меню"
          >
            ☰
          </button>
        )}
        
        {showBackButton && (
          <button
            style={headerStyles.backButton}
            onClick={handleBackClick}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.2)';
              e.target.style.transform = 'scale(1.1)';
              e.target.style.borderColor = 'rgba(78, 205, 196, 0.6)';
              e.target.style.animation = 'cosmicGlow 2s ease-in-out infinite';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(78, 205, 196, 0.1)';
              e.target.style.transform = 'scale(1)';
              e.target.style.borderColor = 'rgba(78, 205, 196, 0.3)';
              e.target.style.animation = 'none';
            }}
            title="Назад"
          >
            ←
          </button>
        )}
      </div>

      {/* Центральный заголовок с магическими эффектами */}
      <div style={headerStyles.titleContainer}>
        <h1 style={headerStyles.title}>{title}</h1>
        <div style={headerStyles.subtitle}>ВАША ЗВЕЗДНАЯ СУДЬБА</div>
      </div>
      
      {/* Правая секция */}
      <div style={headerStyles.rightSection}>
        {/* Дополнительный cosmic индикатор */}
        <div style={{
          width: '8px',
          height: '8px',
          backgroundColor: theme.colors.primary,
          borderRadius: '50%',
          animation: 'starTwinkle 2s ease-in-out infinite',
          boxShadow: `0 0 10px ${theme.colors.primary}`
        }} />
      </div>
    </header>
  );
};

export default Header;