// src/components/UserSettingsView.js - Компонент настроек пользователя
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import useUserSettings from '../hooks/useUserSettings';
import usePremiumFeatures from '../hooks/usePremiumFeatures';
import GnomeCard from './UI/GnomeCard';

const UserSettingsView = ({ onBack }) => {
  const { theme } = useTheme();
  const { 
    settings, 
    loading, 
    saveSettings, 
    isPremium, 
    zodiacSign,
    hasZodiacSign 
  } = useUserSettings();
  
  const { checkPremiumAccess } = usePremiumFeatures();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Локальное состояние для формы
  const [formData, setFormData] = useState({
    zodiac_sign: settings?.zodiac_sign || '',
    birth_time: settings?.birth_time || '',
    birth_location: settings?.birth_location || '',
    notification_time: settings?.notification_time || '09:00',
    language: settings?.language || 'ru',
    theme: settings?.theme || 'light'
  });

  // Обновить локальные настройки при изменении данных с сервера
  React.useEffect(() => {
    if (settings) {
      setFormData({
        zodiac_sign: settings.zodiac_sign || '',
        birth_time: settings.birth_time || '',
        birth_location: settings.birth_location || '',
        notification_time: settings.notification_time || '09:00',
        language: settings.language || 'ru',
        theme: settings.theme || 'light'
      });
    }
  }, [settings]);

  const zodiacSigns = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева',
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');

    try {
      const success = await saveSettings(formData);
      
      if (success) {
        setSaveMessage('✅ Настройки сохранены!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('❌ Ошибка сохранения');
      }
    } catch (error) {
      setSaveMessage('❌ Ошибка: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      paddingBottom: '100px',
      maxWidth: '600px',
      margin: '0 auto'
    },

    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },

    title: {
      fontSize: '28px',
      fontWeight: '800',
      background: `linear-gradient(135deg, ${theme.colors.gnomeGold}, ${theme.colors.gnomeMagic})`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 10px 0'
    },

    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: '16px',
      margin: 0
    },

    formSection: {
      marginBottom: '25px'
    },

    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: theme.colors.gnomeGold,
      marginBottom: '15px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },

    formGroup: {
      marginBottom: '20px'
    },

    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: theme.colors.text,
      marginBottom: '8px'
    },

    input: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: `2px solid rgba(255, 215, 0, 0.3)`,
      backgroundColor: 'rgba(22, 33, 62, 0.8)',
      color: theme.colors.text,
      fontSize: '16px',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease'
    },

    select: {
      width: '100%',
      padding: '12px',
      borderRadius: '12px',
      border: `2px solid rgba(255, 215, 0, 0.3)`,
      backgroundColor: 'rgba(22, 33, 62, 0.8)',
      color: theme.colors.text,
      fontSize: '16px',
      backdropFilter: 'blur(10px)',
      appearance: 'none',
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='${theme.colors.gnomeGold}' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
      backgroundPosition: 'right 12px center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '16px',
      paddingRight: '40px'
    },

    premiumBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '12px',
      fontWeight: '600',
      color: theme.colors.gnomeGold,
      backgroundColor: `rgba(255, 215, 0, 0.1)`,
      padding: '4px 8px',
      borderRadius: '6px',
      border: `1px solid rgba(255, 215, 0, 0.3)`
    },

    saveButton: {
      width: '100%',
      padding: '15px',
      borderRadius: '12px',
      border: 'none',
      background: `linear-gradient(135deg, ${theme.colors.gnomeGold}, ${theme.colors.gnomeMagic})`,
      color: 'rgba(22, 33, 62, 0.9)',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },

    backButton: {
      // Removed - back button only in header
    },

    premiumInfo: {
      textAlign: 'center',
      padding: '15px',
      borderRadius: '12px',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
      border: `2px solid ${theme.colors.gnomeGold}`,
      marginBottom: '20px'
    },

    saveMessage: {
      textAlign: 'center',
      padding: '12px',
      borderRadius: '8px',
      marginTop: '15px',
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🧙‍♂️</div>
          <div style={{ color: theme.colors.text }}>Загружаем магические настройки...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Заголовок */}
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Настройки Гнома</h1>
        <p style={styles.subtitle}>
          Настройте ваш магический опыт
        </p>
        
        {isPremium && (
          <div style={styles.premiumInfo}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👑</div>
            <div style={{ color: theme.colors.gnomeGold, fontWeight: '600' }}>
              ✨ Премиум аккаунт
            </div>
          </div>
        )}
      </div>

      {/* Основные настройки */}
      <GnomeCard variant="default" style={styles.formSection}>
        <div style={{ padding: '20px' }}>
          <h3 style={styles.sectionTitle}>
            🔮 Основные настройки
          </h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Знак зодиака</label>
            <select
              style={styles.select}
              value={formData.zodiac_sign}
              onChange={(e) => handleInputChange('zodiac_sign', e.target.value)}
            >
              <option value="">Выберите знак зодиака</option>
              {zodiacSigns.map(sign => (
                <option key={sign} value={sign}>{sign}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Время уведомлений</label>
            <input
              type="time"
              style={styles.input}
              value={formData.notification_time}
              onChange={(e) => handleInputChange('notification_time', e.target.value)}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Язык интерфейса</label>
            <select
              style={styles.select}
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </GnomeCard>

      {/* Премиум настройки */}
      <GnomeCard variant={isPremium ? "premium" : "default"} style={styles.formSection}>
        <div style={{ padding: '20px' }}>
          <h3 style={styles.sectionTitle}>
            ✨ Расширенные настройки
            {!isPremium && (
              <span style={styles.premiumBadge}>
                👑 Премиум
              </span>
            )}
          </h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Время рождения {!isPremium && '(Премиум)'}
            </label>
            <input
              type="time"
              style={{
                ...styles.input,
                opacity: isPremium ? 1 : 0.6
              }}
              value={formData.birth_time}
              onChange={(e) => handleInputChange('birth_time', e.target.value)}
              disabled={!isPremium}
              placeholder={!isPremium ? 'Доступно в премиум версии' : ''}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Место рождения {!isPremium && '(Премиум)'}
            </label>
            <input
              type="text"
              style={{
                ...styles.input,
                opacity: isPremium ? 1 : 0.6
              }}
              value={formData.birth_location}
              onChange={(e) => handleInputChange('birth_location', e.target.value)}
              disabled={!isPremium}
              placeholder={!isPremium ? 'Доступно в премиум версии' : 'Город, страна'}
            />
          </div>

          {!isPremium && (
            <div style={{
              textAlign: 'center',
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              border: `1px solid rgba(255, 215, 0, 0.3)`,
              marginTop: '15px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>👑</div>
              <div style={{ color: theme.colors.gnomeGold, fontSize: '14px' }}>
                Обновитесь до премиум для персональных прогнозов!
              </div>
            </div>
          )}
        </div>
      </GnomeCard>

      {/* Кнопка сохранения */}
      <button
        style={styles.saveButton}
        onClick={handleSave}
        disabled={saving}
        onMouseEnter={(e) => {
          if (!saving) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = `${theme.gnomeEffects.goldGlow}, 0 15px 35px rgba(0, 0, 0, 0.2)`;
          }
        }}
        onMouseLeave={(e) => {
          if (!saving) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }
        }}
      >
        {saving ? '🧙‍♂️ Сохраняем магию...' : '✨ Сохранить настройки'}
      </button>

      {/* Сообщение о сохранении */}
      {saveMessage && (
        <div style={{
          ...styles.saveMessage,
          backgroundColor: saveMessage.includes('✅') 
            ? 'rgba(22, 163, 74, 0.2)' 
            : 'rgba(220, 38, 38, 0.2)',
          color: saveMessage.includes('✅') 
            ? '#16a34a' 
            : '#dc2626',
          border: `1px solid ${saveMessage.includes('✅') ? '#16a34a' : '#dc2626'}40`
        }}>
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default UserSettingsView;