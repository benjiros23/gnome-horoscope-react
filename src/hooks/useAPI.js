import { useState, useCallback, useRef } from 'react';
import { EnhancedMoonPhase } from '../enhanced_moonPhase';
import { loadMoonData, saveMoonData } from '../enhanced_cache';

// ===== КОНСТАНТЫ =====
const BASE_URL = 'https://d-gnome-horoscope-miniapp-frontend.onrender.com';

const API_ENDPOINTS = {
  MOON: '/api/moon',
  HOROSCOPE: '/api/horoscope',
  ASTRO_EVENTS: '/api/astro-events',
  NUMEROLOGY: '/api/numerology',
  COMPATIBILITY: '/api/compatibility',
  DAY_CARD: '/api/day-card',
  MERCURY: '/api/mercury'
};

const ERROR_MESSAGES = {
  NETWORK: 'Не удается подключиться к серверу. Проверьте интернет соединение.',
  CORS: 'Ошибка CORS. Сервер не настроен для принятия запросов.',
  HTML_RESPONSE: 'Сервер вернул HTML вместо JSON. Возможно сервер не работает.',
  NO_DATA_SOURCE: 'Не удалось получить данные ни из одного источника',
  UNKNOWN: 'Неизвестная ошибка сети'
};

// ===== УТИЛИТЫ =====
const createRequestConfig = (options = {}) => ({
  method: options.method || 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  },
  mode: 'cors',
  credentials: 'omit',
  ...options
});

const parseErrorResponse = async (response) => {
  try {
    const errorData = await response.json();
    return errorData.message || `HTTP ${response.status}: ${response.statusText}`;
  } catch (parseError) {
    try {
      const errorText = await response.text();
      return errorText || `HTTP ${response.status}: ${response.statusText}`;
    } catch (textError) {
      return `HTTP ${response.status}: ${response.statusText}`;
    }
  }
};

const normalizeApiError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
    return ERROR_MESSAGES.NETWORK;
  }
  
  if (error.message.includes('CORS')) {
    return ERROR_MESSAGES.CORS;
  }
  
  return error.message || ERROR_MESSAGES.UNKNOWN;
};

// ===== ОСНОВНОЙ ХУК =====
const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestCache = useRef(new Map());
  const abortControllerRef = useRef(null);

  // Базовая функция для HTTP запросов
  const makeRequest = useCallback(async (endpoint, options = {}) => {
    // Отменяем предыдущий запрос если он выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const requestConfig = {
      ...createRequestConfig(options),
      signal: abortControllerRef.current.signal
    };

    setLoading(true);
    setError(null);

    const url = `${BASE_URL}${endpoint}`;
    const cacheKey = `${url}-${JSON.stringify(requestConfig)}`;

    try {
      // Проверяем кеш для GET запросов
      if (requestConfig.method === 'GET' && requestCache.current.has(cacheKey)) {
        const cachedData = requestCache.current.get(cacheKey);
        const isExpired = Date.now() - cachedData.timestamp > 5 * 60 * 1000; // 5 минут
        
        if (!isExpired) {
          console.log('📦 Данные загружены из кеша API:', endpoint);
          return cachedData.data;
        }
      }

      console.log('🌐 API запрос:', url);

      const response = await fetch(url, requestConfig);

      if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('⚠️ Ответ не в формате JSON:', text.substring(0, 100));
        
        if (text.includes('<')) {
          throw new Error(ERROR_MESSAGES.HTML_RESPONSE);
        }
        
        return { data: text, raw: true };
      }

      const data = await response.json();

      // Кешируем успешные GET запросы
      if (requestConfig.method === 'GET') {
        requestCache.current.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      console.log('✅ API ответ получен:', {
        endpoint,
        status: response.status,
        dataType: typeof data,
        timestamp: new Date().toISOString()
      });

      return data;

    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        console.log('🚫 Запрос отменен:', endpoint);
        return null;
      }

      const errorMessage = normalizeApiError(fetchError);
      
      console.error('❌ Ошибка API:', {
        endpoint,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      setError(errorMessage);
      throw new Error(errorMessage);

    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  // Функция получения лунных данных с fallback стратегией
  const getMoonData = useCallback(async (date = new Date()) => {
    const dateString = date.toISOString().split('T')[0];
    console.log('🌙 Запрос лунных данных для:', dateString);

    try {
      // 1. Проверяем кеш
      const cachedData = loadMoonData(date);
      if (cachedData) {
        console.log('📦 Лунные данные из кеша');
        return {
          success: true,
          data: cachedData,
          source: 'cache'
        };
      }

      // 2. Пробуем EnhancedMoonPhase
      const enhancedData = EnhancedMoonPhase.calculatePhase(date);
      if (enhancedData) {
        console.log('🧮 Данные через EnhancedMoonPhase:', enhancedData.source);
        saveMoonData(date, enhancedData);
        
        return {
          success: true,
          data: enhancedData,
          source: enhancedData.source
        };
      }

      // 3. Fallback к API
      console.log('🌐 Fallback к серверному API...');
      const apiData = await makeRequest(API_ENDPOINTS.MOON);
      
      if (apiData && !apiData.raw) {
        const normalizedData = {
          phase: apiData.current?.phase || 'Неизвестная фаза',
          emoji: apiData.current?.emoji || '🌙',
          illumination: apiData.current?.illumination || 0,
          age: apiData.current?.age || 0,
          lunarDay: apiData.current?.age ? Math.floor(apiData.current.age) + 1 : 1,
          isWaxing: apiData.current?.age ? apiData.current.age < 14.7 : false,
          moonrise: apiData.current?.moonrise || 'Нет данных',
          moonset: apiData.current?.moonset || 'Нет данных',
          source: 'api'
        };

        saveMoonData(date, normalizedData);
        
        return {
          success: true,
          data: normalizedData,
          source: 'api'
        };
      }

      throw new Error(ERROR_MESSAGES.NO_DATA_SOURCE);

    } catch (error) {
      console.error('❌ Ошибка получения лунных данных:', error.message);

      // Последний fallback - статические данные
      const fallbackData = EnhancedMoonPhase.getFallbackData(date);
      
      if (fallbackData) {
        console.log('🆘 Используем fallback данные');
        return {
          success: false,
          data: fallbackData,
          source: 'fallback',
          error: error.message
        };
      }

      return {
        success: false,
        data: null,
        source: 'none',
        error: error.message
      };
    }
  }, [makeRequest]);

  // Остальные API методы
  const getHoroscope = useCallback(async (sign) => {
    if (!sign) {
      throw new Error('Знак зодиака обязателен');
    }
    
    return await makeRequest(`${API_ENDPOINTS.HOROSCOPE}?sign=${encodeURIComponent(sign)}`);
  }, [makeRequest]);

  const getAstroEvents = useCallback(async () => {
    return await makeRequest(API_ENDPOINTS.ASTRO_EVENTS);
  }, [makeRequest]);

  const getNumerology = useCallback(async (birthDate) => {
    if (!birthDate) {
      throw new Error('Дата рождения обязательна');
    }

    return await makeRequest(API_ENDPOINTS.NUMEROLOGY, {
      method: 'POST',
      body: JSON.stringify({ birthDate })
    });
  }, [makeRequest]);

  const getCompatibility = useCallback(async (sign1, sign2) => {
    if (!sign1 || !sign2) {
      throw new Error('Оба знака зодиака обязательны');
    }

    return await makeRequest(
      `${API_ENDPOINTS.COMPATIBILITY}/${encodeURIComponent(sign1)}/${encodeURIComponent(sign2)}`
    );
  }, [makeRequest]);

  const getDayCard = useCallback(async () => {
    return await makeRequest(API_ENDPOINTS.DAY_CARD);
  }, [makeRequest]);

  const getMercuryStatus = useCallback(async () => {
    return await makeRequest(API_ENDPOINTS.MERCURY);
  }, [makeRequest]);

  // Функция очистки кеша
  const clearCache = useCallback(() => {
    requestCache.current.clear();
    console.log('🗑️ API кеш очищен');
  }, []);

  // Отмена текущих запросов при размонтировании
  const cancelRequests = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    // Состояние
    loading,
    error,
    
    // Основные методы
    makeRequest,
    getMoonData,
    getHoroscope,
    getAstroEvents,
    getNumerology,
    getCompatibility,
    getDayCard,
    getMercuryStatus,
    
    // Утилиты
    clearCache,
    cancelRequests
  };
};

export default useAPI;
export { useAPI };
