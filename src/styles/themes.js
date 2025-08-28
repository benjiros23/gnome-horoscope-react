// Простые черно-белые темы
const lightTheme = {
  name: 'light',
  
  // Цвета
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
  
  // Карточки
  card: {
    background: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '16px',
    margin: '8px',
    color: '#212529'
  },
  
  // Кнопки
  button: {
    primary: {
      background: '#007bff',
      color: '#ffffff',
      border: '1px solid #007bff',
      borderRadius: '4px',
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
      borderRadius: '4px',
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
      borderRadius: '4px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  },
  
  // Контейнер
  container: {
    background: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#212529'
  }
};

const darkTheme = {
  name: 'dark',
  
  // Цвета
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
  
  // Карточки
  card: {
    background: '#343a40',
    border: '1px solid #495057',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    padding: '16px',
    margin: '8px',
    color: '#ffffff'
  },
  
  // Кнопки
  button: {
    primary: {
      background: '#0d6efd',
      color: '#ffffff',
      border: '1px solid #0d6efd',
      borderRadius: '4px',
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
      borderRadius: '4px',
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
      borderRadius: '4px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }
  },
  
  // Контейнер
  container: {
    background: '#212529',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#ffffff'
  }
};

// Экспорт только двух тем
const themes = {
  light: lightTheme,
  dark: darkTheme
};

export default themes;
