import React from 'react';
import { pixelTheme, pixelStyles } from '../styles/pixelTheme';

const PixelButton = ({ 
  children, 
  onClick,
  variant = 'primary',
  size = 'normal',
  disabled = false,
  active = false,
  style = {},
  ...props
}) => {
  const variants = {
    primary: pixelTheme.colors.forest,
    secondary: pixelTheme.colors.brown,
    accent: pixelTheme.colors.amber,
    neutral: pixelTheme.colors.sage,
    warning: pixelTheme.colors.olive
  };

  const sizes = {
    small: {
      padding: `${pixelTheme.spacing.xs} ${pixelTheme.spacing.md}`,
      fontSize: pixelTheme.fonts.size.small
    },
    normal: {
      padding: `${pixelTheme.spacing.md} ${pixelTheme.spacing.lg}`,
      fontSize: pixelTheme.fonts.size.normal
    },
    large: {
      padding: `${pixelTheme.spacing.lg} ${pixelTheme.spacing.xl}`,
      fontSize: pixelTheme.fonts.size.large
    }
  };

  const buttonStyle = {
    ...pixelStyles.button,
    backgroundColor: variants[variant] || variants.primary,
    color: pixelTheme.colors.white,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...sizes[size],
    ...(active ? pixelStyles.activeButton : {}),
    ...style
  };

  return (
    <button
      style={buttonStyle}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.target.style.border = pixelTheme.effects.activeBorder;
          e.target.style.transform = 'translate(-1px, -1px)';
          e.target.style.boxShadow = pixelTheme.effects.activeShadow;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) {
          e.target.style.border = pixelTheme.effects.pixelBorder;
          e.target.style.transform = 'translate(0, 0)';
          e.target.style.boxShadow = pixelTheme.effects.pixelShadow;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default PixelButton;
