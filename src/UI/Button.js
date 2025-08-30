import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  style = {},
  className = ''
}) => {
  const { theme } = useTheme();

  const sizes = {
    small: { padding: '8px 16px', fontSize: '12px' },
    medium: { padding: '12px 24px', fontSize: '14px' },
    large: { padding: '16px 32px', fontSize: '16px' }
  };

  const buttonStyle = {
    ...theme.button[variant],
    ...sizes[size],
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ...style
  };

  const handleMouseEnter = (e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(-2px) scale(1.02)';
      e.target.style.filter = 'brightness(1.1)';
    }
  };

  const handleMouseLeave = (e) => {
    if (!disabled && !loading) {
      e.target.style.transform = 'translateY(0) scale(1)';
      e.target.style.filter = 'brightness(1)';
    }
  };

  return (
    <button
      style={buttonStyle}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {loading && (
        <span style={{ 
          animation: theme.animations.spin,
          display: 'inline-block'
        }}>
          ⏳
        </span>
      )}
      {children}
    </button>
  );
};

export default Button;
