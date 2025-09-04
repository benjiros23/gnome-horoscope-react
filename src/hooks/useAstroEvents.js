// src/hooks/useAstroEvents.js
import { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';

const useAstroEvents = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const fetchAstroEvents = async () => {
      if (!mountedRef.current) return;
      
      setLoading(true);
      setError(null);

      try {
        console.log('🌌 Запрашиваем астрособытия с сервера...');
        const eventsData = await apiService.getAstroEvents();
        console.log('✅ Получены астрособытия:', eventsData);
        
        if (mountedRef.current) {
          setData(eventsData);
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки астрособытий:', err);
        if (mountedRef.current) {
          setError(err.message || 'Ошибка загрузки астрособытий');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchAstroEvents();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Функция для принудительного обновления данных
  const refetch = () => {
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
      
      const fetchData = async () => {
        try {
          const eventsData = await apiService.getAstroEvents();
          if (mountedRef.current) {
            setData(eventsData);
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

  return { 
    data, 
    loading, 
    error, 
    refetch 
  };
};

export default useAstroEvents;
