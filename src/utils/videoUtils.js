// src/utils/videoUtils.js - Утилиты для работы с видео
export const createVideoElement = (src, options = {}) => {
  const video = document.createElement('video');
  
  // Базовые настройки для видео
  video.src = src;
  video.autoplay = true;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  
  // Дополнительные опции
  if (options.className) {
    video.className = options.className;
  }
  
  if (options.style) {
    Object.assign(video.style, options.style);
  }
  
  // Улучшенная обработка ошибок
  video.addEventListener('error', (e) => {
    console.warn('🎥 Ошибка загрузки видео:', {
      error: e.target.error,
      src: src,
      networkState: video.networkState,
      readyState: video.readyState
    });
    
    if (options.onError) {
      options.onError(e);
    }
  });
  
  // Логирование успешной загрузки
  video.addEventListener('loadeddata', () => {
    console.log('✅ Видео успешно загружено:', src);
  });
  
  // Предзагрузка видео
  video.addEventListener('canplaythrough', () => {
    console.log('🎬 Видео готово к воспроизведению:', src);
  });
  
  return video;
};

// Проверка поддержки WebM формата
export const supportsWebM = () => {
  const video = document.createElement('video');
  return video.canPlayType('video/webm') !== '';
};

// Проверка поддержки автовоспроизведения
export const canAutoplay = async () => {
  try {
    const video = document.createElement('video');
    video.muted = true;
    const promise = video.play();
    
    if (promise !== undefined) {
      await promise;
      video.pause();
      return true;
    }
    return false;
  } catch (error) {
    console.warn('🔇 Автовоспроизведение не поддерживается:', error);
    return false;
  }
};

// Оптимизация видео для загрузочного экрана
export const optimizeLoadingVideo = (videoElement) => {
  // Понижаем качество для экономии трафика
  videoElement.preload = 'metadata';
  
  // Добавляем обработчики для мониторинга производительности
  let loadStartTime = Date.now();
  
  videoElement.addEventListener('loadstart', () => {
    loadStartTime = Date.now();
    console.log('🚀 Начинаем загрузку видео...');
  });
  
  videoElement.addEventListener('loadeddata', () => {
    const loadTime = Date.now() - loadStartTime;
    console.log(`⏱️ Видео загружено за ${loadTime}ms`);
    
    if (loadTime > 3000) {
      console.warn('⚠️ Медленная загрузка видео. Рекомендуется оптимизация.');
    }
  });
  
  return videoElement;
};