import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import useAPI from '../hooks/useAPI';
import { saveHoroscope, loadHoroscope } from '../enhanced_cache';

const HoroscopeView = ({
  selectedSign,
  gnomeProfile,
  onAddToFavorites,
  telegramApp,
  astrologyData,
  onSignSelect
}) => {
  const { theme } = useTheme();
  const { getHoroscope, loading: apiLoading, error: apiError } = useAPI();
  
  const [horoscopeData, setHoroscopeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastLoadedSign, setLastLoadedSign] = useState(selectedSign);

  // Мемоизированные значения
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const horoscopeContent = useMemo(() => {
    if (!horoscopeData) return null;
    
    return horoscopeData.horoscope?.general ||
           horoscopeData.prediction ||
           horoscopeData.text ||
           horoscopeData.horoscope ||
           horoscopeData.content ||
           'Персональный гороскоп на день';
  }, [horoscopeData]);

  // Генерация fallback гороскопа
  const generateFallbackHoroscope = useCallback((sign) => {
    const gnome = gnomeProfile || { name: 'Гном-астролог', title: 'Мастер предсказаний' };
    
    const predictions = {
      'Овен': 'Ваша энергия и решительность сегодня на пике! Гном Огнебород видит успех в смелых начинаниях.',
      'Телец': 'Стабильность и упорство принесут плоды. Гном Златоруд советует инвестировать в долгосрочные цели.',
      'Близнецы': 'День полон интересных встреч и открытий. Гном Двойняшка предвещает важные новости.',
      'Рак': 'Интуиция подскажет верные решения. Гном Домовой рекомендует довериться внутреннему голосу.',
      'Лев': 'Ваш природный магнетизм привлекает удачу! Гном Златогрив видит признание ваших талантов.',
      'Дева': 'Внимание к деталям откроет новые возможности. Гном Аккуратный одобряет ваш подход.',
      'Весы': 'Гармония в отношениях принесет радость. Гном Справедливый советует искать компромиссы.',
      'Скорпион': 'Глубокие трансформации ведут к росту. Гном Тайновед раскрывает скрытые возможности.',
      'Стрелец': 'Новые горизонты манят вас вперед! Гном Путешественник благословляет ваши планы.',
      'Козерог': 'Целеустремленность приведет к вершинам. Гном Горовосходитель поддерживает ваши амбиции.',
      'Водолей': 'Оригинальные идеи изменят многое. Гном Изобретатель вдохновляет на творчество.',
      'Рыбы': 'Творческая энергия течет мощным потоком. Гном Мечтатель открывает новые миры.'
    };

    return {
      horoscope: predictions[sign] || predictions['Лев'],
      sign,
      date: today,
      gnome: gnome.name,
      source: 'fallback',
      sections: {
        general: predictions[sign] || predictions['Лев'],
        love: 'Звезды благоволят сердечным делам. Открытость принесет взаимопонимание.',
        work: 'Профессиональная сфера требует внимания. Ваши усилия будут вознаграждены.',
        health: 'Прислушивайтесь к потребностям организма. Баланс - ключ к хорошему самочувствию.'
      }
    };
  }, [gnomeProfile, today]);

  // Основная функция загрузки гороскопа
  const loadDailyHoroscope = useCallback(async (sign = selectedSign) => {
    if (loading || !sign) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔮 Загружаем гороскоп для', sign);

      // Проверяем кеш
      let dailyHoroscope = loadHoroscope(sign);
      
      if (dailyHoroscope && dailyHoroscope.generatedDate === today) {
        console.log('📦 Гороскоп загружен из кеша для', sign);
        setHoroscopeData(dailyHoroscope);
        setLastLoadedSign(sign);
        return;
      }

      // Загружаем с API
      try {
        console.log('🌐 Получаем гороскоп с сервера для', sign);
        const apiData = await getHoroscope(sign);
        
        if (apiData && (apiData.horoscope || apiData.prediction || apiData.text)) {
          const fixedHoroscope = {
            ...apiData,
            generatedDate: today,
            sign: sign,
            cached: true,
            source: 'api',
            expiresAt: new Date(new Date().setHours(23, 59, 59, 999)).toISOString()
          };

          saveHoroscope(sign, fixedHoroscope);
          setHoroscopeData(fixedHoroscope);
          setLastLoadedSign(sign);
          console.log('✅ Гороскоп получен с API и сохранен в кеш');
          return;
        }
      } catch (apiError) {
        console.warn('⚠️ API недоступен, используем fallback:', apiError.message);
      }

      // Fallback гороскоп
      const fallbackHoroscope = generateFallbackHoroscope(sign);
      setHoroscopeData(fallbackHoroscope);
      setLastLoadedSign(sign);
      console.log('🆘 Использован fallback гороскоп');

    } catch (err) {
      console.error('❌ Ошибка загрузки гороскопа:', err);
      setError(err.message);
      
      // Даже при ошибке показываем fallback
      const fallbackHoroscope = generateFallbackHoroscope(sign);
      setHoroscopeData(fallbackHoroscope);
    } finally {
      setLoading(false);
    }
  }, [selectedSign, getHoroscope, loadHoroscope, saveHoroscope, generateFallbackHoroscope, today, loading]);

  // Эффект загрузки при изменении знака
  useEffect(() => {
    if (selectedSign !== lastLoadedSign) {
      loadDailyHoroscope(selectedSign);
    }
  }, [selectedSign, lastLoadedSign, loadDailyHoroscope]);

  // Добавление в избранное
  const handleAddToFavorites = useCallback(() => {
    if (!horoscopeData || !onAddToFavorites) return;

    const favoriteItem = {
      type: 'horoscope',
      title: `${selectedSign} - ${new Date().toLocaleDateString('ru-RU')}`,
      content: horoscopeContent,
      date: new Date().toLocaleDateString('ru-RU'),
      sign: selectedSign,
      gnome: gnomeProfile?.name || 'Гном-астролог'
    };

    onAddToFavorites(favoriteItem);

    // Уведомление
    const message = 'Гороскоп добавлен в избранное! ⭐';
    if (telegramApp?.showAlert) {
      telegramApp.showAlert(message);
    } else {
      console.log(message);
    }
  }, [horoscopeData, horoscopeContent, onAddToFavorites, selectedSign, gnomeProfile, telegramApp]);

  // Обновление гороскопа
  const handleRefresh = useCallback(() => {
    // Очищаем кеш для текущего знака
    try {
      const cacheKey = `horoscope_${selectedSign}_${today}`;
      localStorage.removeItem(`gnome_cache_${cacheKey}`);
    } catch (e) {
      console.warn('Не удалось очистить кеш:', e);
    }
    
    loadDailyHoroscope(selectedSign);
  }, [selectedSign, today, loadDailyHoroscope]);

  // Лунное влияние
  const lunarInfluence = useMemo(() => {
    if (!astrologyData?.moon) return null;

    const { phase, isWaxing, emoji } = astrologyData.moon;
    
    const influences = {
      'Новолуние': 'время новых начинаний и постановки целей',
      'Молодая луна': 'период роста и активных действий',
      'Первая четверть': 'время преодоления препятствий',
      'Растущая луна': 'период накопления сил и развития',
      'Полнолуние': 'пик энергии и завершения дел',
      'Убывающая луна': 'время освобождения от лишнего',
      'Последняя четверть': 'период переосмысления и анализа',
      'Старая луна': 'время подготовки к новому циклу'
    };

    const influence = influences[phase] || 'особое астрологическое влияние';
    
    return `${emoji} Сегодня ${phase.toLowerCase()} - ${influence}. ${
      isWaxing 
        ? 'Растущая луна поддерживает ваши амбиции и новые планы.' 
        : 'Убывающая луна помогает завершить важные дела и отпустить лишнее.'
    }`;
  }, [astrologyData]);

  // Стили компонента
  const styles = useMemo(() => ({
    container: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto'
    },
    
    header: {
      textAlign: 'center',
      marginBottom: '24px'
    },
    
    signTitle: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    
    gnomeInfo: {
      background: 'rgba(100, 126, 234, 0.1)',
      border: '1px solid rgba(100, 126, 234, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px',
      textAlign: 'center'
    },
    
    gnomeName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#667eea',
      marginBottom: '4px'
    },
    
    gnomeTitle: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.8)',
      fontStyle: 'italic'
    },
    
    horoscopeText: {
      fontSize: '16px',
      lineHeight: '1.6',
      color: '#ffffff',
      marginBottom: '20px',
      padding: '20px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    
    sectionsContainer: {
      display: 'grid',
      gap: '16px',
      marginBottom: '24px'
    },
    
    sectionCard: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '16px'
    },
    
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#667eea',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    
    sectionText: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: 'rgba(255,255,255,0.9)'
    },
    
    lunarCard: {
      background: 'linear-gradient(135deg, rgba(244,197,66,0.1), rgba(255,215,0,0.05))',
      border: '1px solid rgba(244,197,66,0.3)',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '24px'
    },
    
    lunarText: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#ffffff',
      textAlign: 'center'
    },
    
    buttonsContainer: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    
    loadingContainer: {
      textAlign: 'center',
      padding: '40px 20px'
    },
    
    spinner: {
      fontSize: '48px',
      marginBottom: '16px',
      animation: 'spin 2s linear infinite'
    },
    
    errorContainer: {
      textAlign: 'center',
      padding: '40px 20px'
    }
  }), []);

  // Рендер состояния загрузки
  if (loading && !horoscopeData) {
    return (
      <div style={styles.container}>
        <Card>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}>🔮</div>
            <h3 style={{ color: '#667eea', marginBottom: '8px' }}>
              Гномы изучают звезды для вас...
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
              Составляем персональный прогноз для {selectedSign}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Рендер ошибки
  if (error && !horoscopeData) {
    return (
      <div style={styles.container}>
        <Card>
          <div style={styles.errorContainer}>
            <h3 style={{ color: '#f44336', marginBottom: '16px' }}>
              ⚠️ Не удалось загрузить гороскоп
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '20px', fontSize: '14px' }}>
              {error}
            </p>
            <Button onClick={handleRefresh}>
              🔄 Попробовать снова
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Добавляем CSS анимации */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Заголовок */}
      <div style={styles.header}>
        <h1 style={styles.signTitle}>
          {selectedSign}
          <span style={{ fontSize: '32px' }}>
            {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'][
              ['Овен','Телец','Близнецы','Рак','Лев','Дева','Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'].indexOf(selectedSign)
            ] || '⭐'}
          </span>
        </h1>
      </div>

      {/* Информация о гноме */}
      {gnomeProfile && (
        <div style={styles.gnomeInfo}>
          <div style={styles.gnomeName}>{gnomeProfile.name}</div>
          <div style={styles.gnomeTitle}>{gnomeProfile.title}</div>
        </div>
      )}

      {/* Основной гороскоп */}
      <Card title="🔮 Ваш гороскоп на сегодня">
        <div style={styles.horoscopeText}>
          {horoscopeContent}
        </div>
        
        {horoscopeData?.source && (
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.5)', 
            textAlign: 'center',
            marginTop: '16px'
          }}>
            Источник: {horoscopeData.source === 'api' ? 'API' : 
                      horoscopeData.source === 'cache' ? 'Кеш' : 
                      horoscopeData.source === 'fallback' ? '
