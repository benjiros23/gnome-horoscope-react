// Обновленная система кеширования с поддержкой TTL (время жизни)
// Совместима с существующим кодом + новые возможности

const CACHE_PREFIX = 'gnome_cache_';

// ===== БАЗОВЫЕ ФУНКЦИИ (без изменений) =====

export function saveToCache(key, data) {
  try {
    const item = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  } catch (error) {
    console.error('Ошибка сохранения в кеш:', error);
  }
}

export function loadFromCache(key) {
  try {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!item) return null;
    
    const { data, timestamp } = JSON.parse(item);
    
    // Проверяем, не устарел ли кеш (24 часа)
    const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Ошибка загрузки из кеша:', error);
    return null;
  }
}

export function clearCache(key) {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error('Ошибка очистки кеша:', error);
  }
}

// ===== НОВЫЕ ФУНКЦИИ С TTL =====

// Сохранение с настраиваемым временем жизни
export function saveWithTTL(key, data, ttlMinutes = 360) {
  try {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
      expiresAt: Date.now() + (ttlMinutes * 60 * 1000)
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
    
    console.log(`💾 Кеш сохранен: ${key} (TTL: ${ttlMinutes} мин)`);
  } catch (error) {
    console.error('Ошибка сохранения в кеш с TTL:', error);
  }
}

// Загрузка с проверкой TTL
export function loadWithTTL(key) {
  try {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!item) {
      console.log(`📭 Кеш пуст: ${key}`);
      return null;
    }
    
    const parsedItem = JSON.parse(item);
    const { data, timestamp, ttl, expiresAt } = parsedItem;
    
    // Проверяем срок жизни
    const now = Date.now();
    const expired = expiresAt ? now > expiresAt : (now - timestamp > ttl);
    
    if (expired) {
      console.log(`⏰ Кеш истек: ${key}`);
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    const remainingMinutes = Math.round((expiresAt - now) / (1000 * 60));
    console.log(`📦 Кеш загружен: ${key} (осталось ${remainingMinutes} мин)`);
    
    return data;
  } catch (error) {
    console.error('Ошибка загрузки из кеша с TTL:', error);
    return null;
  }
}

// ===== СПЕЦИАЛИЗИРОВАННЫЕ ФУНКЦИИ ДЛЯ АСТРОЛОГИЧЕСКИХ ДАННЫХ =====

// Кеширование лунных данных (6 часов)
export function saveMoonData(date, data) {
  const dateKey = date.toISOString().split('T')[0];
  const key = `moon_${dateKey}`;
  saveWithTTL(key, data, 360); // 6 часов
}

export function loadMoonData(date) {
  const dateKey = date.toISOString().split('T')[0];
  const key = `moon_${dateKey}`;
  return loadWithTTL(key);
}

// Кеширование гороскопов (24 часа)
export function saveHoroscope(zodiacSign, data) {
  const today = new Date().toISOString().split('T')[0];
  const key = `horoscope_${zodiacSign}_${today}`;
  saveWithTTL(key, data, 1440); // 24 часа
}

export function loadHoroscope(zodiacSign) {
  const today = new Date().toISOString().split('T')[0];
  const key = `horoscope_${zodiacSign}_${today}`;
  return loadWithTTL(key);
}

// Получить статистику кеша
export function getCacheStats() {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    let totalSize = 0;
    let activeItems = 0;
    let expiredItems = 0;
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      totalSize += item.length;
      
      try {
        const { expiresAt, timestamp, ttl } = JSON.parse(item);
        const now = Date.now();
        const expired = expiresAt ? now > expiresAt : (now - timestamp > (ttl || 24 * 60 * 60 * 1000));
        
        if (expired) {
          expiredItems++;
        } else {
          activeItems++;
        }
      } catch (e) {
        activeItems++;
      }
    });
    
    return {
      totalKeys: keys.length,
      activeItems,
      expiredItems,
      totalSizeKB: Math.round(totalSize / 1024),
      cacheKeys: keys.map(key => key.replace(CACHE_PREFIX, ''))
    };
  } catch (error) {
    console.error('Ошибка получения статистики кеша:', error);
    return null;
  }
}

// Очистить просроченные элементы
export function cleanExpiredCache() {
  try {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
    let cleaned = 0;
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      try {
        const { expiresAt, timestamp, ttl } = JSON.parse(item);
        const now = Date.now();
        const expired = expiresAt ? now > expiresAt : (now - timestamp > (ttl || 24 * 60 * 60 * 1000));
        
        if (expired) {
          localStorage.removeItem(key);
          cleaned++;
        }
      } catch (e) {
        // Если не можем парсить, оставляем как есть
      }
    });
    
    console.log(`🧹 Очищено просроченных элементов: ${cleaned}`);
    return cleaned;
  } catch (error) {
    console.error('Ошибка очистки просроченного кеша:', error);
    return 0;
  }
}

// Автоматическая очистка при загрузке
const initCacheCleanup = () => {
  cleanExpiredCache();
  
  if (typeof window !== 'undefined') {
    setInterval(() => {
      cleanExpiredCache();
    }, 60 * 60 * 1000); // каждый час
  }
};

// Автоматический запуск очистки
if (typeof window !== 'undefined') {
  setTimeout(initCacheCleanup, 1000);
}

// Добавляем в window для отладки (только в development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.cacheDebug = {
    stats: getCacheStats,
    clean: cleanExpiredCache,
    saveMoon: saveMoonData,
    loadMoon: loadMoonData
  };
  
  console.log('🔧 Cache debug tools доступны в window.cacheDebug');
}

// Экспорт по умолчанию
export default {
  saveToCache,
  loadFromCache,
  clearCache,
  saveWithTTL,
  loadWithTTL,
  saveMoonData,
  loadMoonData,
  saveHoroscope,
  loadHoroscope,
  getCacheStats,
  cleanExpiredCache
};
