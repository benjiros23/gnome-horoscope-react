import React, { useState } from 'react';

const ButtonGrid = ({ onButtonClick }) => {
  const [activeButton, setActiveButton] = useState(null);

  // Ваша пиксель-арт палитра
  const palette = {
    sage: '#b6bb9b',      // Шалфей
    brown: '#8a6c4c',     // Коричневый
    forest: '#62862a',    // Лесной
    olive: '#8e8e15',     // Оливковый
    amber: '#a96a14'      // Янтарный
  };

  const buttons = [
    { 
      id: 'horoscope', 
      icon: '★', 
      title: 'Гороскоп', 
      color: palette.amber
    },
    { 
      id: 'cards', 
      icon: '♠', 
      title: 'Карты', 
      color: palette.olive
    },
    { 
      id: 'numerology', 
      icon: '#', 
      title: 'Числа', 
      color: palette.forest
    },
    { 
      id: 'compatibility', 
      icon: '♥', 
      title: 'Любовь', 
      color: palette.brown
    },
    { 
      id: 'moon', 
      icon: '○', 
      title: 'Луна', 
      color: palette.sage
    },
    { 
      id: 'events', 
      icon: '✦', 
      title: 'События', 
      color: palette.amber
    },
    { 
      id: 'mercury', 
      icon: '◉', 
      title: 'Меркурий', 
      color: palette.brown
    },
    { 
      id: 'favorites', 
      icon: '♦', 
      title: 'Избранное', 
      color: palette.forest
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
    maxWidth: '400px',
    margin: '0 auto'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '20px'
  };

  const getButtonStyle = (button, isActive) => ({
    backgroundColor: button.color,
    border: isActive ? '3px solid #000000' : '2px solid #000000',
    borderRadius: '8px',
    padding: '16px 12px',
    cursor: 'pointer',
    transition: 'all 0.1s ease', // Быстрый переход для пиксельного эффекта
    textAlign: 'center',
    minHeight: '80px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Courier New", monospace', // Моноширинный шрифт
    fontWeight: 'bold',
    color: '#000000',
    fontSize: '14px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    boxShadow: isActive 
      ? '4px 4px 0px #000000, inset 2px 2px 0px rgba(255,255,255,0.2)' 
      : '2px 2px 0px #000000',
    transform: isActive ? 'translate(-1px, -1px)' : 'translate(0, 0)',
    // Убираем все градиенты - чистые пиксельные цвета
    backgroundImage: 'none',
    position: 'relative'
  });

  const iconStyle = {
    fontSize: '20px',
    marginBottom: '4px',
    fontWeight: 'bold'
  };

  const titleStyle = {
    fontSize: '10px',
    fontWeight: 'bold',
    textShadow: 'none'
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
                  e.target.style.border = '3px solid #000000';
                  e.target.style.transform = 'translate(-1px, -1px)';
                  e.target.style.boxShadow = '3px 3px 0px #000000';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.border = '2px solid #000000';
                  e.target.style.transform = 'translate(0, 0)';
                  e.target.style.boxShadow = '2px 2px 0px #000000';
                }
              }}
            >
              <div style={iconStyle}>
                {button.icon}
              </div>
              <div style={titleStyle}>
                {button.title}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGrid;
