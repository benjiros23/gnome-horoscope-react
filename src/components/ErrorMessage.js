// src/components/ErrorMessage.js
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Button from './UI/Button';

const ErrorMessage = ({ error, onRetry }) => {
  const { theme } = useTheme();

  const errorStyles = {
    container: {
      padding: theme.spacing.lg,
      textAlign: 'center',
      backgroundColor: `${theme.colors.danger}20`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.danger}40`,
      margin: theme.spacing.md
    },
    title: {
      color: theme.colors.danger,
      fontSize: theme.typography.sizes.lg,
      fontWeight: theme.typography.weights.bold,
      marginBottom: theme.spacing.sm
    },
    message: {
      color: theme.colors.text,
      fontSize: theme.typography.sizes.md,
      marginBottom: theme.spacing.lg
    }
  };

  return (
    <div style={errorStyles.container}>
      <h3 style={errorStyles.title}>⚠️ Ошибка загрузки</h3>
      <p style={errorStyles.message}>{error}</p>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          🔄 Попробовать снова
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
