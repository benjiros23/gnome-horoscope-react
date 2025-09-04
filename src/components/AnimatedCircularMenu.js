// src/components/AnimatedCircularMenu.js - Улучшенное круговое меню с видимыми лейблами
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedCircularMenu = ({ currentView, onNavigate }) => {
  const { theme, createGradientStyle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [animatingItems, setAnimatingItems] = useState([]);

  // ✅ ВАШИ PNG ИКОНКИ С УЛУЧШЕННЫМИ ЛЕЙБЛАМИ
  const menuItems = [
    { id: 'zodiac-selector', title: 'Гороскоп', icon: `${process.env.PUBLIC_URL}/assets/goroskop.png`, color: '#FF6B6B' },
    { id: 'horoscope', title: 'Прогноз', icon: `${process.env.PUBLIC_URL}/assets/horoscope.png`, color: '#4ECDC4' },
    { id: 'moon', title: 'Луна', icon: `${process.env.PUBLIC_URL}/assets/moon.png`, color: '#A8E6CF' },
    { id: 'compatibility', title: 'Любовь', icon: `${process.env.PUBLIC_URL}/assets/compatibility.png`, color: '#FFB6C1' },
    { id: 'numerology', title: 'Числа', icon: `${process.env.PUBLIC_URL}/assets/numerology.png`, color: '#DDA0DD' },
    { id: 'cards', title: 'Карты', icon: `${process.env.PUBLIC_URL}/assets/cards.png`, color: '#F0E68C' },
    { id: 'events', title: 'События', icon: `${process.env.PUBLIC_URL}/assets/astrosobytiia.png`, color: '#87CEEB' },
    { id: 'mercury', title: 'Меркурий', icon: `${process.env.PUBLIC_URL}/assets/mercury.png`, color: '#F4A460' },
    { id: 'favorites', title: 'Избранное', icon: `${process.env.PUBLIC_URL}/assets/favorites.png`, color: '#FFD700' }
  ];

  const radius = 130; // Увеличил для места под лейблы

  // Добавляем крутые CSS анимации
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes circularItemAppear {
        0% { 
          transform: scale(0) rotate(-180deg); 
          opacity: 0; 
        }
        70% { 
          transform: scale(1.1) rotate(10deg); 
          opacity: 1; 
        }
        100% { 
          transform: scale(1) rotate(0deg); 
          opacity: 1; 
        }
      }
      
      @keyframes iconPulse {
        0%, 100% { 
          transform: scale(1); 
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2)); 
        }
        50% { 
          transform: scale(1.15); 
          filter: drop-shadow(0 6px 15px rgba(244, 197, 66, 0.6)); 
        }
      }
      
      @keyframes labelGlow {
        0%, 100% { 
          text-shadow: 0 1px 3px rgba(0,0,0,0.8); 
        }
        50% { 
          text-shadow: 0 0 10px currentColor, 0 1px 3px rgba(0,0,0,0.8); 
        }
      }
      
      @keyframes centerButtonSpin {
        0% { transform: translateX(-50%) rotate(0deg) scale(1); }
        50% { transform: translateX(-50%) rotate(180deg) scale(1.1); }
        100% { transform: translateX(-50%) rotate(360deg) scale(1); }
      }
      
      @keyframes rippleWave {
        0% { 
          transform: scale(0); 
          opacity: 1; 
        }
        100% { 
          transform: scale(4); 
          opacity: 0; 
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // ✅ УЛУЧШЕННЫЕ СТИЛИ С ВИДИМЫМИ ЛЕЙБЛАМИ
  const styles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '320px',
      height: '320px', // Увеличил для лейблов
      zIndex: 1000,
      pointerEvents: isOpen ? 'auto' : 'none'
    },

    centerButton: {
      position: 'absolute',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '70px',
      height: '70px',
      background: 'transparent',
      border: 'none',
      borderRadius: '0',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      transform: isOpen 
        ? 'translateX(-50%) rotate(15deg) scale(1.1)' 
        : 'translateX(-50%) rotate(0deg) scale(1)',
      pointerEvents: 'auto',
      zIndex: 10,
      filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 0.3))'
    },

    centerButtonImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      pointerEvents: 'none',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))'
    },

    menuItemContainer: {
      position: 'absolute',
      width: '80px', // Увеличил для лейблов
      height: '90px', // Увеличил для лейблов
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.4s ease',
      pointerEvents: 'auto',
      zIndex: 9
    },

    menuItem: {
      width: '60px',
      height: '60px',
      borderRadius: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '6px',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      position: 'relative',
      overflow: 'hidden'
    },

    activeMenuItem: {
      backgroundColor: 'rgba(244, 197, 66, 0.2)',
      borderColor: 'rgba(244, 197, 66, 0.6)',
      boxShadow: '0 0 20px rgba(244, 197, 66, 0.4)',
      transform: 'scale(1.1)'
    },

    iconImage: {
      width: '40px',
      height: '40px',
      objectFit: 'contain',
      pointerEvents: 'none',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
    },

    activeIconImage: {
      filter: 'drop-shadow(0 4px 8px rgba(244, 197, 66, 0.6)) brightness(1.1)',
      animation: 'iconPulse 2s ease-in-out infinite'
    },

    label: {
      fontSize: '11px',
      fontWeight: '700',
      color: '#ffffff',
      textAlign: 'center',
      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
      pointerEvents: 'none'
    },

    activeLabel: {
      color: theme.colors.primary,
      animation: 'labelGlow 2s ease-in-out infinite',
      fontWeight: '800'
    },

    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 999,
      backdropFilter: 'blur(5px)',
      pointerEvents: isOpen ? 'auto' : 'none'
    },

    title: {
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      fontSize: '18px',
      fontWeight: '700',
      textAlign: 'center',
      textShadow: '2px 2px 6px rgba(0, 0, 0, 0.8)',
      opacity: isOpen ? 1 : 0,
      transition: 'opacity 0.3s ease 0.2s', // Задержка появления
      pointerEvents: 'none',
      whiteSpace: 'nowrap'
    },

    ripple: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(244, 197, 66, 0.6)',
      transform: 'scale(0)',
      animation: 'rippleWave 0.6s linear',
      pointerEvents: 'none',
      zIndex: 1
    }
  };

  // ✅ УЛУЧШЕННАЯ ФУНКЦИЯ ПОЗИЦИОНИРОВАНИЯ
  const getItemPosition = (index, isAnimating = false) => {
    const totalItems = menuItems.length;
    const angleStep = 220 / (totalItems - 1); // Увеличил угол
    const angle = (10 - index * angleStep) * (Math.PI / 180);
    
    const currentRadius = isAnimating ? 0 : radius;
    const centerX = 160;
    const centerY = 240; // Поднял выше для лейблов
    
    const x = Math.cos(angle) * currentRadius + centerX - 40;
    const y = Math.sin(angle) * currentRadius + centerY - 45;
    
    return { x, y };
  };

  // Анимация появления элементов
  const animateItemsIn = () => {
    setAnimatingItems([]);
    menuItems.forEach((_, index) => {
      setTimeout(() => {
        setAnimatingItems(prev => [...prev, index]);
      }, index * 80); // Увеличил задержку для эффектности
    });
  };

  // ✅ ОБРАБОТЧИК КАСТОМНОЙ PNG КНОПКИ
  const handleCenterClick = () => {
    if (!isOpen) {
      setIsOpen(true);
      animateItemsIn();
    } else {
      setIsOpen(false);
      setAnimatingItems([]);
    }

    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }
  };

  // Обработчик выбора элемента с ripple эффектом
  const handleItemClick = (item, event) => {
    // Создаем ripple эффект
    const container = event.currentTarget.querySelector('.menu-item');
    if (container) {
      const rect = container.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX - rect.left - size / 2;
      const y = event.clientY - rect.top - size / 2;
      
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(244, 197, 66, 0.6);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: rippleWave 0.6s linear;
        pointer-events: none;
        z-index: 1;
      `;
      
      container.appendChild(ripple);
      
      setTimeout(() => {
        if (container.contains(ripple)) {
          container.removeChild(ripple);
        }
      }, 600);
    }

    onNavigate(item.id);
    setIsOpen(false);
    setAnimatingItems([]);

    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  // Закрытие при клике на overlay
  const handleOverlayClick = () => {
    setIsOpen(false);
    setAnimatingItems([]);
  };

  return (
    <>
      {/* Затемненный фон */}
      <div style={styles.overlay} onClick={handleOverlayClick} />
      
      {/* Название меню сверху */}
      <div style={styles.title}>
        🌟 Выберите раздел
      </div>
      
      {/* Основной контейнер */}
      <div style={styles.container}>
        
        {/* ✅ ВАША PNG КНОПКА С УЛУЧШЕННЫМИ ЭФФЕКТАМИ */}
        <div
          style={styles.centerButton}
          onClick={handleCenterClick}
          onMouseEnter={(e) => {
            e.target.style.transform = isOpen
              ? 'translateX(-50%) rotate(15deg) scale(1.15)'
              : 'translateX(-50%) rotate(0deg) scale(1.05)';
            e.target.style.animation = 'centerButtonSpin 1s ease-in-out';
            const img = e.target.querySelector('img');
            if (img) img.style.filter = 'drop-shadow(0 6px 16px rgba(244, 197, 66, 0.6)) brightness(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = isOpen
              ? 'translateX(-50%) rotate(15deg) scale(1.1)'
              : 'translateX(-50%) rotate(0deg) scale(1)';
            e.target.style.animation = 'none';
            const img = e.target.querySelector('img');
            if (img) img.style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))';
          }}
        >
          <img
            src={isOpen 
              ? `${process.env.PUBLIC_URL}/assets/menu-button-open.png`
              : `${process.env.PUBLIC_URL}/assets/menu-button-closed.png`
            }
            alt={isOpen ? "Закрыть меню" : "Открыть меню"}
            style={styles.centerButtonImage}
            draggable={false}
            onError={(e) => {
              e.target.style.display = 'none';
              const fallback = document.createElement('div');
              fallback.textContent = isOpen ? '✕' : '+';
              fallback.style.fontSize = '28px';
              fallback.style.color = isOpen ? '#FF6B6B' : '#F4C542';
              fallback.style.fontWeight = 'bold';
              fallback.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
              e.target.parentElement.appendChild(fallback);
            }}
          />
        </div>

        {/* ✅ ЭЛЕМЕНТЫ С PNG ИКОНКАМИ И ВИДИМЫМИ ЛЕЙБЛАМИ */}
        {isOpen && menuItems.map((item, index) => {
          const { x, y } = getItemPosition(index);
          const isAnimated = animatingItems.includes(index);
          const isCurrentView = item.id === currentView;
          
          return (
            <div
              key={item.id}
              style={{
                ...styles.menuItemContainer,
                left: `${x}px`,
                top: `${y}px`,
                transform: `scale(${isAnimated ? 1 : 0}) rotate(${isAnimated ? 0 : -180}deg)`,
                opacity: isAnimated ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                transitionDelay: isAnimated ? `${index * 80}ms` : '0ms'
              }}
              onClick={(e) => handleItemClick(item, e)}
              onMouseEnter={(e) => {
                const menuItem = e.currentTarget.querySelector('.menu-item');
                const iconImg = e.currentTarget.querySelector('.icon-image');
                const label = e.currentTarget.querySelector('.item-label');
                
                if (menuItem && !isCurrentView) {
                  menuItem.style.transform = 'scale(1.1)';
                  menuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }
                if (iconImg) {
                  iconImg.style.transform = 'scale(1.1)';
                  iconImg.style.filter = 'drop-shadow(0 4px 12px rgba(244, 197, 66, 0.6)) brightness(1.1)';
                }
                if (label) {
                  label.style.transform = 'scale(1.05)';
                  label.style.color = '#F4C542';
                }
              }}
              onMouseLeave={(e) => {
                const menuItem = e.currentTarget.querySelector('.menu-item');
                const iconImg = e.currentTarget.querySelector('.icon-image');
                const label = e.currentTarget.querySelector('.item-label');
                
                if (menuItem && !isCurrentView) {
                  menuItem.style.transform = 'scale(1)';
                  menuItem.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }
                if (iconImg) {
                  iconImg.style.transform = 'scale(1)';
                  iconImg.style.filter = isCurrentView
                    ? 'drop-shadow(0 4px 8px rgba(244, 197, 66, 0.6)) brightness(1.1)'
                    : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))';
                }
                if (label) {
                  label.style.transform = 'scale(1)';
                  label.style.color = isCurrentView ? theme.colors.primary : '#ffffff';
                }
              }}
            >
              {/* Контейнер иконки */}
              <div 
                className="menu-item"
                style={{
                  ...styles.menuItem,
                  ...(isCurrentView ? styles.activeMenuItem : {})
                }}
              >
                <img
                  className="icon-image"
                  src={item.icon}
                  alt={item.title}
                  style={{
                    ...styles.iconImage,
                    ...(isCurrentView ? styles.activeIconImage : {})
                  }}
                  draggable={false}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.textContent = item.title[0];
                    fallback.style.fontSize = '24px';
                    fallback.style.fontWeight = 'bold';
                    fallback.style.color = item.color;
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
              </div>
              
              {/* ✅ ВСЕГДА ВИДИМЫЙ ЛЕЙБЛ */}
              <div 
                className="item-label"
                style={{
                  ...styles.label,
                  ...(isCurrentView ? styles.activeLabel : {}),
                  transitionDelay: isAnimated ? `${index * 80 + 200}ms` : '0ms'
                }}
              >
                {item.title}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AnimatedCircularMenu;