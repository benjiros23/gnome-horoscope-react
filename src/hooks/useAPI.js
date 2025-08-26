import { useState, useCallback } from 'react';

// ИСПРАВЛЕНО: Хардкодим правильный URL для Render
const API_BASE = 'https://d-gnome-horoscope-miniapp-frontend.onrender.com';

console.log('🔗 API_BASE установлен:', API_BASE);

/**
 * Кастомный хук для работы с API Гномьего Гороскопа
 */
export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const apiCall = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    const timeoutId = setTimeout(() => {
      throw new Error('Превышено время ожидания запроса (30 сек)');
    }, 30000);
    
    try {
      const fullUrl = `${API_BASE}${endpoint}`;
      console.log(`🌐 API запрос: ${fullUrl}`, options);
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
        mode: 'cors',
        credentials: 'omit', // Убрали include для CORS
        ...options,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.warn('Не удалось распарсить ошибку от сервера:', parseError);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('✅ API ответ получен:', {
        endpoint,
        status: response.status,
        dataKeys: Object.keys(data),
        timestamp: new Date().toISOString()
      });
      
      return data;
      
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('❌ Ошибка API:', {
        endpoint,
        error: err.message,
        timestamp: new Date().toISOString()
      });
      
      let userFriendlyMessage = 'Произошла ошибка при запросе к серверу';
      
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        userFriendlyMessage = 'Не удалось подключиться к серверу. Сервер временно недоступен.';
      } else if (err.message.includes('timeout')) {
        userFriendlyMessage = 'Превышено время ожидания. Попробуйте еще раз.';
      } else if (err.message.includes('400')) {
        userFriendlyMessage = 'Некорректные данные запроса';
      } else if (err.message.includes('404')) {
        userFriendlyMessage = 'Запрашиваемый ресурс не найден';
      } else if (err.message.includes('500')) {
        userFriendlyMessage = 'Ошибка сервера. Попробуйте позже.';
      } else if (err.message) {
        userFriendlyMessage = err.message;
      }
      
      setError(userFriendlyMessage);
      throw new Error(userFriendlyMessage);
      
    } finally {
      setLoading(false);
    }
  }, []);

  // API методы
  const getHoroscope = useCallback((sign) => {
    if (!sign) {
      throw new Error('Знак зодиака обязателен');
    }
    return apiCall(`/api/horoscope?sign=${encodeURIComponent(sign)}`);
  }, [apiCall]);
  
  const getDayCard = useCallback(() => {
    return apiCall('/api/day-card', { method: 'POST' });
  }, [apiCall]);
  
  const getAdvice = useCallback(() => {
    return apiCall('/api/advice');
  }, [apiCall]);
  
  const getMoonData = useCallback(() => {
    return apiCall('/api/moon');
  }, [apiCall]);
  
  const calculateNumerology = useCallback((birthDate) => {
    if (!birthDate) {
      throw new Error('Дата рождения обязательна');
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      throw new Error('Дата должна быть в формате YYYY-MM-DD');
    }
    
    return apiCall('/api/numerology', {
      method: 'POST',
      body: JSON.stringify({ birthDate }),
    });
  }, [apiCall]);
  
  const checkCompatibility = useCallback((sign1, sign2) => {
    if (!sign1 || !sign2) {
      throw new Error('Оба знака зодиака обязательны');
    }
    
    return apiCall('/api/compatibility', {
      method: 'POST',
      body: JSON.stringify({ sign1, sign2 }),
    });
  }, [apiCall]);
  
  const getAstroEvents = useCallback(() => {
    return apiCall('/api/astro-events');
  }, [apiCall]);
  
  const getMercuryStatus = useCallback(() => {
    return apiCall('/api/mercury');
  }, [apiCall]);

  const checkAPIHealth = useCallback(() => {
    return apiCall('/');
  }, [apiCall]);

  const checkConnection = useCallback(async () => {
    try {
      await checkAPIHealth();
      return true;
    } catch (error) {
      console.warn('Сервер недоступен:', error.message);
      return false;
    }
  }, [checkAPIHealth]);

  const getAPIVersion = useCallback(async () => {
    try {
      const health = await checkAPIHealth();
      return health.version || 'unknown';
    } catch (error) {
      return 'unavailable';
    }
  }, [checkAPIHealth]);

  return {
    loading,
    error,
    clearError,
    checkConnection,
    getAPIVersion,
    getHoroscope,
    getDayCard,
    getAdvice,
    getMoonData,
    calculateNumerology,
    checkCompatibility,
    getAstroEvents,
    getMercuryStatus,
    checkAPIHealth,
  };
}

// Дополнительный хук для кеширования
export function useAPICache() {
  const [cache, setCache] = useState(new Map());
  
  const getCachedData = useCallback((key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 минут
      return cached.data;
    }
    return null;
  }, [cache]);
  
  const setCachedData = useCallback((key, data) => {
    setCache(prev => new Map(prev.set(key, {
      data,
      timestamp: Date.now()
    })));
  }, []);
  
  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);
  
  return {
    getCachedData,
    setCachedData,
    clearCache
  };
}

export const API_ENDPOINTS = {
  HOROSCOPE: '/api/horoscope',
  DAY_CARD: '/api/day-card',
  ADVICE: '/api/advice',
  MOON: '/api/moon',
  NUMEROLOGY: '/api/numerology',
  COMPATIBILITY: '/api/compatibility',
  ASTRO_EVENTS: '/api/astro-events',
  MERCURY: '/api/mercury',
  HEALTH: '/'
};

export const ZODIAC_SIGNS = [
  'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
  'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
];

export default useAPI;
