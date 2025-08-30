import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Header from './components/Header';
import MainMenu from './components/MainMenu';
import MoonView from './components/MoonView';
import HoroscopeView from './components/HoroscopeView';
import CompatibilityView from './components/CompatibilityView';
import DayCardView from './components/DayCardView';
import NumerologyView from './components/NumerologyView';
import BackButton from './components/BackButton';
import FavoritesView from './components/FavoritesView';

// Hooks and Utils
import useAstrologyData from './hooks/useAstrologyData';
import ErrorBoundary from './components/ErrorBoundary';

// Error Boundary для критических ошибок
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Критическая ошибка приложения:', error);
    console.log('📍 Дополнительная информация:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff'
        }}>
          <h1>🚨 Произошла ошибка</h1>
          <p>Приложение временно недоступно</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#ffffff',
              color: '#667eea',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              marginTop: '20px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            🔄 Перезагрузить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  // ИСПРАВЛЯЕМ ЗАГРУЗКУ ЗНАКА ЗОДИАКА
  const [selectedSign, setSelectedSign] = useState(() => {
    try {
      const saved = localStorage.getItem('gnome-selected-sign');
      if (saved) {
        // ПРОВЕРЯЕМ ФОРМАТ ДАННЫХ
        if (saved.startsWith('"') && saved.endsWith('"')) {
          // Это JSON строка - парсим
          return JSON.parse(saved);
        } else {
          // Это обычная строка - возвращаем как есть
          return saved;
        }
      }
      return null;
    } catch (error) {
      console.error('Ошибка загрузки знака зодиака:', error);
      // Очищаем поврежденные данные
      localStorage.removeItem('gnome-selected-sign');
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('main');
  const [telegramApp, setTelegramApp] = useState(null);

  // Инициализация Telegram Web App
  useEffect(() => {
    try {
      if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        setTelegramApp(tg);
        console.log('📱 Telegram Web App инициализирован');
      }
    } catch (error) {
      console.log('📱 Telegram Web App недоступен:', error);
    }
  }, []);

  // Конфигурация для астрологических данных
  const astrologyConfig = useMemo(() => ({
    autoUpdate: true,
    updateInterval: 6 * 60 * 60 * 1000, // 6 часов
    coordinates: { lat: 55.7558, lng: 37.6173 }, // Москва
    zodiacSign: selectedSign,
    enableMoon: true,
    enableHoroscope: !!selectedSign
  }), [selectedSign]);

  // Используем хук для астрологических данных
  const {
    moonData,
    horoscopeData,
    loading: dataLoading,
    lastUpdated,
    updateCount,
    updateMoonData,
    updateHoroscopeData
  } = useAstrologyData(astrologyConfig);

  // ИСПРАВЛЯЕМ СОХРАНЕНИЕ ЗНАКА ЗОДИАКА
  const handleSignSelect = useCallback((sign) => {
    console.log('🌟 Выбран знак зодиака:', sign);
    setSelectedSign(sign);
    // СОХРАНЯЕМ КАК ПРОСТУЮ СТРОКУ
    localStorage.setItem('gnome-selected-sign', sign);
  }, []);

  const handleNavigate = useCallback((view) => {
    setCurrentView(view);
    
    // Haptic feedback для Telegram
    try {
      telegramApp?.HapticFeedback?.impactOccurred('light');
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
  }, [telegramApp]);

  const handleAddToFavorites = useCallback((item) => {
    try {
      const favorites = JSON.parse(localStorage.getItem('gnome-favorites') || '[]');
      const newItem = {
        ...item,
        id: `${item.type}_${Date.now()}_${Math.random()}`,
        addedAt: new Date().toISOString()
      };
      
      favorites.push(newItem);
      localStorage.setItem('gnome-favorites', JSON.stringify(favorites));
      
      console.log('⭐ Добавлено в избранное:', newItem);
      
      // Уведомление для пользователя
      if (telegramApp) {
        telegramApp.showAlert('Добавлено в избранное! ⭐');
      }
      
    } catch (error) {
      console.error('❌ Ошибка добавления в избранное:', error);
    }
  }, [telegramApp]);

  // Логирование состояния лунных данных
  useEffect(() => {
    if (moonData) {
      console.log('🌙 Актуальные лунные данные обновлены:', {
        phase: moonData.phase,
        source: moonData.source || 'unknown',
        lastUpdated: lastUpdated
      });
    }
  }, [moonData, lastUpdated]);

  // Проверка доступности SunCalc и Enhanced MoonPhase
  useEffect(() => {
    const checkLibraries = async () => {
      try {
        // Проверяем SunCalc
        if (window.SunCalc) {
          console.log('✅ SunCalc готов к использованию');
        }
        
        // Проверяем Enhanced MoonPhase
        const { getMoonPhaseData } = await import('./enhanced_moonPhase');
        if (getMoonPhaseData) {
          const status = await getMoonPhaseData();
          console.log('🌙 Enhanced MoonPhase status:', status);
        }
      } catch (error) {
        console.error('❌ Ошибка проверки библиотек:', error);
      }
    };
    
    checkLibraries();
  }, []);

  const renderCurrentView = () => {
    const commonProps = {
      telegramApp,
      onNavigate: handleNavigate,
      onAddToFavorites: handleAddToFavorites
    };

    switch (currentView) {
      case 'moon':
        return (
          <MoonView 
            {...commonProps}
            moonData={moonData}
            loading={dataLoading}
            onRefresh={updateMoonData}
          />
        );
        
      case 'horoscope':
        return (
          <HoroscopeView 
            {...commonProps}
            selectedSign={selectedSign}
            onSignSelect={handleSignSelect}
            horoscopeData={horoscopeData}
            loading={dataLoading}
            onRefresh={updateHoroscopeData}
          />
        );
        
      case 'compatibility':
        return (
          <CompatibilityView 
            {...commonProps}
            selectedSign={selectedSign}
            onSignSelect={handleSignSelect}
          />
        );
        
      case 'cards':
        return <DayCardView {...commonProps} />;
        
      case 'numerology':
        return <NumerologyView {...commonProps} />;
        
      case 'favorites':
        return <FavoritesView {...commonProps} />;
        
      default:
        return (
          <MainMenu 
            {...commonProps}
            selectedSign={selectedSign}
            moonData={moonData}
            dataLoading={dataLoading}
            lastUpdated={lastUpdated}
            updateCount={updateCount}
          />
        );
    }
  };

  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <ErrorBoundary>
          <div className="App">
            <Header 
              currentView={currentView}
              selectedSign={selectedSign}
              onNavigate={handleNavigate}
            />
            
            <main className="app-content">
              {renderCurrentView()}
            </main>
            
            <BackButton
              onClick={() => handleNavigate('main')}
              show={currentView !== 'main'}
              telegramApp={telegramApp}
            />
          </div>
        </ErrorBoundary>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

export default App;
