import React, { useState, useEffect, useRef } from 'react';
import { useAPI } from '../hooks/useAPI';
import { saveToCache, loadFromCache } from '../utils/cache';

function NumerologyView({ onBack, onAddToFavorites, telegramApp }) {
  const { calculateNumerology, loading, error, clearError } = useAPI();
  
  // Состояния компонента
  const [birthDate, setBirthDate] = useState('');
  const [numerologyResult, setNumerologyResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [animateNumbers, setAnimateNumbers] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const resultRef = useRef(null);
  const hasCalculatedRef = useRef(false);

  // Haptic feedback
  const hapticFeedback = (type = 'impact', style = 'medium') => {
    if (telegramApp?.HapticFeedback) {
      try {
        if (type === 'impact') {
          telegramApp.HapticFeedback.impactOccurred(style);
        } else if (type === 'selection') {
          telegramApp.HapticFeedback.selectionChanged();
        } else if (type === 'notification') {
          telegramApp.HapticFeedback.notificationOccurred(style);
        }
      } catch (e) {
        console.log('Haptic feedback недоступен:', e.message);
      }
    }
  };

  // Показать уведомление
  const showToast = (message) => {
    if (telegramApp) {
      telegramApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  // Загрузить сохраненную дату при инициализации
  useEffect(() => {
    const savedDate = loadFromCache('user_birth_date');
    if (savedDate && savedDate.birthDate) {
      setBirthDate(savedDate.birthDate);
      console.log('📅 Загружена сохраненная дата рождения');
    }
  }, []);

  // Валидация даты
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const hundredYearsAgo = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
    
    return date instanceof Date && 
           !isNaN(date) && 
           date <= now && 
           date >= hundredYearsAgo;
  };

  // Рассчитать нумерологию
  const handleCalculateNumerology = async () => {
    if (isCalculating || hasCalculatedRef.current) return;
    
    if (!isValidDate(birthDate)) {
      showToast('❌ Пожалуйста, введите корректную дату рождения');
      hapticFeedback('notification', 'error');
      return;
    }
    
    try {
      setIsCalculating(true);
      hasCalculatedRef.current = true;
      clearError();
      
      console.log(`🔢 Рассчитываем нумерологию для даты: ${birthDate}`);
      
      // Сохраняем дату рождения
      saveToCache('user_birth_date', { birthDate, timestamp: Date.now() });
      
      // Проверяем кеш результатов
      const cacheKey = `numerology_${birthDate}`;
      const cachedResult = loadFromCache(cacheKey);
      
      if (cachedResult) {
        console.log('✅ Результат нумерологии из кеша');
        setNumerologyResult(cachedResult);
        setShowResult(true);
        
        // Анимация чисел
        setTimeout(() => setAnimateNumbers(true), 500);
        setTimeout(() => setShowDetails(true), 1000);
        
        hapticFeedback('notification', 'success');
        return;
      }
      
      // Получаем данные с API
      const result = await calculateNumerology(birthDate);
      
      // Дополняем локальными расчетами
      const enhancedResult = {
        ...result,
        ...calculateDetailedNumerology(birthDate),
        timestamp: Date.now()
      };
      
      // Сохраняем в кеш
      saveToCache(cacheKey, enhancedResult);
      
      setNumerologyResult(enhancedResult);
      setShowResult(true);
      
      // Анимация чисел
      setTimeout(() => setAnimateNumbers(true), 500);
      setTimeout(() => setShowDetails(true), 1000);
      
      // Прокручиваем к результату
      setTimeout(() => {
        if (resultRef.current) {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
      
      hapticFeedback('notification', 'success');
      console.log('✅ Нумерология рассчитана:', enhancedResult);
      
    } catch (err) {
      console.error('❌ Ошибка расчета нумерологии:', err);
      hapticFeedback('notification', 'error');
      showToast('Произошла ошибка при расчете нумерологии');
    } finally {
      setIsCalculating(false);
    }
  };

  // Детальные нумерологические расчеты
  const calculateDetailedNumerology = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    // Функция приведения к однозначному числу
    const reduceToSingle = (num) => {
      while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      }
      return num;
    };
    
    // Число жизненного пути
    const lifePathSum = day + month + year;
    const lifePath = reduceToSingle(lifePathSum);
    
    // Число судьбы (полная дата)
    const destinySum = dateString.replace(/-/g, '').split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    const destiny = reduceToSingle(destinySum);
    
    // Число личности (день рождения)
    const personality = reduceToSingle(day);
    
    // Число души (месяц)  
    const soul = reduceToSingle(month);
    
    // Число достижений (год)
    const achievement = reduceToSingle(year);
    
    return {
      lifePath: { number: lifePath, strength: Math.min(95, 75 + Math.random() * 20) },
      destiny: { number: destiny, strength: Math.min(95, 70 + Math.random() * 25) },
      personality: { number: personality, strength: Math.min(95, 65 + Math.random() * 30) },
      soul: { number: soul, strength: Math.min(95, 60 + Math.random() * 35) },
      achievement: { number: achievement, strength: Math.min(95, 55 + Math.random() * 40) },
      birthDate: dateString,
      calculationType: 'enhanced'
    };
  };

  // Сбросить результат
  const handleReset = () => {
    setNumerologyResult(null);
    setShowResult(false);
    setAnimateNumbers(false);
    setShowDetails(false);
    hasCalculatedRef.current = false;
    hapticFeedback('impact', 'light');
  };

  // Добавить в избранное
  const handleAddToFavorites = () => {
    if (numerologyResult && onAddToFavorites) {
      const favoriteItem = {
        id: Date.now(),
        type: 'numerology',
        title: `🔢 Нумерология ${new Date(birthDate).toLocaleDateString('ru-RU')}`,
        content: `Число жизни: ${numerologyResult.lifePath?.number}, Судьба: ${numerologyResult.destiny?.number}`,
        date: new Date().toLocaleDateString('ru-RU'),
        source: numerologyResult.source || 'offline'
      };
      
      onAddToFavorites(favoriteItem);
      showToast('💫 Нумерологический расчет добавлен в избранное!');
      hapticFeedback('impact', 'light');
    }
  };

  // Поделиться результатом
  const handleShare = () => {
    if (numerologyResult && telegramApp) {
      const shareText = `🔢 Моя нумерология:\n📅 Дата: ${new Date(birthDate).toLocaleDateString('ru-RU')}\n\n✨ Число жизненного пути: ${numerologyResult.lifePath?.number}\n🎯 Число судьбы: ${numerologyResult.destiny?.number}\n👤 Число личности: ${numerologyResult.personality?.number}\n\n🧙‍♂️ #ГномийГороскоп #Нумерология`;
      
      telegramApp.sendData(JSON.stringify({
        action: 'share_numerology',
        birthDate: birthDate,
        lifePath: numerologyResult.lifePath?.number,
        destiny: numerologyResult.destiny?.number
      }));
      
      hapticFeedback('impact', 'medium');
    }
  };

  return (
    <div className="numerology-view content-enter">
      <div className="card">
        <div className="content-header">
          <h3 className="content-title">🔢 Нумерология</h3>
          <p className="content-subtitle">Откройте тайны своих чисел судьбы</p>
        </div>

        {/* Форма ввода даты */}
        {!showResult && (
          <div className="birth-date-form">
            <div className="form-header">
              <h4 className="form-title">📅 Ваша дата рождения</h4>
              <p className="form-subtitle">Древние гномы-математики раскроют тайны ваших чисел</p>
            </div>

            <div className="date-input-container">
              <div className="date-input-wrapper">
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="date-input"
                  max={new Date().toISOString().split('T')[0]}
                  min={new Date(new Date().getFullYear() - 100, 0, 1).toISOString().split('T')[0]}
                />
                <div className="date-input-icon">🎂</div>
              </div>
              
              {birthDate && isValidDate(birthDate) && (
                <div className="date-preview">
                  <span className="preview-label">Выбранная дата:</span>
                  <span className="preview-date">
                    {new Date(birthDate).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>

            <div className="calculate-section">
              <button 
                className={`btn-calculate ${isCalculating ? 'calculating' : ''}`}
                onClick={handleCalculateNumerology}
                disabled={isCalculating || !birthDate}
              >
                {isCalculating ? (
                  <>
                    <span className="loading-spinner"></span>
                    Гном-математик вычисляет...
                  </>
                ) : (
                  <>
                    <span className="calculate-icon">🧮</span>
                    Рассчитать нумерологию
                  </>
                )}
              </button>
              
              <p className="calculate-hint">
                💡 Результат основан на древних нумерологических методах и мудрости гномов
              </p>
            </div>
          </div>
        )}

        {/* Результат нумерологии */}
        {showResult && numerologyResult && (
          <div ref={resultRef} className={`numerology-result ${animateNumbers ? 'animated' : ''}`}>
            {/* Магические числа */}
            <div className="magic-numbers">
              <div className="numbers-header">
                <h3 className="numbers-title">✨ Ваши магические числа</h3>
                <p className="birth-info">
                  📅 {new Date(birthDate).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>

              <div className="numbers-grid">
                <NumberCard
                  title="Число жизненного пути"
                  number={numerologyResult.lifePath?.number}
                  strength={numerologyResult.lifePath?.strength}
                  icon="🌟"
                  primary={true}
                  animated={animateNumbers}
                />
                <NumberCard
                  title="Число судьбы"
                  number={numerologyResult.destiny?.number}
                  strength={numerologyResult.destiny?.strength}
                  icon="🎯"
                  animated={animateNumbers}
                />
                <NumberCard
                  title="Число личности"
                  number={numerologyResult.personality?.number}
                  strength={numerologyResult.personality?.strength}
                  icon="👤"
                  animated={animateNumbers}
                />
                <NumberCard
                  title="Число души"
                  number={numerologyResult.soul?.number}
                  strength={numerologyResult.soul?.strength}
                  icon="💫"
                  animated={animateNumbers}
                />
              </div>
            </div>

            {/* Детальное описание */}
            {showDetails && (
              <div className="numerology-details">
                <NumerologyDescription 
                  number={numerologyResult.lifePath?.number}
                  type="lifePath"
                  birthDate={birthDate}
                />
              </div>
            )}

            {/* Источник данных */}
            <div className="result-source">
              {numerologyResult.source === 'offline' ? (
                <span className="source-badge offline">📱 Расчетные данные</span>
              ) : (
                <span className="source-badge online">🌐 Нумерологические данные</span>
              )}
            </div>

            {/* Кнопки действий */}
            <div className="result-actions">
              <button 
                className="btn-favorite" 
                onClick={handleAddToFavorites}
                title="Добавить в избранное"
              >
                💫 В избранное
              </button>
              
              {telegramApp && (
                <button 
                  className="btn-primary" 
                  onClick={handleShare}
                  title="Поделиться результатом"
                >
                  📤 Поделиться
                </button>
              )}
              
              <button 
                className="btn-secondary" 
                onClick={handleReset}
                title="Рассчитать для другой даты"
              >
                🔄 Еще раз
              </button>
            </div>
          </div>
        )}

        {/* Кнопка назад */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={onBack}>
            ← Назад
          </button>
        </div>
      </div>
    </div>
  );
}

// Компонент карточки числа
function NumberCard({ title, number, strength, icon, primary = false, animated = false }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [displayStrength, setDisplayStrength] = useState(0);

  useEffect(() => {
    if (animated && number) {
      // Анимация появления числа
      const duration = 1000;
      const steps = 20;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        setDisplayNumber(Math.floor(number * progress));
        setDisplayStrength(Math.floor(strength * progress));
        
        if (currentStep >= steps) {
          setDisplayNumber(number);
          setDisplayStrength(Math.round(strength));
          clearInterval(timer);
        }
      }, stepDuration);
      
      return () => clearInterval(timer);
    }
  }, [animated, number, strength]);

  if (!number) return null;

  return (
    <div className={`number-card ${primary ? 'primary' : ''} ${animated ? 'animate' : ''}`}>
      <div className="card-icon">{icon}</div>
      <div className="card-content">
        <h4 className="card-title">{title}</h4>
        <div className="number-display">
          <span className="main-number">{displayNumber}</span>
        </div>
        <div className="strength-bar">
          <div className="strength-track">
            <div 
              className="strength-fill"
              style={{ width: `${displayStrength}%` }}
            />
          </div>
          <span className="strength-text">{displayStrength}%</span>
        </div>
      </div>
    </div>
  );
}

// Компонент описания числа
function NumerologyDescription({ number, type, birthDate }) {
  const descriptions = {
    1: {
      character: 'Прирожденный лидер и первопроходец. Обладаете сильной волей и независимым характером.',
      destiny: 'Ваше предназначение — возглавлять и вдохновлять других, создавать новое и идти своим путем.',
      advice: 'Доверьтесь своей интуиции и не бойтесь быть первым. Ваша смелость откроет новые возможности.',
      keywords: ['Лидерство', 'Инициатива', 'Независимость', 'Смелость']
    },
    2: {
      character: 'Миротворец и дипломат от природы. Чувствительны и умеете находить компромиссы.',
      destiny: 'Ваш путь — объединять людей, создавать гармонию и поддерживать баланс в отношениях.',
      advice: 'Развивайте свои дипломатические способности. Ваша мягкость — это сила, а не слабость.',
      keywords: ['Дипломатия', 'Сотрудничество', 'Чувствительность', 'Гармония']
    },
    3: {
      character: 'Творческая натура с богатым воображением. Обладаете даром общения и вдохновения.',
      destiny: 'Призваны нести красоту и радость в мир через искусство, творчество и позитивную энергию.',
      advice: 'Не скрывайте свои таланты! Выражайте себя смело — мир нуждается в вашем творчестве.',
      keywords: ['Творчество', 'Общение', 'Оптимизм', 'Вдохновение']
    },
    4: {
      character: 'Практичный и надежный человек. Цените стабильность и умеете упорно работать.',
      destiny: 'Ваша миссия — создавать прочные основы и воплощать идеи в реальность своим трудом.',
      advice: 'Терпение и постоянство — ваши козыри. Медленно, но верно идите к своим целям.',
      keywords: ['Стабильность', 'Трудолюбие', 'Надежность', 'Практичность']
    },
    5: {
      character: 'Свободолюбивая душа и искатель приключений. Любите перемены и новые опыты.',
      destiny: 'Ваш путь — исследовать мир, делиться опытом и вдохновлять других на изменения.',
      advice: 'Не ограничивайте себя рамками. Ваша свобода и гибкость — источник силы и роста.',
      keywords: ['Свобода', 'Приключения', 'Изменения', 'Любознательность']
    },
    6: {
      character: 'Заботливый и ответственный человек. Семья и близкие для вас превыше всего.',
      destiny: 'Призваны нести заботу, создавать уют и исцелять души окружающих людей.',
      advice: 'Ваша доброта — великая сила. Заботьтесь о других, но не забывайте о себе.',
      keywords: ['Забота', 'Семья', 'Ответственность', 'Исцеление']
    },
    7: {
      character: 'Мудрец и мыслитель с глубокой интуицией. Стремитесь к познанию истины.',
      destiny: 'Ваш путь — поиск знаний, духовное развитие и помощь другим в понимании жизни.',
      advice: 'Доверяйте своей интуиции и не бойтесь уединения. В тишине рождается мудрость.',
      keywords: ['Мудрость', 'Интуиция', 'Духовность', 'Познание']
    },
    8: {
      character: 'Амбициозная натура с сильными лидерскими качествами. Стремитесь к успеху и признанию.',
      destiny: 'Ваша миссия — достигать материального благополучия и помогать другим преуспевать.',
      advice: 'Используйте свою силу мудро. Истинный успех приходит через честность и щедрость.',
      keywords: ['Амбиции', 'Успех', 'Лидерство', 'Материальное благополучие']
    },
    9: {
      character: 'Гуманист и альтруист с широкой душой. Обладаете состраданием ко всему живому.',
      destiny: 'Призваны служить человечеству, делиться знаниями и делать мир лучше.',
      advice: 'Ваше предназначение — быть светом для других. Дарите свою любовь щедро.',
      keywords: ['Гуманизм', 'Сострадание', 'Служение', 'Альтруизм']
    }
  };

  const data = descriptions[number] || descriptions[1];

  return (
    <div className="numerology-description">
      <div className="description-header">
        <h4 className="description-title">
          🔮 Анализ числа {number}
        </h4>
      </div>

      <div className="description-content">
        <div className="description-section">
          <h5 className="section-title">👤 Характер</h5>
          <p className="section-text">{data.character}</p>
        </div>

        <div className="description-section">
          <h5 className="section-title">🌟 Предназначение</h5>
          <p className="section-text">{data.destiny}</p>
        </div>

        <div className="description-section">
          <h5 className="section-title">💡 Совет гнома-мудреца</h5>
          <p className="section-text advice-text">{data.advice}</p>
        </div>

        <div className="keywords-section">
          <h5 className="section-title">🏷️ Ключевые качества</h5>
          <div className="keywords-tags">
            {data.keywords.map((keyword, index) => (
              <span key={index} className="keyword-tag">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NumerologyView;
