// src/components/NumerologyView.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNumerology } from '../hooks/useAstrologyData';
import Card from './UI/Card';
import Button from './UI/Button';


const NumerologyView = ({ 
  onBack, 
  onAddToFavorites, 
  selectedSign = null 
}) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [birthDate, setBirthDate] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [userName, setUserName] = useState('');

  // Используем хук нумерологии
  const { data: numerologyData, loading, error, refetch } = useNumerology(birthDate);

  // Загружаем данные при изменении даты
  useEffect(() => {
    if (birthDate && showResults) {
      refetch();
    }
  }, [birthDate, showResults, refetch]);

  // Стили компонента
  const numerologyStyles = {
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

    inputCard: {
      marginBottom: theme.spacing.xl
    },

    inputGroup: {
      marginBottom: theme.spacing.lg
    },

    label: {
      display: 'block',
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },

    input: {
      width: '100%',
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      border: `2px solid ${theme.colors.border}`,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      fontSize: theme.typography.sizes.md,
      outline: 'none',
      transition: `border-color ${theme.animations.duration.normal} ease`,
      boxSizing: 'border-box'
    },

    inputFocus: {
      borderColor: theme.colors.primary
    },

    calculateButton: {
      width: '100%',
      marginTop: theme.spacing.lg
    },

    numberCard: {
      marginBottom: theme.spacing.xl,
      background: createGradientStyle([theme.colors.primary, theme.colors.secondary], '135deg').background,
      position: 'relative',
      overflow: 'hidden',
      minHeight: '200px'
    },

    numberOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.2)',
      zIndex: 1
    },

    numberContent: {
      position: 'relative',
      zIndex: 2,
      color: '#ffffff',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '200px'
    },

    mainNumber: {
      fontSize: '6rem',
      fontWeight: theme.typography.weights.bold,
      margin: '0 0 8px 0',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      lineHeight: 1
    },

    numberLabel: {
      fontSize: theme.typography.sizes.lg,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    meaningText: {
      fontSize: theme.typography.sizes.md,
      marginTop: theme.spacing.md,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
      opacity: 0.9
    },

    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl
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

    characteristicItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.primary}20`
    },

    statCard: {
      textAlign: 'center',
      padding: theme.spacing.lg,
      backgroundColor: `${theme.colors.secondary}15`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.secondary}30`
    },

    statNumber: {
      fontSize: theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.secondary,
      margin: '0 0 4px 0'
    },

    statLabel: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      margin: 0
    },

    recommendationCard: {
      padding: theme.spacing.lg,
      backgroundColor: `${theme.colors.secondary}10`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.secondary}30`,
      position: 'relative',
      overflow: 'hidden'
    },

    recommendationIcon: {
      position: 'absolute',
      top: theme.spacing.sm,
      right: theme.spacing.sm,
      fontSize: '2rem',
      opacity: 0.3
    },

    recommendationText: {
      fontSize: theme.typography.sizes.md,
      lineHeight: 1.6,
      margin: 0,
      fontStyle: 'italic'
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

  // Вычисление числа жизненного пути
  const calculateLifePath = (date) => {
    if (!date) return null;
    
    const digits = date.replace(/-/g, '').split('').map(Number);
    let sum = digits.reduce((a, b) => a + b, 0);
    
    // Приводим к однозначному числу
    while (sum > 9) {
      sum = sum.toString().split('').map(Number).reduce((a, b) => a + b, 0);
    }
    
    return sum;
  };

  // Обработчик расчета
  const handleCalculate = () => {
    if (birthDate) {
      setShowResults(true);
    }
  };

  // Обработчик добавления в избранное
  const handleAddToFavorites = () => {
    if (numerologyData && birthDate && onAddToFavorites) {
      const favoriteItem = {
        type: 'numerology',
        id: `numerology-${birthDate}-${Date.now()}`,
        title: `🔢 Нумерология ${userName || 'пользователя'}`,
        content: `Число жизни: ${numerologyData.number} - ${numerologyData.meaning}`,
        date: new Date().toLocaleDateString('ru-RU'),
        birthDate: birthDate,
        number: numerologyData.number,
        meaning: numerologyData.meaning
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
      @keyframes pulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
      }
      
      @keyframes numberGlow {
        0%, 100% { text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
        50% { text-shadow: 2px 2px 4px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div style={numerologyStyles.container}>

      
      {/* Заголовок */}
      <div style={numerologyStyles.header}>
        <h1 style={numerologyStyles.title}>🔢 Нумерология</h1>
        <p style={numerologyStyles.subtitle}>
          Откройте тайны чисел вашей жизни
        </p>
      </div>

      {/* Форма ввода данных */}
      <Card padding="lg" style={numerologyStyles.inputCard}>
        
        <div style={numerologyStyles.inputGroup}>
          <label style={numerologyStyles.label}>
            👤 Ваше имя (необязательно)
          </label>
          <input
            type="text"
            placeholder="Введите ваше имя"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={numerologyStyles.input}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
            }}
          />
        </div>

        <div style={numerologyStyles.inputGroup}>
          <label style={numerologyStyles.label}>
            📅 Дата рождения *
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={numerologyStyles.input}
            max={new Date().toISOString().split('T')[0]}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border;
            }}
          />
        </div>

        <Button
          variant="primary"
          onClick={handleCalculate}
          style={numerologyStyles.calculateButton}
          disabled={!birthDate || loading}
        >
          {loading ? '🔮 Вычисляем...' : '✨ Рассчитать нумерологию'}
        </Button>
      </Card>

      {/* Результаты */}
      {showResults && (
        <>
          {loading && (
            <div style={numerologyStyles.loadingContainer}>
              <div style={numerologyStyles.loadingIcon}>🔢</div>
              <h3 style={{ color: theme.colors.primary }}>
                Анализируем числовые вибрации...
              </h3>
            </div>
          )}

          {error && (
            <Card padding="lg" style={numerologyStyles.sectionCard}>
              <h3 style={{ color: theme.colors.danger, textAlign: 'center' }}>
                Ошибка: {error}
              </h3>
              <div style={{ textAlign: 'center', marginTop: theme.spacing.md }}>
                <Button variant="primary" onClick={refetch}>
                  🔄 Попробовать снова
                </Button>
              </div>
            </Card>
          )}

          {numerologyData && !loading && (
            <>
              {/* Основное число */}
              <Card padding="xl" style={numerologyStyles.numberCard}>
                <div style={numerologyStyles.numberOverlay} />
                <div style={numerologyStyles.numberContent}>
                  
                  <div style={{
                    ...numerologyStyles.mainNumber,
                    animation: 'numberGlow 3s ease-in-out infinite'
                  }}>
                    {numerologyData.number}
                  </div>
                  
                  <div style={numerologyStyles.numberLabel}>
                    Число жизненного пути
                  </div>
                  
                  <div style={numerologyStyles.meaningText}>
                    {numerologyData.meaning}
                  </div>
                </div>
              </Card>

              {/* Статистика */}
              <div style={numerologyStyles.gridContainer}>
                
                <div style={numerologyStyles.statCard}>
                  <div style={numerologyStyles.statNumber}>
                    {numerologyData.personalYear || new Date().getFullYear() % 9 + 1}
                  </div>
                  <div style={numerologyStyles.statLabel}>Личный год</div>
                </div>

                <div style={numerologyStyles.statCard}>
                  <div style={numerologyStyles.statNumber}>
                    {calculateLifePath(birthDate) || numerologyData.number}
                  </div>
                  <div style={numerologyStyles.statLabel}>Жизненный путь</div>
                </div>
              </div>

              {/* Характеристики */}
              <Card padding="lg" style={numerologyStyles.sectionCard}>
                <h3 style={numerologyStyles.sectionTitle}>
                  <span>✨</span>
                  <span>Ваши качества</span>
                </h3>
                
                {numerologyData.characteristics?.map((characteristic, index) => (
                  <div key={index} style={numerologyStyles.characteristicItem}>
                    <span style={{ color: theme.colors.primary, fontSize: '16px' }}>🌟</span>
                    <span style={{ lineHeight: 1.5 }}>{characteristic}</span>
                  </div>
                ))}
              </Card>

              {/* Рекомендации */}
              {numerologyData.recommendations && (
                <Card padding="none" style={numerologyStyles.sectionCard}>
                  <div style={numerologyStyles.recommendationCard}>
                    <div style={numerologyStyles.recommendationIcon}>💎</div>
                    <h3 style={{
                      ...numerologyStyles.sectionTitle,
                      marginBottom: theme.spacing.sm
                    }}>
                      <span>💡</span>
                      <span>Совет от чисел</span>
                    </h3>
                    <p style={numerologyStyles.recommendationText}>
                      {numerologyData.recommendations}
                    </p>
                  </div>
                </Card>
              )}

              {/* Жизненный путь */}
              {numerologyData.lifePath && (
                <Card padding="lg" style={numerologyStyles.sectionCard}>
                  <h3 style={numerologyStyles.sectionTitle}>
                    <span>🛤️</span>
                    <span>Ваш путь</span>
                  </h3>
                  
                  <div style={{
                    padding: theme.spacing.md,
                    backgroundColor: `${theme.colors.primary}10`,
                    borderRadius: theme.borderRadius.md,
                    borderLeft: `4px solid ${theme.colors.primary}`,
                    lineHeight: 1.6
                  }}>
                    {numerologyData.lifePath}
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

export default NumerologyView;
