// src/components/MoonPhaseDisplay.js - Компонент отображения текущей фазы луны
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LunarCalculator from '../utils/lunarCalculations';

const MoonPhaseDisplay = ({ compact = false, showRecommendations = true }) => {
  const { theme } = useTheme();
  const [moonData, setMoonData] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    updateMoonData();
    // Обновляем данные каждый час
    const interval = setInterval(updateMoonData, 3600000);
    return () => clearInterval(interval);
  }, []);

  const updateMoonData = () => {
    setIsAnimating(true);
    const data = LunarCalculator.getCurrentMoonPhase();
    setTimeout(() => {
      setMoonData(data);
      setIsAnimating(false);
    }, 300);
  };

  // Добавляем CSS анимации
  useEffect(() => {
    const existingStyle = document.getElementById('moon-phase-animations');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'moon-phase-animations';
      style.textContent = `
        @keyframes moonGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(244, 197, 66, 0.3);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 40px rgba(244, 197, 66, 0.6);
            transform: scale(1.05);
          }
        }
        
        @keyframes moonRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeInUp {
          0% { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const styles = {
    container: {
      background: `linear-gradient(135deg, 
        rgba(22, 33, 62, 0.95) 0%, 
        rgba(31, 41, 55, 0.9) 50%,
        rgba(16, 26, 50, 0.95) 100%)`,
      borderRadius: theme.borderRadius.lg,
      padding: compact ? theme.spacing.md : theme.spacing.xl,
      backdropFilter: 'blur(15px)',
      border: '2px solid rgba(244, 197, 66, 0.3)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'none'
    },

    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: compact ? theme.spacing.sm : theme.spacing.md
    },

    title: {
      fontSize: compact ? theme.typography.sizes.md : theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    refreshButton: {
      background: 'rgba(244, 197, 66, 0.1)',
      border: '1px solid rgba(244, 197, 66, 0.3)',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px'
    },

    moonContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: compact ? theme.spacing.md : theme.spacing.lg,
      marginBottom: compact ? theme.spacing.sm : theme.spacing.md
    },

    moonVisual: {
      width: compact ? '80px' : '120px',
      height: compact ? '80px' : '120px',
      borderRadius: '50%',
      background: `radial-gradient(circle at 30% 30%, 
        rgba(255, 255, 255, 0.9) 0%,
        rgba(220, 220, 220, 0.8) 30%,
        rgba(150, 150, 150, 0.6) 70%,
        rgba(100, 100, 100, 0.4) 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: compact ? '32px' : '48px',
      position: 'relative',
      animation: 'moonGlow 3s ease-in-out infinite',
      border: '3px solid rgba(244, 197, 66, 0.4)',
      boxShadow: '0 0 30px rgba(244, 197, 66, 0.3)'
    },

    moonInfo: {
      flex: 1
    },

    phaseName: {
      fontSize: compact ? theme.typography.sizes.lg : theme.typography.sizes.xl,
      fontWeight: theme.typography.weights.bold,
      color: '#ffffff',
      margin: '0 0 4px 0',
      textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
    },

    phaseDescription: {
      fontSize: compact ? theme.typography.sizes.sm : theme.typography.sizes.md,
      color: 'rgba(255, 255, 255, 0.9)',
      margin: '0 0 8px 0',
      lineHeight: 1.4
    },

    illuminationContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs
    },

    illuminationBar: {
      flex: 1,
      height: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      overflow: 'hidden',
      position: 'relative'
    },

    illuminationFill: {
      height: '100%',
      background: `linear-gradient(90deg, 
        ${theme.colors.primary} 0%, 
        rgba(255, 255, 255, 0.9) 100%)`,
      borderRadius: '4px',
      transition: 'width 0.8s ease-out',
      animation: 'shimmer 2s ease-in-out infinite'
    },

    illuminationText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      fontWeight: theme.typography.weights.semibold,
      minWidth: '40px'
    },

    recommendationsContainer: {
      marginTop: compact ? theme.spacing.sm : theme.spacing.md,
      animation: 'fadeInUp 0.6s ease-out'
    },

    recommendationsTitle: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.primary,
      margin: '0 0 8px 0',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    recommendationsList: {
      display: 'grid',
      gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: theme.spacing.sm
    },

    recommendationItem: {
      background: 'rgba(244, 197, 66, 0.1)',
      border: '1px solid rgba(244, 197, 66, 0.2)',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      backdropFilter: 'blur(10px)'
    },

    recommendationHeader: {
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.semibold,
      color: theme.colors.primary,
      marginBottom: '4px'
    },

    recommendationText: {
      fontSize: theme.typography.sizes.xs,
      color: 'rgba(255, 255, 255, 0.8)',
      lineHeight: 1.3
    },

    energyBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: 'rgba(78, 205, 196, 0.2)',
      border: '1px solid rgba(78, 205, 196, 0.3)',
      borderRadius: theme.borderRadius.sm,
      padding: '4px 8px',
      fontSize: theme.typography.sizes.xs,
      color: '#4ECDC4',
      marginTop: '4px'
    }
  };

  if (!moonData) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>
            🌙
          </div>
          <div style={{ color: theme.colors.text }}>Загрузка лунных данных...</div>
        </div>
      </div>
    );
  }

  const recommendations = LunarCalculator.getMoonRecommendations(moonData.age);

  return (
    <div style={styles.container}>
      {/* Заголовок */}
      <div style={styles.header}>
        <h3 style={styles.title}>
          <span>🌙</span>
          <span>Текущая фаза луны</span>
        </h3>
        <button
          style={styles.refreshButton}
          onClick={updateMoonData}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(244, 197, 66, 0.2)';
            e.target.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(244, 197, 66, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
          title="Обновить данные"
        >
          🔄
        </button>
      </div>

      {/* Основная информация о луне */}
      <div style={styles.moonContainer}>
        <div style={styles.moonVisual}>
          {moonData.emoji}
        </div>
        
        <div style={styles.moonInfo}>
          <h4 style={styles.phaseName}>
            {moonData.phaseName}
          </h4>
          <p style={styles.phaseDescription}>
            {moonData.description}
          </p>
          
          {/* Индикатор освещенности */}
          <div style={styles.illuminationContainer}>
            <div style={styles.illuminationBar}>
              <div 
                style={{
                  ...styles.illuminationFill,
                  width: `${moonData.illumination}%`
                }}
              />
            </div>
            <span style={styles.illuminationText}>
              {moonData.illumination}%
            </span>
          </div>

          {/* Энергетический бейдж */}
          <div style={styles.energyBadge}>
            <span>⚡</span>
            <span>{recommendations.energy}</span>
          </div>
        </div>
      </div>

      {/* Рекомендации */}
      {showRecommendations && (
        <div style={styles.recommendationsContainer}>
          <h4 style={styles.recommendationsTitle}>
            <span>✨</span>
            <span>Рекомендации на сегодня</span>
          </h4>
          
          <div style={styles.recommendationsList}>
            <div style={styles.recommendationItem}>
              <div style={styles.recommendationHeader}>🌟 Благоприятно</div>
              <div style={styles.recommendationText}>
                {recommendations.good.join(', ')}
              </div>
            </div>
            
            <div style={styles.recommendationItem}>
              <div style={styles.recommendationHeader}>⚠️ Избегать</div>
              <div style={styles.recommendationText}>
                {recommendations.avoid.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoonPhaseDisplay;