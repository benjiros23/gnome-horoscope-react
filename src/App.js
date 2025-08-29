import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

import Header from './components/Header';
import BackButton from './components/BackButton'; // поправьте путь, если лежит в UI/
import HoroscopeView from './components/HoroscopeView';
import ZodiacCardsSelector from './components/ZodiacCardsSelector';
import MoonView from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView from './components/NumerologyView';
import AstroEventsView from './components/AstroEventsView';
import DayCardView from './components/DayCardView';
import MercuryView from './components/MercuryView';
import BentoGrid from './components/BentoGrid';
import LoadingScreen from './components/LoadingScreen';

import { EnhancedMoonPhase } from './enhanced_moonPhase';
import { useAstrologyData } from './hooks/useAstrologyData';

// ДАННЫЕ
const ZODIAC_SIGNS = [
  { sign: 'Овен', emoji: '♈', dates: '21.03-20.04' },
  { sign: 'Телец', emoji: '♉', dates: '21.04-20.05' },
  { sign: 'Близнецы', emoji: '♊', dates: '21.05-21.06' },
  { sign: 'Рак', emoji: '♋', dates: '22.06-22.07' },
  { sign: 'Лев', emoji: '♌', dates: '23.07-22.08' },
  { sign: 'Дева', emoji: '♍', dates: '23.08-22.09' },
  { sign: 'Весы', emoji: '♎', dates: '23.09-22.10' },
  { sign: 'Скорпион', emoji: '♏', dates: '23.10-22.11' },
  { sign: 'Стрелец', emoji: '♐', dates: '23.11-21.12' },
  { sign: 'Козерог', emoji: '♑', dates: '22.12-20.01' },
  { sign: 'Водолей', emoji: '♒', dates: '21.01-19.02' },
  { sign: 'Рыбы', emoji: '♓', dates: '20.02-20.03' }
];

const GNOME_PROFILES = {
  'Овен': { name: 'Гном Огнебород', title: 'Боевой кузнец', desc: 'Смелый, активный, любит приключения' },
  'Телец': { name: 'Гном Златоруд', title: 'Мастер сокровищ', desc: 'Упорный, надежный, ценит комфорт' },
  'Близнецы': { name: 'Гном Двойняшка', title: 'Мудрый летописец', desc: 'Любознательный, общительный' },
  'Рак': { name: 'Гном Домовой', title: 'Хранитель очага', desc: 'Заботливый, чувствительный' },
  'Лев': { name: 'Гном Златогрив', title: 'Королевский советник', desc: 'Гордый, щедрый, любит внимание' },
  'Дева': { name: 'Гном Аккуратный', title: 'Мастер точности', desc: 'Практичный, внимательный к деталям' },
  'Весы': { name: 'Гном Справедливый', title: 'Мирный судья', desc: 'Дипломатичный, ищет баланс' },
  'Скорпион': { name: 'Гном Тайновед', title: 'Хранитель секретов', desc: 'Глубокий, интуитивный' },
  'Стрелец': { name: 'Гном Путешественник', title: 'Искатель приключений', desc: 'Свободолюбивый, оптимистичный' },
  'Козерог': { name: 'Гном Горовосходитель', title: 'Мастер достижений', desc: 'Целеустремленный, терпеливый' },
  'Водолей': { name: 'Гном Изобретатель', title: 'Новатор будущего', desc: 'Независимый, оригинальный' },
  'Рыбы': { name: 'Гном Мечтатель', title: 'Морской волшебник', desc: 'Творческий, эмпатичный' }
};

// Бургер-меню (off-canvas)
const BurgerMenu = ({ open, onClose, onNavigate, theme, current }) => {
  const panel = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '72vw',
    maxWidth: 320,
    backgroundColor: theme.colors.surface,
    borderRight: `1px solid ${theme.colors.border}`,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 240ms ease',
    zIndex: 1100,
    display: 'flex',
    flexDirection: 'column',
    padding: 16,
    gap: 8,
    boxShadow: '0 0 30px rgba(0,0,0,0.35)'
  };
  const backdrop = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    opacity: open ? 1 : 0,
    pointerEvents: open ? 'auto' : 'none',
    transition: 'opacity 200ms ease',
    zIndex: 1000
  };
  const link = (active) => ({
    padding: '12px 14px',
    borderRadius: 10,
    border: `1px solid ${active ? theme.colors.primary : theme.colors.border}`,
    background: active ? theme.colors.primary + '22' : 'transparent',
    color: theme.colors.text,
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: active ? 700 : 500
  });

  const items = [
    { id: 'home', label: '🏠 Главная' },
    { id: 'horoscope', label: '🔮 Гороскоп' },
    { id: 'moon', label: '🌙 Луна' },
    { id: 'compatibility', label: '💕 Совместимость' },
    { id: 'numerology', label: '🔢 Нумерология' },
    { id: 'events', label: '🌌 События' },
    { id: 'cards', label: '🃏 Карта дня' },
    { id: 'mercury', label: '🪐 Меркурий' },
    { id: 'favorites', label: '⭐ Избранное' },
  ];

  return (
    <>
      <div style={backdrop} onClick={onClose} />
      <nav style={panel} aria-label="Main navigation">
        <h3 style={{ margin: '0 0 12px', color: theme.colors.text }}>Меню</h3>
        {items.map((i) => (
          <button
            key={i.id}
            style={link(current === i.id)}
            onClick={() => { onNavigate(i.id); onClose(); }}
          >
            {i.label}
          </button>
        ))}
      </nav>
    </>
  );
};

function AppContent() {
  const { theme } = useTheme(); // тема фиксирована тёмная

  // Экран загрузки
  const [isLoading, setIsLoading] = useState(true);

  // Данные
  const astrologyData = useAstrologyData({
    autoUpdate: true,
    updateInterval: 6 * 60 * 60 * 1000,
    coordinates: { lat: 55.7558, lng: 37.6173 },
    enableHoroscope: false
  });

  // Сцены
  const [currentView, setCurrentView] = useState(() => {
    try { return localStorage.getItem('gnome-current-view') || 'home'; } catch { return 'home'; }
  });

  const [selectedSign, setSelectedSign] = useState(() => {
    try { return localStorage.getItem('gnome-selected-sign') || 'Лев'; } catch { return 'Лев'; }
  });

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gnome-favorites') || '[]'); } catch { return []; }
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Persist
  useEffect(() => { try { localStorage.setItem('gnome-current-view', currentView); } catch {} }, [currentView]);
  useEffect(() => { try { localStorage.setItem('gnome-selected-sign', selectedSign); } catch {} }, [selectedSign]);
  useEffect(() => { try { localStorage.setItem('gnome-favorites', JSON.stringify(favorites)); } catch {} }, [favorites]);

  // Network
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  // Загрузка
  if (isLoading) {
    return (
      <LoadingScreen
        onLoadingComplete={() => setIsLoading(false)}
        minLoadingTime={2000}
        showProgress
        backgroundImage="/assets/my-space-bg.jpg"
        circleImage="/assets/circle-background.png"
        gnomeImage="/assets/gnome-astrologer.png"
        headerImage="/assets/header.jpg"
      />
    );
  }

  // Оболочка приложения: один экран, без скролла
  const appShell = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: theme.colors.background
  };

  // Сцена под шапкой
  const headerHeight = 'clamp(56px, 12vw, 120px)';
  const stage = {
    position: 'absolute',
    top: headerHeight,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'grid',
    placeItems: 'center',
    padding: 16
  };

  const burgerBtn = {
    position: 'fixed',
    top: `calc(${headerHeight} + 12px)`,
    left: 16,
    zIndex: 1200,
    width: 44,
    height: 44,
    borderRadius: 12,
    border: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    color: theme.colors.text,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: theme.card?.boxShadow || '0 6px 12px rgba(0,0,0,0.25)',
    cursor: 'pointer',
  };

  const offlineBanner = {
    position: 'fixed',
    top: headerHeight,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.danger,
    color: 'white',
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    zIndex: 1300
  };

  const navigate = (view) => setCurrentView(view);

  // Каждая сцена вписывается в окно
  const Scene = useMemo(() => {
    switch (currentView) {
      case 'horoscope':
        return (
          <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto' }}>
            <ZodiacCardsSelector selectedSign={selectedSign} onSignSelect={setSelectedSign} showHero />
            <HoroscopeView
              selectedSign={selectedSign}
              gnomeProfile={GNOME_PROFILES[selectedSign]}
              astrologyData={astrologyData}
              onAddToFavorites={(item) =>
                setFavorites((p) => [{ ...item, id: Date.now() }, ...p].slice(0, 50))
              }
            />
          </div>
        );
      case 'moon':
        return (
          <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto' }}>
            <MoonView
              astrologyData={astrologyData}
              enhancedMoonPhase={EnhancedMoonPhase}
              onAddToFavorites={(item) =>
                setFavorites((p) => [{ ...item, id: Date.now() }, ...p].slice(0, 50))
              }
            />
          </div>
        );
      case 'compatibility':
        return <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto' }}><CompatibilityView /></div>;
      case 'numerology':
        return <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto' }}><NumerologyView /></div>;
      case 'events':
        return <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto' }}><AstroEventsView /></div>;
      case 'cards':
        return <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto' }}><DayCardView /></div>;
      case 'mercury':
        return <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto' }}><MercuryView /></div>;
      case 'favorites':
        return (
          <div style={{ width: 'min(96vw, 900px)', maxHeight: '100%', overflow: 'auto', color: theme.colors.text }}>
            <div style={{ opacity: 0.7, marginBottom: 8 }}>⭐ Избранное: {favorites.length}</div>
            {/* Выведите список избранного, если нужно */}
          </div>
        );
      default: // home
        return (
          <div style={{ width: 'min(96vw, 980px)', maxHeight: '100%', overflow: 'auto' }}>
            <ZodiacCardsSelector selectedSign={selectedSign} onSignSelect={setSelectedSign} showHero />
            <BentoGrid
              astrologyData={astrologyData}
              selectedSign={selectedSign}
              gnomeProfiles={GNOME_PROFILES}
              onButtonClick={navigate}
              onSignSelect={setSelectedSign}
            />
          </div>
        );
    }
  }, [currentView, selectedSign, astrologyData, favorites, theme.colors.text]);

  return (
    <div style={appShell}>
      <Header src="/assets/header.jpg" sticky />

      {/* Бургер-кнопка */}
      <button aria-label="Открыть меню" onClick={() => setMenuOpen(true)} style={burgerBtn}>☰</button>

      {/* Off-canvas меню */}
      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={navigate}
        current={currentView}
        theme={theme}
      />

      {/* Оффлайн-баннер */}
      {!isOnline && <div style={offlineBanner}>🔌 Нет подключения к интернету</div>}

      {/* Сцена одного экрана */}
      <main style={stage} role="main">
        {Scene}
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
