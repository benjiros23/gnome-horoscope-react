import { useState, useCallback } from 'react';
import { EnhancedMoonPhase } from '../enhanced_moonPhase';
import { loadMoonData, saveMoonData } from '../enhanced_cache';

const BASE_URL = 'https://d-gnome-horoscope-miniapp-frontend.onrender.com';

const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    const url = `${BASE_URL}${endpoint}`;

    try {
      console.log('🌐 API запрос:', url, options);

      const response = await fetch(url, {
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

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        } catch (parseError) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
          } catch (textError) {
            errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn('⚠️ Ответ не в формате JSON:', text);
        
        if (text.includes('<')) {
          throw new Error('Сервер вернул HTML вместо JSON. Возможно сервер не работает.');
        }
        
        return { data: text, raw: true };
      }

      const data = await response.json();
      console.log('✅ API ответ получен:', {
        endpoint,
        status: response.status,
        dataKeys: Object.keys(data),
        timestamp: new Date().toISOString()
      });

      return data;

    } catch (fetchError) {
      let errorMessage = 'Неизвестная ошибка сети';
      
      if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
        errorMessage = 'Не удается подключиться к серверу. Проверьте интернет соединение.';
      } else if (fetchError.message.includes('CORS')) {
        errorMessage = 'Ошибка CORS. Сервер не настроен для принятия запросов.';
      } else {
        errorMessage = fetchError.message;
      }

      console.error('❌ Ошибка API:', {
        endpoint,
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🚀 ОБНОВЛЕННАЯ функция getMoonData с поддержкой актуальных данных
  const getMoonData = useCallback(async (date = new Date()) => {
    console.log('🌙 Запрос лунных данных для:', date.toISOString().split('T')[0]);

    try {
      // 1. Сначала пробуем получить из кеша
      const cachedData = loadMoonData(date);
      if (cachedData) {
        console.log('📦 Лунные данные загружены из кеша');
        return {
          success: true,
          data: cachedData,
          source: 'cache'
        };
      }

      // 2. Пробуем EnhancedMoonPhase (SunCalc или статические данные)
      const enhancedData = EnhancedMoonPhase.calculatePhase(date);
      if (enhancedData) {
        console.log('🧮 Лунные данные получены через EnhancedMoonPhase:', enhancedData.source);
        
        // Сохраняем в кеш
        saveMoonData(date, enhancedData);
        
        return {
          success: true,
          data: enhancedData,
          source: enhancedData.source
        };
      }

      // 3. Fallback к старому API
      console.log('🌐 Fallback к серверному API...');
      const apiData = await makeRequest('/api/moon');
      
      if (apiData && !apiData.raw) {
        // Преобразуем формат API к формату EnhancedMoonPhase
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

      throw new Error('Не удалось получить данные ни из одного источника');

    } catch (error) {
      console.error('❌ Ошибка получения лунных данных:', error);
      
      // Последний fallback - используем статические данные
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

  const getHoroscope = useCallback(async (sign) => {
    return await makeRequest(`/api/horoscope?sign=${encodeURIComponent(sign)}`);
  }, [makeRequest]);

  const getAstroEvents = useCallback(async () => {
    return await makeRequest('/api/astro-events');
  }, [makeRequest]);

  const getNumerology = useCallback(async (birthDate) => {
    return await makeRequest('/api/numerology', {
      method: 'POST',
      body: JSON.stringify({ birthDate })
    });
  }, [makeRequest]);

  const getCompatibility = useCallback(async (sign1, sign2) => {
    return await makeRequest(`/api/compatibility/${encodeURIComponent(sign1)}/${encodeURIComponent(sign2)}`);
  }, [makeRequest]);

  const getDayCard = useCallback(async () => {
    return await makeRequest('/api/day-card');
  }, [makeRequest]);

  const getMercuryStatus = useCallback(async () => {
    return await makeRequest('/api/mercury');
  }, [makeRequest]);

  return {
    loading,
    error,
    makeRequest,
    getMoonData,
    getHoroscope,
    getAstroEvents,
    getNumerology,
    getCompatibility,
    getDayCard,
    getMercuryStatus
  };
};

// ИСПРАВЛЕННЫЙ ЭКСПОРТ - и default, и named
export default useAPI;
export { useAPI };
