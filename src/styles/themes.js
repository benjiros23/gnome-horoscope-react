// src/styles/themes.js

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
    margin: '8px',
    color: '#212529'
  },
  
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
  
  container: {
    background: '#f8f9fa',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#212529'
  },
  
  // ← ДОБАВЬТЕ ЭТО:
  typography: {
    title: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.3',
      marginBottom: '12px'
    },
    body: {              // ← ВОТ ЭТО СВОЙСТВО ОТСУТСТВОВАЛО!
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      marginBottom: '12px'
    },
    caption: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1.4',
      opacity: 0.8
    },
    small: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
      opacity: 0.7
    }
  }
};

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
    margin: '8px',
    color: '#ffffff'
  },
  
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
  
  container: {
    background: '#212529',
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#ffffff'
  },
  
  // ← ДОБАВЬТЕ ЭТО И ДЛЯ ТЕМНОЙ ТЕМЫ:
  typography: {
    title: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '1.2',
      marginBottom: '16px'
    },
    subtitle: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.3',
      marginBottom: '12px'
    },
    body: {              // ← ВОТ ЭТО СВОЙСТВО ОТСУТСТВОВАЛО!
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      marginBottom: '12px'
    },
    caption: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1.4',
      opacity: 0.8
    },
    small: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
      opacity: 0.7
    }
  }
};

const themes = {
  light: lightTheme,
  dark: darkTheme
};

export default themes;
