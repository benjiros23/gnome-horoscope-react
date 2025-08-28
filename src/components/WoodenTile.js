import React from 'react';

const WoodenTile = ({ 
  icon,
  title, 
  subtitle,
  onClick,
  variant = 'oak',
  disabled = false,
  active = false,
  size = 'normal' // 'small', 'normal', 'large'
}) => {
  const woodVariants = {
    oak: {
      background: 'linear-gradient(135deg, #d2b48c 0%, #cd853f 50%, #a0522d 100%)',
      border: '3px solid #8b4513',
      textColor: '#3e2723',
      shadowColor: 'rgba(139, 69, 19, 0.3)'
    },
    mahogany: {
      background: 'linear-gradient(135deg, #c04000 0%, #8b0000 50%, #5d4037 100%)',
      border: '3px solid #4e342e',
      textColor: '#fff8e1',
      shadowColor: 'rgba(78, 52, 46, 0.3)'
    },
    pine: {
      background: 'linear-gradient(135deg, #deb887 0%, #bc9a6a 50%, #8d6e63 100%)',
      border: '3px solid #6d4c41',
      textColor: '#2e2e2e',
      shadowColor: 'rgba(109, 76, 65, 0.3)'
    }
  };

  const sizes = {
    small: { width: '80px', height: '80px', fontSize: '12px', iconSize: '24px' },
    normal: { width: '120px', height: '120px', fontSize: '14px', iconSize: '32px' },
    large: { width: '160px', height: '160px', fontSize: '16px', iconSize: '40px' }
  };

  const currentVariant = woodVariants[variant] || woodVariants.oak;
  const currentSize = sizes[size] || sizes.normal;

  const tileStyle = {
    background: disabled ? 'linear-gradient(135deg, #999 0%, #666 50%, #444 100%)' : currentVariant.background,
    borderRadius: '16px',
    border: disabled ? '3px solid #555' : currentVariant.border,
    boxShadow: active ? `
      inset 0 4px 0 0 rgba(0, 0, 0, 0.3),
      inset 0 -4px 0 0 rgba(255, 255, 255, 0.2),
      0 4px 12px 0 ${currentVariant.shadowColor}
    ` : `
      inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
      inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
      0 8px 24px 0 rgba(0, 0, 0, 0.25),
      0 2px 8px 0 rgba(0, 0, 0, 0.15)
    `,
    width: currentSize.width,
    height: currentSize.height,
    color: disabled ? '#aaa' : currentVariant.textColor,
    fontFamily: '"Times New Roman", Georgia, serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    position: 'relative',
    overflow: 'hidden',
    textShadow: disabled ? 'none' : '1px 1px 2px rgba(0, 0, 0, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px',
    margin: '8px',
    textAlign: 'center',
    userSelect: 'none',
    transform: active ? 'scale(0.95)' : 'scale(1)',
    opacity: disabled ? 0.6 : 1
  };

  const iconStyle = {
    fontSize: currentSize.iconSize,
    marginBottom: '8px',
    filter: disabled ? 'grayscale(100%)' : 'drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))',
    transition: 'all 0.3s ease'
  };

  const titleStyle = {
    fontSize: currentSize.fontSize,
    fontWeight: '700',
    marginBottom: subtitle ? '4px' : '0',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    lineHeight: '1.2'
  };

  const subtitleStyle = {
    fontSize: Math.max(10, parseInt(currentSize.fontSize) - 2) + 'px',
    fontWeight: '400',
    opacity: 0.8,
    fontStyle: 'italic',
    lineHeight: '1.1'
  };

  // Деревянная текстура
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
    opacity: disabled ? 0.3 : 0.6,
    pointerEvents: 'none'
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <div 
      style={tileStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
          e.currentTarget.style.boxShadow = `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.4),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.3),
            0 12px 32px 0 rgba(0, 0, 0, 0.3),
            0 4px 16px 0 rgba(0, 0, 0, 0.2)
          `;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = `
            inset 0 2px 0 0 rgba(255, 255, 255, 0.3),
            inset 0 -2px 0 0 rgba(0, 0, 0, 0.2),
            0 8px 24px 0 rgba(0, 0, 0, 0.25),
            0 2px 8px 0 rgba(0, 0, 0, 0.15)
          `;
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.currentTarget.style.transform = 'translateY(1px) scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled && !active) {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
        }
      }}
    >
      <div style={grainStyle}></div>
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {icon && <div style={iconStyle}>{icon}</div>}
        {title && <div style={titleStyle}>{title}</div>}
        {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
      </div>
    </div>
  );
};

export default WoodenTile;
