import React, { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Card = React.memo(({ 
  title, 
  subtitle, 
  children, 
  style = {}, 
  onClick,
  className = '',
  headerStyle = {},
  contentStyle = {},
  variant = 'default',
  elevation = 'md',
  interactive = false
}) => {
  const { theme } = useTheme();

  // Мемоизированные стили
  const cardStyles = useMemo(() => {
    const baseStyle = {
      ...theme.components.card,
      cursor: onClick || interactive ? 'pointer' : 'default',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      ...style
    };

    // Варианты карточек
    const variants = {
      default: {},
      highlighted: {
        border: `2px solid ${theme.colors.primary}`,
        boxShadow: `0 0 20px ${theme.colors.primary}20`
      },
      success: {
        border: `1px solid ${theme.colors.success}40`,
        background: `linear-gradient(135deg, ${theme.colors.success}10, transparent)`
      },
      warning: {
        border: `1px solid ${theme.colors.warning}40`,
        background: `linear-gradient(135deg, ${theme.colors.warning}10, transparent)`
      },
      error: {
        border: `1px solid ${theme.colors.error}40`,
        background: `linear-gradient(135deg, ${theme.colors.error}10, transparent)`
      }
    };

    // Уровни теней
    const elevations = {
      none: { boxShadow: 'none' },
      sm: { boxShadow: theme.shadows.sm },
      md: { boxShadow: theme.shadows.md },
      lg: { boxShadow: theme.shadows.lg },
      xl: { boxShadow: theme.shadows.xl }
    };

    return {
      ...baseStyle,
      ...variants[variant],
      ...elevations[elevation]
    };
  }, [theme, onClick, interactive, style, variant, elevation]);

  const headerStyles = useMemo(() => ({
    marginBottom: subtitle ? '8px' : '16px',
    ...headerStyle
  }), [subtitle, headerStyle]);

  const titleStyles = useMemo(() => ({
    ...theme.typography.h3,
    margin: '0 0 8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }), [theme]);

  const subtitleStyles = useMemo(() => ({
    ...theme.typography.caption,
    margin: '0 0 16px 0',
    opacity: 0.8
  }), [theme]);

  const contentStyles = useMemo(() => ({
    ...contentStyle
  }), [contentStyle]);

  // Обработчик клика с улучшениями
  const handleClick = useMemo(() => {
    if (!onClick) return undefined;
    
    return (event) => {
      // Предотвращаем случайные клики на дочерних элементах
      if (event.target !== event.currentTarget) {
        const isInteractiveChild = event.target.closest('button, a, input, select, textarea');
        if (isInteractiveChild) return;
      }
      
      onClick(event);
    };
  }, [onClick]);

  // Обработчики hover эффектов
  const handleMouseEnter = useMemo(() => {
    if (!onClick && !interactive) return undefined;
    
    return (e) => {
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
      if (variant === 'highlighted') {
        e.currentTarget.style.boxShadow = `0 8px 25px ${theme.colors.primary}30`;
      } else {
        e.currentTarget.style.boxShadow = theme.shadows.lg;
      }
    };
  }, [onClick, interactive, variant, theme]);

  const handleMouseLeave = useMemo(() => {
    if (!onClick && !interactive) return undefined;
    
    return (e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = cardStyles.boxShadow;
    };
  }, [onClick, interactive, cardStyles.boxShadow]);

  return (
    <div
      className={className}
      style={cardStyles}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
    >
      {/* Заголовок карточки */}
      {(title || subtitle) && (
        <header style={headerStyles}>
          {title && (
            <h3 style={titleStyles}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p style={subtitleStyles}>
              {subtitle}
            </p>
          )}
        </header>
      )}

      {/* Основной контент */}
      {children && (
        <div style={contentStyles}>
          {children}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;

// Дополнительные варианты карточек для специфических случаев
export const InfoCard = React.memo((props) => (
  <Card {...props} variant="default" elevation="md" />
));

export const SuccessCard = React.memo((props) => (
  <Card {...props} variant="success" elevation="md" />
));

export const WarningCard = React.memo((props) => (
  <Card {...props} variant="warning" elevation="md" />
));

export const ErrorCard = React.memo((props) => (
  <Card {...props} variant="error" elevation="md" />
));

export const HighlightCard = React.memo((props) => (
  <Card {...props} variant="highlighted" elevation="lg" />
));

// Специализированная карточка для контента
export const ContentCard = React.memo(({ 
  icon, 
  title, 
  subtitle, 
  children, 
  action, 
  ...props 
}) => (
  <Card {...props}>
    {icon && (
      <div style={{
        fontSize: '32px',
        textAlign: 'center',
        marginBottom: '16px'
      }}>
        {icon}
      </div>
    )}
    
    {title && (
      <h4 style={{
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '8px',
        textAlign: 'center'
      }}>
        {title}
      </h4>
    )}
    
    {subtitle && (
      <p style={{
        fontSize: '14px',
        opacity: 0.8,
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        {subtitle}
      </p>
    )}
    
    {children && (
      <div style={{ marginBottom: action ? '16px' : 0 }}>
        {children}
      </div>
    )}
    
    {action && (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '12px'
      }}>
        {action}
      </div>
    )}
  </Card>
));

ContentCard.displayName = 'ContentCard';
