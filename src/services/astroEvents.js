const dayjs = require('dayjs');
const { getMoonIllumination } = require('lunarphase-js');
const cron = require('node-cron');

// внутренний кэш
let events = [];

/* ---------- генерация полнолуний / новолуний на 30 дней ---------- */
function generateLunarEvents(daysAhead = 30) {
  const result = [];
  const today = dayjs().startOf('day');

  for (let i = 0; i < daysAhead; i++) {
    const d = today.add(i, 'day');
    const illum = getMoonIllumination(d.toDate());

    if (Math.abs(illum.phase - 0) < 0.02) {
      // новолуние
      result.push({
        id: `nm-${d.format('YYYY-MM-DD')}`,
        type: 'new_moon',
        exactDateUTC: d.toISOString(),
        title: '🌑 Новолуние',
        shortText: 'Время планировать новое',
      });
    } else if (Math.abs(illum.phase - 0.5) < 0.02) {
      // полнолуние
      result.push({
        id: `fm-${d.format('YYYY-MM-DD')}`,
        type: 'full_moon',
        exactDateUTC: d.toISOString(),
        title: '🌕 Полнолуние',
        shortText: 'Энергетический пик, завершаем дела',
      });
    }
  }
  return result;
}

/* ---------- публичный геттер ---------- */
function getEvents(range = 30) {
  // отфильтруем кэш по диапазону
  const toDate = dayjs().add(range, 'day');
  return events.filter(e => dayjs(e.exactDateUTC).isBefore(toDate));
}

/* ---------- обновляем кеш раз в сутки ---------- */
function refreshCache() {
  events = generateLunarEvents(60); // держим запас 60 дней вперёд
  console.log(`🔭 AstroEvents обновлены. Всего: ${events.length}`);
}

// генерируем сразу при старте
refreshCache();

// расписание: каждый день в 03:05 UTC
cron.schedule('5 3 * * *', refreshCache);

module.exports = { getEvents };
