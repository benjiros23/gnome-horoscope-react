// src/components/GnomeMentorView.js - Компонент гнома-наставника с каруселью
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { gnomeMentors, getPersonalizedAdvice, getDailyTheme } from '../data/gnomeMentors';
import Button from './UI/Button';
import '../styles/carousel.css';

const GnomeMentorView = ({ onBack, selectedSign, onAddToFavorites }) => {
  const { theme } = useTheme();
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [currentAdvice, setCurrentAdvice] = useState(null);
  const [isAdviceVisible, setIsAdviceVisible] = useState(false);
  const [dailyTheme, setDailyTheme] = useState(null);
  
  // Карусель
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const scrollRef = useRef(null);
  const scrollTimeout = useRef(null);

  // Получаем тему дня при загрузке компонента
  useEffect(() => {
    const theme = getDailyTheme();
    setDailyTheme(theme);
  }, []);

  // Отслеживание размера экрана
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Создаем расширенный массив для плавного зацикливания
  const mentors = gnomeMentors.mentors;
  const extendedMentors = [
    ...mentors.slice(-2), // Последние 2 элемента в начале
    ...mentors,           // Основной массив
    ...mentors.slice(0, 2) // Первые 2 элемента в конце
  ];

  // Инициализация позиции скролла для зацикленной карусели
  useEffect(() => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const cardWidth = isMobile ? 260 : 280;
      const gap = isMobile ? 16 : 20;
      const itemWidth = cardWidth + gap;
      
      // Устанавливаем начальную позицию на первый реальный элемент
      const initialPosition = 2 * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);
      container.scrollLeft = initialPosition;
    }
  }, [isMobile]);

  // Обработчик прокрутки с плавным зацикливанием
  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = isMobile ? 260 : 280;
    const gap = isMobile ? 16 : 20;
    const itemWidth = cardWidth + gap;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    
    scrollTimeout.current = setTimeout(() => {
      const scrollLeft = container.scrollLeft;
      const centerPosition = scrollLeft + container.clientWidth / 2;
      
      // Определяем индекс в расширенном массиве
      const extendedIndex = Math.round((centerPosition - (isMobile ? 50 : 60)) / itemWidth);
      
      // Преобразуем в реальный индекс
      let realIndex;
      if (extendedIndex < 2) {
        realIndex = mentors.length + extendedIndex - 2;
      } else if (extendedIndex >= mentors.length + 2) {
        realIndex = extendedIndex - mentors.length - 2;
      } else {
        realIndex = extendedIndex - 2;
      }
      
      realIndex = Math.max(0, Math.min(realIndex, mentors.length - 1));
      
      if (realIndex !== activeIndex) {
        setActiveIndex(realIndex);
        
        // Haptic feedback
        const tg = window.Telegram?.WebApp;
        if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
          try {
            tg.HapticFeedback.impactOccurred('light');
          } catch (e) {}
        }
      }
      
      // Плавное зацикливание при достижении краев
      if (extendedIndex <= 0) {
        setTimeout(() => {
          const newPosition = (mentors.length + 1) * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);
          container.scrollTo({ left: newPosition, behavior: 'auto' });
        }, 150);
      } else if (extendedIndex >= extendedMentors.length - 1) {
        setTimeout(() => {
          const newPosition = 2 * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);
          container.scrollTo({ left: newPosition, behavior: 'auto' });
        }, 150);
      }
    }, 100);
  }, [isMobile, activeIndex, mentors.length, extendedMentors.length]);

  // Навигация стрелками
  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = isMobile ? 260 : 280;
    const gap = isMobile ? 16 : 20;
    const itemWidth = cardWidth + gap;

    const extendedIndex = index + 2;
    const targetScroll = extendedIndex * itemWidth - (container.clientWidth / 2) + (cardWidth / 2) + (isMobile ? 50 : 60);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setActiveIndex(index);
  }, [isMobile]);

  const handlePrevious = () => {
    const newIndex = activeIndex > 0 ? activeIndex - 1 : mentors.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex < mentors.length - 1 ? activeIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  // Обработчик выбора наставника
  const handleSelectMentor = () => {
    const mentor = mentors[activeIndex];
    const advice = getPersonalizedAdvice(mentor.id, selectedSign?.sign);
    setSelectedMentor(mentor);
    setCurrentAdvice(advice);
    setIsAdviceVisible(true);

    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      try {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      } catch (e) {}
    }
  };

  const handleGetNewAdvice = () => {
    if (selectedMentor) {
      const currentTime = Date.now();
      const advice = getPersonalizedAdvice(selectedMentor.id, selectedSign?.sign, { 
        randomSeed: currentTime 
      });
      setCurrentAdvice(advice);
      
      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        try {
          window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        } catch (e) {}
      }
    }
  };

  const handleAddToFavorites = () => {
    if (currentAdvice && onAddToFavorites) {
      onAddToFavorites({
        type: 'mentor-advice',
        id: `mentor-${Date.now()}`,
        title: `💬 Совет от ${currentAdvice.mentor.name}`,
        content: currentAdvice.advice,
        mentor: currentAdvice.mentor,
        date: new Date().toLocaleDateString('ru-RU')
      });

      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        try {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        } catch (e) {}
      }
    }
  };

  const styles = {
    container: {
      maxWidth: '100vw',
      margin: '0 auto',
      padding: '20px 0',
      minHeight: '100vh',
      overflow: 'hidden'
    },

    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      position: 'relative',
      padding: '0 20px'
    },

    backButton: {
      // Removed - back button only in header
    },

    title: {
      fontSize: theme.typography.sizes.title,
      fontWeight: theme.typography.weights.bold,
      background: 'linear-gradient(135deg, #F4C542 0%, #4ECDC4 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0'
    },

    subtitle: {
      fontSize: theme.typography.sizes.lg,
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0
    },

    adviceSection: {
      marginTop: theme.spacing.xxl,
      animation: 'adviceSlideIn 0.8s ease-out'
    },

    adviceCard: {
      background: 'rgba(244, 197, 66, 0.1)',
      border: '2px solid rgba(244, 197, 66, 0.3)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      textAlign: 'center',
      margin: '0 20px'
    },

    adviceHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg
    },

    adviceMentorInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm
    },

    adviceText: {
      fontSize: theme.typography.sizes.lg,
      lineHeight: 1.6,
      marginBottom: theme.spacing.lg,
      fontWeight: theme.typography.weights.medium
    },

    adviceActions: {
      display: 'flex',
      gap: theme.spacing.md,
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  };

  return (
    <div style={styles.container}>
      {/* Заголовок */}
      <div style={styles.header}>
        <h1 style={styles.title}>Гномы-Наставники</h1>
        <p style={styles.subtitle}>Выберите мудрого гнома для получения персонального совета</p>
        {dailyTheme && (
          <div style={{
            background: 'rgba(244, 197, 66, 0.1)',
            border: '1px solid rgba(244, 197, 66, 0.3)',
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            marginTop: theme.spacing.md,
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '24px', marginRight: theme.spacing.xs }}>{dailyTheme.icon}</span>
            <span style={{ color: theme.colors.primary, fontWeight: theme.typography.weights.medium }}>
              Тема дня: {dailyTheme.name}
            </span>
          </div>
        )}
      </div>

      {/* Карусель наставников */}
      <div className="modern-carousel-container">
        {/* Стрелки навигации */}
        <button className="carousel-arrow left" onClick={handlePrevious}>
          &#8249;
        </button>
        <button className="carousel-arrow right" onClick={handleNext}>
          &#8250;
        </button>

        {/* Скроллящийся трек */}
        <div 
          className="carousel-track" 
          ref={scrollRef}
          onScroll={handleScroll}
        >
          {extendedMentors.map((mentor, index) => {
            const extendedActiveIndex = activeIndex + 2;
            const isActive = index === extendedActiveIndex;
            const isNearby = Math.abs(index - extendedActiveIndex) === 1;
            
            return (
              <div
                key={`${mentor.id}-${index}`}
                className={`modern-carousel-card ${isActive ? 'active' : ''} ${isNearby ? 'nearby' : ''}`}
                style={{
                  background: mentor.background,
                  color: '#ffffff'
                }}
                onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector('.mentor-hover-overlay');
                  if (overlay) {
                    overlay.style.opacity = '1';
                    overlay.style.transform = 'translateY(0)';
                    overlay.style.pointerEvents = 'auto';
                  }
                }}
                onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector('.mentor-hover-overlay');
                  if (overlay) {
                    overlay.style.opacity = '0';
                    overlay.style.transform = 'translateY(20px)';
                    overlay.style.pointerEvents = 'none';
                  }
                }}
              >
                {/* Полноразмерное изображение как фон */}
                <img
                  src={`${process.env.PUBLIC_URL || ''}/assets/mentors/${mentor.image}`}
                  alt={mentor.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px'
                  }}
                  onError={(e) => {
                    // Fallback к градиентному фону
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = mentor.background;
                  }}
                  loading="lazy"
                />
                {/* Градиент */}
                <div className="card-gradient"></div>

                {/* Бейдж специализации */}
                <div className="element-badge">
                  {mentor.specialization === 'astrology' && 'Астрология'}
                  {mentor.specialization === 'numerology' && 'Нумерология'}
                  {mentor.specialization === 'lunar' && 'Лунная магия'}
                  {mentor.specialization === 'protection' && 'Защита'}
                  {mentor.specialization === 'love' && 'Любовь'}
                  {mentor.specialization === 'wealth' && 'Богатство'}
                </div>

                {/* Основной контент */}
                <div className="card-text-area">
                  <h3 className="card-sign-name" style={{ color: mentor.color }}>
                    {mentor.name}
                  </h3>
                  
                  <p className="card-dates">
                    {mentor.title}
                  </p>
                  
                  {/* Hover overlay с подробной информацией */}
                  <div 
                    className="mentor-hover-overlay"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0, 0, 0, 0.9)',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      opacity: 0,
                      transform: 'translateY(20px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      pointerEvents: 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.pointerEvents = 'auto';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0';
                      e.currentTarget.style.transform = 'translateY(20px)';
                      e.currentTarget.style.pointerEvents = 'none';
                    }}
                  >
                    <h4 style={{ 
                      color: mentor.color, 
                      fontSize: '18px', 
                      marginBottom: '8px',
                      fontWeight: 'bold'
                    }}>
                      {mentor.name}
                    </h4>
                    
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '12px',
                      opacity: 0.8
                    }}>
                      {mentor.title}
                    </p>
                    
                    <p style={{
                      fontSize: '13px',
                      lineHeight: 1.4,
                      marginBottom: '12px',
                      color: '#ffffff'
                    }}>
                      {mentor.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '4px',
                      justifyContent: 'center',
                      marginBottom: '8px'
                    }}>
                      {mentor.expertise.slice(0, 3).map((skill, idx) => (
                        <span key={idx} style={{
                          background: 'rgba(244, 197, 66, 0.3)',
                          color: '#F4C542',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <p style={{
                      fontSize: '11px',
                      fontStyle: 'italic',
                      opacity: 0.8,
                      margin: 0,
                      color: 'rgba(255, 255, 255, 0.7)'
                    }}>
                      "{mentor.catchPhrase}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Индикаторы */}
        <div className="carousel-indicators">
          {mentors.map((_, index) => (
            <div
              key={index}
              className={`carousel-indicator ${index === activeIndex ? 'active' : ''}`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Кнопка получения совета */}
      {!isAdviceVisible && (
        <button 
          className="modern-select-button"
          onClick={handleSelectMentor}
        >
          Получить совет от {mentors[activeIndex]?.name}
        </button>
      )}

      {/* Секция с советом */}
      {isAdviceVisible && currentAdvice && (
        <div style={styles.adviceSection}>
          <div style={styles.adviceCard}>
            <div style={styles.adviceHeader}>
              <div style={styles.adviceMentorInfo}>
                <img 
                  src={`${process.env.PUBLIC_URL || ''}/assets/mentors/${currentAdvice.mentor.image}`}
                  alt={currentAdvice.mentor.name}
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}
                  onError={(e) => {
                    // Fallback к эмодзи
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'inline-block';
                  }}
                  loading="lazy"
                />
                <span style={{ fontSize: '32px', display: 'none' }}>{currentAdvice.mentor.avatar}</span>
                <div>
                  <h3 style={{ margin: 0, color: currentAdvice.mentor.color }}>
                    {currentAdvice.mentor.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: theme.typography.sizes.sm, opacity: 0.8 }}>
                    {currentAdvice.mentor.title}
                  </p>
                  {currentAdvice.dailyTheme && (
                    <p style={{ 
                      margin: '4px 0 0 0', 
                      fontSize: theme.typography.sizes.xs, 
                      opacity: 0.7,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{currentAdvice.dailyTheme.icon}</span>
                      <span>Энергия: {currentAdvice.dailyTheme.name}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <p style={styles.adviceText}>{currentAdvice.advice}</p>
            
            <div style={styles.adviceActions}>
              <Button 
                variant="primary" 
                onClick={handleGetNewAdvice}
                style={{ minWidth: '150px' }}
              >
                Новый совет
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleAddToFavorites}
                style={{ minWidth: '150px' }}
              >
                В избранное
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GnomeMentorView;