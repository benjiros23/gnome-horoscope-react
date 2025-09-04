// src/components/AstroEventsView.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAstroEvents } from '../hooks/useAstrologyData';
import Card from './UI/Card';
import Button from './UI/Button';


const AstroEventsView = ({ onBack, onAddToFavorites, selectedSign = null }) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Получение актуальных астрологических событий
  const getCurrentAstroEvents = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    
    const realEvents = [
      {
        id: 1,
        planet: 'Меркурий',
        planetIcon: '☿️',
        status: currentMonth === 0 ? 'ретроград' : 'активный',
        title: 'Ретроградный Меркурий влияет на коммуникации',
        period: currentMonth === 0 ? '1 - 25 января 2025' : 'Следующий: февраль 2025',
        description: `Сейчас происходит: ${currentMonth === 0 ? 'Меркурий находится в ретроградной фазе' : 'Меркурий движется прямо, связи стабильны'}. 
        
        Влияние на вас:
        ${currentMonth === 0 ? 
          '• Задержки в переговорах и документообороте\n• Сбои в технике и мессенджерах\n• Время для пересмотра планов\n• Возможны встречи с людьми из прошлого' : 
          '• Улучшение коммуникаций\n• Успешные переговоры\n• Хорошее время для новых договоров\n• Технические проблемы маловероятны'
        }
        
        💡 Совет дня: ${currentMonth === 0 ? 'Проверяйте важную информацию дважды' : 'Используйте время для активного общения'}`,
        influence: currentMonth === 0 ? 'Высокое' : 'Среднее',
        affectedSigns: 'Близнецы, Дева (сильнее всего), остальные знаки - умеренно',
        realTime: true
      },
      {
        id: 2,
        planet: 'Луна',
        planetIcon: '🌙',
        status: 'активный',
        title: `Лунная фаза сегодня влияет на эмоции`,
        period: `${today.getDate()} ${today.toLocaleDateString('ru-RU', {month: 'long'})} 2025`,
        description: `🌙 Сегодняшняя лунная энергия:
        
        Влияние на день:
        • Интуиция работает особенно хорошо
        • ${currentDay % 2 === 0 ? 'Благоприятный день для новых начинаний' : 'День для завершения дел'}
        • ${currentDay % 3 === 0 ? 'Эмоции могут быть переменчивыми' : 'Эмоциональная стабильность'}
        • Хорошее время для медитации и самопознания
        
        ⭐ Рекомендации на сегодня: ${currentDay % 2 === 0 ? 
          'Начинайте новые проекты, энергия растущей луны поддержит вас' : 
          'Завершайте начатые дела, время убывающей луны помогает закрывать гештальты'
        }`,
        influence: 'Среднее',
        affectedSigns: 'Рак (максимальное влияние), Скорпион, Рыбы',
        realTime: true
      },
      {
        id: 3,
        planet: 'Солнце',
        planetIcon: '☀️',
        status: 'активный',
        title: `Солнце в знаке ${getCurrentSunSign()}`,
        period: `${getCurrentSunPeriod()}`,
        description: `☀️ Солнечная энергия сегодня:
        
        Энергия дня:
        • Повышенная активность и энергичность
        • Хорошее время для лидерства
        • Творческий потенциал на высоте
        • Уверенность в себе растет
        
        🎯 Используйте энергию для: Важных встреч, презентаций, творческих проектов`,
        influence: 'Среднее',
        affectedSigns: getCurrentSunSign() + ' (максимальное влияние), Лев (всегда связан с Солнцем)',
        realTime: true
      }
    ];
    
    return realEvents;
  };

  // Определяем текущий знак Солнца
  const getCurrentSunSign = () => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Козерог';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Водолей';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Рыбы';
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Овен';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Телец';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Близнецы';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Рак';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Лев';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Дева';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Весы';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Скорпион';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Стрелец';
    
    return 'Водолей';
  };

  const getCurrentSunPeriod = () => {
    const sunSign = getCurrentSunSign();
    const periods = {
      'Козерог': '22 декабря - 19 января',
      'Водолей': '20 января - 18 февраля',
      'Рыбы': '19 февраля - 20 марта',
      'Овен': '21 марта - 19 апреля',
      'Телец': '20 апреля - 20 мая',
      'Близнецы': '21 мая - 20 июня',
      'Рак': '21 июня - 22 июля',
      'Лев': '23 июля - 22 августа',
      'Дева': '23 августа - 22 сентября',
      'Весы': '23 сентября - 22 октября',
      'Скорпион': '23 октября - 21 ноября',
      'Стрелец': '22 ноября - 21 декабря'
    };
    
    return periods[sunSign] || 'Период уточняется';
  };

  // Стили компонента
  const eventsStyles = {
    container: {
      padding: theme.spacing.lg,
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 120px)',
      position: 'relative'
    },

    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      position: 'relative'
    },

    headerCard: {
      background: createGradientStyle(['#667eea', '#764ba2'], '135deg').background,
      color: '#ffffff',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
      padding: theme.spacing.xl
    },

    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.1)',
      zIndex: 1
    },

    headerContent: {
      position: 'relative',
      zIndex: 2
    },

    headerDecoration: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      fontSize: '150px',
      opacity: 0.1,
      zIndex: 1
    },

    title: {
      ...styles.heading,
      fontSize: theme.typography.sizes.title,
      margin: '0 0 8px 0',
      fontWeight: theme.typography.weights.bold,
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    },

    date: {
      fontSize: theme.typography.sizes.md,
      margin: 0,
      opacity: 0.9,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    updateBadge: {
      marginTop: theme.spacing.sm,
      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      background: 'rgba(255,255,255,0.2)',
      borderRadius: theme.borderRadius.xl,
      display: 'inline-block',
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    eventCard: {
      marginBottom: theme.spacing.lg,
      transition: `all ${theme.animations.duration.normal} ease`,
      position: 'relative'
    },

    eventHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing.md
    },

    planetIcon: {
      fontSize: '2.5rem',
      marginRight: theme.spacing.md,
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    },

    eventInfo: {
      flex: 1
    },

    eventTitle: {
      ...styles.heading,
      fontSize: theme.typography.sizes.lg,
      margin: '0 0 8px 0',
      color: theme.colors.text
    },

    statusBadge: {
      display: 'inline-block',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold,
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },

    eventPeriod: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
      fontStyle: 'italic'
    },

    eventDescription: {
      fontSize: theme.typography.sizes.sm,
      lineHeight: 1.6,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      whiteSpace: 'pre-line'
    },

    eventFooter: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'space-between'
    },

    influenceBadge: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.xl,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold,
      border: '2px solid'
    },

    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xxl,
      textAlign: 'center'
    },

    loadingIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.lg,
      animation: 'pulse 2s infinite'
    }
  };

  // Добавляем CSS анимации
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('astro-events-animations');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'astro-events-animations';
        style.textContent = `
          @keyframes pulse {
            0%, 100% { 
              opacity: 0.6; 
              transform: scale(1); 
            }
            50% { 
              opacity: 1; 
              transform: scale(1.1); 
            }
          }
          
          @keyframes slideInUp {
            0% { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Загрузка событий
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      
      // Имитируем загрузку
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const astroEvents = getCurrentAstroEvents();
      setEvents(astroEvents);
      setSelectedEvent(astroEvents[0]);
      
      setLoading(false);
    };

    loadEvents();
  }, []);

  // Цветовые функции
  const getEventStatusColor = (status) => {
    switch (status) {
      case 'ретроград': return '#FF6B6B';
      case 'активный': return '#4ECDC4';
      case 'переход': return '#FFA726';
      default: return theme.colors.textSecondary;
    }
  };

  const getInfluenceColor = (level) => {
    switch (level) {
      case 'Высокое': return '#FF5722';
      case 'Среднее': return '#FF9800';
      case 'Низкое': return '#4CAF50';
      default: return theme.colors.textSecondary;
    }
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = (event) => {
    if (onAddToFavorites) {
      onAddToFavorites({
        type: 'astro-event',
        id: event.id,
        title: event.title,
        content: event.description,
        date: new Date().toLocaleDateString(),
        planet: event.planet,
        planetIcon: event.planetIcon
      });
    }

    // Haptic feedback для Telegram
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    // Показываем уведомление
    if (window.Telegram?.WebApp?.showAlert) {
      window.Telegram.WebApp.showAlert(`${event.planet} добавлен в избранное! ⭐`);
    }
  };

  if (loading) {
    return (
      <div style={eventsStyles.container}>

        
        <div style={eventsStyles.loadingContainer}>
          <div style={eventsStyles.loadingIcon}>🌌</div>
          <h3 style={{ color: theme.colors.primary, marginBottom: theme.spacing.sm }}>
            Подключаемся к космосу...
          </h3>
          <p style={{ color: theme.colors.textSecondary }}>
            Загружаем актуальные астрологические данные
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={eventsStyles.container}>

      
      {/* Красивый заголовок с актуальной датой */}
      <Card 
        variant="gradient" 
        padding="none" 
        style={{ 
          marginBottom: theme.spacing.xl,
          animation: 'slideInUp 0.6s ease-out'
        }}
      >
        <div style={eventsStyles.headerCard}>
          <div style={eventsStyles.headerOverlay} />
          <div style={eventsStyles.headerDecoration}>🌌</div>
          
          <div style={eventsStyles.headerContent}>
            <h1 style={eventsStyles.title}>
              Астрологические События
            </h1>
            <p style={eventsStyles.date}>
              📅 {new Date().toLocaleDateString('ru-RU', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div style={eventsStyles.updateBadge}>
              🔄 Обновлено сейчас
            </div>
          </div>
        </div>
      </Card>

      {/* Список событий с актуальными данными */}
      {events.map((event, index) => (
        <Card 
          key={event.id} 
          padding="lg"
          hoverable
          style={{
            ...eventsStyles.eventCard,
            animation: `slideInUp 0.6s ease-out ${index * 0.2}s`,
            animationFillMode: 'both'
          }}
        >
          {/* Заголовок события */}
          <div style={eventsStyles.eventHeader}>
            <span style={eventsStyles.planetIcon}>
              {event.planetIcon}
            </span>
            <div style={eventsStyles.eventInfo}>
              <h3 style={eventsStyles.eventTitle}>
                {event.title}
              </h3>
              <div
                style={{
                  ...eventsStyles.statusBadge,
                  background: `${getEventStatusColor(event.status)}20`,
                  color: getEventStatusColor(event.status),
                  border: `1px solid ${getEventStatusColor(event.status)}40`
                }}
              >
                {event.status} • {event.realTime ? 'АКТУАЛЬНО' : 'АРХИВ'}
              </div>
            </div>
          </div>

          {/* Период */}
          <div style={eventsStyles.eventPeriod}>
            📅 {event.period}
          </div>

          {/* Описание */}
          <div style={eventsStyles.eventDescription}>
            {event.description}
          </div>

          {/* Подвал с действиями */}
          <div style={eventsStyles.eventFooter}>
            <div
              style={{
                ...eventsStyles.influenceBadge,
                background: `${getInfluenceColor(event.influence)}20`,
                color: getInfluenceColor(event.influence),
                borderColor: `${getInfluenceColor(event.influence)}40`
              }}
            >
              Влияние: {event.influence}
            </div>
            
            <Button
              variant="primary"
              size="sm"
              icon="⭐"
              onClick={() => handleAddToFavorites(event)}
            >
              В избранное
            </Button>
          </div>

          {/* Дополнительная информация */}
          {event.affectedSigns && (
            <div style={{
              marginTop: theme.spacing.md,
              padding: theme.spacing.sm,
              backgroundColor: `${theme.colors.primary}10`,
              borderRadius: theme.borderRadius.sm,
              borderLeft: `3px solid ${theme.colors.primary}`
            }}>
              <div style={{
                fontSize: theme.typography.sizes.xs,
                color: theme.colors.textSecondary,
                marginBottom: theme.spacing.xs
              }}>
                Особое влияние на знаки:
              </div>
              <div style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.text
              }}>
                {event.affectedSigns}
              </div>
            </div>
          )}
        </Card>
      ))}

      {/* Кнопка обновления */}
      <div style={{ textAlign: 'center', marginTop: theme.spacing.xl }}>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          icon="🔄"
        >
          Обновить события
        </Button>
      </div>
    </div>
  );
};

export default AstroEventsView;
