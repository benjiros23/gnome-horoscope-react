import React, { useState } from 'react';

const ButtonGrid = ({ onButtonClick }) => {
  const [activeButton, setActiveButton] = useState(null);

  const buttons = [
    { 
      id: 'horoscope', 
      icon: '🔮', 
      title: 'Гороскоп', 
      subtitle: 'Звездные предсказания',
      gradient: 'linear-gradient(135deg, #8B7355 0%, #6B5B47 100%)', // Теплый коричневый
      shadow: 'rgba(139, 115, 85, 0.3)'
    },
    { 
      id: 'cards', 
      icon: '🃏', 
      title: 'Карта дня', 
      subtitle: 'Мудрость карт',
      gradient: 'linear-gradient(135deg, #7C8471 0%, #5C6B47 100%)', // Оливковый
      shadow: 'rgba(124, 132, 113, 0.3)'
    },
    { 
      id: 'numerology', 
      icon: '🔢', 
      title: 'Нумерология', 
      subtitle: 'Тайны чисел',
      gradient: 'linear-gradient(135deg, #6B8E8E 0%, #4A6B6B 100%)', // Стальной голубой
      shadow: 'rgba(107, 142, 142, 0.3)'
    },
    { 
      id: 'compatibility', 
      icon: '💕', 
      title: 'Совместимость', 
      subtitle: 'Любовная магия',
      gradient: 'linear-gradient(135deg, #8B6B7C 0%, #6B4A5C 100%)', // Винный
      shadow: 'rgba(139, 107, 124, 0.3)'
    },
    { 
      id: 'moon', 
      icon: '🌙', 
      title: 'Лунный календарь', 
      subtitle: 'Фазы Луны',
      gradient: 'linear-gradient(135deg, #7C7C7C 0%, #5C5C5C 100%)', // Графитовый
      shadow: 'rgba(124, 124, 124, 0.3)'
    },
    { 
      id: 'events', 
      icon: '🌌', 
      title: 'Астрособытия', 
      subtitle: 'Небесные явления',
      gradient: 'linear-gradient(135deg, #8B8B55 0%, #6B6B3D 100%)', // Хаки
      shadow: 'rgba(139, 139, 85, 0.3)'
    },
    { 
      id: 'mercury', 
      icon: '🪐', 
      title: 'Меркурий', 
      subtitle: 'Ретроградность',
      gradient: 'linear-gradient(135deg, #B8860B 0%, #8B6914 100%)', // Темное золото
      shadow: 'rgba(184, 134, 11, 0.3)'
    },
    { 
      id: 'favorites', 
      icon: '❤️', 
      title: 'Избранное', 
      subtitle: 'Сохраненное',
      gradient: 'linear-gradient(135deg, #8B4513 0%, #654321 100%)', // Седловой коричневый
      shadow: 'rgba(139, 69, 19, 0.3)'
    }
  ];

  const handleButtonClick = (button) => {
    setActiveButton(button.id);
    if (onButtonClick) {
      onButtonClick(button.id);
    }
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '500px',
    margin: '0 auto'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '20px'
  };

  const getButtonStyle = (button, isActive) => ({
    background: button.gradient,
    border: 'none',
    borderRadius: '16px',
    padding: '20px 16px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isActive 
      ? `0 8px 32px ${button.shadow}, 0 2px 8px rgba(0,0,0,0.1)` 
      : `0 4px 16px ${button.shadow}`,
    transform: isActive ? 'translateY(-4px)' : 'translateY(0)',
    textAlign: 'center',
    minHeight: '110px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  });

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
    pointerEvents: 'none'
  };

  const iconStyle = {
    fontSize: '28px',
    marginBottom: '8px',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '4px',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
  };

  const subtitleStyle = {
    fontSize: '12px',
    opacity: 0.9,
    fontWeight: '400',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {buttons.map((button) => {
          const isActive = activeButton === button.id;
          
          return (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button)}
              style={getButtonStyle(button, isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 24px ${button.shadow}, 0 2px 8px rgba(0,0,0,0.1)`;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = `0 4px 16px ${button.shadow}`;
                }
              }}
            >
              <div style={overlayStyle}></div>
              <div style={iconStyle}>
                {button.icon}
              </div>
              <div style={titleStyle}>
                {button.title}
              </div>
              <div style={subtitleStyle}>
                {button.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGrid;
