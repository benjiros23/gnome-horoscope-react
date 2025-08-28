import React from 'react';

const GlassCard = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  style = {},
  blur = true,
  onClick
}) => {
  const glassStyle = {
    background: blur 
      ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)'
      : 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)', // Safari support
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12), 0 2px 16px 0 rgba(0, 0, 0, 0.08)',
    padding: '24px',
    margin: '16px',
    color: '#2d3748',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#1a202c',
    letterSpacing: '0.5px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '16px',
    color: '#4a5568',
    fontStyle: 'italic'
  };

  const glowStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
    opacity: 0.6
  };

  return (
    <div 
      style={glassStyle}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.boxShadow = '0 12px 40px 0 rgba(0, 0, 0, 0.16), 0 4px 20px 0 rgba(0, 0, 0, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.12), 0 2px 16px 0 rgba(0, 0, 0, 0.08)';
        }
      }}
    >
      <div style={glowStyle}></div>
      
      {title && <h3 style={titleStyle}>{title}</h3>}
      {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default GlassCard;
