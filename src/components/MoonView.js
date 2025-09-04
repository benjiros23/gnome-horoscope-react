// src/components/MoonView.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import useRealMoonData from '../hooks/useRealMoonData';
import Card from './UI/Card';
import Button from './UI/Button';

import MoonClassicMenu from './MoonClassicMenu'; // ✅ ЛУННОЕ КЛАССИЧЕСКОЕ МЕНЮ

const MoonView = ({ 
  onBack, 
  onAddToFavorites, 
  selectedSign = null,
  onNavigate // ✅ ДОБАВЛЯЕМ НАВИГАЦИЮ ДЛЯ ЛУННОГО МЕНЮ
}) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isClassicMenuOpen, setIsClassicMenuOpen] = useState(false); // ✅ СОСТОЯНИЕ ЛУННОГО МЕНЮ

  // ✅ ИСПОЛЬЗУЕМ НОВЫЙ ХУК С РЕАЛЬНЫМИ ДАННЫМИ
  const { data: moonData, loading, error, refetch } = useRealMoonData();

  // Отслеживание размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Обновляем дату каждую минуту
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Стили компонента
  const moonStyles = {
    container: {
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      maxWidth: isMobile ? '100%' : '800px',
      margin: '0 auto',
      minHeight: '100vh',
      overflowY: 'auto',
      paddingBottom: isMobile ? '120px' : '100px',
      width: '100%',
      boxSizing: 'border-box'
    },

    header: {
      textAlign: 'center',
      marginBottom: isMobile ? theme.spacing.lg : theme.spacing.xl,
      padding: isMobile ? `0 ${theme.spacing.sm}` : 0
    },

    title: {
      fontSize: isMobile ? theme.typography.sizes.xl : theme.typography.sizes.title,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
    },

    subtitle: {
      fontSize: isMobile ? theme.typography.sizes.sm : theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.6)'
    },

    moonCard: {
      marginBottom: theme.spacing.xl,
      background: createGradientStyle(['#1e3c72', '#2a5298'], '135deg').background,
      position: 'relative',
      overflow: 'hidden',
      minHeight: isMobile ? '280px' : '300px',
      borderRadius: theme.borderRadius.lg
    },

    moonOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.3) 100%)',
      zIndex: 1
    },

    moonContent: {
      position: 'relative',
      zIndex: 2,
      color: '#ffffff',
      padding: isMobile ? theme.spacing.lg : theme.spacing.xl,
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start',
      gap: isMobile ? theme.spacing.md : theme.spacing.xl,
      minHeight: isMobile ? '280px' : '300px',
      textAlign: isMobile ? 'center' : 'left'
    },

    moonIcon: {
      fontSize: isMobile ? '6rem' : '8rem',
      textAlign: 'center',
      filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
      animation: 'moonGlow 3s ease-in-out infinite',
      marginBottom: isMobile ? theme.spacing.md : 0
    },

    moonInfo: {
      flex: 1,
      width: '100%'
    },

    moonPhase: {
      fontSize: isMobile ? theme.typography.sizes.lg : theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.sm,
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      textAlign: isMobile ? 'center' : 'left'
    },

    moonDate: {
      fontSize: isMobile ? theme.typography.sizes.sm : theme.typography.sizes.md,
      marginBottom: theme.spacing.sm,
      opacity: 0.9,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
      textAlign: isMobile ? 'center' : 'left'
    },

    illumination: {
      fontSize: isMobile ? theme.typography.sizes.md : theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.semibold,
      color: '#F4C542',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
      textAlign: isMobile ? 'center' : 'left'
    },

    loadingContainer: {
      textAlign: 'center',
      padding: theme.spacing.xxl
    },

    loadingIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.lg,
      animation: 'pulse 2s infinite'
    },

    errorContainer: {
      textAlign: 'center',
      padding: theme.spacing.lg,
      backgroundColor: `${theme.colors.danger}20`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.danger}40`
    },

    errorMessage: {
      color: theme.colors.danger,
      marginBottom: theme.spacing.md
    }
  };

  // Получение иконки фазы луны
  const getMoonPhaseIcon = (phase) => {
    const phases = {
      'Новолуние': '🌑',
      'Растущая луна': '🌒',
      'Первая четверть': '🌓',
      'Растущая': '🌔',
      'Полнолуние': '🌕',
      'Убывающая': '🌖',
      'Последняя четверть': '🌗',
      'Убывающая луна': '🌘'
    };
    return phases[phase] || '🌙';
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = () => {
    if (moonData && onAddToFavorites) {
      const favoriteItem = {
        type: 'moon',
        id: `moon-${Date.now()}`,
        title: `🌙 ${moonData.current?.phase || 'Лунная фаза'}`,
        content: `Освещенность: ${moonData.current?.illumination || '—'}%`,
        date: new Date().toLocaleDateString('ru-RU'),
        phase: moonData.current?.phase,
        illumination: moonData.current?.illumination,
        sign: moonData.current?.zodiacSign
      };

      onAddToFavorites(favoriteItem);

      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    }
  };

  // CSS анимации
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes moonGlow {
        0%, 100% { 
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
          transform: scale(1);
        }
        50% { 
          filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.8));
          transform: scale(1.05);
        }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Состояние загрузки
  if (loading) {
    return (
      <div style={moonStyles.container}>
        
        
        <div style={moonStyles.loadingContainer}>
          <div style={moonStyles.loadingIcon}>🌙</div>
          <h3 style={{ color: theme.colors.primary }}>
            Получаем актуальные данные о фазах Луны...
          </h3>
          <p style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            Запрашиваем данные с сервера
          </p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div style={moonStyles.container}>
        
        
        <div style={moonStyles.errorContainer}>
          <h3 style={moonStyles.errorMessage}>
            ⚠️ Ошибка загрузки лунных данных
          </h3>
          <p style={moonStyles.errorMessage}>{error}</p>
          <div style={{ marginTop: theme.spacing.md }}>
            <Button variant="primary" onClick={refetch}>
              🔄 Попробовать снова
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Основной контент с данными
  return (
    <div style={moonStyles.container}>
      
      
      {/* Заголовок */}
      <div style={moonStyles.header}>
        <h1 style={moonStyles.title}>🌙 Лунный календарь</h1>
        <p style={moonStyles.subtitle}>
          Актуальные данные о фазах Луны
        </p>
      </div>

      {moonData && (
        <>
          {/* Основная карточка с фазой луны */}
          <Card padding="none" style={moonStyles.moonCard}>
            <div style={moonStyles.moonOverlay} />
            <div style={moonStyles.moonContent}>
              
              {/* Луна */}
              <div style={moonStyles.moonIcon}>
                {getMoonPhaseIcon(moonData.current?.phase)}
              </div>

              {/* Информация о луне */}
              <div style={moonStyles.moonInfo}>
                <div style={moonStyles.moonPhase}>
                  {moonData.current?.phase || 'Неизвестная фаза'}
                </div>
                <div style={moonStyles.moonDate}>
                  {currentDate.toLocaleDateString('ru-RU', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div style={moonStyles.illumination}>
                  Освещенность: {moonData.current?.illumination || '—'}%
                </div>
                {moonData.current?.zodiacSign && (
                  <div style={{
                    ...moonStyles.moonDate,
                    marginTop: theme.spacing.sm
                  }}>
                    Луна в знаке: {moonData.current.zodiacSign}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Дополнительная информация */}
          {moonData.current?.advice && (
            <Card padding="lg" style={{ marginBottom: theme.spacing.lg }}>
              <h3 style={{
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.bold,
                color: theme.colors.text,
                marginBottom: theme.spacing.md
              }}>
                💫 {moonData.current.advice.title}
              </h3>
              <p style={{
                fontSize: theme.typography.sizes.md,
                lineHeight: 1.6,
                color: theme.colors.text,
                margin: 0
              }}>
                {moonData.current.advice.text}
              </p>
            </Card>
          )}

          {/* Действия */}
          <div style={{ 
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: theme.spacing.md,
            justifyContent: 'center',
            marginTop: theme.spacing.xl
          }}>
            <Button 
              variant="primary" 
              onClick={handleAddToFavorites}
              style={{ width: isMobile ? '100%' : 'auto' }}
            >
              ⭐ В избранное
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              style={{ width: isMobile ? '100%' : 'auto' }}
            >
              🔄 Обновить данные
            </Button>
          </div>

          {/* Отладочная информация (временно) */}
          {process.env.NODE_ENV === 'development' && (
            <Card padding="lg" style={{ marginTop: theme.spacing.lg }}>
              <h4>🧪 Отладка (только в development)</h4>
              <pre style={{
                fontSize: '12px',
                backgroundColor: '#f0f0f0',
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.sm,
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(moonData, null, 2)}
              </pre>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default MoonView;
