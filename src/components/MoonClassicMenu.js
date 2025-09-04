// src/components/MoonClassicMenu.js - Классическое меню при клике на "Луна"
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const MoonClassicMenu = ({ isOpen, onClose, onNavigate, currentView }) => {
  const { theme, createGradientStyle } = useTheme();

  // ✅ ВСЕ ВАШИ PNG ИКОНКИ
  const menuItems = [
    { id: 'zodiac-selector', title: 'Гороскоп', icon: `${process.env.PUBLIC_URL}/assets/goroskop.png`, color: '#FF6B6B', description: 'Выбор знака зодиака' },
    { id: 'horoscope', title: 'Прогноз', icon: `${process.env.PUBLIC_URL}/assets/horoscope.png`, color: '#4ECDC4', description: 'Персональный прогноз' },
    { id: 'compatibility', title: 'Любовь', icon: `${process.env.PUBLIC_URL}/assets/compatibility.png`, color: '#FFB6C1', description: 'Совместимость знаков' },
    { id: 'numerology', title: 'Числа', icon: `${process.env.PUBLIC_URL}/assets/numerology.png`, color: '#DDA0DD', description: 'Нумерология и числа' },
    { id: 'cards', title: 'Карты', icon: `${process.env.PUBLIC_URL}/assets/cards.png`, color: '#F0E68C', description: 'Карта дня' },
    { id: 'events', title: 'События', icon: `${process.env.PUBLIC_URL}/assets/astrosobytiia.png`, color: '#87CEEB', description: 'Астрособытия' },
    { id: 'mercury', title: 'Меркурий', icon: `${process.env.PUBLIC_URL}/assets/mercury.png`, color: '#F4A460', description: 'Ретроградный Меркурий' },
    { id: 'favorites', title: 'Избранное', icon: `${process.env.PUBLIC_URL}/assets/favorites.png`, color: '#FFD700', description: 'Сохраненное' }
  ];

  // Добавляем CSS анимации
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes moonMenuSlideUp {
        from { 
          transform: translateY(100%); 
          opacity: 0; 
        }
        to { 
          transform: translateY(0); 
          opacity: 1; 
        }
      }
      
      @keyframes moonMenuSlideDown {
        from { 
          transform: translateY(0); 
          opacity: 1; 
        }
        to { 
          transform: translateY(100%); 
          opacity: 0; 
        }
      }
      
      @keyframes moonItemAppear {
        from { 
          transform: scale(0) rotate(-180deg); 
          opacity: 0; 
        }
        to { 
          transform: scale(1) rotate(0deg); 
          opacity: 1; 
        }
      }
      
      @keyframes moonGlowPulse {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(244, 197, 66, 0.3); 
        }
        50% { 
          box-shadow: 0 0 40px rgba(244, 197, 66, 0.6), 0 0 60px rgba(78, 205, 196, 0.3); 
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

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease',
      zIndex: 1998,
      pointerEvents: isOpen ? 'auto' : 'none'
    },

    menuContainer: {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: 'rgba(22, 33, 62, 0.98)',
      backdropFilter: 'blur(25px)',
      borderTopLeftRadius: '25px',
      borderTopRightRadius: '25px',
      padding: '30px 20px 40px 20px',
      zIndex: 1999,
      transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      maxHeight: '80vh',
      overflowY: 'auto',
      border: '2px solid rgba(244, 197, 66, 0.3)',
      animation: isOpen ? 'moonGlowPulse 3s ease-in-out infinite' : 'none'
    },

    header: {
      textAlign: 'center',
      marginBottom: '25px',
      paddingBottom: '20px',
      borderBottom: '1px solid rgba(244, 197, 66, 0.2)'
    },

    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: theme.colors.primary,
      margin: '0 0 8px 0',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    },

    subtitle: {
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
      fontSize: '28px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      width: '44px',
      height: '44px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '16px',
      justifyItems: 'center'
    },

    menuItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 12px',
      cursor: 'pointer',
      borderRadius: '18px',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '2px solid rgba(255, 255, 255, 0.1)',
      width: '130px',
      minHeight: '110px',
      position: 'relative',
      overflow: 'hidden'
    },

    activeMenuItem: {
      backgroundColor: 'rgba(244, 197, 66, 0.15)',
      borderColor: 'rgba(244, 197, 66, 0.6)',
      boxShadow: '0 8px 25px rgba(244, 197, 66, 0.4)',
      transform: 'scale(1.05)'
    },

    iconContainer: {
      width: '56px',
      height: '56px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '12px',
      transition: 'all 0.3s ease',
      border: '2px solid rgba(255, 255, 255, 0.1)'
    },

    activeIconContainer: {
      backgroundColor: 'rgba(244, 197, 66, 0.2)',
      borderColor: 'rgba(244, 197, 66, 0.4)',
      boxShadow: '0 0 20px rgba(244, 197, 66, 0.4)'
    },

    iconImage: {
      width: '38px',
      height: '38px',
      objectFit: 'contain',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
    },

    activeIconImage: {
      filter: 'drop-shadow(0 2px 8px rgba(244, 197, 66, 0.6)) brightness(1.1)'
    },

    itemTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: theme.colors.text,
      margin: '0 0 4px 0',
      textAlign: 'center',
      transition: 'all 0.3s ease'
    },

    activeItemTitle: {
      color: theme.colors.primary,
      fontWeight: '700'
    },

    itemDescription: {
      fontSize: '11px',
      color: theme.colors.textSecondary,
      margin: 0,
      opacity: 0.7,
      textAlign: 'center',
      lineHeight: '1.2'
    }
  };

  const handleItemClick = (itemId, event) => {
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }

    onNavigate(itemId);
    onClose();
  };

  const handleOverlayClick = () => {
    onClose();
  };

  const handleCloseClick = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div style={styles.overlay} onClick={handleOverlayClick} />

      {/* Меню панель */}
      <div style={styles.menuContainer}>
        {/* Заголовок */}
        <div style={styles.header}>
          <h3 style={styles.title}>🌙 Лунное меню</h3>
          <p style={styles.subtitle}>Выберите раздел</p>
          
          <button 
            style={styles.closeButton}
            onClick={handleCloseClick}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = theme.colors.primary;
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = theme.colors.textSecondary;
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Сетка пунктов меню */}
        <div style={styles.gridContainer}>
          {menuItems.map((item, index) => {
            const isActive = currentView === item.id;
            
            return (
              <div
                key={item.id}
                style={{
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {}),
                  animation: `moonItemAppear 0.6s ease-out ${index * 0.1}s both`
                }}
                onClick={(e) => handleItemClick(item.id, e)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1.02) translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 20px rgba(244, 197, 66, 0.3)';
                    
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
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.transform = 'scale(1) translateY(0)';
                    e.target.style.boxShadow = 'none';
                    
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
                      fallback.style.fontSize = '24px';
                      fallback.style.fontWeight = 'bold';
                      fallback.style.color = item.color;
                      e.target.parentElement.appendChild(fallback);
                    }}
                  />
                </div>
                
                {/* Текстовый контент */}
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
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MoonClassicMenu;