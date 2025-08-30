import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import { EnhancedMoonPhase } from '../enhanced_moonPhase';
import { useMoonData } from '../hooks/useAstrologyData';
import useAPI from '../hooks/useAPI';

const MoonView = ({ 
  onAddToFavorites, 
  telegramApp, 
  realTimeMoonData, 
  onRefreshMoonData 
}) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [localLoading, setLocalLoading] = useState(false);
  const [currentMoonData, setCurrentMoonData] = useState(null);
  const [gnomeAdvice, setGnomeAdvice] = useState(null);
  
  // Используем актуальные данные из App.js или загружаем собственные
  const { 
    moon: hookMoonData, 
    loading: hookLoading, 
    refresh: hookRefresh 
  } = useMoonData({
    autoUpdate: !realTimeMoonData,
    updateInterval: 6 * 60 * 60 * 1000
  });

  // Мемоизированные значения
  const moonData = useMemo(() => 
    realTimeMoonData || hookMoonData, 
    [realTimeMoonData, hookMoonData]
  );
  
  const loading = useMemo(() => 
    hookLoading || localLoading, 
    [hookLoading, localLoading]
  );
  
  const refreshData = useMemo(() => 
    onRefreshMoonData || hookRefresh, 
    [onRefreshMoonData, hookRefresh]
  );

  const isToday = useMemo(() => 
    selectedDate.toDateString() === new Date().toDateString(),
    [selectedDate]
  );

  const formattedDate = useMemo(() => 
    selectedDate.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    }),
    [selectedDate]
  );

  // Эффект для обновления данных при изменении источника
  useEffect(() => {
    if (moonData) {
      setCurrentMoonData(moonData);
      
      // Получаем советы гномов для текущей фазы
      const advice = EnhancedMoonPhase.getGnomeAdvice(moonData.phase);
      setGnomeAdvice(advice);
    }
  }, [moonData]);

  // Мемоизированный обработчик смены даты
  const handleDateChange = useCallback(async (newDate) => {
    if (newDate.toDateString() === new Date().toDateString()) {
      // Если выбрана сегодняшняя дата, используем актуальные данные
      setSelectedDate(newDate);
      setCurrentMoonData(moonData);
      return;
    }

    setLocalLoading(true);
    setSelectedDate(newDate);
    
    try {
      // Для других дат используем EnhancedMoonPhase
      const data = EnhancedMoonPhase.calculatePhase(newDate);
      setCurrentMoonData(data);
      
      const advice = EnhancedMoonPhase.getGnomeAdvice(data.phase);
      setGnomeAdvice(advice);
    } catch (error) {
      console.error('Ошибка загрузки данных для даты:', error);
      // Показываем fallback данные
      const fallbackData = EnhancedMoonPhase.getFallbackData(newDate);
      setCurrentMoonData(fallbackData);
      setGnomeAdvice(EnhancedMoonPhase.getGnomeAdvice(fallbackData.phase));
    } finally {
      setLocalLoading(false);
    }
  }, [moonData]);

  // Мемоизированный обработчик добавления в избранное
  const handleAddToFavorites = useCallback(() => {
    if (!currentMoonData || !onAddToFavorites) return;

    onAddToFavorites({
      type: 'moon',
      title: `${currentMoonData.emoji} ${currentMoonData.phase}`,
      content: `${currentMoonData.illumination}% освещенности, ${currentMoonData.lunarDay} лунный день`,
      date: selectedDate.toLocaleDateString('ru-RU'),
      moonData: currentMoonData
    });

    const message = 'Лунные данные добавлены в избранное! ⭐';
    if (telegramApp?.showAlert) {
      telegramApp.showAlert(message);
    } else {
      console.log(message);
    }
  }, [currentMoonData, onAddToFavorites, selectedDate, telegramApp]);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    dateInput: {
      width: '100%',
      ...theme.components.input,
      backgroundColor: theme.colors.surface || theme.card.background,
      color: theme.colors.text || theme.card.color
    },
    
    statusBadge: {
      padding: '8px 12px',
      backgroundColor: `${theme.colors.success}20`,
      border: `1px solid ${theme.colors.success}`,
      borderRadius: '6px',
      fontSize: '14px',
      marginBottom: '16px'
    },

    moonEmoji: {
      fontSize: '64px',
      lineHeight: '1',
      marginBottom: '8px'
    },

    moonTitle: {
      fontSize: '24px',
      margin: '0 0 8px 0',
      color: theme.colors.text
    },

    dateText: {
      fontSize: '16px',
      margin: 0,
      color: theme.colors.textSecondary
    },

    dataGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '12px',
      marginBottom: '20px'
    },

    dataCard: {
      textAlign: 'center',
      padding: '16px',
      backgroundColor: theme.colors.surface || 'rgba(255,255,255,0.05)',
      borderRadius: '8px',
      border: `1px solid ${theme.colors.border}`
    },

    dataValue: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: theme.colors.primary
    },

    dataLabel: {
      fontSize: '14px',
      color: theme.colors.textSecondary
    },

    timesContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      padding: '16px',
      backgroundColor: theme.colors.surface || 'rgba(255,255,255,0.05)',
      borderRadius: '8px',
      marginBottom: '20px',
      border: `1px solid ${theme.colors.border}`
    },

    phaseCard: (isWaxing) => ({
      textAlign: 'center',
      padding: '16px',
      backgroundColor: isWaxing ? 
        `${theme.colors.success}20` : 
        `${theme.colors.warning}20`,
      borderRadius: '8px',
      marginBottom: '20px',
      border: `1px solid ${isWaxing ? theme.colors.success : theme.colors.warning}`
    }),

    buttonsContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },

    adviceTag: (type) => ({
      padding: '4px 8px',
      backgroundColor: `${theme.colors[type]}20`,
      color: theme.colors[type],
      borderRadius: '4px',
      fontSize: '14px'
    }),

    energyBadge: {
      padding: '12px',
      backgroundColor: `${theme.colors.info}20`,
      borderRadius: '8px',
      border: `1px solid ${theme.colors.info}`
    }
  }), [theme]);

  // Компонент загрузки
  const LoadingCard = () => (
    <Card>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
        <p style={{ color: theme.colors.textSecondary }}>
          Загружаем актуальные лунные данные...
        </p>
      </div>
    </Card>
  );

  // Компонент ошибки
  const ErrorCard = () => (
    <Card>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <p style={{ color: theme.colors.textSecondary, marginBottom: '16px' }}>
          Не удалось загрузить данные о луне
        </p>
        <Button onClick={refreshData}>🔄 Попробовать снова</Button>
      </div>
    </Card>
  );

  // Рендер состояний
  if (loading && !currentMoonData) {
    return <LoadingCard />;
  }

  if (!currentMoonData) {
    return <ErrorCard />;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Селектор даты */}
      <Card title="📅 Выбор даты">
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => handleDateChange(new Date(e.target.value))}
          style={styles.dateInput}
        />
        
        {isToday && currentMoonData.source && (
          <div style={styles.statusBadge}>
            ✅ Актуальные данные (источник: {currentMoonData.source})
          </div>
        )}
      </Card>

      {/* Основная информация о луне */}
      <Card title="🌙 Лунная информация">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={styles.moonEmoji}>
            {currentMoonData.emoji}
          </div>
          <h2 style={styles.moonTitle}>
            {currentMoonData.phase}
          </h2>
          <p style={styles.dateText}>
            {formattedDate}
          </p>
        </div>

        {/* Основные данные */}
        <div style={styles.dataGrid}>
          <div style={styles.dataCard}>
            <div style={styles.dataValue}>
              {currentMoonData.illumination}%
            </div>
            <div style={styles.dataLabel}>Освещенность</div>
          </div>
          
          <div style={styles.dataCard}>
            <div style={styles.dataValue}>
              {currentMoonData.lunarDay}
            </div>
            <div style={styles.dataLabel}>Лунный день</div>
          </div>
          
          <div style={styles.dataCard}>
            <div style={styles.dataValue}>
              {Math.floor(currentMoonData.age)}
            </div>
            <div style={styles.dataLabel}>Дней от новолуния</div>
          </div>
        </div>

        {/* Времена восхода и захода */}
        {(currentMoonData.moonrise || currentMoonData.moonset) && (
          <div style={styles.timesContainer}>
            {currentMoonData.moonrise && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  🌅 {currentMoonData.moonrise}
                </div>
                <div style={styles.dataLabel}>Восход</div>
              </div>
            )}
            
            {currentMoonData.moonset && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                  🌇 {currentMoonData.moonset}
                </div>
                <div style={styles.dataLabel}>Заход</div>
              </div>
            )}
          </div>
        )}

        {/* Направление (растет/убывает) */}
        <div style={styles.phaseCard(currentMoonData.isWaxing)}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>
            {currentMoonData.isWaxing ? '🌱 Растущая луна' : '🍂 Убывающая луна'}
          </div>
          <div style={styles.dataLabel}>
            {currentMoonData.isWaxing ? 
              'Время для начинаний и роста' : 
              'Время для завершения и освобождения'
            }
          </div>
        </div>

        {/* Кнопки действий */}
        <div style={styles.buttonsContainer}>
          <Button 
            onClick={handleAddToFavorites}
            variant="secondary"
            style={{ flex: '1', minWidth: '120px' }}
          >
            ⭐ В избранное
          </Button>
          
          {isToday && (
            <Button 
              onClick={refreshData}
              variant="ghost"
              style={{ flex: '1', minWidth: '120px' }}
            >
              🔄 Обновить
            </Button>
          )}
        </div>
      </Card>

      {/* Советы гномов */}
      {gnomeAdvice && (
        <Card title={`🧙‍♂️ ${gnomeAdvice.title}`}>
          <p style={{ 
            fontSize: '16px', 
            lineHeight: '1.6',
            marginBottom: '16px',
            color: theme.colors.text
          }}>
            {gnomeAdvice.text}
          </p>
          
          {gnomeAdvice.activities && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                margin: '0 0 8px 0',
                color: theme.colors.success 
              }}>
                ✅ Рекомендуется:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {gnomeAdvice.activities.map((activity, index) => (
                  <span key={index} style={styles.adviceTag('success')}>
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {gnomeAdvice.avoid && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ 
                fontSize: '16px', 
                margin: '0 0 8px 0',
                color: theme.colors.error 
              }}>
                ❌ Избегайте:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {gnomeAdvice.avoid.map((item, index) => (
                  <span key={index} style={styles.adviceTag('error')}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {gnomeAdvice.energy && (
            <div style={styles.energyBadge}>
              <strong style={{ color: theme.colors.info }}>
                💫 Энергия дня: {gnomeAdvice.energy}
              </strong>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default MoonView;
