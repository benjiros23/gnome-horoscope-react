import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';

// ===== РАСШИРЕННЫЕ ДАННЫЕ ЗНАКОВ =====
const ZODIAC_SIGNS = [
  { 
    sign: 'Овен', 
    emoji: '♈', 
    element: 'fire', 
    quality: 'cardinal',
    ruler: 'Mars',
    traits: ['энергичный', 'решительный', 'импульсивный']
  },
  { 
    sign: 'Телец', 
    emoji: '♉', 
    element: 'earth', 
    quality: 'fixed',
    ruler: 'Venus',
    traits: ['стабильный', 'упорный', 'чувственный']
  },
  { 
    sign: 'Близнецы', 
    emoji: '♊', 
    element: 'air', 
    quality: 'mutable',
    ruler: 'Mercury',
    traits: ['общительный', 'любознательный', 'переменчивый']
  },
  { 
    sign: 'Рак', 
    emoji: '♋', 
    element: 'water', 
    quality: 'cardinal',
    ruler: 'Moon',
    traits: ['заботливый', 'эмоциональный', 'интуитивный']
  },
  { 
    sign: 'Лев', 
    emoji: '♌', 
    element: 'fire', 
    quality: 'fixed',
    ruler: 'Sun',
    traits: ['гордый', 'щедрый', 'творческий']
  },
  { 
    sign: 'Дева', 
    emoji: '♍', 
    element: 'earth', 
    quality: 'mutable',
    ruler: 'Mercury',
    traits: ['практичный', 'аналитический', 'перфекционист']
  },
  { 
    sign: 'Весы', 
    emoji: '♎', 
    element: 'air', 
    quality: 'cardinal',
    ruler: 'Venus',
    traits: ['гармоничный', 'дипломатичный', 'справедливый']
  },
  { 
    sign: 'Скорпион', 
    emoji: '♏', 
    element: 'water', 
    quality: 'fixed',
    ruler: 'Pluto',
    traits: ['интенсивный', 'глубокий', 'трансформирующий']
  },
  { 
    sign: 'Стрелец', 
    emoji: '♐', 
    element: 'fire', 
    quality: 'mutable',
    ruler: 'Jupiter',
    traits: ['оптимистичный', 'философский', 'авантюрный']
  },
  { 
    sign: 'Козерог', 
    emoji: '♑', 
    element: 'earth', 
    quality: 'cardinal',
    ruler: 'Saturn',
    traits: ['амбициозный', 'дисциплинированный', 'ответственный']
  },
  { 
    sign: 'Водолей', 
    emoji: '♒', 
    element: 'air', 
    quality: 'fixed',
    ruler: 'Uranus',
    traits: ['независимый', 'оригинальный', 'гуманитарный']
  },
  { 
    sign: 'Рыбы', 
    emoji: '♓', 
    element: 'water', 
    quality: 'mutable',
    ruler: 'Neptune',
    traits: ['творческий', 'сочувствующий', 'мистический']
  }
];

// ===== УСЛОЖНЕННАЯ ЛОГИКА СОВМЕСТИМОСТИ =====
class CompatibilityCalculator {
  // Совместимость элементов
  static elementCompatibility = {
    fire: { fire: 85, earth: 40, air: 75, water: 45 },
    earth: { fire: 40, earth: 80, air: 50, water: 70 },
    air: { fire: 75, earth: 50, air: 85, water: 55 },
    water: { fire: 45, earth: 70, air: 55, water: 90 }
  };

  // Совместимость качеств
  static qualityCompatibility = {
    cardinal: { cardinal: 60, fixed: 70, mutable: 85 },
    fixed: { cardinal: 70, fixed: 75, mutable: 65 },
    mutable: { cardinal: 85, fixed: 65, mutable: 80 }
  };

  // Специальные пары с высокой совместимостью
  static specialPairs = {
    'Овен-Лев': 95, 'Овен-Стрелец': 90,
    'Телец-Дева': 88, 'Телец-Козерог': 85,
    'Близнецы-Весы': 90, 'Близнецы-Водолей': 85,
    'Рак-Скорпион': 92, 'Рак-Рыбы': 88,
    'Лев-Стрелец': 87, 'Дева-Козерог': 90,
    'Весы-Водолей': 88, 'Скорпион-Рыбы': 85
  };

  static calculate(sign1Name, sign2Name) {
    const sign1 = ZODIAC_SIGNS.find(s => s.sign === sign1Name);
    const sign2 = ZODIAC_SIGNS.find(s => s.sign === sign2Name);
    
    if (!sign1 || !sign2) return null;

    // Проверяем специальные пары
    const pairKey1 = `${sign1Name}-${sign2Name}`;
    const pairKey2 = `${sign2Name}-${sign1Name}`;
    
    if (this.specialPairs[pairKey1]) return this.specialPairs[pairKey1];
    if (this.specialPairs[pairKey2]) return this.specialPairs[pairKey2];

    // Базовая совместимость по элементам
    const elementScore = this.elementCompatibility[sign1.element][sign2.element];
    
    // Совместимость по качествам
    const qualityScore = this.qualityCompatibility[sign1.quality][sign2.quality];
    
    // Бонус за совпадение правителей
    const rulerBonus = sign1.ruler === sign2.ruler ? 15 : 0;
    
    // Итоговый расчет
    const baseScore = (elementScore * 0.6 + qualityScore * 0.4 + rulerBonus);
    
    // Добавляем небольшую случайность для уникальности
    const randomFactor = (Math.random() - 0.5) * 10;
    
    return Math.min(Math.max(Math.round(baseScore + randomFactor), 0), 100);
  }

  static getDetailedAnalysis(sign1Name, sign2Name, compatibility) {
    const sign1 = ZODIAC_SIGNS.find(s => s.sign === sign1Name);
    const sign2 = ZODIAC_SIGNS.find(s => s.sign === sign2Name);
    
    const elementAnalysis = this.getElementAnalysis(sign1.element, sign2.element);
    const qualityAnalysis = this.getQualityAnalysis(sign1.quality, sign2.quality);
    
    return {
      love: this.getLoveAnalysis(compatibility, sign1, sign2),
      friendship: this.getFriendshipAnalysis(compatibility, sign1, sign2),
      work: this.getWorkAnalysis(compatibility, sign1, sign2),
      elements: elementAnalysis,
      qualities: qualityAnalysis,
      advice: this.getAdvice(compatibility, sign1, sign2)
    };
  }

  static getElementAnalysis(element1, element2) {
    const combinations = {
      'fire-fire': 'Взрывная энергия и страсть, но может быть слишком интенсивно',
      'fire-earth': 'Огонь может вдохновить Землю, но Земля может погасить Огонь',
      'fire-air': 'Воздух раздувает пламя - динамичный и вдохновляющий союз',
      'fire-water': 'Противоположности притягиваются, но нужен баланс',
      'earth-earth': 'Стабильный и надежный союз, основанный на общих ценностях',
      'earth-air': 'Практичность встречается с идеями - может быть плодотворно',
      'earth-water': 'Питательная и поддерживающая связь, как сад после дождя',
      'air-air': 'Интеллектуальная связь и общие интересы',
      'air-water': 'Воздух может принести бурю, но и свежесть',
      'water-water': 'Глубокое эмоциональное понимание и интуитивная связь'
    };

    const key = element1 === element2 ? 
      `${element1}-${element1}` : 
      [element1, element2].sort().join('-');
    
    return combinations[key] || 'Уникальное сочетание элементов';
  }

  static getQualityAnalysis(quality1, quality2) {
    const combinations = {
      'cardinal-cardinal': 'Оба лидеры - может быть борьба за власть',
      'cardinal-fixed': 'Инициатор и стабилизатор - хорошее дополнение',
      'cardinal-mutable': 'Лидер и адаптер - гибкое партнерство',
      'fixed-fixed': 'Стабильность и упорство, но может быть упрямство',
      'fixed-mutable': 'Стабильность встречается с гибкостью',
      'mutable-mutable': 'Взаимная адаптивность и понимание изменений'
    };

    const key = quality1 === quality2 ? 
      `${quality1}-${quality1}` : 
      [quality1, quality2].sort().join('-');
    
    return combinations[key] || 'Интересное сочетание качеств';
  }

  static getLoveAnalysis(compatibility, sign1, sign2) {
    if (compatibility >= 80) {
      return `${sign1.emoji} и ${sign2.emoji} создают магическую связь. Страсть и понимание идут рука об руку.`;
    } else if (compatibility >= 60) {
      return `Хорошие перспективы для ${sign1.emoji} и ${sign2.emoji}. При работе над отношениями может быть очень красиво.`;
    } else if (compatibility >= 40) {
      return `${sign1.emoji} и ${sign2.emoji} могут найти общий язык, но потребуются компромиссы.`;
    } else {
      return `Сложные, но возможные отношения между ${sign1.emoji} и ${sign2.emoji}. Противоположности могут притягиваться.`;
    }
  }

  static getFriendshipAnalysis(compatibility, sign1, sign2) {
    if (compatibility >= 80) {
      return 'Дружба на всю жизнь! Взаимопонимание и поддержка.';
    } else if (compatibility >= 60) {
      return 'Крепкая дружба с общими интересами и взаимным уважением.';
    } else if (compatibility >= 40) {
      return 'Хорошие приятельские отношения, особенно в определенных сферах.';
    } else {
      return 'Дружба возможна, но скорее в качестве интересных знакомых.';
    }
  }

  static getWorkAnalysis(compatibility, sign1, sign2) {
    if (compatibility >= 80) {
      return 'Отличная рабочая команда! Дополняют друг друга и достигают целей.';
    } else if (compatibility >= 60) {
      return 'Продуктивное сотрудничество при четком распределении ролей.';
    } else if (compatibility >= 40) {
      return 'Могут работать together, но лучше в разных направлениях.';
    } else {
      return 'Рабочие отношения потребуют много усилий и компромиссов.';
    }
  }

  static getAdvice(compatibility, sign1, sign2) {
    const adviceMap = {
      high: [
        'Цените то уникальное, что вы приносите друг другу',
        'Не принимайте гармонию как должное - продолжайте развиваться',
        'Используйте свою совместимость для достижения общих целей'
      ],
      medium: [
        'Работайте над пониманием различий друг друга',
        'Ищите компромиссы и общие интересы',
        'Терпение и открытость помогут укрепить связь'
      ],
      low: [
        'Принимайте различия как возможность для роста',
        'Сосредоточьтесь на том, что вас объединяет',
        'Помните: противоположности могут создать баланс'
      ]
    };

    const level = compatibility >= 70 ? 'high' : compatibility >= 45 ? 'medium' : 'low';
    return adviceMap[level];
  }
}

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const CompatibilityView = React.memo(({ 
  onAddToFavorites, 
  telegramApp,
  initialSign1 = '',
  initialSign2 = ''
}) => {
  const { theme } = useTheme();
  
  const [sign1, setSign1] = useState(initialSign1);
  const [sign2, setSign2] = useState(initialSign2);
  const [result, setResult] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Мемоизированные вычисления
  const isReady = useMemo(() => sign1 && sign2, [sign1, sign2]);
  
  const compatibilityResult = useMemo(() => {
    if (!isReady) return null;
    
    const compatibility = CompatibilityCalculator.calculate(sign1, sign2);
    const analysis = CompatibilityCalculator.getDetailedAnalysis(sign1, sign2, compatibility);
    
    return {
      sign1,
      sign2,
      compatibility,
      analysis,
      description: compatibility >= 80 ? 'Идеальная пара! ❤️' :
                   compatibility >= 60 ? 'Хорошая совместимость 💕' :
                   compatibility >= 40 ? 'Средняя совместимость 💛' :
                   'Нужна работа над отношениями 💙'
    };
  }, [sign1, sign2, isReady]);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    
    selectContainer: {
      display: 'grid',
      gap: '16px',
      marginBottom: '24px',
      gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr'
    },
    
    select: {
      width: '100%',
      padding: '12px 16px',
      border: `2px solid ${theme.colors.border}`,
      borderRadius: '12px',
      backgroundColor: theme.colors.surface || theme.card.background,
      color: theme.colors.text || theme.card.color,
      fontSize: '16px',
      fontFamily: 'inherit',
      transition: 'border-color 0.3s ease',
      outline: 'none'
    },
    
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: theme.colors.text,
      fontSize: '14px'
    },
    
    buttonContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '24px'
    },
    
    resultScore: {
      fontSize: '64px',
      fontWeight: '900',
      color: theme.colors.primary,
      margin: '20px 0',
      textAlign: 'center',
      textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    
    resultTitle: {
      fontSize: '24px',
      fontWeight: '700',
      margin: '0 0 16px 0',
      textAlign: 'center',
      color: theme.colors.text
    },
    
    resultDescription: {
      fontSize: '18px',
      margin: '16px 0 24px 0',
      textAlign: 'center',
      color: theme.colors.textSecondary
    },
    
    detailsGrid: {
      display: 'grid',
      gap: '16px',
      marginTop: '24px',
      gridTemplateColumns: window.innerWidth > 768 ? 'repeat(auto-fit, minmax(250px, 1fr))' : '1fr'
    },
    
    detailCard: {
      background: 'rgba(255,255,255,0.05)',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '12px',
      padding: '16px'
    },
    
    detailTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: theme.colors.primary,
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    detailText: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: theme.colors.textSecondary
    },
    
    adviceList: {
      margin: '8px 0 0 0',
      paddingLeft: '16px',
      color: theme.colors.textSecondary
    }
  }), [theme]);

  // Обработчики событий
  const handleCalculate = useCallback(async () => {
    if (!isReady) return;
    
    setIsCalculating(true);
    
    // Имитация загрузки для UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setResult(compatibilityResult);
    setShowDetails(false);
    setIsCalculating(false);
    
    // Haptic feedback
    try {
      telegramApp?.HapticFeedback?.notificationOccurred('success');
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
  }, [isReady, compatibilityResult, telegramApp]);

  const handleSwapSigns = useCallback(() => {
    setSign1(sign2);
    setSign2(sign1);
    
    try {
      telegramApp?.HapticFeedback?.selectionChanged();
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
  }, [sign1, sign2, telegramApp]);

  const handleAddToFavorites = useCallback(() => {
    if (!result || !onAddToFavorites) return;
    
    onAddToFavorites({
      type: 'compatibility',
      title: `${result.sign1} ${ZODIAC_SIGNS.find(s => s.sign === result.sign1)?.emoji} + ${result.sign2} ${ZODIAC_SIGNS.find(s => s.sign === result.sign2)?.emoji}`,
      content: `Совместимость: ${result.compatibility}% - ${result.description}`,
      date: new Date().toLocaleDateString('ru-RU'),
      compatibility: result.compatibility,
      analysis: result.analysis
    });
    
    const message = 'Результат совместимости добавлен в избранное! ⭐';
    if (telegramApp?.showAlert) {
      telegramApp.showAlert(message);
    } else {
      console.log(message);
    }
  }, [result, onAddToFavorites, telegramApp]);

  const toggleDetails = useCallback(() => {
    setShowDetails(prev => !prev);
  }, []);

  // Эффект для автоматического расчета при изменении знаков
  useEffect(() => {
    if (isReady && !isCalculating) {
      const timer = setTimeout(() => {
        setResult(compatibilityResult);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [compatibilityResult, isReady, isCalculating]);

  return (
    <div style={styles.container}>
      <Card 
        title="💕 Совместимость знаков зодиака" 
        subtitle="Узнайте совместимость на основе астрологических принципов"
      >
        {/* Селекторы знаков */}
        <div style={styles.selectContainer}>
          <div>
            <label style={styles.label} htmlFor="sign1Select">
              Первый знак:
            </label>
            <select
              id="sign1Select"
              value={sign1}
              onChange={(e) => setSign1(e.target.value)}
              style={{
                ...styles.select,
                borderColor: sign1 ? theme.colors.primary : theme.colors.border
              }}
            >
              <option value="">Выберите знак</option>
              {ZODIAC_SIGNS.map(sign => (
                <option key={sign.sign} value={sign.sign}>
                  {sign.emoji} {sign.sign}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={styles.label} htmlFor="sign2Select">
              Второй знак:
            </label>
            <select
              id="sign2Select"
              value={sign2}
              onChange={(e) => setSign2(e.target.value)}
              style={{
                ...styles.select,
                borderColor: sign2 ? theme.colors.primary : theme.colors.border
              }}
            >
              <option value="">Выберите знак</option>
              {ZODIAC_SIGNS.map(sign => (
                <option key={sign.sign} value={sign.sign}>
                  {sign.emoji} {sign.sign}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Кнопки управления */}
        <div style={styles.buttonContainer}>
          <Button
            variant="primary"
            onClick={handleCalculate}
            disabled={!isReady}
            loading={isCalculating}
          >
            {isCalculating ? 'Анализируем...' : '💖 Рассчитать совместимость'}
          </Button>
          
          {isReady && (
            <Button
              variant="ghost"
              onClick={handleSwapSigns}
              disabled={isCalculating}
            >
              🔄 Поменять местами
            </Button>
          )}
        </div>

        {/* Результат */}
        {result && !isCalculating && (
          <Card variant="highlighted" style={{ marginTop: '20px' }}>
            <h3 style={styles.resultTitle}>
              {ZODIAC_SIGNS.find(s => s.sign === result.sign1)?.emoji} {result.sign1} + {ZODIAC_SIGNS.find(s => s.sign === result.sign2)?.emoji} {result.sign2}
            </h3>
            
            <div style={styles.resultScore}>
              {result.compatibility}%
            </div>
            
            <p style={styles.resultDescription}>
              {result.description}
            </p>

            {/* Кнопки действий */}
            <div style={styles.buttonContainer}>
              <Button
                variant="secondary"
                onClick={handleAddToFavorites}
              >
                ⭐ В избранное
              </Button>
              
              <Button
                variant="ghost"
                onClick={toggleDetails}
              >
                {showDetails ? '📄 Скрыть детали' : '📊 Подробный анализ'}
              </Button>
            </div>

            {/* Детальный анализ */}
            {showDetails && result.analysis && (
              <div style={styles.detailsGrid}>
                <div style={styles.detailCard}>
                  <div style={styles.detailTitle}>
                    💕 Любовь и романтика
                  </div>
                  <div style={styles.detailText}>
                    {result.analysis.love}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <div style={styles.detailTitle}>
                    🤝 Дружба
                  </div>
                  <div style={styles.detailText}>
                    {result.analysis.friendship}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <div style={styles.detailTitle}>
                    💼 Работа и сотрудничество
                  </div>
                  <div style={styles.detailText}>
                    {result.analysis.work}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <div style={styles.detailTitle}>
                    🌟 Анализ элементов
                  </div>
                  <div style={styles.detailText}>
                    {result.analysis.elements}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <div style={styles.detailTitle}>
                    ⚖️ Качества характера
                  </div>
                  <div style={styles.detailText}>
                    {result.analysis.qualities}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <div style={styles.detailTitle}>
                    💡 Советы для отношений
                  </div>
                  <ul style={styles.adviceList}>
                    {result.analysis.advice.map((tip, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        )}
      </Card>
    </div>
  );
});

CompatibilityView.displayName = 'CompatibilityView';

export default CompatibilityView;
