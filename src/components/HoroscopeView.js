// src/components/HoroscopeView.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import useRealHoroscope from '../hooks/useRealHoroscope';
import Card from './UI/Card';
import Button from './UI/Button';
import telegramBot from '../services/telegramBot'; // 🤖 TELEGRAM BOT INTEGRATION


const HoroscopeView = ({ 
  onBack, 
  selectedSign, 
  onSignChange, 
  onAddToFavorites 
}) => {
  const { theme, styles, createGradientStyle } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSharing, setIsSharing] = useState(false); // 📲 Состояние шеринга

  // ✅ ИСПОЛЬЗУЕМ НОВЫЙ ХУК С РЕАЛЬНЫМИ ДАННЫМИ
  const { data: horoscopeData, loading, error, refetch } = useRealHoroscope(selectedSign?.sign);

  // Отслеживание размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 📲 Обработчик отправки в Telegram
  const handleShareToTelegram = async () => {
    if (!horoscopeData || isSharing) return;
    
    setIsSharing(true);
    
    try {
      const success = await telegramBot.shareHoroscopeToTelegram(horoscopeData);
      
      if (success) {
        console.log('✅ Гороскоп отправлен в Telegram');
      } else {
        console.warn('⚠️ Ошибка отправки в Telegram');
      }
    } catch (error) {
      console.error('❌ Ошибка отправки в Telegram:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Стили компонента
  const horoscopeStyles = {
    container: {
      padding: isMobile ? theme.spacing.md : theme.spacing.lg,
      maxWidth: '800px',
      margin: '0 auto',
      height: '100vh',
      overflowY: 'auto',
      paddingBottom: '100px'
    },

    // ✅ ИСПРАВЛЕННАЯ КАРТОЧКА С ГНОМОМ И ИЗОБРАЖЕНИЕМ
    gnomeCard: {
      marginBottom: theme.spacing.xl,
      position: 'relative',
      height: '280px',
      overflow: 'hidden',
      borderRadius: theme.borderRadius.lg,
      background: selectedSign?.gnome?.colors ? 
        createGradientStyle(selectedSign.gnome.colors, '135deg').background :
        createGradientStyle(['#667eea', '#764ba2'], '135deg').background
    },

    gnomeBackgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: 0.3,
      zIndex: 1
    },

    gnomeOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
      zIndex: 2
    },

    gnomeInfo: {
      position: 'relative',
      zIndex: 3,
      padding: theme.spacing.xl,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },

    gnomeCircle: {
      position: 'absolute',
      top: '24px',
      right: '24px',
      width: '90px',
      height: '90px',
      borderRadius: '50%',
      border: '4px solid rgba(255,255,255,0.9)',
      overflow: 'hidden',
      zIndex: 4,
      boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(255,255,255,0.1)',
      backdropFilter: 'blur(10px)'
    },

    gnomeCircleImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },

    sectionCard: {
      marginBottom: theme.spacing.lg
    },

    sectionTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs
    },

    sectionText: {
      fontSize: theme.typography.sizes.md,
      lineHeight: 1.6,
      color: theme.colors.text,
      margin: 0
    },

    luckyContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
      gap: theme.spacing.sm,
      marginTop: theme.spacing.md
    },

    luckyItem: {
      textAlign: 'center',
      padding: theme.spacing.sm,
      backgroundColor: `${theme.colors.primary}20`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.primary}40`
    },

    loadingContainer: {
      textAlign: 'center',
      padding: theme.spacing.xxl
    },

    loadingIcon: {
      fontSize: '4rem',
      marginBottom: theme.spacing.lg,
      animation: 'pulse 2s infinite'
    },

    errorContainer: {
      textAlign: 'center',
      padding: theme.spacing.lg,
      backgroundColor: `${theme.colors.danger}20`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.danger}40`
    },

    buttonContainer: {
      display: 'flex',
      gap: theme.spacing.md,
      justifyContent: 'center',
      marginTop: theme.spacing.xl,
      flexDirection: isMobile ? 'column' : 'row'
    }
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div style={horoscopeStyles.container}>
        
        
        <div style={horoscopeStyles.loadingContainer}>
          <div style={horoscopeStyles.loadingIcon}>🔮</div>
          <h3 style={{ color: theme.colors.primary }}>
            Гном составляет ваш персональный гороскоп...
          </h3>
          <p style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.md }}>
            Запрашиваем данные с сервера
          </p>
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div style={horoscopeStyles.container}>
        
        
        <div style={horoscopeStyles.errorContainer}>
          <h3 style={{ color: theme.colors.danger, marginBottom: theme.spacing.md }}>
            ⚠️ Ошибка загрузки гороскопа
          </h3>
          <p style={{ color: theme.colors.danger, marginBottom: theme.spacing.lg }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: theme.spacing.md, justifyContent: 'center' }}>
            <Button variant="primary" onClick={refetch}>
              🔄 Попробовать снова
            </Button>
            {onSignChange && (
              <Button variant="outline" onClick={onSignChange}>
                🔄 Сменить знак
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Если нет выбранного знака
  if (!selectedSign) {
    return (
      <div style={horoscopeStyles.container}>
        
        <div style={horoscopeStyles.errorContainer}>
          <h3 style={{ color: theme.colors.textSecondary }}>
            🔮 Знак зодиака не выбран
          </h3>
          <Button variant="primary" onClick={onBack || onSignChange}>
            Выбрать знак
          </Button>
        </div>
      </div>
    );
  }

  // Основной контент с данными
  return (
    <div style={horoscopeStyles.container}>
      
      
      {/* ✅ КАРТОЧКА С ГНОМОМ И ИЗОБРАЖЕНИЕМ */}
      <Card 
        padding="none" 
        style={horoscopeStyles.gnomeCard}
      >
        {/* Фоновое изображение знака зодиака */}
        <img
          src={`${process.env.PUBLIC_URL || ''}/assets/zodiac-backgrounds/${selectedSign.id}.jpg`}
          alt={selectedSign.sign}
          style={horoscopeStyles.gnomeBackgroundImage}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        
        {/* Затемняющий оверлей */}
        <div style={horoscopeStyles.gnomeOverlay} />
        
        {/* Круглый элемент с гномом (НЕ НА КРАЮ) */}
        <div 
          style={horoscopeStyles.gnomeCircle}
          onMouseEnter={(e) => {
            // Убрали transform эффекты по запросу
          }}
          onMouseLeave={(e) => {
            // Убрали transform эффекты по запросу
          }}
        >
          <img
            src={`${process.env.PUBLIC_URL || ''}/assets/gnomes/${selectedSign.gnome?.image}`}
            alt={selectedSign.gnome?.name}
            style={horoscopeStyles.gnomeCircleImage}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 2.5rem;">${selectedSign.emoji}</div>`;
            }}
          />
        </div>
        
        {/* Текстовая информация поверх изображения */}
        <div style={horoscopeStyles.gnomeInfo}>
          <h1 style={{
            fontSize: theme.typography.sizes.title,
            color: '#ffffff',
            margin: '0 0 8px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontWeight: theme.typography.weights.bold
          }}>
            {selectedSign.emoji} {selectedSign.sign}
          </h1>
          <h2 style={{
            fontSize: theme.typography.sizes.lg,
            color: '#F4C542',
            margin: '0 0 4px 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            fontWeight: theme.typography.weights.semibold
          }}>
            {selectedSign.gnome?.name}
          </h2>
          <p style={{
            fontSize: theme.typography.sizes.md,
            color: 'rgba(255,255,255,0.95)',
            margin: '0 0 8px 0',
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
          }}>
            {selectedSign.gnome?.title}
          </p>
          <p style={{
            fontSize: theme.typography.sizes.sm,
            color: 'rgba(255,255,255,0.8)',
            margin: 0,
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            fontStyle: 'italic'
          }}>
            {selectedSign.dates}
          </p>
          {horoscopeData?.date && (
            <p style={{
              fontSize: theme.typography.sizes.sm,
              color: '#F4C542',
              margin: '8px 0 0 0',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontWeight: theme.typography.weights.semibold
            }}>
              📅 {horoscopeData.date}
            </p>
          )}
        </div>
      </Card>

      {horoscopeData && (
        <>
          {/* ✅ ОБЩИЙ ГОРОСКОП */}
          <Card padding="lg" style={horoscopeStyles.sectionCard}>
            <h3 style={horoscopeStyles.sectionTitle}>
              <span>🌟</span>
              <span>Общий прогноз</span>
            </h3>
            <p style={horoscopeStyles.sectionText}>
              {horoscopeData.horoscope?.general || horoscopeData.general || 'Данные загружаются...'}
            </p>
          </Card>

          {/* ✅ ЛЮБОВЬ */}
          {(horoscopeData.horoscope?.love || horoscopeData.love) && (
            <Card padding="lg" style={horoscopeStyles.sectionCard}>
              <h3 style={horoscopeStyles.sectionTitle}>
                <span>💕</span>
                <span>Любовь и отношения</span>
              </h3>
              <p style={horoscopeStyles.sectionText}>
                {horoscopeData.horoscope?.love || horoscopeData.love}
              </p>
            </Card>
          )}

          {/* ✅ КАРЬЕРА */}
          {(horoscopeData.horoscope?.work || horoscopeData.work || horoscopeData.horoscope?.career) && (
            <Card padding="lg" style={horoscopeStyles.sectionCard}>
              <h3 style={horoscopeStyles.sectionTitle}>
                <span>💼</span>
                <span>Карьера и работа</span>
              </h3>
              <p style={horoscopeStyles.sectionText}>
                {horoscopeData.horoscope?.work || horoscopeData.work || horoscopeData.horoscope?.career}
              </p>
            </Card>
          )}

          {/* ✅ ЗДОРОВЬЕ */}
          {(horoscopeData.horoscope?.health || horoscopeData.health) && (
            <Card padding="lg" style={horoscopeStyles.sectionCard}>
              <h3 style={horoscopeStyles.sectionTitle}>
                <span>💪</span>
                <span>Здоровье</span>
              </h3>
              <p style={horoscopeStyles.sectionText}>
                {horoscopeData.horoscope?.health || horoscopeData.health}
              </p>
            </Card>
          )}

          {/* ✅ УДАЧА И ЧИСЛА */}
          {(horoscopeData.luckyNumber || horoscopeData.luckyColor) && (
            <Card padding="lg" style={horoscopeStyles.sectionCard}>
              <h3 style={horoscopeStyles.sectionTitle}>
                <span>🍀</span>
                <span>Ваша удача сегодня</span>
              </h3>
              <div style={horoscopeStyles.luckyContainer}>
                {horoscopeData.luckyNumber && (
                  <div style={horoscopeStyles.luckyItem}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🔢</div>
                    <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>Число</div>
                    <div style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                      {horoscopeData.luckyNumber}
                    </div>
                  </div>
                )}
                
                {horoscopeData.luckyColor && (
                  <div style={horoscopeStyles.luckyItem}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🎨</div>
                    <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>Цвет</div>
                    <div style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                      {horoscopeData.luckyColor}
                    </div>
                  </div>
                )}

                {horoscopeData.element && (
                  <div style={horoscopeStyles.luckyItem}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🌟</div>
                    <div style={{ fontSize: theme.typography.sizes.sm, color: theme.colors.textSecondary }}>Элемент</div>
                    <div style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                      {horoscopeData.element}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ✅ ГНОМ ГОВОРИТ */}
          {horoscopeData.gnome && (
            <Card padding="lg" style={horoscopeStyles.sectionCard}>
              <h3 style={horoscopeStyles.sectionTitle}>
                <span>🧙‍♂️</span>
                <span>{horoscopeData.gnome} говорит:</span>
              </h3>
              <p style={{
                ...horoscopeStyles.sectionText,
                fontStyle: 'italic',
                backgroundColor: `${theme.colors.secondary}10`,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.secondary}30`
              }}>
                "Магия звезд указывает путь к успеху и гармонии!"
              </p>
            </Card>
          )}

          {/* ✅ ДЕЙСТВИЯ */}
          <div style={horoscopeStyles.buttonContainer}>
            <Button 
              variant="primary" 
              onClick={() => onAddToFavorites && onAddToFavorites({
                type: 'horoscope',
                id: `horoscope-${selectedSign.sign}-${Date.now()}`,
                title: `🔮 ${selectedSign.sign}`,
                content: horoscopeData.horoscope?.general || horoscopeData.general || 'Гороскоп',
                date: new Date().toLocaleDateString('ru-RU'),
                sign: selectedSign.sign,
                gnome: selectedSign.gnome?.name
              })}
              style={{ width: isMobile ? '100%' : 'auto' }}
            >
              ⭐ В избранное
            </Button>
            
            {/* 📲 КНОПКА ОТПРАВКИ В TELEGRAM */}
            <Button 
              variant="outline" 
              onClick={handleShareToTelegram}
              disabled={isSharing}
              style={{ 
                width: isMobile ? '100%' : 'auto',
                background: isSharing ? 'rgba(0, 136, 204, 0.1)' : 'transparent',
                borderColor: '#0088cc',
                color: '#0088cc'
              }}
            >
              {isSharing ? '🔄 Отправляем...' : '📲 Отправить в Telegram'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={refetch}
              style={{ width: isMobile ? '100%' : 'auto' }}
            >
              🔄 Обновить
            </Button>

            {onSignChange && (
              <Button 
                variant="outline" 
                onClick={onSignChange}
                style={{ width: isMobile ? '100%' : 'auto' }}
              >
                🔄 Сменить знак
              </Button>
            )}
          </div>

          {/* ✅ ОТЛАДОЧНАЯ ИНФОРМАЦИЯ (только в development) */}
          {process.env.NODE_ENV === 'development' && (
            <Card padding="lg" style={{ marginTop: theme.spacing.lg }}>
              <h4>🧪 Отладка API (только в development)</h4>
              <details>
                <summary style={{ cursor: 'pointer', marginBottom: theme.spacing.sm }}>
                  Посмотреть сырые данные JSON
                </summary>
                <pre style={{
                  fontSize: '12px',
                  backgroundColor: '#f0f0f0',
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.sm,
                  overflow: 'auto',
                  maxHeight: '200px',
                  color: '#000'
                }}>
                  {JSON.stringify(horoscopeData, null, 2)}
                </pre>
              </details>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default HoroscopeView;
