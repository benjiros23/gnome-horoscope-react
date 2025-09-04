// src/components/StarryBackground.js
import React, { useRef, useEffect } from 'react';

const StarryBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Устанавливаем размеры канваса
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ✅ СОЗВЕЗДИЯ - Координаты в процентах для адаптивности
    const constellations = [
      // Большая Медведица
      {
        stars: [
          {x: 0.15, y: 0.25}, {x: 0.18, y: 0.20}, {x: 0.22, y: 0.18}, 
          {x: 0.26, y: 0.22}, {x: 0.24, y: 0.28}, {x: 0.20, y: 0.30}, 
          {x: 0.16, y: 0.28}
        ],
        connections: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0]],
        name: 'Большая Медведица'
      },
      // Орион
      {
        stars: [
          {x: 0.75, y: 0.35}, {x: 0.78, y: 0.40}, {x: 0.72, y: 0.45}, 
          {x: 0.74, y: 0.50}, {x: 0.76, y: 0.42}, {x: 0.80, y: 0.38}
        ],
        connections: [[0,1], [1,2], [2,3], [1,4], [4,5]],
        name: 'Орион'
      },
      // Кассиопея
      {
        stars: [
          {x: 0.85, y: 0.15}, {x: 0.82, y: 0.18}, {x: 0.80, y: 0.12}, 
          {x: 0.77, y: 0.16}, {x: 0.74, y: 0.10}
        ],
        connections: [[0,1], [1,2], [2,3], [3,4]],
        name: 'Кассиопея'
      }
    ];

    // ✅ ОБЫЧНЫЕ ЗВЕЗДЫ
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    // ✅ КОМЕТЫ
    const comets = [];
    
    // 🧙‍♂️ МАГИЧЕСКИЕ ЧАСТИЦЫ
    const magicParticles = [];
    
    // 🧙‍♂️ ГНОМЬИ ЦВЕТА ДЛЯ МАГИЧЕСКИХ ЭФФЕКТОВ
    const gnomeColors = [
      '#FF6B6B', // Красный гном
      '#4ECDC4', // Бирюзовый гном
      '#45B7D1', // Синий гном
      '#FFA07A', // Оранжевый гном
      '#98D8C8', // Зеленый гном
      '#F7DC6F', // Желтый гном
      '#BB8FCE', // Фиолетовый гном
      '#85C1E9'  // Голубой гном
    ];
    
    const createComet = () => {
      // Кометы появляются с разных сторон экрана
      const side = Math.floor(Math.random() * 4);
      let startX, startY, endX, endY;
      
      switch(side) {
        case 0: // Сверху
          startX = Math.random() * canvas.width;
          startY = -50;
          endX = Math.random() * canvas.width;
          endY = canvas.height + 50;
          break;
        case 1: // Справа
          startX = canvas.width + 50;
          startY = Math.random() * canvas.height;
          endX = -50;
          endY = Math.random() * canvas.height;
          break;
        case 2: // Снизу
          startX = Math.random() * canvas.width;
          startY = canvas.height + 50;
          endX = Math.random() * canvas.width;
          endY = -50;
          break;
        default: // Слева
          startX = -50;
          startY = Math.random() * canvas.height;
          endX = canvas.width + 50;
          endY = Math.random() * canvas.height;
      }

      return {
        x: startX,
        y: startY,
        endX: endX,
        endY: endY,
        speed: Math.random() * 3 + 2,
        tail: [],
        maxTailLength: Math.random() * 20 + 15,
        brightness: Math.random() * 0.5 + 0.5,
        hue: Math.random() * 60 + 180, // Голубые/белые оттенки
        color: gnomeColors[Math.floor(Math.random() * gnomeColors.length)] // Добавляем цвет
      };
    };

    // Создаем начальные кометы
    for (let i = 0; i < 3; i++) {
      comets.push(createComet());
    }
    
    // 🧙‍♂️ ФУНКЦИЯ СОЗДАНИЯ МАГИЧЕСКОЙ ЧАСТИЦЫ
    const createMagicParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: 0.8,
        color: gnomeColors[Math.floor(Math.random() * gnomeColors.length)],
        life: Math.random() * 100 + 60,
        maxLife: 160,
        float: (Math.random() - 0.5) * 1.5
      };
    };

    // ✅ ФУНКЦИЯ ОТРИСОВКИ
    const draw = () => {
      // Очистка с градиентным фоном
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000428');
      gradient.addColorStop(1, '#004e92');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ✅ РИСУЕМ ОБЫЧНЫЕ ЗВЕЗДЫ (с мерцанием)
      stars.forEach(star => {
        star.opacity += Math.sin(Date.now() * star.twinkleSpeed) * 0.01;
        star.opacity = Math.max(0.1, Math.min(1, star.opacity));
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
        
        // Свечение вокруг ярких звезд
        if (star.radius > 1.5) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.1})`;
          ctx.fill();
        }
      });

      // ✅ РИСУЕМ СОЗВЕЗДИЯ
      constellations.forEach(constellation => {
        // Рисуем звезды созвездий (больше обычных)
        constellation.stars.forEach(star => {
          const x = star.x * canvas.width;
          const y = star.y * canvas.height;
          
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#FFD700';
          ctx.fill();
          
          // Свечение
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
          ctx.fill();
        });

        // Рисуем соединительные линии
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
        ctx.lineWidth = 1;
        constellation.connections.forEach(([start, end]) => {
          const startStar = constellation.stars[start];
          const endStar = constellation.stars[end];
          
          ctx.beginPath();
          ctx.moveTo(startStar.x * canvas.width, startStar.y * canvas.height);
          ctx.lineTo(endStar.x * canvas.width, endStar.y * canvas.height);
          ctx.stroke();
        });
      });

      // 🧙‍♂️ РИСУЕМ И ОБНОВЛЯЕМ МАГИЧЕСКИЕ ЧАСТИЦЫ
      for (let i = magicParticles.length - 1; i >= 0; i--) {
        const particle = magicParticles[i];
        
        // Движение частиц вверх с боковым дрейфом
        particle.y -= particle.speed;
        particle.x += particle.float;
        particle.life--;
        
        // Изменение прозрачности в зависимости от жизни
        const lifeRatio = particle.life / particle.maxLife;
        particle.opacity = lifeRatio * 0.8;
        
        // Убираем частицы за экраном или закончившие жизнь
        if (particle.y < -10 || particle.life <= 0) {
          magicParticles.splice(i, 1);
          continue;
        }
        
        // Рисуем магическую частицу
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Градиентное свечение
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 3
        );
        particleGradient.addColorStop(0, particle.color + 'FF');
        particleGradient.addColorStop(0.5, particle.color + '88');
        particleGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = particleGradient;
        ctx.fill();
        
        // Дополнительное внутреннее свечение
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF' + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }

      // 🧙‍♂️ РИСУЕМ И ОБНОВЛЯЕМ ГНОМЬИ КОМЕТЫ
      for (let i = comets.length - 1; i >= 0; i--) {
        const comet = comets[i];
        
        // Вычисляем направление движения
        const dx = comet.endX - comet.x;
        const dy = comet.endY - comet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
          // Комета достигла конца пути - создаем взрыв магических частиц
          for (let j = 0; j < 8; j++) {
            magicParticles.push({
              x: comet.x + (Math.random() - 0.5) * 20,
              y: comet.y + (Math.random() - 0.5) * 20,
              size: Math.random() * 3 + 1,
              speed: Math.random() * 3 + 1,
              opacity: 0.8,
              color: comet.color,
              life: Math.random() * 50 + 30,
              maxLife: 80,
              float: (Math.random() - 0.5) * 2
            });
          }
          comets.splice(i, 1);
          continue;
        }
        
        // Движение кометы
        comet.x += (dx / distance) * comet.speed;
        comet.y += (dy / distance) * comet.speed;
        
        // Добавляем в хвост
        comet.tail.push({ x: comet.x, y: comet.y });
        if (comet.tail.length > comet.maxTailLength) {
          comet.tail.shift();
        }

        // Рисуем хвост кометы с гномьими цветами
        for (let j = 0; j < comet.tail.length - 1; j++) {
          const alpha = (j / comet.tail.length) * comet.brightness;
          const width = (j / comet.tail.length) * 4;
          
          ctx.strokeStyle = comet.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          
          ctx.beginPath();
          ctx.moveTo(comet.tail[j].x, comet.tail[j].y);
          ctx.lineTo(comet.tail[j + 1].x, comet.tail[j + 1].y);
          ctx.stroke();
        }

        // Рисуем голову кометы с магическим эффектом
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = comet.color;
        ctx.fill();
        
        // Внутреннее белое ядро
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        
        // Большое магическое свечение
        const cometGlow = ctx.createRadialGradient(comet.x, comet.y, 0, comet.x, comet.y, 20);
        cometGlow.addColorStop(0, comet.color + 'AA');
        cometGlow.addColorStop(0.5, comet.color + '44');
        cometGlow.addColorStop(1, 'transparent');
        
        ctx.fillStyle = cometGlow;
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      // 🧙‍♂️ СОЗДАЕМ НОВЫЕ КОМЕТЫ И ЧАСТИЦЫ
      if (Math.random() < 0.003 && comets.length < 4) {
        comets.push(createComet());
      }
      
      if (Math.random() < 0.1 && magicParticles.length < 15) {
        magicParticles.push(createMagicParticle());
      }

      // 🧙‍♂️ ДОПОЛНИТЕЛЬНЫЕ МАГИЧЕСКИЕ ЭФФЕКТЫ
      // Случайные вспышки магии в углах экрана
      if (Math.random() < 0.002) {
        const corners = [
          {x: 50, y: 50},
          {x: canvas.width - 50, y: 50},
          {x: 50, y: canvas.height - 50},
          {x: canvas.width - 50, y: canvas.height - 50}
        ];
        
        const corner = corners[Math.floor(Math.random() * corners.length)];
        const flashColor = gnomeColors[Math.floor(Math.random() * gnomeColors.length)];
        
        // Создаем вспышку
        const flashGradient = ctx.createRadialGradient(corner.x, corner.y, 0, corner.x, corner.y, 100);
        flashGradient.addColorStop(0, flashColor + '66');
        flashGradient.addColorStop(0.3, flashColor + '33');
        flashGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = flashGradient;
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, 100, 0, Math.PI * 2);
        ctx.fill();
        
        // Создаем магические частицы из вспышки
        for (let k = 0; k < 5; k++) {
          magicParticles.push({
            x: corner.x + (Math.random() - 0.5) * 60,
            y: corner.y + (Math.random() - 0.5) * 60,
            size: Math.random() * 4 + 2,
            speed: Math.random() * 2 + 1,
            opacity: 0.9,
            color: flashColor,
            life: Math.random() * 80 + 60,
            maxLife: 140,
            float: (Math.random() - 0.5) * 3
          });
        }
      }
    };

    // ✅ АНИМАЦИОННЫЙ ЦИКЛ
    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 🧙‍♂️ Очистка при размонтировании (предотвращение утечек памяти)
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        // 🧙‍♂️ Добавляем магический фильтр
        filter: 'brightness(1.05) contrast(1.1)'
      }}
    />
  );
};

export default StarryBackground;
