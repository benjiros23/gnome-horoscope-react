// src/data/gnomeQuests.js - Данные о квестах от гномов
export const gnomeQuests = {
  // Банк заданий от гномов
  questBank: [
    {
      id: 'daily_horoscope',
      title: '🔮 Прочитай свой гороскоп',
      description: 'Изучи сегодняшний прогноз для своего знака зодиака',
      type: 'daily',
      difficulty: 'easy',
      reward: { coins: 10, experience: 5 },
      gnome: 'wise_thorgar',
      gnomeName: 'Торгар Мудрый',
      instructions: 'Загляни в раздел "Гороскоп" и прочитай прогноз на сегодня',
      timeLimit: 24, // часов
      category: 'knowledge'
    },
    {
      id: 'lunar_phase_check',
      title: '🌙 Узнай фазу Луны',
      description: 'Проверь текущую лунную фазу и её влияние',
      type: 'daily',
      difficulty: 'easy',
      reward: { coins: 15, experience: 8 },
      gnome: 'mystic_nova',
      gnomeName: 'Нова Мистическая',
      instructions: 'Открой лунный календарь и изучи сегодняшнюю фазу',
      timeLimit: 24,
      category: 'lunar'
    },
    {
      id: 'lucky_number',
      title: '🎯 Найди счастливое число',
      description: 'Рассчитай своё счастливое число дня',
      type: 'daily',
      difficulty: 'medium',
      reward: { coins: 20, experience: 12 },
      gnome: 'lucky_gimli',
      gnomeName: 'Гимли Удачливый',
      instructions: 'Используй калькулятор нумерологии для расчёта',
      timeLimit: 24,
      category: 'numerology'
    },
    {
      id: 'protection_ritual',
      title: '🛡️ Активируй защиту',
      description: 'Выполни ритуал защиты от негативной энергии',
      type: 'daily',
      difficulty: 'medium',
      reward: { coins: 25, experience: 15 },
      gnome: 'brave_baldar',
      gnomeName: 'Балдар Смелый',
      instructions: 'Представь себя в защитном пузыре света на 3 минуты',
      timeLimit: 24,
      category: 'protection'
    },
    {
      id: 'love_affirmation',
      title: '💕 Произнеси аффирмацию любви',
      description: 'Скажи себе 3 добрых слова перед зеркалом',
      type: 'daily',
      difficulty: 'easy',
      reward: { coins: 12, experience: 6 },
      gnome: 'romantic_rosie',
      gnomeName: 'Рози Романтичная',
      instructions: 'Посмотри в зеркало и скажи: "Я достоин(а) любви"',
      timeLimit: 24,
      category: 'love'
    },
    {
      id: 'gratitude_coins',
      title: '💰 Поблагодари за изобилие',
      description: 'Поблагодари Вселенную за все блага в жизни',
      type: 'daily',
      difficulty: 'easy',
      reward: { coins: 18, experience: 10 },
      gnome: 'wealthy_golden',
      gnomeName: 'Голден Богатый',
      instructions: 'Назови 5 вещей, за которые ты благодарен',
      timeLimit: 24,
      category: 'wealth'
    },
    {
      id: 'meditation_session',
      title: '🧘‍♀️ Медитация со звёздами',
      description: 'Проведи 10-минутную медитацию под звёздным небом',
      type: 'daily',
      difficulty: 'medium',
      reward: { coins: 22, experience: 14 },
      gnome: 'wise_thorgar',
      gnomeName: 'Торгар Мудрый',
      instructions: 'Сядь удобно, закрой глаза и представь звёздное небо',
      timeLimit: 24,
      category: 'spiritual'
    },
    {
      id: 'energy_cleansing',
      title: '✨ Очисти энергию дома',
      description: 'Проветри комнату и уберись с мыслями о чистоте',
      type: 'daily',
      difficulty: 'easy',
      reward: { coins: 16, experience: 9 },
      gnome: 'mystic_nova',
      gnomeName: 'Нова Мистическая',
      instructions: 'Открой окна, уберись и представь, как негатив уходит',
      timeLimit: 24,
      category: 'cleansing'
    },
    {
      id: 'compatibility_check',
      title: '💫 Проверь совместимость',
      description: 'Узнай совместимость с друзьями или партнёром',
      type: 'weekly',
      difficulty: 'medium',
      reward: { coins: 50, experience: 25 },
      gnome: 'romantic_rosie',
      gnomeName: 'Рози Романтичная',
      instructions: 'Используй калькулятор совместимости знаков',
      timeLimit: 168, // 7 дней
      category: 'love'
    },
    {
      id: 'astro_events',
      title: '🌌 Изучи астрособытия',
      description: 'Ознакомься с важными астрологическими событиями недели',
      type: 'weekly',
      difficulty: 'hard',
      reward: { coins: 75, experience: 40 },
      gnome: 'wise_thorgar',
      gnomeName: 'Торгар Мудрый',
      instructions: 'Прочитай и запомни 3 важных астрособытия',
      timeLimit: 168,
      category: 'astrology'
    },
    {
      id: 'wealth_visualization',
      title: '💎 Визуализация изобилия',
      description: 'Представь себя в изобилии и процветании',
      type: 'weekly',
      difficulty: 'medium',
      reward: { coins: 60, experience: 30 },
      gnome: 'wealthy_golden',
      gnomeName: 'Голден Богатый',
      instructions: 'Потрать 15 минут на визуализацию своих финансовых целей',
      timeLimit: 168,
      category: 'wealth'
    },
    {
      id: 'full_moon_ritual',
      title: '🌕 Ритуал полнолуния',
      description: 'Особый ритуал в ночь полнолуния',
      type: 'special',
      difficulty: 'hard',
      reward: { coins: 100, experience: 50 },
      gnome: 'mystic_nova',
      gnomeName: 'Нова Мистическая',
      instructions: 'Выполни особый ритуал под светом полной луны',
      timeLimit: 24,
      category: 'lunar',
      conditions: ['full_moon']
    }
  ],

  // Типы наград
  rewardTypes: {
    coins: {
      name: 'Гномьи монеты',
      icon: '🪙',
      description: 'Валюта мудрых гномов'
    },
    experience: {
      name: 'Опыт',
      icon: '⭐',
      description: 'Духовный рост и развитие'
    },
    streak: {
      name: 'Серия',
      icon: '🔥',
      description: 'Дни подряд выполненных заданий'
    }
  },

  // Уровни сложности
  difficultyLevels: {
    easy: {
      name: 'Лёгкий',
      color: '#68D391',
      icon: '⭐',
      description: 'Простое задание для новичков'
    },
    medium: {
      name: 'Средний',
      color: '#F6AD55',
      icon: '⭐⭐',
      description: 'Требует некоторых усилий'
    },
    hard: {
      name: 'Сложный',
      color: '#FC8181',
      icon: '⭐⭐⭐',
      description: 'Для опытных искателей мудрости'
    }
  },

  // Достижения
  achievements: [
    {
      id: 'first_quest',
      name: 'Первые шаги',
      description: 'Выполни свой первый квест',
      icon: '🎯',
      reward: { coins: 50, experience: 25 },
      condition: { type: 'quests_completed', value: 1 }
    },
    {
      id: 'week_streak',
      name: 'Недельная серия',
      description: 'Выполняй квесты 7 дней подряд',
      icon: '🔥',
      reward: { coins: 100, experience: 50 },
      condition: { type: 'streak', value: 7 }
    },
    {
      id: 'mentor_friend',
      name: 'Друг гномов',
      description: 'Получи советы от всех 6 наставников',
      icon: '🤝',
      reward: { coins: 200, experience: 100 },
      condition: { type: 'mentors_consulted', value: 6 }
    },
    {
      id: 'coin_collector',
      name: 'Коллекционер монет',
      description: 'Собери 500 гномьих монет',
      icon: '💰',
      reward: { coins: 100, experience: 75 },
      condition: { type: 'coins_collected', value: 500 }
    },
    {
      id: 'wisdom_seeker',
      name: 'Искатель мудрости',
      description: 'Набери 1000 очков опыта',
      icon: '🧙‍♂️',
      reward: { coins: 150, experience: 100 },
      condition: { type: 'experience_gained', value: 1000 }
    }
  ]
};

// Функции для работы с квестами
export const getQuestsByType = (type) => {
  return gnomeQuests.questBank.filter(quest => quest.type === type);
};

export const getQuestsByDifficulty = (difficulty) => {
  return gnomeQuests.questBank.filter(quest => quest.difficulty === difficulty);
};

export const generateDailyQuests = (count = 4) => {
  const dailyQuests = getQuestsByType('daily');
  const selected = [];
  
  while (selected.length < count && selected.length < dailyQuests.length) {
    const randomQuest = dailyQuests[Math.floor(Math.random() * dailyQuests.length)];
    if (!selected.find(q => q.id === randomQuest.id)) {
      selected.push({
        ...randomQuest,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + randomQuest.timeLimit * 60 * 60 * 1000).toISOString()
      });
    }
  }
  
  return selected;
};

export const checkAchievements = (userStats) => {
  return gnomeQuests.achievements.filter(achievement => {
    const condition = achievement.condition;
    switch (condition.type) {
      case 'quests_completed':
        return userStats.questsCompleted >= condition.value;
      case 'streak':
        return userStats.currentStreak >= condition.value;
      case 'mentors_consulted':
        return userStats.mentorsConsulted >= condition.value;
      case 'coins_collected':
        return userStats.totalCoins >= condition.value;
      case 'experience_gained':
        return userStats.totalExperience >= condition.value;
      default:
        return false;
    }
  });
};