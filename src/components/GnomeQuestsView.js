// src/components/GnomeQuestsView.js - Компонент ежедневных квестов от гномов
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { gnomeQuests, generateDailyQuests, checkAchievements } from '../data/gnomeQuests';
import Card from './UI/Card';
import Button from './UI/Button';

const GnomeQuestsView = ({ onBack, selectedSign, onAddToFavorites }) => {
  const { theme } = useTheme();
  const [dailyQuests, setDailyQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [rewards, setRewards] = useState({ coins: 0, experience: 0, streak: 0 });
  const [activeTab, setActiveTab] = useState('daily'); // 'daily', 'progress', 'achievements'
  const [achievements, setAchievements] = useState([]);

  // Генерация ежедневных квестов
  const loadDailyQuests = () => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem('gnome-quests-date');
    
    if (savedDate === today) {
      // Загружаем сохранённые квесты
      const saved = localStorage.getItem('gnome-daily-quests');
      if (saved) {
        setDailyQuests(JSON.parse(saved));
        return;
      }
    }

    // Генерируем новые квесты
    const newQuests = generateDailyQuests(4);
    setDailyQuests(newQuests);
    localStorage.setItem('gnome-daily-quests', JSON.stringify(newQuests));
    localStorage.setItem('gnome-quests-date', today);
  };

  // Загрузка прогресса
  const loadProgress = () => {
    const completed = JSON.parse(localStorage.getItem('gnome-completed-quests') || '[]');
    const userRewards = JSON.parse(localStorage.getItem('gnome-rewards') || '{"coins": 0, "experience": 0, "streak": 0}');
    
    setCompletedQuests(completed);
    setRewards(userRewards);

    // Проверяем достижения
    const userStats = {
      questsCompleted: completed.length,
      currentStreak: userRewards.streak,
      mentorsConsulted: 0, // TODO: отслеживать
      totalCoins: userRewards.coins,
      totalExperience: userRewards.experience
    };
    
    const unlockedAchievements = checkAchievements(userStats);
    setAchievements(unlockedAchievements);
  };

  // Выполнение квеста
  const completeQuest = (quest) => {
    const newCompleted = [...completedQuests, {
      ...quest,
      completedAt: new Date().toISOString()
    }];
    
    const newRewards = {
      coins: rewards.coins + quest.reward.coins,
      experience: rewards.experience + quest.reward.experience,
      streak: rewards.streak + 1
    };

    setCompletedQuests(newCompleted);
    setRewards(newRewards);

    // Сохраняем прогресс
    localStorage.setItem('gnome-completed-quests', JSON.stringify(newCompleted));
    localStorage.setItem('gnome-rewards', JSON.stringify(newRewards));

    // Удаляем квест из активных
    const updatedQuests = dailyQuests.filter(q => q.id !== quest.id);
    setDailyQuests(updatedQuests);
    localStorage.setItem('gnome-daily-quests', JSON.stringify(updatedQuests));

    // Haptic feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
      try {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      } catch (e) {}
    }

    // Добавляем в избранное если есть функция
    if (onAddToFavorites) {
      onAddToFavorites({
        type: 'quest-completed',
        id: `quest-${Date.now()}`,
        title: `🏆 Квест завершён: ${quest.title}`,
        content: `Награда: ${quest.reward.coins} монет, ${quest.reward.experience} опыта`,
        quest: quest,
        date: new Date().toLocaleDateString('ru-RU')
      });
    }
  };

  const isQuestCompleted = (questId) => {
    return completedQuests.some(q => q.id === questId && 
      new Date(q.completedAt).toDateString() === new Date().toDateString());
  };

  const getTimeRemaining = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    
    if (diff <= 0) return 'Время истекло';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}ч ${minutes}м`;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = gnomeQuests.difficultyLevels[difficulty];
    return colors ? colors.color : '#68D391';
  };

  useEffect(() => {
    loadDailyQuests();
    loadProgress();
  }, []);

  // CSS анимации
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes questAppear {
        0% { opacity: 0; transform: translateX(-20px); }
        100% { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes questComplete {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes coinSpin {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
      
      @keyframes progressGlow {
        0%, 100% { box-shadow: 0 0 10px rgba(244, 197, 66, 0.3); }
        50% { box-shadow: 0 0 20px rgba(244, 197, 66, 0.6); }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: theme.spacing.lg,
      minHeight: '100vh'
    },

    header: {
      textAlign: 'center',
      marginBottom: theme.spacing.xxl,
      position: 'relative'
    },

    backButton: {
      // Removed - back button only in header
    },

    title: {
      fontSize: theme.typography.sizes.title,
      fontWeight: theme.typography.weights.bold,
      background: 'linear-gradient(135deg, #F4C542 0%, #4ECDC4 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0'
    },

    subtitle: {
      fontSize: theme.typography.sizes.lg,
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0
    },

    rewardsBar: {
      display: 'flex',
      justifyContent: 'center',
      gap: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      flexWrap: 'wrap'
    },

    rewardItem: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.xs,
      background: 'rgba(244, 197, 66, 0.1)',
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.lg,
      border: '2px solid rgba(244, 197, 66, 0.3)',
      animation: 'progressGlow 3s ease-in-out infinite'
    },

    rewardIcon: {
      fontSize: '20px',
      animation: 'coinSpin 2s linear infinite'
    },

    rewardText: {
      fontSize: theme.typography.sizes.md,
      fontWeight: theme.typography.weights.bold,
      color: theme.colors.primary
    },

    tabNavigation: {
      display: 'flex',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xl,
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      backdropFilter: 'blur(10px)'
    },

    tabButton: {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      background: 'transparent',
      border: 'none',
      borderRadius: theme.borderRadius.md,
      color: 'rgba(255, 255, 255, 0.7)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: theme.typography.sizes.sm,
      fontWeight: theme.typography.weights.medium,
      minWidth: '120px'
    },

    activeTabButton: {
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, rgba(244, 197, 66, 0.8) 100%)`,
      color: '#000000',
      fontWeight: theme.typography.weights.bold,
      transform: 'translateY(-2px)',
      boxShadow: `0 4px 12px rgba(244, 197, 66, 0.4)`
    },

    questsGrid: {
      display: 'grid',
      gap: theme.spacing.lg,
      gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
    },

    questCard: {
      background: 'rgba(22, 33, 62, 0.9)',
      border: '2px solid rgba(244, 197, 66, 0.3)',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      transition: 'all 0.3s ease',
      animation: 'questAppear 0.6s ease-out',
      position: 'relative'
    },

    questHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.md
    },

    questTitle: {
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      color: '#ffffff',
      margin: 0,
      flex: 1
    },

    difficultyBadge: {
      padding: '4px 8px',
      borderRadius: theme.borderRadius.sm,
      fontSize: theme.typography.sizes.xs,
      fontWeight: theme.typography.weights.bold,
      color: '#000000'
    },

    questDescription: {
      fontSize: theme.typography.sizes.sm,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: theme.spacing.md,
      lineHeight: 1.5
    },

    gnomeInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      padding: theme.spacing.sm,
      background: 'rgba(244, 197, 66, 0.1)',
      borderRadius: theme.borderRadius.md
    },

    instructions: {
      fontSize: theme.typography.sizes.sm,
      color: 'rgba(255, 255, 255, 0.9)',
      fontStyle: 'italic',
      marginBottom: theme.spacing.md
    },

    questFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },

    rewardInfo: {
      display: 'flex',
      gap: theme.spacing.sm,
      fontSize: theme.typography.sizes.sm
    },

    timeRemaining: {
      fontSize: theme.typography.sizes.xs,
      color: 'rgba(255, 255, 255, 0.6)'
    },

    completeButton: {
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #4ECDC4 100%)`,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      color: '#000000',
      fontWeight: theme.typography.weights.bold,
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }
  };

  const renderDailyQuests = () => (
    <div style={styles.questsGrid}>
      {dailyQuests.map((quest, index) => (
        <div
          key={quest.id}
          style={{
            ...styles.questCard,
            animationDelay: `${index * 0.1}s`
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px)';
            e.target.style.borderColor = 'rgba(244, 197, 66, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.borderColor = 'rgba(244, 197, 66, 0.3)';
          }}
        >
          <div style={styles.questHeader}>
            <h3 style={styles.questTitle}>{quest.title}</h3>
            <span
              style={{
                ...styles.difficultyBadge,
                backgroundColor: getDifficultyColor(quest.difficulty)
              }}
            >
              {gnomeQuests.difficultyLevels[quest.difficulty]?.icon} {gnomeQuests.difficultyLevels[quest.difficulty]?.name}
            </span>
          </div>

          <p style={styles.questDescription}>{quest.description}</p>

          <div style={styles.gnomeInfo}>
            <span style={{ fontSize: '24px' }}>🧙‍♂️</span>
            <span style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
              {quest.gnomeName}
            </span>
          </div>

          <p style={styles.instructions}>"{quest.instructions}"</p>

          <div style={styles.questFooter}>
            <div style={styles.rewardInfo}>
              <span>🪙 {quest.reward.coins}</span>
              <span>⭐ {quest.reward.experience}</span>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={styles.timeRemaining}>
                ⏰ {getTimeRemaining(quest.endTime)}
              </div>
              <button
                style={styles.completeButton}
                onClick={() => completeQuest(quest)}
                disabled={isQuestCompleted(quest.id)}
                onMouseEnter={(e) => {
                  if (!isQuestCompleted(quest.id)) {
                    e.target.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {isQuestCompleted(quest.id) ? '✅ Выполнено' : '🎯 Выполнить'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProgress = () => (
    <div style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
      <h3 style={{ color: theme.colors.primary, marginBottom: theme.spacing.lg }}>
        📊 Твой прогресс
      </h3>
      <div style={styles.questsGrid}>
        <div style={styles.questCard}>
          <h4 style={{ color: '#4ECDC4' }}>🏆 Выполнено квестов</h4>
          <p style={{ fontSize: '2rem', margin: theme.spacing.md }}>
            {completedQuests.length}
          </p>
        </div>
        <div style={styles.questCard}>
          <h4 style={{ color: '#F6AD55' }}>🔥 Текущая серия</h4>
          <p style={{ fontSize: '2rem', margin: theme.spacing.md }}>
            {rewards.streak}
          </p>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div style={{ textAlign: 'center', padding: theme.spacing.xxl }}>
      <h3 style={{ color: theme.colors.primary, marginBottom: theme.spacing.lg }}>
        🏅 Достижения
      </h3>
      {achievements.length > 0 ? (
        <div style={styles.questsGrid}>
          {achievements.map((achievement) => (
            <div key={achievement.id} style={styles.questCard}>
              <div style={{ fontSize: '48px', marginBottom: theme.spacing.md }}>
                {achievement.icon}
              </div>
              <h4 style={{ color: '#4ECDC4' }}>{achievement.name}</h4>
              <p>{achievement.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          Выполняй квесты, чтобы получить достижения! 🎯
        </p>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Заголовок */}
      <div style={styles.header}>
        <h1 style={styles.title}>🎯 Квесты от Гномов</h1>
        <p style={styles.subtitle}>Выполняй ежедневные задания и получай награды!</p>
      </div>

      {/* Панель наград */}
      <div style={styles.rewardsBar}>
        <div style={styles.rewardItem}>
          <span style={styles.rewardIcon}>🪙</span>
          <span style={styles.rewardText}>{rewards.coins}</span>
        </div>
        <div style={styles.rewardItem}>
          <span style={styles.rewardIcon}>⭐</span>
          <span style={styles.rewardText}>{rewards.experience}</span>
        </div>
        <div style={styles.rewardItem}>
          <span style={styles.rewardIcon}>🔥</span>
          <span style={styles.rewardText}>{rewards.streak}</span>
        </div>
      </div>

      {/* Навигация по вкладкам */}
      <div style={styles.tabNavigation}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'daily' ? styles.activeTabButton : {})
          }}
          onClick={() => setActiveTab('daily')}
        >
          🎯 Квесты
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'progress' ? styles.activeTabButton : {})
          }}
          onClick={() => setActiveTab('progress')}
        >
          📊 Прогресс
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'achievements' ? styles.activeTabButton : {})
          }}
          onClick={() => setActiveTab('achievements')}
        >
          🏅 Достижения
        </button>
      </div>

      {/* Контент */}
      {activeTab === 'daily' && renderDailyQuests()}
      {activeTab === 'progress' && renderProgress()}
      {activeTab === 'achievements' && renderAchievements()}
    </div>
  );
};

export default GnomeQuestsView;