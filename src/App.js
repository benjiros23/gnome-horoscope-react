import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Базовые компоненты UI
const Header = () => (
  <header style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 'clamp(56px, 12vw, 120px)',
    zIndex: 1000,
    background: 'url("/assets/header.jpg") center/cover',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
  }} />
);

const LoadingScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(ellipse at center, #2D1B69 0%, #1A1A2E 50%, #0F0F1A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      zIndex: 9999
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#F4C542' }}>
        🧙‍♂️ GNOME HOROSCOPE
      </h1>
      <div style={{
        width: 300,
        height: 8,
        background: 'rgba(244,197,66,0.3)',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: '#F4C542',
          transition: 'width 0.1s ease'
        }} />
      </div>
      <p style={{ marginTop: '16px', opacity: 0.8 }}>
        Consulting the Cosmic Gnomes...
      </p>
    </div>
  );
};

// Данные
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

// Бургер-меню
const BurgerMenu = ({ open, onClose, onNavigate, theme, currentView }) => {
  const menuItems = [
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

  const handleNavigate = (id) => {
    onNavigate(id);
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000
        }}
        onClick={onClose}
      />
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '280px',
        background: theme.colors.surface,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 250ms ease',
        zIndex: 1100,
        padding: '20px',
        boxShadow: '2px 0 10px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 20px', color: theme.colors.text }}>Меню</h3>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            style={{
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              margin: '4px 0',
              background: currentView === item.id ? theme.colors.primary + '20' : 'transparent',
              border: `1px solid ${currentView === item.id ? theme.colors.primary : theme.colors.border}`,
              borderRadius: '8px',
              color: theme.colors.text,
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: currentView === item.id ? 'bold' : 'normal'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
};

// Главный компонент
function AppContent() {
  const { theme } = useTheme();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');
  const [selectedSign, setSelectedSign] = useState('Лев');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem('gnome-current-view', currentView);
      localStorage.setItem('gnome-selected-sign', selectedSign);
    } catch (e) {}
  }, [currentView, selectedSign]);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  // Рендер сцен
  const renderScene = () => {
    const commonStyle = {
      width: 'min(95vw, 800px)',
      maxHeight: 'calc(100vh - 80px)',
      overflow: 'auto',
      padding: '20px',
      color: theme.colors.text
    };

    switch (currentView) {
      case 'horoscope':
        return (
          <div style={commonStyle}>
            <h2>🔮 Гороскоп для {selectedSign}</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              margin: '20px 0'
            }}>
              <h3>{GNOME_PROFILES[selectedSign]?.name}</h3>
              <p>{GNOME_PROFILES[selectedSign]?.desc}</p>
              <p>Ваш гороскоп на сегодня готовится космическими гномами...</p>
            </div>
          </div>
        );

      case 'moon':
        return (
          <div style={commonStyle}>
            <h2>🌙 Лунный календарь</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '4rem', margin: '20px 0' }}>🌗</div>
              <p>Текущая фаза луны и её влияние на ваш знак {selectedSign}</p>
            </div>
          </div>
        );

      case 'compatibility':
        return (
          <div style={commonStyle}>
            <h2>💕 Совместимость знаков</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p>Узнайте совместимость между знаками зодиака</p>
              <div style={{ fontSize: '3rem', margin: '20px 0' }}>💑</div>
            </div>
          </div>
        );

      case 'numerology':
        return (
          <div style={commonStyle}>
            <h2>🔢 Нумерология</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p>Откройте тайны чисел вашей судьбы</p>
              <div style={{ fontSize: '3rem', margin: '20px 0' }}>🔮</div>
            </div>
          </div>
        );

      case 'events':
        return (
          <div style={commonStyle}>
            <h2>🌌 Астрологические события</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p>Важные астрономические события и их влияние</p>
              <div style={{ fontSize: '3rem', margin: '20px 0' }}>⭐</div>
            </div>
          </div>
        );

      case 'cards':
        return (
          <div style={commonStyle}>
            <h2>🃏 Карта дня</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p>Получите совет и предсказание на сегодня</p>
              <div style={{ fontSize: '3rem', margin: '20px 0' }}>🎴</div>
            </div>
          </div>
        );

      case 'mercury':
        return (
          <div style={commonStyle}>
            <h2>🪐 Меркурий в ретрограде</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p>Влияние ретроградного Меркурия на вашу жизнь</p>
              <div style={{ fontSize: '3rem', margin: '20px 0' }}>🪐</div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div style={commonStyle}>
            <h2>⭐ Избранное</h2>
            <div style={{
              background: theme.colors.surface,
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', margin: '20px 0' }}>📫</div>
              <p>Ваши сохраненные гороскопы и предсказания</p>
            </div>
          </div>
        );

      default: // home
        return (
          <div style={commonStyle}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h1 style={{ 
                fontSize: '2.5rem', 
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 10px 0'
              }}>
                🧙‍♂️ Астро Гном
              </h1>
              <p style={{ opacity: 0.8 }}>{GNOME_PROFILES[selectedSign]?.desc}</p>
            </div>

            {/* Селектор знака */}
            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '10px',
              padding: '10px 0',
              marginBottom: '30px'
            }}>
              {ZODIAC_SIGNS.map(sign => (
                <button
                  key={sign.sign}
                  onClick={() => setSelectedSign(sign.sign)}
                  style={{
                    minWidth: '80px',
                    padding: '10px',
                    border: `2px solid ${selectedSign === sign.sign ? theme.colors.primary : theme.colors.border}`,
                    borderRadius: '12px',
                    background: selectedSign === sign.sign ? theme.colors.primary + '20' : theme.colors.surface,
                    color: theme.colors.text,
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ fontSize: '24px' }}>{sign.emoji}</div>
                  <div>{sign.sign}</div>
                </button>
              ))}
            </div>

            {/* Быстрые действия */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              {[
                { id: 'horoscope', icon: '🔮', title: 'Гороскоп' },
                { id: 'moon', icon: '🌙', title: 'Луна' },
                { id: 'cards', icon: '🃏', title: 'Карта дня' },
                { id: 'compatibility', icon: '💕', title: 'Совместимость' }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  style={{
                    padding: '20px',
                    background: theme.colors.surface,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    color: theme.colors.text,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
                  <div>{item.title}</div>
                </button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: theme.colors.background
    }}>
      <Header />
      
      {/* Бургер-кнопка */}
      <button
        onClick={() => setMenuOpen(true)}
        style={{
          position: 'fixed',
          top: 'calc(clamp(56px, 12vw, 120px) + 10px)',
          left: '16px',
          zIndex: 1200,
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`,
          background: theme.colors.surface,
          color: theme.colors.text,
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ☰
      </button>

      <BurgerMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={setCurrentView}
        currentView={currentView}
        theme={theme}
      />

      {/* Оффлайн баннер */}
      {!isOnline && (
        <div style={{
          position: 'fixed',
          top: 'clamp(56px, 12vw, 120px)',
          left: 0,
          right: 0,
          background: '#dc2626',
          color: 'white',
          padding: '8px',
          textAlign: 'center',
          fontSize: '14px',
          zIndex: 1300
        }}>
          🔌 Нет подключения к интернету
        </div>
      )}

      {/* Сцена */}
      <main style={{
        position: 'absolute',
        top: 'clamp(56px, 12vw, 120px)',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'grid',
        placeItems: 'center',
        padding: '10px'
      }}>
        {renderScene()}
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
