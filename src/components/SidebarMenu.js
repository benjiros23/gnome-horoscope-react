// src/components/SidebarMenu.js - Вращающаяся дисковая панель
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SidebarMenu = ({ isOpen, onClose, onNavigate, currentView, userProfile }) => {
  const { theme, createGradientStyle } = useTheme();
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dialRef = useRef(null);
  const startAngle = useRef(0);
  const currentRotation = useRef(0);

  // Все пункты меню для дискового селектора
  const allMenuItems = [
    { id: 'zodiac-selector', title: 'Выбор знака', icon: '🔮', color: '#FF6B6B', description: 'Выберите знак зодиака' },
    { id: 'horoscope', title: 'Гороскоп', icon: '⭐', color: '#4ECDC4', description: 'Персональный прогноз' },
    { id: 'moon', title: 'Луна', icon: '🌙', color: '#A8E6CF', description: 'Лунный календарь' },
    { id: 'compatibility', title: 'Совместимость', icon: '💕', color: '#FFB6C1', description: 'Отношения знаков' },
    { id: 'numerology', title: 'Нумерология', icon: '🔢', color: '#DDA0DD', description: 'Сила чисел' },
    { id: 'cards', title: 'Карта дня', icon: '🃏', color: '#F0E68C', description: 'Магическое предсказание' },
    { id: 'events', title: 'Астрособытия', icon: '🌌', color: '#87CEEB', description: 'Космические события' },
    { id: 'mercury', title: 'Меркурий', icon: '🪐', color: '#F4A460', description: 'Ретроградные периоды' },
    { id: 'favorites', title: 'Избранное', icon: '⭐', color: '#FFD700', description: 'Сохраненные прогнозы' }
  ];

  // Вычисляем углы для каждого элемента (полукруг = 180 градусов)
  const itemAngle = 180 / (allMenuItems.length - 1); // Распределяем по 180 градусам
  const radius = 120; // Радиус расположения элементов

  // Стили компонента
  const dialStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 10000,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.4s ease',
      backdropFilter: 'blur(8px)'
    },

    container: {
      position: 'fixed',
      bottom: isOpen ? 0 : '-300px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '320px',
      height: '200px',
      transition: 'bottom 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      zIndex: 10001,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center'
    },

    dialBase: {
      position: 'relative',
      width: '280px',
      height: '140px',
      background: createGradientStyle([theme.colors.surface, theme.colors.background], '45deg').background,
      borderRadius: '140px 140px 0 0',
      boxShadow: `
        0 -20px 60px rgba(0, 0, 0, 0.4),
        inset 0 4px 8px rgba(255, 255, 255, 0.1),
        inset 0 -2px 4px rgba(0, 0, 0, 0.3)
      `,
      border: `3px solid ${theme.colors.primary}`,
      overflow: 'hidden',
      cursor: isDragging ? 'grabbing' : 'grab'
    },

    rotatingDial: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      transform: `rotate(${rotation}deg)`,
      transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transformOrigin: 'center bottom'
    },

    menuItem: {
      position: 'absolute',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    },

    centerButton: {
      position: 'absolute',
      bottom: '-25px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
      border: '4px solid white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(244, 197, 66, 0.6)',
      transition: 'all 0.3s ease',
      zIndex: 10002,
      color: '#000'
    },

    activeIndicator: {
      position: 'absolute',
      top: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
      boxShadow: `0 0 20px ${theme.colors.primary}`,
      zIndex: 10003
    },

    closeButton: {
      position: 'absolute',
      top: '-40px',
      right: '10px',
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.2)',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    },

    selectedInfo: {
      position: 'absolute',
      top: '-80px',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      color: 'white',
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
    },

    selectedTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      margin: '0 0 4px 0'
    },

    selectedDescription: {
      fontSize: theme.typography.sizes.sm,
      opacity: 0.9,
      margin: 0
    }
  };

  // Получить позицию элемента на окружности
  const getItemPosition = (index, currentRotation = 0) => {
    const angle = (index * itemAngle - 90 - currentRotation) * (Math.PI / 180); // -90 для start сверху
    const x = Math.cos(angle) * radius + 140 - 20; // центр диала
    const y = Math.sin(angle) * radius + 140 - 20;
    return { x, y };
  };

  // Вычисляем активный элемент по текущему повороту
  const getActiveIndex = (currentRotation) => {
    const normalizedRotation = ((currentRotation % 360) + 360) % 360;
    const index = Math.round(normalizedRotation / itemAngle) % allMenuItems.length;
    return Math.max(0, Math.min(index, allMenuItems.length - 1));
  };

  // Обработчики мыши/тач событий
  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.bottom;
    
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    
    startAngle.current = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    currentRotation.current = rotation;
    
    e.preventDefault();
  }, [rotation]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.bottom;
    
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    
    const currentAngle = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    const deltaAngle = currentAngle - startAngle.current;
    
    const newRotation = currentRotation.current + deltaAngle;
    setRotation(newRotation);
    setActiveIndex(getActiveIndex(newRotation));
    
    e.preventDefault();
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Snap к ближайшему элементу
    const targetIndex = getActiveIndex(rotation);
    const targetRotation = targetIndex * itemAngle;
    
    setRotation(targetRotation);
    setActiveIndex(targetIndex);
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  }, [isDragging, rotation]);

  // Добавляем глобальные обработчики событий
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handlePointerMove(e);
      const handleMouseUp = () => handlePointerUp();
      const handleTouchMove = (e) => handlePointerMove(e);
      const handleTouchEnd = () => handlePointerUp();
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Сброс состояния при закрытии
  useEffect(() => {
    if (!isOpen) {
      setRotation(0);
      setActiveIndex(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Обработчик выбора элемента
  const handleSelectItem = () => {
    const selectedItem = allMenuItems[activeIndex];
    onNavigate(selectedItem.id);
    onClose();
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }
  };

  const selectedItem = allMenuItems[activeIndex];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div style={dialStyles.overlay} onClick={onClose} />
      
      {/* Дисковая панель */}
      <div style={dialStyles.container}>
        
        {/* Информация о выбранном элементе */}
        <div style={dialStyles.selectedInfo}>
          <h3 style={dialStyles.selectedTitle}>
            {selectedItem.icon} {selectedItem.title}
          </h3>
          <p style={dialStyles.selectedDescription}>
            {selectedItem.description}
          </p>
        </div>

        {/* Кнопка закрытия */}
        <button 
          style={dialStyles.closeButton}
          onClick={onClose}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        {/* Основа диала */}
        <div 
          ref={dialRef}
          style={dialStyles.dialBase}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        >
          
          {/* Индикатор активного элемента */}
          <div style={dialStyles.activeIndicator} />
          
          {/* Вращающийся диал с элементами */}
          <div style={dialStyles.rotatingDial}>
            {allMenuItems.map((item, index) => {
              const { x, y } = getItemPosition(index, rotation);
              const isActive = index === activeIndex;
              const isCurrentView = item.id === currentView;
              
              return (
                <div
                  key={item.id}
                  style={{
                    ...dialStyles.menuItem,
                    left: `${x}px`,
                    top: `${y}px`,
                    backgroundColor: isActive ? item.color : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#000' : '#fff',
                    transform: `scale(${isActive ? 1.2 : 0.9}) rotate(${-rotation}deg)`,
                    border: isCurrentView ? `3px solid ${theme.colors.primary}` : '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: isActive 
                      ? `0 8px 20px ${item.color}80` 
                      : '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {item.icon}
                </div>
              );
            })}
          </div>
          
          {/* Центральная кнопка выбора */}
          <button
            style={dialStyles.centerButton}
            onClick={handleSelectItem}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateX(-50%) scale(1.1)';
              e.target.style.boxShadow = '0 12px 35px rgba(244, 197, 66, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateX(-50%) scale(1)';
              e.target.style.boxShadow = '0 8px 25px rgba(244, 197, 66, 0.6)';
            }}
          >
            ✨
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;
