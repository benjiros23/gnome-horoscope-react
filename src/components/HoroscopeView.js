import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import useAPI from '../hooks/useAPI';
import { saveHoroscope, loadHoroscope } from '../enhanced_cache';

const HoroscopeView = ({ 
  selectedSign, 
  gnomeProfile, 
  onAddToFavorites, 
  telegramApp,
  astrologyData // актуальные астрологические данные
}) => {
  const { theme } = useTheme();
  const { getHoroscope } = useAPI();
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Функция для получения фиксированного гороскопа на день
  const loadDailyHoroscope = async (sign = selectedSign) => {
    setLoading(true);
    setError(null);

    try {
      // Проверяем кеш на сегодняшний день
      const today = new Date().toISOString().split('T')[0];
      const cacheKey = `${sign}_${today}`;
      
      let dailyHoroscope = loadHoroscope(sign);
      
      if (dailyHoroscope) {
        console.log('📦 Гороскоп загружен из кеша для', sign);
        setHoroscopeData(dailyHoroscope);
        setLoading(false);
        return;
      }

      // Если в кеше нет, получаем новый и сохраняем на весь день
      console.log('🔮 Генерируем новый дневной гороскоп для', sign);
      const apiData = await getHoroscope(sign);
      
      if (apiData) {
        // Добавляем метаданные для фиксации на день
        const fixedHoroscope = {
          ...apiData,
          generatedDate: today,
          sign: sign,
          cached: true,
          expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
        };

        // Сохраняем в кеш до конца дня
        saveHoroscope(sign, fixedHoroscope);
        setHoroscopeData(fixedHoroscope);
      }

    } catch (err) {
      console.error('Ошибка загрузки гороскопа:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyHoroscope();
  }, [selectedSign]);

  const handleAddToFavorites = () => {
    if (horoscopeData && onAddToFavorites) {
      const content = horoscopeData.horoscope?.general || 
                     horoscopeData.prediction || 
                     horoscopeData.text || 
                     horoscopeData.horoscope ||
                     'Персональный гороскоп на день';

      onAddToFavorites({
        type: 'horoscope',
        title: `${selectedSign} - ${new Date().toLocaleDateString('ru-RU')}`,
        content: content,
        date: new Date().toLocaleDateString('ru-RU'),
        sign: selectedSign
      });

      if (telegramApp) {
        telegramApp.showAlert('Гороскоп добавлен в избранное! ⭐');
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
          <p>Гномы изучают звезды для вас...</p>
        </div>
      </Card>
    );
  }

  if (error && !horoscopeData) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <p style={{ color: theme.colors.danger, marginBottom: '16px' }}>
            Не удалось загрузить гороскоп
          </p>
          <p style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
            Попробуйте перезагрузить приложение
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Интеграция с лунными данными */}
      {astrologyData?.moon && (
        <Card>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '32px' }}>{astrologyData.moon.emoji}</span>
            <div>
              <div style={{ fontWeight: '600', color: theme.colors.text }}>
                {astrologyData.moon.phase}
              </div>
              <div style={{ fontSize: '14px', color: theme.colors.textSecondary }}>
                Влияет на энергетику {selectedSign}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Основной гороскоп */}
      <Card title={`🔮 Гороскоп на сегодня для ${selectedSign}`}>
        {/* Индикатор фиксированного гороскопа */}
        <div style={{
          padding: '8px 12px',
          backgroundColor: theme.colors.success + '20',
          border: `1px solid ${theme.colors.success}`,
          borderRadius: '6px',
          fontSize: '14px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🔒</span>
          <span>Ваш персональный гороскоп на {new Date().toLocaleDateString('ru-RU')}</span>
          {horoscopeData?.cached && (
            <span style={{ opacity: 0.7, fontSize: '12px' }}>
              (сохранен на весь день)
            </span>
          )}
        </div>

        {gnomeProfile && (
          <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: theme.colors.surface,
            borderRadius: '8px',
            border: `1px solid ${theme.colors.border}`
          }}>
            <h3 style={{ 
              margin: '0 0 8px 0',
              color: theme.colors.primary,
              fontSize: '18px'
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
              color: theme.colors.textSecondary,
              fontStyle: 'italic'
            }}>
              {gnomeProfile.desc}
            </p>
          </div>
        )}

        {horoscopeData && (
          <div>
            {/* Основной текст гороскопа */}
            <div style={{
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '20px',
              color: theme.colors.text,
              padding: '16px',
              backgroundColor: theme.colors.surface + '50',
              borderRadius: '8px',
              borderLeft: `4px solid ${theme.colors.primary}`
            }}>
              {horoscopeData.horoscope?.general || 
               horoscopeData.prediction || 
               horoscopeData.text || 
               horoscopeData.horoscope ||
               'Звезды благоволят вам сегодня! Прислушивайтесь к интуиции и доверяйте своим чувствам.'}
            </div>

            {/* Детали гороскопа в сетке */}
            {(horoscopeData.horoscope?.love || horoscopeData.horoscope?.work || horoscopeData.horoscope?.health) && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '12px',
                marginBottom: '20px'
              }}>
                {horoscopeData.horoscope?.love && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: theme.colors.surface,
                    borderRadius: '8px',
                    border: `1px solid ${theme.colors.border}`
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: theme.colors.danger }}>💕 Любовь</h4>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                      {horoscopeData.horoscope.love}
                    </p>
                  </div>
                )}

                {horoscopeData.horoscope?.work && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: theme.colors.surface,
                    borderRadius: '8px',
                    border: `1px solid ${theme.colors.border}`
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: theme.colors.warning }}>💼 Работа</h4>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                      {horoscopeData.horoscope.work}
                    </p>
                  </div>
                )}

                {horoscopeData.horoscope?.health && (
                  <div style={{
                    padding: '12px',
                    backgroundColor: theme.colors.surface,
                    borderRadius: '8px',
                    border: `1px solid ${theme.colors.border}`
                  }}>
                    <h4 style={{ margin: '0 0 8px 0', color: theme.colors.success }}>🌱 Здоровье</h4>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.4' }}>
                      {horoscopeData.horoscope.health}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Дополнительная информация */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              {horoscopeData.luckyNumber && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: theme.colors.success + '20',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  🍀 Счастливое число: <strong>{horoscopeData.luckyNumber}</strong>
                </div>
              )}

              {horoscopeData.luckyColor && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: theme.colors.info + '20',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  🎨 Цвет дня: <strong>{horoscopeData.luckyColor}</strong>
                </div>
              )}

              {horoscopeData.element && (
                <div style={{
                  padding: '8px 12px',
                  backgroundColor: theme.colors.secondary + '20',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}>
                  ✨ Стихия: <strong>{horoscopeData.element}</strong>
                </div>
              )}
            </div>

            {/* Только кнопка добавления в избранное (БЕЗ кнопки обновления) */}
            <div style={{ textAlign: 'center' }}>
              <Button
                onClick={handleAddToFavorites}
                style={{
                  ...theme.button.secondary,
                  minWidth: '200px',
                  fontSize: '16px',
                  padding: '12px 24px'
                }}
              >
                ⭐ Сохранить в избранное
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Совет на основе лунной фазы */}
      {astrologyData?.moon && (
        <Card title="✨ Совет дня от лунных гномов">
          <p style={{ 
            fontSize: '14px', 
            color: theme.colors.textSecondary,
            lineHeight: '1.6',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Сегодня {astrologyData.moon.phase.toLowerCase()} создает особую энергию для {selectedSign}. 
            {astrologyData.moon.isWaxing ? 
              ' Растущая луна поддерживает ваши амбиции и новые планы.' :
              ' Убывающая луна помогает завершить важные дела и отпустить лишнее.'
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default HoroscopeView;
