// ──────────────────────────────────────────
//  src/App.js
// ──────────────────────────────────────────
import React, { useState, useEffect } from 'react';
import './App.css';

/* ----- экраны ----- */
import HoroscopeView     from './components/HoroscopeView';
import ZodiacCarousel    from './components/ZodiacCarousel';
import MoonView          from './components/MoonView';
import CompatibilityView from './components/CompatibilityView';
import NumerologyView    from './components/NumerologyView';
import AstroEventsView   from './components/AstroEventsView';

/* ----- данные ----- */
const ZODIAC_SIGNS = [
  { sign: 'Овен', emoji: '♈', dates: '21.03-20.04' },
  { sign: 'Телец', emoji: '♉', dates: '21.04-20.05' },
  { sign: 'Близнецы', emoji: '♊', dates: '21.05-21.06' },
  { sign: 'Рак', emoji: '♋', dates: '22.06-22.07' },
  { sign: 'Лев', emoji: '♌', dates: '23.07-22.08' },
  { sign: 'Дева', emoji: '♍', dates: '23.08-22.09' },
  { sign: 'Весы', emoji: '♎', dates: '23.09-22.10' },
  { sign: 'Скорпион', emoji: '♏', dates: '23.10-22.11' },
  { sign: 'Стрелец', emoji: '♐', dates: '23.11-21.12' },
  { sign: 'Козерог', emoji: '♑', dates: '22.12-20.01' },
  { sign: 'Водолей', emoji: '♒', dates: '21.01-19.02' },
  { sign: 'Рыбы', emoji: '♓', dates: '20.02-20.03' }
];

const GNOME_PROFILES = {
  Овен:     { name: 'Гном Огнебород',     title: 'Боевой кузнец',       desc: 'Смелый, активный, любит приключения' },
  Телец:    { name: 'Гном Златоруд',      title: 'Мастер сокровищ',     desc: 'Упорный, надёжный, ценит комфорт' },
  Близнецы: { name: 'Гном Двойняшка',     title: 'Мудрый летописец',    desc: 'Любознательный, общительный' },
  Рак:      { name: 'Гном Домовой',       title: 'Хранитель очага',     desc: 'Заботливый, чувствительный' },
  Лев:      { name: 'Гном Златогрив',     title: 'Королевский советник',desc: 'Гордый, щедрый, любит внимание' },
  Дева:     { name: 'Гном Аккуратный',    title: 'Мастер точности',     desc: 'Практичный, внимательный к деталям' },
  Весы:     { name: 'Гном Справедливый',  title: 'Мирный судья',        desc: 'Дипломатичный, ищет баланс' },
  Скорпион: { name: 'Гном Тайновед',      title: 'Хранитель секретов',  desc: 'Глубокий, интуитивный' },
  Стрелец:  { name: 'Гном Путешественник',title: 'Искатель приключений',desc: 'Свободолюбивый, оптимистичный' },
  Козерог:  { name: 'Гном Горовосходитель',title:'Мастер достижений',   desc: 'Целеустремлённый, терпеливый' },
  Водолей:  { name: 'Гном Изобретатель',  title: 'Новатор будущего',    desc: 'Независимый, оригинальный' },
  Рыбы:     { name: 'Гном Мечтатель',     title: 'Морской волшебник',   desc: 'Творческий, эмпатичный' }
};

/* ================================================================= */
export default function App() {
  const [selectedSign, setSelectedSign] = useState('Лев');
  const [currentScreen, setCurrentScreen] = useState('main');

  /* ---------- безопасный доступ без падений ---------- */
  const profile  = GNOME_PROFILES[selectedSign] ?? GNOME_PROFILES['Лев'];
  const signData = ZODIAC_SIGNS.find(z => z.sign === selectedSign) ?? ZODIAC_SIGNS[4];

  /* ---------- отладка ---------- */
  useEffect(() => {
    console.log('🪧 selectedSign =', selectedSign);
  }, [selectedSign]);

  /* ================================================================= */
  return (
    <div className="app-container">
      {/* шапка */}
      <header className="header">
        <h1>🧙‍♂️ Гномий Гороскоп</h1>
        <p>Магические предсказания от древних гномов</p>
      </header>

      {/* главное меню */}
      {currentScreen === 'main' && (
        <section className="main-screen">
          {/* карточка профиля */}
          <div className="card profile-card">
            <h2>{profile.name}</h2>
            <p className="gnome-title">{profile.title}</p>
            <p>{profile.desc}</p>
            <span className="selected-sign">
              {selectedSign} ({signData.dates})
            </span>
          </div>

          {/* карусель знаков */}
          <ZodiacCarousel
            selectedSign={selectedSign}
            onSignChange={setSelectedSign}
          />

          {/* меню навигации */}
          <div className="menu-buttons">
            <MenuBtn icon="🔮" title="Гороскоп"     onClick={() => setCurrentScreen('horoscope')} />
            <MenuBtn icon="🌙" title="Луна"         onClick={() => setCurrentScreen('moon')} />
            <MenuBtn icon="👫" title="Совместимость"onClick={() => setCurrentScreen('compatibility')} />
            <MenuBtn icon="🔢" title="Нумерология"  onClick={() => setCurrentScreen('numerology')} />
            <MenuBtn icon="🌌" title="Астрособытия" onClick={() => setCurrentScreen('events')} />
          </div>
        </section>
      )}

      {/* остальные экраны */}
      {currentScreen === 'horoscope'     && <HoroscopeView     selectedSign={selectedSign} onBack={() => setCurrentScreen('main')} />}
      {currentScreen === 'moon'          && <MoonView          onBack={() => setCurrentScreen('main')} />}
      {currentScreen === 'compatibility' && <CompatibilityView onBack={() => setCurrentScreen('main')} />}
      {currentScreen === 'numerology'    && <NumerologyView    onBack={() => setCurrentScreen('main')} />}
      {currentScreen === 'events'        && <AstroEventsView   onBack={() => setCurrentScreen('main')} />}
    </div>
  );
}

/* вспомогательная кнопка меню */
const MenuBtn = ({ icon, title, onClick }) => (
  <button className="menu-btn" onClick={onClick}>
    <div className="btn-icon">{icon}</div>
    <span>{title}</span>
  </button>
);
