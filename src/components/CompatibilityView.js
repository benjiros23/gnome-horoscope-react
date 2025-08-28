import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';

const CompatibilityView = ({ onAddToFavorites, telegramApp }) => {
  const { theme } = useTheme();
  const [sign1, setSign1] = useState('');
  const [sign2, setSign2] = useState('');
  const [result, setResult] = useState(null);

  const zodiacSigns = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];

  const calculateCompatibility = () => {
    if (!sign1 || !sign2) return;

    // Простая логика совместимости
    const compatibility = Math.floor(Math.random() * 100) + 1;
    const description = compatibility > 80 ? 'Идеальная пара! ❤️' :
                       compatibility > 60 ? 'Хорошая совместимость 💕' :
                       compatibility > 40 ? 'Средняя совместимость 💛' :
                       'Нужна работа над отношениями 💙';

    setResult({
      sign1,
      sign2,
      compatibility,
      description
    });

    try {
      if (telegramApp?.HapticFeedback) {
        telegramApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (e) {}
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto'
  };

  return (
    <div style={containerStyle}>
      <Card 
        title="💕 Совместимость знаков" 
        subtitle="Узнайте совместимость ваших знаков зодиака"
      >
        <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Первый знак:
            </label>
            <select
              value={sign1}
              onChange={(e) => setSign1(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${theme.colors.border}`,
                borderRadius: '8px',
                background: theme.card.background,
                color: theme.card.color,
                fontSize: '16px'
              }}
            >
              <option value="">Выберите знак</option>
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
              Второй знак:
            </label>
            <select
              value={sign2}
              onChange={(e) => setSign2(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: `2px solid ${theme.colors.border}`,
                borderRadius: '8px',
                background: theme.card.background,
                color: theme.card.color,
                fontSize: '16px'
              }}
            >
              <option value="">Выберите знак</option>
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Button
            variant="primary"
            onClick={calculateCompatibility}
            disabled={!sign1 || !sign2}
          >
            💖 Проверить совместимость
          </Button>
        </div>

        {result && (
          <Card style={{ margin: '20px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 16px 0' }}>
                {result.sign1} + {result.sign2}
              </h3>
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                color: theme.colors.primary,
                margin: '16px 0'
              }}>
                {result.compatibility}%
              </div>
              <p style={{ fontSize: '18px', margin: '16px 0' }}>
                {result.description}
              </p>
              
              <Button
                variant="ghost"
                onClick={() => onAddToFavorites && onAddToFavorites({
                  type: 'compatibility',
                  title: `${result.sign1} + ${result.sign2}`,
                  content: `Совместимость: ${result.compatibility}% - ${result.description}`,
                  date: new Date().toLocaleDateString()
                })}
              >
                ⭐ В избранное
              </Button>
            </div>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default CompatibilityView;
