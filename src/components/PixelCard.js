import React from 'react';
import { pixelTheme, pixelStyles } from '../styles/pixelTheme';

const PixelCard = ({ 
  title, 
  children, 
  backgroundColor = pixelTheme.colors.sage,
  titleColor = pixelTheme.colors.forest,
  className = '',
  style = {}
}) => {
  const cardStyles = {
    container: {
      ...pixelStyles.card,
      backgroundColor: backgroundColor,
      padding: pixelTheme.spacing.lg,
      margin: pixelTheme.spacing.md,
      ...style
    },
    
    title: {
      fontSize: pixelTheme.fonts.size.large,
      fontWeight: 'bold',
      color: pixelTheme.colors.black,
      textAlign: 'center',
      marginBottom: pixelTheme.spacing.md,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      backgroundColor: titleColor,
      color: pixelTheme.colors.white,
      padding: pixelTheme.spacing.md,
      margin: `-${pixelTheme.spacing.lg} -${pixelTheme.spacing.lg} ${pixelTheme.spacing.md}`,
      border: pixelTheme.effects.pixelBorder,
      borderRadius: '8px 8px 0 0'
    },
    
    content: {
      fontFamily: pixelTheme.fonts.pixel,
      fontSize: pixelTheme.fonts.size.normal,
      color: pixelTheme.colors.black,
      lineHeight: '1.4'
    }
  };

  return (
    <div style={cardStyles.container} className={className}>
      {title && <div style={cardStyles.title}>{title}</div>}
      <div style={cardStyles.content}>
        {children}
      </div>
    </div>
  );
};

export default PixelCard;
