import { useState, useEffect, useCallback } from 'react';
import { loadCachedData, saveCachedData } from '../enhanced_cache';
import { getMoonPhaseData } from '../enhanced_moonPhase';

const useAstrologyData = (config = {}) => {
  const {
    autoUpdate = true,
    updateInterval = 6 * 60 * 60 * 1000, // 6 часов
    coordinates = { lat: 55.7558, lng: 37.6173 }, // Москва по умолчанию
    zodiacSign = null,
    enableMoon = true,
    enableHoroscope = false
  } = config;

  const [moonData, setMoonData] = useState(null);
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);

  // СТАБИЛЬНЫЕ ФУНКЦИИ - БЕЗ ЗАВИСИМОСТЕЙ В useCallback
  const updateMoonData = useCallback(async () => {
    if (!enableMoon) return false;
    
    try {
      console.log('🌙 Обновляем лунные данные...');
      const startTime = performance.now();
      
      const cacheKey = `moon_${new Date().toISOString().split('T')[0]}`;
      
      // Проверяем кеш
      const cached = loadCachedData(cacheKey, 4 * 60); // 4 часа
      if (cached) {
        setMoonData(cached);
        const loadTime = Math.round(performance.now() - startTime);
        console.log(`📦 Лунные данные загружены из кеша за ${loadTime}ms`);
        return true;
      }

      // Получаем новые данные
      const data = await getMoonPhaseData(coordinates);
      if (data) {
        setMoonData(data);
        saveCachedData(cacheKey, data);
        const loadTime = Math.round(performance.now() - startTime);
        console.log(`🌙 Новые лунные данные получены за ${loadTime}ms`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Ошибка обновления лунных данных:', error);
      return false;
    }
  }, []); // БЕЗ ЗАВИСИМОСТЕЙ!

  const updateHoroscopeData = useCallback(async () => {
    if (!enableHoroscope || !zodiacSign) return false;
    
    try {
      console.log(`⭐ Обновляем гороскоп для ${zodiacSign}...`);
      const startTime = performance.now();
      
      const cacheKey = `horoscope_${zodiacSign}_${new Date().toISOString().split('T')[0]}`;
      
      // Проверяем кеш
      const cached = loadCachedData(cacheKey, 2 * 60); // 2 часа
      if (cached) {
        setHoroscopeData(cached);
        const loadTime = Math.round(performance.now() - startTime);
        console.log(`📦 Гороскоп загружен из кеша за ${loadTime}ms`);
        return true;
      }

      // Здесь можно добавить получение гороскопа из API
      const mockData = {
        sign: zodiacSign,
        date: new Date().toISOString().split('T')[0],
        prediction: `Сегодня ${zodiacSign} ждет удачный день!`,
        luckyNumber: Math.floor(Math.random() * 100),
        mood: 'positive'
      };
      
      setHoroscopeData(mockData);
      saveCachedData(cacheKey, mockData);
      const loadTime = Math.round(performance.now() - startTime);
      console.log(`⭐ Новый гороскоп получен за ${loadTime}ms`);
      return true;
    } catch (error) {
      console.error('❌ Ошибка обновления гороскопа:', error);
      return false;
    }
  }, []); // БЕЗ ЗАВИСИМОСТЕЙ!

  // ГЛАВНЫЙ useEffect - ИСПРАВЛЯЕМ ЗАВИСИМОСТИ
  useEffect(() => {
    let mounted = true;
    let intervalId = null;

    const initializeData = async () => {
      if (!mounted) return;
      
      setLoading(true);
      setUpdateCount(prev => prev + 1);
      
      try {
        console.log('🚀 Инициализация useAstrologyData:', {
          autoUpdate,
          updateInterval,
          coordinates,
          zodiacSign,
          enableMoon,
          enableHoroscope
        });
        
        const results = {
          moon: false,
          horoscope: false,
          source: 'static',
          updateCount: updateCount + 1,
          fromCache: {}
        };
        
        // Обновляем данные
        if (enableMoon) {
          results.moon = await updateMoonData();
        }
        
        if (enableHoroscope && zodiacSign) {
          results.horoscope = await updateHoroscopeData();
        }
        
        setLastUpdated(new Date());
        console.log('✅ Данные успешно обновлены:', results);
        
        // Настройка автообновления ТОЛЬКО ОДИН РАЗ
        if (autoUpdate && !intervalId) {
          intervalId = setInterval(async () => {
            if (!mounted) return;
            
            console.log('🔄 Автообновление данных...');
            if (enableMoon) await updateMoonData();
            if (enableHoroscope && zodiacSign) await updateHoroscopeData();
            setLastUpdated(new Date());
          }, updateInterval);
          
          console.log(`⏰ Настройка автообновления каждые ${updateInterval / 60000} минут`);
        }
        
      } catch (error) {
        console.error('❌ Ошибка инициализации useAstrologyData:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      mounted = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      console.log('🧹 Очистка useAstrologyData');
    };
  }, [
    // ТОЛЬКО ПРИМИТИВНЫЕ ЗНАЧЕНИЯ!
    autoUpdate,
    updateInterval,
    enableMoon,
    enableHoroscope,
    zodiacSign,
    coordinates.lat,
    coordinates.lng
  ]); // НЕ ВКЛЮЧАЕМ ФУНКЦИИ!

  return {
    moonData,
    horoscopeData,
    loading,
    lastUpdated,
    updateCount,
    updateMoonData,
    updateHoroscopeData,
    coordinates
  };
};

export default useAstrologyData;
