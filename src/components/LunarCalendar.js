// src/components/LunarCalendar.js - Лунный календарь с рекомендациями
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LunarCalculator from '../utils/lunarCalculations';

const LunarCalendar = ({ onDateSelect, selectedDate }) => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' | 'events'

  useEffect(() => {
    updateCalendarData();
  }, [currentDate]);

  const updateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const data = LunarCalculator.getMonthlyLunarCalendar(year, month);
    setCalendarData(data);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDayClick = (dayData) => {
    setSelectedDay(dayData);
    if (onDateSelect) {
      onDateSelect(dayData);
    }
  };

  // Добавляем CSS анимации
  useEffect(() => {
    const existingStyle = document.getElementById('lunar-calendar-animations');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'lunar-calendar-animations';
      style.textContent = `
        @keyframes calendarSlide {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes dayHover {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        
        @keyframes phaseGlow {
          0%, 100% { 
            box-shadow: 0 0 8px rgba(244, 197, 66, 0.3);
          }
          50% { 
            box-shadow: 0 0 16px rgba(244, 197, 66, 0.6);
          }
        }
        
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const styles = {
    container: {
      background: `linear-gradient(135deg, 
        rgba(22, 33, 62, 0.95) 0%, 
        rgba(31, 41, 55, 0.9) 50%,
        rgba(16, 26, 50, 0.95) 100%)`,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      backdropFilter: 'blur(15px)',
      border: '2px solid rgba(244, 197, 66, 0.3)',
      position: 'relative',
      overflow: 'hidden'
    },

    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg
    },

    title: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    navigation: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.md
    },

    navButton: {
      background: 'rgba(244, 197, 66, 0.1)',
      border: '1px solid rgba(244, 197, 66, 0.3)',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '18px',
      color: theme.colors.primary
    },

    monthYear: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: '#ffffff',
      minWidth: '140px',
      textAlign: 'center'
    },

    viewToggle: {
      display: 'flex',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: theme.borderRadius.sm,
      padding: '2px'
    },

    toggleButton: {
      padding: '6px 12px',
      background: 'transparent',
      border: 'none',
      borderRadius: theme.borderRadius.sm,
      color: 'rgba(255, 255, 255, 0.7)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: theme.typography.sizes.xs
    },

    toggleButtonActive: {
      background: theme.colors.primary,
      color: '#000000',
      fontWeight: theme.typography.weights.semibold
    },

    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
      marginBottom: theme.spacing.md,
      animation: 'calendarSlide 0.5s ease-out'
    },

    weekHeader: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '2px',
      marginBottom: theme.spacing.sm
    },

    weekDay: {
      textAlign: 'center',
      padding: theme.spacing.xs,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.primary,
      textTransform: 'uppercase'
    },

    dayCell: {
      aspect: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: theme.borderRadius.sm,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },

    dayNumber: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      color: '#ffffff',
      marginBottom: '2px'
    },

    dayPhase: {
      fontSize: '12px'
    },

    todayCell: {
      background: 'rgba(244, 197, 66, 0.2)',
      border: '2px solid rgba(244, 197, 66, 0.6)',
      animation: 'phaseGlow 2s ease-in-out infinite'
    },

    selectedCell: {
      background: 'rgba(78, 205, 196, 0.2)',
      border: '2px solid rgba(78, 205, 196, 0.6)'
    },

    detailPanel: {
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      animation: 'slideUp 0.4s ease-out'
    },

    detailTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.sm,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    detailInfo: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md
    },

    infoCard: {
      background: 'rgba(244, 197, 66, 0.1)',
      border: '1px solid rgba(244, 197, 66, 0.2)',
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm
    },

    infoTitle: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.primary,
      marginBottom: '4px'
    },

    infoText: {
      fontSize: theme.typography.sizes.xs,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 1.4
    },

    eventsContainer: {
      display: 'grid',
      gap: theme.spacing.sm
    },

    eventItem: {
      background: 'rgba(78, 205, 196, 0.1)',
      border: '1px solid rgba(78, 205, 196, 0.2)',
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.sm,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm
    },

    eventIcon: {
      fontSize: '20px'
    },

    eventInfo: {
      flex: 1
    },

    eventName: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: '#4ECDC4',
      marginBottom: '2px'
    },

    eventDate: {
      fontSize: theme.typography.sizes.xs,
      color: 'rgba(255, 255, 255, 0.7)'
    }
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const upcomingEvents = LunarCalculator.getUpcomingLunarEvents();

  return (
    <div style={styles.container}>
      {/* Заголовок и навигация */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span>📅</span>
          <span>Лунный календарь</span>
        </h3>
        
        <div style={styles.viewToggle}>
          <button
            style={{
              ...styles.toggleButton,
              ...(viewMode === 'calendar' ? styles.toggleButtonActive : {})
            }}
            onClick={() => setViewMode('calendar')}
          >
            Календарь
          </button>
          <button
            style={{
              ...styles.toggleButton,
              ...(viewMode === 'events' ? styles.toggleButtonActive : {})
            }}
            onClick={() => setViewMode('events')}
          >
            События
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <>
          {/* Навигация по месяцам */}
          <div style={styles.navigation}>
            <button
              style={styles.navButton}
              onClick={() => navigateMonth(-1)}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(244, 197, 66, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(244, 197, 66, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ←
            </button>
            
            <div style={styles.monthYear}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            
            <button
              style={styles.navButton}
              onClick={() => navigateMonth(1)}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(244, 197, 66, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(244, 197, 66, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              →
            </button>
          </div>

          {/* Заголовки дней недели */}
          <div style={styles.weekHeader}>
            {weekDays.map(day => (
              <div key={day} style={styles.weekDay}>{day}</div>
            ))}
          </div>

          {/* Календарная сетка */}
          <div style={styles.calendarGrid}>
            {calendarData.map((dayData) => {
              const isSelected = selectedDay && selectedDay.day === dayData.day;
              
              return (
                <div
                  key={dayData.day}
                  style={{
                    ...styles.dayCell,
                    ...(dayData.isToday ? styles.todayCell : {}),
                    ...(isSelected ? styles.selectedCell : {})
                  }}
                  onClick={() => handleDayClick(dayData)}
                  onMouseEnter={(e) => {
                    if (!dayData.isToday && !isSelected) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!dayData.isToday && !isSelected) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <div style={styles.dayNumber}>{dayData.day}</div>
                  <div style={styles.dayPhase}>{dayData.emoji}</div>
                </div>
              );
            })}
          </div>

          {/* Панель деталей выбранного дня */}
          {selectedDay && (
            <div style={styles.detailPanel}>
              <h4 style={styles.detailTitle}>
                <span>{selectedDay.emoji}</span>
                <span>{selectedDay.date.toLocaleDateString('ru-RU')} - {selectedDay.phaseName}</span>
              </h4>
              
              <div style={styles.detailInfo}>
                <div style={styles.infoCard}>
                  <div style={styles.infoTitle}>🌟 Благоприятно</div>
                  <div style={styles.infoText}>
                    {selectedDay.recommendations.good.join(', ')}
                  </div>
                </div>
                
                <div style={styles.infoCard}>
                  <div style={styles.infoTitle}>⚠️ Избегать</div>
                  <div style={styles.infoText}>
                    {selectedDay.recommendations.avoid.join(', ')}
                  </div>
                </div>
                
                <div style={styles.infoCard}>
                  <div style={styles.infoTitle}>⚡ Энергия дня</div>
                  <div style={styles.infoText}>
                    {selectedDay.recommendations.energy}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Представление событий */
        <div style={styles.eventsContainer}>
          <h4 style={styles.detailTitle}>
            <span>🌙</span>
            <span>Ближайшие лунные события</span>
          </h4>
          
          {upcomingEvents.map((event, index) => (
            <div key={index} style={styles.eventItem}>
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
      )}
    </div>
  );
};

export default LunarCalendar;