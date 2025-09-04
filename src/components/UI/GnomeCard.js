// src/components/UI/GnomeCard.js - Магическая карточка гномов
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const GnomeCard = ({ 
  children, 
  className = '', 
  style = {}, 
  withBorder = true,
  withDecoration = true,
  withHover = true,
  variant = 'default', // 'default', 'premium', 'magic'
  ...props 
}) => {
  const { theme } = useTheme();

  // 🧙‍♂️ Разные варианты гномьих карточек
  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return {
          background: `linear-gradient(135deg, 
            rgba(255, 215, 0, 0.15) 0%, 
            rgba(22, 33, 62, 0.9) 50%, 
            rgba(147, 112, 219, 0.15) 100%)`,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: theme.colors.gnomeGold,
          boxShadow: theme.gnomeEffects.goldGlow
        };
      case 'magic':
        return {
          background: `linear-gradient(135deg, 
            rgba(147, 112, 219, 0.2) 0%, 
            rgba(22, 33, 62, 0.9) 50%, 
            rgba(78, 205, 196, 0.2) 100%)`,
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: theme.colors.gnomeMagic,
          boxShadow: theme.gnomeEffects.magicGlow
        };
      default:
        return {
          background: `linear-gradient(135deg, 
            rgba(22, 33, 62, 0.9) 0%, 
            rgba(31, 41, 55, 0.85) 100%)`,
          borderWidth: withBorder ? '2px' : '0',
          borderStyle: withBorder ? 'solid' : 'none',
          borderColor: withBorder ? 'rgba(255, 215, 0, 0.3)' : 'transparent'
        };
    }
  };

  const cardStyles = {
    ...style,
    position: 'relative',
    backdropFilter: 'blur(15px)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    ...getVariantStyles()
  };

  return (
    <div 
      className={`gnome-card ${withDecoration ? 'gnome-decoration' : ''} ${className}`}
      style={cardStyles}
      onMouseEnter={withHover ? (e) => {
        // Убрали transform эффекты по запросу
        e.currentTarget.style.boxShadow = `
          ${theme.gnomeEffects.goldGlow},
          0 15px 35px rgba(0, 0, 0, 0.2)
        `;
        if (variant === 'premium') {
          e.currentTarget.style.borderColor = theme.colors.gnomeGold;
        } else if (variant === 'magic') {
          e.currentTarget.style.borderColor = theme.colors.gnomeMagic;
        } else {
          e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.6)';
        }
      } : undefined}
      onMouseLeave={withHover ? (e) => {
        // Убрали transform эффекты по запросу
        e.currentTarget.style.boxShadow = variant === 'premium' 
          ? theme.gnomeEffects.goldGlow 
          : variant === 'magic' 
          ? theme.gnomeEffects.magicGlow 
          : '0 6px 15px rgba(0, 0, 0, 0.12)';
        if (variant === 'premium') {
          e.currentTarget.style.borderColor = theme.colors.gnomeGold;
        } else if (variant === 'magic') {
          e.currentTarget.style.borderColor = theme.colors.gnomeMagic;
        } else {
          e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
        }
      } : undefined}
      {...props}
    >
      {/* 🧙‍♂️ Магический гномий border-эффект */}
      {variant === 'premium' && (
        <div 
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            background: `linear-gradient(45deg, 
              ${theme.colors.gnomeGold}, 
              ${theme.colors.gnomeMagic}, 
              ${theme.colors.secondary},
              ${theme.colors.gnomeGold})`,
            borderRadius: '18px',
            zIndex: -1,
            animation: 'gnomeBorderGlow 3s ease-in-out infinite'
          }}
        />
      )}
      
      {children}
    </div>
  );
};

export default GnomeCard;