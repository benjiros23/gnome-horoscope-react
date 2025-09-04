// src/components/ModernBurgerMenu.js - Красивое бургер-меню с PNG иконками
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ModernBurgerMenu = ({ currentView, onNavigate }) => {
  const { theme, createGradientStyle } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // ✅ ВСЕ ВАШИ PNG ИКОНКИ
  const menuItems = [
    { id: 'zodiac-selector', title: 'Гороскоп', icon: `${process.env.PUBLIC_URL}/assets/goroskop.png`, color: '#FF6B6B', description: 'Выбор знака зодиака' },
    { id: 'horoscope', title: 'Прогноз', icon: `${process.env.PUBLIC_URL}/assets/horoscope.png`, color: '#4ECDC4', description: 'Персональный прогноз' },
    { id: 'lunar', title: 'Луна', icon: `${process.env.PUBLIC_URL}/assets/moon.png`, color: '#A8E6CF', description: 'Лунные циклы и календарь' },
    { id: 'compatibility', title: 'Любовь', icon: `${process.env.PUBLIC_URL}/assets/compatibility.png`, color: '#FFB6C1', description: 'Совместимость знаков' },
    { id: 'numerology', title: 'Числа', icon: `${process.env.PUBLIC_URL}/assets/numerology.png`, color: '#DDA0DD', description: 'Нумерология и числа' },
    { id: 'cards', title: 'Карты', icon: `${process.env.PUBLIC_URL}/assets/cards.png`, color: '#F0E68C', description: 'Карта дня' },
    { id: 'events', title: 'События', icon: `${process.env.PUBLIC_URL}/assets/astrosobytiia.png`, color: '#87CEEB', description: 'Астрособытия' },
    { id: 'mercury', title: 'Меркурий', icon: `${process.env.PUBLIC_URL}/assets/mercury.png`, color: '#F4A460', description: 'Ретроградный Меркурий' },
    { id: 'mentor', title: 'Наставники', icon: `${process.env.PUBLIC_URL}/assets/mentors.png`, color: '#9F7AEA', description: '🧙‍♂️ Мудрые гномы-наставники' }, // 🧙‍♂️ НОВОЕ
    { id: 'quests', title: 'Квесты', icon: `${process.env.PUBLIC_URL}/assets/cards.png`, color: '#68D391', description: '🎯 Ежедневные задания от гномов' }, // 🎯 НОВОЕ
    { id: 'favorites', title: 'Избранное', icon: `${process.env.PUBLIC_URL}/assets/favorites.png`, color: '#FFD700', description: 'Сохраненное' },
    { id: 'settings', title: 'Настройки', icon: `${process.env.PUBLIC_URL}/assets/settings.png`, color: '#9370DB', description: '🧙‍♂️ Персональные настройки' } // 🧙‍♂️ НОВАЯ КНОПКА
  ];

  // Добавляем CSS анимации
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from { 
          transform: translateX(100%); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0); 
          opacity: 1; 
        }
      }
      
      @keyframes slideOutRight {
        from { 
          transform: translateX(0); 
          opacity: 1; 
        }
        to { 
          transform: translateX(100%); 
          opacity: 0; 
        }
      }
      
      @keyframes menuItemSlideIn {
        from { 
          transform: translateX(50px); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0); 
          opacity: 1; 
        }
      }
      
      @keyframes menuItemFadeIn {
        0% { 
          opacity: 0;
          transform: translateY(10px) scale(0.95);
        }
        100% { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes burgerSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(180deg); }
      }
      
      @keyframes iconHover {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.1) rotate(5deg); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const styles = {
    // Кнопка бургер-меню
    burgerButton: {
      position: 'fixed',
      bottom: '25px',
      right: '25px',
      width: '64px', // Немного увеличил для лучшей видимости
      height: '64px',
      backgroundColor: theme.colors.primary,
      border: 'none',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(244, 197, 66, 0.4), 0 4px 10px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      zIndex: 1001,
      color: 'rgba(22, 33, 62, 0.9)',
      fontSize: '26px', // Немного увеличил шрифт
      fontWeight: 'bold',
      animation: isOpen ? 'burgerSpin 0.3s ease-in-out' : 'none',
      border: '2px solid rgba(255, 255, 255, 0.1)' // Легкая обводка
    },

    // Overlay
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 999,
      pointerEvents: isOpen ? 'auto' : 'none'
    },

    // Меню панель
    menuPanel: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '340px', // Увеличил ширину для более комфортного вида
      height: '100vh',
      backgroundColor: 'rgba(22, 33, 62, 0.96)',
      backdropFilter: 'blur(25px)',
      borderLeft: '1px solid rgba(244, 197, 66, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0',
      zIndex: 1000,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      boxShadow: '-15px 0 40px rgba(0, 0, 0, 0.4)',
      maxWidth: '85vw' // Ограничиваем на мобильных устройствах
    },

    // Заголовок меню
    menuHeader: {
      padding: '30px 20px 20px 20px',
      borderBottom: '1px solid rgba(244, 197, 66, 0.2)',
      background: createGradientStyle([
        'rgba(244, 197, 66, 0.1)',
        'rgba(78, 205, 196, 0.1)'
      ], '135deg').background,
      position: 'relative'
    },

    headerTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: theme.colors.primary,
      margin: '0 0 5px 0',
      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
    },

    headerSubtitle: {
      fontSize: '14px',
      color: theme.colors.textSecondary,
      margin: 0,
      opacity: 0.8
    },

    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: 'transparent',
      border: 'none',
      color: theme.colors.textSecondary,
      fontSize: '24px',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    },

    // Список меню
    menuList: {
      flex: 1,
      padding: '20px 0',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px' // Равномерные отступы между элементами
    },

    menuItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px', // Увеличил для более ровного вида
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      borderLeftWidth: '4px',
      borderLeftStyle: 'solid',
      borderLeftColor: 'transparent',
      animation: 'menuItemSlideIn 0.4s ease-out',
      position: 'relative',
      margin: '0 10px', // Боковые отступы для равномерности
      borderRadius: '12px', // Скругленные углы для всех элементов
      minHeight: '70px' // Фиксированная высота для равномерности
    },

    activeMenuItem: {
      backgroundColor: 'rgba(244, 197, 66, 0.15)',
      borderLeftColor: theme.colors.primary,
      boxShadow: 'inset 0 0 20px rgba(244, 197, 66, 0.1)'
    },

    iconContainer: {
      width: '52px', // Немного увеличил для равномерности
      height: '52px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '14px', // Увеличил радиус
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '16px', // Фиксированный отступ
      transition: 'all 0.3s ease',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      flexShrink: 0 // Предотвращает сжатие иконок
    },

    activeIconContainer: {
      backgroundColor: 'rgba(244, 197, 66, 0.2)',
      borderColor: 'rgba(244, 197, 66, 0.4)',
      boxShadow: '0 0 15px rgba(244, 197, 66, 0.3)'
    },

    iconImage: {
      width: '34px', // Увеличил для лучшей видимости
      height: '34px',
      objectFit: 'contain',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
    },

    activeIconImage: {
      filter: 'drop-shadow(0 2px 8px rgba(244, 197, 66, 0.6)) brightness(1.1)',
      animation: 'iconHover 2s ease-in-out infinite'
    },

    itemContent: {
      flex: 1
    },

    itemTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: theme.colors.text,
      margin: '0 0 4px 0',
      transition: 'all 0.3s ease',
      lineHeight: '1.2' // Фиксированная высота строки
    },

    activeItemTitle: {
      color: theme.colors.primary,
      fontWeight: '700'
    },

    itemDescription: {
      fontSize: '12px',
      color: theme.colors.textSecondary,
      margin: 0,
      opacity: 0.8,
      lineHeight: '1.3',
      height: '16px', // Фиксированная высота для равномерности
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },

    // Ripple эффект
    ripple: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(244, 197, 66, 0.4)',
      transform: 'scale(0)',
      animation: 'rippleEffect 0.6s linear',
      pointerEvents: 'none'
    }
  };

  const handleBurgerClick = () => {
    setIsOpen(!isOpen);
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  const handleItemClick = (itemId, event) => {
    // Создаем ripple эффект
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(244, 197, 66, 0.4);
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      transform: scale(0);
      animation: rippleEffect 0.6s linear;
      pointer-events: none;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (button.contains(ripple)) {
        button.removeChild(ripple);
      }
    }, 600);

    onNavigate(itemId);
    setIsOpen(false);
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }
  };

  const handleOverlayClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Кнопка бургер-меню */}
      <button
        style={styles.burgerButton}
        onClick={handleBurgerClick}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.15)';
          e.target.style.boxShadow = '0 12px 35px rgba(244, 197, 66, 0.6), 0 6px 15px rgba(0, 0, 0, 0.3)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(244, 197, 66, 0.4), 0 4px 10px rgba(0, 0, 0, 0.2)';
          e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }}
        title="Меню"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay */}
      <div style={styles.overlay} onClick={handleOverlayClick} />

      {/* Панель меню */}
      <div style={styles.menuPanel}>
        {/* Заголовок */}
        <div style={styles.menuHeader}>
          <h3 style={styles.headerTitle}>🔮 Астро Гном</h3>
          <p style={styles.headerSubtitle}>Выберите раздел</p>
          
          <button 
            style={styles.closeButton}
            onClick={() => setIsOpen(false)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = theme.colors.textSecondary;
            }}
          >
            ✕
          </button>
        </div>

        {/* Список пунктов меню */}
        <div style={styles.menuList}>
          {menuItems.map((item, index) => {
            const isActive = currentView === item.id;
            
            return (
              <div
                key={item.id}
                style={{
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  animationDelay: `${index * 0.08}s`, // Более плавная анимация
                  animation: `menuItemFadeIn 0.5s ease-out ${index * 0.08}s both`
                }}
                onClick={(e) => handleItemClick(item.id, e)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    e.target.style.transform = 'translateX(5px)';
                    const iconContainer = e.target.querySelector('.icon-container');
                    const iconImg = e.target.querySelector('.icon-image');
                    const title = e.target.querySelector('.item-title');
                    
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      iconContainer.style.transform = 'scale(1.05)';
                    }
                    if (iconImg) {
                      iconImg.style.transform = 'scale(1.1)';
                      iconImg.style.filter = 'drop-shadow(0 2px 8px rgba(244, 197, 66, 0.6)) brightness(1.1)';
                    }
                    if (title) title.style.color = theme.colors.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.transform = 'translateX(0)';
                    const iconContainer = e.target.querySelector('.icon-container');
                    const iconImg = e.target.querySelector('.icon-image');
                    const title = e.target.querySelector('.item-title');
                    
                    if (iconContainer) {
                      iconContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      iconContainer.style.transform = 'scale(1)';
                    }
                    if (iconImg) {
                      iconImg.style.transform = 'scale(1)';
                      iconImg.style.filter = 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))';
                    }
                    if (title) title.style.color = theme.colors.text;
                  }
                }}
              >
                {/* Контейнер иконки */}
                <div 
                  className="icon-container"
                  style={{
                    ...styles.iconContainer,
                    ...(isActive ? styles.activeIconContainer : {})
                  }}
                >
                  <img
                    className="icon-image"
                    src={item.icon}
                    alt={item.title}
                    style={{
                      ...styles.iconImage,
                      ...(isActive ? styles.activeIconImage : {})
                    }}
                    draggable={false}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.textContent = item.title[0];
                      fallback.style.fontSize = '20px';
                      fallback.style.fontWeight = 'bold';
                      fallback.style.color = item.color;
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                </div>
                
                {/* Текстовый контент */}
                <div style={styles.itemContent}>
                  <div 
                    className="item-title"
                    style={{
                      ...styles.itemTitle,
                      ...(isActive ? styles.activeItemTitle : {})
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={styles.itemDescription}>
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ModernBurgerMenu;