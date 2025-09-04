// src/hooks/useAstrologyData.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useAstrologyData = (type, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  // Мемоизированная функция получения mock данных
  const getMockData = useCallback((dataType) => {
    const mockData = {
      moon: { 
        phase: 'Полнолуние', 
        illumination: 98,
        sign: 'Телец',
        energy: 'Высокая',
        recommendations: [
          'Время для завершения проектов',
          'Избегайте новых начинаний',
          'Медитируйте и расслабляйтесь'
        ]
      },
      horoscope: { 
        content: 'Сегодня звезды благоприятствуют новым начинаниям. Ваша энергия на пике!', 
        energy: 85,
        love: 'Романтические встречи возможны во второй половине дня',
        career: 'Отличное время для важных переговоров',
        health: 'Обратите внимание на физическую активность'
      },
      compatibility: { 
        score: 87, 
        description: 'Отличная совместимость! Вы дополняете друг друга.',
        strengths: ['Взаимопонимание', 'Общие интересы', 'Поддержка'],
        challenges: ['Разные темпераменты', 'Нужно больше компромиссов']
      },
      numerology: { 
        number: 7, 
        meaning: 'Число духовности и мудрости',
        characteristics: ['Интуитивность', 'Аналитический ум', 'Стремление к знаниям'],
        recommendations: 'Доверяйте своей интуиции'
      },
      dayCard: { 
        card: 'Маг', 
        meaning: 'Время действовать и использовать свои навыки',
        advice: 'Сосредоточьтесь на целях и действуйте решительно'
      },
      events: {
        upcoming: ['Полнолуние 15 числа', 'Ретроград Меркурия', 'Соединение Венеры и Марса'],
        current: 'Влияние Юпитера усиливается'
      },
      mercury: {
        status: 'Ретроград',
        influence: 'Повышенное влияние на коммуникации',
        period: { start: '1 января', end: '25 января' }
      }
    };
    
    return mockData[dataType] || { 
      message: `Данные типа "${dataType}" загружены`, 
      timestamp: new Date().toISOString()
    };
  }, []);

  // Мемоизированная функция загрузки данных
  const fetchData = useCallback(async () => {
    // Проверяем, что компонент еще смонтирован
    if (!mountedRef.current) return;

    try {
      setLoading(true);
      setError(null);

      // Имитируем асинхронную загрузку
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Еще раз проверяем перед установкой состояния
      if (!mountedRef.current) return;

      const result = getMockData(type);
      setData(result);
      
    } catch (fetchError) {
      if (mountedRef.current) {
        console.error('Ошибка загрузки астрологических данных:', fetchError);
        setError(fetchError.message || 'Произошла ошибка при загрузке данных');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [type, getMockData]); // ВАЖНО: только стабильные зависимости!

  // Единственный useEffect с правильными зависимостями
  useEffect(() => {
    fetchData();
  }, [fetchData]); // fetchData мемоизирован, поэтому безопасен

  // Cleanup при размонтировании компонента
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
    };
  }, []); // Выполняется только при монтировании/размонтировании

  // Функция для принудительного обновления данных
  const refetch = useCallback(() => {
    if (mountedRef.current) {
      fetchData();
    }
  }, [fetchData]);

  return { 
    data, 
    loading, 
    error, 
    refetch 
  };
};

// Специализированные хуки для разных типов данных
// В конце src/hooks/useAstrologyData.js добавьте правильные экспорты алиасов:

// В конце src/hooks/useAstrologyData.js замените секцию экспортов на:

// СПЕЦИАЛИЗИРОВАННЫЕ ХУКИ
export const useMoonData = (options = {}) => {
  return useAstrologyData('moon', options);
};

export const useHoroscopeData = (sign, options = {}) => {
  return useAstrologyData('horoscope', { ...options, sign });
};

export const useCompatibilityData = (sign1, sign2, options = {}) => {
  return useAstrologyData('compatibility', { ...options, sign1, sign2 });
};

export const useNumerologyData = (birthDate, options = {}) => {
  return useAstrologyData('numerology', { ...options, birthDate });
};

export const useDayCardData = (options = {}) => {
  return useAstrologyData('dayCard', options);
};

export const useEventsData = (options = {}) => {
  return useAstrologyData('events', options);
};

export const useMercuryData = (options = {}) => {
  return useAstrologyData('mercury', options);
};

// АЛИАСЫ для обратной совместимости
export const useMoonPhase = useMoonData;
export const useCompatibility = useCompatibilityData;
export const useNumerology = useNumerologyData;
export const useHoroscope = useHoroscopeData;
export const useDayCard = useDayCardData;
export const useEvents = useEventsData;
export const useMercury = useMercuryData;

export default useAstrologyData;

