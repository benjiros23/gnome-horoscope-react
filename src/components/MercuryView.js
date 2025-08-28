import React, { useState, useEffect } from 'react';
import useAPI from '../hooks/useAPI';

const MercuryView = ({ onAddToFavorites, telegramApp, designTheme = 'glass' }) => {
  const [mercuryData, setMercuryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { getMercuryStatus } = useAPI();

  // Загрузка данных о Меркурии
  const loadMercuryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🪐 Загружаем данные о Меркурии...');
      const data = await getMercuryStatus();
      console.log('✅ Данные о Меркурии получены:', data);
      
      setMercuryData(data);
      setLastUpdated(new Date());
      
      // Сохраняем в кеш
      try {
        localStorage.setItem('mercury_data', JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.warn('Ошибка сохранения в кеш:', e);
      }
      
    } catch (fetchError) {
      console.error('❌ Ошибка загрузки данных Меркурия:', fetchError);
      setError(fetchError.message);
      
      // Пытаемся загрузить из кеша
      try {
        const cached = localStorage.getItem('mercury_data');
        if (cached) {
          const { data } = JSON.parse(cached);
          setMercuryData(data);
          setError('Показаны кешированные данные');
        }
      } catch (e) {
        console.error('Ошибка загрузки из кеша:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  // Автообновление каждые 6 часов
  useEffect(() => {
    loadMercuryData();
    
    const interval = setInterval(() => {
      console.log('🔄 Автообновление данных Меркурия');
      loadMercuryData();
    }, 6 * 60 * 60 * 1000); // 6 часов
    
    return () => clearInterval(interval);
  }, []);

  const handleAddToFavorites = () => {
    if (mercuryData && onAddToFavorites) {
      const favoriteItem = {
        type: 'mercury',
        title: `Меркурий ${mercuryData.status}`,
        content: mercuryData.influence,
        date: new Date().toLocaleDateString('ru-RU'),
        advice: mercuryData.advice
      };
      
      onAddToFavorites(favoriteItem);
      
      // Haptic feedback
      try {
        if (telegramApp && parseFloat(telegramApp.version) >= 6.1 && telegramApp.HapticFeedback) {
          telegramApp.HapticFeedback.notificationOccurred('success');
        }
      } catch (e) {}
    }
  };

  // Стили в зависимости от темы
  const getStyles = () => {
    const baseStyles = {
      container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }
    };

    if (designTheme === 'wooden') {
      return {
        ...baseStyles,
        card: {
          background: 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
          borderRadius: '20px',
          border: '3px solid #8b4513',
          boxShadow: `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
            0 8px 24px 0 rgba(0, 0, 0, 0.25)
          `,
          padding: '24px',
          margin: '16px',
          color: '#3e2723',
          fontFamily: '"Times New Roman", Georgia, serif',
          position: 'relative',
          overflow: 'hidden'
        }
      };
    } else {
      return {
        ...baseStyles,
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
        }
      };
    }
  };

  const styles = getStyles();

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 2s linear infinite' }}>🪐</div>
            <h3>Анализируем положение Меркурия...</h3>
            <p>Изучаем влияние планеты на коммуникации</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && !mercuryData) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h3 style={{ color: '#dc3545' }}>Ошибка загрузки</h3>
            <p>{error}</p>
            <button 
              onClick={loadMercuryData}
              style={{
                background: 'linear-gradient(135deg, #28a745, #20c997)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '16px'
              }}
            >
              🔄 Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {designTheme === 'wooden' && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            repeating-linear-gradient(90deg, rgba(0,0,0,0.1) 0px, transparent 1px, transparent 3px, rgba(0,0,0,0.05) 4px)
          `,
          opacity: 0.6,
          pointerEvents: 'none'
        }}></div>
      )}

      <div style={styles.card}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '12px',
            filter: mercuryData?.isRetrograde 
              ? 'drop-shadow(0 0 20px #ff6b6b80) hue-rotate(180deg)' 
              : 'drop-shadow(0 0 20px #4ecdc480)',
            animation: mercuryData?.isRetrograde ? 'wobble 3s ease-in-out infinite' : 'orbit 8s linear infinite'
          }}>
            🪐
          </div>
          
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            marginBottom: '8px',
            color: designTheme === 'wooden' ? '#3e2723' : (mercuryData?.isRetrograde ? '#ff6b6b' : '#4ecdc4')
          }}>
            Меркурий {mercuryData?.status || 'Неизвестно'}
          </h2>
          
          {mercuryData?.period && (
            <p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '16px' }}>
              📅 {mercuryData.period.start} - {mercuryData.period.end}
            </p>
          )}
          
          <div style={{
            background: mercuryData?.isRetrograde 
              ? (designTheme === 'wooden' ? 'rgba(139, 69, 19, 0.2)' : 'rgba(255, 107, 107, 0.2)')
              : (designTheme === 'wooden' ? 'rgba(139, 195, 74, 0.2)' : 'rgba(78, 205, 196, 0.2)'),
            color: mercuryData?.isRetrograde 
              ? (designTheme === 'wooden' ? '#8b4513' : '#ff6b6b')
              : (designTheme === 'wooden' ? '#2e7d0f' : '#4ecdc4'),
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-block',
            border: mercuryData?.isRetrograde 
              ? (designTheme === 'wooden' ? '1px solid rgba(139, 69, 19, 0.3)' : '1px solid rgba(255, 107, 107, 0.3)')
              : (designTheme === 'wooden' ? '1px solid rgba(139, 195, 74, 0.3)' : '1px solid rgba(78, 205, 196, 0.3)')
          }}>
            {mercuryData?.isRetrograde ? '⚠️ Ретроградная фаза' : '✅ Прямое движение'}
          </div>
        </div>

        {/* Влияние */}
        <div style={{
          background: designTheme === 'wooden' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          backdropFilter: 'blur(8px)',
          border: designTheme === 'wooden' 
            ? '1px solid rgba(139, 69, 19, 0.2)' 
            : '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
            🌟 Текущее влияние
          </h3>
          <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '16px' }}>
            {mercuryData?.influence || 'Влияние определяется...'}
          </p>
          
          <div style={{ 
            background: mercuryData?.isRetrograde ? '#ffe6e6' : '#e6fff2',
            padding: '12px 16px',
            borderRadius: '12px',
            border: mercuryData?.isRetrograde ? '1px solid #ffcccc' : '1px solid #ccffdd'
          }}>
            <strong style={{ color: mercuryData?.isRetrograde ? '#cc0000' : '#006600' }}>
              💡 Совет:
            </strong>
            <span style={{ color: mercuryData?.isRetrograde ? '#990000' : '#004400', marginLeft: '8px' }}>
              {mercuryData?.advice || 'Следите за астрологическими новостями'}
            </span>
          </div>
        </div>

        {/* Рекомендации */}
        {mercuryData?.recommendations && (
          <div style={{
            background: designTheme === 'wooden' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(8px)',
            border: designTheme === 'wooden' 
              ? '1px solid rgba(139, 69, 19, 0.2)' 
              : '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
              📋 Рекомендации
            </h3>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              {mercuryData.recommendations.map((rec, index) => (
                <li key={index} style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.5', 
                  marginBottom: '8px',
                  listStyle: 'none',
                  position: 'relative'
                }}>
                  <span style={{ marginRight: '8px' }}>
                    {mercuryData.isRetrograde ? '⚠️' : '✅'}
                  </span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Затронутые знаки */}
        {mercuryData?.affectedSigns && (
          <div style={{
            background: designTheme === 'wooden' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            backdropFilter: 'blur(8px)',
            border: designTheme === 'wooden' 
              ? '1px solid rgba(139, 69, 19, 0.2)' 
              : '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>
              🎯 Особенно затронутые знаки
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {mercuryData.affectedSigns.map((sign, index) => (
                <span 
                  key={index}
                  style={{
                    background: designTheme === 'wooden' 
                      ? 'rgba(139, 69, 19, 0.2)' 
                      : 'rgba(78, 205, 196, 0.2)',
                    color: designTheme === 'wooden' ? '#8b4513' : '#4ecdc4',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: designTheme === 'wooden' 
                      ? '1px solid rgba(139, 69, 19, 0.3)' 
                      : '1px solid rgba(78, 205, 196, 0.3)'
                  }}
                >
                  {sign}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Кнопки действий */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button 
            onClick={loadMercuryData}
            style={{
              background: 'linear-gradient(135deg, #28a745, #20c997)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              margin: '0 8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(40, 167, 69, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
            }}
          >
            🔄 Обновить данные
          </button>
          
          <button 
            onClick={handleAddToFavorites}
            style={{
              background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              margin: '0 8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(255, 193, 7, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(255, 193, 7, 0.3)';
            }}
          >
            ⭐ В избранное
          </button>
        </div>

        {/* Время последнего обновления */}
        {lastUpdated && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '20px', 
            fontSize: '12px', 
            opacity: 0.6 
          }}>
            Обновлено: {lastUpdated.toLocaleString('ru-RU')}
          </div>
        )}
      </div>

      {/* CSS анимации */}
      <style>{`
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(2px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(2px) rotate(-360deg); }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default MercuryView;
