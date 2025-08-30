import { useState, useEffect, useRef } from 'react';

const useAstrologyData = (config = {}) => {
  const [moonData, setMoonData] = useState(null);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const mountedRef = useRef(true);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    console.log('🚀 Инициализация useAstrologyData');
    
    const loadData = async () => {
      if (!mountedRef.current) return;
      
      setLoading(true);
      
      try {
        // Моковые лунные данные
        const mockMoonData = {
          phase: 'Растущая луна',
          illumination: 0.75,
          age: 12.5,
          distance: 384400,
          source: 'mock',
          timestamp: new Date().toISOString()
        };

        // Моковые данные гороскопа
        const mockHoroscopeData = config.zodiacSign ? {
          sign: config.zodiacSign,
          date: new Date().toISOString().split('T')[0],
          prediction: `Сегодня ${config.zodiacSign} ждет удачный день!`,
          luckyNumber: Math.floor(Math.random() * 100),
          mood: 'positive'
        } : null;

        if (mountedRef.current) {
          setMoonData(mockMoonData);
          if (mockHoroscopeData) {
            setHoroscopeData(mockHoroscopeData);
          }
          setLastUpdated(new Date());
          setLoading(false);
        }

      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      console.log('🧹 Очистка useAstrologyData');
      mountedRef.current = false;
    };
  }, []);

  const updateMoonData = async () => {
    if (!mountedRef.current) return;
    
    const mockData = {
      phase: 'Растущая луна',
      illumination: Math.random(),
      age: Math.random() * 29.5,
      distance: 384400,
      source: 'mock',
      timestamp: new Date().toISOString()
    };
    
    setMoonData(mockData);
    setLastUpdated(new Date());
  };

  const updateHoroscopeData = async () => {
    if (!mountedRef.current || !config.zodiacSign) return;
    
    const mockData = {
      sign: config.zodiacSign,
      date: new Date().toISOString().split('T')[0],
      prediction: `Обновленный прогноз для ${config.zodiacSign}!`,
      luckyNumber: Math.floor(Math.random() * 100),
      mood: 'positive'
    };
    
    setHoroscopeData(mockData);
    setLastUpdated(new Date());
  };

  return {
    moonData,
    horoscopeData,
    loading,
    lastUpdated,
    updateMoonData,
    updateHoroscopeData,
    coordinates: config.coordinates || { lat: 55.7558, lng: 37.6173 }
  };
};

export default useAstrologyData;
