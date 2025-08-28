import React, { useState, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const FunctionCarousel = ({ items, onItemClick }) => {
  const { theme } = useTheme();

  const getStyles = () => ({
    container: {
      padding: '20px 0',
      maxWidth: '100%',
      margin: '0 auto'
    },
    
    title: {
      textAlign: 'center',
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: '600',
      color: theme.card.color
    },
    
    carousel: {
      ...theme.card,
      padding: '20px 16px',
      margin: '0',
      borderRadius: '16px',
      position: 'relative'
    },
    
    scrollContainer: {
      display: 'flex',
      gap: '12px',
      overflowX: 'auto',
      overflowY: 'hidden',
      paddingBottom: '8px',
      paddingTop: '4px',
      scrollbarWidth: 'thin',
      scrollbarColor: `${theme.colors.primary}40 transparent`,
      WebkitOverflowScrolling: 'touch',
      scrollBehavior: 'smooth',
      
      // Кастомный скроллбар для Webkit
      '::-webkit-scrollbar': {
        height: '6px'
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent'
      },
      '::-webkit-scrollbar-thumb': {
        background: `${theme.colors.primary}60`,
        borderRadius: '3px'
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: theme.colors.primary
      }
    },
    
    item: {
      minWidth: '130px',              // Фиксированная ширина
      maxWidth: '130px',              // Максимальная ширина
      height: '140px',                // Фиксированная высота
      padding: '16px 12px',
      background: theme.name === 'facebook' 
        ? '#FFFFFF'
        : theme.name === 'dark' 
          ? '#495057'
          : '#FFFFFF',
      border: theme.name === 'facebook'
        ? '1px solid #E4E6EA'
        : `1px solid ${theme.colors.border}`,
      borderRadius: '12px',
      boxShadow: theme.name === 'facebook'
        ? '0 1px 2px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
        : theme.name === 'dark'
          ? '0 2px 8px rgba(0,0,0,0.3)'
          : '0 2px 6px rgba(0,0,0,0.1)',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
      
      // Обеспечиваем правильное отображение текста
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      hyphens: 'auto'
    },
    
    itemIcon: {
      fontSize: '28px',
      marginBottom: '8px',
      flexShrink: 0,
      filter: theme.name === 'facebook' ? 'none' : 'none'
    },
    
    itemTitle: {
      fontSize: '13px',
      fontWeight: theme.name === 'facebook' ? '600' : '700',
      lineHeight: '1.2',
      marginBottom: '4px',
      color: theme.name === 'facebook' 
        ? '#050505'
        : theme.card.color,
      
      // Ограничиваем текст максимум 2 строками
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      wordBreak: 'break-word'
    },
    
    itemSubtitle: {
      fontSize: '11px',
      fontWeight: '400',
      lineHeight: '1.1',
      color: theme.name === 'facebook'
        ? '#65676B'
        : theme.colors.textSecondary,
      opacity: 0.85,
      
      // Ограничиваем подзаголовок 1 строкой
      display: '-webkit-box',
      WebkitLineClamp: 1,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  });

  const styles = getStyles();

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const handleItemMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
    
    if (theme.name === 'facebook') {
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.15)';
    } else if (theme.name === 'dark') {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
    } else {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }
  };

  const handleItemMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = styles.item.boxShadow;
  };

  return (
    <div style={styles.container}>
      <div style={styles.title}>
        🎮 Функции приложения
      </div>
      
      <div style={styles.carousel}>
        <div style={styles.scrollContainer}>
          {items.map((item, index) => (
            <div
              key={item.id || index}
              style={styles.item}
              onClick={() => handleItemClick(item)}
              onMouseEnter={handleItemMouseEnter}
              onMouseLeave={handleItemMouseLeave}
              role="button"
              tabIndex={0}
              aria-label={`${item.title} ${item.subtitle}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleItemClick(item);
                }
              }}
            >
              <div style={styles.itemIcon}>
                {item.icon}
              </div>
              
              <div style={styles.itemTitle}>
                {item.title}
              </div>
              
              {item.subtitle && (
                <div style={styles.itemSubtitle}>
                  {item.subtitle}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Добавляем CSS для кастомного скроллбара */}
      <style>{`
        .function-carousel-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .function-carousel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .function-carousel-scroll::-webkit-scrollbar-thumb {
          background: ${theme.colors.primary}60;
          border-radius: 3px;
        }
        .function-carousel-scroll::-webkit-scrollbar-thumb:hover {
          background: ${theme.colors.primary};
        }
      `}</style>
    </div>
  );
};

export default FunctionCarousel;
