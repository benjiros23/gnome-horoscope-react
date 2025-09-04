// src/components/ServerStatus.js - Индикатор статуса подключения к серверу
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../services/api';

const ServerStatus = () => {
  const { theme } = useTheme();
  const [status, setStatus] = useState('connecting'); // 'online', 'offline', 'connecting'
  const [lastCheck, setLastCheck] = useState(null);

  // Проверка соединения с сервером
  const checkServerStatus = async () => {
    try {
      setStatus('connecting');
      
      // Пробуем сделать простой запрос к серверу (используем главную страницу вместо /health)
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://d-gnome-horoscope-miniapp-frontend.onrender.com'}/`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok || response.status === 404) {
        // 404 означает что сервер работает, но нет этого эндпоинта
        setStatus('online');
        console.log('🟢 Сервер доступен');
      } else {
        setStatus('offline');
        console.log('🔴 Сервер недоступен');
      }
    } catch (error) {
      setStatus('offline');
      console.log('🔴 Ошибка соединения с сервером:', error);
    }
    
    setLastCheck(new Date());
  };

  useEffect(() => {
    // Проверяем статус при загрузке
    checkServerStatus();
    
    // Проверяем статус каждые 30 секунд
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Добавляем CSS анимацию
  useEffect(() => {
    const existingStyle = document.getElementById('server-status-animations');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'server-status-animations';
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'online':
        return {
          icon: `${process.env.PUBLIC_URL || ''}/assets/online.png`,
          text: 'Онлайн',
          color: theme.colors.success,
          description: 'Соединение с сервером установлено'
        };
      case 'offline':
        return {
          icon: `${process.env.PUBLIC_URL || ''}/assets/offline.png`,
          text: 'Оффлайн',
          color: theme.colors.danger,
          description: 'Работаем в автономном режиме'
        };
      case 'connecting':
        return {
          icon: `${process.env.PUBLIC_URL || ''}/assets/online.png`, // Используем online.png для подключения
          text: 'Подключение...',
          color: theme.colors.warning,
          description: 'Подключаемся к серверу'
        };
      default:
        return {
          icon: `${process.env.PUBLIC_URL || ''}/assets/offline.png`,
          text: 'Неизвестно',
          color: theme.colors.textSecondary,
          description: 'Статус неизвестен'
        };
    }
  };

  const statusInfo = getStatusInfo();

  const styles = {
    container: {
      position: 'fixed',
      top: '20px',
      left: '20px',
      backgroundColor: 'rgba(22, 33, 62, 0.9)',
      borderRadius: '12px',
      padding: '8px', // Уменьшили паддинг, так как только иконка
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Центрируем иконку
      zIndex: 1100,
      backdropFilter: 'blur(10px)',
      border: `1px solid ${statusInfo.color}40`,
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      width: '40px', // Фиксированная ширина для квадратной формы
      height: '40px' // Фиксированная высота для квадратной формы
    },
    
    iconImage: {
      width: '16px',
      height: '16px',
      animation: status === 'connecting' ? 'pulse 1.5s ease-in-out infinite' : 'none',
      filter: status === 'connecting' ? 'opacity(0.7)' : 'none'
    },
    
    text: {
      fontSize: '12px',
      fontWeight: '600',
      color: statusInfo.color,
      margin: 0
    },
    
    time: {
      fontSize: '10px',
      color: theme.colors.textSecondary,
      marginLeft: 'auto'
    }
  };

  const handleClick = () => {
    checkServerStatus();
    
    // Haptic feedback
    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.impactOccurred === 'function') {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {}
    }
  };

  return (
    <div 
      style={styles.container} 
      onClick={handleClick}
      title={statusInfo.description}
    >
      <img 
        src={statusInfo.icon} 
        alt={statusInfo.text}
        style={styles.iconImage}
        onError={(e) => {
          const fallbackSpan = document.createElement('span');
          fallbackSpan.textContent = status === 'online' ? '🟢' : status === 'offline' ? '🔴' : '🟡';
          fallbackSpan.style.fontSize = '12px';
          e.target.parentElement.replaceChild(fallbackSpan, e.target);
        }}
      />
    </div>
  );
};

export default ServerStatus;