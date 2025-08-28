import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import useAPI from '../hooks/useAPI';

const HoroscopeView = ({ 
  selectedSign, 
  gnomeProfile, 
  onAddToFavorites, 
  telegramApp,
  astrologyData // 🚀 Новый проп с актуальными данными
}) => {
  const { theme } = useTheme();
  const { getHoroscope, loading, error } = useAPI();
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadHoroscope = async (sign = selectedSign) => {
    setRefreshing(true);
    try {
      const data = await getHoroscope(sign);
      setHoroscopeData(data);
    } catch (error) {
      console.error('Ошибка загрузки гороскопа:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHoroscope();
  }, [selectedSign]);

  const handleAddToFavorites = () => {
    if (horoscopeData && onAddToFavorites) {
      onAddToFavorites({
        type: 'horoscope',
        title: `${selectedSign} - ${new Date().toLocaleDateString('ru-RU')}`,
        content: horoscopeData.prediction || horoscopeData.text || 'Гороскоп на день',
        date: new Date().toLocaleDateString('ru-RU'),
        sign: selectedSign
      });

      if (telegramApp) {
        telegramApp.showAlert('Гороскоп добавлен в избранное! ⭐');
      }
    }
  };

  return (
    <div>
      {/* 🚀 Интеграция с актуальными лунными данными */}
      {astrologyData?.moon && (
        <Card title="🌙 Влияние луны сегодня">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '32px' }}>{astrologyData.moon.emoji}</span>
            <div>
              <div style={{ fontWeight: '600', color: theme.colors.text }}>
                {astrologyData.moon.phase}
              </div>
              <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                Освещенность: {astrologyData.moon.illumination}% • 
                {astrologyData.moon.lunarDay} лунный день
              </div>
            </div>
          </div>
          
          <p style={{ 
            fontSize: '14px', 
            color: theme.colors.textSecondary,
            margin: 0,
            fontStyle: 'italic'
          }}>
            Текущая лунная фаза может влиять на энергетику вашего знака зодиака
          </p>
        </Card>
      )}

      {/* Основной гороскоп */}
      <Card title={`🔮 Гороскоп для ${selectedSign}`}>
        {gnomeProfile && (
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px'
          }}>
            <h3 style={{ 
              margin: '0 0 8px 0',
              color: theme.colors.primary
            }}>
              {gnomeProfile.name}
            </h3>
            <p style={{ 
              fontSize: '14px',
              margin: '0 0 8px 0',
              fontWeight: '600',
              color: theme.colors.secondary
            }}>
              {gnomeProfile.title}
            </p>
            <p style={{ 
              fontSize: '14px',
              margin: 0,
              color: theme.colors.textSecondary
            }}>
              {gnomeProfile.desc}
            </p>
          </div>
        )}

        {loading || refreshing ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
            <p>Гномы изучают звезды для вас...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <p style={{ color: theme.colors.danger, marginBottom: '16px' }}>
              {error}
            </p>
            <Button onClick={() => loadHoroscope()}>🔄 Попробовать снова</Button>
          </div>
        ) : horoscopeData ? (
          <div>
            <div style={{
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '20px',
              color: theme.colors.text
            }}>
              {horoscopeData.prediction || horoscopeData.text || horoscopeData.horoscope}
            </div>

            {/* Дополнительная информация если есть */}
            {horoscopeData.lucky_numbers && (
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: theme.colors.success }}>
                  🍀 Счастливые числа: 
                </strong>
                <span> {horoscopeData.lucky_numbers.join(', ')}</span>
              </div>
            )}

            {horoscopeData.lucky_color && (
              <div style={{ marginBottom: '16px' }}>
                <strong style={{ color: theme.colors.success }}>
                  🎨 Цвет дня: 
                </strong>
                <span> {horoscopeData.lucky_color}</span>
              </div>
            )}

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
              
              <Button 
                onClick={() => loadHoroscope()}
                variant="ghost"
                style={{ flex: '1', minWidth: '120px' }}
              >
                🔄 Обновить
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      {/* 🚀 Дополнительные советы на основе лунной фазы */}
      {astrologyData?.moon && (
        <Card title="✨ Персональный совет">
          <p style={{ 
            fontSize: '14px', 
            color: theme.colors.textSecondary,
            lineHeight: '1.6',
            margin: 0
          }}>
            Сегодня {astrologyData.moon.phase.toLowerCase()} особенно благоприятна для {selectedSign}. 
            {astrologyData.moon.isWaxing ? 
              ' Используйте растущую энергию луны для новых начинаний.' :
              ' Время для завершения дел и освобождения от лишнего.'
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default HoroscopeView;
