// src/hooks/usePerformanceMonitor.js - Хук для мониторинга производительности
import { useEffect, useRef } from 'react';

const usePerformanceMonitor = (componentName, threshold = 16) => {
  const renderStartTime = useRef(Date.now());
  const renderCount = useRef(0);
  const slowRenders = useRef([]);

  useEffect(() => {
    const renderEndTime = Date.now();
    const renderTime = renderEndTime - renderStartTime.current;
    renderCount.current += 1;

    // Логируем медленные рендеры
    if (renderTime > threshold) {
      const slowRender = {
        component: componentName,
        renderTime,
        renderCount: renderCount.current,
        timestamp: new Date().toISOString()
      };
      
      slowRenders.current.push(slowRender);
      
      console.warn(`🐌 Медленный рендер компонента "${componentName}":`, {
        время: `${renderTime}ms`,
        пороговое_значение: `${threshold}ms`,
        номер_рендера: renderCount.current,
        советы: [
          'Используйте React.memo() для предотвращения ненужных рендеров',
          'Оптимизируйте useEffect зависимости',
          'Рассмотрите useMemo() и useCallback() для тяжелых вычислений',
          'Проверьте размер и сложность компонента'
        ]
      });

      // Отправляем данные о производительности в аналитику (если включено)
      if (process.env.NODE_ENV === 'development') {
        window.performanceIssues = window.performanceIssues || [];
        window.performanceIssues.push(slowRender);
      }
    }

    // Обновляем время начала для следующего рендера
    renderStartTime.current = Date.now();
  });

  // Возвращаем функции для анализа производительности
  return {
    getRenderCount: () => renderCount.current,
    getSlowRenders: () => slowRenders.current,
    getAverageRenderTime: () => {
      if (slowRenders.current.length === 0) return 0;
      const total = slowRenders.current.reduce((sum, render) => sum + render.renderTime, 0);
      return total / slowRenders.current.length;
    },
    resetStats: () => {
      renderCount.current = 0;
      slowRenders.current = [];
    }
  };
};

export default usePerformanceMonitor;