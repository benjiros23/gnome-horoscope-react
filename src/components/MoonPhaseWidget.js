// src/components/MoonPhaseWidget.js - Компактный виджет лунной фазы для главного экрана
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LunarCalculator from '../utils/lunarCalculations';

const MoonPhaseWidget = ({ onClick, compact = true }) => {
  const { theme } = useTheme();
  const [moonData, setMoonData] = useState(null);

  useEffect(() => {
    const data = LunarCalculator.getCurrentMoonPhase();
    setMoonData(data);
  }, []);

  useEffect(() => {
    const existingStyle = document.getElementById('moon-widget-animations');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'moon-widget-animations';
      style.textContent = `
        @keyframes moonWidgetGlow {
          0%, 100% { 
            box-shadow: 0 4px 15px rgba(244, 197, 66, 0.3);
          }
          50% { 
            box-shadow: 0 4px 25px rgba(244, 197, 66, 0.5);
          }
        }
        
        @keyframes moonPhaseRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes widgetPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const styles = {
    widget: {
      background: `linear-gradient(135deg, 
        rgba(244, 197, 66, 0.1) 0%, 
        rgba(78, 205, 196, 0.1) 100%)`,
      border: '2px solid rgba(244, 197, 66, 0.3)',
      borderRadius: theme.borderRadius.lg,
      padding: compact ? theme.spacing.md : theme.spacing.lg,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'moonWidgetGlow 3s ease-in-out infinite'
    },

    content: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? theme.spacing.sm : theme.spacing.md
    },

    moonIcon: {
      fontSize: compact ? '32px' : '48px',
      animation: 'none',
      position: 'relative'
    },

    info: {
      flex: 1,
      minWidth: 0
    },

    phaseName: {
      fontSize: compact ? theme.typography.sizes.sm : theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      margin: '0 0 2px 0',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },

    phaseDescription: {
      fontSize: compact ? theme.typography.sizes.xs : theme.typography.sizes.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      lineHeight: 1.3,
      display: '-webkit-box',
      WebkitLineClamp: compact ? 1 : 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },

    illuminationBar: {
      width: '100%',
      height: '4px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '2px',
      marginTop: '4px',
      overflow: 'hidden'
    },

    illuminationFill: {
      height: '100%',
      background: `linear-gradient(90deg, 
        ${theme.colors.primary} 0%, 
        rgba(255, 255, 255, 0.9) 100%)`,
      borderRadius: '2px',
      transition: 'width 0.5s ease-out'
    },

    percentage: {
      position: 'absolute',
      top: compact ? '4px' : '8px',
      right: compact ? '8px' : '12px',
      fontSize: compact ? '10px' : '12px',
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '2px 6px',
      borderRadius: '10px',
      backdropFilter: 'blur(5px)'
    }
  };

  if (!moonData) {
    return (
      <div style={styles.widget}>
        <div style={styles.content}>
          <div style={styles.moonIcon}>
            🌙
          </div>
          <div style={styles.info}>
            <div style={styles.phaseName}>Загрузка...</div>
            <div style={styles.phaseDescription}>Определяем лунную фазу</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={styles.widget}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.animation = 'widgetPulse 1s ease-in-out infinite';
          e.target.style.borderColor = 'rgba(244, 197, 66, 0.6)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.animation = 'moonWidgetGlow 3s ease-in-out infinite';
          e.target.style.borderColor = 'rgba(244, 197, 66, 0.3)';
        }
      }}
    >
      <div style={styles.content}>
        <div style={styles.moonIcon}>
          {moonData.emoji}
        </div>
        
        <div style={styles.info}>
          <div style={styles.phaseName}>
            {moonData.phaseName}
          </div>
          <div style={styles.phaseDescription}>
            {moonData.description}
          </div>
          
          <div style={styles.illuminationBar}>
            <div 
              style={{
                ...styles.illuminationFill,
                width: `${moonData.illumination}%`
              }}
            />
          </div>
        </div>
      </div>
      
      <div style={styles.percentage}>
        {moonData.illumination}%
      </div>
    </div>
  );
};

export default MoonPhaseWidget;