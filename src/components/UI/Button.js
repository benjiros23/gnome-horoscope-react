import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const Button = ({ children, variant = 'primary', onClick, style = {} }) => {
  const { theme } = useTheme();

  const buttonStyle = {
    ...theme.button[variant],
    ...style
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
