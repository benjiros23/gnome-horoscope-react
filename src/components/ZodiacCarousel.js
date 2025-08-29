import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const zodiacSigns = [
  { sign: 'Овен', emoji: '♈' },
  { sign: 'Телец', emoji: '♉' },
  { sign: 'Близнецы', emoji: '♊' },
  { sign: 'Рак', emoji: '♋' },
  { sign: 'Лев', emoji: '♌' },
  { sign: 'Дева', emoji: '♍' },
  { sign: 'Весы', emoji: '♎' },
  { sign: 'Скорпион', emoji: '♏' },
  { sign: 'Стрелец', emoji: '♐' },
  { sign: 'Козерог', emoji: '♑' },
  { sign: 'Водолей', emoji: '♒' },
  { sign: 'Рыбы', emoji: '♓' },
];

const radius = 130; // Радиус круга для иконок
const centerSize = 160; // Размер центрального круга

const ZodiacCircleSelector = ({ selectedSign, onSignSelect }) => {
  const { theme } = useTheme();

  // Расчет позиции элементов по кругу
  const circlePositions = zodiacSigns.map((_, i, arr) => {
    const angle = (2 * Math.PI / arr.length) * i - Math.PI / 2; // сдвиг для верхнего положения
    return {
      left: radius * Math.cos(angle),
      top: radius * Math.sin(angle),
    };
  });

  return (
    <div style={{
      position: 'relative',
      width: 2 * (radius + centerSize / 2),
      height: 2 * (radius + centerSize / 2),
      margin: '30px auto'
    }}>
      {/* Центральный круг с выбранным знаком */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: centerSize,
        height: centerSize,
        marginLeft: -centerSize / 2,
        marginTop: -centerSize / 2,
        borderRadius: '50%',
        backgroundColor: theme.colors.primary,
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0 0 12px ${theme.colors.primary}`,
        fontWeight: '700',
        fontSize: '36px',
        cursor: 'default',
        userSelect: 'none'
      }}>
        <div style={{ fontSize: 48 }}>{zodiacSigns.find(z => z.sign === selectedSign)?.emoji || '❓'}</div>
        <div style={{ marginTop: 8, fontSize: 20 }}>{selectedSign}</div>
      </div>

      {/* Иконки по кругу */}
      {zodiacSigns.map((zodiac, index) => {
        const pos = circlePositions[index];
        const isSelected = zodiac.sign === selectedSign;

        return (
          <button
            key={zodiac.sign}
            onClick={() => onSignSelect(zodiac.sign)}
            style={{
              position: 'absolute',
              left: `calc(50% + ${pos.left}px)`,
              top: `calc(50% + ${pos.top}px)`,
              transform: 'translate(-50%, -50%)',
              width: isSelected ? 60 : 48,
              height: isSelected ? 60 : 48,
              borderRadius: '50%',
              border: isSelected ? `3px solid ${theme.colors.primary}` : `2px solid ${theme.colors.border}`,
              backgroundColor: isSelected ? theme.colors.primary : theme.card.background,
              color: isSelected ? '#fff' : theme.card.color,
              fontSize: isSelected ? 28 : 22,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isSelected ? `0 0 6px ${theme.colors.primary}` : 'none',
              userSelect: 'none',
              outline: 'none',
            }}
            aria-label={zodiac.sign}
            title={zodiac.sign}
          >
            {zodiac.emoji}
          </button>
        );
      })}
    </div>
  );
};

export default ZodiacCircleSelector;
