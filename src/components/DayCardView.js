import React, { useState, useEffect } from 'react';
import useAPI from '../hooks/useAPI';

const DayCardView = ({ onAddToFavorites, telegramApp, designTheme = 'glass' }) => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const { getDayCard } = useAPI();

  // Загрузка карты дня
  const loadDayCard = async () => {
    setLoading(true);
    setError(null);
    setIsRevealed(false);
    setCardData(null);
    
    try {
      console.log('🃏 Загружаем карту дня...');
      const data = await getDayCard();
      console.log('✅ Карта дня получена:', data);
      
      setCardData(data);
      
      // Автоматически раскрываем карту через 1 секунду
      setTimeout(() => {
        console.log('🔮 Раскрываем карту');
        revealCard();
      }, 1000);
      
    } catch (fetchError) {
      console.error('❌ Ошибка загрузки карты дня:', fetchError);
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  // Анимация раскрытия карты
  const revealCard = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setTimeout(() => {
      setIsRevealed(true);
      setIsFlipping(false);
      
      // Haptic feedback
      try {
        if (telegramApp && parseFloat(telegramApp.version) >= 6.1 && telegramApp.HapticFeedback) {
          telegramApp.HapticFeedback.impactOccurred('medium');
        }
      } catch (e) {}
    }, 600);
  };

  // Загрузка при монтировании
  useEffect(() => {
    console.log('🃏 DayCardView: Компонент смонтирован');
    loadDayCard();
  }, []);

  const handleAddToFavorites = () => {
    if (cardData && onAddToFavorites) {
      const favoriteItem = {
        type: 'day_card',
        title: `Карта дня: ${cardData.card.name}`,
        content: cardData.card.meaning,
        date: cardData.date,
        advice: cardData.card.advice
      };
      
      onAddToFavorites(favoriteItem);
      
      // Haptic feedback
      try {
        if (telegramApp && parseFloat(telegramApp.version) >= 6.1 && telegramApp.HapticFeedback) {
          telegramApp.HapticFeedback.notificationOccurred('success');
        }
      } catch (e) {}
    }
  };

  // Получить эмодзи карты по названию
  const getCardEmoji = (cardName) => {
    const emojiMap = {
      'Маг': '🧙‍♂️',
      'Верховная Жрица': '🔮',
      'Императрица': '👑',
      'Император': '⚔️',
      'Солнце': '☀️',
      'Луна': '🌙',
      'Звезда': '⭐',
      'Колесо Фортуны': '🎡',
      'Смерть': '💀',
      'Дьявол': '😈',
      'Башня': '🏰',
      'Суд': '⚖️',
      'Мир': '🌍',
      'Шут': '🃏'
    };
    return emojiMap[cardName] || '🃏';
  };

  // Получить цвет элемента
  const getElementColor = (element) => {
    const colorMap = {
      'Огонь': '#ff6b6b',
      'Вода': '#4ecdc4', 
      'Воздух': '#45b7d1',
      'Земля': '#96ceb4'
    };
    return colorMap[element] || '#8bc34a';
  };

  // Стили в зависимости от темы
  const getStyles = () => {
    const elementColor = cardData ? getElementColor(cardData.card.element) : '#8bc34a';
    
    const baseStyles = {
      container: {
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        fontFamily: designTheme === 'wooden' ? '"Times New Roman", Georgia, serif' : 'system-ui, sans-serif'
      }
    };

    if (designTheme === 'wooden') {
      return {
        ...baseStyles,
        card: {
          background: 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
          borderRadius: '20px',
          border: '3px solid #8b4513',
          boxShadow: `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
            0 8px 24px 0 rgba(0, 0, 0, 0.25)
          `,
          padding: '24px',
          margin: '16px',
          color: '#3e2723',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '300px'
        },
        cardInner: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
          transform: isFlipping ? 'rotateY(90deg)' : isRevealed ? 'rotateY(0deg)' : 'rotateY(0deg)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }
      };
    } else {
      return {
        ...baseStyles,
        card: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
          padding: '24px',
          margin: '16px',
          color: '#2d3748',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '300px'
        },
        cardInner: {
          background: `linear-gradient(135deg, ${elementColor}15, ${elementColor}05)`,
          backdropFilter: 'blur(12px)',
          borderRadius: '20px',
          border: `2px solid ${elementColor}40`,
          padding: '24px',
          textAlign: 'center',
          boxShadow: `0 8px 24px ${elementColor}20, inset 0 1px 0 rgba(255,255,255,0.2)`,
          transform: isFlipping ? 'rotateY(90deg) scale(0.8)' : isRevealed ? 'rotateY(0deg) scale(1)' : 'rotateY(0deg) scale(1)',
          transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }
      };
    }
  };

  const styles = getStyles();

  console.log('🎨 DayCardView: Рендеринг, состояние:', { 
    loading, 
    error: !!error, 
    card: !!cardData,
    isRevealed 
  });

  // Состояние загрузки
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          {designTheme === 'wooden' && (
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: `
                repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 3px, rgba(0,0,0,0.05) 4px)
              `,
              opacity: 0.6,
              pointerEvents: 'none'
            }}></div>
          )}
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '250px'
          }}>
            <div style={{ 
              fontSize: '64px', 
              marginBottom: '20px',
              animation: 'cardSpin 2s linear infinite'
            }}>
              🃏
            </div>
            <h3 style={{ marginBottom: '8px' }}>Тасуем карты...</h3>
            <p style={{ opacity: 0.7 }}>Гномы выбирают для вас особенную карту</p>
          </div>
        </div>
        
        <style>{`
          @keyframes cardSpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '250px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
            <h3 style={{ color: '#dc3545', marginBottom: '8px' }}>Ошибка</h3>
            <p style={{ marginBottom: '20px', textAlign: 'center' }}>{error}</p>
            <button 
              onClick={loadDayCard}
              style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔄 Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Основное отображение карты
  if (!cardData) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '250px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🃏</div>
            <h3>Подготовка карт...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Деревянная текстура для wooden темы */}
        {designTheme === 'wooden' && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `
              repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 3px, rgba(0,0,0,0.05) 4px)
            `,
            opacity: 0.6,
            pointerEvents: 'none'
          }}></div>
        )}

        <div style={styles.cardInner}>
          {/* Заголовок */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '20px',
            color: designTheme === 'wooden' ? '#3e2723' : '#2d3748'
          }}>
            🃏 Карта дня
          </h2>

          {/* Основная иконка карты */}
          <div style={{
            fontSize: '72px',
            marginBottom: '16px',
            filter: designTheme === 'glass' 
              ? `drop-shadow(0 0 20px ${getElementColor(cardData.card.element)}80)` 
              : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            animation: isRevealed ? 'cardGlow 2s ease-in-out infinite' : 'none'
          }}>
            {getCardEmoji(cardData.card.name)}
          </div>

          {/* Название карты */}
          <h3 style={{
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '12px',
            color: designTheme === 'wooden' ? '#8b4513' : getElementColor(cardData.card.element),
            textShadow: designTheme === 'wooden' ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
          }}>
            {cardData.card.name}
          </h3>

          {/* Элемент и энергия */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <span style={{
              background: designTheme === 'wooden' 
                ? 'rgba(139, 69, 19, 0.2)' 
                : `${getElementColor(cardData.card.element)}20`,
              color: designTheme === 'wooden' ? '#8b4513' : getElementColor(cardData.card.element),
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600',
              border: designTheme === 'wooden' 
                ? '1px solid rgba(139, 69, 19, 0.3)' 
                : `1px solid ${getElementColor(cardData.card.element)}40`,
              textTransform: 'uppercase'
            }}>
              {cardData.card.element}
            </span>
            
            <span style={{
              background: cardData.card.energy === 'positive' 
                ? (designTheme === 'wooden' ? 'rgba(139, 195, 74, 0.2)' : 'rgba(76, 175, 80, 0.2)')
                : 'rgba(255, 152, 0, 0.2)',
              color: cardData.card.energy === 'positive' 
                ? (designTheme === 'wooden' ? '#2e7d0f' : '#4caf50')
                : '#ff9800',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: '600',
              border: cardData.card.energy === 'positive' 
                ? (designTheme === 'wooden' ? '1px solid rgba(139, 195, 74, 0.3)' : '1px solid rgba(76, 175, 80, 0.3)')
                : '1px solid rgba(255, 152, 0, 0.3)',
              textTransform: 'uppercase'
            }}>
              {cardData.card.energy === 'positive' ? '✨ Позитив' : '⚡ Нейтрал'}
            </span>
          </div>

          {/* Значение карты */}
          <div style={{
            background: designTheme === 'wooden' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '16px',
            backdropFilter: 'blur(8px)',
            border: designTheme === 'wooden' 
              ? '1px solid rgba(139, 69, 19, 0.2)' 
              : '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: designTheme === 'wooden' ? '#3e2723' : '#2d3748'
            }}>
              🔍 Значение
            </h4>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.5',
              margin: 0
            }}>
              {cardData.card.meaning}
            </p>
          </div>

          {/* Совет */}
          <div style={{
            background: designTheme === 'wooden' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px',
            backdropFilter: 'blur(8px)',
            border: designTheme === 'wooden' 
              ? '1px solid rgba(139, 69, 19, 0.2)' 
              : '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: designTheme === 'wooden' ? '#3e2723' : '#2d3748'
            }}>
              💡 Совет
            </h4>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.5',
              margin: 0
            }}>
              {cardData.card.advice}
            </p>
          </div>

          {/* Мудрость гномов */}
          {cardData.gnomeWisdom && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 195, 74, 0.2), rgba(139, 195, 74, 0.1))',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(139, 195, 74, 0.3)'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                marginBottom: '8px',
                color: '#2e7d0f'
              }}>
                🧙‍♂️ Мудрость гномов
              </h4>
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.5',
                margin: 0,
                fontStyle: 'italic',
                color: '#4a5568'
              }}>
                {cardData.gnomeWisdom}
              </p>
            </div>
          )}

          {/* Кнопки действий */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={loadDayCard}
              style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
              }}
            >
              🔄 Новая карта
            </button>
            
            <button 
              onClick={handleAddToFavorites}
              style={{
                background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(255, 193, 7, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
              }}
            >
              ⭐ В избранное
            </button>
          </div>

          {/* Дата */}
          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '12px',
            opacity: 0.6
          }}>
            📅 {cardData.date}
          </div>
        </div>
      </div>

      {/* CSS анимации */}
      <style>{`
        @keyframes cardGlow {
          0%, 100% { filter: drop-shadow(0 0 20px ${getElementColor(cardData.card.element)}80); }
          50% { filter: drop-shadow(0 0 30px ${getElementColor(cardData.card.element)}FF); }
        }
      `}</style>
    </div>
  );
};

export default DayCardView;
