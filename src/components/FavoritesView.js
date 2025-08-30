import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import { 
  loadFavorites, 
  saveFavorites, 
  removeFavoriteItem, 
  clearAllFavorites 
} from '../enhanced_cache';

// ===== КОНФИГУРАЦИЯ И КОНСТАНТЫ =====
const FAVORITE_TYPES = {
  MOON: 'moon',
  HOROSCOPE: 'horoscope', 
  COMPATIBILITY: 'compatibility',
  DAY_CARD: 'day_card',
  NUMEROLOGY: 'numerology',
  ASTRO_EVENT: 'astro-event'
};

const TYPE_CONFIG = {
  [FAVORITE_TYPES.MOON]: {
    icon: '🌙',
    title: 'Лунные данные',
    color: '#4ECDC4'
  },
  [FAVORITE_TYPES.HOROSCOPE]: {
    icon: '⭐',
    title: 'Гороскоп',
    color: '#FFD93D'
  },
  [FAVORITE_TYPES.COMPATIBILITY]: {
    icon: '💕',
    title: 'Совместимость',
    color: '#FF6B6B'
  },
  [FAVORITE_TYPES.DAY_CARD]: {
    icon: '🃏',
    title: 'Карта дня',
    color: '#A29BFE'
  },
  [FAVORITE_TYPES.NUMEROLOGY]: {
    icon: '🔢',
    title: 'Нумерология',
    color: '#FD79A8'
  },
  [FAVORITE_TYPES.ASTRO_EVENT]: {
    icon: '🌌',
    title: 'Астрособытие',
    color: '#00B894'
  }
};

// ===== УТИЛИТЫ ДЛЯ РАБОТЫ С ИЗБРАННЫМ =====
class FavoritesManager {
  static groupByType(favorites) {
    return favorites.reduce((groups, item) => {
      const type = item.type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(item);
      return groups;
    }, {});
  }

  static sortByDate(favorites) {
    return [...favorites].sort((a, b) => {
      const dateA = new Date(a.addedAt || a.date);
      const dateB = new Date(b.addedAt || b.date);
      return dateB - dateA; // Новые сверху
    });
  }

  static filterBySearchTerm(favorites, searchTerm) {
    if (!searchTerm.trim()) return favorites;
    
    const term = searchTerm.toLowerCase();
    return favorites.filter(item => 
      item.title?.toLowerCase().includes(term) ||
      item.content?.toLowerCase().includes(term) ||
      TYPE_CONFIG[item.type]?.title.toLowerCase().includes(term)
    );
  }

  static exportToText(favorites) {
    const header = '📋 Мои астрологические избранные\n\n';
    const content = favorites.map(item => {
      const config = TYPE_CONFIG[item.type];
      return `${config?.icon || '⭐'} ${item.title}\n${item.content}\n📅 ${item.date}\n`;
    }).join('\n');
    
    return header + content;
  }
}

// ===== КОМПОНЕНТ ЭЛЕМЕНТА ИЗБРАННОГО =====
const FavoriteItem = React.memo(({ 
  item, 
  onRemove, 
  onShare, 
  onView,
  compact = false 
}) => {
  const { theme } = useTheme();
  const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.horoscope;

  const styles = useMemo(() => ({
    container: {
      background: compact 
        ? 'rgba(255,255,255,0.05)' 
        : `linear-gradient(135deg, ${config.color}15, ${config.color}08)`,
      border: `1px solid ${config.color}30`,
      borderLeft: `4px solid ${config.color}`,
      borderRadius: '12px',
      padding: compact ? '12px' : '16px',
      marginBottom: '12px',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    },

    header: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '8px'
    },

    typeIcon: {
      fontSize: compact ? '20px' : '24px',
      marginRight: '8px'
    },

    title: {
      fontSize: compact ? '14px' : '16px',
      fontWeight: '600',
      margin: '0 0 4px 0',
      color: theme.colors.text,
      flex: 1
    },

    content: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: theme.colors.textSecondary,
      marginBottom: '12px',
      display: '-webkit-box',
      WebkitLineClamp: compact ? 2 : 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },

    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: theme.colors.textSecondary
    },

    actions: {
      display: 'flex',
      gap: '8px'
    },

    actionButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      fontSize: '16px',
      transition: 'all 0.2s ease'
    }
  }), [theme, config, compact]);

  const handleMouseEnter = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = `0 8px 16px ${config.color}40`;
  }, [config.color]);

  const handleMouseLeave = useCallback((e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }, []);

  return (
    <div 
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
          <span style={styles.typeIcon}>{config.icon}</span>
          <div style={{ flex: 1 }}>
            <h4 style={styles.title}>{item.title}</h4>
            <div style={{ fontSize: '12px', color: config.color, fontWeight: '600' }}>
              {config.title}
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          {onView && (
            <button
              style={styles.actionButton}
              onClick={() => onView(item)}
              aria-label="Просмотреть"
              title="Просмотреть детали"
            >
              👁️
            </button>
          )}
          
          {onShare && (
            <button
              style={styles.actionButton}
              onClick={() => onShare(item)}
              aria-label="Поделиться"
              title="Поделиться"
            >
              📤
            </button>
          )}
          
          <button
            style={{
              ...styles.actionButton,
              color: theme.colors.error
            }}
            onClick={() => onRemove(item.id)}
            aria-label="Удалить"
            title="Удалить из избранного"
          >
            🗑️
          </button>
        </div>
      </div>

      <p style={styles.content}>{item.content}</p>

      <div style={styles.footer}>
        <span>📅 {item.date}</span>
        {item.addedAt && (
          <span>➕ {new Date(item.addedAt).toLocaleDateString('ru-RU')}</span>
        )}
      </div>
    </div>
  );
});

FavoriteItem.displayName = 'FavoriteItem';

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const FavoritesView = React.memo(({ 
  telegramApp,
  onNavigate
}) => {
  const { theme } = useTheme();
  
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // list, grid, compact
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },

    headerCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '24px',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    },

    searchContainer: {
      marginBottom: '20px'
    },

    searchInput: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: `2px solid ${theme.colors.border}`,
      borderRadius: '12px',
      background: theme.colors.surface || '#ffffff',
      color: theme.colors.text,
      transition: 'border-color 0.3s ease'
    },

    filtersContainer: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      alignItems: 'center'
    },

    filterButton: (isActive) => ({
      padding: '8px 16px',
      border: `2px solid ${isActive ? theme.colors.primary : theme.colors.border}`,
      borderRadius: '20px',
      background: isActive ? `${theme.colors.primary}20` : 'transparent',
      color: isActive ? theme.colors.primary : theme.colors.text,
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }),

    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: theme.colors.textSecondary
    },

    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: '12px',
      marginBottom: '20px'
    },

    statCard: {
      background: theme.colors.surface || 'rgba(255,255,255,0.05)',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: '12px',
      padding: '16px',
      textAlign: 'center'
    },

    actionsBar: {
      display: 'flex',
      gap: '12px',
      marginBottom: '20px',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }), [theme]);

  // Загрузка избранного
  useEffect(() => {
    const loadFavoritesList = async () => {
      setLoading(true);
      try {
        const savedFavorites = loadFavorites() || [];
        
        // Добавляем ID если отсутствует
        const favoritesWithIds = savedFavorites.map(item => ({
          ...item,
          id: item.id || `${item.type}_${Date.now()}_${Math.random()}`,
          addedAt: item.addedAt || new Date().toISOString()
        }));
        
        setFavorites(favoritesWithIds);
        console.log('✅ Избранное загружено:', favoritesWithIds.length, 'элементов');
      } catch (error) {
        console.error('❌ Ошибка загрузки избранного:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavoritesList();
  }, []);

  // Мемоизированная фильтрация и группировка
  const processedFavorites = useMemo(() => {
    let filtered = FavoritesManager.filterBySearchTerm(favorites, searchTerm);
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }
    
    return FavoritesManager.sortByDate(filtered);
  }, [favorites, searchTerm, selectedType]);

  const favoritesByType = useMemo(() => 
    FavoritesManager.groupByType(favorites), 
    [favorites]
  );

  // Обработчики событий
  const handleRemove = useCallback((itemId) => {
    try {
      removeFavoriteItem(itemId);
      setFavorites(prev => prev.filter(item => item.id !== itemId));
      
      telegramApp?.HapticFeedback?.notificationOccurred('success');
      console.log('✅ Элемент удален из избранного');
    } catch (error) {
      console.error('❌ Ошибка удаления:', error);
    }
  }, [telegramApp]);

  const handleClearAll = useCallback(() => {
    try {
      clearAllFavorites();
      setFavorites([]);
      setShowConfirmClear(false);
      
      telegramApp?.HapticFeedback?.notificationOccurred('success');
      console.log('✅ Все избранное очищено');
    } catch (error) {
      console.error('❌ Ошибка очистки:', error);
    }
  }, [telegramApp]);

  const handleShare = useCallback((item) => {
    const config = TYPE_CONFIG[item.type];
    const text = `${config?.icon || '⭐'} ${item.title}\n\n${item.content}\n\n📅 ${item.date}`;
    
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: text
      }).catch(console.error);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        telegramApp?.showAlert('Скопировано в буфер обмена');
      });
    }
  }, [telegramApp]);

  const handleExport = useCallback(() => {
    const exportText = FavoritesManager.exportToText(favorites);
    
    if (navigator.share) {
      navigator.share({
        title: 'Мое астрологическое избранное',
        text: exportText
      }).catch(console.error);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(exportText).then(() => {
        telegramApp?.showAlert('Экспорт скопирован в буфер обмена');
      });
    }
  }, [favorites, telegramApp]);

  const handleView = useCallback((item) => {
    // Навигация к соответствующему экрану
    const navigationMap = {
      [FAVORITE_TYPES.MOON]: 'moon',
      [FAVORITE_TYPES.HOROSCOPE]: 'horoscope',
      [FAVORITE_TYPES.COMPATIBILITY]: 'compatibility',
      [FAVORITE_TYPES.DAY_CARD]: 'cards',
      [FAVORITE_TYPES.NUMEROLOGY]: 'numerology',
      [FAVORITE_TYPES.ASTRO_EVENT]: 'events'
    };
    
    const screen = navigationMap[item.type];
    if (screen && onNavigate) {
      onNavigate(screen);
    }
  }, [onNavigate]);

  if (loading) {
    return (
      <div style={styles.container}>
        <Card>
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
            <h3>Загружаем избранное...</h3>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Заголовок */}
      <div style={styles.headerCard}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          fontSize: '100px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}>
          ⭐
        </div>
        
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700',
          margin: '0 0 8px 0'
        }}>
          ⭐ Избранное
        </h1>
        <p style={{ 
          fontSize: '16px', 
          opacity: 0.9,
          margin: 0
        }}>
          Ваши сохраненные астрологические моменты
        </p>
      </div>

      {/* Статистика */}
      {favorites.length > 0 && (
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: theme.colors.primary }}>
              {favorites.length}
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
              Всего
            </div>
          </div>
          
          {Object.entries(favoritesByType).map(([type, items]) => (
            <div key={type} style={styles.statCard}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>
                {TYPE_CONFIG[type]?.icon || '⭐'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>
                {items.length}
              </div>
              <div style={{ fontSize: '11px', color: theme.colors.textSecondary }}>
                {TYPE_CONFIG[type]?.title || 'Другое'}
              </div>
            </div>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <>
          {/* Поиск */}
          <Card style={styles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Поиск в избранном..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </Card>

          {/* Фильтры и действия */}
          <div style={styles.actionsBar}>
            <div style={styles.filtersContainer}>
              <button
                style={styles.filterButton(selectedType === 'all')}
                onClick={() => setSelectedType('all')}
              >
                Все
              </button>
              
              {Object.entries(favoritesByType).map(([type, items]) => (
                <button
                  key={type}
                  style={styles.filterButton(selectedType === type)}
                  onClick={() => setSelectedType(type)}
                >
                  {TYPE_CONFIG[type]?.icon || '⭐'} {items.length}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button
                variant="ghost"
                onClick={handleExport}
                style={{ fontSize: '14px', padding: '8px 12px' }}
              >
                📤 Экспорт
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => setShowConfirmClear(true)}
                style={{ fontSize: '14px', padding: '8px 12px', color: theme.colors.error }}
              >
                🗑️ Очистить
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Список избранного */}
      {processedFavorites.length > 0 ? (
        <Card title={`📋 Найдено: ${processedFavorites.length}`}>
          {processedFavorites.map(item => (
            <FavoriteItem
              key={item.id}
              item={item}
              onRemove={handleRemove}
              onShare={handleShare}
              onView={handleView}
              compact={viewMode === 'compact'}
            />
          ))}
        </Card>
      ) : favorites.length > 0 ? (
        <Card>
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        </Card>
      ) : (
        <Card>
          <div style={styles.emptyState}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
            <h3>Избранное пусто</h3>
            <p style={{ marginBottom: '20px' }}>
              Добавляйте интересные предсказания, карты и расчеты в избранное
            </p>
            {onNavigate && (
              <Button onClick={() => onNavigate('/')}>
                🏠 На главную
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Модальное подтверждение очистки */}
      {showConfirmClear && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <Card style={{ maxWidth: '400px', margin: '20px' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
              🗑️ Очистить избранное?
            </h3>
            <p style={{ 
              textAlign: 'center', 
              marginBottom: '24px',
              color: theme.colors.textSecondary 
            }}>
              Это действие нельзя отменить. Все {favorites.length} элементов будут удалены.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center' 
            }}>
              <Button
                variant="ghost"
                onClick={() => setShowConfirmClear(false)}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleClearAll}
                style={{ background: theme.colors.error }}
              >
                🗑️ Удалить все
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
});

FavoritesView.displayName = 'FavoritesView';

export default FavoritesView;
