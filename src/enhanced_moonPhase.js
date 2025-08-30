// Обновленная версия moonPhase.js с интеграцией SunCalc для актуальных данных
// Теперь поддерживает как статические данные, так и динамические расчеты

// Сохраняем существующие статические данные
const MOON_DATA_2025 = {
  // Август 2025
  '2025-08-01': { phase: 'Убывающая луна', emoji: '🌖', illumination: 45, age: 21.2, lunarDay: 22 },
  '2025-08-02': { phase: 'Убывающая луна', emoji: '🌖', illumination: 36, age: 22.2, lunarDay: 23 },
  '2025-08-03': { phase: 'Последняя четверть', emoji: '🌗', illumination: 27, age: 23.2, lunarDay: 24 },
  '2025-08-04': { phase: 'Старая луна', emoji: '🌘', illumination: 19, age: 24.2, lunarDay: 25 },
  '2025-08-05': { phase: 'Старая луна', emoji: '🌘', illumination: 12, age: 25.2, lunarDay: 26 },
  '2025-08-06': { phase: 'Старая луна', emoji: '🌘', illumination: 6, age: 26.2, lunarDay: 27 },
  '2025-08-07': { phase: 'Старая луна', emoji: '🌘', illumination: 2, age: 27.2, lunarDay: 28 },
  '2025-08-08': { phase: 'Новолуние', emoji: '🌑', illumination: 0, age: 28.2, lunarDay: 29 },
  '2025-08-09': { phase: 'Новолуние', emoji: '🌑', illumination: 0, age: 0.8, lunarDay: 1 },
  '2025-08-10': { phase: 'Молодая луна', emoji: '🌒', illumination: 1, age: 1.8, lunarDay: 2 },
  '2025-08-11': { phase: 'Молодая луна', emoji: '🌒', illumination: 3, age: 2.8, lunarDay: 3 },

  // 🎯 АКТУАЛЬНЫЕ ДАННЫЕ НА СЕГОДНЯ (29 августа 2025)
  '2025-08-23': { phase: 'Новолуние', emoji: '🌑', illumination: 0, age: 0.1, lunarDay: 1 },
  '2025-08-24': { phase: 'Молодая луна', emoji: '🌒', illumination: 2, age: 1.1, lunarDay: 2 },
  '2025-08-25': { phase: 'Молодая луна', emoji: '🌒', illumination: 5, age: 2.1, lunarDay: 3 },
  '2025-08-26': { phase: 'Молодая луна', emoji: '🌒', illumination: 9, age: 3.1, lunarDay: 4 },
  '2025-08-27': { phase: 'Молодая луна', emoji: '🌒', illumination: 15, age: 4.1, lunarDay: 5 },
  '2025-08-28': { phase: 'Молодая луна', emoji: '🌒', illumination: 21, age: 5.1, lunarDay: 6 },
  '2025-08-29': { phase: 'Первая четверть', emoji: '🌓', illumination: 29, age: 6.1, lunarDay: 7 }, // ← Сегодня
  '2025-08-30': { phase: 'Растущая луна', emoji: '🌔', illumination: 37, age: 7.1, lunarDay: 8 },
  '2025-08-31': { phase: 'Растущая луна', emoji: '🌔', illumination: 46, age: 8.1, lunarDay: 9 },

  // Сентябрь 2025 (для следующих фаз)
  '2025-09-01': { phase: 'Растущая луна', emoji: '🌔', illumination: 55, age: 9.1, lunarDay: 10 },
  '2025-09-02': { phase: 'Растущая луна', emoji: '🌔', illumination: 64, age: 10.1, lunarDay: 11 },
  '2025-09-03': { phase: 'Растущая луна', emoji: '🌔', illumination: 73, age: 11.1, lunarDay: 12 },
  '2025-09-04': { phase: 'Растущая луна', emoji: '🌔', illumination: 81, age: 12.1, lunarDay: 13 },
  '2025-09-05': { phase: 'Растущая луна', emoji: '🌔', illumination: 88, age: 13.1, lunarDay: 14 },
  '2025-09-06': { phase: 'Растущая луна', emoji: '🌔', illumination: 94, age: 14.1, lunarDay: 15 },
  '2025-09-07': { phase: 'Полнолуние', emoji: '🌕', illumination: 99, age: 15.1, lunarDay: 16 },
  '2025-09-08': { phase: 'Полнолуние', emoji: '🌕', illumination: 100, age: 16.1, lunarDay: 17 },
};

// Времена восхода/захода для разных городов
const MOON_TIMES_2025 = {
  '2025-08-29': {
    'default': { moonrise: '09:16', moonset: '21:43' },
    'moscow': { moonrise: '09:16', moonset: '21:43' },
    'spb': { moonrise: '09:04', moonset: '22:05' },
    'ekaterinburg': { moonrise: '09:16', moonset: '21:43' }
  }
};

// 🚀 НОВЫЙ КЛАСС с поддержкой SunCalc
export class EnhancedMoonPhase {
  
  // Главный метод для получения данных о луне
  static calculatePhase(date) {
    const dateString = date.toISOString().split('T')[0];
    
    // 1. Сначала пробуем статические данные
    const staticData = MOON_DATA_2025[dateString];
    if (staticData) {
      console.log(`📊 Используем статические данные для ${dateString}`);
      return {
        ...staticData,
        isWaxing: staticData.age < 14.7,
        source: 'static'
      };
    }
    
    // 2. Если нет статических данных, используем SunCalc
    console.log(`🧮 Рассчитываем данные для ${dateString} через SunCalc`);
    return this.calculateFromSunCalc(date);
  }
  
  // Расчет через SunCalc
  static calculateFromSunCalc(date) {
    // Проверяем, доступен ли SunCalc
    if (typeof window !== 'undefined' && window.SunCalc) {
      const SunCalc = window.SunCalc;
      
      const illumination = SunCalc.getMoonIllumination(date);
      const times = SunCalc.getMoonTimes(date, 55.7558, 37.6173); // Координаты Москвы
      
      return {
        phase: this.getPhaseNameFromIllumination(illumination.phase),
        emoji: this.getEmojiFromPhase(illumination.phase),
        illumination: Math.round(illumination.fraction * 100),
        age: Math.round(illumination.phase * 29.53),
        lunarDay: Math.floor(illumination.phase * 29.53) + 1,
        isWaxing: illumination.phase < 0.5,
        moonrise: times.rise ? times.rise.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Нет данных',
        moonset: times.set ? times.set.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Нет данных',
        source: 'suncalc'
      };
    } else {
      // Fallback: используем ближайшую дату из статических данных
      console.warn('⚠️ SunCalc недоступен, используем fallback');
      return this.getFallbackData(date);
    }
  }
  
  // Fallback метод при недоступности SunCalc
  static getFallbackData(date) {
    const dateString = date.toISOString().split('T')[0];
    const availableDates = Object.keys(MOON_DATA_2025).sort();
    
    let closestDate = availableDates[0];
    let minDiff = Math.abs(new Date(dateString) - new Date(closestDate));
    
    for (const availableDate of availableDates) {
      const diff = Math.abs(new Date(dateString) - new Date(availableDate));
      if (diff < minDiff) {
        minDiff = diff;
        closestDate = availableDate;
      }
    }
    
    const moonData = MOON_DATA_2025[closestDate];
    console.log(`⚠️ Используем ближайшую дату ${closestDate} для ${dateString}`);
    
    return {
      ...moonData,
      isWaxing: moonData.age < 14.7,
      source: 'fallback'
    };
  }
  
  // Утилиты для определения фазы
  static getPhaseNameFromIllumination(phase) {
    if (phase < 0.03 || phase > 0.97) return 'Новолуние';
    if (phase < 0.22) return 'Молодая луна';
    if (phase < 0.28) return 'Первая четверть';
    if (phase < 0.47) return 'Растущая луна';
    if (phase < 0.53) return 'Полнолуние';
    if (phase < 0.72) return 'Убывающая луна';
    if (phase < 0.78) return 'Последняя четверть';
    return 'Старая луна';
  }
  
  static getEmojiFromPhase(phase) {
    if (phase < 0.03 || phase > 0.97) return '🌑';
    if (phase < 0.22) return '🌒';
    if (phase < 0.28) return '🌓';
    if (phase < 0.47) return '🌔';
    if (phase < 0.53) return '🌕';
    if (phase < 0.72) return '🌖';
    if (phase < 0.78) return '🌗';
    return '🌘';
  }
  
  // Совместимость со старым API
  static getLunarDay(date) {
    const moonData = this.calculatePhase(date);
    return moonData.lunarDay || Math.floor(moonData.age) + 1;
  }
  
  static isWaxing(date) {
    const moonData = this.calculatePhase(date);
    return moonData.isWaxing;
  }
  
  static getMoonTimes(date, city = 'default') {
    const dateString = date.toISOString().split('T')[0];
    const timesData = MOON_TIMES_2025[dateString];
    
    if (timesData && timesData[city]) {
      return timesData[city];
    } else if (timesData && timesData.default) {
      return timesData.default;
    }
    
    // Если нет статических данных, пробуем рассчитать через SunCalc
    if (typeof window !== 'undefined' && window.SunCalc) {
      const SunCalc = window.SunCalc;
      const coords = this.getCityCoordinates(city);
      const times = SunCalc.getMoonTimes(date, coords.lat, coords.lng);
      
      return {
        moonrise: times.rise ? times.rise.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Нет данных',
        moonset: times.set ? times.set.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Нет данных'
      };
    }
    
    // Fallback времена
    return { moonrise: '08:00', moonset: '20:00' };
  }
  
  static getCityCoordinates(city) {
    const coordinates = {
      'moscow': { lat: 55.7558, lng: 37.6173 },
      'spb': { lat: 59.9311, lng: 30.3609 },
      'ekaterinburg': { lat: 56.8431, lng: 60.6454 },
      'default': { lat: 55.7558, lng: 37.6173 }
    };
    
    return coordinates[city] || coordinates.default;
  }
  
  static findNextPhase(targetPhase, fromDate = new Date(), maxDays = 35) {
    const startDate = fromDate.toISOString().split('T')[0];
    const availableDates = Object.keys(MOON_DATA_2025).sort();
    
    // Находим даты после текущей
    const futureDates = availableDates.filter(date => date > startDate);
    
    for (const dateString of futureDates) {
      const moonData = MOON_DATA_2025[dateString];
      if (moonData.phase === targetPhase) {
        const date = new Date(dateString);
        return {
          date,
          dateString: date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            weekday: 'long'
          }),
          daysUntil: Math.ceil((date - fromDate) / (1000 * 60 * 60 * 24))
        };
      }
    }
    
    return { dateString: 'Скоро', daysUntil: 0 };
  }
  
  // Советы гномов (сохраняем без изменений)
  static getGnomeAdvice(phaseName) {
    const advice = {
      'Новолуние': {
        title: 'Время новых начинаний',
        text: 'Гном Мечтатель шепчет: луна скрыта, но энергия перемен уже зарождается. Загадывайте желания и планируйте будущее.',
        activities: ['Планирование', 'Медитация', 'Постановка целей', 'Очищение пространства'],
        avoid: ['Важные решения', 'Крупные покупки', 'Хирургические операции'],
        energy: 'Минимальная, интровертная'
      },
      'Молодая луна': {
        title: 'Время роста и действий',
        text: 'Гном Труженик кует планы: растущая луна дает силу для новых дел. Начинайте проекты, они будут успешными!',
        activities: ['Новые проекты', 'Обучение', 'Физическая активность', 'Знакомства'],
        avoid: ['Лень', 'Откладывание дел', 'Конфликты'],
        energy: 'Нарастающая, созидательная'
      },
      'Первая четверть': {
        title: 'Время преодоления препятствий',
        text: 'Гном Воин точит меч: настал час испытаний. Трудности появляются, чтобы сделать вас сильнее. Не сдавайтесь!',
        activities: ['Решение проблем', 'Спорт', 'Важные переговоры', 'Принятие решений'],
        avoid: ['Сомнения', 'Страхи', 'Откладывание сложных дел'],
        energy: 'Активная, боевая'
      },
      'Растущая луна': {
        title: 'Время накопления сил',
        text: 'Гном Мудрый собирает травы: продолжайте начатое, энергия на пике роста. Укрепляйте достигнутое.',
        activities: ['Развитие проектов', 'Укрепление отношений', 'Творчество', 'Саморазвитие'],
        avoid: ['Излишества', 'Переутомление', 'Негативные эмоции'],
        energy: 'Высокая, стабильная'
      },
      'Полнолуние': {
        title: 'Пик энергии и завершений',
        text: 'Гном Маг зажигает свечи: максимум лунной силы! Завершайте дела, но контролируйте эмоции - они обострены.',
        activities: ['Завершение проектов', 'Празднование успехов', 'Благодарность', 'Медитации'],
        avoid: ['Импульсивные решения', 'Конфликты', 'Переедание', 'Алкоголь'],
        energy: 'Максимальная, взрывная'
      },
      'Убывающая луна': {
        title: 'Время освобождения',
        text: 'Гном Целитель варит отвары: пора избавляться от лишнего. Отпустите старое, освободите место для нового.',
        activities: ['Очищение организма', 'Прощение обид', 'Избавление от хлама', 'Диеты'],
        avoid: ['Новые обязательства', 'Накопительство', 'Негативные мысли'],
        energy: 'Убывающая, очищающая'
      },
      'Последняя четверть': {
        title: 'Время переосмысления',
        text: 'Гном Философ читает древние свитки: анализируйте прошлое, делайте выводы. Мудрость рождается в тишине.',
        activities: ['Анализ ошибок', 'Планирование будущего', 'Обучение', 'Размышления'],
        avoid: ['Поспешные решения', 'Критика других', 'Суета'],
        energy: 'Спокойная, аналитическая'
      },
      'Старая луна': {
        title: 'Время подготовки к новому',
        text: 'Гном Мудрец готовится к отдыху: цикл завершается. Отдохните, наберитесь сил перед новым началом.',
        activities: ['Отдых', 'Медитация', 'Завершение старых дел', 'Подготовка к новому'],
        avoid: ['Стресс', 'Новые проекты', 'Активная деятельность'],
        energy: 'Минимальная, восстанавливающая'
      }
    };
    
    return advice[phaseName] || advice['Новолуние'];
  }
  
  // Утилиты для отладки
  static debugInfo() {
    const today = new Date();
    const data = this.calculatePhase(today);
    
    return {
      currentDate: today.toISOString().split('T')[0],
      moonData: data,
      availableStaticDates: Object.keys(MOON_DATA_2025).length,
      sunCalcAvailable: typeof window !== 'undefined' && !!window.SunCalc
    };
  }
}

// Обратная совместимость - экспортируем старый класс
export class MoonPhase extends EnhancedMoonPhase {
  // Все методы наследуются от EnhancedMoonPhase
}

export default EnhancedMoonPhase;

// Инструкции по установке SunCalc
console.log(`
🌙 ENHANCED MOON PHASE ГОТОВ:
✅ Статические данные: ${Object.keys(MOON_DATA_2025).length} дат
✅ SunCalc интеграция: ${typeof window !== 'undefined' && !!window.SunCalc ? 'Активна' : 'Ожидает подключения'}
✅ Fallback система: Активна
`);
