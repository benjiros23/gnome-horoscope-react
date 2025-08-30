import React, { useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// ===== КОНСТАНТЫ =====
const ZODIAC_SIGNS = ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'];
const ZODIAC_EMOJIS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

// Данные карточек навигации
const NAVIGATION_CARDS = [
  { id: 'cards', icon: '🃏', title: 'Карта дня', subtitle: 'Получите совет на сегодня', color: 'warning' },
  { id: 'compatibility', icon: '💕', title: 'Совместимость', subtitle: 'Проверьте отношения', color: 'error' },
  { id: 'numerology', icon: '🔢', title: 'Число судьбы', subtitle: 'Раскройте тайны чисел', color: 'info' },
  { id: 'events', icon: '🌌', title: 'События', subtitle: 'Астрологический календарь', color: 'success' },
  { id: 'mercury', icon: '🪐', title: 'Меркурий', subtitle: 'Ретроградное влияние', color: 'secondary' },
  { id: 'favorites', icon: '⭐', title: 'Избранное', subtitle: 'Сохраненные предсказания', color: '#ffd700' }
];

// ===== УТИЛИТЫ =====
const getZodiacEmoji = (sign) => {
  const index = ZODIAC_SIGNS.indexOf(sign);
  return index !== -1 ? ZODIAC_EMOJIS[index] : '♌';
};

// ===== КОМПОНЕНТ КАРТОЧКИ =====
const BentoCard = React.memo(({ 
  size = 'normal', 
  color, 
  onClick, 
  children, 
  className = '',
  tabIndex = 0,
  'aria-label': ariaLabel,
  theme
}) => {
  const cardSizes = useMemo(() => ({
    normal: { gridColumn: 'span 1', gridRow: 'span 1', minHeight: '140px' },
    large: { gridColumn: 'span 2', gridRow: 'span 1', minHeight: '200px' },
    wide: { gridColumn: 'span 3', gridRow: 'span 1', minHeight: '140px' },
    tall: { gridColumn: 'span 1', gridRow: 'span 2', minHeight: '280px' }
  }), []);

  const cardStyle = useMemo(() => ({
    ...theme.components.card,
    ...cardSizes[size],
    background: `linear-gradient(135deg, ${color}15 0%, ${theme.components.card.background} 100%)`,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  }), [theme, size, color, cardSizes]);

  const handleMouseEnter = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
  }, []);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = cardStyle.boxShadow;
  }, [cardStyle.boxShadow]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  return (
    <div
      className={className}
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyPress={handleKeyPress}
      tabIndex={tabIndex}
      role="button"
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
});

BentoCard.displayName = 'BentoCard';

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const BentoGrid = React.memo(({ 
  astrologyData, 
  selectedSign, 
  gnomeProfiles, 
  onButtonClick,
  onSignSelect 
}) => {
  const { theme } = useTheme();

  // Мемоизированные стили
  const styles = useMemo(() => ({
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '16px',
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    
    icon: {
      fontSize: '32px',
      marginBottom: '8px',
      display: 'block'
    },
    
    title: {
      ...theme.typography.h3,
      fontSize: '16px',
      margin: '0 0 4px 0'
    },
    
    subtitle: {
      ...theme.typography.caption,
      margin: 0,
      lineHeight: '1.4'
    },
    
    largeIcon: {
      fontSize: '48px',
      marginBottom: '12px'
    },
    
    largeTitle: {
      ...theme.typography.h2,
      fontSize: '20px',
      margin: '0 0 8px 0'
    },
    
    timestamp: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      fontSize: '12px',
      opacity: 0.6,
      backgroundColor: theme.colors.surface || 'rgba(255,255,255,0.1)',
      padding: '4px 8px',
      borderRadius: '12px'
    }
  }), [theme]);

  // Обработчики событий
  const handleCardClick = useCallback((action, data) => {
    if (action === 'navigate') {
      onButtonClick?.(data);
    } else if (action === 'selectSign') {
      onSignSelect?.(data);
    }
  }, [onButtonClick, onSignSelect]);

  // Мемоизированные данные
  const moonCardContent = useMemo(() => {
    if (astrologyData?.moon) {
      return {
        icon: astrologyData.moon.emoji,
        title: astrologyData.moon.phase,
        subtitle: `${astrologyData.moon.illumination}% освещенности`,
        extraInfo: `${astrologyData.moon.lunarDay} лунный день`,
        timestamp: astrologyData.lastUpdated
      };
    }
    
    return {
      icon: '🌙',
      title: 'Лунный календарь',
      subtitle: 'Загрузка фазы луны...',
      extraInfo: null,
      timestamp: null
    };
  }, [astrologyData]);

  const zodiacCardContent = useMemo(() => ({
    emoji: getZodiacEmoji(selectedSign),
    title: selectedSign,
    subtitle: gnomeProfiles?.[selectedSign]?.name || 'Ваш гороскоп'
  }), [selectedSign, gnomeProfiles]);

  return (
    <div style={styles.container}>
      {/* Большая карточка - Текущая лунная фаза */}
      <BentoCard
        size="large"
        color={theme.colors.primary}
        onClick={() => handleCardClick('navigate', 'moon')}
        aria-label={`Лунная фаза: ${moonCardContent.title}`}
        theme={theme}
      >
        <div style={styles.largeIcon}>
          {moonCardContent.icon}
        </div>
        <h3 style={styles.largeTitle}>
          {moonCardContent.title}
        </h3>
        <p style={styles.subtitle}>
          {moonCardContent.subtitle}
        </p>
        {moonCardContent.extraInfo && (
          <p style={{ ...styles.subtitle, marginTop: '8px' }}>
            {moonCardContent.extraInfo}
          </p>
        )}
        
        {moonCardContent.timestamp && (
          <div style={styles.timestamp}>
            {moonCardContent.timestamp.toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </BentoCard>

      {/* Текущий знак зодиака */}
      <BentoCard
        size="normal"
        color={theme.colors.secondary}
        onClick={() => handleCardClick('navigate', 'horoscope')}
        aria-label={`Знак зодиака: ${zodiacCardContent.title}`}
        theme={theme}
      >
        <div style={styles.icon}>
          {zodiacCardContent.emoji}
        </div>
        <h3 style={styles.title}>
          {zodiacCardContent.title}
        </h3>
        <p style={styles.subtitle}>
          {zodiacCardContent.subtitle}
        </p>
      </BentoCard>

      {/* Навигационные карточки */}
      {NAVIGATION_CARDS.map(card => (
        <BentoCard
          key={card.id}
          size="normal"
          color={typeof card.color === 'string' && card.color.startsWith('#') 
            ? card.color 
            : theme.colors[card.color] || theme.colors.primary}
          onClick={() => handleCardClick('navigate', card.id)}
          aria-label={`${card.title}: ${card.subtitle}`}
          theme={theme}
        >
          <div style={styles.icon}>
            {card.icon}
          </div>
          <h3 style={styles.title}>
            {card.title}
          </h3>
          <p style={styles.subtitle}>
            {card.subtitle}
          </p>
        </BentoCard>
      ))}
    </div>
  );
});

BentoGrid.displayName = 'BentoGrid';

export default BentoGrid;
