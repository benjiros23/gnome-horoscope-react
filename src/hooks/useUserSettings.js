// src/hooks/useUserSettings.js - Хук для управления настройками пользователя
import { useState, useEffect } from 'react';
import apiService from '../services/api';

const useUserSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Получить initData из Telegram WebApp
  const getInitData = () => {
    return window.Telegram?.WebApp?.initData || '';
  };

  // Загрузить настройки с сервера
  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const initData = getInitData();
      const userSettings = await apiService.getUserSettings(initData);
      
      setSettings(userSettings);
      
      // Сохраняем локально для быстрого доступа
      localStorage.setItem('gnome-user-settings', JSON.stringify(userSettings));
      
    } catch (err) {
      console.error('Ошибка загрузки настроек:', err);
      setError(err);
      
      // Пытаемся загрузить из localStorage при ошибке
      const cachedSettings = localStorage.getItem('gnome-user-settings');
      if (cachedSettings) {
        try {
          setSettings(JSON.parse(cachedSettings));
        } catch (parseError) {
          console.error('Ошибка парсинга сохраненных настроек:', parseError);
        }
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Сохранить настройки
  const saveSettings = async (newSettings) => {
    try {
      const initData = getInitData();
      const response = await apiService.saveUserSettings(newSettings, initData);
      
      if (response.status === 'success') {
        const updatedSettings = { ...settings, ...newSettings };
        setSettings(updatedSettings);
        
        // Обновляем локальный кэш
        localStorage.setItem('gnome-user-settings', JSON.stringify(updatedSettings));
        
        // 🧙‍♂️ Haptic feedback для Telegram
        const tg = window.Telegram?.WebApp;
        if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
          try {
            tg.HapticFeedback.impactOccurred('light');
          } catch (e) {}
        }
        
        return true;
      }
      
      return false;
      
    } catch (err) {
      console.error('Ошибка сохранения настроек:', err);
      setError(err);
      return false;
    }
  };

  // Обновить конкретную настройку
  const updateSetting = async (key, value) => {
    return await saveSettings({ [key]: value });
  };

  // Сбросить настройки к значениям по умолчанию
  const resetSettings = async () => {
    const defaultSettings = {
      zodiac_sign: null,
      birth_time: null,
      birth_location: null,
      notification_time: '09:00',
      premium: false,
      language: 'ru',
      theme: 'light'
    };
    
    return await saveSettings(defaultSettings);
  };

  // Загружаем настройки при инициализации
  useEffect(() => {
    loadSettings();
  }, []);

  // Проверяем наличие премиум подписки
  const isPremium = settings?.premium || false;

  // Получаем текущий знак зодиака
  const zodiacSign = settings?.zodiac_sign;

  // Получаем язык интерфейса
  const language = settings?.language || 'ru';

  // Получаем тему оформления
  const theme = settings?.theme || 'light';

  return {
    settings,
    loading,
    error,
    saveSettings,
    updateSetting,
    resetSettings,
    reload: loadSettings,
    
    // Удобные геттеры
    isPremium,
    zodiacSign,
    language,
    theme,
    
    // Проверки
    hasZodiacSign: !!zodiacSign,
    isConfigured: !!zodiacSign && !!settings?.notification_time
  };
};

export default useUserSettings;