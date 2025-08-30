import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { EnhancedMoonPhase } from '../enhanced_moonPhase';
import { saveMoonData, loadMoonData, saveHoroscope, loadHoroscope } from '../enhanced_cache';

// ===== КОНСТАНТЫ =====
const DEFAULT_UPDATE_INTERVAL = 6 * 60 * 60 * 1000; // 6 часов
const DEFAULT_HOROSCOPE_INTERVAL = 24 * 60 * 60 * 1000; // 24 часа
const DEFAULT_COORDINATES = { lat: 55.7558, lng: 37.6173 }; // Москва
const UPDATE_TEXT_INTERVAL = 60 * 1000; // 1 минута

// ===== УТИЛИТЫ =====
class DataUpdateManager {
  static debounceTimers = new Map();
  
  static debounce(key, fn, delay = 300) {
    if (this.debounceTimers.has(key)) {
      clearTimeout(this.debounceTimers.get(key));
    }
    
    const timer = setTimeout(() => {
      fn();
      this.debounceTimers.delete(key);
    }, delay);
    
    this.debounceTimers.set(key, timer);
  }
}

// Генератор fallback гороскопов
const generateFallbackHoroscope = (sign) => {
  const horoscopes = {
    'Овен': 'Ваша энергия и решительность сегодня на пике! День благоприятен для смелых решений.',
    'Телец': 'Стабильность и упорство принесут плоды. Хорошее время для финансовых решений.',
    'Близнецы': 'День полон интересных встреч и открытий. Ваша коммуникабельность будет высоко оценена.',
    'Рак': 'Интуиция подскажет верные решения. Уделите внимание семье и близким.',
    'Лев': 'Ваш природный магнетизм привлекает удачу! День для творчества и самовыражения.',
    'Дева': 'Внимание к деталям откроет новые возможности. Систематический подход принесет успех.',
    'Весы': 'Гармония в отношениях принесет радость. День для поиска баланса и компромиссов.',
    'Скорпион': 'Глубокие трансформации ведут к росту. Доверьтесь своей интуиции.',
    'Стрелец': 'Новые горизонты манят вас вперед! Расширяйте свои знания и опыт.',
    'Козерог': 'Целеустремленность приведет к вершинам. Планомерная работа даст результаты.',
    'Водолей': 'Оригинальные идеи изменят многое. Время для инноваций и экспериментов.',
    'Рыбы': 'Творческая энергия течет мощным потоком. Следуйте за вдохновением.'
  };

  return horoscopes[sign] || horoscopes['Лев'];
};

// ===== ОСНОВНОЙ ХУУК ДЛЯ АСТРОЛОГИЧЕСКИХ ДАННЫХ =====
export const useAstrologyData = (options = {}) => {
  const {
    autoUpdate = true,
    updateInterval = DEFAULT_UPDATE_INTERVAL,
    coordinates = DEFAULT_COORDINATES,
    zodiacSign = null,
    enableHoroscope = false,
    onDataUpdate = null,
    onError = null,
    debounceDelay = 300
  } = options;

  // Мемоизированные опции
  const memoizedOptions = useMemo(() => ({
    autoUpdate,
    updateInterval,
    coordinates,
    zodiacSign,
    enableHoroscope,
    debounceDelay
  }), [autoUpdate, updateInterval, coordinates, zodiacSign, enableHoroscope, debounceDelay]);

  // Состояние с более детальной информацией
  const [data, setData] = useState({
    moon: null,
    horoscope: null,
    loading: true,
    error: null,
    lastUpdated: null,
    source: null,
    updateCount: 0,
    cache: {
      moonCached: false,
      horoscopeCached: false
    }
  });

  // Рефы для управления
  const updateIntervalRef = useRef(null);
  const mountedRef = useRef(true);
  const lastUpdateTimeRef = useRef(0);

  // Мемоизированная функция обновления лунных данных
  const updateMoonData = useCallback(async (date = new Date()) => {
    const startTime = Date.now();
    
    try {
      console.log('🌙 Обновляем лунные данные...');
      
      // Сначала проверяем кеш
      let moonData = loadMoonData(date);
      let fromCache = !!moonData;
      
      if (!moonData) {
        // Если в кеше нет, получаем свежие данные
        moonData = EnhancedMoonPhase.calculatePhase(date);
        
        // Сохраняем в кеш только если данные успешно получены
        if (moonData) {
          saveMoonData(date, moonData);
          console.log(`✅ Лунные данные получены и сохранены в кеш за ${Date.now() - startTime}ms`);
        }
      } else {
        console.log(`📦 Лунные данные загружены из кеша за ${Date.now() - startTime}ms`);
      }
      
      // Добавляем метаинформацию
      if (moonData) {
        moonData.fromCache = fromCache;
        moonData.loadTime = Date.now() - startTime;
      }
      
      return moonData;
    } catch (error) {
      console.error('❌ Ошибка обновления лунных данных:', error);
      
      // Попытка получить fallback данные
      try {
        const fallbackData = EnhancedMoonPhase.getFallbackData(date);
        if (fallbackData) {
          fallbackData.source = 'fallback';
          fallbackData.fromCache = false;
          return fallbackData;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback данные также недоступны:', fallbackError);
      }
      
      throw error;
    }
  }, []);

  // Мемоизированная функция обновления гороскопа
  const updateHoroscope = useCallback(async (sign) => {
    if (!sign || !enableHoroscope) return null;
    
    const startTime = Date.now();
    
    try {
      console.log(`🔮 Обновляем гороскоп для ${sign}...`);
      
      // Проверяем кеш
      let horoscopeData = loadHoroscope(sign);
      let fromCache = !!horoscopeData;
      
      if (!horoscopeData) {
        // Создаем улучшенный fallback гороскоп
        horoscopeData = {
          zodiac: sign,
          date: new Date().toISOString().split('T')[0],
          horoscope: generateFallbackHoroscope(sign),
          source: 'enhanced_fallback',
          generatedAt: new Date().toISOString(),
          advice: {
            general: generateFallbackHoroscope(sign),
            love: 'Звезды благоволят сердечным делам. Откройтесь новому.',
            work: 'Профессиональная сфера требует внимания. Проявите инициативу.',
            health: 'Прислушивайтесь к потребностям организма. Баланс - ключ к здоровью.'
          }
        };
        
        saveHoroscope(sign, horoscopeData);
        console.log(`✅ Гороскоп создан и сохранен в кеш за ${Date.now() - startTime}ms`);
      } else {
        console.log(`📦 Гороскоп загружен из кеша за ${Date.now() - startTime}ms`);
      }
      
      // Добавляем метаинформацию
      if (horoscopeData) {
        horoscopeData.fromCache = fromCache;
        horoscopeData.loadTime = Date.now() - startTime;
      }
      
      return horoscopeData;
    } catch (error) {
      console.error('❌ Ошибка обновления гороскопа:', error);
      throw error;
    }
  }, [enableHoroscope]);

  // Основная функция обновления всех данных с дебаунсингом
  const updateAllData = useCallback(async (force = false) => {
    if (!mountedRef.current) return;
    
    const now = Date.now();
    
    // Предотвращаем слишком частые обновления
    if (!force && now - lastUpdateTimeRef.current < debounceDelay) {
      console.log('⏱️ Обновление отложено (debounce)');
      return;
    }
    
    lastUpdateTimeRef.current = now;
    
    setData(prev => ({ 
      ...prev, 
      loading: true, 
      error: null 
    }));
    
    try {
      const updatePromises = [
        updateMoonData(),
        updateHoroscope(zodiacSign)
      ];
      
      const results = await Promise.allSettled(updatePromises);
      
      if (!mountedRef.current) return;
      
      const [moonResult, horoscopeResult] = results;
      
      const newData = {
        moon: moonResult.status === 'fulfilled' ? moonResult.value : null,
        horoscope: horoscopeResult.status === 'fulfilled' ? horoscopeResult.value : null,
        loading: false,
        error: moonResult.status === 'rejected' ? moonResult.reason : null,
        lastUpdated: new Date(),
        source: moonResult.value?.source || 'unknown',
        updateCount: data.updateCount + 1,
        cache: {
          moonCached: moonResult.value?.fromCache || false,
          horoscopeCached: horoscopeResult.value?.fromCache || false
        }
      };
      
      setData(newData);
      
      // Вызываем callback если предоставлен
      onDataUpdate?.(newData);
      
      console.log('✅ Данные успешно обновлены:', {
        moon: !!newData.moon,
        horoscope: !!newData.horoscope,
        source: newData.source,
        updateCount: newData.updateCount,
        fromCache: newData.cache
      });
      
    } catch (error) {
      console.error('❌ Критическая ошибка обновления данных:', error);
      
      if (mountedRef.current) {
        const errorData = {
          ...data,
          loading: false,
          error
        };
        
        setData(errorData);
        onError?.(error, errorData);
      }
    }
  }, [updateMoonData, updateHoroscope, zodiacSign, debounceDelay, data.updateCount, onDataUpdate, onError]);

  // Принудительное обновление с дебаунсингом
  const forceUpdate = useCallback(() => {
    console.log('🔄 Принудительное обновление данных');
    DataUpdateManager.debounce('force-update', () => {
      updateAllData(true);
    }, 100);
  }, [updateAllData]);

  // Частичное обновление только луны
  const updateMoonOnly = useCallback(async () => {
    console.log('🌙 Обновление только лунных данных');
    try {
      setData(prev => ({ ...prev, loading: true }));
      const moonData = await updateMoonData();
      setData(prev => ({
        ...prev,
        moon: moonData,
        loading: false,
        lastUpdated: new Date(),
        source: moonData?.source || prev.source
      }));
    } catch (error) {
      setData(prev => ({ ...prev, loading: false, error }));
      onError?.(error);
    }
  }, [updateMoonData, onError]);

  // Эффект для первоначальной загрузки и настройки автообновления
  useEffect(() => {
    mountedRef.current = true;
    
    console.log('🚀 Инициализация useAstrologyData:', memoizedOptions);
    
    // Первоначальная загрузка данных
    updateAllData(true);
    
    // Настройка автообновления
    if (autoUpdate && updateInterval > 0) {
      console.log(`⏰ Настройка автообновления каждые ${updateInterval / 1000 / 60} минут`);
      
      updateIntervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          console.log('⏰ Автоматическое обновление данных');
          updateAllData();
        }
      }, updateInterval);
    }
    
    // Очистка при размонтировании
    return () => {
      console.log('🧹 Очистка useAstrologyData');
      mountedRef.current = false;
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      
      // Очищаем debounce таймеры
      DataUpdateManager.debounceTimers.forEach(timer => clearTimeout(timer));
      DataUpdateManager.debounceTimers.clear();
    };
  }, [updateAllData, memoizedOptions.autoUpdate, memoizedOptions.updateInterval]);

  // Мемоизированный возвращаемый объект
  return useMemo(() => ({
    // Основные данные
    ...data,
    
    // Функции управления
    refresh: forceUpdate,
    updateMoon: updateMoonOnly,
    updateHoroscope: (sign) => updateHoroscope(sign),
    
    // Статус и метаинформация
    isAutoUpdating: autoUpdate && !!updateIntervalRef.current,
    options: memoizedOptions,
    
    // Статистика производительности
    performance: {
      updateCount: data.updateCount,
      cacheHits: {
        moon: data.cache.moonCached,
        horoscope: data.cache.horoscopeCached
      }
    }
  }), [
    data, 
    forceUpdate, 
    updateMoonOnly, 
    updateHoroscope, 
    autoUpdate, 
    memoizedOptions
  ]);
};

// ===== СПЕЦИАЛИЗИРОВАННЫЕ ХУКИ =====

// Хук только для лунных данных (оптимизированный)
export const useMoonData = (options = {}) => {
  const { coordinates, autoUpdate, updateInterval, onDataUpdate, onError } = options;
  
  const memoizedOptions = useMemo(() => ({
    coordinates,
    autoUpdate,
    updateInterval,
    enableHoroscope: false,
    onDataUpdate,
    onError
  }), [coordinates, autoUpdate, updateInterval, onDataUpdate, onError]);
  
  return useAstrologyData(memoizedOptions);
};

// Хук для гороскопа (оптимизированный)
export const useHoroscope = (zodiacSign, options = {}) => {
  const { autoUpdate = true, updateInterval = DEFAULT_HOROSCOPE_INTERVAL, onDataUpdate, onError } = options;
  
  const memoizedOptions = useMemo(() => ({
    zodiacSign,
    autoUpdate,
    updateInterval,
    enableHoroscope: true,
    onDataUpdate,
    onError
  }), [zodiacSign, autoUpdate, updateInterval, onDataUpdate, onError]);
  
  return useAstrologyData(memoizedOptions);
};

// Улучшенный хелпер для форматирования времени обновления
export const useLastUpdateText = (lastUpdated, options = {}) => {
  const { 
    updateInterval = UPDATE_TEXT_INTERVAL,
    showSeconds = false,
    locale = 'ru-RU'
  } = options;
  
  const [updateText, setUpdateText] = useState('');

  const formatUpdateTime = useCallback((lastUpdated, locale, showSeconds) => {
    if (!lastUpdated) return 'Никогда';
    
    const now = new Date();
    const diff = now - lastUpdated;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 30) {
      return 'Только что';
    } else if (seconds < 60 && showSeconds) {
      return `${seconds} сек назад`;
    } else if (minutes < 1) {
      return 'Меньше минуты назад';
    } else if (minutes < 60) {
      return `${minutes} мин назад`;
    } else if (hours < 24) {
      return `${hours} ч назад`;
    } else if (days < 7) {
      return `${days} дн назад`;
    } else {
      return lastUpdated.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }, []);

  useEffect(() => {
    const updateTextFunc = () => {
      const newText = formatUpdateTime(lastUpdated, locale, showSeconds);
      setUpdateText(newText);
    };
    
    updateTextFunc();
    const interval = setInterval(updateTextFunc, updateInterval);
    
    return () => clearInterval(interval);
  }, [lastUpdated, updateInterval, locale, showSeconds, formatUpdateTime]);

  return updateText;
};

// Хук для отслеживания статистики обновлений
export const useAstrologyStats = () => {
  const [stats, setStats] = useState({
    totalUpdates: 0,
    cacheHits: 0,
    errors: 0,
    averageLoadTime: 0,
    lastError: null
  });

  const recordUpdate = useCallback((loadTime, fromCache, error = null) => {
    setStats(prev => ({
      totalUpdates: prev.totalUpdates + 1,
      cacheHits: prev.cacheHits + (fromCache ? 1 : 0),
      errors: prev.errors + (error ? 1 : 0),
      averageLoadTime: (prev.averageLoadTime * prev.totalUpdates + loadTime) / (prev.totalUpdates + 1),
      lastError: error || prev.lastError
    }));
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      totalUpdates: 0,
      cacheHits: 0,
      errors: 0,
      averageLoadTime: 0,
      lastError: null
    });
  }, []);

  return {
    ...stats,
    cacheHitRate: stats.totalUpdates > 0 ? (stats.cacheHits / stats.totalUpdates * 100).toFixed(1) : '0.0',
    errorRate: stats.totalUpdates > 0 ? (stats.errors / stats.totalUpdates * 100).toFixed(1) : '0.0',
    recordUpdate,
    resetStats
  };
};

// Экспорт по умолчанию с дополнительными утилитами
export default {
  useAstrologyData,
  useMoonData,
  useHoroscope,
  useLastUpdateText,
  useAstrologyStats,
  DataUpdateManager,
  generateFallbackHoroscope
};
