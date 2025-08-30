import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';

const NumerologyView = ({ onAddToFavorites, telegramApp }) => {
  const { theme } = useTheme();
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateNumerology = (dateString) => {
    if (!dateString) return null;

    const [day, month, year] = dateString.split('.').map(Number);
    if (!day || !month || !year) return null;

    // Число жизненного пути
    const lifePath = ((day + month + year).toString().split('').reduce((a, b) => a + parseInt(b), 0)).toString().split('').reduce((a, b) => a + parseInt(b), 0);
    const finalLifePath = lifePath > 9 ? lifePath.toString().split('').reduce((a, b) => a + parseInt(b), 0) : lifePath;

    // Число души (день рождения)
    const soul = day > 9 ? day.toString().split('').reduce((a, b) => a + parseInt(b), 0) : day;
    const finalSoul = soul > 9 ? soul.toString().split('').reduce((a, b) => a + parseInt(b), 0) : soul;

    // Число судьбы (полная дата)
    const destiny = (day + month + year);
    let finalDestiny = destiny;
    while (finalDestiny > 9) {
      finalDestiny = finalDestiny.toString().split('').reduce((a, b) => a + parseInt(b), 0);
    }

    return {
      lifePath: finalLifePath,
      soul: finalSoul,
      destiny: finalDestiny,
      day,
      month,
      year,
      birthDate: dateString
    };
  };

  const getNumerologyDescription = (number, type) => {
    const descriptions = {
      lifePath: {
        1: { title: "Лидер", desc: "Вы прирожденный лидер, независимый и амбициозный. Стремитесь к достижению целей.", color: "#FF6B6B" },
        2: { title: "Дипломат", desc: "Вы миротворец, чувствительный и сотрудничающий. Работаете хорошо в команде.", color: "#4ECDC4" },
        3: { title: "Творец", desc: "Вы творческая личность, оптимистичная и общительная. Любите самовыражение.", color: "#45B7D1" },
        4: { title: "Строитель", desc: "Вы практичный, надежный и трудолюбивый. Цените стабильность.", color: "#96CEB4" },
        5: { title: "Искатель", desc: "Вы свободолюбивый, любознательный и энергичный. Любите перемены.", color: "#FDCB6E" },
        6: { title: "Заботливый", desc: "Вы ответственный, заботливый и семейный. Помогаете другим.", color: "#E17055" },
        7: { title: "Мыслитель", desc: "Вы аналитичный, духовный и интуитивный. Ищете истину.", color: "#A29BFE" },
        8: { title: "Организатор", desc: "Вы материально ориентированный, властный и успешный в бизнесе.", color: "#FD79A8" },
        9: { title: "Гуманист", desc: "Вы сострадательный, щедрый и мудрый. Служите человечеству.", color: "#00B894" }
      }
    };

    return descriptions[type][number] || { title: "Особенный", desc: "У вас уникальный путь", color: theme.colors.primary };
  };

  const handleCalculate = () => {
    if (!birthDate) return;

    setIsCalculating(true);
    
    setTimeout(() => {
      const numerologyResult = calculateNumerology(birthDate);
      setResult(numerologyResult);
      setIsCalculating(false);

      try {
        if (telegramApp?.HapticFeedback) {
          telegramApp.HapticFeedback.notificationOccurred('success');
        }
      } catch (e) {}
    }, 1500);
  };

  const handleAddToFavorites = () => {
    if (result && onAddToFavorites) {
      onAddToFavorites({
        type: 'numerology',
        title: `Нумерология для ${result.birthDate}`,
        content: `Число жизненного пути: ${result.lifePath}, Число души: ${result.soul}, Число судьбы: ${result.destiny}`,
        date: new Date().toLocaleDateString()
      });

      try {
        if (telegramApp?.HapticFeedback) {
          telegramApp.HapticFeedback.notificationOccurred('success');
        }
      } catch (e) {}
    }
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: theme.container.fontFamily
  };

  const headerStyle = {
    ...theme.card,
    padding: '24px',
    marginBottom: '20px',
    textAlign: 'center',
    background: theme.name === 'facebook' 
      ? 'linear-gradient(135deg, #1877F2 0%, #42A5F5 100%)'
      : theme.name === 'dark'
        ? 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)'
        : 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)',
    color: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  };

  const inputCardStyle = {
    ...theme.card,
    padding: '24px',
    marginBottom: '20px'
  };

  const inputStyle = {
    width: '100%',
    maxWidth: '200px',
    padding: '12px 16px',
    fontSize: '16px',
    border: `2px solid ${theme.colors.border}`,
    borderRadius: '12px',
    background: theme.name === 'dark' ? '#495057' : '#ffffff',
    color: theme.card.color,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: '16px',
    transition: 'all 0.3s ease'
  };

  const numberCardStyle = (color) => ({
    ...theme.card,
    padding: '20px',
    margin: '16px 0',
    background: theme.name === 'dark' 
      ? `linear-gradient(135deg, ${color}20, ${color}10)`
      : `linear-gradient(135deg, ${color}15, ${color}08)`,
    border: `2px solid ${color}40`,
    borderRadius: '16px',
    position: 'relative',
    overflow: 'hidden'
  });

  const bigNumberStyle = {
    fontSize: '48px',
    fontWeight: '900',
    textAlign: 'center',
    margin: '16px 0',
    textShadow: theme.name === 'dark' ? '0 2px 4px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      {/* Заголовок */}
      <div style={headerStyle}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          fontSize: '100px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}>
          🔢
        </div>
        
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700',
          margin: '0 0 8px 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          🔢 Нумерология
        </h1>
        <p style={{ 
          fontSize: '16px', 
          opacity: 0.9,
          margin: 0,
          fontWeight: '400'
        }}>
          Откройте тайны своих чисел судьбы
        </p>
      </div>

      {/* Ввод даты рождения */}
      <div style={inputCardStyle}>
        <h3 style={{ 
          ...theme.typography.subtitle, 
          textAlign: 'center',
          marginBottom: '16px',
          color: theme.card.color 
        }}>
          📅 Ваша дата рождения
        </h3>
        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          color: theme.colors.textSecondary,
          marginBottom: '20px'
        }}>
          Древние гномы-математики раскроют тайны ваших чисел
        </p>

        <div style={{ textAlign: 'center' }}>
          <input
            type="text"
            placeholder="дд.мм.гггг"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary;
              e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
              e.target.style.boxShadow = 'none';
            }}
          />
          
          <div style={{ margin: '16px 0' }}>
            <Button
              variant="primary"
              onClick={handleCalculate}
              disabled={!birthDate || isCalculating}
            >
              {isCalculating ? (
                <>
                  <span style={{ 
                    display: 'inline-block',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}>🔄</span>
                  Рассчитываем...
                </>
              ) : (
                <>🧮 Рассчитать нумерологию</>
              )}
            </Button>
          </div>

          <div style={{
            fontSize: '12px',
            color: theme.colors.textSecondary,
            fontStyle: 'italic'
          }}>
            💡 Результат основан на древних нумерологических методах и мудрости гномов
          </div>
        </div>
      </div>

      {/* Результаты */}
      {result && (
        <div>
          {/* Число жизненного пути */}
          {(() => {
            const pathInfo = getNumerologyDescription(result.lifePath, 'lifePath');
            return (
              <div style={numberCardStyle(pathInfo.color)}>
                <h3 style={{ 
                  margin: '0 0 12px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: theme.card.color
                }}>
                  🛤️ Число жизненного пути
                </h3>
                
                <div style={{...bigNumberStyle, color: pathInfo.color}}>
                  {result.lifePath}
                </div>
                
                <div style={{
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: `${pathInfo.color}20`,
                    color: pathInfo.color,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    {pathInfo.title}
                  </div>
                </div>
                
                <p style={{
                  textAlign: 'center',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: theme.card.color,
                  margin: '0'
                }}>
                  {pathInfo.desc}
                </p>
              </div>
            );
          })()}

          {/* Число души */}
          {(() => {
            const soulInfo = getNumerologyDescription(result.soul, 'lifePath');
            return (
              <div style={numberCardStyle(soulInfo.color)}>
                <h3 style={{ 
                  margin: '0 0 12px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: theme.card.color
                }}>
                  💫 Число души
                </h3>
                
                <div style={{...bigNumberStyle, color: soulInfo.color}}>
                  {result.soul}
                </div>
                
                <div style={{
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: `${soulInfo.color}20`,
                    color: soulInfo.color,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    {soulInfo.title}
                  </div>
                </div>
                
                <p style={{
                  textAlign: 'center',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: theme.card.color,
                  margin: '0'
                }}>
                  Ваша внутренняя сущность и желания души
                </p>
              </div>
            );
          })()}

          {/* Число судьбы */}
          {(() => {
            const destinyInfo = getNumerologyDescription(result.destiny, 'lifePath');
            return (
              <div style={numberCardStyle(destinyInfo.color)}>
                <h3 style={{ 
                  margin: '0 0 12px 0',
                  fontSize: '20px',
                  fontWeight: '700',
                  textAlign: 'center',
                  color: theme.card.color
                }}>
                  ⭐ Число судьбы
                </h3>
                
                <div style={{...bigNumberStyle, color: destinyInfo.color}}>
                  {result.destiny}
                </div>
                
                <div style={{
                  textAlign: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    display: 'inline-block',
                    background: `${destinyInfo.color}20`,
                    color: destinyInfo.color,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '12px'
                  }}>
                    Ваше предназначение
                  </div>
                </div>
                
                <p style={{
                  textAlign: 'center',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: theme.card.color,
                  margin: '0'
                }}>
                  Ваш жизненный урок и предназначение в этом мире
                </p>
              </div>
            );
          })()}

          {/* Кнопка добавления в избранное */}
          <div style={{ textAlign: 'center', margin: '24px 0' }}>
            <Button
              variant="primary"
              onClick={handleAddToFavorites}
            >
              ⭐ Добавить в избранное
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NumerologyView;
