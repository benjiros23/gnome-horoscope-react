import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import { EnhancedMoonPhase } from '../enhanced_moonPhase';

// ===== КОНСТАНТЫ И КОНФИГУРАЦИЯ =====
const ASTRO_EVENT_TYPES = {
  MERCURY_RETROGRADE: 'mercury_retrograde',
  MOON_PHASE: 'moon_phase',
  SUN_POSITION: 'sun_position',
  PLANETARY_ASPECT: 'planetary_aspect',
  ECLIPSE: 'eclipse',
  PLANETARY_TRANSIT: 'transit'
};

const INFLUENCE_LEVELS = {
  CRITICAL: { level: 'Критическое', color: '#D32F2F', icon: '🔴' },
  HIGH: { level: 'Высокое', color: '#F57C00', icon: '🟠' },
  MEDIUM: { level: 'Среднее', color: '#1976D2', icon: '🔵' },
  LOW: { level: 'Низкое', color: '#388E3C', icon: '🟢' }
};

const STATUS_CONFIG = {
  retrograde: { color: '#FF6B6B', icon: '⏪', label: 'Ретроград' },
  direct: { color: '#4ECDC4', icon: '▶️', label: 'Прямое движение' },
  stationary: { color: '#FFA726', icon: '⏸️', label: 'Стационарность' },
  active: { color: '#66BB6A', icon: '✨', label: 'Активное' },
  waning: { color: '#FFB74D', icon: '🌘', label: 'Убывающее' },
  waxing: { color: '#81C784', icon: '🌒', label: 'Растущее' }
};

// ===== КЛАСС ДЛЯ РАСЧЕТА АСТРОЛОГИЧЕСКИХ СОБЫТИЙ =====
class AstroEventsCalculator {
  static getZodiacDates() {
    return {
      'Козерог': { start: [12, 22], end: [1, 19] },
      'Водолей': { start: [1, 20], end: [2, 18] },
      'Рыбы': { start: [2, 19], end: [3, 20] },
      'Овен': { start: [3, 21], end: [4, 19] },
      'Телец': { start: [4, 20], end: [5, 20] },
      'Близнецы': { start: [5, 21], end: [6, 20] },
      'Рак': { start: [6, 21], end: [7, 22] },
      'Лев': { start: [7, 23], end: [8, 22] },
      'Дева': { start: [8, 23], end: [9, 22] },
      'Весы': { start: [9, 23], end: [10, 22] },
      'Скорпион': { start: [10, 23], end: [11, 21] },
      'Стрелец': { start: [11, 22], end: [12, 21] }
    };
  }

  static getCurrentSunSign(date = new Date()) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const zodiacDates = this.getZodiacDates();
    
    for (const [sign, dates] of Object.entries(zodiacDates)) {
      const [startMonth, startDay] = dates.start;
      const [endMonth, endDay] = dates.end;
      
      if (startMonth === endMonth) {
        if (month === startMonth && day >= startDay && day <= endDay) {
          return sign;
        }
      } else {
        if ((month === startMonth && day >= startDay) || 
            (month === endMonth && day <= endDay)) {
          return sign;
        }
      }
    }
    
    return 'Водолей';
  }

  static getMercuryRetrogradePeriods(year) {
    // Примерные периоды ретроградного Меркурия на 2025 год
    const periods = [
      { start: new Date(year, 0, 1), end: new Date(year, 0, 25) },   // Январь
      { start: new Date(year, 4, 8), end: new Date(year, 4, 30) },   // Май
      { start: new Date(year, 8, 3), end: new Date(year, 8, 26) },   // Сентябрь
      { start: new Date(year, 11, 15), end: new Date(year, 11, 31) }  // Декабрь
    ];
    
    return periods;
  }

  static isMercuryRetrograde(date = new Date()) {
    const year = date.getFullYear();
    const periods = this.getMercuryRetrogradePeriods(year);
    
    return periods.some(period => date >= period.start && date <= period.end);
  }

  static getNextMercuryRetrograde(date = new Date()) {
    const year = date.getFullYear();
    const periods = this.getMercuryRetrogradePeriods(year);
    
    for (const period of periods) {
      if (date < period.start) {
        return period;
      }
    }
    
    // Если все периоды в этом году прошли, возвращаем первый период следующего года
    const nextYearPeriods = this.getMercuryRetrogradePeriods(year + 1);
    return nextYearPeriods[0];
  }

  static getCurrentEvents(date = new Date()) {
    const events = [];
    
    // Меркурий
    const mercuryEvent = this.getMercuryEvent(date);
    if (mercuryEvent) events.push(mercuryEvent);
    
    // Лунная фаза
    const moonEvent = this.getMoonEvent(date);
    if (moonEvent) events.push(moonEvent);
    
    // Солнце
    const sunEvent = this.getSunEvent(date);
    if (sunEvent) events.push(sunEvent);
    
    // Дополнительные события
    const additionalEvents = this.getAdditionalEvents(date);
    events.push(...additionalEvents);
    
    return events.sort((a, b) => b.priority - a.priority);
  }

  static getMercuryEvent(date) {
    const isRetrograde = this.isMercuryRetrograde(date);
    const nextRetrograde = this.getNextMercuryRetrograde(date);
    
    const baseEvent = {
      id: 'mercury_current',
      type: ASTRO_EVENT_TYPES.MERCURY_RETROGRADE,
      planet: 'Меркурий',
      planetIcon: '☿',
      priority: isRetrograde ? 10 : 7,
      realTime: true,
      affectedSigns: ['Близнецы', 'Дева']
    };

    if (isRetrograde) {
      return {
        ...baseEvent,
        status: 'retrograde',
        title: 'Ретроградный Меркурий активен',
        period: 'Сейчас до 25 января 2025',
        influence: INFLUENCE_LEVELS.HIGH,
        description: this.getMercuryRetrogradeDescription(),
        advice: [
          'Проверяйте важные документы дважды',
          'Делайте резервные копии данных',
          'Избегайте крупных покупок техники',
          'Время для пересмотра планов и завершения старых дел'
        ],
        warnings: [
          'Задержки в транспорте и связи',
          'Возможны технические сбои',
          'Недопонимания в общении'
        ]
      };
    } else {
      return {
        ...baseEvent,
        status: 'direct',
        title: 'Меркурий движется прямо',
        period: `Следующий ретроград: ${nextRetrograde.start.toLocaleDateString('ru-RU')}`,
        influence: INFLUENCE_LEVELS.MEDIUM,
        description: this.getMercuryDirectDescription(),
        advice: [
          'Отличное время для подписания контрактов',
          'Активизируйте коммуникации',
          'Запускайте новые проекты',
          'Учитесь и развивайтесь'
        ],
        benefits: [
          'Четкая коммуникация',
          'Стабильная работа техники',
          'Успешные переговоры'
        ]
      };
    }
  }

  static getMoonEvent(date) {
    try {
      const moonData = EnhancedMoonPhase.calculatePhase(date);
      
      return {
        id: 'moon_current',
        type: ASTRO_EVENT_TYPES.MOON_PHASE,
        planet: 'Луна',
        planetIcon: moonData.emoji,
        status: moonData.isWaxing ? 'waxing' : 'waning',
        title: `${moonData.phase} влияет на эмоции`,
        period: `${date.toLocaleDateString('ru-RU')} - ${moonData.lunarDay} лунный день`,
        influence: this.getMoonInfluenceLevel(moonData.illumination),
        description: this.getMoonDescription(moonData),
        affectedSigns: ['Рак', 'Скорпион', 'Рыбы'],
        priority: 8,
        realTime: true,
        moonData: moonData
      };
    } catch (error) {
      console.error('Ошибка получения лунных данных:', error);
      return null;
    }
  }

  static getSunEvent(date) {
    const sunSign = this.getCurrentSunSign(date);
    
    return {
      id: 'sun_current',
      type: ASTRO_EVENT_TYPES.SUN_POSITION,
      planet: 'Солнце',
      planetIcon: '☀️',
      status: 'active',
      title: `Солнце в знаке ${sunSign}`,
      period: this.getSunPeriod(sunSign),
      influence: INFLUENCE_LEVELS.MEDIUM,
      description: this.getSunDescription(sunSign),
      affectedSigns: [sunSign, 'Лев'],
      priority: 6,
      realTime: true,
      sunSign: sunSign
    };
  }

  static getAdditionalEvents(date) {
    // Дополнительные астрологические события
    const events = [];
    
    // Пример: особые дни
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
    
    if (dayOfYear % 7 === 0) {
      events.push({
        id: 'weekly_energy',
        type: 'energy_peak',
        planet: 'Космическая энергия',
        planetIcon: '⚡',
        status: 'active',
        title: 'Пик недельной энергии',
        period: 'Сегодня',
        influence: INFLUENCE_LEVELS.MEDIUM,
        description: 'Сегодня особенно благоприятный день для важных решений и новых начинаний.',
        priority: 5,
        realTime: true
      });
    }
    
    return events;
  }

  // Вспомогательные методы для описаний
  static getMercuryRetrogradeDescription() {
    return `
      <div class="event-description">
        <p><strong>🌟 Текущее влияние:</strong> Меркурий находится в ретроградной фазе, что создает особую энергетику для пересмотра и коррекции жизненных планов.</p>
        
        <div class="warning-box">
          <h4>⚠️ Основные влияния:</h4>
          <ul>
            <li>Задержки в коммуникациях и документообороте</li>
            <li>Технические сбои и неполадки в электронике</li>
            <li>Возврат к старым проектам и отношениям</li>
            <li>Необходимость перепроверки информации</li>
          </ul>
        </div>
        
        <div class="advice-box">
          <h4>💡 Как использовать энергию:</h4>
          <p>Это время для завершения начатых дел, пересмотра планов и восстановления старых связей. Избегайте подписания важных документов без тщательной проверки.</p>
        </div>
      </div>
    `;
  }

  static getMercuryDirectDescription() {
    return `
      <div class="event-description">
        <p><strong>✨ Текущее влияние:</strong> Меркурий движется прямо, обеспечивая ясность мышления и стабильность в коммуникациях.</p>
        
        <div class="benefits-box">
          <h4>🌟 Преимущества периода:</h4>
          <ul>
            <li>Четкая и эффективная коммуникация</li>
            <li>Стабильная работа техники и транспорта</li>
            <li>Успешные переговоры и сделки</li>
            <li>Благоприятное время для обучения</li>
          </ul>
        </div>
      </div>
    `;
  }

  static getMoonDescription(moonData) {
    const phaseDescriptions = {
      'Новолуние': 'Время новых начинаний и постановки целей',
      'Молодая луна': 'Энергия роста и развития проектов',
      'Первая четверть': 'Преодоление препятствий и принятие решений',
      'Растущая луна': 'Накопление сил и активная деятельность',
      'Полнолуние': 'Пик энергии, завершение циклов',
      'Убывающая луна': 'Освобождение от лишнего, очищение',
      'Последняя четверть': 'Переосмысление и подготовка к новому',
      'Старая луна': 'Завершение старых дел, отдых'
    };

    const description = phaseDescriptions[moonData.phase] || 'Особая лунная энергия';

    return `
      <div class="event-description">
        <p><strong>🌙 Лунная энергия:</strong> ${description}</p>
        
        <div class="moon-info">
          <p><strong>Освещенность:</strong> ${moonData.illumination}%</p>
          <p><strong>Лунный день:</strong> ${moonData.lunarDay}</p>
          <p><strong>Направление:</strong> ${moonData.isWaxing ? 'Растущая 🌒' : 'Убывающая 🌘'}</p>
        </div>
        
        <div class="recommendation">
          <h4>💫 Рекомендации:</h4>
          <p>${moonData.isWaxing ? 
            'Используйте растущую энергию для новых проектов и начинаний' : 
            'Время для завершения дел и освобождения от ненужного'}</p>
        </div>
      </div>
    `;
  }

  static getSunDescription(sunSign) {
    const descriptions = {
      'Козерог': 'Время дисциплины, амбиций и структурированности',
      'Водолей': 'Период инноваций, независимости и гуманитарных идей',
      'Рыбы': 'Время интуиции, творчества и духовного развития',
      'Овен': 'Энергия новых начинаний, лидерства и активности',
      'Телец': 'Период стабильности, практичности и наслаждения',
      'Близнецы': 'Время коммуникаций, обучения и разнообразия',
      'Рак': 'Период заботы, эмоциональности и семейных дел',
      'Лев': 'Время творчества, щедрости и самовыражения',
      'Дева': 'Период анализа, совершенствования и практичности',
      'Весы': 'Время гармонии, партнерства и справедливости',
      'Скорпион': 'Период трансформаций, глубины и интенсивности',
      'Стрелец': 'Время философии, путешествий и расширения горизонтов'
    };

    return `
      <div class="event-description">
        <p><strong>☀️ Солнечная энергия:</strong> ${descriptions[sunSign] || 'Особая солнечная энергетика'}</p>
        
        <div class="sun-influence">
          <h4>🌟 Влияние на день:</h4>
          <p>Солнце в ${sunSign} усиливает соответствующие качества во всех сферах жизни. Это время для проявления энергий данного знака.</p>
        </div>
      </div>
    `;
  }

  static getMoonInfluenceLevel(illumination) {
    if (illumination > 90) return INFLUENCE_LEVELS.HIGH;
    if (illumination > 50) return INFLUENCE_LEVELS.MEDIUM;
    if (illumination < 10) return INFLUENCE_LEVELS.HIGH; // Новолуние тоже сильное
    return INFLUENCE_LEVELS.MEDIUM;
  }

  static getSunPeriod(sunSign) {
    const periods = {
      'Козерог': '22 декабря - 19 января',
      'Водолей': '20 января - 18 февраля',
      'Рыбы': '19 февраля - 20 марта',
      'Овен': '21 марта - 19 апреля',
      'Телец': '20 апреля - 20 мая',
      'Близнецы': '21 мая - 20 июня',
      'Рак': '21 июня - 22 июля',
      'Лев': '23 июля - 22 августа',
      'Дева': '23 августа - 22 сентября',
      'Весы': '23 сентября - 22 октября',
      'Скорпион': '23 октября - 21 ноября',
      'Стрелец': '22 ноября - 21 декабря'
    };
    
    return periods[sunSign] || 'Период уточняется';
  }
}

// ===== КОМПОНЕНТ СОБЫТИЯ =====
const AstroEvent = React.memo(({ 
  event, 
  onAddToFavorites, 
  expanded, 
  onToggleExpand 
}) => {
  const { theme } = useTheme();
  
  const statusConfig = STATUS_CONFIG[event.status] || STATUS_CONFIG.active;
  const influenceConfig = event.influence || INFLUENCE_LEVELS.MEDIUM;
  
  const styles = useMemo(() => ({
    eventCard: {
      background: `linear-gradient(135deg, ${statusConfig.color}10, transparent)`,
      border: `1px solid ${statusConfig.color}30`,
      borderLeft: `4px solid ${statusConfig.color}`,
      marginBottom: '16px',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    
    header: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
      cursor: 'pointer'
    },
    
    planetIcon: {
      fontSize: '32px',
      marginRight: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: `${statusConfig.color}20`
    },
    
    eventInfo: {
      flex: 1
    },
    
    title: {
      fontSize: '18px',
      fontWeight: '700',
      margin: '0 0 8px 0',
      color: theme.colors.text
    },
    
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: `${statusConfig.color}20`,
      color: statusConfig.color,
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    
    period: {
      fontSize: '14px',
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
      marginBottom: '12px'
    },
    
    influenceBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: `${influenceConfig.color}20`,
      color: influenceConfig.color,
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '700',
      border: `2px solid ${influenceConfig.color}40`,
      margin: '0 8px 0 0'
    },
    
    description: {
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '16px',
      color: theme.colors.textSecondary
    },
    
    expandButton: {
      background: 'transparent',
      border: 'none',
      color: theme.colors.primary,
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      padding: '8px',
      borderRadius: '8px',
      transition: 'background 0.2s ease'
    },
    
    actionsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      alignItems: 'center',
      marginTop: '16px'
    }
  }), [theme, statusConfig, influenceConfig]);

  const handleAddToFavorites = useCallback(() => {
    onAddToFavorites?.({
      type: 'astro-event',
      title: event.title,
      content: `${event.title} - ${event.period}`,
      date: new Date().toLocaleDateString('ru-RU'),
      eventData: event
    });
  }, [event, onAddToFavorites]);

  return (
    <Card style={styles.eventCard}>
      <div style={styles.header} onClick={onToggleExpand}>
        <div style={styles.planetIcon}>
          {event.planetIcon}
        </div>
        <div style={styles.eventInfo}>
          <h3 style={styles.title}>{event.title}</h3>
          <div style={styles.statusBadge}>
            {statusConfig.icon} {statusConfig.label}
            {event.realTime && ' • LIVE'}
          </div>
        </div>
        <button style={styles.expandButton}>
          {expanded ? '▼' : '▶'}
        </button>
      </div>
      
      <div style={styles.period}>
        📅 {event.period}
      </div>
      
      {expanded && (
        <>
          <div 
            style={styles.description}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
          
          {event.advice && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: theme.colors.success, fontSize: '14px', marginBottom: '8px' }}>
                💡 Советы:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                {event.advice.map((tip, index) => (
                  <li key={index} style={{ marginBottom: '4px', color: theme.colors.textSecondary }}>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {event.warnings && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ color: theme.colors.error, fontSize: '14px', marginBottom: '8px' }}>
                ⚠️ Предупреждения:
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                {event.warnings.map((warning, index) => (
                  <li key={index} style={{ marginBottom: '4px', color: theme.colors.textSecondary }}>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {event.affectedSigns && (
            <div style={{ 
              background: `${theme.colors.info}20`,
              border: `1px solid ${theme.colors.info}30`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <strong style={{ color: theme.colors.info, fontSize: '14px' }}>
                🎯 Наиболее затронутые знаки: {Array.isArray(event.affectedSigns) ? event.affectedSigns.join(', ') : event.affectedSigns}
              </strong>
            </div>
          )}
        </>
      )}
      
      <div style={styles.actionsContainer}>
        <div style={styles.influenceBadge}>
          {influenceConfig.icon} Влияние: {influenceConfig.level}
        </div>
        
        <Button variant="secondary" onClick={handleAddToFavorites}>
          ⭐ В избранное
        </Button>
      </div>
    </Card>
  );
});

AstroEvent.displayName = 'AstroEvent';

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const AstroEventsView = React.memo(({ 
  onAddToFavorites, 
  telegramApp,
  autoRefresh = true,
  refreshInterval = 60000 // 1 минута
}) => {
  const { theme } = useTheme();
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set([1])); // Первое событие развернуто
  const [lastUpdate, setLastUpdate] = useState(null);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '24px',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '16px',
      padding: '24px'
    },
    
    headerDecoration: {
      position: 'absolute',
      top: '-50px',
      right: '-50px',
      fontSize: '150px',
      opacity: 0.1
    },
    
    headerTitle: {
      margin: '0 0 8px 0',
      fontSize: '28px',
      fontWeight: '700'
    },
    
    headerDate: {
      margin: '0 0 16px 0',
      opacity: 0.9,
      fontSize: '16px'
    },
    
    updateBadge: {
      marginTop: '12px',
      padding: '8px 16px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '20px',
      display: 'inline-block',
      fontSize: '14px',
      fontWeight: '600'
    },
    
    loadingContainer: {
      textAlign: 'center',
      padding: '60px 20px'
    },
    
    loadingIcon: {
      fontSize: '48px',
      marginBottom: '16px',
      animation: 'pulse 2s infinite'
    },
    
    errorContainer: {
      textAlign: 'center',
      padding: '40px 20px'
    },
    
    refreshButton: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      border: 'none',
      color: '#ffffff',
      cursor: 'pointer',
      fontSize: '20px',
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)',
      zIndex: 100,
      transition: 'all 0.3s ease'
    }
  }), [theme]);

  // Загрузка событий
  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Имитация загрузки для UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const astroEvents = AstroEventsCalculator.getCurrentEvents();
      setEvents(astroEvents);
      setLastUpdate(new Date());
      
      console.log('✅ Астрологические события обновлены:', astroEvents.length);
      
    } catch (err) {
      console.error('❌ Ошибка загрузки астрологических событий:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Эффект для первоначальной загрузки
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Эффект для автообновления
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Автообновление астрологических событий');
      loadEvents();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadEvents]);

  // Обработчики событий
  const handleToggleExpand = useCallback((eventId) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
    
    // Haptic feedback
    try {
      telegramApp?.HapticFeedback?.selectionChanged();
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
  }, [telegramApp]);

  const handleRefresh = useCallback(() => {
    loadEvents();
    
    try {
      telegramApp?.HapticFeedback?.impactOccurred('light');
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
  }, [loadEvents, telegramApp]);

  // Рендер состояний
  if (loading && events.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingIcon}>🌌</div>
          <h3>Подключаемся к космосу...</h3>
          <p style={{ color: theme.colors.textSecondary }}>
            Загружаем актуальные астрологические данные
          </p>
        </div>
        
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.6; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h3 style={{ color: theme.colors.error }}>⚠️ Ошибка загрузки</h3>
          <p style={{ color: theme.colors.textSecondary, marginBottom: '20px' }}>
            {error}
          </p>
          <Button onClick={handleRefresh}>
            🔄 Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* CSS для анимаций */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>

      {/* Заголовок */}
      <div style={styles.header}>
        <div style={styles.headerDecoration}>🌌</div>
        
        <h1 style={styles.headerTitle}>
          Астрологические События
        </h1>
        
        <p style={styles.headerDate}>
          📅 {new Date().toLocaleDateString('ru-RU', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
        
        <div style={styles.updateBadge}>
          🔄 Обновлено: {lastUpdate ? lastUpdate.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
          }) : 'сейчас'}
        </div>
      </div>

      {/* Список событий */}
      {events.map(event => (
        <AstroEvent
          key={event.id}
          event={event}
          onAddToFavorites={onAddToFavorites}
          expanded={expandedEvents.has(event.id)}
          onToggleExpand={() => handleToggleExpand(event.id)}
        />
      ))}

      {/* Кнопка обновления */}
      <button
        style={styles.refreshButton}
        onClick={handleRefresh}
        disabled={loading}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        }}
      >
        {loading ? '⏳' : '🔄'}
      </button>
    </div>
  );
});

AstroEventsView.displayName = 'AstroEventsView';

export default AstroEventsView;
