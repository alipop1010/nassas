import { createRoot } from 'react-dom/client';
import bridge from '@vkontakte/vk-bridge';
import App from './App';
import './App.css';

// Проверка на запуск внутри VK (улучшенная версия)
const isVK = () => {
  return (
    navigator.userAgent.includes('VK') ||
    window.location.href.includes('vk.com') ||
    window.location.href.includes('vk-apps.com')
  );
};

const initApp = async () => {
  // Инициализация VK Bridge только внутри VK
  if (isVK()) {
    try {
      await bridge.send('VKWebAppInit');
      console.log('VK Bridge успешно инициализирован');
      
      // Запрашиваем данные пользователя (опционально)
      const user = await bridge.send('VKWebAppGetUserInfo');
      console.log('Данные пользователя:', user);
    } catch (error) {
      console.error('Ошибка VK Bridge:', error);
    }
  }

  // Рендер приложения
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Элемент #root не найден');
  createRoot(rootElement).render(<App />);
};

// Запуск приложения
initApp().catch((error) => {
  console.error('Фатальная ошибка:', error);
  
  // Сообщение об ошибке (адаптивное для VK и браузера)
  const errorContainer = document.createElement('div');
  errorContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f5f5f5;
    color: #e64646;
    padding: 20px;
    text-align: center;
    font-family: -apple-system, system-ui, sans-serif;
  `;

  errorContainer.innerHTML = `
    <h2>Ошибка запуска приложения</h2>
    <p>${error.message}</p>
    ${!isVK() ? '<p>Пожалуйста, откройте приложение в клиенте VK</p>' : ''}
    <button onclick="window.location.reload()" style="
      margin-top: 20px;
      padding: 10px 20px;
      background: #5181b8;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    ">Перезагрузить</button>
  `;

  document.body.appendChild(errorContainer);
});