import React, { useState } from 'react';
import { pixelTheme, pixelStyles } from '../styles/pixelTheme';

const ZodiacCarousel = ({ selectedSign, onSignChange }) => {
  const [currentIndex, setCurrentIndex] = useState(4); // Лев по умолчанию
  
  const zodiacSigns = [
    { sign: 'Овен', emoji: '♈', dates: '21.03-20.04', color: pixelTheme.colors.amber },
    { sign: 'Телец', emoji: '♉', dates: '21.04-20.05', color: pixelTheme.colors.brown },
    { sign: 'Близнецы', emoji: '♊', dates: '21.05-21.06', color: pixelTheme.colors.sage },
    { sign: 'Рак', emoji: '♋', dates: '22.06-22.07', color: pixelTheme.colors.forest },
    { sign: 'Лев', emoji: '♌', dates: '23.07-22.08', color: pixelTheme.colors.olive },
    { sign: 'Дева', emoji: '♍', dates: '23.08-22.09', color: pixelTheme.colors.amber },
    { sign: 'Весы', emoji: '♎', dates: '23.09-22.10', color: pixelTheme.colors.brown },
    { sign: 'Скорпион', emoji: '♏', dates: '23.10-22.11', color: pixelTheme.colors.sage },
    { sign: 'Стрелец', emoji: '♐', dates: '23.11-21.12', color: pixelTheme.colors.forest },
    { sign: 'Козерог', emoji: '♑', dates: '22.12-20.01', color: pixelTheme.colors.olive },
    { sign: 'Водолей', emoji: '♒', dates: '21.01-19.02', color: pixelTheme.colors.amber },
    { sign: 'Рыбы', emoji: '♓', dates: '20.02-20.03', color: pixelTheme.colors.brown }
  ];

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : zodiacSigns.length - 1;
    setCurrentIndex(newIndex);
    onSignChange(zodiacSigns[newIndex].sign);
  };

  const handleNext = () => {
    const newIndex = currentIndex < zodiacSigns.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onSignChange(zodiacSigns[newIndex].sign);
  };

  const handleSignSelect = (index) => {
    setCurrentIndex(index);
    onSignChange(zodiacSigns[index].sign);
  };

  const currentSign = zodiacSigns[currentIndex];

  const styles = {
    container: {
      padding: pixelTheme.spacing.lg,
      textAlign: 'center'
    },
    
    title: {
      ...pixelStyles.card,
      backgroundColor: pixelTheme.colors.forest,
      color: pixelTheme.colors.white,
      padding: pixelTheme.spacing.md,
      margin: `0 ${pixelTheme.spacing.lg} ${pixelTheme.spacing.lg}`,
      fontSize: pixelTheme.fonts.size.normal,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    
    mainCard: {
      ...pixelStyles.card,
      backgroundColor: currentSign.color,
      padding: pixelTheme.spacing.xl,
      margin: `0 ${pixelTheme.spacing.lg} ${pixelTheme.spacing.lg}`,
      minHeight: '180px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    },
    
    signEmoji: {
      fontSize: '48px',
      marginBottom: pixelTheme.spacing.md,
      filter: 'drop-shadow(2px 2px 0px #000000)'
    },
    
    signName: {
      fontSize: pixelTheme.fonts.size.large,
      fontWeight: 'bold',
      color: pixelTheme.colors.black,
      marginBottom: pixelTheme.spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      textShadow: '1px 1px 0px rgba(255,255,255,0.5)'
    },
    
    signDates: {
      fontSize: pixelTheme.fonts.size.small,
      color: pixelTheme.colors.black,
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,0,0,0.1)',
      padding: `${pixelTheme.spacing.xs} ${pixelTheme.spacing.md}`,
      borderRadius: '4px',
      border: '1px solid #000000'
    },
    
    navigation: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: pixelTheme.spacing.lg
    },
    
    navButton: {
      ...pixelStyles.button,
      backgroundColor: pixelTheme.colors.brown,
      color: pixelTheme.colors.white,
      padding: `${pixelTheme.spacing.md} ${pixelTheme.spacing.lg}`,
      fontSize: pixelTheme.fonts.size.normal,
      letterSpacing: '1px'
    },
    
    miniGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: pixelTheme.spacing.sm,
      margin: `0 ${pixelTheme.spacing.xl}`
    },
    
    miniSign: (isActive) => ({
      ...pixelStyles.button,
      backgroundColor: isActive ? pixelTheme.colors.olive : pixelTheme.colors.sage,
      color: pixelTheme.colors.black,
      padding: pixelTheme.spacing.xs,
      fontSize: pixelTheme.fonts.size.tiny,
      minHeight: '40px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      ...(isActive ? pixelStyles.activeButton : {})
    }),
    
    selectButton: {
      ...pixelStyles.button,
      backgroundColor: pixelTheme.colors.forest,
      color: pixelTheme.colors.white,
      padding: `${pixelTheme.spacing.md} ${pixelTheme.spacing.xl}`,
      fontSize: pixelTheme.fonts.size.normal,
      fontWeight: 'bold',
      marginTop: pixelTheme.spacing.lg,
      letterSpacing: '2px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        Выберите ваш знак зодиака
      </div>
      
      <div style={styles.navigation}>
        <button style={styles.navButton} onClick={handlePrevious}>
          ← Пред
        </button>
        <button style={styles.navButton} onClick={handleNext}>
          След →
        </button>
      </div>
      
      <div style={styles.mainCard}>
        <div style={styles.signEmoji}>
          {currentSign.emoji}
        </div>
        <div style={styles.signName}>
          {currentSign.sign}
        </div>
        <div style={styles.signDates}>
          {currentSign.dates}
        </div>
      </div>
      
      <div style={styles.miniGrid}>
        {zodiacSigns.map((sign, index) => (
          <button
            key={sign.sign}
            style={styles.miniSign(index === currentIndex)}
            onClick={() => handleSignSelect(index)}
            title={sign.sign}
          >
            <div style={{ fontSize: '12px' }}>{sign.emoji}</div>
            <div style={{ fontSize: '8px', marginTop: '2px' }}>
              {sign.sign.slice(0, 3)}
            </div>
          </button>
        ))}
      </div>
      
      <button style={styles.selectButton} onClick={() => onSignChange(currentSign.sign)}>
        ★ Выбрать ★
      </button>
    </div>
  );
};

export default ZodiacCarousel;
