// src/errorBoundary.js
import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Ошибка приложения:', error, errorInfo);

    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.sendData(
          JSON.stringify({
            action: 'error',
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
          })
        );
      } catch {
        console.log('⚠️ Ошибка отправки данных в Telegram');
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.wrapper}>
          <div style={styles.card}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔧</div>
            <h2 style={{ color: '#8BC34A', marginBottom: '16px' }}>
              Упс! Что-то пошло не так
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              Попробуйте обновить страницу.
            </p>
            <button onClick={() => window.location.reload()} style={styles.button}>
              🔄 Обновить страницу
            </button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '20px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#8BC34A' }}>
                  Детали ошибки
                </summary>
                <pre style={styles.pre}>
                  {this.state.error?.stack ||
                    this.state.error?.message ||
                    'Неизвестная ошибка'}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  wrapper: {
    padding: '40px 20px',
    textAlign: 'center',
    background: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E8 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  card: {
    background: 'white',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    maxWidth: '400px',
    width: '90%',
  },
  button: {
    background: 'linear-gradient(135deg, #8BC34A 0%, #FFC107 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  pre: {
    background: '#f5f5f5',
    padding: '12px',
    borderRadius: '4px',
    fontSize: '12px',
    overflow: 'auto',
    marginTop: '8px',
  },
};
