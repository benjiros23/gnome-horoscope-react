// src/components/LoadingSpinner.js
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoadingSpinner = ({ message = 'Загружаем данные...' }) => {
  const { theme } = useTheme();

  const spinnerStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      textAlign: 'center'
    },
    spinner: {
      fontSize: '3rem',
      animation: 'spin 2s linear infinite',
      marginBottom: theme.spacing.md
    },
    message: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.sizes.md
    }
  };

  return (
    <div style={spinnerStyles.container}>
      <div style={spinnerStyles.spinner}>🔮</div>
      <p style={spinnerStyles.message}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
