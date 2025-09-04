// src/hooks/useRealHoroscope.js - Обновленный хук для работы с новым API
import { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';

const useRealHoroscope = (sign, date = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // 🧙‍♂️ Получить userId из Telegram WebApp
  const getUserId = () => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg?.initDataUnsafe?.user?.id) {
        return tg.initDataUnsafe.user.id;
      }
    } catch (e) {
      console.warn('Не удалось получить userId из Telegram:', e);
    }
    return null;
  };

  useEffect(() => {
    if (!sign) return;
    
    mountedRef.current = true;

    const fetchHoroscopeData = async () => {
      if (!mountedRef.current) return;
      
      setLoading(true);
      setError(null);

      try {
        console.log('🔮 Запрашиваем гороскоп с нового API для знака:', sign);
        
        const userId = getUserId();
        const horoscopeData = await apiService.getHoroscope(sign, date, userId);
        
        console.log('✅ Получен гороскоп:', horoscopeData);
        
        if (mountedRef.current) {
          setData(horoscopeData);
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки гороскопа:', err);
        if (mountedRef.current) {
          setError(err.message || 'Ошибка загрузки гороскопа');
          
          // Показываем mock данные при ошибке
          const mockData = {
            sign,
            date: date || new Date().toISOString().split('T')[0],
            text: "🧙‍♂️ Звезды временно молчат, но гномы шепчут: сегодня отличный день для новых начинаний!",
            cached: false,
            source: "fallback"
          };
          setData(mockData);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchHoroscopeData();

    return () => {
      mountedRef.current = false;
    };
  }, [sign, date]);

  // Функция для принудительного обновления данных
  const refetch = () => {
    if (sign && mountedRef.current) {
      setLoading(true);
      setError(null);
      
      const fetchData = async () => {
        try {
          const userId = getUserId();
          const horoscopeData = await apiService.getHoroscope(sign, date, userId);
          if (mountedRef.current) {
            setData(horoscopeData);
          }
        } catch (err) {
          if (mountedRef.current) {
            setError(err.message || 'Ошибка загрузки данных');
          }
        } finally {
          if (mountedRef.current) {
            setLoading(false);
          }
        }
      };
      
      fetchData();
    }
  };

  // Проверить, получен ли гороскоп с сервера
  const isFromServer = data?.source === 'real_api' || data?.source === 'cache';
  
  // Проверить, из кэша ли данные
  const isCached = data?.cached === true;
  
  // Получить источник данных
  const dataSource = data?.source || 'unknown';

  return { 
    data, 
    loading, 
    error, 
    refetch,
    
    // 🧙‍♂️ Дополнительная информация
    isFromServer,
    isCached,
    dataSource,
    hasData: !!data
  };
};

export default useRealHoroscope;
