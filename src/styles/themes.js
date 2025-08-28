// Facebook тема
const facebookTheme = {
  name: 'facebook',
  
  colors: {
    primary: '#1877F2',        // Facebook синий
    secondary: '#42A5F5',      // Светло-синий
    success: '#00C851',        // Зеленый
    danger: '#FF3547',         // Красный
    warning: '#FFB400',        // Желтый
    info: '#33B5E5',          // Голубой
    
    background: '#F0F2F5',     // Facebook серый фон
    surface: '#FFFFFF',        // Белые карточки
    text: '#050505',           // Черный текст
    textSecondary: '#65676B',  // Серый текст
    border: '#CED0D4'          // Серая граница
  },
  
  card: {
    background: '#FFFFFF',
    border: '1px solid #E4E6EA',
    borderRadius: '12px',               // Facebook скругления
    boxShadow: '0 2px 4px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)',
    padding: '16px',
    margin: '8px 4px',                  // Уменьшенные отступы для мобильных
    color: '#050505',
    maxWidth: '100%',                   // Адаптивность
    overflow: 'hidden'                  // Предотвращает выход за границы
  },
  
  button: {
    primary: {
      background: '#1877F2',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',              // Facebook стиль кнопок
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    secondary: {
      background: '#E4E6EA',
      color: '#050505',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    ghost: {
      background: 'transparent',
      color: '#1877F2',
      border: '1px solid #1877F2',
      borderRadius: '8px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  },
  
  container: {
    background: '#F0F2F5',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#050505',
    padding: '0',                       // Убираем padding у контейнера
    margin: '0'
  },
  
  typography: {
    title: {
      fontSize: '20px',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '8px',
      color: '#050505'
    },
    subtitle: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1.3',
      marginBottom: '8px',
      color: '#65676B'
    },
    body: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.4',
      marginBottom: '8px',
      color: '#050505'
    },
    caption: {
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '1.4',
      opacity: 0.8,
      color: '#65676B'
    }
  }
};

// Обновленная светлая тема с улучшенной адаптивностью
const lightTheme = {
  name: 'light',
  
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    textSecondary: '#6c757d',
    border: '#dee2e6'
  },
  
  card: {
    background: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '16px',
    margin: '8px 4px',                  // Адаптивные отступы
    color: '#212529',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  
  button: {
    primary: {
      background: '#007bff',
      color: '#ffffff',
      border: '1px solid #007bff',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    secondary: {
      background: '#6c757d',
      color: '#ffffff',
      border: '1px solid #6c757d',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    ghost: {
      background: 'transparent',
      color: '#007bff',
      border: '1px solid #007bff',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  },
  
  container: {
    background: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#212529',
    padding: '0',
    margin: '0'
  },
  
  typography: {
    title: { fontSize: '20px', fontWeight: '700', lineHeight: '1.2', marginBottom: '12px' },
    subtitle: { fontSize: '16px', fontWeight: '600', lineHeight: '1.3', marginBottom: '8px' },
    body: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5', marginBottom: '8px' },
    caption: { fontSize: '12px', fontWeight: '500', lineHeight: '1.4', opacity: 0.8 }
  }
};

// Темная тема с улучшениями
const darkTheme = {
  name: 'dark',
  
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    background: '#212529',
    surface: '#343a40',
    text: '#ffffff',
    textSecondary: '#adb5bd',
    border: '#495057'
  },
  
  card: {
    background: '#343a40',
    border: '1px solid #495057',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    padding: '16px',
    margin: '8px 4px',
    color: '#ffffff',
    maxWidth: '100%',
    overflow: 'hidden'
  },
  
  button: {
    primary: {
      background: '#0d6efd',
      color: '#ffffff',
      border: '1px solid #0d6efd',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    secondary: {
      background: '#6c757d',
      color: '#ffffff',
      border: '1px solid #6c757d',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    ghost: {
      background: 'transparent',
      color: '#0d6efd',
      border: '1px solid #0d6efd',
      borderRadius: '6px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  },
  
  container: {
    background: '#212529',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#ffffff',
    padding: '0',
    margin: '0'
  },
  
  typography: {
    title: { fontSize: '20px', fontWeight: '700', lineHeight: '1.2', marginBottom: '12px' },
    subtitle: { fontSize: '16px', fontWeight: '600', lineHeight: '1.3', marginBottom: '8px' },
    body: { fontSize: '14px', fontWeight: '400', lineHeight: '1.5', marginBottom: '8px' },
    caption: { fontSize: '12px', fontWeight: '500', lineHeight: '1.4', opacity: 0.8 }
  }
};

// Экспорт всех тем
const themes = {
  light: lightTheme,
  dark: darkTheme,
  facebook: facebookTheme  // ← Новая Facebook тема!
};

console.log('🎨 Темы загружены:', Object.keys(themes));

export default themes;
