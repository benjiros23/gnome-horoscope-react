import React, { useState } from 'react';

const ButtonGrid = ({ onButtonClick }) => {
  const [activeButton, setActiveButton] = useState(null);

  const buttons = [
    { 
      id: 'horoscope', 
      icon: '🔮', 
      title: 'Гороскоп', 
      subtitle: 'Звездные предсказания',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      id: 'cards', 
      icon: '🃏', 
      title: 'Карта дня', 
      subtitle: 'Мудрость карт',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      id: 'numerology', 
      icon: '🔢', 
      title: 'Нумерология', 
      subtitle: 'Тайны чисел',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      id: 'compatibility', 
      icon: '💕', 
      title: 'Совместимость', 
      subtitle: 'Любовная магия',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      id: 'moon', 
      icon: '🌙', 
      title: 'Лунный календарь', 
      subtitle: 'Фазы Луны',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      id: 'events', 
      icon: '🌌', 
      title: 'Астрособытия', 
      subtitle: 'Небесные явления',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    { 
      id: 'mercury', 
      icon: '🪐', 
      title: 'Меркурий', 
      subtitle: 'Ретроградность',
      gradient: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
    },
    { 
      id: 'favorites', 
      icon: '❤️', 
      title: 'Избранное', 
      subtitle: 'Сохраненное',
      gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
    }
  ];

  const handleButtonClick = (button) => {
    setActiveButton(button.id);
    if (onButtonClick) {
      onButtonClick(button.id);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '20px'
      }}>
        {buttons.map((button) => (
          <button
            key={button.id}
            onClick={() => handleButtonClick(button)}
            style={{
              background: button.gradient,
              border: 'none',
              borderRadius: '16px',
              padding: '20px 16px',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: activeButton === button.id 
                ? '0 8px 25px rgba(0,0,0,0.2)' 
                : '0 4px 15px rgba(0,0,0,0.1)',
              transform: activeButton === button.id ? 'translateY(-4px)' : 'translateY(0)',
              textAlign: 'center',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              if (activeButton !== button.id) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeButton !== button.id) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {button.icon}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
              {button.title}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {button.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGrid;
