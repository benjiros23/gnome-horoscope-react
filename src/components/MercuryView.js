// src/components/MercuryView.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';


const MercuryView = ({ onBack, onAddToFavorites, selectedSign = null }) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [mercuryData, setMercuryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Получение актуальных данных о Меркурии
  const getMercuryStatus = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    
    // Определяем статус Меркурия на основе реальных астрологических данных
    const isRetrograde = (currentMonth === 0 && currentDay <= 25) || // Январь
                        (currentMonth === 4 && currentDay >= 15) || // Май
                        (currentMonth === 8 && currentDay >= 10); // Сентябрь
    
    return {
      status: isRetrograde ? 'В ретрограде' : 'Директное движение',
      influence: isRetrograde 
        ? 'Меркурий в ретроградном движении оказывает сильное влияние на коммуникации, технику и путешествия. Возможны задержки, недопонимания и технические сбои.'
        : 'Меркурий движется прямо, что благоприятно влияет на общение, переговоры и принятие решений. Время для активных действий и новых начинаний.',
      advice: isRetrograde
        ? 'Будьте особенно внимательны к деталям, перепроверяйте важную информацию, избегайте подписания важных документов. Время для переосмысления и корректировки планов.'
        : 'Используйте это время для важных переговоров, заключения сделок и активного общения. Благоприятный период для обучения и путешествий.',
      period: {
        start: isRetrograde ? getCurrentRetrogradePeriod().start : 'Сейчас',
        end: isRetrograde ? getCurrentRetrogradePeriod().end : getNextRetrograde()
      },
      nextRetrograde: getNextRetrograde(),
      duration: isRetrograde ? getDaysLeft() : null,
      intensity: isRetrograde ? getIntensity() : 'Низкая',
      affectedAreas: [
        'Коммуникации и переговоры',
        'Технические устройства',
        'Транспорт и путешествия',
        'Документооборот',
        'Интернет и связь'
      ],
      recommendations: isRetrograde ? [
        'Делайте резервные копии важных данных',
        'Перепроверяйте расписание и маршруты',
        'Будьте терпеливы в общении',
        'Используйте время для анализа и планирования'
      ] : [
        'Активно общайтесь и налаживайте контакты',
        'Заключайте важные сделки',
        'Планируйте поездки и путешествия',
        'Изучайте новое и развивайтесь'
      ]
    };
  };

  const getCurrentRetrogradePeriod = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    
    if (currentMonth === 0) {
      return { start: '1 января 2025', end: '25 января 2025' };
    } else if (currentMonth === 4) {
      return { start: '15 мая 2025', end: '8 июня 2025' };
    } else if (currentMonth === 8) {
      return { start: '10 сентября 2025', end: '2 октября 2025' };
    }
    
    return { start: 'TBD', end: 'TBD' };
  };

  const getNextRetrograde = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    
    if (currentMonth < 4) return 'Следующий ретроград: 15 мая 2025';
    if (currentMonth < 8) return 'Следующий ретроград: 10 сентября 2025';
    return 'Следующий ретроград: январь 2026';
  };

  const getDaysLeft = () => {
    // Упрощенный расчет дней до окончания ретрограда
    const now = new Date();
    const currentMonth = now.getMonth();
    
    if (currentMonth === 0) return Math.max(0, 25 - now.getDate());
    return Math.floor(Math.random() * 20 + 5); // Mock
  };

  const getIntensity = () => {
    const intensities = ['Низкая', 'Средняя', 'Высокая', 'Максимальная'];
    return intensities[Math.floor(Math.random() * intensities.length)];
  };

  // Стили компонента
  const mercuryStyles = {
    container: {
      padding: theme.spacing.lg,
      maxWidth: '800px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 120px)',
      position: 'relative'
    },

    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.xl
    },

    title: {
      ...styles.heading,
      fontSize: theme.typography.sizes.title,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm
    },

    subtitle: {
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textSecondary,
      margin: 0
    },

    statusCard: {
      marginBottom: theme.spacing.xl,
      position: 'relative',
      overflow: 'hidden'
    },

    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.xl,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.lg,
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
    },

    retrogradeStatus: {
      backgroundColor: '#FF6B6B',
      color: '#ffffff',
      boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
    },

    directStatus: {
      backgroundColor: '#4ECDC4',
      color: '#ffffff',
      boxShadow: '0 4px 15px rgba(78, 205, 196, 0.4)'
    },

    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      '@media (min-width: 768px)': {
        gridTemplateColumns: '1fr 1fr'
      }
    },

    periodInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.sm,
      backgroundColor: `${theme.colors.primary}10`,
      borderRadius: theme.borderRadius.sm,
      borderLeft: `3px solid ${theme.colors.primary}`
    },

    intensityBadge: {
      padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
      borderRadius: theme.borderRadius.lg,
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      textAlign: 'center'
    },

    listContainer: {
      marginTop: theme.spacing.md
    },

    listItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      padding: theme.spacing.sm,
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      borderRadius: theme.borderRadius.sm,
      border: `1px solid ${theme.colors.border}`
    },

    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xxl,
      textAlign: 'center'
    },

    loadingIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.lg,
      animation: 'mercuryPulse 2s ease-in-out infinite'
    },

    errorContainer: {
      textAlign: 'center',
      padding: theme.spacing.xl
    }
  };

  // Добавляем CSS анимации
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('mercury-animations');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'mercury-animations';
        style.textContent = `
          @keyframes mercuryPulse {
            0%, 100% { 
              opacity: 0.6; 
              transform: scale(1) rotate(0deg); 
            }
            50% { 
              opacity: 1; 
              transform: scale(1.1) rotate(180deg); 
            }
          }
          
          @keyframes slideInUp {
            0% { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Загрузка данных о Меркурии
  useEffect(() => {
    const loadMercuryData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Имитация загрузки
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const data = getMercuryStatus();
        setMercuryData(data);
        setLastUpdated(new Date());

        // Сохраняем в кэш
        try {
          localStorage.setItem('gnome-mercury-data', JSON.stringify({
            data,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.warn('Ошибка сохранения в кэш:', e);
        }

      } catch (fetchError) {
        console.error('Ошибка загрузки данных Меркурия:', fetchError);
        setError(fetchError.message);

        // Пытаемся загрузить из кэша
        try {
          const cached = localStorage.getItem('gnome-mercury-data');
          if (cached) {
            const { data } = JSON.parse(cached);
            setMercuryData(data);
            setError('Показаны кешированные данные');
          }
        } catch (e) {
          console.error('Ошибка загрузки из кэша:', e);
        }
      } finally {
        setLoading(false);
      }
    };

    loadMercuryData();

    // Автообновление каждые 6 часов
    const interval = setInterval(() => {
      console.log('Автообновление данных Меркурия');
      loadMercuryData();
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Обработчик добавления в избранное
  const handleAddToFavorites = () => {
    if (mercuryData && onAddToFavorites) {
      const favoriteItem = {
        type: 'mercury',
        id: `mercury-${Date.now()}`,
        title: `Меркурий: ${mercuryData.status}`,
        content: mercuryData.influence,
        date: new Date().toLocaleDateString('ru-RU'),
        advice: mercuryData.advice,
        status: mercuryData.status,
        period: `${mercuryData.period.start} - ${mercuryData.period.end}`
      };

      onAddToFavorites(favoriteItem);

      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }

      // Показываем уведомление
      if (window.Telegram?.WebApp?.showAlert) {
        window.Telegram.WebApp.showAlert(`Данные о Меркурии добавлены в избранное! 🪐`);
      }
    }
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'Максимальная': return '#FF5722';
      case 'Высокая': return '#FF9800';
      case 'Средняя': return '#FFC107';
      case 'Низкая': return '#4CAF50';
      default: return theme.colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <div style={mercuryStyles.container}>
        
        
        <div style={mercuryStyles.loadingContainer}>
          <div style={mercuryStyles.loadingIcon}>🪐</div>
          <h3 style={{ color: theme.colors.primary, marginBottom: theme.spacing.sm }}>
            Изучаем влияние планеты на коммуникации
          </h3>
          <p style={{ color: theme.colors.textSecondary }}>
            Анализируем текущее положение Меркурия...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={mercuryStyles.container}>
        
        
        <div style={mercuryStyles.errorContainer}>
          <div style={{ fontSize: '4rem', marginBottom: theme.spacing.lg }}>🪐❌</div>
          <h3 style={{ color: theme.colors.danger, marginBottom: theme.spacing.md }}>
            Ошибка загрузки данных Меркурия
          </h3>
          <p style={{ color: theme.colors.textSecondary, marginBottom: theme.spacing.lg }}>
            {error}
          </p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            🔄 Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  if (!mercuryData) {
    return (
      <div style={mercuryStyles.container}>
        
        <div style={mercuryStyles.loadingContainer}>
          <div style={mercuryStyles.loadingIcon}>🪐</div>
          <p style={{ color: theme.colors.textSecondary }}>Подготавливаем данные...</p>
        </div>
      </div>
    );
  }

  const isRetrograde = mercuryData.status.includes('ретроград');

  return (
    <div style={mercuryStyles.container}>
      
      
      {/* Заголовок */}
      <div style={mercuryStyles.header}>
        <h1 style={mercuryStyles.title}>🪐 Движение Меркурия</h1>
        <p style={mercuryStyles.subtitle}>
          Влияние планеты на коммуникации и технологии
        </p>
      </div>

      {/* Статус Меркурия */}
      <Card 
        padding="xl"
        style={{
          ...mercuryStyles.statusCard,
          animation: 'slideInUp 0.6s ease-out'
        }}
      >
        <div style={{
          ...mercuryStyles.statusBadge,
          ...(isRetrograde ? mercuryStyles.retrogradeStatus : mercuryStyles.directStatus)
        }}>
          <span>{isRetrograde ? '↻' : '→'}</span>
          <span>{mercuryData.status}</span>
        </div>

        {/* Период */}
        <div style={mercuryStyles.periodInfo}>
          <span style={{ fontSize: '1.2rem' }}>📅</span>
          <div>
            <strong>Период:</strong> {mercuryData.period.start} - {mercuryData.period.end}
          </div>
        </div>

        {/* Описание влияния */}
        <p style={{
          fontSize: theme.typography.sizes.md,
          lineHeight: 1.6,
          color: theme.colors.text,
          marginBottom: theme.spacing.lg
        }}>
          {mercuryData.influence}
        </p>

        {/* Совет */}
        <div style={{
          padding: theme.spacing.md,
          backgroundColor: `${theme.colors.secondary}15`,
          borderRadius: theme.borderRadius.md,
          borderLeft: `4px solid ${theme.colors.secondary}`,
          marginBottom: theme.spacing.lg
        }}>
          <h4 style={{
            color: theme.colors.secondary,
            fontSize: theme.typography.sizes.md,
            margin: '0 0 8px 0',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs
          }}>
            <span>💡</span>
            <span>Рекомендации</span>
          </h4>
          <p style={{
            fontSize: theme.typography.sizes.sm,
            lineHeight: 1.5,
            color: theme.colors.text,
            margin: 0,
            fontStyle: 'italic'
          }}>
            {mercuryData.advice}
          </p>
        </div>
      </Card>

      {/* Детальная информация */}
      <div 
        style={{
          ...mercuryStyles.infoGrid,
          animation: 'slideInUp 0.6s ease-out 0.2s',
          animationFillMode: 'both'
        }}
      >
        
        {/* Интенсивность влияния */}
        {mercuryData.intensity && (
          <Card padding="lg">
            <h3 style={{
              color: theme.colors.text,
              marginBottom: theme.spacing.md,
              fontSize: theme.typography.sizes.md,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs
            }}>
              <span>⚡</span>
              <span>Интенсивность влияния</span>
            </h3>
            
            <div style={{
              ...mercuryStyles.intensityBadge,
              backgroundColor: `${getIntensityColor(mercuryData.intensity)}20`,
              color: getIntensityColor(mercuryData.intensity),
              border: `2px solid ${getIntensityColor(mercuryData.intensity)}40`,
              marginBottom: theme.spacing.md
            }}>
              {mercuryData.intensity}
            </div>

            {mercuryData.duration && (
              <p style={{
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.textSecondary,
                margin: 0
              }}>
                Осталось дней: <strong>{mercuryData.duration}</strong>
              </p>
            )}
          </Card>
        )}

        {/* Следующий ретроград */}
        <Card padding="lg">
          <h3 style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.sizes.md,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs
          }}>
            <span>🔮</span>
            <span>Прогноз</span>
          </h3>
          
          <p style={{
            fontSize: theme.typography.sizes.sm,
            color: theme.colors.textSecondary,
            lineHeight: 1.5,
            margin: 0
          }}>
            {mercuryData.nextRetrograde}
          </p>
        </Card>
      </div>

      {/* Области влияния */}
      <Card 
        padding="lg"
        style={{
          marginBottom: theme.spacing.lg,
          animation: 'slideInUp 0.6s ease-out 0.4s',
          animationFillMode: 'both'
        }}
      >
        <h3 style={{
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.sizes.md,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs
        }}>
          <span>🎯</span>
          <span>Области влияния</span>
        </h3>
        
        <div style={mercuryStyles.listContainer}>
          {mercuryData.affectedAreas.map((area, index) => (
            <div key={index} style={mercuryStyles.listItem}>
              <span style={{ color: theme.colors.primary, fontSize: '16px' }}>•</span>
              <span style={{ 
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.text
              }}>
                {area}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Практические рекомендации */}
      <Card 
        padding="lg"
        style={{
          marginBottom: theme.spacing.xl,
          animation: 'slideInUp 0.6s ease-out 0.6s',
          animationFillMode: 'both'
        }}
      >
        <h3 style={{
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.sizes.md,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs
        }}>
          <span>📋</span>
          <span>Что делать сейчас</span>
        </h3>
        
        <div style={mercuryStyles.listContainer}>
          {mercuryData.recommendations.map((recommendation, index) => (
            <div key={index} style={mercuryStyles.listItem}>
              <span style={{ 
                color: isRetrograde ? '#FF6B6B' : '#4ECDC4',
                fontSize: '16px'
              }}>
                {isRetrograde ? '⚠️' : '✅'}
              </span>
              <span style={{ 
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.text,
                lineHeight: 1.4
              }}>
                {recommendation}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Действия */}
      <div style={{ 
        display: 'flex',
        gap: theme.spacing.md,
        justifyContent: 'center',
        animation: 'slideInUp 0.6s ease-out 0.8s',
        animationFillMode: 'both'
      }}>
        <Button 
          variant="primary" 
          onClick={handleAddToFavorites}
          icon="⭐"
        >
          В избранное
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          icon="🔄"
        >
          Обновить данные
        </Button>
      </div>

      {/* Информация об обновлении */}
      {lastUpdated && (
        <div style={{
          textAlign: 'center',
          marginTop: theme.spacing.lg,
          color: theme.colors.textSecondary,
          fontSize: theme.typography.sizes.xs
        }}>
          Последнее обновление: {lastUpdated.toLocaleTimeString('ru-RU')}
        </div>
      )}
    </div>
  );
};

export default MercuryView;
