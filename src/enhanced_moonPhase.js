// Enhanced Moon Phase Calculator с поддержкой SunCalc и оптимизированной архитектурой

// ===== КОНСТАНТЫ =====
const LUNAR_CYCLE_DAYS = 29.53;
const MOSCOW_COORDS = { lat: 55.7558, lng: 37.6173 };

// Оптимизированная структура данных
const MOON_PHASES = {
  NEW_MOON: { name: 'Новолуние', emoji: '🌑', range: [0, 0.03] },
  WAXING_CRESCENT: { name: 'Молодая луна', emoji: '🌒', range: [0.03, 0.22] },
  FIRST_QUARTER: { name: 'Первая четверть', emoji: '🌓', range: [0.22, 0.28] },
  WAXING_GIBBOUS: { name: 'Растущая луна', emoji: '🌔', range: [0.28, 0.47] },
  FULL_MOON: { name: 'Полнолуние', emoji: '🌕', range: [0.47, 0.53] },
  WANING_GIBBOUS: { name: 'Убывающая луна', emoji: '🌖', range: [0.53, 0.72] },
  LAST_QUARTER: { name: 'Последняя четверть', emoji: '🌗', range: [0.72, 0.78] },
  WANING_CRESCENT: { name: 'Старая луна', emoji: '🌘', range: [0.78, 1.0] }
};

// Статические данные на 2025 год (оптимизированные)
const MOON_DATA_2025 = new Map([
  // Август 2025
  ['2025-08-01', { phase: 'Убывающая луна', emoji: '🌖', illumination: 45, age: 21.2, lunarDay: 22 }],
  ['2025-08-02', { phase: 'Убывающая луна', emoji: '🌖', illumination: 36, age: 22.2, lunarDay: 23 }],
  ['2025-08-03', { phase: 'Последняя четверть', emoji: '🌗', illumination: 27, age: 23.2, lunarDay: 24 }],
  ['2025-08-04', { phase: 'Старая луна', emoji: '🌘', illumination: 19, age: 24.2, lunarDay: 25 }],
  ['2025-08-05', { phase: 'Старая луна', emoji: '🌘', illumination: 12, age: 25.2, lunarDay: 26 }],
  ['2025-08-06', { phase: 'Старая луна', emoji: '🌘', illumination: 6, age: 26.2, lunarDay: 27 }],
  ['2025-08-07', { phase: 'Старая луна', emoji: '🌘', illumination: 2, age: 27.2, lunarDay: 28 }],
  ['2025-08-08', { phase: 'Новолуние', emoji: '🌑', illumination: 0, age: 28.2, lunarDay: 29 }],
  ['2025-08-09', { phase: 'Новолуние', emoji: '🌑', illumination: 0, age: 0.8, lunarDay: 1 }],
  ['2025-08-10', { phase: 'Молодая луна', emoji: '🌒', illumination: 1, age: 1.8, lunarDay: 2 }],
  ['2025-08-11', { phase: 'Молодая луна', emoji: '🌒', illumination: 3, age: 2.8, lunarDay: 3 }],
  
  // Актуальные данные на текущий период
  ['2025-08-23', { phase: 'Новолуние', emoji: '🌑', illumination: 0, age: 0.1, lunarDay: 1 }],
  ['2025-08-24', { phase: 'Молодая луна', emoji: '🌒', illumination: 2, age: 1.1, lunarDay: 2 }],
  ['2025-08-25', { phase: 'Молодая луна', emoji: '🌒', illumination: 5, age: 2.1, lunarDay: 3 }],
  ['2025-08-26', { phase: 'Молодая луна', emoji: '🌒', illumination: 9, age: 3.1, lunarDay: 4 }],
  ['2025-08-27', { phase: 'Молодая луна', emoji: '🌒', illumination: 15, age: 4.1, lunarDay: 5 }],
  ['2025-08-28', { phase: 'Молодая луна', emoji: '🌒', illumination: 21, age: 5.1, lunarDay: 6 }],
  ['2025-08-29', { phase: 'Первая четверть', emoji: '🌓', illumination: 29, age: 6.1, lunarDay: 7 }],
  ['2025-08-30', { phase: 'Растущая луна', emoji: '🌔', illumination: 37, age: 7.1, lunarDay: 8 }],
  ['2025-08-31', { phase: 'Растущая луна', emoji: '🌔', illumination: 46, age: 8.1, lunarDay: 9 }],
  
  // Сентябрь 2025
  ['2025-09-01', { phase: 'Растущая луна', emoji: '🌔', illumination: 55, age: 9.1, lunarDay: 10 }],
  ['2025-09-02', { phase: 'Растущая луна', emoji: '🌔', illumination: 64, age: 10.1, lunarDay: 11 }],
  ['2025-09-03', { phase: 'Растущая луна', emoji: '🌔', illumination: 73, age: 11.1, lunarDay: 12 }],
  ['2025-09-04', { phase: 'Растущая луна', emoji: '🌔', illumination: 81, age: 12.1, lunarDay: 13 }],
  ['2025-09-05', { phase: 'Растущая луна', emoji: '🌔', illumination: 88, age: 13.1, lunarDay: 14 }],
  ['2025-09-06', { phase: 'Растущая луна', emoji: '🌔', illumination: 94, age: 14.1, lunarDay: 15 }],
  ['2025-09-07', { phase: 'Полнолуние', emoji: '🌕', illumination: 99, age: 15.1, lunarDay: 16 }],
  ['2025-09-08', { phase: 'Полнолуние', emoji: '🌕', illumination: 100, age: 16.1, lunarDay: 17 }]
]);

// Координаты городов
const CITY_COORDINATES = new Map([
  ['moscow', { lat: 55.7558, lng: 37.6173, name: 'Москва' }],
  ['spb', { lat: 59.9311, lng: 30.3609, name: 'Санкт-Петербург' }],
  ['ekaterinburg', { lat: 56.8431, lng: 60.6454, name: 'Екатеринбург' }],
  ['default', { lat: 55.7558, lng: 37.6173, name: 'Москва' }]
]);

// ===== УТИЛИТЫ =====
class DateUtils {
  static toDateString(date) {
    return date.toISOString().split('T')[0];
  }

  static addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static daysBetween(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  static formatTime(time, locale = 'ru-RU') {
    if (!time) return 'Нет данных';
    return time.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

class PhaseCalculator {
  static getPhaseFromIllumination(phase) {
    for (const [key, config] of Object.entries(MOON_PHASES)) {
      const [min, max] = config.range;
      if (phase >= min && (phase < max || (key === 'WANING_CRESCENT' && phase <= max))) {
        return config;
      }
    }
    return MOON_PHASES.NEW_MOON;
  }

  static calculateAge(phase) {
    return Math.round(phase * LUNAR_CYCLE_DAYS);
  }

  static calculateLunarDay(age) {
    return Math.floor(age) + 1;
  }

  static isWaxing(phase) {
    return phase < 0.5;
  }
}

// ===== ОСНОВНОЙ КЛАСС =====
export class EnhancedMoonPhase {
  // Кеш для вычислений
  static _cache = new Map();
  static _sunCalcAvailable = null;

  // Проверка доступности SunCalc
  static get sunCalcAvailable() {
    if (this._sunCalcAvailable === null) {
      this._sunCalcAvailable = typeof window !== 'undefined' && !!window.SunCalc;
    }
    return this._sunCalcAvailable;
  }

  // Главный метод для получения данных о луне
  static calculatePhase(date) {
    const dateString = DateUtils.toDateString(date);
    
    // Проверяем кеш
    if (this._cache.has(dateString)) {
      return this._cache.get(dateString);
    }

    let result;

    try {
      // 1. Пробуем статические данные
      const staticData = MOON_DATA_2025.get(dateString);
      
      if (staticData) {
        console.log(`📊 Статические данные для ${dateString}`);
        result = {
          ...staticData,
          isWaxing: staticData.age < 14.7,
          source: 'static'
        };
      } else if (this.sunCalcAvailable) {
        // 2. Используем SunCalc
        console.log(`🧮 SunCalc расчет для ${dateString}`);
        result = this._calculateFromSunCalc(date);
      } else {
        // 3. Fallback к ближайшим данным
        console.warn(`⚠️ Fallback для ${dateString}`);
        result = this.getFallbackData(date);
      }

      // Добавляем дополнительные данные
      result = this._enrichMoonData(result, date);
      
      // Кешируем результат
      this._cache.set(dateString, result);
      
      return result;

    } catch (error) {
      console.error('❌ Ошибка расчета фазы луны:', error);
      return this.getFallbackData(date);
    }
  }

  // Расчет через SunCalc
  static _calculateFromSunCalc(date) {
    try {
      const SunCalc = window.SunCalc;
      const illumination = SunCalc.getMoonIllumination(date);
      const times = SunCalc.getMoonTimes(date, MOSCOW_COORDS.lat, MOSCOW_COORDS.lng);

      const phaseConfig = PhaseCalculator.getPhaseFromIllumination(illumination.phase);
      const age = PhaseCalculator.calculateAge(illumination.phase);

      return {
        phase: phaseConfig.name,
        emoji: phaseConfig.emoji,
        illumination: Math.round(illumination.fraction * 100),
        age,
        lunarDay: PhaseCalculator.calculateLunarDay(age),
        isWaxing: PhaseCalculator.isWaxing(illumination.phase),
        moonrise: DateUtils.formatTime(times.rise),
        moonset: DateUtils.formatTime(times.set),
        source: 'suncalc'
      };
    } catch (error) {
      console.error('SunCalc calculation error:', error);
      throw error;
    }
  }

  // Обогащение данных дополнительной информацией
  static _enrichMoonData(moonData, date) {
    return {
      ...moonData,
      dateString: DateUtils.toDateString(date),
      timestamp: date.getTime(),
      advice: this.getGnomeAdvice(moonData.phase)
    };
  }

  // Fallback данные
  static getFallbackData(date) {
    const dateString = DateUtils.toDateString(date);
    const availableDates = Array.from(MOON_DATA_2025.keys()).sort();
    
    if (availableDates.length === 0) {
      return this._getDefaultMoonData(date);
    }

    // Находим ближайшую дату
    let closestDate = availableDates[0];
    let minDiff = Math.abs(new Date(dateString) - new Date(closestDate));

    for (const availableDate of availableDates) {
      const diff = Math.abs(new Date(dateString) - new Date(availableDate));
      if (diff < minDiff) {
        minDiff = diff;
        closestDate = availableDate;
      }
    }

    const moonData = MOON_DATA_2025.get(closestDate);
    console.log(`⚠️ Fallback: используем ${closestDate} для ${dateString}`);

    return {
      ...moonData,
      isWaxing: moonData.age < 14.7,
      source: 'fallback'
    };
  }

  // Данные по умолчанию
  static _getDefaultMoonData(date) {
    return {
      phase: 'Неизвестная фаза',
      emoji: '🌙',
      illumination: 50,
      age: 15,
      lunarDay: 16,
      isWaxing: false,
      moonrise: 'Нет данных',
      moonset: 'Нет данных',
      source: 'default'
    };
  }

  // Получение времен восхода и захода луны
  static getMoonTimes(date, city = 'default') {
    const coordinates = CITY_COORDINATES.get(city) || CITY_COORDINATES.get('default');

    if (this.sunCalcAvailable) {
      try {
        const SunCalc = window.SunCalc;
        const times = SunCalc.getMoonTimes(date, coordinates.lat, coordinates.lng);
        
        return {
          moonrise: DateUtils.formatTime(times.rise),
          moonset: DateUtils.formatTime(times.set),
          city: coordinates.name
        };
      } catch (error) {
        console.error('SunCalc moon times error:', error);
      }
    }

    // Fallback времена
    return {
      moonrise: '08:00',
      moonset: '20:00',
      city: coordinates.name
    };
  }

  // Поиск следующей фазы
  static findNextPhase(targetPhase, fromDate = new Date(), maxDays = 35) {
    const startDate = DateUtils.toDateString(fromDate);
    const availableDates = Array.from(MOON_DATA_2025.keys())
      .filter(date => date > startDate)
      .sort();

    for (const dateString of availableDates) {
      const moonData = MOON_DATA_2025.get(dateString);
      if (moonData.phase === targetPhase) {
        const date = new Date(dateString);
        return {
          date,
          dateString: date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            weekday: 'long'
          }),
          daysUntil: DateUtils.daysBetween(fromDate, date)
        };
      }
    }

    return { dateString: 'Скоро', daysUntil: 0 };
  }

  // Советы гномов
  static getGnomeAdvice(phaseName) {
    const adviceMap = new Map([
      ['Новолуние', {
        title: 'Время новых начинаний',
        text: 'Гном Мечтатель шепчет: луна скрыта, но энергия перемен уже зарождается. Загадывайте желания и планируйте будущее.',
        activities: ['Планирование', 'Медитация', 'Постановка целей', 'Очищение пространства'],
        avoid: ['Важные решения', 'Крупные покупки', 'Хирургические операции'],
        energy: 'Минимальная, интровертная'
      }],
      ['Молодая луна', {
        title: 'Время роста и действий',
        text: 'Гном Труженик кует планы: растущая луна дает силу для новых дел. Начинайте проекты, они будут успешными!',
        activities: ['Новые проекты', 'Обучение', 'Физическая активность', 'Знакомства'],
        avoid: ['Лень', 'Откладывание дел', 'Конфликты'],
        energy: 'Нарастающая, созидательная'
      }],
      ['Первая четверть', {
        title: 'Время преодоления препятствий',
        text: 'Гном Воин точит меч: настал час испытаний. Трудности появляются, чтобы сделать вас сильнее. Не сдавайтесь!',
        activities: ['Решение проблем', 'Спорт', 'Важные переговоры', 'Принятие решений'],
        avoid: ['Сомнения', 'Страхи', 'Откладывание сложных дел'],
        energy: 'Активная, боевая'
      }],
      ['Растущая луна', {
        title: 'Время накопления сил',
        text: 'Гном Мудрый собирает травы: продолжайте начатое, энергия на пике роста. Укрепляйте достигнутое.',
        activities: ['Развитие проектов', 'Укрепление отношений', 'Творчество', 'Саморазвитие'],
        avoid: ['Излишества', 'Переутомление', 'Негативные эмоции'],
        energy: 'Высокая, стабильная'
      }],
      ['Полнолуние', {
        title: 'Пик энергии и завершений',
        text: 'Гном Маг зажигает свечи: максимум лунной силы! Завершайте дела, но контролируйте эмоции - они обострены.',
        activities: ['Завершение проектов', 'Празднование успехов', 'Благодарность', 'Медитации'],
        avoid: ['Импульсивные решения', 'Конфликты', 'Переедание', 'Алкоголь'],
        energy: 'Максимальная, взрывная'
      }],
      ['Убывающая луна', {
        title: 'Время освобождения',
        text: 'Гном Целитель варит отвары: пора избавляться от лишнего. Отпустите старое, освободите место для нового.',
        activities: ['Очищение организма', 'Прощение обид', 'Избавление от хлама', 'Диеты'],
        avoid: ['Новые обязательства', 'Накопительство', 'Негативные мысли'],
        energy: 'Убывающая, очищающая'
      }],
      ['Последняя четверть', {
        title: 'Время переосмысления',
        text: 'Гном Философ читает древние свитки: анализируйте прошлое, делайте выводы. Мудрость рождается в тишине.',
        activities: ['Анализ ошибок', 'Планирование будущего', 'Обучение', 'Размышления'],
        avoid: ['Поспешные решения', 'Критика других', 'Суета'],
        energy: 'Спокойная, аналитическая'
      }],
      ['Старая луна', {
        title: 'Время подготовки к новому',
        text: 'Гном Мудрец готовится к отдыху: цикл завершается. Отдохните, наберитесь сил перед новым началом.',
        activities: ['Отдых', 'Медитация', 'Завершение старых дел', 'Подготовка к новому'],
        avoid: ['Стресс', 'Новые проекты', 'Активная деятельность'],
        energy: 'Минимальная, восстанавливающая'
      }]
    ]);

    return adviceMap.get(phaseName) || adviceMap.get('Новолуние');
  }

  // Утилиты для совместимости
  static getLunarDay(date) {
    const moonData = this.calculatePhase(date);
    return moonData.lunarDay || Math.floor(moonData.age) + 1;
  }

  static isWaxing(date) {
    const moonData = this.calculatePhase(date);
    return moonData.isWaxing;
  }

  // Очистка кеша
  static clearCache() {
    this._cache.clear();
    console.log('🗑️ Кеш лунных данных очищен');
  }

  // Отладочная информация
  static debugInfo() {
    const today = new Date();
    const data = this.calculatePhase(today);

    return {
      currentDate: DateUtils.toDateString(today),
      moonData: data,
      availableStaticDates: MOON_DATA_2025.size,
      sunCalcAvailable: this.sunCalcAvailable,
      cacheSize: this._cache.size,
      supportedCities: Array.from(CITY_COORDINATES.keys())
    };
  }
}

// Обратная совместимость
export class MoonPhase extends EnhancedMoonPhase {}

export default EnhancedMoonPhase;

// Инициализация и отладка
if (typeof window !== 'undefined') {
  console.log(`
🌙 ENHANCED MOON PHASE ГОТОВ:
✅ Статические данные: ${MOON_DATA_2025.size} дат
✅ SunCalc интеграция: ${EnhancedMoonPhase.sunCalcAvailable ? 'Активна' : 'Ожидает подключения'}
✅ Поддерживаемые города: ${Array.from(CITY_COORDINATES.keys()).join(', ')}
  `);

  // Debug tools в development режиме
  if (process.env.NODE_ENV === 'development') {
    window.moonPhaseDebug = {
      calculate: EnhancedMoonPhase.calculatePhase,
      debug: EnhancedMoonPhase.debugInfo,
      clearCache: EnhancedMoonPhase.clearCache,
      phases: MOON_PHASES
    };
  }
}
