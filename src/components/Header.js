import React from 'react';

const Header = () => {
  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '80px',
    zIndex: 1000,
    background: `url('/assets/header.png') center center/cover no-repeat`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2))',
    pointerEvents: 'none'
  };

  return (
    <header style={headerStyle}>
      <div style={overlayStyle}></div>
    </header>
  );
};

export default Header;
