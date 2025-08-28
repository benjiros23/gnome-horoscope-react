import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import DataService from '../services/DataService';

const AstroEventsView = ({ onAddToFavorites, telegramApp }) => {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Загружаем астрологические события
    const loadEvents = async () => {
      setLoading(true);
      try {
        const astroEvents = DataService.getDetailedAstroEvents();
        setEvents(astroEvents);
        setSelectedEvent(astroEvents[0]);
      } catch (error) {
        console.error('Ошибка загрузки событий:', error);
      }
      setLoading(false);
    };

    loadEvents();
  }, []);

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

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    
    // Haptic feedback для Telegram
    try {
      if (telegramApp?.HapticFeedback) {
        telegramApp.HapticFeedback.impactOccurred('light');
      }
    } catch (e) {}
  };

  const handleAddToFavorites = () => {
    if (selectedEvent && onAddToFavorites) {
      onAddToFavorites({
        type: 'astro-event',
        title: selectedEvent.title,
        content: selectedEvent.description,
        date: selectedEvent.date
      });

      try {
        if (telegramApp?.HapticFeedback) {
          telegramApp.HapticFeedback.notificationOccurred('success');
        }
      } catch (e) {}
    }
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: theme.container.fontFamily
  };

  const headerStyle = {
    ...theme.card,
    padding: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    background: theme.name === 'facebook' 
      ? 'linear-gradient(135deg, #1877F2 0%, #42A5F5 100%)'
      : theme.name === 'dark'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  };

  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth > 768 ? '300px 1fr' : '1fr',
    gap: '20px',
    alignItems: 'start'
  };

  const eventListStyle = {
    ...theme.card,
    padding: '20px',
    margin: '0',
    maxHeight: '600px',
    overflowY: 'auto'
  };

  const eventItemStyle = (event, isSelected) => ({
    padding: '16px',
    margin: '8px 0',
    borderRadius: '12px',
    border: isSelected 
      ? `2px solid ${theme.colors.primary}`
      : `1px solid ${theme.colors.border}`,
    background: isSelected 
      ? `${theme.colors.primary}15`
      : theme.name === 'dark' ? '#495057' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative'
  });

  const planetIconStyle = (planet) => ({
    fontSize: '24px',
    marginRight: '12px',
    filter: theme.name === 'facebook' 
      ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' 
      : 'none'
  });

  const detailCardStyle = {
    ...theme.card,
    padding: '24px',
    margin: '0',
    minHeight: '400px'
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    background: `${getEventStatusColor(status)}20`,
    color: getEventStatusColor(status),
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    border: `1px solid ${getEventStatusColor(status)}40`,
    marginBottom: '12px'
  });

  const influenceBadgeStyle = (level) => ({
    display: 'inline-block',
    background: `${getInfluenceColor(level)}20`,
    color: getInfluenceColor(level),
    padding: '6px 16px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '700',
    border: `2px solid ${getInfluenceColor(level)}60`,
    marginTop: '16px'
  });

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            animation: 'spin 2s linear infinite' 
          }}>🌌</div>
          <h3>Загрузка астрологических событий...</h3>
          
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Заголовок */}
      <div style={headerStyle}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: '120px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}>
          🌌
        </div>
        
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700',
          margin: '0 0 8px 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Астрологические События
        </h1>
        <p style={{ 
          fontSize: '16px', 
          opacity: 0.9,
          margin: 0,
          fontWeight: '400'
        }}>
          Влияние планет на вашу жизнь
        </p>
      </div>

      {/* Основной контент */}
      <div style={mainContentStyle}>
        {/* Список событий */}
        <div style={eventListStyle}>
          <h3 style={{ 
            ...theme.typography.subtitle, 
            marginBottom: '16px',
            color: theme.card.color 
          }}>
            Текущие события
          </h3>
          
          {events.map((event, index) => (
            <div
              key={event.id}
              style={eventItemStyle(event, selectedEvent?.id === event.id)}
              onClick={() => handleEventSelect(event)}
              onMouseEnter={(e) => {
                if (selectedEvent?.id !== event.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme.name === 'facebook'
                    ? '0 4px 16px rgba(0,0,0,0.15)'
                    : '0 4px 12px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedEvent?.id !== event.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <span style={planetIconStyle(event.planet)}>{event.planetIcon}</span>
                <div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '600',
                    color: theme.card.color,
                    marginBottom: '4px'
                  }}>
                    {event.planet}
                  </div>
                  <div style={statusBadgeStyle(event.status)}>
                    {event.status}
                  </div>
                </div>
              </div>
              
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                margin: '8px 0 4px 0',
                color: theme.card.color,
                lineHeight: '1.3'
              }}>
                {event.title}
              </h4>
              
              <p style={{ 
                fontSize: '12px', 
                color: theme.colors.textSecondary,
                margin: 0,
                opacity: 0.8
              }}>
                {event.period}
              </p>
            </div>
          ))}
        </div>

        {/* Детали выбранного события */}
        {selectedEvent && (
          <div style={detailCardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '36px', marginRight: '16px' }}>
                {selectedEvent.planetIcon}
              </span>
              <div>
                <h2 style={{
                  ...theme.typography.title,
                  margin: '0 0 8px 0',
                  color: theme.card.color
                }}>
                  {selectedEvent.planet}
                </h2>
                <div style={statusBadgeStyle(selectedEvent.status)}>
                  {selectedEvent.status}
                </div>
              </div>
            </div>

            <h3 style={{
              ...theme.typography.subtitle,
              color: theme.card.color,
              marginBottom: '12px'
            }}>
              {selectedEvent.title}
            </h3>

            <div style={{
              fontSize: '14px',
              color: theme.colors.textSecondary,
              marginBottom: '16px',
              fontStyle: 'italic'
            }}>
              📅 {selectedEvent.period}
            </div>

            <div style={{
              ...theme.typography.body,
              lineHeight: '1.6',
              marginBottom: '20px',
              color: theme.card.color
            }}
              dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
            />

            <div style={{
              background: theme.name === 'facebook' 
                ? '#F0F2F5' 
                : theme.name === 'dark' 
                  ? '#343a40' 
                  : '#f8f9fa',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: theme.card.color
              }}>
                🎯 Влияние на знаки:
              </h4>
              <p style={{ 
                fontSize: '14px', 
                margin: '0 0 12px 0',
                color: theme.colors.textSecondary 
              }}>
                {selectedEvent.affectedSigns}
              </p>
              
              <div style={influenceBadgeStyle(selectedEvent.influence)}>
                Влияние: {selectedEvent.influence}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button
                variant="primary"
                onClick={handleAddToFavorites}
              >
                ⭐ Добавить в избранное
              </Button>
              
              {selectedEvent.link && (
                <Button
                  variant="ghost"
                  onClick={() => window.open(selectedEvent.link, '_blank')}
                >
                  📖 Подробнее
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AstroEventsView;
