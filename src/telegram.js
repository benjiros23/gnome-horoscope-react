// src/telegram.js
export const initTelegram = () => {
  if (!window.Telegram?.WebApp) {
    console.log('📱 Telegram WebApp недоступен (запущено в браузере)');
    return;
  }

  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Применяем тему
  const root = document.documentElement;
  const { bg_color, text_color, hint_color } = tg.themeParams || {};
  if (bg_color) root.style.setProperty('--bg-main', bg_color);
  if (text_color) root.style.setProperty('--text-primary', text_color);
  if (hint_color) root.style.setProperty('--text-muted', hint_color);

  console.log('🎉 Telegram WebApp готов к работе!');
};
