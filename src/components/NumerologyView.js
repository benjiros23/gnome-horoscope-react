import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from './UI/Card';
import Button from './UI/Button';
import { saveNumerologyResult, loadNumerologyResult } from '../enhanced_cache';

// ===== ПРОФЕССИОНАЛЬНАЯ НУМЕРОЛОГИЧЕСКАЯ СИСТЕМА =====
class ProfessionalNumerology {
  // Значения букв для расчета имени
  static letterValues = {
    'А': 1, 'Б': 2, 'В': 3, 'Г': 4, 'Д': 5, 'Е': 6, 'Ё': 6, 'Ж': 7, 'З': 8, 'И': 9,
    'Й': 1, 'К': 2, 'Л': 3, 'М': 4, 'Н': 5, 'О': 6, 'П': 7, 'Р': 8, 'С': 9, 'Т': 1,
    'У': 2, 'Ф': 3, 'Х': 4, 'Ц': 5, 'Ч': 6, 'Ш': 7, 'Щ': 8, 'Ы': 9, 'Э': 1, 'Ю': 2, 'Я': 3,
    // Английские буквы
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
  };

  // Мастер числа, которые не редуцируются
  static masterNumbers = [11, 22, 33, 44];

  // Правильная редукция чисел с учетом мастер чисел
  static reduceNumber(num) {
    while (num > 9 && !this.masterNumbers.includes(num)) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  }

  // Расчет числа жизненного пути
  static calculateLifePath(day, month, year) {
    const dayReduced = this.reduceNumber(day);
    const monthReduced = this.reduceNumber(month);
    const yearReduced = this.reduceNumber(year);
    
    const total = dayReduced + monthReduced + yearReduced;
    return this.reduceNumber(total);
  }

  // Расчет числа выражения (по полному имени)
  static calculateExpression(fullName) {
    if (!fullName) return null;
    
    const total = fullName.toUpperCase()
      .split('')
      .filter(char => this.letterValues[char])
      .reduce((sum, char) => sum + this.letterValues[char], 0);
      
    return this.reduceNumber(total);
  }

  // Расчет числа души (по гласным в имени)
  static calculateSoulUrge(fullName) {
    if (!fullName) return null;
    
    const vowels = 'АЕЁИОУЫЭЮЯAEIOUY';
    const total = fullName.toUpperCase()
      .split('')
      .filter(char => vowels.includes(char) && this.letterValues[char])
      .reduce((sum, char) => sum + this.letterValues[char], 0);
      
    return this.reduceNumber(total);
  }

  // Расчет числа личности (по согласным в имени)
  static calculatePersonality(fullName) {
    if (!fullName) return null;
    
    const vowels = 'АЕЁИОУЫЭЮЯAEIOUY';
    const total = fullName.toUpperCase()
      .split('')
      .filter(char => !vowels.includes(char) && this.letterValues[char])
      .reduce((sum, char) => sum + this.letterValues[char], 0);
      
    return this.reduceNumber(total);
  }

  // Расчет числа дня рождения
  static calculateBirthDay(day) {
    return this.reduceNumber(day);
  }

  // Расчет личного года
  static calculatePersonalYear(day, month, currentYear = new Date().getFullYear()) {
    const dayReduced = this.reduceNumber(day);
    const monthReduced = this.reduceNumber(month);
    const yearReduced = this.reduceNumber(currentYear);
    
    const total = dayReduced + monthReduced + yearReduced;
    return this.reduceNumber(total);
  }

  // Полный нумерологический профиль
  static generateProfile(birthDate, fullName = '') {
    const [day, month, year] = birthDate.split('.').map(Number);
    
    if (!day || !month || !year) return null;

    const profile = {
      birthData: { day, month, year, birthDate },
      numbers: {
        lifePath: this.calculateLifePath(day, month, year),
        birthDay: this.calculateBirthDay(day),
        personalYear: this.calculatePersonalYear(day, month),
      }
    };

    // Добавляем числа имени, если имя предоставлено
    if (fullName.trim()) {
      profile.numbers.expression = this.calculateExpression(fullName);
      profile.numbers.soulUrge = this.calculateSoulUrge(fullName);
      profile.numbers.personality = this.calculatePersonality(fullName);
      profile.fullName = fullName.trim();
    }

    return profile;
  }
}

// ===== РАСШИРЕННЫЕ ИНТЕРПРЕТАЦИИ =====
class NumerologyInterpretations {
  static descriptions = {
    lifePath: {
      1: {
        title: "Лидер и Первопроходец",
        desc: "Вы прирожденный лидер с сильной волей и независимым характером. Ваша миссия - вести других и создавать новые пути.",
        traits: ["Независимость", "Лидерство", "Инициативность", "Самостоятельность"],
        challenges: ["Избегайте эгоизма", "Развивайте терпение", "Учитесь работать в команде"],
        career: ["Предпринимательство", "Менеджмент", "Политика", "Изобретательство"],
        color: "#FF6B6B"
      },
      2: {
        title: "Дипломат и Миротворец", 
        desc: "Вы чувствительная и дипломатичная натура, которая стремится к гармонии и сотрудничеству с другими.",
        traits: ["Сотрудничество", "Дипломатия", "Чувствительность", "Интуиция"],
        challenges: ["Развивайте уверенность", "Не избегайте конфликтов", "Цените себя"],
        career: ["Психология", "Дипломатия", "Искусство", "Социальная работа"],
        color: "#4ECDC4"
      },
      3: {
        title: "Творец и Вдохновитель",
        desc: "Вы творческая и оптимистичная личность с даром самовыражения и способностью вдохновлять других.",
        traits: ["Творчество", "Оптимизм", "Общительность", "Вдохновение"],
        challenges: ["Фокусируйтесь на одной цели", "Развивайте дисциплину", "Избегайте поверхностности"],
        career: ["Искусство", "Развлечения", "Писательство", "Преподавание"],
        color: "#45B7D1"
      },
      4: {
        title: "Строитель и Организатор",
        desc: "Вы практичная и надежная личность, которая создает прочные основы и ценит порядок и стабильность.",
        traits: ["Надежность", "Практичность", "Организованность", "Трудолюбие"],
        challenges: ["Развивайте гибкость", "Не избегайте перемен", "Цените творчество"],
        career: ["Инженерия", "Архитектура", "Бухгалтерия", "Строительство"],
        color: "#96CEB4"
      },
      5: {
        title: "Искатель Свободы",
        desc: "Вы свободолюбивая и любознательная натура, которая стремится к приключениям и новому опыту.",
        traits: ["Свобода", "Любознательность", "Адаптивность", "Энергичность"],
        challenges: ["Развивайте ответственность", "Завершайте начатое", "Избегайте импульсивности"],
        career: ["Журналистика", "Туризм", "Продажи", "Исследования"],
        color: "#FDCB6E"
      },
      6: {
        title: "Заботливый Наставник",
        desc: "Вы ответственная и заботливая личность, которая стремится помогать другим и создавать гармонию.",
        traits: ["Ответственность", "Забота", "Сострадание", "Служение"],
        challenges: ["Не берите слишком много на себя", "Заботьтесь о себе", "Избегайте контроля"],
        career: ["Медицина", "Образование", "Консультирование", "Социальная сфера"],
        color: "#E17055"
      },
      7: {
        title: "Мистик и Исследователь",
        desc: "Вы аналитичная и духовная личность, которая ищет глубокие истины и тайны жизни.",
        traits: ["Аналитичность", "Духовность", "Интуиция", "Мудрость"],
        challenges: ["Развивайте общительность", "Не изолируйтесь", "Делитесь знаниями"],
        career: ["Наука", "Исследования", "Духовные практики", "Аналитика"],
        color: "#A29BFE"
      },
      8: {
        title: "Амбициозный Материалист",
        desc: "Вы амбициозная и властная личность с сильным стремлением к материальному успеху и признанию.",
        traits: ["Амбициозность", "Власть", "Материальный успех", "Организация"],
        challenges: ["Развивайте духовность", "Избегайте жадности", "Цените отношения"],
        career: ["Бизнес", "Финансы", "Недвижимость", "Управление"],
        color: "#FD79A8"
      },
      9: {
        title: "Гуманист и Мудрец",
        desc: "Вы сострадательная и мудрая личность с широким взглядом на мир и стремлением служить человечеству.",
        traits: ["Сострадание", "Мудрость", "Гуманизм", "Щедрость"],
        challenges: ["Не жертвуйте собой", "Развивайте практичность", "Завершайте проекты"],
        career: ["Благотворительность", "Искусство", "Целительство", "Образование"],
        color: "#00B894"
      },
      11: {
        title: "Духовный Учитель",
        desc: "Вы обладаете высокой интуицией и духовным потенциалом. Ваша миссия - вдохновлять и просвещать других.",
        traits: ["Интуиция", "Вдохновение", "Духовность", "Чувствительность"],
        challenges: ["Развивайте уверенность", "Избегайте нервозности", "Заземляйтесь"],
        career: ["Духовное наставничество", "Психология", "Искусство", "Целительство"],
        color: "#6C5CE7"
      },
      22: {
        title: "Мастер-Строитель",
        desc: "Вы обладаете уникальной способностью воплощать грандиозные идеи в реальность и создавать что-то значимое для мира.",
        traits: ["Видение", "Практичность", "Масштабность", "Организация"],
        challenges: ["Не переоценивайте силы", "Избегайте фанатизма", "Развивайте терпение"],
        career: ["Архитектура", "Инжиниринг", "Политика", "Социальные проекты"],
        color: "#2D3436"
      },
      33: {
        title: "Мастер-Учитель",
        desc: "Вы обладаете исключительным даром исцеления и обучения. Ваша миссия - служить человечеству через любовь и мудрость.",
        traits: ["Служение", "Исцеление", "Мудрость", "Безусловная любовь"],
        challenges: ["Не берите слишком много ответственности", "Заботьтесь о себе", "Избегайте мартирства"],
        career: ["Целительство", "Духовное учительство", "Благотворительность", "Консультирование"],
        color: "#00CEC9"
      }
    },

    personalYear: {
      1: { title: "Год новых начинаний", desc: "Время сеять семена для будущих достижений", advice: "Начинайте новые проекты, проявляйте инициативу" },
      2: { title: "Год сотрудничества", desc: "Время для партнерства и развития отношений", advice: "Работайте в команде, развивайте дипломатию" },
      3: { title: "Год творчества", desc: "Время для самовыражения и творческих проектов", advice: "Развивайтесь творчески, общайтесь активно" },
      4: { title: "Год работы и стабильности", desc: "Время для построения прочных основ", advice: "Работайте упорно, создавайте структуры" },
      5: { title: "Год перемен и свободы", desc: "Время для новых возможностей и путешествий", advice: "Будьте открыты переменам, путешествуйте" },
      6: { title: "Год ответственности", desc: "Время для заботы о семье и близких", advice: "Укрепляйте семейные связи, помогайте другим" },
      7: { title: "Год самопознания", desc: "Время для духовного развития и обучения", advice: "Изучайте себя, развивайтесь духовно" },
      8: { title: "Год достижений", desc: "Время для карьерного роста и материального успеха", advice: "Стремитесь к успеху, развивайте бизнес" },
      9: { title: "Год завершения", desc: "Время для завершения циклов и очищения", advice: "Завершайте старое, готовьтесь к новому" }
    }
  };

  static getDescription(number, type) {
    const desc = this.descriptions[type]?.[number];
    if (!desc) {
      return {
        title: "Особенное число",
        desc: "У вас уникальный путь, требующий индивидуального подхода",
        color: "#667eea"
      };
    }
    return desc;
  }

  static getCompatibility(number1, number2) {
    const compatibilityMatrix = {
      1: { 1: 85, 2: 70, 3: 90, 4: 65, 5: 80, 6: 75, 7: 60, 8: 85, 9: 70 },
      2: { 1: 70, 2: 80, 3: 75, 4: 85, 5: 60, 6: 90, 7: 85, 8: 65, 9: 80 },
      3: { 1: 90, 2: 75, 3: 85, 4: 60, 5: 95, 6: 70, 7: 65, 8: 70, 9: 85 },
      4: { 1: 65, 2: 85, 3: 60, 4: 80, 5: 50, 6: 85, 7: 75, 8: 90, 9: 70 },
      5: { 1: 80, 2: 60, 3: 95, 4: 50, 5: 85, 6: 65, 7: 70, 8: 75, 9: 90 },
      6: { 1: 75, 2: 90, 3: 70, 4: 85, 5: 65, 6: 80, 7: 80, 8: 70, 9: 95 },
      7: { 1: 60, 2: 85, 3: 65, 4: 75, 5: 70, 6: 80, 7: 90, 8: 60, 9: 85 },
      8: { 1: 85, 2: 65, 3: 70, 4: 90, 5: 75, 6: 70, 7: 60, 8: 80, 9: 65 },
      9: { 1: 70, 2: 80, 3: 85, 4: 70, 5: 90, 6: 95, 7: 85, 8: 65, 9: 80 }
    };

    return compatibilityMatrix[number1]?.[number2] || 50;
  }
}

// ===== ВАЛИДАЦИЯ ДАННЫХ =====
class DataValidator {
  static validateDate(dateString) {
    if (!dateString) return { valid: false, error: "Введите дату рождения" };
    
    const dateRegex = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
    const match = dateString.match(dateRegex);
    
    if (!match) {
      return { valid: false, error: "Формат: дд.мм.гггг" };
    }

    const [, day, month, year] = match.map(Number);
    
    if (day < 1 || day > 31) {
      return { valid: false, error: "День должен быть от 1 до 31" };
    }
    
    if (month < 1 || month > 12) {
      return { valid: false, error: "Месяц должен быть от 1 до 12" };
    }
    
    if (year < 1900 || year > new Date().getFullYear()) {
      return { valid: false, error: "Год должен быть от 1900 до текущего года" };
    }

    // Проверка существования даты
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
      return { valid: false, error: "Такой даты не существует" };
    }

    return { valid: true, date: { day, month, year } };
  }

  static validateName(name) {
    if (!name.trim()) return { valid: true }; // Имя необязательно
    
    const nameRegex = /^[А-Яа-яЁёA-Za-z\s]+$/;
    if (!nameRegex.test(name.trim())) {
      return { valid: false, error: "Имя может содержать только буквы и пробелы" };
    }
    
    if (name.trim().length < 2) {
      return { valid: false, error: "Имя должно содержать минимум 2 буквы" };
    }

    return { valid: true, name: name.trim() };
  }
}

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
const NumerologyView = React.memo(({ 
  onAddToFavorites, 
  telegramApp,
  enableCaching = true 
}) => {
  const { theme } = useTheme();
  
  const [birthDate, setBirthDate] = useState('');
  const [fullName, setFullName] = useState('');
  const [result, setResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Мемоизированные стили
  const styles = useMemo(() => ({
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: theme.container.fontFamily
    },

    headerCard: {
      background: 'linear-gradient(135deg, #A29BFE 0%, #6C5CE7 100%)',
      color: '#ffffff',
      textAlign: 'center',
      marginBottom: '24px',
      borderRadius: '16px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    },

    inputCard: {
      marginBottom: '24px'
    },

    inputGroup: {
      marginBottom: '20px'
    },

    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: theme.colors.text
    },

    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: `2px solid ${theme.colors.border}`,
      borderRadius: '12px',
      background: theme.colors.surface || '#ffffff',
      color: theme.colors.text,
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },

    inputError: {
      borderColor: theme.colors.error,
      boxShadow: `0 0 0 3px ${theme.colors.error}20`
    },

    errorText: {
      color: theme.colors.error,
      fontSize: '14px',
      marginTop: '4px'
    },

    numberCard: (color) => ({
      padding: '24px',
      margin: '20px 0',
      background: `linear-gradient(135deg, ${color}15, ${color}08)`,
      border: `2px solid ${color}40`,
      borderRadius: '16px',
      position: 'relative',
      overflow: 'hidden'
    }),

    bigNumber: (color) => ({
      fontSize: '64px',
      fontWeight: '900',
      textAlign: 'center',
      margin: '20px 0',
      color: color,
      textShadow: '0 2px 4px rgba(0,0,0,0.1)',
      animation: 'numberGlow 2s ease-in-out infinite'
    }),

    traitsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginTop: '20px'
    },

    traitCard: {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: '16px'
    }
  }), [theme]);

  // Мемоизированная валидация
  const validation = useMemo(() => {
    const dateValidation = DataValidator.validateDate(birthDate);
    const nameValidation = DataValidator.validateName(fullName);
    
    return {
      date: dateValidation,
      name: nameValidation,
      canCalculate: dateValidation.valid && nameValidation.valid
    };
  }, [birthDate, fullName]);

  // Мемоизированный расчет нумерологии
  const numerologyProfile = useMemo(() => {
    if (!validation.canCalculate) return null;
    
    // Проверяем кеш
    if (enableCaching) {
      const cacheKey = `${birthDate}_${fullName}`;
      const cached = loadNumerologyResult(cacheKey);
      if (cached) {
        console.log('📦 Нумерология загружена из кеша');
        return cached;
      }
    }

    const profile = ProfessionalNumerology.generateProfile(birthDate, fullName);
    
    // Сохраняем в кеш
    if (enableCaching && profile) {
      const cacheKey = `${birthDate}_${fullName}`;
      saveNumerologyResult(cacheKey, profile);
    }

    return profile;
  }, [birthDate, fullName, validation.canCalculate, enableCaching]);

  // Обработчики
  const handleCalculate = useCallback(() => {
    if (!validation.canCalculate) return;

    setIsCalculating(true);
    setErrors({});

    setTimeout(() => {
      setResult(numerologyProfile);
      setIsCalculating(false);

      // Haptic feedback
      try {
        telegramApp?.HapticFeedback?.notificationOccurred('success');
      } catch (error) {
        console.log('Haptic feedback недоступен');
      }
    }, 1500);
  }, [validation.canCalculate, numerologyProfile, telegramApp]);

  const handleAddToFavorites = useCallback(() => {
    if (!result || !onAddToFavorites) return;

    const favoriteData = {
      type: 'numerology',
      title: `Нумерология: ${result.fullName || 'Анонимный профиль'}`,
      content: `Жизненный путь: ${result.numbers.lifePath}, День рождения: ${result.numbers.birthDay}${result.numbers.expression ? `, Выражение: ${result.numbers.expression}` : ''}`,
      date: new Date().toLocaleDateString('ru-RU'),
      numerologyData: result
    };

    onAddToFavorites(favoriteData);

    try {
      telegramApp?.HapticFeedback?.notificationOccurred('success');
    } catch (error) {
      console.log('Haptic feedback недоступен');
    }
  }, [result, onAddToFavorites, telegramApp]);

  // Компонент числовой карточки
  const NumberCard = React.memo(({ number, type, title, icon }) => {
    const description = NumerologyInterpretations.getDescription(number, type);
    
    return (
      <div style={styles.numberCard(description.color)}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '700',
          textAlign: 'center',
          color: theme.colors.text,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {icon} {title}
        </h3>

        <div style={styles.bigNumber(description.color)}>
          {number}
        </div>

        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'inline-block',
            background: `${description.color}20`,
            color: description.color,
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '16px',
            fontWeight: '700',
            marginBottom: '12px'
          }}>
            {description.title}
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '16px',
          lineHeight: '1.6',
          color: theme.colors.text,
          marginBottom: '20px'
        }}>
          {description.desc}
        </p>

        {showAdvanced && description.traits && (
          <div style={styles.traitsGrid}>
            <div style={styles.traitCard}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: description.color }}>
                ✨ Сильные стороны
              </h4>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px' }}>
                {description.traits.map((trait, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>{trait}</li>
                ))}
              </ul>
            </div>

            {description.challenges && (
              <div style={styles.traitCard}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: theme.colors.warning }}>
                  🎯 Задачи роста
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px' }}>
                  {description.challenges.map((challenge, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{challenge}</li>
                  ))}
                </ul>
              </div>
            )}

            {description.career && (
              <div style={styles.traitCard}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: theme.colors.info }}>
                  💼 Карьерные направления
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px' }}>
                  {description.career.map((career, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{career}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  });

  NumberCard.displayName = 'NumberCard';

  return (
    <div style={styles.container}>
      {/* CSS анимации */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes numberGlow {
          0%, 100% { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          50% { text-shadow: 0 4px 8px rgba(0,0,0,0.3), 0 0 20px currentColor; }
        }
      `}</style>

      {/* Заголовок */}
      <div style={styles.headerCard}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          fontSize: '100px',
          opacity: 0.1,
          pointerEvents: 'none'
        }}>
          🔢
        </div>
        
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700',
          margin: '0 0 8px 0',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          🔢 Профессиональная Нумерология
        </h1>
        <p style={{ 
          fontSize: '16px', 
          opacity: 0.9,
          margin: 0,
          fontWeight: '400'
        }}>
          Раскройте тайны своих чисел судьбы
        </p>
      </div>

      {/* Форма ввода данных */}
      <Card style={styles.inputCard} title="📋 Ваши данные">
        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="birthDate">
            📅 Дата рождения *
          </label>
          <input
            id="birthDate"
            type="text"
            placeholder="дд.мм.гггг"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.date ? styles.inputError : {})
            }}
          />
          {!validation.date.valid && validation.date.error && (
            <div style={styles.errorText}>{validation.date.error}</div>
          )}
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label} htmlFor="fullName">
            👤 Полное имя (необязательно)
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Иван Петров"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              ...styles.input,
              ...(errors.name ? styles.inputError : {})
            }}
          />
          {!validation.name.valid && validation.name.error && (
            <div style={styles.errorText}>{validation.name.error}</div>
          )}
          <div style={{ fontSize: '12px', color: theme.colors.textSecondary, marginTop: '4px' }}>
            💡 Имя позволит рассчитать дополнительные числа личности
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button
            variant="primary"
            onClick={handleCalculate}
            disabled={!validation.canCalculate || isCalculating}
            style={{ marginRight: '12px' }}
          >
            {isCalculating ? (
              <>
                <span style={{ 
                  display: 'inline-block',
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px'
                }}>🔄</span>
                Вычисляем магию чисел...
              </>
            ) : (
              <>🧮 Рассчитать нумерологию</>
            )}
          </Button>

          {result && (
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? '📊 Скрыть детали' : '📈 Подробный анализ'}
            </Button>
          )}
        </div>

        <div style={{
          fontSize: '12px',
          color: theme.colors.textSecondary,
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          💡 Расчеты основаны на классической западной нумерологии
        </div>
      </Card>

      {/* Результаты */}
      {result && (
        <div>
          {/* Основные числа */}
          <NumberCard
            number={result.numbers.lifePath}
            type="lifePath"
            title="Число жизненного пути"
            icon="🛤️"
          />

          <NumberCard
            number={result.numbers.birthDay}
            type="lifePath"
            title="Число дня рождения"
            icon="🎂"
          />

          <NumberCard
            number={result.numbers.personalYear}
            type="personalYear"
            title="Персональный год"
            icon="📅"
          />

          {/* Числа имени (если указано имя) */}
          {result.numbers.expression && (
            <NumberCard
              number={result.numbers.expression}
              type="lifePath"
              title="Число выражения"
              icon="💫"
            />
          )}

          {result.numbers.soulUrge && (
            <NumberCard
              number={result.numbers.soulUrge}
              type="lifePath"
              title="Число души"
              icon="💖"
            />
          )}

          {result.numbers.personality && (
            <NumberCard
              number={result.numbers.personality}
              type="lifePath"
              title="Число личности"
              icon="🎭"
            />
          )}

          {/* Кнопка добавления в избранное */}
          <div style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              variant="primary"
              onClick={handleAddToFavorites}
            >
              ⭐ Добавить в избранное
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

NumerologyView.displayName = 'NumerologyView';

export default NumerologyView;
