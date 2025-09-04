// src/hooks/useRealMoonData.js
import { useState, useEffect, useRef } from 'react';
import apiService from '../services/api';

const useRealMoonData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const fetchMoonData = async () => {
      if (!mountedRef.current) return;
      
      setLoading(true);
      setError(null);

      try {
        console.log('🌙 Запрашиваем лунные данные с сервера...');
        const moonData = await apiService.getMoonData();
        console.log('✅ Получены лунные данные:', moonData);
        
        if (mountedRef.current) {
          setData(moonData);
        }
      } catch (err) {
        console.error('❌ Ошибка загрузки лунных данных:', err);
        if (mountedRef.current) {
          setError(err.message || 'Ошибка загрузки лунных данных');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchMoonData();

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
          const moonData = await apiService.getMoonData();
          if (mountedRef.current) {
            setData(moonData);
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

export default useRealMoonData;
