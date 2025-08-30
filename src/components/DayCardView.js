import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import useAPI from '../hooks/useAPI';
import { saveDayCard, loadDayCard } from '../enhanced_cache';

// ===== РАСШИРЕННАЯ КОЛОДА КАРТ =====
const TAROT_DECK = [
  {
    id: 'fool',
    name: 'Шут',
    emoji: '🃏',
    element: 'Воздух',
    energy: 'positive',
    meaning: 'Новые начинания, спонтанность, безграничные возможности и свобода выбора.',
    advice: 'Доверьтесь интуиции и не бойтесь делать первый шаг. Время для смелых решений.',
    keywords: ['новое начало', 'спонтанность', 'свобода', 'риск'],
    numerology: 0,
    colors: ['#FFD700', '#FF69B4']
  },
  {
    id: 'magician',
    name: 'Маг',
    emoji: '🧙‍♂️',
    element: 'Огонь',
    energy: 'positive',
    meaning: 'Сила воли, мастерство, способность воплощать идеи в реальность.',
    advice: 'У вас есть все необходимые инструменты для достижения цели. Действуйте решительно.',
    keywords: ['мастерство', 'воля', 'творчество', 'действие'],
    numerology: 1,
    colors: ['#FF0000', '#FFA500']
  },
  {
    id: 'high_priestess',
    name: 'Верховная Жрица',
    emoji: '🔮',
    element: 'Вода',
    energy: 'positive',
    meaning: 'Интуиция, подсознание, скрытые знания и внутренняя мудрость.',
    advice: 'Прислушайтесь к внутреннему голосу. Ответы находятся внутри вас.',
    keywords: ['интуиция', 'тайны', 'подсознание', 'мудрость'],
    numerology: 2,
    colors: ['#4B0082', '#E6E6FA']
  },
  {
    id: 'empress',
    name: 'Императрица',
    emoji: '👸',
    element: 'Земля',
    energy: 'positive',
    meaning: 'Плодородие, изобилие, материнская забота и творческая энергия.',
    advice: 'Время для творчества и заботы о близких. Позвольте себе наслаждаться красотой.',
    keywords: ['плодородие', 'изобилие', 'забота', 'творчество'],
    numerology: 3,
    colors: ['#228B22', '#FFB6C1']
  },
  {
    id: 'emperor',
    name: 'Император',
    emoji: '👑',
    element: 'Огонь',
    energy: 'positive',
    meaning: 'Авторитет, структура, контроль и стабильность.',
    advice: 'Проявите лидерские качества и возьмите ответственность за ситуацию.',
    keywords: ['власть', 'структура', 'контроль', 'стабильность'],
    numerology: 4,
    colors: ['#8B0000', '#FFD700']
  },
  {
    id: 'sun',
    name: 'Солнце',
    emoji: '☀️',
    element: 'Огонь',
    energy: 'positive',
    meaning: 'Радость, успех, жизненная энергия и оптимизм.',
    advice: 'Время радости и празднования. Делитесь своей энергией с окружающими.',
    keywords: ['радость', 'успех', 'энергия', 'оптимизм'],
    numerology: 19,
    colors: ['#FFD700', '#FFA500']
  },
  {
    id: 'moon',
    name: 'Луна',
    emoji: '🌙',
    element: 'Вода',
    energy: 'neutral',
    meaning: 'Иллюзии, подсознание, циклы и скрытые влияния.',
    advice: 'Будьте внимательны к знакам и символам. Не все является тем, чем кажется.',
    keywords: ['иллюзии', 'циклы', 'подсознание', 'интуиция'],
    numerology: 18,
    colors: ['#4169E1', '#E6E6FA']
  },
  {
    id: 'star',
    name: 'Звезда',
    emoji: '⭐',
    element: 'Воздух',
    energy: 'positive',
    meaning: 'Надежда, вдохновение, духовное руководство и исцеление.',
    advice: 'Верьте в лучшее и следуйте своим мечтам. Вселенная поддерживает вас.',
    keywords: ['надежда', 'вдохновение', 'мечты', 'исцеление'],
    numerology: 17,
    colors: ['#00BFFF', '#FFD700']
  },
  {
    id: 'wheel_of_fortune',
    name: 'Колесо Фортуны',
    emoji: '🎡',
    element: 'Огонь',
    energy: 'neutral',
    meaning: 'Судьба, циклы, неожиданные изменения и кармические уроки.',
    advice: 'Приготовьтесь к изменениям. То, что происходит сейчас, имеет глубокий смысл.',
    keywords: ['судьба', 'изменения', 'циклы', 'карма'],
    numerology: 10,
    colors: ['#800080', '#FFD700']
  },
  {
    id: 'death',
    name: 'Смерть',
    emoji: '🦋',
    element: 'Вода',
    energy: 'neutral',
    meaning: 'Трансформация, окончание старого цикла, возрождение.',
    advice: 'Отпустите то, что больше не служит вам. Время для трансформации.',
    keywords: ['трансформация', 'окончание', 'возрождение', 'перемены'],
    numerology: 13,
    colors: ['#2F4F4F', '#9370DB']
  }
];

// ===== ГЕНЕРАТОР ГНОМЬЕЙ МУДРОСТИ =====
class GnomeWisdomGenerator {
  static wisdomTemplates = [
    'Как говорит мудрый гном {gnome}: "{wisdom}"',
    'Древняя гномья пословица гласит: "{wisdom}"',
    'Гном {gnome} из Хрустальных Пещер советует: "{wisdom}"',
    'Согласно учению гномов-астрологов: "{wisdom}"',
    'Старейшина {gnome} завещал: "{wisdom}"'
  ];

  static gnomeNames = [
    'Бриллиан Звездочет', 'Аметист Мудрый', 'Обсидиан Тайновед',
    'Кварц Прозорливый', 'Топаз Ясновидящий', 'Изумруд Советник',
    'Рубин Пророк', 'Сапфир Медитатор', 'Гранат Толкователь'
  ];

  static wisdomByElement = {
    'Огонь': [
      'Пламя страсти должно гореть, но не сжигать',
      'Кто контролирует свой огонь, тот управляет своей судьбой',
      'Искра решимости может зажечь костер возможностей'
    ],
    'Вода': [
      'Вода точит камень не силой, а постоянством',
      'Самые глубокие воды текут тише всего',
      'Прислушайтесь к течению - оно знает путь'
    ],
    'Воздух': [
      'Мысли подобны ветру - направляйте их мудро',
      'Тот, кто гибок как ветер, никогда не сломается',
      'Свежий воздух идей освежает застоявшуюся жизнь'
    ],
    'Земля': [
      'Терпение и труд все перетрут, как вода камень',
      'Крепкие корни позволяют дереву достичь небес',
      'Сначала посади семя, потом жди урожая'
    ]
  };

  static generate(card) {
    const template = this.wisdomTemplates[Math.floor(Math.random() * this.wisdomTemplates.length)];
    const gnome = this.gnomeNames[Math.floor(Math.random() * this.gnomeNames.length)];
    const wisdoms = this.wisdomByElement[card.element] || [];
    const wisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)] || 'Следуй своему сердцу, но не забывай взять с собой разум';
    
    return template.replace('{gnome}', gnome).replace('{wisdom}', wisdom);
  }
}

// ===== КЛАСС ДЛЯ РАБОТЫ С КАРТАМИ =====
class DayCardManager {
  static getRandomCard() {
    const randomIndex = Math.floor(Math.random() * TAROT_DECK.length);
    const card = TAROT_DECK[randomIndex];
    
    return {
      ...card,
      drawnAt: new Date().toISOString(),
      id: `${card.id}_${Date.now()}`,
      personalizedMeaning: this.personalizeMeaning(card),
      personalizedAdvice: this.personalizeAdvice(card)
    };
  }

  static personalizeMeaning(card) {
    const personalizations = [
      `В контексте сегодняшнего дня, ${card.meaning.toLowerCase()}`,
      `Сегодня особенно важно помнить: ${card.meaning.toLowerCase()}`,
      `Энергия этого дня говорит о том, что ${card.meaning.toLowerCase()}`
    ];
    
    return personalizations[Math.floor(Math.random() * personalizations.length)];
  }

  static personalizeAdvice(card) {
    const hour = new Date().getHours();
    let timeAdvice = '';
    
    if (hour < 12) {
      timeAdvice = 'С утра стоит ';
    } else if (hour < 17) {
      timeAdvice = 'Во второй половине дня важно ';
    } else {
      timeAdvice = 'Вечером самое время ';
    }
    
    return timeAdvice + card.advice.toLowerCase();
  }

  static getCachedCard() {
    const today = new Date().toISOString().split('T')[0];
    return loadDayCard(today);
  }

  static saveTodaysCard(cardData) {
    const today = new Date().toISOString().split('T')[0];
    saveDayCard(today, cardData);
  }
}

// ===== КОМПОНЕНТ АНИМИРОВАННОЙ КАРТЫ =====
const AnimatedCard = React.memo(({ 
  card, 
  isRevealed, 
  isFlipping, 
  theme, 
  designTheme,
  onReveal 
}) => {
  const cardRef = useRef(null);

  const cardStyles = useMemo(() => {
    const elementColors = {
      'Огонь': ['#FF6B6B', '#FF8E53'],
      'Вода': ['#4ECDC4', '#44A08D'], 
      'Воздух': ['#45B7D1', '#96C93D'],
      'Земля': ['#96CEB4', '#FFECD2']
    };

    const [color1, color2] = elementColors[card.element] || elementColors['Воздух'];

    return {
      container: {
        position: 'relative',
        width: '100%',
        height: '400px',
        perspective: '1000px',
        cursor: !isRevealed ? 'pointer' : 'default'
      },

      card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isFlipping ? 'rotateY(90deg)' : isRevealed ? 'rotateY(0deg)' : 'rotateY(0deg)'
      },

      cardBack: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '20px',
        background: designTheme === 'wooden' 
          ? 'linear-gradient(135deg, #8B4513, #CD853F, #D2B48C)'
          : `linear-gradient(135deg, ${color1}20, ${color2}10)`,
        backdropFilter: designTheme === 'glass' ? 'blur(16px)' : 'none',
        border: designTheme === 'wooden' 
          ? '3px solid #654321' 
          : `2px solid ${color1}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '80px',
        color: designTheme === 'wooden' ? '#3E2723' : color1,
        backfaceVisibility: 'hidden',
        boxShadow: designTheme === 'wooden'
          ? 'inset 0 2px 0 0 rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.25)'
          : `0 8px 32px ${color1}30`,
        transition: 'all 0.3s ease'
      },

      cardFront: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: '20px',
        background: designTheme === 'wooden' 
          ? 'linear-gradient(135deg, #F5DEB3, #DDD8C7, #E6D7C3)'
          : `linear-gradient(135deg, ${color1}15, ${color2}05)`,
        backdropFilter: designTheme === 'glass' ? 'blur(16px)' : 'none',
        border: designTheme === 'wooden' 
          ? '3px solid #8B4513' 
          : `2px solid ${color1}40`,
        padding: '24px',
        transform: 'rotateY(180deg)',
        backfaceVisibility: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: designTheme === 'wooden' ? '#3E2723' : theme.colors.text,
        boxShadow: designTheme === 'wooden'
          ? 'inset 0 2px 0 0 rgba(255,255,255,0.3), 0 8px 24px rgba(0,0,0,0.25)'
          : `0 8px 32px ${color1}30, inset 0 1px 0 rgba(255,255,255,0.2)`
      }
    };
  }, [card, isRevealed, isFlipping, theme, designTheme]);

  const handleCardClick = useCallback(() => {
    if (!isRevealed && !isFlipping && onReveal) {
      onReveal();
    }
  }, [isRevealed, isFlipping, onReveal]);

  // Анимация появления при маунте
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = '0';
      cardRef.current.style.transform = 'scale(0.8) rotateY(-180deg)';
      
      requestAnimationFrame(() => {
        cardRef.current.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        cardRef.current.style.opacity = '1';
        cardRef.current.style.transform = 'scale(1) rotateY(0deg)';
      });
    }
  }, []);

  return (
    <div 
      ref={cardRef}
      style={cardStyles.container} 
      onClick={handleCardClick}
    >
      <div style={cardStyles.card}>
        {/* Задняя сторона карты */}
        <div style={cardStyles.cardBack}>
          🃏
        </div>

        {/* Передняя сторона карты */}
        <div style={cardStyles.cardFront}>
          <div style={{ 
            fontSize: '60px', 
            marginBottom: '16px',
            filter: `drop-shadow(0 0 20px ${card.colors[0]}80)`,
            animation: isRevealed ? 'cardGlow 2s ease-in-out infinite' : 'none'
          }}>
            {card.emoji}
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: card.colors[0],
            textShadow: designTheme === 'wooden' ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
          }}>
            {card.name}
          </h3>

          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <span style={{
              background: `${card.colors[0]}20`,
              color: card.colors[0],
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {card.element}
            </span>
            <span style={{
              background: card.energy === 'positive' ? '#4CAF5020' : '#FF980020',
              color: card.energy === 'positive' ? '#4CAF50' : '#FF9800',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {card.energy === 'positive' ? 'Позитив' : 'Нейтрал'}
            </span>
          </div>

          <p style={{
            fontSize: '12px',
            lineHeight: '1.4',
            maxHeight: '120px',
            overflow: 'hidden',
            margin: 0
          }}>
            {card.personalizedMeaning || card.meaning}
          </p>
        </div>
      </div>
    </div>
  );
});

AnimatedCard.displayName = 'AnimatedCard';

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const DayCardView = React.memo(({ 
  onAddToFavorites, 
  telegramApp, 
  designTheme = 'glass',
  autoReveal = true,
  cacheEnabled = true
}) => {
  const { theme } = useTheme();
  const { getDayCard } = useAPI();
  
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    container: {
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      fontFamily: designTheme === 'wooden' ? '"Times New Roman", Georgia, serif' : 'system-ui, sans-serif'
    },

    headerCard: {
      background: designTheme === 'wooden'
        ? 'linear-gradient(135deg, #8B4513, #CD853F)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '20px',
      borderRadius: '16px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    },

    loadingContainer: {
      textAlign: 'center',
      padding: '60px 20px'
    },

    errorContainer: {
      textAlign: 'center',
      padding: '40px 20px'
    },

    detailsCard: {
      marginTop: '20px',
      background: designTheme === 'wooden'
        ? 'rgba(139, 69, 19, 0.1)'
        : 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      padding: '20px',
      border: designTheme === 'wooden'
        ? '1px solid rgba(139, 69, 19, 0.2)'
        : `1px solid ${theme.colors.border}`
    },

    buttonsContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginTop: '20px'
    }
  }), [theme, designTheme]);

  // Загрузка карты дня
  const loadDayCard = useCallback(async () => {
    setLoading(true);
    setError(null);
    setIsRevealed(false);
    setShuffling(true);
    
    try {
      // Проверяем кеш если включен
      if (cacheEnabled) {
        const cachedCard = DayCardManager.getCachedCard();
        if (cachedCard) {
          console.log('📦 Карта дня загружена из кеша');
          setCardData(cachedCard);
          setShuffling(false);
          
          if (autoReveal) {
            setTimeout(() => revealCard(), 1000);
          }
          setLoading(false);
          return;
        }
      }

      console.log('🃏 Генерируем новую карту дня...');
      
      // Имитация "тасования"
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Пытаемся получить с API или генерируем локально
      let card;
      try {
        const apiData = await getDayCard();
        card = apiData || DayCardManager.getRandomCard();
      } catch (apiError) {
        console.log('🎴 API недоступен, генерируем карту локально');
        card = DayCardManager.getRandomCard();
      }

      // Добавляем гномью мудрость
      const enhancedCard = {
        ...card,
        gnomeWisdom: GnomeWisdomGenerator.generate(card),
        date: new Date().toLocaleDateString('ru-RU', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      setCardData(enhancedCard);
      
      // Сохраняем в кеш
      if (cacheEnabled) {
        DayCardManager.saveTodaysCard(enhancedCard);
      }

      setShuffling(false);
      
      if (autoReveal) {
        setTimeout(() => revealCard(), 800);
      }

      console.log('✅ Карта дня готова:', enhancedCard.name);
      
    } catch (fetchError) {
      console.error('❌ Ошибка загрузки карты дня:', fetchError);
      setError(fetchError.message);
      setShuffling(false);
    } finally {
      setLoading(false);
    }
  }, [getDayCard, autoReveal, cacheEnabled]);

  // Анимация раскрытия карты
  const revealCard = useCallback(() => {
    if (isFlipping || isRevealed) return;
    
    setIsFlipping(true);
    
    // Haptic feedback
    try {
      telegramApp?.HapticFeedback?.impactOccurred('medium');
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
    
    setTimeout(() => {
      setIsRevealed(true);
      setIsFlipping(false);
    }, 400);
  }, [isFlipping, isRevealed, telegramApp]);

  // Добавление в избранное
  const handleAddToFavorites = useCallback(() => {
    if (!cardData || !onAddToFavorites) return;
    
    const favoriteItem = {
      type: 'day_card',
      title: `Карта дня: ${cardData.name}`,
      content: cardData.personalizedMeaning || cardData.meaning,
      date: cardData.date,
      advice: cardData.personalizedAdvice || cardData.advice,
      cardData: cardData
    };
    
    onAddToFavorites(favoriteItem);
    
    // Haptic feedback
    try {
      telegramApp?.HapticFeedback?.notificationOccurred('success');
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
  }, [cardData, onAddToFavorites, telegramApp]);

  // Эффект для первоначальной загрузки
  useEffect(() => {
    console.log('🃏 DayCardView: Компонент смонтирован');
    loadDayCard();
  }, [loadDayCard]);

  // Рендер состояний
  if (loading || shuffling) {
    return (
      <div style={styles.container}>
        <div style={styles.headerCard}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>
            🃏 Карта дня
          </h1>
          <p style={{ margin: 0, opacity: 0.9 }}>
            {shuffling ? 'Тасуем колоду...' : 'Подготовка карт...'}
          </p>
        </div>

        <div style={styles.loadingContainer}>
          <div style={{ 
            fontSize: '80px', 
            marginBottom: '20px',
            animation: 'cardSpin 2s linear infinite'
          }}>
            🃏
          </div>
          <h3 style={{ marginBottom: '8px', color: theme.colors.text }}>
            {shuffling ? 'Гномы выбирают карту...' : 'Загружаем колоду...'}
          </h3>
          <p style={{ color: theme.colors.textSecondary }}>
            Концентрируйтесь на своем вопросе
          </p>
        </div>
        
        <style>{`
          @keyframes cardSpin {
            from { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.1); }
            to { transform: rotate(360deg) scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Card variant="error">
          <div style={styles.errorContainer}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>❌</div>
            <h3 style={{ color: theme.colors.error, marginBottom: '8px' }}>
              Ошибка загрузки
            </h3>
            <p style={{ marginBottom: '20px', textAlign: 'center', color: theme.colors.textSecondary }}>
              {error}
            </p>
            <Button onClick={loadDayCard}>
              🔄 Попробовать снова
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div style={styles.container}>
        <Card>
          <div style={styles.loadingContainer}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🃏</div>
            <h3>Подготовка карт...</h3>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* CSS анимации */}
      <style>{`
        @keyframes cardGlow {
          0%, 100% { filter: drop-shadow(0 0 20px ${cardData.colors[0]}80); }
          50% { filter: drop-shadow(0 0 30px ${cardData.colors[0]}FF) brightness(1.2); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Заголовок */}
      <div style={styles.headerCard}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700' }}>
          🃏 Карта дня
        </h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          📅 {cardData.date}
        </p>
      </div>

      {/* Анимированная карта */}
      <AnimatedCard
        card={cardData}
        isRevealed={isRevealed}
        isFlipping={isFlipping}
        theme={theme}
        designTheme={designTheme}
        onReveal={revealCard}
      />

      {/* Детали карты (показываются после раскрытия) */}
      {isRevealed && (
        <div style={{
          ...styles.detailsCard,
          animation: 'slideUp 0.6s ease-out'
        }}>
          {/* Значение */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: cardData.colors[0],
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🔍 Значение карты
            </h4>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              margin: 0,
              color: theme.colors.text
            }}>
              {cardData.personalizedMeaning}
            </p>
          </div>

          {/* Совет */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: cardData.colors[1] || cardData.colors[0],
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              💡 Совет на день
            </h4>
            <p style={{ 
              fontSize: '14px', 
              lineHeight: '1.6',
              margin: 0,
              color: theme.colors.text
            }}>
              {cardData.personalizedAdvice}
            </p>
          </div>

          {/* Ключевые слова */}
          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '700', 
              marginBottom: '8px',
              color: theme.colors.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🏷️ Ключевые понятия
            </h4>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              {cardData.keywords.map((keyword, index) => (
                <span
                  key={index}
                  style={{
                    background: `${cardData.colors[0]}20`,
                    color: cardData.colors[0],
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Мудрость гномов */}
          {cardData.gnomeWisdom && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 195, 74, 0.2), rgba(139, 195, 74, 0.1))',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid rgba(139, 195, 74, 0.3)'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '700', 
                marginBottom: '8px',
                color: '#2E7D0F',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                🧙‍♂️ Мудрость гномов
              </h4>
              <p style={{ 
                fontSize: '14px', 
                lineHeight: '1.5',
                margin: 0,
                fontStyle: 'italic',
                color: theme.colors.textSecondary
              }}>
                {cardData.gnomeWisdom}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Кнопки действий */}
      {isRevealed && (
        <div style={styles.buttonsContainer}>
          <Button 
            variant="primary"
            onClick={loadDayCard}
          >
            🔄 Новая карта
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleAddToFavorites}
          >
            ⭐ В избранное
          </Button>
        </div>
      )}
    </div>
  );
});

DayCardView.displayName = 'DayCardView';

export default DayCardView;
