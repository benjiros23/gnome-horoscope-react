// src/components/DayCardView.js - Улучшенные анимации и PNG обложка
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAstrologyData } from '../hooks/useAstrologyData';
import Card from './UI/Card';
import Button from './UI/Button';
import telegramBot from '../services/telegramBot'; // 🤖 TELEGRAM BOT INTEGRATION


const DayCardView = ({ onBack, onAddToFavorites, selectedSign = null }) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isSharing, setIsSharing] = useState(false); // 📲 Состояние шеринга

  // Mock данные для карт таро
  const mockTarotCards = [
    {
      id: 1,
      name: 'Маг',
      emoji: '🧙‍♂️',
      element: 'Воздух',
      meaning: 'Сегодня у вас есть все необходимые инструменты для достижения цели. Время действовать!',
      advice: 'Сосредоточьтесь на своих навыках и используйте их мудро. Доверьтесь своей интуиции.',
      gnomeWisdom: 'Гном-мудрец говорит: "Магия в ваших руках, но помните - с великой силой приходит великая ответственность."',
      keywords: ['Сила воли', 'Творчество', 'Навыки', 'Концентрация'],
      colors: ['#667eea', '#764ba2']
    },
    {
      id: 2,
      name: 'Верховная Жрица',
      emoji: '🔮',
      element: 'Вода',
      meaning: 'День интуиции и глубоких откровений. Слушайте свое внутреннее "я".',
      advice: 'Медитируйте и обращайтесь к своей мудрости. Ответы уже внутри вас.',
      gnomeWisdom: 'Гном-провидец шепчет: "Тишина говорит громче слов. В покое найдете истину."',
      keywords: ['Интуиция', 'Мудрость', 'Тайны', 'Подсознание'],
      colors: ['#4ecdc4', '#44a08d']
    },
    {
      id: 3,
      name: 'Солнце',
      emoji: '☀️',
      element: 'Огонь',
      meaning: 'День радости, успеха и позитивной энергии! Все складывается благоприятно.',
      advice: 'Наслаждайтесь моментом и делитесь своим светом с окружающими.',
      gnomeWisdom: 'Солнечный гном улыбается: "Ваш свет озаряет не только ваш путь, но и путь других!"',
      keywords: ['Радость', 'Успех', 'Энергия', 'Оптимизм'],
      colors: ['#ff6b6b', '#ff8e53']
    },
    {
      id: 4,
      name: 'Луна',
      emoji: '🌙',
      element: 'Вода',
      meaning: 'День загадок и скрытых возможностей. Не все является тем, чем кажется.',
      advice: 'Будьте внимательны к знакам и символам. Доверяйте интуиции больше, чем логике.',
      gnomeWisdom: 'Лунный гном шепчет: "В тенях скрываются как страхи, так и сокровища. Выбирайте мудро."',
      keywords: ['Иллюзии', 'Интуиция', 'Тайны', 'Подсознание'],
      colors: ['#a8e6cf', '#7fcdcd']
    },
    {
      id: 5,
      name: 'Звезда',
      emoji: '⭐',
      element: 'Воздух',
      meaning: 'День надежды и вдохновения. Ваши мечты ближе, чем кажется.',
      advice: 'Следуйте за своей звездой и не сдавайтесь. Помощь придет неожиданно.',
      gnomeWisdom: 'Звездный гном говорит: "Каждый гном имеет свою путеводную звезду. Найдите свою!"',
      keywords: ['Надежда', 'Вдохновение', 'Мечты', 'Руководство'],
      colors: ['#ffb6c1', '#ffa07a']
    }
  ];

  // Получение случайной карты дня
  const getTodayCard = () => {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31 + today.getFullYear();
    const cardIndex = seed % mockTarotCards.length;
    return {
      card: mockTarotCards[cardIndex],
      date: today.toLocaleDateString('ru-RU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
  };

  // Стили компонента
  const dayCardStyles = {
    container: {
      padding: theme.spacing.lg,
      maxWidth: '500px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 120px)',
      position: 'relative'
    },

    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      opacity: showCard ? 1 : 0,
      transform: showCard ? 'translateY(0)' : 'translateY(-20px)',
      transition: 'all 0.8s ease'
    },

    title: {
      ...styles.heading,
      fontSize: theme.typography.sizes.title,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },

    subtitle: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      margin: 0
    },

    cardContainer: {
      perspective: '1000px',
      marginBottom: theme.spacing.xl,
      opacity: showCard ? 1 : 0,
      transform: showCard ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
      transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transitionDelay: '0.3s'
    },

    cardWrapper: {
      position: 'relative',
      width: '100%',
      height: '400px',
      transformStyle: 'preserve-3d',
      transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)',
      transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: !isRevealed ? 'pointer' : 'default',
      filter: isFlipping ? 'brightness(1.2)' : 'brightness(1)',
      boxShadow: isRevealed 
        ? `0 20px 60px rgba(244, 197, 66, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)`
        : '0 10px 30px rgba(0, 0, 0, 0.3)'
    },

    cardFace: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    // ✅ ОБНОВЛЕННАЯ ОБРАТНАЯ СТОРОНА С PNG
    cardBack: {
      background: createGradientStyle(['#1a1a2e', '#2d2d44'], '135deg').background,
      border: `3px solid ${theme.colors.primary}`,
      boxShadow: `0 15px 40px ${theme.colors.primary}30, inset 0 2px 4px rgba(255,255,255,0.1)`,
      position: 'relative',
      overflow: 'hidden'
    },

    // ✅ PNG ОБЛОЖКА ВМЕСТО УЗОРА
    cardBackImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: theme.borderRadius.lg,
      opacity: 0.7,
      transition: 'all 0.5s ease'
    },

    cardBackOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(135deg, 
        ${theme.colors.primary}20 0%, 
        transparent 50%, 
        ${theme.colors.secondary}20 100%)`,
      mixBlendMode: 'overlay'
    },

    cardBackContent: {
      position: 'relative',
      zIndex: 3,
      textAlign: 'center',
      color: '#ffffff',
      padding: theme.spacing.xl
    },

    cardBackIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.md,
      filter: 'drop-shadow(0 6px 12px rgba(244, 197, 66, 0.5))',
      animation: 'pulseGlow 2s ease-in-out infinite'
    },

    cardFront: {
      transform: 'rotateY(180deg)',
      padding: 0,
      overflow: 'hidden',
      background: 'transparent'
    },

    cardFrontContent: {
      height: '100%',
      position: 'relative',
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden'
    },

    cardGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1
    },

    cardOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.3)',
      zIndex: 2
    },

    cardContent: {
      position: 'relative',
      zIndex: 3,
      height: '100%',
      padding: theme.spacing.xl,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: '#ffffff'
    },

    cardEmoji: {
      fontSize: '4.5rem',
      marginBottom: theme.spacing.lg,
      filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
      animation: isRevealed ? 'cardSparkle 3s ease-in-out infinite' : 'none',
      transform: isRevealed ? 'scale(1)' : 'scale(0.8)',
      transition: 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },

    cardName: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.md,
      textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
      transform: isRevealed ? 'translateY(0)' : 'translateY(10px)',
      opacity: isRevealed ? 1 : 0,
      transition: 'all 0.6s ease 0.3s'
    },

    cardElement: {
      fontSize: theme.typography.sizes.sm,
      opacity: isRevealed ? 0.9 : 0,
      marginBottom: theme.spacing.lg,
      textShadow: '1px 1px 4px rgba(0,0,0,0.7)',
      transition: 'opacity 0.6s ease 0.5s'
    },

    // ✅ АНИМИРОВАННОЕ ПОЯВЛЕНИЕ ДЕТАЛЕЙ
    detailsContainer: {
      display: 'grid',
      gap: theme.spacing.lg,
      opacity: showDetails ? 1 : 0,
      transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      transitionDelay: '0.2s'
    },

    sectionTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    sectionText: {
      fontSize: theme.typography.sizes.sm,
      lineHeight: 1.6,
      color: theme.colors.text,
      margin: 0
    },

    keywordsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.md
    },

    keyword: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      backgroundColor: `${theme.colors.primary}20`,
      color: theme.colors.primary,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      border: `1px solid ${theme.colors.primary}40`,
      opacity: showDetails ? 1 : 0,
      transform: showDetails ? 'scale(1)' : 'scale(0.9)',
      transition: 'all 0.4s ease',
      transitionDelay: `${Math.random() * 0.5}s`
    },

    actionsContainer: {
      display: 'flex',
      gap: theme.spacing.md,
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
      opacity: showDetails ? 1 : 0,
      transform: showDetails ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.6s ease',
      transitionDelay: '0.5s'
    },

    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xxl,
      textAlign: 'center'
    },

    loadingIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.lg,
      animation: 'magicPulse 2s infinite'
    }
  };

  // ✅ УЛУЧШЕННЫЕ CSS АНИМАЦИИ
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('day-card-animations');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'day-card-animations';
        style.textContent = `
          @keyframes magicPulse {
            0%, 100% { 
              opacity: 0.6; 
              transform: scale(1) rotate(0deg); 
            }
            50% { 
              opacity: 1; 
              transform: scale(1.15) rotate(5deg); 
            }
          }
          
          @keyframes pulseGlow {
            0%, 100% { 
              filter: drop-shadow(0 6px 12px rgba(244, 197, 66, 0.5));
              transform: scale(1);
            }
            50% { 
              filter: drop-shadow(0 10px 20px rgba(244, 197, 66, 0.8));
              transform: scale(1.05);
            }
          }
          
          @keyframes cardSparkle {
            0%, 100% { 
              filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4));
            }
            25% { 
              filter: drop-shadow(0 8px 16px rgba(244, 197, 66, 0.6));
            }
            50% { 
              filter: drop-shadow(0 10px 20px rgba(255, 255, 255, 0.4));
            }
            75% { 
              filter: drop-shadow(0 8px 16px rgba(108, 92, 231, 0.6));
            }
          }
          
          @keyframes slideInUp {
            0% { 
              opacity: 0; 
              transform: translateY(30px) scale(0.95); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }

          @keyframes fadeInScale {
            0% { 
              opacity: 0; 
              transform: scale(0.8) rotate(-5deg); 
            }
            100% { 
              opacity: 1; 
              transform: scale(1) rotate(0deg); 
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // ✅ ПОЭТАПНАЯ ЗАГРУЗКА С АНИМАЦИЕЙ
  useEffect(() => {
    const loadDayCard = async () => {
      setLoading(true);
      setError(null);
      setIsRevealed(false);
      setCardData(null);
      setShowCard(false);
      setShowDetails(false);
      
      try {
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const todayCard = getTodayCard();
        setCardData(todayCard);
        
        // Поэтапное появление элементов
        setTimeout(() => setShowCard(true), 300);
        setTimeout(() => revealCard(), 1500);
        
      } catch (fetchError) {
        console.error('Ошибка загрузки карты дня:', fetchError);
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    };

    loadDayCard();
  }, []);

  // ✅ УЛУЧШЕННАЯ АНИМАЦИЯ РАСКРЫТИЯ
  const revealCard = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    // Haptic feedback в начале
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
    
    setTimeout(() => {
      setIsRevealed(true);
      setIsFlipping(false);
      
      // Показываем детали с задержкой
      setTimeout(() => setShowDetails(true), 600);
      
      // Haptic feedback при завершении
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
      }
    }, 1000);
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = () => {
    if (cardData && onAddToFavorites) {
      const favoriteItem = {
        type: 'day-card',
        id: `day-card-${new Date().toDateString()}`,
        title: `Карта дня: ${cardData.card.name}`,
        content: cardData.card.meaning,
        date: cardData.date,
        advice: cardData.card.advice,
        cardName: cardData.card.name,
        cardEmoji: cardData.card.emoji
      };
      
      onAddToFavorites(favoriteItem);
      
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Карта "${cardData.card.name}" добавлена в избранное! ⭐`);
      }
    }
  };

  // 📲 Обработчик отправки в Telegram
  const handleShareToTelegram = async () => {
    if (!cardData || isSharing) return;
    
    setIsSharing(true);
    
    try {
      const cardForShare = {
        title: cardData.card.name,
        text: cardData.card.meaning,
        date: cardData.date
      };
      
      const success = await telegramBot.shareDayCardToTelegram(cardForShare);
      
      if (success) {
        console.log('✅ Карта дня отправлена в Telegram');
      } else {
        console.warn('⚠️ Ошибка отправки в Telegram');
      }
    } catch (error) {
      console.error('❌ Ошибка отправки в Telegram:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Загрузка новой карты
  const handleNewCard = () => {
    setCardData(null);
    setIsRevealed(false);
    setIsFlipping(false);
    setShowCard(false);
    setShowDetails(false);
    
    setTimeout(() => {
      const newCard = getTodayCard();
      setCardData(newCard);
      setTimeout(() => setShowCard(true), 200);
      setTimeout(revealCard, 1200);
    }, 500);
  };

  if (loading) {
    return (
      <div style={dayCardStyles.container}>
        
        
        <div style={dayCardStyles.loadingContainer}>
          <div style={dayCardStyles.loadingIcon}>🃏</div>
          <h3 style={{ 
            color: theme.colors.primary, 
            marginBottom: theme.spacing.sm,
            animation: 'fadeInScale 0.8s ease-out'
          }}>
            Гномы выбирают для вас особенную карту
          </h3>
          <p style={{ 
            color: theme.colors.textSecondary,
            animation: 'fadeInScale 0.8s ease-out 0.3s',
            animationFillMode: 'both'
          }}>
            🔮 Настраиваем магические энергии...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={dayCardStyles.container}>
        
        
        <div style={dayCardStyles.loadingContainer}>
          <div style={{ fontSize: '4rem', marginBottom: theme.spacing.lg }}>😔</div>
          <h3 style={{ color: theme.colors.danger, marginBottom: theme.spacing.sm }}>
            Ошибка получения карты
          </h3>
          <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
            {error}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            🔄 Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div style={dayCardStyles.container}>
        
        <div style={dayCardStyles.loadingContainer}>
          <div style={dayCardStyles.loadingIcon}>🃏</div>
          <p style={{ color: theme.colors.textSecondary }}>Подготавливаем карту...</p>
        </div>
      </div>
    );
  }

  const cardGradient = createGradientStyle(cardData.card.colors, '135deg');

  return (
    <div style={dayCardStyles.container}>
      
      
      {/* ✅ АНИМИРОВАННЫЙ ЗАГОЛОВОК */}
      <div style={dayCardStyles.header}>
        <h1 style={dayCardStyles.title}>🃏 Карта дня</h1>
        <p style={dayCardStyles.subtitle}>
          {cardData.date}
        </p>
      </div>

      {/* ✅ УЛУЧШЕННАЯ КАРТА С PNG ОБЛОЖКОЙ */}
      <div style={dayCardStyles.cardContainer}>
        <div 
          style={dayCardStyles.cardWrapper}
          onClick={!isRevealed ? revealCard : undefined}
        >
          {/* ✅ ОБРАТНАЯ СТОРОНА С PNG */}
          <div style={{ ...dayCardStyles.cardFace, ...dayCardStyles.cardBack }}>
            {/* PNG обложка - замените на ваш путь */}
            <img
              src={`${process.env.PUBLIC_URL || ''}/assets/tarot-card-back.png`}
              alt="Обложка карты дня"
              style={dayCardStyles.cardBackImage}
              onError={(e) => {
                // Fallback если PNG не найден
                e.target.style.display = 'none';
              }}
            />
            <div style={dayCardStyles.cardBackOverlay} />
            
            <div style={dayCardStyles.cardBackContent}>
              <h3 style={{ 
                fontSize: theme.typography.sizes.lg,
                marginBottom: theme.spacing.sm,
                textShadow: '2px 2px 6px rgba(0,0,0,0.8)'
              }}>
                
              </h3>
              <p style={{ 
                fontSize: theme.typography.sizes.sm,
                opacity: 0.9,
                textShadow: '1px 1px 4px rgba(0,0,0,0.8)'
              }}>
                {!isRevealed ? 'Нажмите, чтобы открыть' : ''}
              </p>
            </div>
          </div>

          {/* Лицевая сторона карты */}
          <div style={{ ...dayCardStyles.cardFace, ...dayCardStyles.cardFront }}>
            <div style={dayCardStyles.cardFrontContent}>
              <div style={{ ...dayCardStyles.cardGradient, ...cardGradient }} />
              <div style={dayCardStyles.cardOverlay} />
              
              <div style={dayCardStyles.cardContent}>
                <div style={dayCardStyles.cardEmoji}>
                  {cardData.card.emoji}
                </div>
                <h2 style={dayCardStyles.cardName}>
                  {cardData.card.name}
                </h2>
                <p style={dayCardStyles.cardElement}>
                  Стихия: {cardData.card.element}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ АНИМИРОВАННЫЕ ДЕТАЛИ */}
      {isRevealed && (
        <div style={dayCardStyles.detailsContainer}>
          <Card padding="lg">
            <h3 style={dayCardStyles.sectionTitle}>
              <span>Значение</span>
            </h3>
            <p style={dayCardStyles.sectionText}>
              {cardData.card.meaning}
            </p>
          </Card>

          <Card 
            padding="lg"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.primary}15, ${theme.colors.secondary}15)`,
              border: `1px solid ${theme.colors.primary}30`
            }}
          >
            <h3 style={dayCardStyles.sectionTitle}>
              <span>💡</span>
              <span>Совет дня</span>
            </h3>
            <p style={dayCardStyles.sectionText}>
              {cardData.card.advice}
            </p>
          </Card>

          <Card 
            padding="lg"
            style={{
              background: `linear-gradient(135deg, ${theme.colors.secondary}15, ${theme.colors.primary}15)`,
              border: `1px solid ${theme.colors.secondary}30`
            }}
          >
            <h3 style={dayCardStyles.sectionTitle}>
              <span>🧙‍♂️</span>
              <span>Мудрость гнома</span>
            </h3>
            <p style={{
              ...dayCardStyles.sectionText,
              fontStyle: 'italic'
            }}>
              {cardData.card.gnomeWisdom}
            </p>
          </Card>

          <Card padding="lg">
            <h3 style={dayCardStyles.sectionTitle}>
              <span>🏷️</span>
              <span>Ключевые понятия</span>
            </h3>
            <div style={dayCardStyles.keywordsContainer}>
              {cardData.card.keywords.map((keyword, index) => (
                <span key={index} style={dayCardStyles.keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ✅ АНИМИРОВАННЫЕ КНОПКИ ДЕЙСТВИЙ */}
      {isRevealed && (
        <div style={dayCardStyles.actionsContainer}>
          <Button 
            variant="primary" 
            onClick={handleAddToFavorites}
            icon="⭐"
          >
            В избранное
          </Button>
          
          {/* 📲 КНОПКА ОТПРАВКИ В TELEGRAM */}
          <Button 
            variant="outline" 
            onClick={handleShareToTelegram}
            disabled={isSharing}
            icon={isSharing ? "🔄" : "📲"}
            style={{
              borderColor: '#0088cc',
              color: '#0088cc',
              background: isSharing ? 'rgba(0, 136, 204, 0.1)' : 'transparent'
            }}
          >
            {isSharing ? 'Отправляем...' : 'Отправить в Telegram'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleNewCard}
            icon="🔄"
          >
            Новая карта
          </Button>
        </div>
      )}
    </div>
  );
};

export default DayCardView;
