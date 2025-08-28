import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import { EnhancedMoonPhase } from '../enhanced_moonPhase';
import { useMoonData } from '../hooks/useAstrologyData';
import useAPI from '../hooks/useAPI';

const MoonView = ({ onAddToFavorites, telegramApp, realTimeMoonData, onRefreshMoonData }) => {
  const { theme } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [localLoading, setLocalLoading] = useState(false);
  
  // Используем актуальные данные из App.js или загружаем собственные
  const { moon: hookMoonData, loading: hookLoading, refresh: hookRefresh } = useMoonData({
    autoUpdate: !realTimeMoonData, // Отключаем если данные уже приходят из App
    updateInterval: 6 * 60 * 60 * 1000
  });
  
  const { getEnhancedMoonData } = useAPI();
  
  // Выбираем источник данных: переданные из App или собственные
  const moonData = realTimeMoonData || hookMoonData;
  const loading = hookLoading || localLoading;
  const refreshData = onRefreshMoonData || hookRefresh;

  const [currentMoonData, setCurrentMoonData] = useState(moonData);
  const [gnomeAdvice, setGnomeAdvice] = useState(null);

  useEffect(() => {
    if (moonData) {
      setCurrentMoonData(moonData);
      
      // Получаем советы гномов для текущей фазы
      const advice = EnhancedMoonPhase.getGnomeAdvice(moonData.phase);
      setGnomeAdvice(advice);
    }
  }, [moonData]);

  const handleDateChange = async (newDate) => {
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
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAddToFavorites = () => {
    if (currentMoonData && onAddToFavorites) {
      onAddToFavorites({
        type: 'moon',
        title: `${currentMoonData.emoji} ${currentMoonData.phase}`,
        content: `${currentMoonData.illumination}% освещенности, ${currentMoonData.lunarDay} лунный день`,
        date: selectedDate.toLocaleDateString('ru-RU'),
        moonData: currentMoonData
      });

      if (telegramApp) {
        telegramApp.showAlert('Лунные данные добавлены в избранное! ⭐');
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌙</div>
          <p>Загружаем актуальные лунные данные...</p>
        </div>
      </Card>
    );
  }

  if (!currentMoonData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <p>Не удалось загрузить данные о луне</p>
          <Button onClick={refreshData}>🔄 Попробовать снова</Button>
        </div>
      </Card>
    );
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div>
      {/* Селектор даты */}
      <Card>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontWeight: '600',
            color: theme.colors.text
          }}>
            Выберите дату:
          </label>
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => handleDateChange(new Date(e.target.value))}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '6px',
              backgroundColor: theme.card.background,
              color: theme.card.color
            }}
          />
        </div>

        {isToday && currentMoonData.source && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: theme.colors.success + '20',
            border: `1px solid ${theme.colors.success}`,
            borderRadius: '6px',
            fontSize: '14px',
            marginBottom: '16px'
          }}>
            ✅ Актуальные данные (источник: {currentMoonData.source})
          </div>
        )}
      </Card>

      {/* Основная информация о луне */}
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ 
            fontSize: '64px', 
            lineHeight: '1',
            marginBottom: '8px' 
          }}>
            {currentMoonData.emoji}
          </div>
          <h2 style={{ 
            fontSize: '24px', 
            margin: '0 0 8px 0',
            color: theme.colors.text
          }}>
            {currentMoonData.phase}
          </h2>
          <p style={{ 
            fontSize: '16px', 
            margin: 0,
            color: theme.colors.textSecondary
          }}>
            {selectedDate.toLocaleDateString('ru-RU', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        {/* Основные данные */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.primary }}>
              {currentMoonData.illumination}%
            </div>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              Освещенность
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.primary }}>
              {currentMoonData.lunarDay}
            </div>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              Лунный день
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '16px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.primary }}>
              {Math.floor(currentMoonData.age)}
            </div>
            <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
              Дней от новолуния
            </div>
          </div>
        </div>

        {/* Времена восхода и захода */}
        {(currentMoonData.moonrise || currentMoonData.moonset) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '16px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            marginBottom: '20px',
            border: `1px solid ${theme.colors.border}`
          }}>
            {currentMoonData.moonrise && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>🌅 {currentMoonData.moonrise}</div>
                <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>Восход</div>
              </div>
            )}
            
            {currentMoonData.moonset && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>🌇 {currentMoonData.moonset}</div>
                <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>Заход</div>
              </div>
            )}
          </div>
        )}

        {/* Направление (растет/убывает) */}
        <div style={{
          textAlign: 'center',
          padding: '16px',
          backgroundColor: currentMoonData.isWaxing ? 
            theme.colors.success + '20' : 
            theme.colors.warning + '20',
          borderRadius: '8px',
          marginBottom: '20px',
          border: `1px solid ${currentMoonData.isWaxing ? theme.colors.success : theme.colors.warning}`
        }}>
          <div style={{ fontSize: '20px', marginBottom: '4px' }}>
            {currentMoonData.isWaxing ? '🌱 Растущая луна' : '🍂 Убывающая луна'}
          </div>
          <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
            {currentMoonData.isWaxing ? 
              'Время для начинаний и роста' : 
              'Время для завершения и освобождения'
            }
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
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

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              margin: '0 0 8px 0',
              color: theme.colors.success 
            }}>
              ✅ Рекомендуется:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {gnomeAdvice.activities?.map((activity, index) => (
                <span 
                  key={index}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: theme.colors.success + '20',
                    color: theme.colors.success,
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <h4 style={{ 
              fontSize: '16px', 
              margin: '0 0 8px 0',
              color: theme.colors.danger 
            }}>
              ❌ Избегайте:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {gnomeAdvice.avoid?.map((item, index) => (
                <span 
                  key={index}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: theme.colors.danger + '20',
                    color: theme.colors.danger,
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            padding: '12px',
            backgroundColor: theme.colors.info + '20',
            borderRadius: '8px',
            border: `1px solid ${theme.colors.info}`
          }}>
            <strong style={{ color: theme.colors.info }}>
              💫 Энергия дня: {gnomeAdvice.energy}
            </strong>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MoonView;
