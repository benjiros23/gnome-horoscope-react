// src/components/ExtraMenuModal.js - Модальное окно для дополнительных пунктов меню
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ExtraMenuModal = ({ isOpen, onClose, onNavigate, currentView }) => {
  const { theme, createGradientStyle } = useTheme();

  const extraMenuItems = [
    { id: 'numerology', title: 'Нумерология', icon: '🔢', color: '#DDA0DD', description: 'Магия чисел в вашей жизни' },
    { id: 'cards', title: 'Карта дня', icon: '🃏', color: '#F0E68C', description: 'Предсказание на день' },
    { id: 'events', title: 'Астрособытия', icon: '🌌', color: '#87CEEB', description: 'Важные космические события' },
    { id: 'mercury', title: 'Меркурий', icon: '🪐', color: '#F4A460', description: 'Ретроградный Меркурий' }
  ];

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      opacity: isOpen ? 1 : 0,
      visibility: isOpen ? 'visible' : 'hidden',
      transition: 'all 0.3s ease'
    },

    modal: {
      backgroundColor: 'rgba(22, 33, 62, 0.95)',
      borderRadius: '20px',
      padding: '24px',
      margin: '20px',
      maxWidth: '400px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(244, 197, 66, 0.3)',
      transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    },

    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      paddingBottom: '15px',
      borderBottom: '1px solid rgba(244, 197, 66, 0.2)'
    },

    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: theme.colors.primary,
      margin: 0
    },

    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      color: theme.colors.textSecondary,
      fontSize: '24px',
      cursor: 'pointer',
      padding: '5px',
      borderRadius: '8px',
      transition: 'all 0.3s ease'
    },

    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '15px'
    },

    menuItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: 'none',
      borderRadius: '16px',
      padding: '20px 15px',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },

    activeMenuItem: {
      backgroundColor: 'rgba(244, 197, 66, 0.15)',
      borderColor: 'rgba(244, 197, 66, 0.3)',
      transform: 'scale(1.02)'
    },

    itemIcon: {
      fontSize: '32px',
      marginBottom: '8px',
      transition: 'all 0.3s ease'
    },

    itemTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: '4px',
      lineHeight: '1.2'
    },

    itemDescription: {
      fontSize: '11px',
      color: theme.colors.textSecondary,
      lineHeight: '1.3',
      opacity: 0.8
    }
  };

  const handleItemClick = (itemId) => {
    onNavigate(itemId);
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>✨ Дополнительные разделы</h3>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.target.style.color = theme.colors.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = theme.colors.textSecondary;
            }}
          >
            ✕
          </button>
        </div>

        <div style={styles.grid}>
          {extraMenuItems.map((item) => {
            const isActive = currentView === item.id;
            
            return (
              <button
                key={item.id}
                style={{
                  ...styles.menuItem,
                  ...(isActive ? styles.activeMenuItem : {})
                }}
                onClick={() => handleItemClick(item.id)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'scale(1.05)';
                    const icon = e.target.querySelector('.item-icon');
                    if (icon) icon.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.transform = 'scale(1)';
                    const icon = e.target.querySelector('.item-icon');
                    if (icon) icon.style.transform = 'scale(1)';
                  }
                }}
              >
                <div 
                  className="item-icon"
                  style={{
                    ...styles.itemIcon,
                    color: item.color
                  }}
                >
                  {item.icon}
                </div>
                <div style={styles.itemTitle}>{item.title}</div>
                <div style={styles.itemDescription}>{item.description}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExtraMenuModal;