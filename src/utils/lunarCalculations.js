// src/utils/lunarCalculations.js - Утилиты для расчета лунных фаз
export class LunarCalculator {
  // Расчет текущей фазы луны
  static getCurrentMoonPhase() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    
    // Используем алгоритм для расчета лунного возраста
    const lunarAge = this.calculateLunarAge(year, month, day);
    
    return {
      phase: this.getPhaseFromAge(lunarAge),
      age: lunarAge,
      illumination: this.getIllumination(lunarAge),
      phaseName: this.getPhaseName(lunarAge),
      emoji: this.getPhaseEmoji(lunarAge),
      description: this.getPhaseDescription(lunarAge)
    };
  }

  // Расчет возраста луны в днях
  static calculateLunarAge(year, month, day) {
    // Константы для расчета
    const LUNAR_CYCLE = 29.53058868; // Средняя длина лунного цикла
    const KNOWN_NEW_MOON = new Date(2000, 0, 6, 18, 14); // Известное новолуние
    
    const currentDate = new Date(year, month - 1, day);
    const timeDiff = currentDate.getTime() - KNOWN_NEW_MOON.getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    const cycles = daysDiff / LUNAR_CYCLE;
    const age = (cycles - Math.floor(cycles)) * LUNAR_CYCLE;
    
    return Math.round(age * 100) / 100;
  }

  // Определение фазы по возрасту
  static getPhaseFromAge(age) {
    if (age < 1.84566) return 'new';
    if (age < 5.53699) return 'waxing-crescent';
    if (age < 9.22831) return 'first-quarter';
    if (age < 12.91963) return 'waxing-gibbous';
    if (age < 16.61096) return 'full';
    if (age < 20.30228) return 'waning-gibbous';
    if (age < 23.99361) return 'last-quarter';
    if (age < 27.68493) return 'waning-crescent';
    return 'new';
  }

  // Расчет освещенности в процентах
  static getIllumination(age) {
    const illumination = 50 * (1 - Math.cos((age / 29.53058868) * 2 * Math.PI));
    return Math.round(illumination);
  }

  // Название фазы на русском
  static getPhaseName(age) {
    const phase = this.getPhaseFromAge(age);
    const names = {
      'new': 'Новолуние',
      'waxing-crescent': 'Растущий серп',
      'first-quarter': 'Первая четверть',
      'waxing-gibbous': 'Растущая луна',
      'full': 'Полнолуние',
      'waning-gibbous': 'Убывающая луна',
      'last-quarter': 'Последняя четверть',
      'waning-crescent': 'Убывающий серп'
    };
    return names[phase] || 'Неизвестная фаза';
  }

  // Эмодзи для фазы
  static getPhaseEmoji(age) {
    const phase = this.getPhaseFromAge(age);
    const emojis = {
      'new': '🌑',
      'waxing-crescent': '🌒',
      'first-quarter': '🌓',
      'waxing-gibbous': '🌔',
      'full': '🌕',
      'waning-gibbous': '🌖',
      'last-quarter': '🌗',
      'waning-crescent': '🌘'
    };
    return emojis[phase] || '🌙';
  }

  // Описание фазы и её влияния
  static getPhaseDescription(age) {
    const phase = this.getPhaseFromAge(age);
    const descriptions = {
      'new': 'Время новых начинаний и планирования. Энергия обновления.',
      'waxing-crescent': 'Период роста и развития. Хорошо для реализации планов.',
      'first-quarter': 'Время принятия решений и преодоления препятствий.',
      'waxing-gibbous': 'Период активности и завершения дел. Высокая энергия.',
      'full': 'Пик лунной энергии. Время эмоций и интуиции.',
      'waning-gibbous': 'Период благодарности и делении. Время отдавать.',
      'last-quarter': 'Время освобождения от лишнего и прощения.',
      'waning-crescent': 'Период отдыха и подготовки к новому циклу.'
    };
    return descriptions[phase] || 'Время следовать своей интуиции.';
  }

  // Получить рекомендации для текущей фазы
  static getMoonRecommendations(age) {
    const phase = this.getPhaseFromAge(age);
    const recommendations = {
      'new': {
        good: ['Планирование', 'Медитация', 'Начало диеты', 'Посадка семян'],
        avoid: ['Важные решения', 'Хирургические операции', 'Стрижка волос'],
        energy: 'Энергия новых начинаний'
      },
      'waxing-crescent': {
        good: ['Обучение', 'Инвестиции', 'Знакомства', 'Начало проектов'],
        avoid: ['Агрессивные действия', 'Конфликты'],
        energy: 'Растущая созидательная энергия'
      },
      'first-quarter': {
        good: ['Решительные действия', 'Спорт', 'Карьерные вопросы'],
        avoid: ['Эмоциональные решения', 'Риски'],
        energy: 'Энергия действий и решений'
      },
      'waxing-gibbous': {
        good: ['Завершение дел', 'Творчество', 'Социальная активность'],
        avoid: ['Начало новых проектов', 'Кардинальные изменения'],
        energy: 'Пиковая активная энергия'
      },
      'full': {
        good: ['Интуитивные практики', 'Романтика', 'Творчество', 'Сбор урожая'],
        avoid: ['Важные переговоры', 'Операции', 'Агрессия'],
        energy: 'Максимальная лунная энергия'
      },
      'waning-gibbous': {
        good: ['Благодарность', 'Помощь другим', 'Анализ результатов'],
        avoid: ['Новые знакомства', 'Инвестиции'],
        energy: 'Энергия благодарности и щедрости'
      },
      'last-quarter': {
        good: ['Очищение', 'Прощение', 'Избавление от лишнего'],
        avoid: ['Новые покупки', 'Важные встречи'],
        energy: 'Энергия освобождения'
      },
      'waning-crescent': {
        good: ['Отдых', 'Рефлексия', 'Подготовка планов'],
        avoid: ['Активная деятельность', 'Важные решения'],
        energy: 'Энергия покоя и восстановления'
      }
    };
    return recommendations[phase] || recommendations['new'];
  }

  // Получить календарь лунных фаз на месяц
  static getMonthlyLunarCalendar(year, month) {
    const calendar = [];
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const lunarAge = this.calculateLunarAge(year, month, day);
      const date = new Date(year, month - 1, day);
      
      calendar.push({
        date: date,
        day: day,
        lunarAge: lunarAge,
        phase: this.getPhaseFromAge(lunarAge),
        phaseName: this.getPhaseName(lunarAge),
        emoji: this.getPhaseEmoji(lunarAge),
        illumination: this.getIllumination(lunarAge),
        recommendations: this.getMoonRecommendations(lunarAge),
        isToday: this.isToday(date)
      });
    }
    
    return calendar;
  }

  // Проверка, является ли дата сегодняшней
  static isToday(date) {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  // Получить ближайшие важные лунные события
  static getUpcomingLunarEvents(daysAhead = 30) {
    const events = [];
    const today = new Date();
    
    for (let i = 0; i <= daysAhead; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      
      const lunarAge = this.calculateLunarAge(year, month, day);
      const phase = this.getPhaseFromAge(lunarAge);
      
      // Проверяем на точные фазы (с погрешностью)
      if (Math.abs(lunarAge - 0) < 0.5 || Math.abs(lunarAge - 29.53) < 0.5) {
        events.push({
          date: date,
          type: 'new-moon',
          name: 'Новолуние',
          emoji: '🌑',
          description: 'Новый лунный цикл начинается'
        });
      } else if (Math.abs(lunarAge - 7.38) < 0.5) {
        events.push({
          date: date,
          type: 'first-quarter',
          name: 'Первая четверть',
          emoji: '🌓',
          description: 'Луна в первой четверти'
        });
      } else if (Math.abs(lunarAge - 14.77) < 0.5) {
        events.push({
          date: date,
          type: 'full-moon',
          name: 'Полнолуние',
          emoji: '🌕',
          description: 'Полная луна освещает небо'
        });
      } else if (Math.abs(lunarAge - 22.15) < 0.5) {
        events.push({
          date: date,
          type: 'last-quarter',
          name: 'Последняя четверть',
          emoji: '🌗',
          description: 'Луна в последней четверти'
        });
      }
    }
    
    return events.slice(0, 8); // Возвращаем максимум 8 событий
  }
}

export default LunarCalculator;