import { useState, useCallback } from 'react';
import axios from 'axios';
import { MoonAPI } from '../services/moonAPI';

// URL бэкенда (если нужен)
const API_BASE = 'https://d-gnome-horoscope-miniapp-frontend.onrender.com';

export function useAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Универсальный метод для API запросов (для других эндпоинтов)
  const makeRequest = useCallback(async (endpoint, options = {}) => {
    const { method = 'GET', data, timeout = 5000 } = options;
    
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url: `${API_BASE}${endpoint}`,
        timeout,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      if (data) {
        config.data = data;
      }

      console.log(`🌐 API запрос:`, endpoint);
      
      const response = await axios(config);
      
      console.log('✅ Успешный ответ:', response.data);
      setLoading(false);
      return response.data;

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Произошла ошибка';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  // Получить гороскоп
  const getHoroscope = useCallback(async (sign) => {
    try {
      return await makeRequest(`/api/horoscope?sign=${encodeURIComponent(sign)}`);
    } catch (error) {
      return {
        sign,
        text: `Звезды временно скрыты облаками, но мудрый гном знает: сегодня особенный день для ${sign}! Доверьтесь интуиции и будьте открыты для новых возможностей. 🧙‍♂️`,
        date: new Date().toISOString(),
        type: 'fallback',
        source: 'offline'
      };
    }
  }, [makeRequest]);

  // Получить данные о луне (ОСНОВНОЙ МЕТОД)
  const getMoonData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🌙 Загружаем актуальные данные о луне...');
      
      // Получаем геолокацию пользователя
      const location = await MoonAPI.getUserLocation();
      console.log('📍 Локация пользователя:', location);
      
      // Получаем текущие данные луны
      const currentMoonData = await MoonAPI.getCurrentMoonData({
        latitude: location.latitude,
        longitude: location.longitude,
        date: new Date()
      });
      
      // Получаем календарь на неделю
      const calendar = await MoonAPI.getWeeklyCalendar({
        latitude: location.latitude,
        longitude: location.longitude
      });
      
      // Советы гномов
      const advice = getMoonAdvice(currentMoonData.phase);
      
      // Простые времена восхода/захода (можно улучшить)
      const moonTimes = calculateMoonTimes(currentMoonData.age);
      
      const result = {
        current: {
          ...currentMoonData,
          date: new Date().toISOString(),
          advice
        },
        calendar,
        moonrise: moonTimes.moonrise,
        moonset: moonTimes.moonset,
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        nextFullMoon: 'Рассчитывается...',
        nextNewMoon: 'Рассчитывается...',
        source: currentMoonData.source || 'internet'
      };
      
      setLoading(false);
      console.log('✅ Лунные данные успешно загружены:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Ошибка загрузки лунных данных:', error);
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }, []);

  // Вспомогательная функция для расчета времен восхода/захода
  const calculateMoonTimes = (moonAge) => {
    // Простой расчет на основе возраста луны
    const baseRise = 6 + (moonAge / 29.53 * 12);
    const baseSet = 18 + (moonAge / 29.53 * 12);
    
    const riseHour = Math.floor(baseRise % 24);
    const riseMin = Math.floor((baseRise % 1) * 60);
    
    const setHour = Math.floor(baseSet % 24);
    const setMin = Math.floor((baseSet % 1) * 60);
    
    return {
      moonrise: `${riseHour.toString().padStart(2, '0')}:${riseMin.toString().padStart(2, '0')}`,
      moonset: `${setHour.toString().padStart(2, '0')}:${setMin.toString().padStart(2, '0')}`
    };
  };

  // Советы гномов
  const getMoonAdvice = (phaseName) => {
    const advice = {
      'Новолуние': {
        title: 'Время новых начинаний',
        text: 'Гном Мечтатель шепчет: луна скрыта, но энергия перемен зарождается. Загадывайте желания и планируйте будущее.',
        activities: ['Планирование', 'Медитация', 'Постановка целей'],
        avoid: ['Важные решения', 'Крупные покупки']
      },
      'Молодая луна': {
        title: 'Время роста и действий',
        text: 'Гном Труженик кует планы: растущая луна дает силу для новых дел. Начинайте проекты!',
        activities: ['Новые проекты', 'Обучение', 'Физическая активность'],
        avoid: ['Лень', 'Откладывание дел']
      },
      'Первая четверть': {
        title: 'Время преодоления препятствий',
        text: 'Гном Воин точит меч: настал час испытаний. Трудности делают вас сильнее!',
        activities: ['Решение проблем', 'Спорт', 'Важные переговоры'],
        avoid: ['Сомнения', 'Страхи']
      },
      'Растущая луна': {
        title: 'Время накопления сил',
        text: 'Гном Мудрый собирает травы: продолжайте начатое, энергия растет.',
        activities: ['Развитие проектов', 'Творчество', 'Саморазвитие'],
        avoid: ['Излишества', 'Переутомление']
      },
      'Полнолуние': {
        title: 'Пик энергии и завершений',
        text: 'Гном Маг зажигает свечи: максимум лунной силы! Завершайте дела, контролируйте эмоции.',
        activities: ['Завершение проектов', 'Празднование', 'Медитации'],
        avoid: ['Импульсивность', 'Конфликты', 'Переедание']
      },
      'Убывающая луна': {
        title: 'Время освобождения',
        text: 'Гном Целитель варит отвары: избавляйтесь от лишнего. Освободите место для нового.',
        activities: ['Очищение', 'Прощение', 'Избавление от хлама'],
        avoid: ['Новые обязательства', 'Накопительство']
      },
      'Последняя четверть': {
        title: 'Время переосмысления',
        text: 'Гном Философ читает свитки: анализируйте прошлое, делайте выводы.',
        activities: ['Анализ ошибок', 'Планирование', 'Обучение'],
        avoid: ['Поспешные решения', 'Критика других']
      },
      'Старая луна': {
        title: 'Время подготовки к новому',
        text: 'Гном Мудрец готовится к отдыху: цикл завершается. Отдохните перед новым началом.',
        activities: ['Отдых', 'Медитация', 'Завершение дел'],
        avoid: ['Стресс', 'Новые проекты']
      }
    };

    return advice[phaseName] || advice['Новолуние'];
  };

  // Остальные методы API (карта дня, советы и т.д.)
  const getDayCard = useCallback(async (initData, sign, userId) => {
    // Используем fallback для карты дня
    const fallbackCards = [
      { title: 'Молот Творчества', text: 'Сегодня в ваших руках сила созидания. Используйте её мудро!' },
      { title: 'Щит Защиты', text: 'Вы под защитой гномьих духов. Идите вперед смело!' },
      { title: 'Ключ Мудрости', text: 'Древние знания открывают новые возможности.' }
    ];
    
    const randomCard = fallbackCards[Math.floor(Math.random() * fallbackCards.length)];
    return {
      ...randomCard,
      date: new Date().toISOString(),
      type: 'day-card',
      source: 'offline'
    };
  }, []);

  return {
    // Состояние
    loading,
    error,
    
    // Методы API
    getHoroscope,
    getMoonData, // Основной метод для луны
    getDayCard,
    
    // Утилиты
    clearError: () => setError(null)
  };
}
