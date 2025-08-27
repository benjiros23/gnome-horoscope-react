import React, { useState } from 'react';

const ButtonGrid = ({ onButtonClick }) => {
  const [activeButton, setActiveButton] = useState(null);

  const buttons = [
    { 
      id: 'horoscope', 
      label: '🔮 Гороскоп', 
      description: 'Узнай свое будущее',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    { 
      id: 'cards', 
      label: '🃏 Карта дня', 
      description: 'Древняя мудрость',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    { 
      id: 'numerology', 
      label: '🔢 Нумерология', 
      description: 'Магия чисел',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    { 
      id: 'compatibility', 
      label: '💕 Совместимость', 
      description: 'Знаки и любовь',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    { 
      id: 'moon', 
      label: '🌙 Лунный календарь', 
      description: 'Ритмы небес',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    { 
      id: 'advice', 
      label: '💡 Совет дня', 
      description: 'Мудрость гномов',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    }
  ];

  const handleButtonClick = (button) => {
    setActiveButton(button.id);
    if (onButtonClick) {
      onButtonClick(button.id);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto'
    },
    title: {
      textAlign: 'center',
      color: '#8BC34A',
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    subtitle: {
      textAlign: 'center',
      color: '#666',
      marginBottom: '30px',
      fontStyle: 'italic'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '16px',
      marginBottom: '20px'
    },
    button: {
      position: 'relative',
      padding: '20px 16px',
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      minHeight: '120px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: 'white',
      fontWeight: '600',
      fontSize: '16px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    buttonActive: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
    },
    buttonLabel: {
      fontSize: '18px',
      marginBottom: '4px',
      fontWeight: 'bold'
    },
    buttonDescription: {
      fontSize: '12px',
      opacity: 0.9,
      fontWeight: 'normal'
    },
    // Адаптивность для мобильных
    '@media (max-width: 480px)': {
      grid: {
        gridTemplateColumns: '1fr',
        gap: '12px'
      },
      button: {
        minHeight: '100px',
        padding: '16px 12px'
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧙‍♂️ Гномий Гороскоп</h2>
      <p style={styles.subtitle}>Выберите магическую функцию</p>
      
      <div style={styles.grid}>
        {buttons.map((button) => (
          <button
            key={button.id}
            style={{
              ...styles.button,
              background: button.gradient,
              ...(activeButton === button.id ? styles.buttonActive : {})
            }}
            onClick={() => handleButtonClick(button)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              if (activeButton !== button.id) {
                e.target.style.transform = 'translateY(0px)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
              }
            }}
          >
            <div style={styles.buttonLabel}>{button.label}</div>
            <div style={styles.buttonDescription}>{button.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ButtonGrid;
