// React Hook для работы с актуальными астрологическими данными
// Поддерживает автоматическое обновление и кеширование

import { useState, useEffect, useCallback, useRef } from 'react';
import { EnhancedMoonPhase } from './enhanced_moonPhase';
import { saveMoonData, loadMoonData, saveHoroscope, loadHoroscope } from './enhanced_cache';

// ===== ОСНОВНОЙ ХOOK ДЛЯ АСТРОЛОГИЧЕСКИХ ДАННЫХ =====

export const useAstrologyData = (options = {}) => {
  const {
    autoUpdate = true,
    updateInterval = 6 * 60 * 60 * 1000, // 6 часов по умолчанию
    coordinates = { lat: 55.7558, lng: 37.6173 }, // Москва по умолчанию
    zodiacSign = null,
    enableHoroscope = false
  } = options;

  // Состояние
  const [data, setData] = useState({
    moon: null,
    horoscope: null,
    loading: true,
    error: null,
    lastUpdated: null,
    source: null
  });

  // Рефы для управления интервалами
  const updateIntervalRef = useRef(null);
  const mountedRef = useRef(true);

  // Функция обновления лунных данных
  const updateMoonData = useCallback(async (date = new Date()) => {
    try {
      console.log('🌙 Обновляем лунные данные...');

      // Сначала проверяем кеш
      let moonData = loadMoonData(date);

      if (!moonData) {
        // Если в кеше нет, получаем свежие данные
        moonData = EnhancedMoonPhase.calculatePhase(date);

        // Сохраняем в кеш только если данные успешно получены
        if (moonData) {
          saveMoonData(date, moonData);
        }
      }

      return moonData;
    } catch (error) {
      console.error('Ошибка обновления лунных данных:', error);
      throw error;
    }
  }, []);

  // Функция обновления гороскопа
  const updateHoroscope = useCallback(async (sign) => {
    if (!sign || !enableHoroscope) return null;

    try {
      console.log(`🔮 Обновляем гороскоп для ${sign}...`);

      // Проверяем кеш
      let horoscopeData = loadHoroscope(sign);

      if (!horoscopeData) {
        // Здесь будет интеграция с API гороскопов
        // Пока возвращаем заглушку
        horoscopeData = {
          zodiac: sign,
          date: new Date().toISOString().split('T')[0],
          horoscope: `Сегодня для ${sign} день полон возможностей! Звезды благоволят новым начинаниям.`,
          source: 'placeholder'
        };

        saveHoroscope(sign, horoscopeData);
      }

      return horoscopeData;
    } catch (error) {
      console.error('Ошибка обновления гороскопа:', error);
      throw error;
    }
  }, [enableHoroscope]);

  // Основная функция обновления всех данных
  const updateAllData = useCallback(async () => {
    if (!mountedRef.current) return;

    setData(prev => ({ ...prev, loading: true, error: null }));

    try {
      const [moonResult, horoscopeResult] = await Promise.allSettled([
        updateMoonData(),
        updateHoroscope(zodiacSign)
      ]);

      if (!mountedRef.current) return;

      const newData = {
        moon: moonResult.status === 'fulfilled' ? moonResult.value : null,
        horoscope: horoscopeResult.status === 'fulfilled' ? horoscopeResult.value : null,
        loading: false,
        error: moonResult.status === 'rejected' ? moonResult.reason : null,
        lastUpdated: new Date(),
        source: moonResult.value?.source || 'unknown'
      };

      setData(newData);

      console.log('✅ Данные успешно обновлены:', {
        moon: !!newData.moon,
        horoscope: !!newData.horoscope,
        source: newData.source
      });

    } catch (error) {
      if (mountedRef.current) {
        setData(prev => ({
          ...prev,
          loading: false,
          error
        }));
      }
    }
  }, [updateMoonData, updateHoroscope, zodiacSign]);

  // Принудительное обновление
  const forceUpdate = useCallback(() => {
    console.log('🔄 Принудительное обновление данных');
    updateAllData();
  }, [updateAllData]);

  // Эффект для первоначальной загрузки и настройки автообновления
  useEffect(() => {
    mountedRef.current = true;

    // Первоначальная загрузка данных
    updateAllData();

    // Настройка автообновления
    if (autoUpdate && updateInterval > 0) {
      updateIntervalRef.current = setInterval(() => {
        if (mountedRef.current) {
          console.log('⏰ Автоматическое обновление данных');
          updateAllData();
        }
      }, updateInterval);
    }

    // Очистка при размонтировании
    return () => {
      mountedRef.current = false;
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [updateAllData, autoUpdate, updateInterval]);

  // Эффект для обновления при изменении знака зодиака
  useEffect(() => {
    if (zodiacSign && enableHoroscope) {
      updateHoroscope(zodiacSign).then(horoscopeData => {
        if (mountedRef.current) {
          setData(prev => ({ ...prev, horoscope: horoscopeData }));
        }
      });
    }
  }, [zodiacSign, enableHoroscope, updateHoroscope]);

  return {
    ...data,
    refresh: forceUpdate,
    updateMoon: () => updateMoonData(),
    updateHoroscope: (sign) => updateHoroscope(sign),
    isAutoUpdating: autoUpdate && !!updateIntervalRef.current
  };
};

// ===== ХOOK ДЛЯ ТОЛЬКО ЛУННЫХ ДАННЫХ =====

export const useMoonData = (options = {}) => {
  const { coordinates, autoUpdate, updateInterval } = options;

  return useAstrologyData({
    coordinates,
    autoUpdate,
    updateInterval,
    enableHoroscope: false
  });
};

// ===== ХOOK ДЛЯ ГОРОСКОПА =====

export const useHoroscope = (zodiacSign, options = {}) => {
  const { autoUpdate = true, updateInterval = 24 * 60 * 60 * 1000 } = options;

  return useAstrologyData({
    zodiacSign,
    autoUpdate,
    updateInterval,
    enableHoroscope: true
  });
};

// ===== ХOOK ДЛЯ НАСТРОЕК ОБНОВЛЕНИЯ =====

export const useUpdateSettings = () => {
  const [settings, setSettings] = useState({
    autoUpdate: true,
    updateInterval: 6 * 60 * 60 * 1000, // 6 часов
    lastCleanup: null
  });

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));

    // Сохраняем в localStorage
    try {
      localStorage.setItem('astrology_settings', JSON.stringify({
        ...settings,
        ...newSettings
      }));
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  }, [settings]);

  // Загружаем настройки при инициализации
  useEffect(() => {
    try {
      const saved = localStorage.getItem('astrology_settings');
      if (saved) {
        const parsedSettings = JSON.parse(saved);
        setSettings(prev => ({ ...prev, ...parsedSettings }));
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    }
  }, []);

  return {
    settings,
    updateSettings,
    setAutoUpdate: (enabled) => updateSettings({ autoUpdate: enabled }),
    setUpdateInterval: (interval) => updateSettings({ updateInterval: interval })
  };
};

// ===== КОМПОНЕНТ-ПРОВАЙДЕР ДЛЯ КОНТЕКСТА =====

import React, { createContext, useContext } from 'react';

const AstrologyContext = createContext();

export const AstrologyProvider = ({ children, defaultOptions = {} }) => {
  const astrologyData = useAstrologyData(defaultOptions);

  return (
    <AstrologyContext.Provider value={astrologyData}>
      {children}
    </AstrologyContext.Provider>
  );
};

export const useAstrologyContext = () => {
  const context = useContext(AstrologyContext);
  if (!context) {
    throw new Error('useAstrologyContext должен использоваться внутри AstrologyProvider');
  }
  return context;
};

// ===== УТИЛИТЫ ДЛЯ КОМПОНЕНТОВ =====

// HOC для автоматического обновления данных
export const withAstrologyData = (WrappedComponent, options = {}) => {
  return function AstrologyDataWrapper(props) {
    const astrologyData = useAstrologyData(options);

    return (
      <WrappedComponent 
        {...props} 
        astrologyData={astrologyData}
      />
    );
  };
};

// Хелпер для форматирования времени обновления
export const useLastUpdateText = (lastUpdated) => {
  const [updateText, setUpdateText] = useState('');

  useEffect(() => {
    if (!lastUpdated) {
      setUpdateText('Никогда');
      return;
    }

    const updateText = () => {
      const now = new Date();
      const diff = now - lastUpdated;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(minutes / 60);

      if (minutes < 1) {
        setUpdateText('Только что');
      } else if (minutes < 60) {
        setUpdateText(`${minutes} мин назад`);
      } else if (hours < 24) {
        setUpdateText(`${hours} ч назад`);
      } else {
        setUpdateText(lastUpdated.toLocaleDateString('ru-RU'));
      }
    };

    updateText();
    const interval = setInterval(updateText, 60000); // обновляем каждую минуту

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return updateText;
};

// Экспорт по умолчанию
export default {
  useAstrologyData,
  useMoonData,
  useHoroscope,
  useUpdateSettings,
  AstrologyProvider,
  useAstrologyContext,
  withAstrologyData,
  useLastUpdateText
};
