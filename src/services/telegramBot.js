// src/services/telegramBot.js
import apiService from './api';

class TelegramBotService {
  constructor() {
    this.botToken = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
    this.botUsername = process.env.REACT_APP_TELEGRAM_BOT_USERNAME;
    this.webAppUrl = process.env.REACT_APP_TELEGRAM_WEBAPP_URL;
    this.isInitialized = false;
  }

  // 🚀 Initialize bot integration
  async initialize() {
    if (!this.botToken) {
      console.warn('⚠️ Telegram Bot Token не настроен');
      return false;
    }

    try {
      const botInfo = await apiService.getBotInfo();
      if (botInfo.success) {
        console.log('✅ Telegram Bot инициализирован:', botInfo.data);
        this.isInitialized = true;
        return true;
      } else {
        console.error('❌ Ошибка инициализации бота:', botInfo.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка подключения к Telegram Bot API:', error);
      return false;
    }
  }

  // 📱 Get current Telegram user from WebApp
  getCurrentTelegramUser() {
    const tg = window.Telegram?.WebApp;
    if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
      return tg.initDataUnsafe.user;
    }
    return null;
  }

  // 📤 Send current horoscope to user's Telegram
  async shareHoroscopeToTelegram(horoscopeData) {
    const user = this.getCurrentTelegramUser();
    if (!user) {
      console.warn('⚠️ Пользователь Telegram не найден');
      return false;
    }

    try {
      const result = await apiService.sendHoroscopeToTelegram(user.id, horoscopeData);
      
      if (result.success) {
        // Show success feedback in WebApp
        this.showSuccessFeedback('📤 Гороскоп отправлен в чат!');
        
        // Track the action
        await apiService.trackUserAction(user.id, 'horoscope_shared', {
          sign: horoscopeData.sign,
          method: 'telegram'
        });
        
        return true;
      } else {
        this.showErrorFeedback('❌ Ошибка отправки гороскопа');
        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка отправки гороскопа:', error);
      this.showErrorFeedback('❌ Ошибка отправки');
      return false;
    }
  }

  // 🃏 Send day card to user's Telegram
  async shareDayCardToTelegram(cardData) {
    const user = this.getCurrentTelegramUser();
    if (!user) {
      console.warn('⚠️ Пользователь Telegram не найден');
      return false;
    }

    try {
      const result = await apiService.sendDayCardToTelegram(user.id, cardData);
      
      if (result.success) {
        this.showSuccessFeedback('📤 Карта дня отправлена в чат!');
        
        await apiService.trackUserAction(user.id, 'day_card_shared', {
          card_title: cardData.title,
          method: 'telegram'
        });
        
        return true;
      } else {
        this.showErrorFeedback('❌ Ошибка отправки карты');
        return false;
      }
    } catch (error) {
      console.error('❌ Ошибка отправки карты:', error);
      this.showErrorFeedback('❌ Ошибка отправки');
      return false;
    }
  }

  // 🔔 Set up daily horoscope notifications
  async setupDailyNotifications(sign, time = '09:00') {
    const user = this.getCurrentTelegramUser();
    if (!user) {
      return false;
    }

    try {
      // Save notification settings to backend
      const result = await apiService.request('/api/notifications/setup', {
        method: 'POST',
        body: JSON.stringify({
          user_id: user.id,
          notification_type: 'daily_horoscope',
          zodiac_sign: sign,
          time: time,
          enabled: true
        })
      });

      if (result.success) {
        this.showSuccessFeedback('🔔 Уведомления настроены!');
        
        // Send confirmation message to user
        await apiService.sendTelegramMessage(
          user.id,
          `🔔 <b>Уведомления настроены!</b>\n\n` +
          `Теперь каждый день в ${time} вы будете получать персональный гороскоп для знака ${sign}.\n\n` +
          `Чтобы изменить настройки, используйте команду /settings в боте.`
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Ошибка настройки уведомлений:', error);
      return false;
    }
  }

  // 📊 Get user statistics from bot
  async getUserStatistics() {
    const user = this.getCurrentTelegramUser();
    if (!user) {
      return null;
    }

    try {
      const stats = await apiService.getUserAnalytics(user.id);
      return stats;
    } catch (error) {
      console.error('❌ Ошибка получения статистики:', error);
      return null;
    }
  }

  // 🎯 Share app with friends
  async shareApp() {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      return false;
    }

    try {
      const shareText = `🔮 Астро Гном - персональные гороскопы от мудрых гномов!\\n\\n` +
                       `✨ Получайте точные предсказания каждый день\\n` +
                       `🎴 Карты дня от гномов-мудрецов\\n` +
                       `💫 Совместимость со всеми знаками\\n\\n` +
                       `Попробуй прямо сейчас!`;

      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(this.webAppUrl)}&text=${encodeURIComponent(shareText)}`;
      
      // Open share dialog
      if (tg.openTelegramLink) {
        tg.openTelegramLink(shareUrl);
      } else if (tg.openLink) {
        tg.openLink(shareUrl);
      } else {
        window.open(shareUrl, '_blank');
      }

      // Track sharing action
      const user = this.getCurrentTelegramUser();
      if (user) {
        await apiService.trackUserAction(user.id, 'app_shared', {
          method: 'telegram_share'
        });
      }

      return true;
    } catch (error) {
      console.error('❌ Ошибка шеринга:', error);
      return false;
    }
  }

  // 💬 Open bot chat
  openBotChat() {
    if (!this.botUsername) {
      console.warn('⚠️ Bot username не настроен');
      return false;
    }

    const tg = window.Telegram?.WebApp;
    const botUrl = `https://t.me/${this.botUsername}`;
    
    try {
      if (tg && tg.openTelegramLink) {
        tg.openTelegramLink(botUrl);
      } else if (tg && tg.openLink) {
        tg.openLink(botUrl);
      } else {
        window.open(botUrl, '_blank');
      }
      return true;
    } catch (error) {
      console.error('❌ Ошибка открытия бота:', error);
      return false;
    }
  }

  // 🎉 Show success feedback in WebApp
  showSuccessFeedback(message) {
    const tg = window.Telegram?.WebApp;
    
    // Haptic feedback
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
      try {
        tg.HapticFeedback.notificationOccurred('success');
      } catch (e) {
        // Ignore version errors
      }
    }

    // Show popup if supported
    if (tg?.showPopup && typeof tg.showPopup === 'function') {
      try {
        tg.showPopup({
          title: 'Успешно!',
          message: message,
          buttons: [{type: 'ok'}]
        });
      } catch (e) {
        // Fallback to alert
        if (tg?.showAlert) {
          tg.showAlert(message);
        }
      }
    } else if (tg?.showAlert) {
      tg.showAlert(message);
    }
  }

  // ❌ Show error feedback in WebApp
  showErrorFeedback(message) {
    const tg = window.Telegram?.WebApp;
    
    // Haptic feedback
    if (tg?.HapticFeedback && typeof tg.HapticFeedback.notificationOccurred === 'function') {
      try {
        tg.HapticFeedback.notificationOccurred('error');
      } catch (e) {
        // Ignore version errors
      }
    }

    // Show popup if supported
    if (tg?.showPopup && typeof tg.showPopup === 'function') {
      try {
        tg.showPopup({
          title: 'Ошибка',
          message: message,
          buttons: [{type: 'ok'}]
        });
      } catch (e) {
        // Fallback to alert
        if (tg?.showAlert) {
          tg.showAlert(message);
        }
      }
    } else if (tg?.showAlert) {
      tg.showAlert(message);
    }
  }

  // 🔧 Debug: Test bot connection
  async testBotConnection() {
    console.log('🔧 Тестирование подключения к боту...');
    
    if (!this.botToken) {
      console.error('❌ Bot token не настроен');
      return false;
    }

    try {
      const botInfo = await apiService.getBotInfo();
      console.log('🤖 Информация о боте:', botInfo);

      const webhookInfo = await apiService.getWebhookInfo();
      console.log('🌐 Информация о webhook:', webhookInfo);

      return true;
    } catch (error) {
      console.error('❌ Ошибка тестирования бота:', error);
      return false;
    }
  }
}

export default new TelegramBotService();