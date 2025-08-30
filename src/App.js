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

// Hooks
import useAstrologyData from './hooks/useAstrologyData';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [selectedSign, setSelectedSign] = useState(() => {
    try {
      return localStorage.getItem('gnome-selected-sign') || null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState('main');
  const [telegramApp, setTelegramApp] = useState(null);

  useEffect(() => {
    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        setTelegramApp(tg);
      }
    } catch (error) {
      console.log('Telegram недоступен');
    }
  }, []);

  const astrologyConfig = useMemo(() => ({
    coordinates: { lat: 55.7558, lng: 37.6173 },
    zodiacSign: selectedSign
  }), [selectedSign]);

  const {
    moonData,
    horoscopeData,
    loading,
    lastUpdated,
    updateMoonData,
    updateHoroscopeData
  } = useAstrologyData(astrologyConfig);

  const handleSignSelect = useCallback((sign) => {
    setSelectedSign(sign);
    try {
      localStorage.setItem('gnome-selected-sign', sign);
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  }, []);

  const handleNavigate = useCallback((view) => {
    setCurrentView(view);
  }, []);

  const handleAddToFavorites = useCallback((item) => {
    try {
      const favorites = JSON.parse(localStorage.getItem('gnome-favorites') || '[]');
      favorites.push({
        ...item,
        id: Date.now(),
        addedAt: new Date().toISOString()
      });
      localStorage.setItem('gnome-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Ошибка избранного:', error);
    }
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
            loading={loading}
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
            loading={loading}
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
            dataLoading={loading}
            lastUpdated={lastUpdated}
          />
        );
    }
  };

  return (
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
  );
}

export default App;
