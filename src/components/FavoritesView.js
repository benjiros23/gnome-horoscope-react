// src/components/FavoritesView.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';


const FavoritesView = ({ onBack, onNavigate }) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Конфигурация типов избранного
  const FAVORITE_TYPES = {
    MOON: 'moon',
    HOROSCOPE: 'horoscope', 
    COMPATIBILITY: 'compatibility',
    DAY_CARD: 'day-card',
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
      icon: '🔮',
      title: 'Гороскоп',
      color: theme.colors.primary
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

  // Утилиты для работы с избранным
  const FavoritesManager = {
    load: () => {
      try {
        const saved = localStorage.getItem('gnome-favorites');
        return saved ? JSON.parse(saved) : [];
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
        return [];
      }
    },

    save: (favorites) => {
      try {
        localStorage.setItem('gnome-favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Ошибка сохранения избранного:', error);
      }
    },

    groupByType: (favorites) => {
      return favorites.reduce((groups, item) => {
        const type = item.type || 'other';
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(item);
        return groups;
      }, {});
    },

    sortByDate: (favorites) => {
      return [...favorites].sort((a, b) => {
        const dateA = new Date(a.addedAt || a.date || Date.now());
        const dateB = new Date(b.addedAt || b.date || Date.now());
        return dateB - dateA;
      });
    },

    filterBySearchTerm: (favorites, searchTerm) => {
      if (!searchTerm.trim()) return favorites;
      
      const term = searchTerm.toLowerCase();
      return favorites.filter(item => 
        item.title?.toLowerCase().includes(term) ||
        item.content?.toLowerCase().includes(term) ||
        TYPE_CONFIG[item.type]?.title.toLowerCase().includes(term)
      );
    },

    exportToText: (favorites) => {
      const header = '⭐ Мои астрологические избранные\n\n';
      const content = favorites.map(item => {
        const config = TYPE_CONFIG[item.type];
        return `${config?.icon || '⭐'} ${item.title}\n${item.content}\n📅 ${item.date}\n`;
      }).join('\n');
      
      return header + content;
    }
  };

  // Стили компонента
  const favoritesStyles = {
    container: {
      padding: theme.spacing.lg,
      maxWidth: '900px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 120px)',
      position: 'relative'
    },

    headerCard: {
      background: createGradientStyle(['#667eea', '#764ba2'], '135deg').background,
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: theme.spacing.xl,
      position: 'relative',
      overflow: 'hidden',
      padding: theme.spacing.xl
    },

    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.1)',
      zIndex: 1
    },

    headerDecoration: {
      position: 'absolute',
      top: '-30px',
      right: '-30px',
      fontSize: '100px',
      opacity: 0.1,
      pointerEvents: 'none',
      zIndex: 1
    },

    headerContent: {
      position: 'relative',
      zIndex: 2
    },

    title: {
      ...styles.heading,
      fontSize: theme.typography.sizes.title,
      margin: '0 0 8px 0',
      fontWeight: theme.typography.weights.bold,
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
    },

    subtitle: {
      fontSize: theme.typography.sizes.md,
      opacity: 0.9,
      margin: 0,
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
    },

    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl
    },

    statCard: {
      padding: theme.spacing.md,
      textAlign: 'center',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`
    },

    searchContainer: {
      marginBottom: theme.spacing.lg
    },

    searchInput: {
      width: '100%',
      padding: theme.spacing.md,
      fontSize: theme.typography.sizes.md,
      border: `2px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      outline: 'none',
      transition: `border-color ${theme.animations.duration.fast} ease`
    },

    filtersContainer: {
      display: 'flex',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      flexWrap: 'wrap',
      alignItems: 'center'
    },

    filterButton: {
      padding: `${theme.spacing.xs} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.xl,
      border: '2px solid',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      transition: `all ${theme.animations.duration.fast} ease`,
      outline: 'none'
    },

    actionsBar: {
      display: 'flex',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    favoriteItem: {
      marginBottom: theme.spacing.md,
      position: 'relative',
      overflow: 'hidden',
      transition: `all ${theme.animations.duration.normal} ease`
    },

    itemHeader: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.sm
    },

    itemIcon: {
      fontSize: '1.5rem',
      marginRight: theme.spacing.sm,
      flexShrink: 0
    },

    itemInfo: {
      flex: 1
    },

    itemTitle: {
      ...styles.heading,
      fontSize: theme.typography.sizes.md,
      margin: '0 0 4px 0',
      color: theme.colors.text
    },

    itemType: {
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.semibold,
      marginBottom: theme.spacing.xs
    },

    itemContent: {
      fontSize: theme.typography.sizes.sm,
      lineHeight: 1.5,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },

    itemFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary
    },

    itemActions: {
      display: 'flex',
      gap: theme.spacing.xs
    },

    actionButton: {
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      fontSize: '1rem',
      transition: `all ${theme.animations.duration.fast} ease`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    emptyState: {
      textAlign: 'center',
      padding: theme.spacing.xxl,
      color: theme.colors.textSecondary
    },

    emptyIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.lg
    },

    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal,
      padding: theme.spacing.lg
    },

    modalContent: {
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center'
    }
  };

  // Добавляем CSS анимации
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const existingStyle = document.getElementById('favorites-animations');
      if (!existingStyle) {
        const style = document.createElement('style');
        style.id = 'favorites-animations';
        style.textContent = `
          @keyframes slideInUp {
            0% { 
              opacity: 0; 
              transform: translateY(20px); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Загрузка избранного
  useEffect(() => {
    const loadFavoritesList = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500)); // Имитация загрузки
        
        const savedFavorites = FavoritesManager.load();
        
        // Добавляем ID если отсутствует
        const favoritesWithIds = savedFavorites.map(item => ({
          ...item,
          id: item.id || `${item.type}_${Date.now()}_${Math.random()}`,
          addedAt: item.addedAt || new Date().toISOString()
        }));
        
        setFavorites(favoritesWithIds);
        
        // Сохраняем с ID
        if (favoritesWithIds.length !== savedFavorites.length) {
          FavoritesManager.save(favoritesWithIds);
        }
        
      } catch (error) {
        console.error('Ошибка загрузки избранного:', error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavoritesList();
  }, []);

  // Мемоизированная обработка данных
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
      const newFavorites = favorites.filter(item => item.id !== itemId);
      setFavorites(newFavorites);
      FavoritesManager.save(newFavorites);
      
      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      
    } catch (error) {
      console.error('Ошибка удаления:', error);
    }
  }, [favorites]);

  const handleClearAll = useCallback(() => {
    try {
      setFavorites([]);
      FavoritesManager.save([]);
      setShowConfirmClear(false);
      
      // Haptic feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
      
    } catch (error) {
      console.error('Ошибка очистки:', error);
    }
  }, []);

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
        if (window.Telegram?.WebApp?.showAlert) {
          window.Telegram.WebApp.showAlert('Скопировано в буфер обмена! 📋');
        }
      });
    }
  }, []);

  const handleExport = useCallback(() => {
    const exportText = FavoritesManager.exportToText(favorites);
    
    if (navigator.share) {
      navigator.share({
        title: 'Мое астрологическое избранное',
        text: exportText
      }).catch(console.error);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(exportText).then(() => {
        if (window.Telegram?.WebApp?.showAlert) {
          window.Telegram.WebApp.showAlert('Экспорт скопирован в буфер обмена! 📤');
        }
      });
    }
  }, [favorites]);

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

  // Компонент элемента избранного
  const FavoriteItem = useCallback(({ item }) => {
    const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.horoscope;

    return (
      <Card 
        hoverable
        style={{
          ...favoritesStyles.favoriteItem,
          background: `linear-gradient(135deg, ${config.color}15, ${config.color}08)`,
          borderLeft: `4px solid ${config.color}`
        }}
      >
        <div style={favoritesStyles.itemHeader}>
          <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
            <span style={{
              ...favoritesStyles.itemIcon,
              color: config.color
            }}>
              {config.icon}
            </span>
            <div style={favoritesStyles.itemInfo}>
              <h4 style={favoritesStyles.itemTitle}>{item.title}</h4>
              <div style={{
                ...favoritesStyles.itemType,
                color: config.color
              }}>
                {config.title}
              </div>
            </div>
          </div>
          
          <div style={favoritesStyles.itemActions}>
            <button
              style={{
                ...favoritesStyles.actionButton,
                color: theme.colors.textSecondary
              }}
              onClick={() => handleView(item)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${theme.colors.primary}20`;
                e.target.style.color = theme.colors.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = theme.colors.textSecondary;
              }}
              title="Просмотреть"
            >
              👁️
            </button>
            
            <button
              style={{
                ...favoritesStyles.actionButton,
                color: theme.colors.textSecondary
              }}
              onClick={() => handleShare(item)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${theme.colors.secondary}20`;
                e.target.style.color = theme.colors.secondary;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = theme.colors.textSecondary;
              }}
              title="Поделиться"
            >
              📤
            </button>
            
            <button
              style={{
                ...favoritesStyles.actionButton,
                color: theme.colors.danger
              }}
              onClick={() => handleRemove(item.id)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${theme.colors.danger}20`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>

        <p style={favoritesStyles.itemContent}>
          {item.content}
        </p>

        <div style={favoritesStyles.itemFooter}>
          <span>📅 {item.date}</span>
          {item.addedAt && (
            <span>➕ {new Date(item.addedAt).toLocaleDateString('ru-RU')}</span>
          )}
        </div>
      </Card>
    );
  }, [theme, favoritesStyles, TYPE_CONFIG, handleView, handleShare, handleRemove]);

  if (loading) {
    return (
      <div style={favoritesStyles.container}>
        
        
        <div style={favoritesStyles.emptyState}>
          <div style={favoritesStyles.emptyIcon}>⭐</div>
          <h3 style={{ color: theme.colors.primary }}>Загружаем избранное...</h3>
          <p>Собираем ваши астрологические сокровища</p>
        </div>
      </div>
    );
  }

  return (
    <div style={favoritesStyles.container}>
      
      
      {/* Заголовок */}
      <Card variant="gradient" padding="none" style={{ marginBottom: theme.spacing.xl }}>
        <div style={favoritesStyles.headerCard}>
          <div style={favoritesStyles.headerOverlay} />
          <div style={favoritesStyles.headerDecoration}>⭐</div>
          
          <div style={favoritesStyles.headerContent}>
            <h1 style={favoritesStyles.title}>
              ⭐ Избранное
            </h1>
            <p style={favoritesStyles.subtitle}>
              Ваши сохраненные астрологические моменты
            </p>
          </div>
        </div>
      </Card>

      {/* Статистика */}
      {favorites.length > 0 && (
        <div 
          style={{
            ...favoritesStyles.statsContainer,
            animation: 'slideInUp 0.6s ease-out'
          }}
        >
          <Card padding="md" style={favoritesStyles.statCard}>
            <div style={{ 
              fontSize: theme.typography.sizes.xl, 
              fontWeight: theme.typography.weights.bold, 
              color: theme.colors.primary,
              marginBottom: theme.spacing.xs
            }}>
              {favorites.length}
            </div>
            <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary }}>
              Всего
            </div>
          </Card>
          
          {Object.entries(favoritesByType).slice(0, 4).map(([type, items]) => (
            <Card key={type} padding="md" style={favoritesStyles.statCard}>
              <div style={{ 
                fontSize: theme.typography.sizes.lg, 
                marginBottom: theme.spacing.xs,
                color: TYPE_CONFIG[type]?.color
              }}>
                {TYPE_CONFIG[type]?.icon || '⭐'}
              </div>
              <div style={{ 
                fontSize: theme.typography.sizes.md, 
                fontWeight: theme.typography.weights.semibold,
                marginBottom: theme.spacing.xs
              }}>
                {items.length}
              </div>
              <div style={{ fontSize: theme.typography.sizes.xs, color: theme.colors.textSecondary }}>
                {TYPE_CONFIG[type]?.title || 'Другое'}
              </div>
            </Card>
          ))}
        </div>
      )}

      {favorites.length > 0 && (
        <>
          {/* Поиск */}
          <Card padding="md" style={favoritesStyles.searchContainer}>
            <input
              type="text"
              placeholder="🔍 Поиск в избранном..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={favoritesStyles.searchInput}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border;
              }}
            />
          </Card>

          {/* Фильтры и действия */}
          <div style={favoritesStyles.actionsBar}>
            <div style={favoritesStyles.filtersContainer}>
              <button
                style={{
                  ...favoritesStyles.filterButton,
                  borderColor: selectedType === 'all' ? theme.colors.primary : theme.colors.border,
                  color: selectedType === 'all' ? theme.colors.primary : theme.colors.textSecondary,
                  backgroundColor: selectedType === 'all' ? `${theme.colors.primary}20` : 'transparent'
                }}
                onClick={() => setSelectedType('all')}
              >
                Все
              </button>
              
              {Object.entries(favoritesByType).map(([type, items]) => (
                <button
                  key={type}
                  style={{
                    ...favoritesStyles.filterButton,
                    borderColor: selectedType === type ? TYPE_CONFIG[type]?.color : theme.colors.border,
                    color: selectedType === type ? TYPE_CONFIG[type]?.color : theme.colors.textSecondary,
                    backgroundColor: selectedType === type ? `${TYPE_CONFIG[type]?.color}20` : 'transparent'
                  }}
                  onClick={() => setSelectedType(type)}
                >
                  {TYPE_CONFIG[type]?.icon || '⭐'} {items.length}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: theme.spacing.sm }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                icon="📤"
              >
                Экспорт
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmClear(true)}
                icon="🗑️"
                style={{ 
                  borderColor: theme.colors.danger,
                  color: theme.colors.danger 
                }}
              >
                Очистить
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Список избранного */}
      {processedFavorites.length > 0 ? (
        <div style={{ 
          animation: 'slideInUp 0.6s ease-out 0.3s',
          animationFillMode: 'both'
        }}>
          <h3 style={{
            color: theme.colors.text,
            marginBottom: theme.spacing.lg,
            fontSize: theme.typography.sizes.lg
          }}>
            📋 Найдено: {processedFavorites.length}
          </h3>
          
          {processedFavorites.map((item, index) => (
            <div
              key={item.id}
              style={{
                animation: `slideInUp 0.6s ease-out ${0.1 * index}s`,
                animationFillMode: 'both'
              }}
            >
              <FavoriteItem item={item} />
            </div>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <Card padding="xl">
          <div style={favoritesStyles.emptyState}>
            <div style={favoritesStyles.emptyIcon}>🔍</div>
            <h3 style={{ color: theme.colors.text }}>Ничего не найдено</h3>
            <p>Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        </Card>
      ) : (
        <Card padding="xl">
          <div style={favoritesStyles.emptyState}>
            <div style={favoritesStyles.emptyIcon}>⭐</div>
            <h3 style={{ color: theme.colors.text }}>Избранное пусто</h3>
            <p style={{ marginBottom: theme.spacing.lg }}>
              Добавляйте интересные предсказания, карты и расчеты в избранное
            </p>
            {onNavigate && (
              <Button 
                variant="primary" 
                onClick={() => onNavigate('zodiac-selector')}
                icon="🏠"
              >
                На главную
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Модальное подтверждение очистки */}
      {showConfirmClear && (
        <div style={favoritesStyles.modalOverlay}>
          <Card padding="xl" style={favoritesStyles.modalContent}>
            <h3 style={{ 
              textAlign: 'center', 
              marginBottom: theme.spacing.md,
              color: theme.colors.text
            }}>
              🗑️ Очистить избранное?
            </h3>
            <p style={{ 
              textAlign: 'center', 
              marginBottom: theme.spacing.xl,
              color: theme.colors.textSecondary 
            }}>
              Это действие нельзя отменить. Все {favorites.length} элементов будут удалены.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: theme.spacing.md, 
              justifyContent: 'center' 
            }}>
              <Button
                variant="outline"
                onClick={() => setShowConfirmClear(false)}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleClearAll}
                style={{ 
                  backgroundColor: theme.colors.danger,
                  borderColor: theme.colors.danger
                }}
                icon="🗑️"
              >
                Удалить все
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FavoritesView;
