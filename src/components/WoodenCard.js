import React from 'react';

const WoodenCard = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  style = {},
  variant = 'oak', // 'oak', 'mahogany', 'pine'
  onClick
}) => {
  const woodVariants = {
    oak: {
      background: 'linear-gradient(135deg, #d2b48c 0%, #cd853f  50%, #a0522d 100%)',
      border: '3px solid #8b4513',
      textColor: '#3e2723'
    },
    mahogany: {
      background: 'linear-gradient(135deg, #c04000 0%, #8b0000 50%, #5d4037 100%)',
      border: '3px solid #4e342e',
      textColor: '#fff8e1'
    },
    pine: {
      background: 'linear-gradient(135deg, #deb887 0%, #bc9a6a 50%, #8d6e63 100%)',
      border: '3px solid #6d4c41',
      textColor: '#2e2e2e'
    }
  };

  const currentVariant = woodVariants[variant] || woodVariants.oak;

  const woodStyle = {
    background: currentVariant.background,
    borderRadius: '16px',
    border: currentVariant.border,
    boxShadow: `
      inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
      0 8px 24px 0 rgba(0, 0, 0, 0.25),
      0 2px 8px 0 rgba(0, 0, 0, 0.15)
    `,
    padding: '24px',
    margin: '16px',
    color: currentVariant.textColor,
    fontFamily: '"Times New Roman", Georgia, serif',
    transition: 'all 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
    ...style
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '8px',
    color: currentVariant.textColor,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)'
  };

  const subtitleStyle = {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '16px',
    color: currentVariant.textColor,
    fontStyle: 'italic',
    opacity: 0.9
  };

  // Деревянная текстура (псевдо-эффект)
  const grainStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      repeating-linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.1) 0px,
        transparent 1px,
        transparent 3px,
        rgba(0, 0, 0, 0.05) 4px
      )
    `,
    opacity: 0.6,
    pointerEvents: 'none'
  };

  return (
    <div 
      style={woodStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(-3px) scale(1.02)';
          e.target.style.boxShadow = `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.4),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.3),
            0 12px 32px 0 rgba(0, 0, 0, 0.3),
            0 4px 16px 0 rgba(0, 0, 0, 0.2)
          `;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(0) scale(1)';
          e.target.style.boxShadow = `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
            0 8px 24px 0 rgba(0, 0, 0, 0.25),
            0 2px 8px 0 rgba(0, 0, 0, 0.15)
          `;
        }
      }}
    >
      <div style={grainStyle}></div>
      
      {title && <h3 style={titleStyle}>{title}</h3>}
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default WoodenCard;
