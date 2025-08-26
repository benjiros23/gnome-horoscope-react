const TelegramBot = require('node-telegram-bot-api');

// Инициализируем бота (без polling для webhook)
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: false });

exports.handler = async function(event, context) {
  // Обрабатываем только POST запросы от Telegram
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    console.log('📥 Получен webhook от Telegram:', event.body);
    
    const update = JSON.parse(event.body);

    // Обрабатываем текстовые сообщения
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      const userId = update.message.from.id;
      const userName = update.message.from.first_name || 'Друг';

      console.log(`💬 Сообщение от ${userName} (${userId}): ${text}`);

      // Команда /start
      if (text === '/start') {
        const welcomeMessage = `🧙‍♂️ Привет, ${userName}! 

Добро пожаловать в **Гномий Гороскоп** - магический мир предсказаний от древних гномов!

🔮 Что умеет наш бот:
• Актуальные гороскопы на каждый день
• Лунный календарь и фазы луны  
• Карты дня с мудростью гномов
• Совместимость знаков зодиака
• Отслеживание Меркурия ретроград

🚀 Нажмите кнопку "Открыть приложение" чтобы начать!`;

        // Создаем inline клавиатуру с кнопкой запуска Web App
        const keyboard = {
          inline_keyboard: [[
            {
              text: '🌟 Открыть Гороскоп',
              web_app: { 
                url: 'https://gilded-blancmange-ecc392.netlify.app/' // ⚠️ ЗАМЕНИТЕ НА ВАШ URL
              }
            }
          ]]
        };

        await bot.sendMessage(chatId, welcomeMessage, {
          parse_mode: 'Markdown',
          reply_markup: keyboard
        });
      }
      
      // Команда /help
      else if (text === '/help') {
        const helpMessage = `📚 **Справка по Гномьему Гороскопу**

🔮 **Основные функции:**
• /start - Главное меню
• /horoscope - Быстрый гороскоп
• /card - Карта дня
• /help - Эта справка

💡 **Совет:** Используйте кнопку "Открыть приложение" для полного функционала!`;

        await bot.sendMessage(chatId, helpMessage, {
          parse_mode: 'Markdown'
        });
      }
      
      // Быстрый гороскоп
      else if (text === '/horoscope') {
        await bot.sendMessage(chatId, '🔮 Получаю ваш гороскоп...');
        
        // Здесь можно интегрировать с вашим API
        const horoscopeText = `🌟 **Гороскоп на сегодня**

Гном Мудрый видит особую энергию вокруг вас! Сегодня отличный день для новых начинаний и смелых решений.

✨ *Для полного персонального гороскопа откройте приложение!*`;

        await bot.sendMessage(chatId, horoscopeText, {
          parse_mode: 'Markdown'
        });
      }
      
      // Обработка других сообщений
      else {
        await bot.sendMessage(chatId, `🤔 Не понял команду "${text}"\n\nИспользуйте /help для справки или откройте приложение для полного функционала!`);
      }
    }

    // Возвращаем успешный ответ Telegram
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ok: true })
    };

  } catch (error) {
    console.error('❌ Ошибка webhook:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ok: false, 
        error: error.message 
      })
    };
  }
};
