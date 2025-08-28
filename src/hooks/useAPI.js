import { useState, useCallback } from 'react';

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
        
        if (text.includes('<html>')) {
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

  const getMoonData = useCallback(async () => {
    return await makeRequest('/api/moon');
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
