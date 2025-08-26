// ────────────────────────────────────────────────────────────
// src/components/AstroEventsView.js
// Обновленный компонент с актуальными астрособытиями август 2025
// ────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import { useAPI } from '../hooks/useAPI';
import './AstroEventsView.css';

/* --- цвета для типов астрособытий --- */
const typeColors = {
  planet_alignment: '#FF6B6B',
  full_moon: '#FFC107',
  new_moon: '#607D8B',
  meteor_shower: '#E91E63',
  planet_conjunction: '#9C27B0',
  planet_transit: '#4CAF50',
  moon_planets: '#FF9800',
  moon_mars: '#F44336',
  eclipse: '#E91E63'
};

/* --- иконки для типов событий --- */
const typeIcons = {
  planet_alignment: '🪐',
  full_moon: '🌕',
  new_moon: '🌑',
  meteor_shower: '☄️',
  planet_conjunction: '💫',
  planet_transit: '🔄',
  moon_planets: '🌙',
  moon_mars: '🔴',
  eclipse: '🌘'
};

function AstroEventsView({ onBack, onAddToFavorites, telegramApp }) {
  const { getAstroEvents, loading, error } = useAPI();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* загружаем актуальные астрособытия при монтировании */
  useEffect(() => {
    getAstroEvents()
      .then(response => {
        // API возвращает объект с полем events
        console.log('🌌 Получены актуальные астрособытия:', response);
        if (response && response.events && Array.isArray(response.events)) {
          setEvents(response.events);
        } else {
          console.error('❌ Неожиданная структура данных:', response);
          setEvents([]);
        }
      })
      .catch(error => {
        console.error('❌ Ошибка загрузки астрособытий:', error);
        setEvents([]);
      });
  }, [getAstroEvents]);

  // Haptic feedback для Telegram
  const hapticFeedback = (type = 'impact', style = 'light') => {
    if (telegramApp?.HapticFeedback) {
      try {
        if (type === 'impact') {
          telegramApp.HapticFeedback.impactOccurred(style);
        } else if (type === 'selection') {
          telegramApp.HapticFeedback.selectionChanged();
        }
      } catch (e) {
        console.log('Haptic feedback недоступен:', e.message);
      }
    }
  };

  // Добавить событие в избранное
  const handleAddToFavorites = (evt) => {
    if (onAddToFavorites) {
      const favoriteItem = {
        id: Date.now() + Math.random(),
        type: 'astro-event',
        title: `${typeIcons[evt.type] || '🌌'} ${evt.title}`,
        content: evt.shortText,
        date: evt.date,
        source: 'astronomy_data'
      };
      
      onAddToFavorites(favoriteItem);
      hapticFeedback('impact', 'light');
      
      if (telegramApp) {
        telegramApp.showAlert('❤️ Астрособытие добавлено в избранное!');
      } else {
        alert('❤️ Астрособытие добавлено в избранное!');
      }
    }
  };

  // Показать детали события
  const handleShowDetails = (evt) => {
    setSelectedEvent(evt);
    hapticFeedback('selection');
  };

  // Закрыть детали
  const handleCloseDetails = () => {
    setSelectedEvent(null);
    hapticFeedback('impact', 'light');
  };

  // Поделиться событием
  const handleShare = (evt) => {
    if (telegramApp) {
      const shareText = `🌌 ${evt.title}\n📅 ${evt.date}\n\n${evt.shortText}\n\n🧙‍♂️ #ГномийГороскоп #АстроСобытия2025`;
      
      telegramApp.sendData(JSON.stringify({
        action: 'share_astro_event',
        title: evt.title,
        date: evt.date,
        text: evt.shortText
      }));
      
      hapticFeedback('impact', 'medium');
    } else {
      // Fallback для веб-версии
      if (navigator.share) {
        navigator.share({
          title: `🌌 ${evt.title}`,
          text: evt.shortText,
          url: window.location.href
        });
      }
    }
  };

  return (
    <div className="astro-view content-enter">
      <div className="card">
        <h3 className="astro-title">🌌 Астрособытия августа 2025</h3>
        <p className="astro-subtitle">Актуальные астрономические события этого месяца</p>
        
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner">🔭</div>
            <p>Звёзды рассчитываются…</p>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <p className="astro-status error">❌ Ошибка: {error}</p>
            <small>Проверьте подключение к интернету</small>
          </div>
        )}
        
        {!loading && !error && events.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🌌</div>
            <p>Нет доступных астрособытий</p>
            <small>Попробуйте обновить страницу</small>
          </div>
        )}
        
        {events.length > 0 && (
          <>
            <div className="events-summary">
              <p>📊 Всего событий в августе: <strong>{events.length}</strong></p>
              <small>Данные обновлены: {new Date().toLocaleDateString('ru-RU')}</small>
            </div>
            
            <div className="astro-list">
              {events.map((evt, index) => (
                <div
                  key={`${evt.type}-${index}-${evt.date}`}
                  className="astro-item"
                  style={{ borderLeftColor: typeColors[evt.type] || '#9C27B0' }}
                  onClick={() => handleShowDetails(evt)}
                >
                  <div className="astro-date">
                    <div className="event-icon">
                      {typeIcons[evt.type] || '🌌'}
                    </div>
                    <div className="date-text">
                      {evt.date || 'TBA'}
                    </div>
                  </div>
                  
                  <div className="astro-body">
                    <h4 className="astro-event-title">{evt.title}</h4>
                    <p className="astro-text">{evt.shortText}</p>
                    
                    {evt.visibility && (
                      <div className="visibility-info">
                        👀 {evt.visibility}
                      </div>
                    )}
                    
                    <div className="event-actions">
                      <button 
                        className="btn-primary btn-small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToFavorites(evt);
                        }}
                      >
                        ❤️ В избранное
                      </button>
                      
                      <button 
                        className="btn-secondary btn-small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(evt);
                        }}
                      >
                        📤 Поделиться
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        
        {/* Модальное окно с деталями события */}
        {selectedEvent && (
          <div className="event-modal" onClick={handleCloseDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{typeIcons[selectedEvent.type]} {selectedEvent.title}</h3>
                <button className="close-btn" onClick={handleCloseDetails}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="event-detail">
                  <strong>📅 Дата:</strong> {selectedEvent.date}
                </div>
                
                {selectedEvent.fullDate && (
                  <div className="event-detail">
                    <strong>🕐 Точное время:</strong> {new Date(selectedEvent.fullDate).toLocaleString('ru-RU')}
                  </div>
                )}
                
                <div className="event-detail">
                  <strong>📝 Описание:</strong>
                  <p>{selectedEvent.shortText}</p>
                </div>
                
                {selectedEvent.visibility && (
                  <div className="event-detail">
                    <strong>👀 Видимость:</strong> {selectedEvent.visibility}
                  </div>
                )}
                
                <div className="modal-actions">
                  <button 
                    className="btn-primary"
                    onClick={() => handleAddToFavorites(selectedEvent)}
                  >
                    ❤️ Добавить в избранное
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onBack}>
            ← Назад в главное меню
          </button>
        </div>
      </div>
    </div>
  );
}

export default AstroEventsView;
