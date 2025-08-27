// Единая пиксельная палитра и стили
export const pixelTheme = {
  colors: {
    sage: '#b6bb9b',      // Шалфей - основной светлый
    brown: '#8a6c4c',     // Коричневый - акцент 
    forest: '#62862a',    // Лесной - успех/активный
    olive: '#8e8e15',     // Оливковый - предупреждение  
    amber: '#a96a14',     // Янтарный - важные элементы
    black: '#000000',     // Черный - обводки
    white: '#ffffff',     // Белый - текст на темном
    background: '#f4f4f0' // Фон приложения
  },
  
  fonts: {
    pixel: '"Courier New", monospace',
    size: {
      tiny: '10px',
      small: '12px', 
      normal: '14px',
      large: '18px',
      huge: '24px'
    }
  },
  
  effects: {
    pixelBorder: '2px solid #000000',
    activeBorder: '3px solid #000000',
    pixelShadow: '2px 2px 0px #000000',
    activeShadow: '3px 3px 0px #000000',
    buttonTransition: 'all 0.1s ease'
  },
  
  spacing: {
    xs: '4px',
    sm: '8px', 
    md: '12px',
    lg: '16px',
    xl: '20px'
  }
};

// Базовые стили компонентов
export const pixelStyles = {
  card: {
    border: pixelTheme.effects.pixelBorder,
    borderRadius: '8px',
    boxShadow: pixelTheme.effects.pixelShadow,
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: pixelTheme.fonts.size.normal
  },
  
  button: {
    border: pixelTheme.effects.pixelBorder,
    borderRadius: '6px',
    boxShadow: pixelTheme.effects.pixelShadow,
    fontFamily: pixelTheme.fonts.pixel,
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: pixelTheme.effects.buttonTransition,
    textTransform: 'uppercase',
    fontSize: pixelTheme.fonts.size.small
  },
  
  activeButton: {
    border: pixelTheme.effects.activeBorder,
    boxShadow: pixelTheme.effects.activeShadow,
    transform: 'translate(-1px, -1px)'
  }
};
