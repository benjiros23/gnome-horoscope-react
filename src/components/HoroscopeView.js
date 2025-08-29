import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// ИМПОРТЫ КАРТИНОК (замените пути на свои файлы; покажены примеры для трёх знаков)
import ovenImg from '../assets/zodiac/oven.jpg';   // Овен
import rybyImg from '../assets/zodiac/ryby.jpg';   // Рыбы
import rakImg from '../assets/zodiac/rak.jpg';     // Рак

// Если пока нет всех 12 картинок — временно подставьте те что есть
const SIGNS = [
  { sign: 'Овен',    emoji: '♈', img: ovenImg },
  { sign: 'Телец',   emoji: '♉', img: ovenImg },
  { sign: 'Близнецы',emoji: '♊', img: ovenImg },
  { sign: 'Рак',     emoji: '♋', img: rakImg },
  { sign: 'Лев',     emoji: '♌', img: ovenImg },
  { sign: 'Дева',    emoji: '♍', img: ovenImg },
  { sign: 'Весы',    emoji: '♎', img: ovenImg },
  { sign: 'Скорпион',emoji: '♏', img: ovenImg },
  { sign: 'Стрелец', emoji: '♐', img: ovenImg },
  { sign: 'Козерог', emoji: '♑', img: ovenImg },
  { sign: 'Водолей', emoji: '♒', img: ovenImg },
  { sign: 'Рыбы',    emoji: '♓', img: rybyImg },
];

const clampIndex = (i) => (i + SIGNS.length) % SIGNS.length;

const useSmoothWheelToHorizontal = (ref) => {
  // Плавная прокрутка колесом по горизонтали на десктопе
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e) => {
      // Перенаправляем вертикальное колесо в горизонтальный скролл
      if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
        el.scrollBy({ left: e.deltaY, behavior: 'smooth' });
        e.preventDefault();
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [ref]);
};

const useDragScroll = (ref) => {
  // Перетаскивание мышью как тач-скролл (удобно на десктопе)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onDown = (e) => {
      isDown = true;
      startX = (e.pageX || e.touches?.[0]?.pageX || 0) - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onLeave = () => { isDown = false; };
    const onUp = () => { isDown = false; };
    const onMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches?.[0]?.pageX || 0) - el.offsetLeft;
      const walk = (x - startX);
      el.scrollLeft = scrollLeft - walk;
    };

    el.addEventListener('mousedown', onDown);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('mouseup', onUp);
    el.addEventListener('mousemove', onMove);

    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchend', onUp);
    el.addEventListener('touchmove', onMove, { passive: false });

    return () => {
      el.removeEventListener('mousedown', onDown);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('mouseup', onUp);
      el.removeEventListener('mousemove', onMove);

      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchend', onUp);
      el.removeEventListener('touchmove', onMove);
    };
  }, [ref]);
};

const ZodiacCardsSelector = ({
  selectedSign = 'Овен',
  onSignSelect,
  // Параметры можно не менять: показываем «героя» + ленту соседей
  showNeighbors = true,
}) => {
  const { theme } = useTheme();
  const [active, setActive] = useState(selectedSign);
  const scrollerRef = useRef(null);
  const heroRef = useRef(null);

  useSmoothWheelToHorizontal(scrollerRef);
  useDragScroll(scrollerRef);

  // Синхронизация если selectedSign приходит извне
  useEffect(() => setActive(selectedSign), [selectedSign]);

  const activeIndex = useMemo(
    () => Math.max(0, SIGNS.findIndex((s) => s.sign === active)),
    [active]
  );
  const activeItem = SIGNS[clampIndex(activeIndex)];

  // Формируем упорядоченный список для мини-ленты (все 12, начиная от активного - чтобы было ощущение соседей)
  const ordered = useMemo(() => {
    const list = [];
    for (let i = 0; i < SIGNS.length; i++) {
      list.push(SIGNS[clampIndex(activeIndex + i)]);
    }
    return list;
  }, [activeIndex]);

  // Прокрутка мини-ленты так, чтобы активный был ближе к центру
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

  // ————————————————— Стили —————————————————
  // Герой (большая карточка)
  const heroStyle = {
    width: 'min(68vw, 520px)',       // адаптивная ширина: моб ~68vw, десктоп до 520
    aspectRatio: '5 / 7',            // вертикальные иллюстрации
    maxHeight: '82vh',
    borderRadius: '18px',
    overflow: 'hidden',
    position: 'relative',
    isolation: 'isolate',
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.name === 'dark'
      ? '0 20px 40px rgba(0,0,0,0.45)'
      : '0 20px 40px rgba(0,0,0,0.15)',
    background:
      theme.name === 'dark'
        ? 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))'
        : 'linear-gradient(180deg, rgba(0,0,0,0.04), rgba(0,0,0,0.02))',
  };

  const heroImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'scale(1.02)',
    transition: 'transform 400ms ease',
    display: 'block',
  };

  const heroOverlayStyle = {
    position: 'absolute',
    left: 0, right: 0, bottom: 0,
    padding: '12px 14px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.55) 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  };

  const badgeStyle = {
    padding: '6px 10px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.14)',
    backdropFilter: 'blur(6px)',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: 0.2,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };

  // Мини-лента
  const scrollerStyle = {
    width: '100%',
    marginTop: 14,
    padding: '10px 6px',
    display: 'flex',
    gap: 10,
    overflowX: 'auto',
    overflowY: 'hidden',
    WebkitOverflowScrolling: 'touch',
    scrollBehavior: 'smooth',
    borderRadius: '12px',
    border: `1px dashed ${theme.colors.border}`,
    background: theme.card.background,
    scrollSnapType: 'x proximity',
  };

  const thumbStyle = (isActive) => ({
    flex: '0 0 auto',
    width: 92,
    height: 92 * 7/5,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
    boxShadow: isActive
      ? `0 6px 18px ${theme.colors.primary}44`
      : theme.card.boxShadow,
    transform: isActive ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
    transition: 'all 220ms ease',
    cursor: 'pointer',
    position: 'relative',
    scrollSnapAlign: 'center',
    background: theme.card.background,
  });

  const thumbImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  // ————————————————— Разметка —————————————————
  return (
    <div style={{ display: 'grid', placeItems: 'center', gap: 10 }}>
      {/* Большая карта выбранного знака */}
      <div
        ref={heroRef}
        style={heroStyle}
        onMouseEnter={(e) => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1.04)'; }}
        onMouseLeave={(e) => { const img = e.currentTarget.querySelector('img'); if (img) img.style.transform = 'scale(1.02)'; }}
      >
        <img
          src={activeItem.img}
          alt={activeItem.sign}
          style={heroImgStyle}
          draggable={false}
        />
        <div style={heroOverlayStyle}>
          <span style={badgeStyle}>
            <span style={{ fontSize: 18 }}>{activeItem.emoji}</span>
            <span>{activeItem.sign}</span>
          </span>
          {/* Здесь можно вывести дату диапазона знака или ваш текст (вы хотели дописать сами) */}
        </div>
      </div>

      {/* Горизонтальная мини-лента соседей */}
      {showNeighbors && (
        <div ref={scrollerRef} style={scrollerStyle}>
          {ordered.map((s) => {
            const isActive = s.sign === activeItem.sign;
            return (
              <div
                key={s.sign}
                data-active={isActive ? 'true' : 'false'}
                style={thumbStyle(isActive)}
                onClick={() => handlePick(s.sign)}
              >
                <img src={s.img} alt={s.sign} style={thumbImgStyle} draggable={false} />
                {/* Плашка с эмоджи */}
                <div style={{
                  position: 'absolute',
                  left: 6, top: 6,
                  background: 'rgba(0,0,0,0.45)',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '2px 6px',
                  fontSize: 12,
                  lineHeight: 1,
                }}>
                  {s.emoji}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ZodiacCardsSelector;
