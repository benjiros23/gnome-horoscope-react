import React, { useState, useEffect } from 'react';
import { useAPI } from '../hooks/useAPI';

function DayCardView({ onBack, onAddToFavorites, telegramApp }) {
  const { getDayCard, loading, error } = useAPI();
  const [card, setCard] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    console.log('🃏 DayCardView: Компонент смонтирован');
    getDayCard()
      .then(data => {
        console.log('✅ DayCardView: Карта получена:', data);
        setCard(data);
      })
      .catch(error => {
        console.error('❌ DayCardView: Ошибка:', error);
      });
  }, [getDayCard]);

  const handleRevealCard = () => {
    console.log('🔮 Раскрываем карту');
    setIsRevealed(true);
  };

  const handleAddToFavorites = () => {
    if (card && onAddToFavorites) {
      onAddToFavorites({
        id: Date.now(),
        type: 'day-card',
        title: `🃏 ${card.title}`,
        content: card.text,
        date: new Date().toLocaleDateString('ru-RU'),
        source: card.source || 'gnome_wisdom'
      });
      alert('❤️ Карта дня добавлена в избранное!');
    }
  };

  // Встроенные стили для отладки
  const containerStyle = {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    minHeight: '500px',
    border: '2px solid #e0e0e0',
    borderRadius: '10px'
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333'
  };

  const cardStyle = {
    width: '300px',
    height: '400px',
    margin: '20px auto',
    borderRadius: '15px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    position: 'relative',
    backgroundColor: isRevealed ? '#fff' : '#6a5acd',
    color: isRevealed ? '#333' : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '20px',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: '12px 24px',
    margin: '10px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#8BC34A',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #e0e0e0'
  };

  console.log('🎨 DayCardView: Рендеринг, состояние:', { loading, error, card: !!card, isRevealed });

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>🃏 Карта дня</h3>
      <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666', marginBottom: '30px' }}>
        Древняя мудрость гномов откроет тайны сегодняшнего дня
      </p>
      
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>✨</div>
          <p>Гномы перемешивают карты...</p>
        </div>
      )}
      
      {error && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#e53935' }}>
          <p>❌ Ошибка: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={primaryButtonStyle}
          >
            🔄 Обновить
          </button>
        </div>
      )}
      
      {card && (
        <div>
          <div style={cardStyle} onClick={handleRevealCard}>
            {!isRevealed ? (
              <div>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🧙‍♂️</div>
                <p style={{ fontSize: '16px', opacity: '0.9' }}>
                  Нажмите, чтобы раскрыть карту
                </p>
              </div>
            ) : (
              <div>
                <h2 style={{ margin: '0 0 20px', fontSize: '22px', fontWeight: 'bold' }}>
                  {card.title}
                </h2>
                <div style={{ fontSize: '48px', margin: '20px 0' }}>🌟</div>
                <p style={{ fontSize: '16px', lineHeight: '1.5', margin: '0 0 20px' }}>
                  {card.text}
                </p>
                {card.wisdom && (
                  <div style={{
                    backgroundColor: 'rgba(139, 195, 74, 0.1)',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '15px',
                    borderLeft: '4px solid #8BC34A'
                  }}>
                    <small style={{ fontWeight: 'bold', color: '#8BC34A' }}>
                      Мудрость гномов:
                    </small>
                    <p style={{ margin: '8px 0 0', fontStyle: 'italic', fontSize: '14px' }}>
                      {card.wisdom}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {isRevealed && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={handleAddToFavorites}
                style={primaryButtonStyle}
              >
                ❤️ В избранное
              </button>
              <button 
                onClick={() => {
                  setIsRevealed(false);
                  setCard(null);
                  getDayCard().then(setCard);
                }}
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}
              >
                🔮 Новая карта
              </button>
            </div>
          )}
        </div>
      )}
      
      {!loading && !error && !card && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '32px', marginBottom: '20px' }}>🔮</div>
          <p>Подготавливаем вашу карту...</p>
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
        <button onClick={onBack} style={secondaryButtonStyle}>
          ← Назад в главное меню
        </button>
      </div>
    </div>
  );
}

export default DayCardView;
