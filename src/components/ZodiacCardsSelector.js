import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// ИМПОРТЫ КАРТИНОК
import ovenImg from '../assets/zodiac/овен.png';
import teletsImg from '../assets/zodiac/телец.png';
import bliznestyImg from '../assets/zodiac/близнецы.png';
import rakImg from '../assets/zodiac/рак.png';
import levImg from '../assets/zodiac/лев.png';
import devaImg from '../assets/zodiac/дева.png';
import vesyImg from '../assets/zodiac/весы.png';
import skorpionImg from '../assets/zodiac/скорпион.png';
import strelecImg from '../assets/zodiac/стрелец.png';
import kozerogImg from '../assets/zodiac/козерог.png';
import vodoleyImg from '../assets/zodiac/водолей.png';
import rybyImg from '../assets/zodiac/рыбы.png';

// ===== КОНСТАНТЫ И УТИЛИТЫ =====
const SIGNS = [
  { sign: 'Овен', emoji: '♈', img: ovenImg, dates: '21.03-20.04' },
  { sign: 'Телец', emoji: '♉', img: teletsImg, dates: '21.04-20.05' },
  { sign: 'Близнецы', emoji: '♊', img: bliznestyImg, dates: '21.05-21.06' },
  { sign: 'Рак', emoji: '♋', img: rakImg, dates: '22.06-22.07' },
  { sign: 'Лев', emoji: '♌', img: levImg, dates: '23.07-22.08' },
  { sign: 'Дева', emoji: '♍', img: devaImg, dates: '23.08-22.09' },
  { sign: 'Весы', emoji: '♎', img: vesyImg, dates: '23.09-22.10' },
  { sign: 'Скорпион', emoji: '♏', img: skorpionImg, dates: '23.10-22.11' },
  { sign: 'Стрелец', emoji: '♐', img: strelecImg, dates: '23.11-21.12' },
  { sign: 'Козерог', emoji: '♑', img: kozerogImg, dates: '22.12-20.01' },
  { sign: 'Водолей', emoji: '♒', img: vodoleyImg, dates: '21.01-19.02' },
  { sign: 'Рыбы', emoji: '♓', img: rybyImg, dates: '20.02-20.03' }
];

const clampIndex = (i) => (i + SIGNS.length) % SIGNS.length;

// ===== КАСТОМНЫЕ ХУКИ (ОПТИМИЗИРОВАННЫЕ) =====

// Хук для преобразования вертикального скролла в горизонтальный
const useSmoothWheelToHorizontal = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e) => {
      // Только если вертикальное движение больше горизонтального
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [ref]);
};

// Хук для тач и мышь скролла
const useTouchScroll = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onStart = (e) => {
      isDown = true;
      startX = (e.pageX || e.touches?.[0]?.pageX || 0) - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
      el.style.userSelect = 'none';
    };

    const onEnd = () => {
      isDown = false;
      el.style.cursor = 'grab';
      el.style.userSelect = 'auto';
    };

    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches?.[0]?.pageX || 0) - el.offsetLeft;
      const walk = (x - startX) * 2; // Множитель для чувствительности
      el.scrollLeft = scrollLeft - walk;
    };

    // Мышь события
    el.addEventListener('mousedown', onStart);
    el.addEventListener('mouseleave', onEnd);
    el.addEventListener('mouseup', onEnd);
    el.addEventListener('mousemove', onMove);

    // Тач события
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd);
    el.addEventListener('touchmove', onMove, { passive: false });

    return () => {
      el.removeEventListener('mousedown', onStart);
      el.removeEventListener('mouseleave', onEnd);
      el.removeEventListener('mouseup', onEnd);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchmove', onMove);
    };
  }, [ref]);
};

// Хук для обработки ошибок загрузки изображений
const useImageError = () => {
  const [errors, setErrors] = useState(new Set());

  const handleImageError = useCallback((imageSrc) => {
    setErrors(prev => new Set([...prev, imageSrc]));
  }, []);

  const isImageError = useCallback((imageSrc) => {
    return errors.has(imageSrc);
  }, [errors]);

  return { handleImageError, isImageError };
};

// ===== КОМПОНЕНТ ИЗОБРАЖЕНИЯ С FALLBACK =====
const ZodiacImage = React.memo(({ 
  src, 
  alt, 
  style, 
  onError, 
  emoji, 
  draggable = false,
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.(src);
  }, [src, onError]);

  if (hasError) {
    // Fallback - показываем эмодзи вместо изображения
    return (
      <div 
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontSize: style?.width ? `${parseInt(style.width) * 0.4}px` : '32px',
          fontWeight: 'bold'
        }}
        {...props}
      >
        {emoji}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={style}
      onError={handleError}
      draggable={draggable}
      {...props}
    />
  );
});

ZodiacImage.displayName = 'ZodiacImage';

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const ZodiacCardsSelector = React.memo(({
  selectedSign = 'Овен',
  onSignSelect,
  showHero = true,
  heroSize = 'large', // large, medium, small
  thumbnailSize = 'medium' // large, medium, small
}) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(selectedSign);
  const scrollerRef = useRef(null);
  
  // Кастомные хуки
  useSmoothWheelToHorizontal(scrollerRef);
  useTouchScroll(scrollerRef);
  const { handleImageError, isImageError } = useImageError();

  // Синхронизация с внешним состоянием
  useEffect(() => {
    setActive(selectedSign);
  }, [selectedSign]);

  // Мемоизированные вычисления
  const activeIndex = useMemo(
    () => Math.max(0, SIGNS.findIndex((s) => s.sign === active)),
    [active]
  );

  const activeItem = useMemo(
    () => SIGNS[clampIndex(activeIndex)],
    [activeIndex]
  );

  const orderedSigns = useMemo(() => {
    const list = [];
    for (let i = 0; i < SIGNS.length; i++) {
      list.push(SIGNS[clampIndex(activeIndex + i)]);
    }
    return list;
  }, [activeIndex]);

  // Размеры hero карточки
  const heroSizes = useMemo(() => ({
    small: { width: 'min(50vw, 300px)', maxHeight: '60vh' },
    medium: { width: 'min(60vw, 400px)', maxHeight: '70vh' },
    large: { width: 'min(70vw, 480px)', maxHeight: '75vh' }
  }), []);

  // Размеры thumbnail
  const thumbnailSizes = useMemo(() => ({
    small: { width: '60px', height: '60px' },
    medium: { width: '80px', height: '80px' },
    large: { width: '100px', height: '100px' }
  }), []);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0'
    },

    hero: {
      ...heroSizes[heroSize],
      aspectRatio: '5 / 7',
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
      border: `2px solid ${theme.colors.primary}`,
      boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px ${theme.colors.primary}40`,
      background: theme.components.card.background,
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },

    heroImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 300ms ease',
      display: 'block'
    },

    heroOverlay: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: '16px',
      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    heroBadge: {
      padding: '12px 20px',
      borderRadius: '24px',
      background: 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      fontSize: '18px',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
    },

    scroller: {
      width: '100%',
      marginTop: '20px',
      padding: '16px 12px',
      display: 'flex',
      gap: '16px',
      overflowX: 'auto',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth',
      borderRadius: '16px',
      background: theme.components.card.background,
      border: `1px solid ${theme.colors.border}`,
      cursor: 'grab',
      userSelect: 'none',
      // Скрываем скроллбар
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    },

    thumbnail: (isActive) => ({
      flex: '0 0 auto',
      ...thumbnailSizes[thumbnailSize],
      borderRadius: '12px',
      overflow: 'hidden',
      border: `3px solid ${isActive ? theme.colors.primary : 'transparent'}`,
      boxShadow: isActive
        ? `0 8px 20px ${theme.colors.primary}66, 0 0 0 1px ${theme.colors.primary}`
        : '0 4px 8px rgba(0,0,0,0.1)',
      transform: isActive ? 'scale(1.1)' : 'scale(1)',
      transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      background: theme.components.card.background
    }),

    thumbnailImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    },

    emojiOverlay: {
      position: 'absolute',
      top: '4px',
      right: '4px',
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: '600',
      border: '1px solid rgba(255,255,255,0.2)'
    },

    datesBadge: {
      position: 'absolute',
      bottom: '4px',
      left: '4px',
      right: '4px',
      background: 'rgba(0,0,0,0.7)',
      color: '#fff',
      borderRadius: '8px',
      padding: '2px 4px',
      fontSize: '10px',
      fontWeight: '500',
      textAlign: 'center',
      opacity: 0,
      transition: 'opacity 0.2s ease'
    }
  }), [theme, heroSize, thumbnailSize, heroSizes, thumbnailSizes]);

  // Обработчики событий
  const scrollActiveIntoView = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const activeEl = scroller.querySelector('[data-active="true"]');
    if (activeEl) {
      const scrollerRect = scroller.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const delta = (elRect.left + elRect.right) / 2 - (scrollerRect.left + scrollerRect.right) / 2;
      scroller.scrollBy({ left: delta, behavior: 'smooth' });
    }
  }, []);

  const handleSignPick = useCallback((sign) => {
    setActive(sign);
    onSignSelect?.(sign);
  }, [onSignSelect]);

  // Эффекты
  useEffect(() => {
    scrollActiveIntoView();
  }, [active, scrollActiveIntoView]);

  // Hover обработчики для hero
  const handleHeroMouseEnter = useCallback((e) => {
    const heroEl = e.currentTarget;
    const img = heroEl.querySelector('img');
    heroEl.style.transform = 'scale(1.02)';
    if (img) img.style.transform = 'scale(1.05)';
  }, []);

  const handleHeroMouseLeave = useCallback((e) => {
    const heroEl = e.currentTarget;
    const img = heroEl.querySelector('img');
    heroEl.style.transform = 'scale(1)';
    if (img) img.style.transform = 'scale(1)';
  }, []);

  return (
    <div style={styles.container}>
      {/* CSS для скрытия скроллбара в WebKit */}
      <style>{`
        .zodiac-scroller::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Hero карточка */}
      {showHero && (
        <div
          style={styles.hero}
          onMouseEnter={handleHeroMouseEnter}
          onMouseLeave={handleHeroMouseLeave}
          role="button"
          tabIndex={0}
          aria-label={`Знак зодиака: ${activeItem.sign}, ${activeItem.dates}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleSignPick(activeItem.sign);
            }
          }}
        >
          <ZodiacImage
            src={activeItem.img}
            alt={`${activeItem.sign} (${activeItem.dates})`}
            style={styles.heroImage}
            emoji={activeItem.emoji}
            onError={handleImageError}
          />
          
          <div style={styles.heroOverlay}>
            <div style={styles.heroBadge}>
              <span style={{ fontSize: '24px' }}>{activeItem.emoji}</span>
              <div>
                <div style={{ fontSize: '18px' }}>{activeItem.sign}</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{activeItem.dates}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Горизонтальная карусель */}
      <div 
        ref={scrollerRef}
        className="zodiac-scroller"
        style={styles.scroller}
        role="listbox"
        aria-label="Выбор знака зодиака"
      >
        {orderedSigns.map((sign) => {
          const isActive = sign.sign === activeItem.sign;
          const hasError = isImageError(sign.img);
          
          return (
            <div
              key={sign.sign}
              data-active={isActive ? 'true' : 'false'}
              style={styles.thumbnail(isActive)}
              onClick={() => handleSignPick(sign.sign)}
              role="option"
              aria-selected={isActive}
              aria-label={`${sign.sign}, ${sign.dates}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSignPick(sign.sign);
                }
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
                // Показываем даты при hover
                const badge = e.currentTarget.querySelector('[data-dates]');
                if (badge) badge.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
                // Скрываем даты
                const badge = e.currentTarget.querySelector('[data-dates]');
                if (badge) badge.style.opacity = '0';
              }}
            >
              <ZodiacImage
                src={sign.img}
                alt={`${sign.sign} (${sign.dates})`}
                style={styles.thumbnailImage}
                emoji={sign.emoji}
                onError={handleImageError}
              />
              
              <div style={styles.emojiOverlay}>
                {sign.emoji}
              </div>
              
              <div 
                style={styles.datesBadge}
                data-dates="true"
              >
                {sign.dates}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

ZodiacCardsSelector.displayName = 'ZodiacCardsSelector';

export default ZodiacCardsSelector;
