const CACHE_PREFIX = 'gnome_cache_';

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
