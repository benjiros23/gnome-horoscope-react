import React, { useState, useEffect } from 'react';
import useAPI from '../hooks/useAPI';

const HoroscopeView = ({ selectedSign, onSignSelect, onAddToFavorites, telegramApp }) => {
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ПРАВИЛЬНОЕ использование useAPI хука
  const { getHoroscope } = useAPI();

  const loadHoroscope = async (sign) => {
    if (!sign) return;
    
    setLoading(true);
    setError(null);
    setHoroscopeData(null);
    
    try {
      console.log('🔮 Загружаем гороскоп для знака:', sign);
      
      // Правильный вызов метода из хука
      const data = await getHoroscope(sign);
      
      console.log('✅ Гороскоп получен:', data);
      setHoroscopeData(data);
      
      // Сохраняем в кеш
      try {
        localStorage.setItem(`horoscope_${sign}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
        console.log('💾 Гороскоп сохранен в кеш');
      } catch (cacheError) {
        console.warn('Не удалось сохранить в кеш:', cacheError);
      }
      
    } catch (fetchError) {
      console.error('❌ Ошибка загрузки гороскопа:', fetchError);
      setError(fetchError.message || 'Не удалось загрузить гороскоп');
      
      // Пытаемся загрузить из кеша при ошибке
      try {
        const cached = localStorage.getItem(`horoscope_${sign}`);
        if (cached) {
          const { data } = JSON.parse(cached);
          setHoroscopeData(data);
          setError('Показан кешированный гороскоп (нет связи с сервером)');
          console.log('📦 Загружен из кеша:', data);
        }
      } catch (cacheError) {
        console.error('Ошибка загрузки из кеша:', cacheError);
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Проверка кеша и загрузка
  useEffect(() => {
    console.log('🔮 HoroscopeView смонтирован, selectedSign:', selectedSign);
    
    if (selectedSign) {
      // Проверяем кеш сначала
      try {
        const cached = localStorage.getItem(`horoscope_${selectedSign}`);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > 3600000; // 1 час
          
          if (!isExpired) {
            console.log('✅ Гороскоп для', selectedSign, 'загружен из кеша');
            setHoroscopeData(data);
            return;
          }
        }
      } catch (cacheError) {
        console.warn('Ошибка чтения кеша:', cacheError);
      }
      
      // Загружаем с сервера с небольшой задержкой
      const timer = setTimeout(() => {
        console.log('🔮 Загружаем новый гороскоп для', selectedSign + '...');
        loadHoroscope(selectedSign);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [selectedSign, getHoroscope]);

  // Принудительная загрузка нового гороскопа
  const handleRefresh = () => {
    if (selectedSign) {
      // Очищаем кеш
      try {
        localStorage.removeItem(`horoscope_${selectedSign}`);
      } catch (e) {
        console.warn('Ошибка очистки кеша:', e);
      }
      
      console.log('🔄 Принудительное получение нового гороскопа...');
      loadHoroscope(selectedSign);
    }
  };

  const handleAddToFavorites = () => {
    if (horoscopeData && onAddToFavorites) {
      const favoriteItem = {
        type: 'horoscope',
        title: `Гороскоп для ${horoscopeData.sign}`,
        content: horoscopeData.horoscope.general,
        date: horoscopeData.date,
        sign: horoscopeData.sign,
        gnome: horoscopeData.gnome
      };
      
      onAddToFavorites(favoriteItem);
      
      // Безопасный haptic feedback
      try {
        if (telegramApp && parseFloat(telegramApp.version) >= 6.1 && telegramApp.HapticFeedback) {
          telegramApp.HapticFeedback.notificationOccurred('success');
        }
      } catch (e) {
        console.log('Haptic feedback недоступен');
      }
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    card: {
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      padding: '24px',
      margin: '16px',
      color: '#2d3748'
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#1a202c',
      textAlign: 'center'
    },
    subtitle: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '16px',
      color: '#4a5568',
      fontStyle: 'italic',
      textAlign: 'center'
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px'
    },
    errorMessage: {
      color: '#dc3545',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      borderRadius: '12px',
      margin: '20px 0',
      border: '1px solid rgba(220, 53, 69, 0.2)'
    },
    section: {
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(8px)'
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#2d3748'
    },
    sectionText: {
      fontSize: '15px',
      lineHeight: '1.5',
      color: '#4a5568'
    },
    metaGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: '10px',
      marginTop: '20px'
    },
    metaItem: {
      backgroundColor: 'rgba(139, 195, 74, 0.2)',
      color: '#2e7d0f',
      padding: '8px 12px',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid rgba(139, 195, 74, 0.3)',
      textAlign: 'center'
    },
    buttonContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '24px',
      flexWrap: 'wrap'
    },
    button: {
      border: 'none',
      borderRadius: '12px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    },
    refreshButton: {
      background: 'linear-gradient(135deg, #28a745, #20c997)',
      color: 'white'
    },
    favoriteButton: {
      background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      color: 'white'
    },
    placeholderContainer: {
      textAlign: 'center',
      padding: '40px 20px'
    }
  };

  console.log('🎨 HoroscopeView: Рендеринг, состояние:', { 
    loading, 
    error: !!error, 
    hasData: !!horoscopeData,
    selectedSign 
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>
          🔮 Гороскоп для знака {selectedSign}
        </h3>
        {horoscopeData && (
          <p style={styles.subtitle}>
            от {horoscopeData.gnome}
          </p>
        )}

        {loading && (
          <div style={styles.loadingSpinner}>
            ⏳ Звезды составляют ваш гороскоп...
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        {horoscopeData && !loading && (
          <div>
            {/* Общий прогноз */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>✨ Общий прогноз</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope?.general || 'Общий прогноз недоступен'}
              </div>
            </div>

            {/* Любовь */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>💝 Любовь и отношения</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope?.love || 'Прогноз по любви недоступен'}
              </div>
            </div>

            {/* Работа */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>💼 Карьера и финансы</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope?.work || 'Прогноз по работе недоступен'}
              </div>
            </div>

            {/* Здоровье */}
            <div style={styles.section}>
              <div style={styles.sectionTitle}>🏃‍♂️ Здоровье</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope?.health || 'Прогноз по здоровью недоступен'}
              </div>
            </div>

            {/* Дополнительная информация */}
            <div style={styles.metaGrid}>
              <div style={styles.metaItem}>
                🍀 Число: {horoscopeData.luckyNumber || '?'}
              </div>
              <div style={styles.metaItem}>
                🎨 Цвет: {horoscopeData.luckyColor || 'Неизвестно'}
              </div>
              <div style={styles.metaItem}>
                🌟 Элемент: {horoscopeData.element || 'Неизвестно'}
              </div>
              <div style={styles.metaItem}>
                💕 Совместимость: {horoscopeData.compatibility || 'Неизвестно'}
              </div>
            </div>

            {/* Кнопки действий */}
            <div style={styles.buttonContainer}>
              <button 
                style={{...styles.button, ...styles.refreshButton}}
                onClick={handleRefresh}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }
                }}
              >
                🔄 Новый гороскоп
              </button>
              
              <button 
                style={{...styles.button, ...styles.favoriteButton}}
                onClick={handleAddToFavorites}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(255, 193, 7, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
              >
                ⭐ В избранное
              </button>
            </div>
          </div>
        )}

        {!horoscopeData && !loading && !error && (
          <div style={styles.placeholderContainer}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
            <h4>Выберите знак зодиака</h4>
            <p>Чтобы увидеть персональный гороскоп, выберите ваш знак зодиака в карусели выше.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HoroscopeView;
