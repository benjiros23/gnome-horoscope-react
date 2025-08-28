import React, { useState, useEffect } from 'react';
import useAPI from '../hooks/useAPI';
import GlassCard from './GlassCard';
import WoodenCard from './WoodenCard';

const HoroscopeView = ({ selectedSign, onSignSelect, onAddToFavorites, telegramApp }) => {
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [designTheme] = useState('glass'); // Можно получать из пропсов или контекста

  // ИСПРАВЛЕННОЕ использование useAPI
  const api = useAPI();

  const loadHoroscope = async (sign) => {
    if (!sign) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔮 Загружаем гороскоп для знака:', sign);
      
      // Используем правильный метод из хука
      const data = await api.getHoroscope(sign);
      
      console.log('✅ Гороскоп получен:', data);
      setHoroscopeData(data);
      
      // Сохраняем в кеш
      try {
        localStorage.setItem(`horoscope_${sign}`, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
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

  // Загрузка при монтировании компонента
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
      
      // Загружаем с сервера, если нет в кеше или устарел
      setTimeout(() => {
        console.log('🔮 Загружаем новый гороскоп для', selectedSign);
        loadHoroscope(selectedSign);
      }, 300);
    }
  }, [selectedSign]);

  // Принудительная загрузка нового гороскопа
  const handleRefresh = () => {
    if (selectedSign) {
      // Очищаем кеш
      try {
        localStorage.removeItem(`horoscope_${selectedSign}`);
      } catch (e) {}
      
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
      } catch (e) {}
    }
  };

  // Выбор компонента карточки
  const Card = designTheme === 'wooden' ? WoodenCard : GlassCard;

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    loadingSpinner: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '24px'
    },
    errorMessage: {
      color: '#dc3545',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      borderRadius: '8px',
      margin: '20px 0'
    },
    refreshButton: {
      background: 'linear-gradient(135deg, #28a745, #20c997)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      margin: '10px 5px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
    },
    favoriteButton: {
      background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      margin: '10px 5px',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
    },
    horoscopeSection: {
      marginBottom: '20px',
      padding: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(8px)'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#2d3748'
    },
    sectionText: {
      fontSize: '16px',
      lineHeight: '1.5',
      color: '#4a5568'
    },
    metaInfo: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '10px',
      marginTop: '20px'
    },
    metaItem: {
      backgroundColor: 'rgba(139, 195, 74, 0.2)',
      color: '#2e7d0f',
      padding: '6px 12px',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '600',
      border: '1px solid rgba(139, 195, 74, 0.3)'
    }
  };

  console.log('🎨 HoroscopeView: Рендеринг, состояние:', { 
    loading, 
    error: !!error, 
    horoscopeData: !!horoscopeData,
    selectedSign 
  });

  return (
    <div style={styles.container}>
      <Card 
        title={`🔮 Гороскоп для знака ${selectedSign}`}
        subtitle={horoscopeData ? `от ${horoscopeData.gnome}` : 'Загрузка...'}
      >
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
            {/* Общий гороскоп */}
            <div style={styles.horoscopeSection}>
              <div style={styles.sectionTitle}>✨ Общий прогноз</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope.general}
              </div>
            </div>

            {/* Любовь */}
            <div style={styles.horoscopeSection}>
              <div style={styles.sectionTitle}>💝 Любовь и отношения</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope.love}
              </div>
            </div>

            {/* Работа */}
            <div style={styles.horoscopeSection}>
              <div style={styles.sectionTitle}>💼 Карьера и финансы</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope.work}
              </div>
            </div>

            {/* Здоровье */}
            <div style={styles.horoscopeSection}>
              <div style={styles.sectionTitle}>🏃‍♂️ Здоровье</div>
              <div style={styles.sectionText}>
                {horoscopeData.horoscope.health}
              </div>
            </div>

            {/* Мета-информация */}
            <div style={styles.metaInfo}>
              <span style={styles.metaItem}>
                🍀 Счастливое число: {horoscopeData.luckyNumber}
              </span>
              <span style={styles.metaItem}>
                🎨 Цвет: {horoscopeData.luckyColor}
              </span>
              <span style={styles.metaItem}>
                🌟 Элемент: {horoscopeData.element}
              </span>
              <span style={styles.metaItem}>
                💕 Совместимость: {horoscopeData.compatibility}
              </span>
            </div>

            {/* Кнопки действий */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                style={styles.refreshButton}
                onClick={handleRefresh}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
                  }
                }}
              >
                🔄 Получить новый гороскоп
              </button>
              
              <button 
                style={styles.favoriteButton}
                onClick={handleAddToFavorites}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(255, 193, 7, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
                }}
              >
                ⭐ Добавить в избранное
              </button>
            </div>
          </div>
        )}

        {!horoscopeData && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔮</div>
            <h4>Выберите знак зодиака</h4>
            <p>Чтобы увидеть персональный гороскоп, выберите ваш знак зодиака.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default HoroscopeView;
