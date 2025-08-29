import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// ИМПОРТЫ КАРТИНОК (ваши файлы .png)
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

const SIGNS = [
  { sign: 'Овен',      emoji: '♈', img: ovenImg },
  { sign: 'Телец',     emoji: '♉', img: teletsImg },
  { sign: 'Близнецы',  emoji: '♊', img: bliznestyImg },
  { sign: 'Рак',       emoji: '♋', img: rakImg },
  { sign: 'Лев',       emoji: '♌', img: levImg },
  { sign: 'Дева',      emoji: '♍', img: devaImg },
  { sign: 'Весы',      emoji: '♎', img: vesyImg },
  { sign: 'Скорпион',  emoji: '♏', img: skorpionImg },
  { sign: 'Стрелец',   emoji: '♐', img: strelecImg },
  { sign: 'Козерог',   emoji: '♑', img: kozerogImg },
  { sign: 'Водолей',   emoji: '♒', img: vodoleyImg },
  { sign: 'Рыбы',      emoji: '♓', img: rybyImg },
];

const clampIndex = (i) => (i + SIGNS.length) % SIGNS.length;

const useSmoothWheelToHorizontal = (ref) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [ref]);
};

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
    };

    const onEnd = () => {
      isDown = false;
      el.style.cursor = 'grab';
    };

    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches?.[0]?.pageX || 0) - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onStart);
    el.addEventListener('mouseleave', onEnd);
    el.addEventListener('mouseup', onEnd);
    el.addEventListener('mousemove', onMove);
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

const ZodiacCardsSelector = ({
  selectedSign = 'Овен',
  onSignSelect,
  showHero = true,
}) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(selectedSign);
  const scrollerRef = useRef(null);

  useSmoothWheelToHorizontal(scrollerRef);
  useTouchScroll(scrollerRef);

  useEffect(() => setActive(selectedSign), [selectedSign]);

  const activeIndex = useMemo(
    () => Math.max(0, SIGNS.findIndex((s) => s.sign === active)),
    [active]
  );
  const activeItem = SIGNS[clampIndex(activeIndex)];

  const ordered = useMemo(() => {
    const list = [];
    for (let i = 0; i < SIGNS.length; i++) {
      list.push(SIGNS[clampIndex(activeIndex + i)]);
    }
    return list;
  }, [activeIndex]);

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

  useEffect(() => {
    scrollActiveIntoView();
  }, [active, scrollActiveIntoView]);

  const handlePick = (sign) => {
    setActive(sign);
    onSignSelect?.(sign);
  };

  // Стили
  const heroStyle = {
    width: 'min(70vw, 480px)',
    aspectRatio: '5 / 7',
    maxHeight: '75vh',
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    border: `2px solid ${theme.colors.primary}`,
    boxShadow: theme.name === 'dark'
      ? `0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px ${theme.colors.primary}40`
      : `0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px ${theme.colors.primary}40`,
    background: theme.card.background,
  };

  const heroImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 300ms ease',
    display: 'block',
  };

  const heroOverlayStyle = {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: '16px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.7) 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const badgeStyle = {
    padding: '10px 16px',
    borderRadius: '20px',
    background: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
    fontSize: '18px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: '1px solid rgba(255,255,255,0.3)',
  };

  const scrollerStyle = {
    width: '100%',
    marginTop: '20px',
    padding: '12px 8px',
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
    borderRadius: '12px',
    background: theme.card.background,
    border: `1px solid ${theme.colors.border}`,
    cursor: 'grab',
    userSelect: 'none',
    // Убираем скроллбар
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const thumbStyle = (isActive) => ({
    flex: '0 0 auto',
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: `3px solid ${isActive ? theme.colors.primary : 'transparent'}`,
    boxShadow: isActive
      ? `0 8px 20px ${theme.colors.primary}66, 0 0 0 1px ${theme.colors.primary}`
      : theme.card.boxShadow,
    transform: isActive ? 'scale(1.1)' : 'scale(1)',
    transition: 'all 250ms ease',
    cursor: 'pointer',
    position: 'relative',
    background: theme.card.background,
  });

  const thumbImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  const emojiStyle = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    background: 'rgba(0,0,0,0.6)',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
      {/* Большая карта героя */}
      {showHero && (
        <div
          style={heroStyle}
          onMouseEnter={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
          }}
        >
          <img
            src={activeItem.img}
            alt={activeItem.sign}
            style={heroImgStyle}
            draggable={false}
          />
          <div style={heroOverlayStyle}>
            <div style={badgeStyle}>
              <span style={{ fontSize: '24px' }}>{activeItem.emoji}</span>
              <span>{activeItem.sign}</span>
            </div>
          </div>
        </div>
      )}

      {/* Горизонтальная карусель БЕЗ СТРЕЛОК */}
      <div 
        ref={scrollerRef} 
        style={{
          ...scrollerStyle,
          // Скрываем скроллбар для WebKit браузеров
          '::-webkit-scrollbar': { display: 'none' }
        }}
      >
        {ordered.map((s) => {
          const isActive = s.sign === activeItem.sign;
          return (
            <div
              key={s.sign}
              data-active={isActive ? 'true' : 'false'}
              style={thumbStyle(isActive)}
              onClick={() => handlePick(s.sign)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              <img src={s.img} alt={s.sign} style={thumbImgStyle} draggable={false} />
              <div style={emojiStyle}>
                {s.emoji}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ZodiacCardsSelector;
