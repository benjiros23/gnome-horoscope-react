// src/components/GnomeCard.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const GnomeCard = ({ 
  gnome, 
  zodiacSign,
  size = 'medium', // small, medium, large, full
  interactive = true,
  showDetails = true,
  showActions = true,
  onSelect,
  onFavorite,
  isFavorite = false,
  className = '',
  style = {}
}) => {
  const { theme, styles, getGradientForElement, createGradientStyle } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Предзагрузка изображения
  useEffect(() => {
    if (gnome?.image) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageError(true);
      img.src = `${process.env.PUBLIC_URL || ''}${gnome.image}`;
    }
  }, [gnome?.image]);

  // Размеры карточек
  const cardSizes = {
    small: {
      width: '200px',
      height: '260px',
      imageSize: '80px',
      titleSize: theme.typography.sizes.md,
      subtitleSize: theme.typography.sizes.sm,
      padding: theme.spacing.md
    },
    medium: {
      width: '280px',
      height: '360px',
      imageSize: '120px',
      titleSize: theme.typography.sizes.lg,
      subtitleSize: theme.typography.sizes.md,
      padding: theme.spacing.lg
    },
    large: {
      width: '340px',
      height: '440px',
      imageSize: '160px',
      titleSize: theme.typography.sizes.xl,
      subtitleSize: theme.typography.sizes.lg,
      padding: theme.spacing.xl
    },
    full: {
      width: '100%',
      height: 'auto',
      minHeight: '300px',
      imageSize: '200px',
      titleSize: theme.typography.sizes.xxl,
      subtitleSize: theme.typography.sizes.xl,
      padding: theme.spacing.xl
    }
  };

  const currentSize = cardSizes[size];

  // Стили компонента
  const cardStyles = {
    container: {
      position: 'relative',
      width: currentSize.width,
      height: size === 'full' ? currentSize.height : currentSize.height,
      minHeight: size === 'full' ? currentSize.minHeight : undefined,
      borderRadius: theme.borderRadius.lg,
      overflow: 'hidden',
      cursor: interactive ? 'pointer' : 'default',
      transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
      border: `2px solid ${isFavorite ? theme.colors.primary : 'transparent'}`,
      boxShadow: isHovered && interactive ? theme.shadows.lg : theme.shadows.md,
      transform: 'translateY(0) scale(1)', // Убрали transform эффекты
      ...style
    },

    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1
    },

    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isHovered ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.3)',
      transition: `background ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
      zIndex: 2
    },

    content: {
      position: 'relative',
      zIndex: 3,
      height: '100%',
      padding: currentSize.padding,
      display: 'flex',
      flexDirection: size === 'full' ? 'row' : 'column',
      alignItems: size === 'full' ? 'center' : 'center',
      justifyContent: size === 'full' ? 'flex-start' : 'space-between',
      gap: size === 'full' ? theme.spacing.xl : theme.spacing.md
    },

    imageContainer: {
      position: 'relative',
      flexShrink: 0,
      order: size === 'full' ? 1 : 0
    },

    image: {
      width: currentSize.imageSize,
      height: currentSize.imageSize,
      borderRadius: theme.borderRadius.circle,
      border: `4px solid rgba(255, 255, 255, 0.9)`,
      objectFit: 'cover',
      transition: `all ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
      filter: imageLoaded ? 
        'none' :  // Убрали тени и эффекты
        'grayscale(100%)',
      opacity: imageLoaded ? 1 : 0.6,
      transform: 'scale(1)' // Убрали hover transform
    },

    imagePlaceholder: {
      width: currentSize.imageSize,
      height: currentSize.imageSize,
      borderRadius: theme.borderRadius.circle,
      border: `4px solid rgba(255, 255, 255, 0.5)`,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size === 'small' ? '2rem' : size === 'medium' ? '3rem' : '4rem',
      color: 'rgba(255, 255, 255, 0.7)'
    },

    favoriteButton: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      width: '32px',
      height: '32px',
      borderRadius: theme.borderRadius.circle,
      backgroundColor: isFavorite ? theme.colors.primary : 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: `all ${theme.animations.duration.fast} ${theme.animations.easing.default}`,
      fontSize: '16px',
      color: isFavorite ? theme.colors.background : '#ffffff',
      backdropFilter: 'blur(10px)',
      zIndex: 4
    },

    infoContainer: {
      flex: 1,
      textAlign: size === 'full' ? 'left' : 'center',
      order: size === 'full' ? 0 : 1,
      width: size === 'full' ? 'auto' : '100%'
    },

    zodiacBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      color: '#ffffff',
      marginBottom: theme.spacing.sm,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    },

    name: {
      fontSize: currentSize.titleSize,
      fontWeight: theme.typography.weights.bold,
      color: '#ffffff',
      margin: 0,
      marginBottom: theme.spacing.xs,
      textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
      lineHeight: 1.2
    },

    title: {
      fontSize: currentSize.subtitleSize,
      fontWeight: theme.typography.weights.medium,
      color: 'rgba(255,255,255,0.9)',
      margin: 0,
      marginBottom: theme.spacing.sm,
      textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      fontStyle: 'italic'
    },

    description: {
      fontSize: theme.typography.sizes.sm,
      color: 'rgba(255,255,255,0.8)',
      lineHeight: 1.4,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
      display: showDetails ? 'block' : 'none',
      maxHeight: showFullDescription ? 'none' : '3em',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },

    expandButton: {
      background: 'none',
      border: 'none',
      color: 'rgba(255,255,255,0.8)',
      fontSize: theme.typography.sizes.xs,
      cursor: 'pointer',
      marginTop: theme.spacing.xs,
      textDecoration: 'underline',
      padding: 0
    },

    actionsContainer: {
      display: showActions && size !== 'small' ? 'flex' : 'none',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
      justifyContent: size === 'full' ? 'flex-start' : 'center'
    },

    actionButton: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.sm,
      border: '1px solid rgba(255, 255, 255, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: '#ffffff',
      fontSize: theme.typography.sizes.xs,
      cursor: 'pointer',
      transition: `all ${theme.animations.duration.fast} ${theme.animations.easing.default}`,
      backdropFilter: 'blur(10px)'
    },

    elementBadge: {
      position: 'absolute',
      bottom: theme.spacing.sm,
      right: theme.spacing.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.medium,
      color: '#ffffff',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      zIndex: 4
    },

    glowEffect: {
      position: 'absolute',
      top: '-4px',
      left: '-4px',
      right: '-4px',
      bottom: '-4px',
      borderRadius: theme.borderRadius.lg,
      opacity: isHovered && interactive ? 0.6 : 0,
      transition: `opacity ${theme.animations.duration.normal} ${theme.animations.easing.default}`,
      zIndex: 0,
      filter: 'blur(8px)'
    },

    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: theme.borderRadius.sm,
      backdropFilter: 'blur(10px)'
    },

    statItem: {
      textAlign: 'center'
    },

    statLabel: {
      fontSize: theme.typography.sizes.xs,
      color: 'rgba(255,255,255,0.7)',
      marginBottom: theme.spacing.xs
    },

    statValue: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: '#ffffff'
    }
  };

  // Обработчики событий
  const handleClick = () => {
    if (interactive && onSelect) {
      onSelect({ gnome, zodiacSign });
    }

    // Haptic feedback для Telegram
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onFavorite) {
      onFavorite({ gnome, zodiacSign }, !isFavorite);
    }

    // Haptic feedback для Telegram
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  };

  const handleMouseEnter = () => {
    if (interactive) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Получение градиента для фона
  const backgroundGradient = zodiacSign ? 
    createGradientStyle(getGradientForElement(zodiacSign.element), '135deg') :
    createGradientStyle(gnome?.colors || [theme.colors.primary, theme.colors.secondary], '135deg');

  // Проверка наличия необходимых данных
  if (!gnome) {
    return (
      <div style={{ ...cardStyles.container, backgroundColor: theme.colors.surface }}>
        <div style={{ ...cardStyles.content, justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: theme.colors.textSecondary }}>
            <div style={{ fontSize: '2rem', marginBottom: theme.spacing.sm }}>🧙‍♂️</div>
            <div>Гном не найден</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={className}
      style={cardStyles.container}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Фоновый градиент */}
      <div style={{ ...cardStyles.background, ...backgroundGradient }} />

      {/* Эффект свечения */}
      <div
        style={{
          ...cardStyles.glowEffect,
          background: `linear-gradient(135deg, ${gnome.colors?.[0] || theme.colors.primary}aa, ${gnome.colors?.[1] || theme.colors.secondary}aa)`
        }}
      />

      {/* Затемняющий оверлей */}
      <div style={cardStyles.overlay} />

      {/* Основной контент */}
      <div style={cardStyles.content}>
        
        {/* Контейнер изображения */}
        <div style={cardStyles.imageContainer}>
          {imageLoaded && !imageError ? (
            <img
              src={`${process.env.PUBLIC_URL || ''}${gnome.image}`}
              alt={gnome.name}
              style={cardStyles.image}
            />
          ) : (
            <div style={cardStyles.imagePlaceholder}>
              🧙‍♂️
            </div>
          )}

          {/* Кнопка избранного */}
          {showActions && (
            <button
              style={cardStyles.favoriteButton}
              onClick={handleFavoriteClick}
              onMouseEnter={(e) => {
                // Убрали transform эффекты по запросу
              }}
              onMouseLeave={(e) => {
                // Убрали transform эффекты по запросу
              }}
              title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
            >
              {isFavorite ? '⭐' : '☆'}
            </button>
          )}
        </div>

        {/* Информационный контейнер */}
        <div style={cardStyles.infoContainer}>
          
          {/* Бейдж знака зодиака */}
          {zodiacSign && (
            <div style={cardStyles.zodiacBadge}>
              <span>{zodiacSign.emoji}</span>
              <span>{zodiacSign.sign}</span>
            </div>
          )}

          {/* Имя гнома */}
          <h3 style={cardStyles.name}>{gnome.name}</h3>

          {/* Титул */}
          <p style={cardStyles.title}>{gnome.title}</p>

          {/* Описание */}
          {showDetails && gnome.description && (
            <div>
              <p style={cardStyles.description}>
                {gnome.description}
              </p>
              
              {gnome.description.length > 100 && size !== 'small' && (
                <button
                  style={cardStyles.expandButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullDescription(!showFullDescription);
                  }}
                >
                  {showFullDescription ? 'Свернуть' : 'Подробнее...'}
                </button>
              )}
            </div>
          )}

          {/* Статистики (для больших карточек) */}
          {size === 'large' || size === 'full' ? (
            <div style={cardStyles.stats}>
              <div style={cardStyles.statItem}>
                <div style={cardStyles.statLabel}>Мудрость</div>
                <div style={cardStyles.statValue}>★★★★☆</div>
              </div>
              <div style={cardStyles.statItem}>
                <div style={cardStyles.statLabel}>Магия</div>
                <div style={cardStyles.statValue}>★★★★★</div>
              </div>
              <div style={cardStyles.statItem}>
                <div style={cardStyles.statLabel}>Опыт</div>
                <div style={cardStyles.statValue}>★★★★☆</div>
              </div>
              <div style={cardStyles.statItem}>
                <div style={cardStyles.statLabel}>Дружба</div>
                <div style={cardStyles.statValue}>★★★★★</div>
              </div>
            </div>
          ) : null}

          {/* Действия */}
          <div style={cardStyles.actionsContainer}>
            <button
              style={cardStyles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              🔮 Выбрать
            </button>
            
            <button
              style={cardStyles.actionButton}
              onClick={(e) => {
                e.stopPropagation();
                // Можно добавить функционал просмотра деталей
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              👁️ Детали
            </button>
          </div>
        </div>
      </div>

      {/* Бейдж элемента */}
      {zodiacSign && (
        <div style={cardStyles.elementBadge}>
          {zodiacSign.element}
        </div>
      )}
    </div>
  );
};

export default GnomeCard;
