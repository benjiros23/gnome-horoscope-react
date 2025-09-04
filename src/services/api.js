// Enhanced API service with caching and error handling + Backend Integration
class ApiService {
  constructor() {
    // 🧙‍♂️ URL вашего FastAPI бэкенда
    this.baseURL = process.env.REACT_APP_API_URL || 'https://d-gnome-horoscope-miniapp-frontend.onrender.com';
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    
    // 🤖 Telegram Bot Configuration
    this.telegramBotToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
    this.telegramApiUrl = `https://api.telegram.org/bot${this.telegramBotToken}`;
  }

  async request(endpoint, options = {}) {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Check cache first for GET requests
    if (!options.method || options.method === 'GET') {
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log('🧙‍♂️ Используем кэшированные данные для:', endpoint);
          return cached.data;
        }
      }
    }

    try {
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log('🔮 Запрос к серверу:', fullUrl);
      
      const response = await fetch(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      console.log('📡 Ответ сервера:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Данные получены:', data);
      
      // Cache successful GET responses
      if (!options.method || options.method === 'GET') {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      console.error('❌ Ошибка API запроса:', error);
      console.error('🔧 URL:', `${this.baseURL}${endpoint}`);
      
      // Fallback to mock data for critical endpoints
      if (endpoint.includes('/api/horoscope')) {
        console.log('🧙‍♂️ Используем резервные данные гороскопа');
        return this.getMockHoroscope();
      }
      
      throw error;
    }
  }

  // 🧙‍♂️ ОСНОВНЫЕ API МЕТОДЫ ДЛЯ БЭКЕНДА
  
  // Гороскоп (совместимо с вашим бэкендом)
  async getHoroscope(sign, date = null, userId = null) {
    const params = new URLSearchParams();
    params.append('sign', sign);
    if (date) params.append('date', date);
    if (userId) params.append('user_id', userId);
    
    return this.request(`/api/horoscope?${params.toString()}`);
  }

  // Премиум гороскоп
  async getPremiumHoroscope(sign, initData) {
    try {
      return await this.request('/api/horoscope/premium', {
        method: 'POST',
        body: JSON.stringify({ sign, initData })
      });
    } catch (error) {
      console.error('Ошибка получения премиум гороскопа:', error);
      return this.getMockPremiumHoroscope(sign);
    }
  }

  // Карта дня
  async getDayCard(initData) {
    try {
      return await this.request('/api/day-card', {
        method: 'POST',
        body: JSON.stringify({ initData })
      });
    } catch (error) {
      console.error('Ошибка получения карты дня:', error);
      return this.getMockDayCard();
    }
  }

  // Избранное
  async addToFavorites(type, content, initData) {
    return this.request('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ type, content, initData })
    });
  }

  async getFavorites(initData) {
    return this.request(`/api/favorites?init_data=${encodeURIComponent(initData)}`);
  }

  // Настройки пользователя  
  async saveUserSettings(settings, initData) {
    return this.request('/api/user/settings', {
      method: 'POST',
      body: JSON.stringify({ settings, initData })
    });
  }

  async getUserSettings(initData) {
    try {
      return await this.request(`/api/user/settings?init_data=${encodeURIComponent(initData)}`);
    } catch (error) {
      console.error('Ошибка получения настроек:', error);
      return {
        zodiac_sign: null,
        premium: false,
        language: 'ru',
        theme: 'light',
        notification_time: '09:00'
      };
    }
  }

  // Аналитика
  async getUserAnalytics(initData) {
    try {
      return await this.request(`/api/analytics/user?init_data=${encodeURIComponent(initData)}`);
    } catch (error) {
      console.error('Ошибка получения аналитики:', error);
      return { action_statistics: {}, recent_actions: [], total_actions: 0 };
    }
  }

  // Поделиться контентом
  async shareContent(contentType, content, shareText, initData) {
    return this.request('/api/share', {
      method: 'POST',
      body: JSON.stringify({
        content_type: contentType,
        content,
        share_text: shareText,
        initData
      })
    });
  }

  async getSharedContent(shareId) {
    return this.request(`/api/shared/${shareId}`);
  }

  // 🧙‍♂️ LEGACY МЕТОДЫ (для обратной совместимости)
  async getMoonData() {
    // Пока используем mock данные, можно интегрировать с бэкендом позже
    return this.getMockMoonData();
  }

  async getCompatibility(sign1, sign2) {
    // Пока используем mock данные, можно интегрировать с бэкендом позже
    return this.getMockCompatibility(sign1, sign2);
  }

  // 🧙‍♂️ MOCK ДАННЫЕ ДЛЯ ОФФЛАЙН РЕЖИМА
  getMockHoroscope() {
    const horoscopes = [
      "Звезды советуют проявить инициативу! Сегодня удачный день для новых начинаний.",
      "Прислушайтесь к своей интуиции - она не подведет в важных решениях.",
      "День благоприятен для общения и установления новых контактов.",
      "Время проявить творческие способности! Не бойтесь экспериментировать."
    ];
    
    return {
      sign: "Универсальный",
      date: new Date().toISOString().split('T')[0],
      text: horoscopes[Math.floor(Math.random() * horoscopes.length)],
      cached: false,
      source: "mock"
    };
  }

  getMockPremiumHoroscope(sign) {
    return {
      sign,
      date: new Date().toISOString().split('T')[0],
      premium_data: {
        detailed_forecast: "🧙‍♂️ Гномы шепчут особые секреты звезд для вас...",
        love_compatibility: "💕 Магическая энергия притягивает родственные души",
        career_advice: "💼 Золотые возможности ждут решительных действий",
        health_tips: "🌿 Лесные травы и чистая вода восстановят силы",
        lucky_numbers: [7, 13, 21],
        lucky_colors: "золотой",
        moon_influence: "🌙 Луна благословляет ваши начинания"
      }
    };
  }

  getMockDayCard() {
    const cards = [
      {title: "Гном-авантюрист", text: "Сегодня время для смелых решений! Не бойся рискнуть - фортуна любит храбрых."},
      {title: "Гном-повар", text: "День для заботы о своем теле и душе. Приготовь что-то вкусное или побалуй себя."},
      {title: "Гном-садовник", text: "Время посадить семена будущих успехов. Небольшие действия сегодня принесут большие плоды."},
      {title: "Гном-изобретатель", text: "Креативность зашкаливает сегодня! Придумай что-то новое или реши задачу нестандартным способом."}
    ];
    
    const card = cards[Math.floor(Math.random() * cards.length)];
    return {
      title: card.title,
      text: card.text,
      reused: false,
      date: new Date().toISOString().split('T')[0]
    };
  }

  getMockMoonData() {
    return {
      phase: "Растущая луна",
      illumination: 67,
      age: 8.5,
      distance: 384400,
      nextNewMoon: "2024-01-15",
      nextFullMoon: "2024-01-28"
    };
  }

  getMockCompatibility(sign1, sign2) {
    return {
      compatibility: Math.floor(Math.random() * 50) + 50, // 50-100%
      description: `${sign1} и ${sign2} имеют интересную совместимость! Звезды благоволят этому союзу.`,
      advice: "Доверьтесь интуиции и не бойтесь открыть сердце."
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Health check
  async healthCheck() {
    try {
      return await this.request('/health');
    } catch (error) {
      return { status: 'offline', error: error.message };
    }
  }

  // 🤖 TELEGRAM BOT API METHODS
  
  // Send message via Telegram Bot API
  async sendTelegramMessage(chatId, text, options = {}) {
    if (!this.telegramBotToken) {
      console.warn('⚠️ Telegram Bot Token не настроен');
      return { success: false, error: 'Bot token not configured' };
    }

    try {
      const response = await fetch(`${this.telegramApiUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
          ...options
        })
      });

      const data = await response.json();
      
      if (data.ok) {
        console.log('✅ Сообщение отправлено в Telegram:', chatId);
        return { success: true, data: data.result };
      } else {
        console.error('❌ Ошибка отправки в Telegram:', data.description);
        return { success: false, error: data.description };
      }
    } catch (error) {
      console.error('❌ Ошибка Telegram API:', error);
      return { success: false, error: error.message };
    }
  }

  // Send horoscope to user via Telegram
  async sendHoroscopeToTelegram(chatId, horoscopeData) {
    const message = `🔮 <b>Гороскоп для ${horoscopeData.sign}</b>

` +
                   `📅 <i>${horoscopeData.date}</i>

` +
                   `${horoscopeData.horoscope?.general || horoscopeData.text}

` +
                   `🎲 <b>Счастливое число:</b> ${horoscopeData.luckyNumber || 'нет данных'}
` +
                   `🎨 <b>Цвет дня:</b> ${horoscopeData.luckyColor || 'нет данных'}

` +
                   `🧙‍♂️ <i>От вашего ${horoscopeData.gnome || 'Астро Гнома'}</i>`;

    return this.sendTelegramMessage(chatId, message);
  }

  // Send daily card to user via Telegram
  async sendDayCardToTelegram(chatId, cardData) {
    const message = `🃏 <b>Карта дня</b>

` +
                   `🧙‍♂️ <b>${cardData.title}</b>

` +
                   `${cardData.text}

` +
                   `📅 <i>${cardData.date}</i>`;

    return this.sendTelegramMessage(chatId, message);
  }

  // Set webhook for bot
  async setWebhook(webhookUrl) {
    if (!this.telegramBotToken) {
      return { success: false, error: 'Bot token not configured' };
    }

    try {
      const response = await fetch(`${this.telegramApiUrl}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query']
        })
      });

      const data = await response.json();
      return { success: data.ok, data: data.result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get webhook info
  async getWebhookInfo() {
    if (!this.telegramBotToken) {
      return { success: false, error: 'Bot token not configured' };
    }

    try {
      const response = await fetch(`${this.telegramApiUrl}/getWebhookInfo`);
      const data = await response.json();
      return { success: data.ok, data: data.result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get bot info
  async getBotInfo() {
    if (!this.telegramBotToken) {
      return { success: false, error: 'Bot token not configured' };
    }

    try {
      const response = await fetch(`${this.telegramApiUrl}/getMe`);
      const data = await response.json();
      return { success: data.ok, data: data.result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Send notification to user about new features
  async sendFeatureNotification(chatId, featureName, description) {
    const message = `🎆 <b>Новая функция!</b>

` +
                   `✨ <b>${featureName}</b>

` +
                   `${description}

` +
                   `🚀 Откройте приложение, чтобы попробовать!`;

    return this.sendTelegramMessage(chatId, message);
  }

  // 📊 Analytics: Track user actions via bot
  async trackUserAction(userId, action, data = {}) {
    try {
      return await this.request('/api/analytics/track', {
        method: 'POST',
        body: JSON.stringify({
          user_id: userId,
          action: action,
          data: data,
          timestamp: new Date().toISOString(),
          source: 'telegram_bot'
        })
      });
    } catch (error) {
      console.error('❌ Ошибка трекинга:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ApiService();