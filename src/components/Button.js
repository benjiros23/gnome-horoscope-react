import React from 'react';

const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick, 
  disabled = false,
  style = {},
  className = '',
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
    },
    secondary: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
      boxShadow: 'none'
    },
    ghost: {
      background: 'transparent',
      color: '#333333',
      border: '1px solid #e1e5e9',
      boxShadow: 'none'
    }
  };

  const sizes = {
    small: { 
      padding: '6px 12px', 
      fontSize: '12px',
      borderRadius: '6px'
    },
    medium: { 
      padding: '12px 24px', 
      fontSize: '16px',
      borderRadius: '8px'
    },
    large: { 
      padding: '16px 32px', 
      fontSize: '18px',
      borderRadius: '10px'
    }
  };

  const buttonStyle = {
    ...variants[variant] || variants.primary,
    ...sizes[size] || sizes.medium,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.3s ease',
    fontWeight: '600',
    outline: 'none',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    userSelect: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    ...style
  };

  return (
    <button
      type={type}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
