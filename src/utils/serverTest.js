// src/utils/serverTest.js - Утилита для тестирования соединения с сервером
import apiService from '../services/api';

class ServerTester {
  constructor() {
    this.serverUrl = process.env.REACT_APP_API_URL || 'https://d-gnome-horoscope-miniapp-frontend.onrender.com';
  }

  // Тест основного соединения
  async testConnection() {
    console.log('🔬 Тестирование соединения с сервером...');
    console.log('🌐 URL сервера:', this.serverUrl);
    
    try {
      // Проверяем главную страницу вместо /health
      const response = await fetch(`${this.serverUrl}/`);
      console.log('📡 Статус ответа:', response.status);
      
      if (response.ok || response.status === 404) {
        // 200 или 404 означает что сервер работает
        console.log('✅ Сервер доступен');
        return { success: true, status: response.status };
      } else {
        console.log('❌ Сервер вернул ошибку:', response.statusText);
        return { success: false, error: response.statusText };
      }
    } catch (error) {
      console.log('🔴 Ошибка соединения:', error);
      return { success: false, error: error.message };
    }
  }

  // Тест API гороскопа
  async testHoroscopeAPI() {
    console.log('🔮 Тестирование API гороскопа...');
    
    try {
      const testSign = 'Овен';
      const horoscope = await apiService.getHoroscope(testSign);
      console.log('✅ Гороскоп получен:', horoscope);
      return { success: true, data: horoscope };
    } catch (error) {
      console.log('❌ Ошибка получения гороскопа:', error);
      return { success: false, error: error.message };
    }
  }

  // Тест API настроек пользователя
  async testUserSettingsAPI() {
    console.log('⚙️ Тестирование API настроек...');
    
    try {
      const initData = window.Telegram?.WebApp?.initData || 'test_data';
      const settings = await apiService.getUserSettings(initData);
      console.log('✅ Настройки получены:', settings);
      return { success: true, data: settings };
    } catch (error) {
      console.log('❌ Ошибка получения настроек:', error);
      return { success: false, error: error.message };
    }
  }

  // Полный тест всех API
  async runFullTest() {
    console.log('🧪 Запуск полного тестирования API...');
    
    const results = {
      connection: await this.testConnection(),
      horoscope: await this.testHoroscopeAPI(),
      userSettings: await this.testUserSettingsAPI()
    };

    console.log('📊 Результаты тестирования:', results);
    
    const successCount = Object.values(results).filter(r => r.success).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`📈 Успешно: ${successCount}/${totalTests} тестов`);
    
    if (successCount === totalTests) {
      console.log('🎉 Все тесты прошли успешно!');
    } else {
      console.log('⚠️ Некоторые тесты не прошли. Приложение будет работать в резервном режиме.');
    }
    
    return results;
  }

  // Проверка доступности всех эндпоинтов
  async checkEndpoints() {
    const endpoints = [
      '/health',
      '/api/horoscope',
      '/api/user/settings',
      '/api/premium/horoscope',
      '/api/share',
      '/api/analytics'
    ];

    console.log('🔍 Проверка доступности эндпоинтов...');
    
    const results = {};
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${this.serverUrl}${endpoint}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        results[endpoint] = {
          available: response.status < 500,
          status: response.status,
          statusText: response.statusText
        };
        
        console.log(`${results[endpoint].available ? '✅' : '❌'} ${endpoint}: ${response.status}`);
      } catch (error) {
        results[endpoint] = {
          available: false,
          error: error.message
        };
        console.log(`❌ ${endpoint}: ${error.message}`);
      }
    }
    
    return results;
  }
}

// Создаем экземпляр для экспорта
const serverTester = new ServerTester();

// Автоматический тест при загрузке (только в режиме разработки)
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    serverTester.runFullTest();
  }, 2000);
}

export default serverTester;