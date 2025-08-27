import React, { useState, useEffect } from 'react';
import useAPI from '../hooks/useAPI';
import './MoonView.css';

const MoonView = () => {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getMoonData } = useAPI();

  useEffect(() => {
    const fetchMoonData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMoonData();
        setMoonData(data);
      } catch (err) {
        console.error('Ошибка загрузки лунных данных:', err);
        setError('Не удалось загрузить лунный календарь');
      } finally {
        setLoading(false);
      }
    };

    fetchMoonData();
  }, [getMoonData]);

  if (loading) {
    return (
      <div className="moon-view">
        <div className="loading-moon">
          <div className="moon-spinner">🌙</div>
          <p>Гномы изучают лунные фазы...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="moon-view">
        <div className="error-moon">
          <h3>🔮 Лунная магия недоступна</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            🔄 Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!moonData || !moonData.current) {
    return (
      <div className="moon-view">
        <div className="no-data">
          <p>📅 Лунные данные временно недоступны</p>
        </div>
      </div>
    );
  }

  const { current, calendar } = moonData;

  return (
    <div className="moon-view">
      {/* Заголовок */}
      <div className="moon-header">
        <h2>🌙 Лунный календарь</h2>
        <p className="moon-subtitle">Мудрость древних гномов о силе Луны</p>
      </div>

      {/* Текущая фаза Луны */}
      <div className="current-moon">
        <div className="moon-phase-display">
          <div className="moon-icon" style={{ fontSize: '64px' }}>
            {current.emoji || '🌙'}
          </div>
          <div className="moon-info">
            <h3>{current.phase || 'Неизвестная фаза'}</h3>
            <div className="moon-details">
              <div className="moon-stat">
                <span className="label">Освещенность:</span>
                <span className="value">{current.illumination || 0}%</span>
              </div>
              <div className="moon-stat">
                <span className="label">Возраст:</span>
                <span className="value">{current.age || 1} дней</span>
              </div>
              {current.zodiacSign && (
                <div className="moon-stat">
                  <span className="label">В знаке:</span>
                  <span className="value">{current.zodiacSign}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Времена восхода и захода */}
        {(current.moonrise || current.moonset) && (
          <div className="moon-times">
            {current.moonrise && (
              <div className="moon-time">
                <span className="time-icon">🌅</span>
                <span>Восход: {current.moonrise}</span>
              </div>
            )}
            {current.moonset && (
              <div className="moon-time">
                <span className="time-icon">🌇</span>
                <span>Заход: {current.moonset}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Советы по лунной фазе */}
      {current.advice && (
        <div className="moon-advice">
          <h4>{current.advice.title}</h4>
          <p>{current.advice.text}</p>
          
          {current.advice.activities && current.advice.activities.length > 0 && (
            <div className="advice-section">
              <strong>✅ Рекомендуется:</strong>
              <ul>
                {current.advice.activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
          )}
          
          {current.advice.avoid && current.advice.avoid.length > 0 && (
            <div className="advice-section">
              <strong>❌ Избегайте:</strong>
              <ul>
                {current.advice.avoid.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Календарь на неделю */}
      {calendar && calendar.length > 0 && (
        <div className="moon-calendar">
          <h4>📅 Лунный календарь на неделю</h4>
          <div className="calendar-grid">
            {calendar.map((day, index) => (
              <div 
                key={index} 
                className={`calendar-day ${index === 0 ? 'today' : ''}`}
              >
                <div className="day-date">{day.displayDate}</div>
                <div className="day-phase">
                  <span className="phase-emoji">{day.emoji || '🌙'}</span>
                  <span className="phase-name">{day.phase}</span>
                </div>
                <div className="day-illumination">{day.illumination || 0}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Информация об источнике */}
      <div className="moon-footer">
        <p>🧙‍♂️ Данные предоставлены Гномьей Обсерваторией</p>
        {moonData.lastUpdated && (
          <small>Обновлено: {new Date(moonData.lastUpdated).toLocaleString('ru-RU')}</small>
        )}
      </div>
    </div>
  );
};

export default MoonView;
