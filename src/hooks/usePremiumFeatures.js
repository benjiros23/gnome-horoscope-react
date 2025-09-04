// src/hooks/usePremiumFeatures.js - Хук для премиум функций
import { useState, useEffect } from 'react';
import apiService from '../services/api';
import useUserSettings from './useUserSettings';

const usePremiumFeatures = () => {
  const { settings, isPremium } = useUserSettings();
  const [premiumData, setPremiumData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Получить initData из Telegram WebApp
  const getInitData = () => {
    return window.Telegram?.WebApp?.initData || '';
  };

  // Получить премиум гороскоп
  const getPremiumHoroscope = async (sign) => {
    if (!isPremium) {
      throw new Error('Требуется премиум подписка');
    }

    try {
      setLoading(true);
      setError(null);
      
      const initData = getInitData();
      const response = await apiService.getPremiumHoroscope(sign, initData);
      
      setPremiumData(response);
      return response;
      
    } catch (err) {
      console.error('Ошибка получения премиум гороскопа:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Поделиться контентом
  const shareContent = async (contentType, content, shareText = '') => {
    try {
      const initData = getInitData();
      const response = await apiService.shareContent(
        contentType, 
        content, 
        shareText || '🧙‍♂️ Магические предсказания от Астро Гномов!', 
        initData
      );
      
      // 🧙‍♂️ Haptic feedback
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
        try {
          tg.HapticFeedback.impactOccurred('medium');
        } catch (e) {}
      }
      
      return response;
      
    } catch (err) {
      console.error('Ошибка создания репоста:', err);
      throw err;
    }
  };

  // Получить аналитику пользователя (премиум функция)
  const getUserAnalytics = async () => {
    if (!isPremium) {
      return { 
        action_statistics: {}, 
        recent_actions: [], 
        total_actions: 0,
        message: 'Аналитика доступна только премиум пользователям' 
      };
    }

    try {
      const initData = getInitData();
      const analytics = await apiService.getUserAnalytics(initData);
      return analytics;
      
    } catch (err) {
      console.error('Ошибка получения аналитики:', err);
      return { 
        action_statistics: {}, 
        recent_actions: [], 
        total_actions: 0,
        error: err.message 
      };
    }
  };

  // Проверить доступность премиум функции
  const checkPremiumAccess = (featureName) => {
    if (!isPremium) {
      return {
        hasAccess: false,
        message: `Функция "${featureName}" доступна только премиум пользователям. 🧙‍♂️✨`,
        upgradeMessage: 'Обновитесь до премиум версии для доступа к расширенным возможностям!'
      };
    }

    return {
      hasAccess: true,
      message: `Доступ к функции "${featureName}" разрешен`
    };
  };

  // Список премиум функций
  const premiumFeatures = {
    detailedHoroscope: {
      name: 'Детальный гороскоп',
      description: 'Расширенные предсказания с анализом по всем сферам жизни',
      available: isPremium
    },
    personalizedAdvice: {
      name: 'Персональные советы',
      description: 'Советы, основанные на времени и месте рождения',
      available: isPremium
    },
    analytics: {
      name: 'Личная аналитика',
      description: 'Статистика ваших запросов и предпочтений',
      available: isPremium
    },
    prioritySupport: {
      name: 'Приоритетная поддержка',
      description: 'Быстрые ответы на вопросы и предложения',
      available: isPremium
    },
    shareContent: {
      name: 'Расшаривание контента',
      description: 'Делитесь предсказаниями с друзьями',
      available: true // Доступно всем
    },
    monthlyReport: {
      name: 'Месячный отчет',
      description: 'Подробный анализ астрологического месяца',
      available: isPremium
    }
  };

  // Получить список доступных функций
  const getAvailableFeatures = () => {
    return Object.entries(premiumFeatures)
      .filter(([key, feature]) => feature.available)
      .map(([key, feature]) => ({ key, ...feature }));
  };

  // Получить список недоступных функций
  const getUnavailableFeatures = () => {
    return Object.entries(premiumFeatures)
      .filter(([key, feature]) => !feature.available)
      .map(([key, feature]) => ({ key, ...feature }));
  };

  return {
    // Состояние
    premiumData,
    loading,
    error,
    isPremium,
    
    // Методы
    getPremiumHoroscope,
    shareContent,
    getUserAnalytics,
    checkPremiumAccess,
    
    // Информация о функциях
    premiumFeatures,
    getAvailableFeatures,
    getUnavailableFeatures,
    
    // Утилиты
    hasFeature: (featureName) => premiumFeatures[featureName]?.available || false,
    canAccess: (featureName) => checkPremiumAccess(featureName).hasAccess
  };
};

export default usePremiumFeatures;