import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  astrologyData
}) => {
  const { theme } = useTheme();
  const { getHoroscope } = useAPI();
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Функция для получения фиксированного гороскопа на день
  const loadDailyHoroscope = useCallback(async (sign = selectedSign) => {
    setLoading(true);
    setError(null);

    try {
      // Проверяем кеш на сегодняшний день
      let dailyHoroscope = loadHoroscope(sign);

      if (dailyHoroscope && dailyHoroscope.generatedDate === today) {
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
      } else {
        // Fallback гороскоп
        const fallbackHoroscope = {
          horoscope: `Звезды готовят для ${sign} особенный день! Ваша интуиция подскажет верные решения.`,
          sign: sign,
          generatedDate: today,
          source: 'fallback'
        };
        setHoroscopeData(fallbackHoroscope);
      }

    } catch (err) {
      console.error('Ошибка загрузки гороскопа:', err);
      setError(err.message);
      
      // Даже при ошибке показываем fallback
      const fallbackHoroscope = {
        horoscope: `Звезды готовят для ${sign} особенный день! Доверьтесь своей интуиции.`,
        sign: sign,
        generatedDate: today,
        source: 'error_fallback'
      };
      setHoroscopeData(fallbackHoroscope);
      
    } finally {
      setLoading(false);
    }
  }, [selectedSign, getHoroscope, today]);

  useEffect(() => {
    loadDailyHoroscope();
  }, [selectedSign, loadDailyHoroscope]);

  const handleAddToFavorites = useCallback(() => {
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

      if (telegramApp && telegramApp.showAlert) {
        telegramApp.showAlert('Гороскоп добавлен в избранное! ⭐');
      }
    }
  }, [horoscopeData, onAddToFavorites, selectedSign, telegramApp]);

  const handleRefresh = useCallback(() => {
    // Очищаем кеш для принудительного обновления
    try {
      const cacheKey = `horoscope_${selectedSign}_${today}`;
      localStorage.removeItem(`gnome_cache_${cacheKey}`);
    } catch (e) {
      console.warn('Не удалось очистить кеш:', e);
    }
    loadDailyHoroscope();
  }, [selectedSign, today, loadDailyHoroscope]);

  // Лунное влияние
  const lunarInfluence = useMemo(() => {
    if (!astrologyData?.moon) return null;
    
    const { phase, isWaxing, emoji } = astrologyData.moon;
    
    return `${emoji} Сегодня ${phase.toLowerCase()} создает особую энергию для ${selectedSign}. ${
      isWaxing 
        ? 'Растущая луна поддерживает ваши амбиции и новые планы.' 
        : 'Убывающая луна помогает завершить важные дела и отпустить лишнее.'
    }`;
  }, [astrologyData, selectedSign]);

  // Стили
  const styles = useMemo(() => ({
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    
    signTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    
    gnomeCard: {
      background: 'rgba(100, 126, 234, 0.1)',
      border: '1px solid rgba(100, 126, 234, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      textAlign: 'center'
    },
    
    loadingContainer: {
      textAlign: 'center',
      padding: '40px 20px'
    },
    
    spinner: {
      fontSize: '48px',
      marginBottom: '16px',
      animation: 'spin 2s linear infinite'
    },
    
    errorContainer: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#f44336'
    },
    
    horoscopeText: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#ffffff',
      marginBottom: '20px',
      padding: '20px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    
    lunarCard: {
      background: 'linear-gradient(135deg, rgba(244,197,66,0.1), rgba(255,215,0,0.05))',
      border: '1px solid rgba(244,197,66,0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px'
    },
    
    buttonsContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }), []);

  // Получение эмодзи знака зодиака
  const getZodiacEmoji = (sign) => {
    const emojis = {
      'Овен': '♈',
      'Телец': '♉',
      'Близнецы': '♊',
      'Рак': '♋',
      'Лев': '♌',
      'Дева': '♍',
      'Весы': '♎',
      'Скорпион': '♏',
      'Стрелец': '♐',
      'Козерог': '♑',
      'Водолей': '♒',
      'Рыбы': '♓'
    };
    return emojis[sign] || '⭐';
  };

  // Рендер загрузки
  if (loading && !horoscopeData) {
    return (
      <div style={styles.container}>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        
        <Card>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}>🔮</div>
            <h3 style={{ color: '#667eea', marginBottom: '8px' }}>
              Гномы изучают звезды для вас...
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              Составляем персональный прогноз для {selectedSign}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Рендер ошибки
  if (error && !horoscopeData) {
    return (
      <div style={styles.container}>
        <Card>
          <div style={styles.errorContainer}>
            <h3 style={{ marginBottom: '16px' }}>
              ⚠️ Не удалось загрузить гороскоп
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </p>
            <Button onClick={handleRefresh}>
              🔄 Попробовать снова
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Заголовок */}
      <div style={styles.header}>
        <h1 style={styles.signTitle}>
          {selectedSign}
          <span style={{ fontSize: '32px' }}>
            {getZodiacEmoji(selectedSign)}
          </span>
        </h1>
      </div>

      {/* Информация о гноме */}
      {gnomeProfile && (
        <div style={styles.gnomeCard}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#667eea', 
            marginBottom: '4px' 
          }}>
            {gnomeProfile.name}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: 'rgba(255,255,255,0.8)', 
            fontStyle: 'italic' 
          }}>
            {gnomeProfile.title}
          </div>
          <div style={{ 
            fontSize: '13px', 
            color: 'rgba(255,255,255,0.7)', 
            marginTop: '8px' 
          }}>
            {gnomeProfile.desc}
          </div>
        </div>
      )}

      {/* Основной гороскоп */}
      <Card title="🔮 Ваш гороскоп на сегодня">
        <div style={styles.horoscopeText}>
          {horoscopeData?.horoscope?.general ||
           horoscopeData?.prediction ||
           horoscopeData?.text ||
           horoscopeData?.horoscope ||
           'Звезды готовят для вас особенный день!'}
        </div>
        
        {/* Дополнительные разделы если есть */}
        {horoscopeData?.horoscope?.love && (
          <div style={{
            padding: '16px',
            background: 'rgba(255,192,203,0.1)',
            border: '1px solid rgba(255,192,203,0.3)',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <h4 style={{ color: '#ff69b4', marginBottom: '8px' }}>💕 Любовь</h4>
            <p style={{ color: '#ffffff', fontSize: '14px', margin: 0 }}>
              {horoscopeData.horoscope.love}
            </p>
          </div>
        )}

        {horoscopeData?.horoscope?.work && (
          <div style={{
            padding: '16px',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <h4 style={{ color: '#ffd700', marginBottom: '8px' }}>💼 Работа</h4>
            <p style={{ color: '#ffffff', fontSize: '14px', margin: 0 }}>
              {horoscopeData.horoscope.work}
            </p>
          </div>
        )}

        {horoscopeData?.horoscope?.health && (
          <div style={{
            padding: '16px',
            background: 'rgba(50,205,50,0.1)',
            border: '1px solid rgba(50,205,50,0.3)',
            borderRadius: '12px',
            marginBottom: '16px'
          }}>
            <h4 style={{ color: '#32cd32', marginBottom: '8px' }}>🍃 Здоровье</h4>
            <p style={{ color: '#ffffff', fontSize: '14px', margin: 0 }}>
              {horoscopeData.horoscope.health}
            </p>
          </div>
        )}
        
        {/* Источник данных */}
        {horoscopeData?.source && (
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.5)', 
            textAlign: 'center',
            marginTop: '16px'
          }}>
            Источник: {
              horoscopeData.source === 'api' ? 'API сервер' : 
              horoscopeData.source === 'cache' ? 'Кеш' : 
              horoscopeData.source === 'fallback' ? 'Локальная база' : 
              horoscopeData.source === 'error_fallback' ? 'Резервные данные' :
              horoscopeData.source
            }
          </div>
        )}
      </Card>

      {/* Лунное влияние */}
      {lunarInfluence && (
        <div style={styles.lunarCard}>
          <p style={{ 
            fontSize: '14px', 
            lineHeight: '1.5', 
            color: '#ffffff', 
            textAlign: 'center',
            margin: 0
          }}>
            {lunarInfluence}
          </p>
        </div>
      )}

      {/* Кнопки действий */}
      <div style={styles.buttonsContainer}>
        <Button onClick={handleAddToFavorites}>
          ⭐ Добавить в избранное
        </Button>
        <Button 
          onClick={handleRefresh}
          variant="secondary"
        >
          🔄 Обновить
        </Button>
      </div>
    </div>
  );
};

export default HoroscopeView;
