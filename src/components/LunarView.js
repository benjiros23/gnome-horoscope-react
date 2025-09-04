// src/components/LunarView.js - Главный компонент лунных функций
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import MoonPhaseDisplay from './MoonPhaseDisplay';
import LunarCalendar from './LunarCalendar';
import LunarCalculator from '../utils/lunarCalculations';

const LunarView = ({ onBack, onAddToFavorites }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'calendar', 'recommendations'
  const [selectedDate, setSelectedDate] = useState(null);
  const [favoriteRecommendations, setFavoriteRecommendations] = useState([]);

  // Добавляем CSS анимации
  useEffect(() => {
    const existingStyle = document.getElementById('lunar-view-animations');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'lunar-view-animations';
      style.textContent = `
        @keyframes lunarFadeIn {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes tabSlide {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes cosmicGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(244, 197, 66, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(244, 197, 66, 0.6),
                        0 0 60px rgba(78, 205, 196, 0.3);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleDateSelect = (dateData) => {
    setSelectedDate(dateData);
    setActiveTab('recommendations');
  };

  const handleAddToFavorites = (recommendation) => {
    if (onAddToFavorites) {
      onAddToFavorites({
        type: 'lunar-recommendation',
        data: recommendation,
        date: new Date().toISOString()
      });
    }
    
    setFavoriteRecommendations(prev => [...prev, recommendation.id]);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing.lg,
      minHeight: '100vh',
      background: `linear-gradient(135deg, 
        rgba(16, 26, 50, 0.95) 0%,
        rgba(22, 33, 62, 0.9) 50%,
        rgba(31, 41, 55, 0.95) 100%)`,
      animation: 'lunarFadeIn 0.8s ease-out'
    },

    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.xxl,
      position: 'relative'
    },

    backButton: {
      // Removed - back button only in header
    },

    subtitle: {
      fontSize: theme.typography.sizes.lg,
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      textAlign: 'center'
    },

    decorativeStars: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '20px',
      color: theme.colors.primary,
      animation: 'starTwinkle 2s ease-in-out infinite'
    },

    leftStar: {
      left: '20%'
    },

    rightStar: {
      right: '20%'
    },

    tabNavigation: {
      display: 'flex',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      backdropFilter: 'blur(10px)'
    },

    tabButton: {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      background: 'transparent',
      border: 'none',
      borderRadius: theme.borderRadius.md,
      color: 'rgba(255, 255, 255, 0.7)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      minWidth: '120px'
    },

    activeTabButton: {
      background: `linear-gradient(135deg, 
        ${theme.colors.primary} 0%, 
        rgba(244, 197, 66, 0.8) 100%)`,
      color: '#000000',
      fontWeight: theme.typography.weights.bold,
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px rgba(244, 197, 66, 0.4)`
    },

    content: {
      animation: 'tabSlide 0.5s ease-out'
    },

    overviewGrid: {
      display: 'grid',
      gap: theme.spacing.lg,
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
    },

    quickInfoSection: {
      display: 'grid',
      gap: theme.spacing.md,
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    },

    infoCard: {
      background: 'rgba(244, 197, 66, 0.1)',
      border: '2px solid rgba(244, 197, 66, 0.2)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      textAlign: 'center',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)'
    },

    infoIcon: {
      fontSize: '48px',
      marginBottom: theme.spacing.sm,
      display: 'block'
    },

    infoTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs
    },

    infoText: {
      fontSize: theme.typography.sizes.sm,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 1.4
    },

    recommendationsSection: {
      marginTop: theme.spacing.xl
    },

    sectionTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    recommendationCard: {
      background: 'rgba(78, 205, 196, 0.1)',
      border: '2px solid rgba(78, 205, 196, 0.2)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      position: 'relative'
    },

    recommendationHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm
    },

    recommendationTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: '#4ECDC4'
    },

    favoriteButton: {
      background: 'rgba(244, 197, 66, 0.1)',
      border: '1px solid rgba(244, 197, 66, 0.3)',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '16px'
    },

    upcomingEvents: {
      display: 'grid',
      gap: theme.spacing.sm
    },

    eventCard: {
      background: 'rgba(147, 112, 219, 0.1)',
      border: '1px solid rgba(147, 112, 219, 0.2)',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm
    },

    eventIcon: {
      fontSize: '24px'
    },

    eventInfo: {
      flex: 1
    },

    eventName: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: '#9370DB',
      marginBottom: '2px'
    },

    eventDate: {
      fontSize: theme.typography.sizes.xs,
      color: 'rgba(255, 255, 255, 0.7)'
    }
  };

  const currentMoonData = LunarCalculator.getCurrentMoonPhase();
  const upcomingEvents = LunarCalculator.getUpcomingLunarEvents();
  const recommendations = LunarCalculator.getMoonRecommendations(currentMoonData.age);

  const quickInfo = [
    {
      icon: '🌙',
      title: 'Текущая фаза',
      text: currentMoonData.phaseName
    },
    {
      icon: '💡',
      title: 'Освещенность',
      text: `${currentMoonData.illumination}%`
    },
    {
      icon: '⚡',
      title: 'Энергия дня',
      text: recommendations.energy
    },
    {
      icon: '📅',
      title: 'Следующее событие',
      text: upcomingEvents[0]?.name || 'Нет событий'
    }
  ];

  const renderOverview = () => (
    <div style={styles.content}>
      {/* Основная информация о фазе луны */}
      <div style={styles.overviewGrid}>
        <MoonPhaseDisplay />
        
        <div>
          {/* Быстрая информация */}
          <div style={styles.quickInfoSection}>
            {quickInfo.map((info, index) => (
              <div
                key={index}
                style={styles.infoCard}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(244, 197, 66, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={styles.infoIcon}>{info.icon}</span>
                <div style={styles.infoTitle}>{info.title}</div>
                <div style={styles.infoText}>{info.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ближайшие события */}
      <div style={styles.recommendationsSection}>
        <h3 style={styles.sectionTitle}>
          <span>🌟</span>
          <span>Ближайшие лунные события</span>
        </h3>
        
        <div style={styles.upcomingEvents}>
          {upcomingEvents.slice(0, 4).map((event, index) => (
            <div key={index} style={styles.eventCard}>
              <div style={styles.eventIcon}>{event.emoji}</div>
              <div style={styles.eventInfo}>
                <div style={styles.eventName}>{event.name}</div>
                <div style={styles.eventDate}>
                  {event.date.toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long',
                    weekday: 'long'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div style={styles.content}>
      <LunarCalendar onDateSelect={handleDateSelect} selectedDate={selectedDate} />
    </div>
  );

  const renderRecommendations = () => (
    <div style={styles.content}>
      <div style={styles.recommendationsSection}>
        <h3 style={styles.sectionTitle}>
          <span>✨</span>
          <span>Рекомендации {selectedDate ? `на ${selectedDate.date.toLocaleDateString('ru-RU')}` : 'на сегодня'}</span>
        </h3>
        
        <div style={styles.recommendationCard}>
          <div style={styles.recommendationHeader}>
            <div style={styles.recommendationTitle}>🌟 Благоприятные дела</div>
          </div>
          <div style={styles.infoText}>
            {(selectedDate?.recommendations || recommendations).good.join(', ')}
          </div>
        </div>
        
        <div style={styles.recommendationCard}>
          <div style={styles.recommendationHeader}>
            <div style={styles.recommendationTitle}>⚠️ Стоит избегать</div>
          </div>
          <div style={styles.infoText}>
            {(selectedDate?.recommendations || recommendations).avoid.join(', ')}
          </div>
        </div>
        
        <div style={styles.recommendationCard}>
          <div style={styles.recommendationHeader}>
            <div style={styles.recommendationTitle}>⚡ Энергия периода</div>
          </div>
          <div style={styles.infoText}>
            {(selectedDate?.recommendations || recommendations).energy}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Заголовок */}
      <div style={styles.header}>
        <div style={{...styles.decorativeStars, ...styles.leftStar}}>✨</div>
        <p style={styles.subtitle}>Следуйте ритмам небесной покровительницы</p>
        <div style={{...styles.decorativeStars, ...styles.rightStar}}>🌟</div>
      </div>

      {/* Навигация по вкладкам */}
      <div style={styles.tabNavigation}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'overview' ? styles.activeTabButton : {})
          }}
          onClick={() => setActiveTab('overview')}
        >
          🌙 Обзор
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'calendar' ? styles.activeTabButton : {})
          }}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Календарь
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'recommendations' ? styles.activeTabButton : {})
          }}
          onClick={() => setActiveTab('recommendations')}
        >
          ✨ Рекомендации
        </button>
      </div>

      {/* Контент */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'calendar' && renderCalendar()}
      {activeTab === 'recommendations' && renderRecommendations()}
    </div>
  );
};

export default LunarView;