// Продвинутая система кеширования с TTL, компрессией и надежной обработкой ошибок

// ===== КОНСТАНТЫ =====
const CACHE_PREFIX = 'gnome_cache_';
const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_TTL = 6 * 60 * 60 * 1000; // 6 часов
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 час

// TTL конфигурации для разных типов данных
const TTL_CONFIG = {
  MOON_DATA: 6 * 60, // 6 часов в минутах
  HOROSCOPE: 24 * 60, // 24 часа
  API_RESPONSE: 30, // 30 минут
  USER_PREFERENCES: 7 * 24 * 60, // 7 дней
  STATIC_DATA: 30 * 24 * 60 // 30 дней
};

// ===== УТИЛИТЫ =====
class CacheUtils {
  // Безопасное получение размера строки в байтах
  static getByteSize(str) {
    return new Blob([str]).size;
  }

  // Сжатие данных (простое base64)
  static compress(data) {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(encodeURIComponent(jsonString));
    } catch (error) {
      console.warn('Cache compression failed:', error);
      return JSON.stringify(data);
    }
  }

  // Распаковка данных
  static decompress(compressedData) {
    try {
      // Проверяем, сжаты ли данные
      if (typeof compressedData === 'string' && !compressedData.startsWith('{')) {
        const decompressed = decodeURIComponent(atob(compressedData));
        return JSON.parse(decompressed);
      }
      return JSON.parse(compressedData);
    } catch (error) {
      console.warn('Cache decompression failed:', error);
      return null;
    }
  }

  // Генерация ключа с учетом параметров
  static generateKey(type, identifier, params = {}) {
    const paramString = Object.keys(params).length > 0 
      ? '_' + Object.entries(params)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}-${v}`)
          .join('_')
      : '';
    
    return `${type}_${identifier}${paramString}`;
  }

  // Проверка доступности localStorage
  static isStorageAvailable() {
    try {
      const test = '__cache_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// ===== ОСНОВНОЙ КЛАСС КЕША =====
export class EnhancedCache {
  static _instance = null;
  static _cleanupInterval = null;
  static _storageAvailable = null;

  // Singleton pattern
  static getInstance() {
    if (!this._instance) {
      this._instance = new EnhancedCache();
    }
    return this._instance;
  }

  constructor() {
    this._initCleanup();
  }

  // Проверка доступности storage
  get storageAvailable() {
    if (EnhancedCache._storageAvailable === null) {
      EnhancedCache._storageAvailable = CacheUtils.isStorageAvailable();
    }
    return EnhancedCache._storageAvailable;
  }

  // Базовое сохранение в кеш
  saveToCache(key, data, options = {}) {
    if (!this.storageAvailable) {
      console.warn('localStorage недоступен');
      return false;
    }

    try {
      const {
        ttlMinutes = 360,
        compress = false,
        metadata = {}
      } = options;

      const now = Date.now();
      const item = {
        data: compress ? CacheUtils.compress(data) : data,
        timestamp: now,
        ttl: ttlMinutes * 60 * 1000,
        expiresAt: now + (ttlMinutes * 60 * 1000),
        compressed: compress,
        metadata: {
          version: '1.0',
          size: 0,
          ...metadata
        }
      };

      const serializedItem = JSON.stringify(item);
      item.metadata.size = CacheUtils.getByteSize(serializedItem);

      // Проверяем размер кеша перед сохранением
      if (this._checkCacheSize(serializedItem)) {
        const fullKey = `${CACHE_PREFIX}${key}`;
        localStorage.setItem(fullKey, serializedItem);
        
        console.log(`💾 Кеш сохранен: ${key} (${item.metadata.size} bytes, TTL: ${ttlMinutes} мин)`);
        return true;
      }

      return false;

    } catch (error) {
      console.error('Ошибка сохранения в кеш:', error);
      
      // Попытка освободить место
      if (error.name === 'QuotaExceededError') {
        this.cleanExpiredCache();
        console.log('🧹 Попытка освободить место в кеше...');
        
        // Повторная попытка после очистки
        try {
          const fullKey = `${CACHE_PREFIX}${key}`;
          localStorage.setItem(fullKey, JSON.stringify({
            data,
            timestamp: Date.now(),
            ttl: options.ttlMinutes * 60 * 1000 || DEFAULT_TTL,
            expiresAt: Date.now() + (options.ttlMinutes * 60 * 1000 || DEFAULT_TTL)
          }));
          return true;
        } catch (retryError) {
          console.error('Повторная попытка сохранения не удалась:', retryError);
        }
      }
      
      return false;
    }
  }

  // Загрузка из кеша
  loadFromCache(key, options = {}) {
    if (!this.storageAvailable) {
      return null;
    }

    try {
      const fullKey = `${CACHE_PREFIX}${key}`;
      const item = localStorage.getItem(fullKey);
      
      if (!item) {
        console.log(`📭 Кеш пуст: ${key}`);
        return null;
      }

      const parsedItem = JSON.parse(item);
      const { data, timestamp, ttl, expiresAt, compressed, metadata } = parsedItem;

      // Проверяем срок жизни
      const now = Date.now();
      const expired = expiresAt ? now > expiresAt : (now - timestamp > ttl);

      if (expired) {
        console.log(`⏰ Кеш истек: ${key}`);
        localStorage.removeItem(fullKey);
        return null;
      }

      // Логируем успешную загрузку
      const remainingMinutes = Math.round((expiresAt - now) / (1000 * 60));
      const size = metadata?.size ? `, ${metadata.size} bytes` : '';
      console.log(`📦 Кеш загружен: ${key} (${remainingMinutes} мин${size})`);

      // Возвращаем распакованные данные
      return compressed ? CacheUtils.decompress(data) : data;

    } catch (error) {
      console.error('Ошибка загрузки из кеша:', error);
      
      // Удаляем поврежденный элемент
      try {
        localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      } catch (removeError) {
        console.error('Не удалось удалить поврежденный элемент кеша:', removeError);
      }
      
      return null;
    }
  }

  // Проверка размера кеша
  _checkCacheSize(newItem) {
    try {
      const currentSize = this.getCurrentCacheSize();
      const newItemSize = CacheUtils.getByteSize(newItem);
      
      if (currentSize + newItemSize > MAX_CACHE_SIZE) {
        console.warn(`⚠️ Кеш близок к переполнению: ${Math.round(currentSize / 1024)}KB`);
        
        // Автоматическая очистка старых элементов
        this.cleanExpiredCache();
        this._cleanOldestItems(0.3); // Удаляем 30% старых элементов
        
        return this.getCurrentCacheSize() + newItemSize <= MAX_CACHE_SIZE;
      }
      
      return true;
    } catch (error) {
      console.error('Ошибка проверки размера кеша:', error);
      return true; // Разрешаем сохранение при ошибке проверки
    }
  }

  // Получение текущего размера кеша
  getCurrentCacheSize() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
      return keys.reduce((total, key) => {
        const item = localStorage.getItem(key);
        return total + CacheUtils.getByteSize(item);
      }, 0);
    } catch (error) {
      console.error('Ошибка расчета размера кеша:', error);
      return 0;
    }
  }

  // Очистка старых элементов
  _cleanOldestItems(percentage = 0.2) {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
      const items = keys.map(key => {
        const item = localStorage.getItem(key);
        try {
          const parsed = JSON.parse(item);
          return { key, timestamp: parsed.timestamp || 0 };
        } catch (error) {
          return { key, timestamp: 0 };
        }
      });

      // Сортируем по времени создания
      items.sort((a, b) => a.timestamp - b.timestamp);
      
      const itemsToRemove = Math.floor(items.length * percentage);
      let removed = 0;

      for (let i = 0; i < itemsToRemove && i < items.length; i++) {
        try {
          localStorage.removeItem(items[i].key);
          removed++;
        } catch (error) {
          console.error('Ошибка удаления старого элемента кеша:', error);
        }
      }

      console.log(`🧹 Удалено старых элементов: ${removed}`);
      return removed;

    } catch (error) {
      console.error('Ошибка очистки старых элементов:', error);
      return 0;
    }
  }

  // Инициализация автоочистки
  _initCleanup() {
    if (typeof window !== 'undefined' && !EnhancedCache._cleanupInterval) {
      // Начальная очистка через секунду
      setTimeout(() => {
        this.cleanExpiredCache();
      }, 1000);

      // Периодическая очистка
      EnhancedCache._cleanupInterval = setInterval(() => {
        this.cleanExpiredCache();
      }, CLEANUP_INTERVAL);
    }
  }

  // ===== СПЕЦИАЛИЗИРОВАННЫЕ МЕТОДЫ =====

  // Лунные данные
  saveMoonData(date, data) {
    const dateKey = date.toISOString().split('T')[0];
    const key = CacheUtils.generateKey('moon', dateKey);
    
    return this.saveToCache(key, data, {
      ttlMinutes: TTL_CONFIG.MOON_DATA,
      compress: true,
      metadata: {
        type: 'moon_data',
        date: dateKey
      }
    });
  }

  loadMoonData(date) {
    const dateKey = date.toISOString().split('T')[0];
    const key = CacheUtils.generateKey('moon', dateKey);
    return this.loadFromCache(key);
  }

  // Гороскопы
  saveHoroscope(zodiacSign, data) {
    const today = new Date().toISOString().split('T')[0];
    const key = CacheUtils.generateKey('horoscope', `${zodiacSign}_${today}`);
    
    return this.saveToCache(key, data, {
      ttlMinutes: TTL_CONFIG.HOROSCOPE,
      metadata: {
        type: 'horoscope',
        sign: zodiacSign,
        date: today
      }
    });
  }

  loadHoroscope(zodiacSign) {
    const today = new Date().toISOString().split('T')[0];
    const key = CacheUtils.generateKey('horoscope', `${zodiacSign}_${today}`);
    return this.loadFromCache(key);
  }

  // API ответы с параметрами
  saveApiResponse(endpoint, data, params = {}) {
    const key = CacheUtils.generateKey('api', endpoint, params);
    
    return this.saveToCache(key, data, {
      ttlMinutes: TTL_CONFIG.API_RESPONSE,
      compress: true,
      metadata: {
        type: 'api_response',
        endpoint,
        params
      }
    });
  }

  loadApiResponse(endpoint, params = {}) {
    const key = CacheUtils.generateKey('api', endpoint, params);
    return this.loadFromCache(key);
  }

  // ===== УТИЛИТЫ И СТАТИСТИКА =====

  // Расширенная статистика кеша
  getCacheStats() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
      let totalSize = 0;
      let activeItems = 0;
      let expiredItems = 0;
      const typeStats = {};

      keys.forEach(key => {
        const item = localStorage.getItem(key);
        totalSize += CacheUtils.getByteSize(item);

        try {
          const parsed = JSON.parse(item);
          const { expiresAt, timestamp, ttl, metadata } = parsed;
          const now = Date.now();
          const expired = expiresAt ? now > expiresAt : (now - timestamp > (ttl || DEFAULT_TTL));

          if (expired) {
            expiredItems++;
          } else {
            activeItems++;
          }

          // Статистика по типам
          const type = metadata?.type || 'unknown';
          if (!typeStats[type]) {
            typeStats[type] = { count: 0, size: 0 };
          }
          typeStats[type].count++;
          typeStats[type].size += metadata?.size || CacheUtils.getByteSize(item);

        } catch (e) {
          activeItems++;
        }
      });

      return {
        totalKeys: keys.length,
        activeItems,
        expiredItems,
        totalSizeKB: Math.round(totalSize / 1024),
        maxSizeKB: Math.round(MAX_CACHE_SIZE / 1024),
        usagePercentage: Math.round((totalSize / MAX_CACHE_SIZE) * 100),
        typeStats,
        cacheKeys: keys.map(key => key.replace(CACHE_PREFIX, '')),
        storageAvailable: this.storageAvailable
      };

    } catch (error) {
      console.error('Ошибка получения статистики кеша:', error);
      return null;
    }
  }

  // Очистка просроченных элементов
  cleanExpiredCache() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
      let cleaned = 0;

      keys.forEach(key => {
        const item = localStorage.getItem(key);
        
        try {
          const parsed = JSON.parse(item);
          const { expiresAt, timestamp, ttl } = parsed;
          const now = Date.now();
          const expired = expiresAt ? now > expiresAt : (now - timestamp > (ttl || DEFAULT_TTL));

          if (expired) {
            localStorage.removeItem(key);
            cleaned++;
          }

        } catch (e) {
          // Удаляем поврежденные элементы
          localStorage.removeItem(key);
          cleaned++;
        }
      });

      if (cleaned > 0) {
        console.log(`🧹 Очищено элементов кеша: ${cleaned}`);
      }
      
      return cleaned;

    } catch (error) {
      console.error('Ошибка очистки просроченного кеша:', error);
      return 0;
    }
  }

  // Полная очистка кеша
  clearAllCache() {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
      let cleared = 0;

      keys.forEach(key => {
        try {
          localStorage.removeItem(key);
          cleared++;
        } catch (error) {
          console.error('Ошибка удаления ключа кеша:', key, error);
        }
      });

      console.log(`🗑️ Очищен весь кеш: ${cleared} элементов`);
      return cleared;

    } catch (error) {
      console.error('Ошибка полной очистки кеша:', error);
      return 0;
    }
  }

  // Очистка по типу
  clearCacheByType(type) {
    try {
      const keys = Object.keys(localStorage).filter(key => key.startsWith(CACHE_PREFIX));
      let cleared = 0;

      keys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          const parsed = JSON.parse(item);
          
          if (parsed.metadata?.type === type) {
            localStorage.removeItem(key);
            cleared++;
          }
        } catch (error) {
          // Игнорируем ошибки парсинга
        }
      });

      console.log(`🗑️ Очищен кеш типа "${type}": ${cleared} элементов`);
      return cleared;

    } catch (error) {
      console.error('Ошибка очистки кеша по типу:', error);
      return 0;
    }
  }
}

// ===== ФУНКЦИИ ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ =====
const cache = EnhancedCache.getInstance();

export function saveToCache(key, data) {
  return cache.saveToCache(key, data, { ttlMinutes: 1440 }); // 24 часа по умолчанию
}

export function loadFromCache(key) {
  return cache.loadFromCache(key);
}

export function clearCache(key) {
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error('Ошибка очистки кеша:', error);
  }
}

export function saveWithTTL(key, data, ttlMinutes = 360) {
  return cache.saveToCache(key, data, { ttlMinutes });
}

export function loadWithTTL(key) {
  return cache.loadFromCache(key);
}

export function saveMoonData(date, data) {
  return cache.saveMoonData(date, data);
}

export function loadMoonData(date) {
  return cache.loadMoonData(date);
}

export function saveHoroscope(zodiacSign, data) {
  return cache.saveHoroscope(zodiacSign, data);
}

export function loadHoroscope(zodiacSign) {
  return cache.loadHoroscope(zodiacSign);
}

export function getCacheStats() {
  return cache.getCacheStats();
}

export function cleanExpiredCache() {
  return cache.cleanExpiredCache();
}

// ===== DEBUG И ИНИЦИАЛИЗАЦИЯ =====
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.cacheDebug = {
    stats: () => cache.getCacheStats(),
    clean: () => cache.cleanExpiredCache(),
    clear: () => cache.clearAllCache(),
    saveMoon: (date, data) => cache.saveMoonData(date, data),
    loadMoon: (date) => cache.loadMoonData(date),
    cache // Прямой доступ к экземпляру
  };
  
  console.log('🔧 Enhanced Cache debug tools доступны в window.cacheDebug');
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
  cleanExpiredCache,
  EnhancedCache
};
