// src/components/CompatibilityView.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCompatibility } from '../hooks/useAstrologyData';
import Card from './UI/Card';
import Button from './UI/Button';


const CompatibilityView = ({ 
  onBack, 
  onAddToFavorites, 
  selectedSign = null 
}) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [firstSign, setFirstSign] = useState(selectedSign?.sign || 'Овен');
  const [secondSign, setSecondSign] = useState('Лев');
  const [showResults, setShowResults] = useState(false);

  // Используем хук совместимости
  const { data: compatibilityData, loading, error, refetch } = useCompatibility(firstSign, secondSign);

  // Список знаков зодиака
  const zodiacSigns = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];

  // Загружаем данные при изменении знаков
  useEffect(() => {
    if (showResults && firstSign && secondSign) {
      refetch();
    }
  }, [firstSign, secondSign, showResults, refetch]);

  // Стили компонента
  const compatibilityStyles = {
    container: {
      padding: theme.spacing.lg,
      maxWidth: '800px',
      margin: '0 auto',
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '100px'
    },

    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl
    },

    title: {
      fontSize: theme.typography.sizes.title,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },

    subtitle: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      margin: 0
    },

    selectorCard: {
      marginBottom: theme.spacing.xl
    },

    selectorRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      gap: theme.spacing.md,
      alignItems: 'center',
      marginBottom: theme.spacing.lg
    },

    selectWrapper: {
      position: 'relative'
    },

    select: {
      width: '100%',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontSize: theme.typography.sizes.md,
      cursor: 'pointer',
      outline: 'none',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23${theme.colors.text.substring(1)}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 12px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      paddingRight: '40px'
    },

    heartIcon: {
      fontSize: '2rem',
      color: theme.colors.primary,
      animation: 'heartbeat 1.5s ease-in-out infinite'
    },

    checkButton: {
      width: '100%',
      marginTop: theme.spacing.lg
    },

    resultsCard: {
      marginBottom: theme.spacing.lg,
      background: createGradientStyle([theme.colors.primary, theme.colors.secondary], '135deg').background,
      position: 'relative',
      overflow: 'hidden'
    },

    resultsOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.2)',
      zIndex: 1
    },

    resultsContent: {
      position: 'relative',
      zIndex: 2,
      color: '#ffffff'
    },

    scoreContainer: {
      textAlign: 'center',
      marginBottom: theme.spacing.lg
    },

    score: {
      fontSize: '4rem',
      fontWeight: theme.typography.weights.bold,
      margin: 0,
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    },

    scoreLabel: {
      fontSize: theme.typography.sizes.lg,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    description: {
      fontSize: theme.typography.sizes.md,
      lineHeight: 1.6,
      textAlign: 'center',
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    sectionCard: {
      marginBottom: theme.spacing.lg
    },

    sectionTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    listItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.primary}20`
    },

    loadingContainer: {
      textAlign: 'center',
      padding: theme.spacing.xxl
    },

    loadingIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.lg,
      animation: 'pulse 2s infinite'
    }
  };

  // Обработчик проверки совместимости
  const handleCheckCompatibility = () => {
    setShowResults(true);
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = () => {
    if (compatibilityData && onAddToFavorites) {
      const favoriteItem = {
        type: 'compatibility',
        id: `compatibility-${firstSign}-${secondSign}-${Date.now()}`,
        title: `💕 ${firstSign} и ${secondSign}`,
        content: `Совместимость: ${compatibilityData.score}%`,
        date: new Date().toLocaleDateString('ru-RU'),
        score: compatibilityData.score,
        description: compatibilityData.description,
        signs: `${firstSign} + ${secondSign}`
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
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={compatibilityStyles.container}>

      
      {/* Заголовок */}
      <div style={compatibilityStyles.header}>
        <h1 style={compatibilityStyles.title}>💕 Совместимость знаков</h1>
        <p style={compatibilityStyles.subtitle}>
          Узнайте, насколько вы подходите друг другу
        </p>
      </div>

      {/* Селектор знаков */}
      <Card padding="lg" style={compatibilityStyles.selectorCard}>
        <div style={compatibilityStyles.selectorRow}>
          
          {/* Первый знак */}
          <div style={compatibilityStyles.selectWrapper}>
            <select
              style={compatibilityStyles.select}
              value={firstSign}
              onChange={(e) => setFirstSign(e.target.value)}
            >
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>

          {/* Иконка сердца */}
          <div style={compatibilityStyles.heartIcon}>💖</div>

          {/* Второй знак */}
          <div style={compatibilityStyles.selectWrapper}>
            <select
              style={compatibilityStyles.select}
              value={secondSign}
              onChange={(e) => setSecondSign(e.target.value)}
            >
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleCheckCompatibility}
          style={compatibilityStyles.checkButton}
          disabled={loading}
        >
          {loading ? '🔍 Анализируем...' : '💫 Проверить совместимость'}
        </Button>
      </Card>

      {/* Результаты */}
      {showResults && (
        <>
          {loading && (
            <div style={compatibilityStyles.loadingContainer}>
              <div style={compatibilityStyles.loadingIcon}>💕</div>
              <h3 style={{ color: theme.colors.primary }}>
                Звезды анализируют вашу совместимость...
              </h3>
            </div>
          )}

          {error && (
            <Card padding="lg" style={compatibilityStyles.sectionCard}>
              <h3 style={{ color: theme.colors.danger, textAlign: 'center' }}>
                Ошибка: {error}
              </h3>
            </Card>
          )}

          {compatibilityData && !loading && (
            <>
              {/* Основной результат */}
              <Card padding="xl" style={compatibilityStyles.resultsCard}>
                <div style={compatibilityStyles.resultsOverlay} />
                <div style={compatibilityStyles.resultsContent}>
                  
                  <div style={compatibilityStyles.scoreContainer}>
                    <div style={compatibilityStyles.score}>
                      {compatibilityData.score}%
                    </div>
                    <div style={compatibilityStyles.scoreLabel}>
                      Совместимость
                    </div>
                  </div>

                  <p style={compatibilityStyles.description}>
                    {compatibilityData.description}
                  </p>
                </div>
              </Card>

              {/* Сильные стороны */}
              <Card padding="lg" style={compatibilityStyles.sectionCard}>
                <h3 style={compatibilityStyles.sectionTitle}>
                  <span>💪</span>
                  <span>Сильные стороны</span>
                </h3>
                
                {compatibilityData.strengths?.map((strength, index) => (
                  <div key={index} style={compatibilityStyles.listItem}>
                    <span style={{ color: theme.colors.success, fontSize: '16px' }}>✅</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </Card>

              {/* Вызовы */}
              <Card padding="lg" style={compatibilityStyles.sectionCard}>
                <h3 style={compatibilityStyles.sectionTitle}>
                  <span>⚠️</span>
                  <span>На что обратить внимание</span>
                </h3>
                
                {compatibilityData.challenges?.map((challenge, index) => (
                  <div key={index} style={compatibilityStyles.listItem}>
                    <span style={{ color: theme.colors.warning, fontSize: '16px' }}>⚡</span>
                    <span>{challenge}</span>
                  </div>
                ))}
              </Card>

              {/* Советы */}
              {compatibilityData.advice && (
                <Card padding="lg" style={compatibilityStyles.sectionCard}>
                  <h3 style={compatibilityStyles.sectionTitle}>
                    <span>💡</span>
                    <span>Совет от звезд</span>
                  </h3>
                  
                  <div style={{
                    padding: theme.spacing.md,
                    backgroundColor: `${theme.colors.secondary}15`,
                    borderRadius: theme.borderRadius.md,
                    borderLeft: `4px solid ${theme.colors.secondary}`,
                    fontStyle: 'italic',
                    lineHeight: 1.6
                  }}>
                    {compatibilityData.advice}
                  </div>
                </Card>
              )}

              {/* Действия */}
              <div style={{ 
                display: 'flex',
                gap: theme.spacing.md,
                justifyContent: 'center',
                marginTop: theme.spacing.xl
              }}>
                <Button variant="primary" onClick={handleAddToFavorites}>
                  ⭐ В избранное
                </Button>
                
                <Button variant="outline" onClick={() => refetch()}>
                  🔄 Пересчитать
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CompatibilityView;
