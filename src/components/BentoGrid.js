import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const BentoGrid = ({ 
  astrologyData, 
  selectedSign, 
  gnomeProfiles, 
  onButtonClick,
  onSignSelect 
}) => {
  const { theme } = useTheme();

  const bentoStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const cardStyle = (size = 'normal', color = theme.colors.primary) => ({
    backgroundColor: theme.card.background,
    border: theme.card.border,
    borderRadius: '16px',
    padding: '20px',
    boxShadow: theme.card.boxShadow,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    gridColumn: size === 'large' ? 'span 2' : size === 'wide' ? 'span 3' : 'span 1',
    gridRow: size === 'tall' ? 'span 2' : 'span 1',
    minHeight: size === 'large' ? '200px' : size === 'tall' ? '280px' : '140px',
    background: `linear-gradient(135deg, ${color}15 0%, ${theme.card.background} 100%)`,
  });

  const iconStyle = {
    fontSize: '32px',
    marginBottom: '8px',
    display: 'block'
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: theme.colors.text
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: theme.colors.textSecondary,
    margin: 0,
    lineHeight: '1.4'
  };

  const handleCardClick = (action, data) => {
    if (action === 'navigate') {
      onButtonClick(data);
    } else if (action === 'selectSign') {
      onSignSelect(data);
    }
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = theme.card.boxShadow;
  };

  return (
    <div style={bentoStyle}>
      {/* Большая карточка - Текущая лунная фаза */}
      <div 
        style={cardStyle('large', theme.colors.primary)}
        onClick={() => handleCardClick('navigate', 'moon')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {astrologyData?.moon ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>
              {astrologyData.moon.emoji}
            </div>
            <h3 style={{ ...titleStyle, fontSize: '20px' }}>
              {astrologyData.moon.phase}
            </h3>
            <p style={subtitleStyle}>
              {astrologyData.moon.illumination}% освещенности
            </p>
            <p style={{ ...subtitleStyle, marginTop: '8px' }}>
              {astrologyData.moon.lunarDay} лунный день
            </p>
            {astrologyData.lastUpdated && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                right: '12px',
                fontSize: '12px',
                opacity: 0.6,
                backgroundColor: theme.colors.surface,
                padding: '4px 8px',
                borderRadius: '12px'
              }}>
                {astrologyData.lastUpdated.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={iconStyle}>🌙</div>
            <h3 style={titleStyle}>Лунный календарь</h3>
            <p style={subtitleStyle}>Загрузка фазы луны...</p>
          </>
        )}
      </div>

      {/* Текущий знак зодиака */}
      <div 
        style={cardStyle('normal', theme.colors.secondary)}
        onClick={() => handleCardClick('navigate', 'horoscope')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={iconStyle}>
          {['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
            'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
            .find(sign => sign === selectedSign) ? 
            ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓']
            [['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
              'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
              .indexOf(selectedSign)] : '♌'
          }
        </div>
        <h3 style={titleStyle}>{selectedSign}</h3>
        <p style={subtitleStyle}>
          {gnomeProfiles[selectedSign]?.name || 'Ваш гороскоп'}
        </p>
      </div>

      {/* Карта дня */}
      <div 
        style={cardStyle('normal', theme.colors.warning)}
        onClick={() => handleCardClick('navigate', 'cards')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={iconStyle}>🃏</div>
        <h3 style={titleStyle}>Карта дня</h3>
        <p style={subtitleStyle}>Получите совет на сегодня</p>
      </div>

      {/* Совместимость */}
      <div 
        style={cardStyle('normal', theme.colors.danger)}
        onClick={() => handleCardClick('navigate', 'compatibility')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={iconStyle}>💕</div>
        <h3 style={titleStyle}>Совместимость</h3>
        <p style={subtitleStyle}>Проверьте отношения</p>
      </div>

      {/* Нумерология */}
      <div 
        style={cardStyle('normal', theme.colors.info)}
        onClick={() => handleCardClick('navigate', 'numerology')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={iconStyle}>🔢</div>
        <h3 style={titleStyle}>Число судьбы</h3>
        <p style={subtitleStyle}>Раскройте тайны чисел</p>
      </div>

      {/* Астрособытия */}
      <div 
        style={cardStyle('normal', theme.colors.success)}
        onClick={() => handleCardClick('navigate', 'events')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={iconStyle}>🌌</div>
        <h3 style={titleStyle}>События</h3>
        <p style={subtitleStyle}>Астрологический календарь</p>
      </div>

      {/* Меркурий */}
      <div 
        style={cardStyle('normal', theme.colors.secondary)}
        onClick={() => handleCardClick('navigate', 'mercury')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={iconStyle}>🪐</div>
        <h3 style={titleStyle}>Меркурий</h3>
        <p style={subtitleStyle}>Ретроградное влияние</p>
      </div>

      {/* Избранное */}
      <div 
        style={cardStyle('normal', '#ffd700')}
        onClick={() => handleCardClick('navigate', 'favorites')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div style={iconStyle}>⭐</div>
        <h3 style={titleStyle}>Избранное</h3>
        <p style={subtitleStyle}>Сохраненные предсказания</p>
      </div>
    </div>
  );
};

export default BentoGrid;
