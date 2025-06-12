import React, { useState, useEffect } from 'react';
import { MainButton, useWebApp, useShowPopup } from '@vkruglikov/react-telegram-web-app';

export default function DashboardTest() {
  const webApp = useWebApp();
  const showPopup = useShowPopup();
  const [telegramInfo, setTelegramInfo] = useState({});
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  // Собираем информацию о Telegram WebApp
  useEffect(() => {
    const collectTelegramInfo = () => {
      try {
        if (!window.Telegram || !window.Telegram.WebApp) {
          throw new Error('Telegram WebApp API не обнаружено');
        }

        const tg = window.Telegram.WebApp;
        const info = {
          version: tg.version,
          platform: tg.platform,
          initData: tg.initData || 'N/A',
          initDataUnsafe: tg.initDataUnsafe || {},
          themeParams: tg.themeParams,
          colorScheme: tg.colorScheme,
          isExpanded: tg.isExpanded,
          viewportHeight: tg.viewportHeight,
          viewportStableHeight: tg.viewportStableHeight,
          headerColor: tg.headerColor,
          backgroundColor: tg.backgroundColor,
          isClosingConfirmationEnabled: tg.isClosingConfirmationEnabled,
          BackButton: tg.BackButton ? 'Доступна' : 'Недоступна',
          MainButton: tg.MainButton ? 'Доступна' : 'Недоступна',
          HapticFeedback: tg.HapticFeedback ? 'Доступна' : 'Недоступна',
        };

        setTelegramInfo(info);
        setStatus('loaded');
        
        console.log('Telegram WebApp Info:', info);
        console.log('React Hook WebApp:', webApp);
      } catch (err) {
        setStatus('error');
        setError(err.message);
        console.error('Ошибка получения данных Telegram:', err);
      }
    };

    // Даем 1 секунду на инициализацию API
    const timer = setTimeout(collectTelegramInfo, 1000);
    return () => clearTimeout(timer);
  }, [webApp]);

  // Тестовый режим для разработки
  if (!webApp && process.env.NODE_ENV === 'development') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-red-500 mb-4">[DEV MODE] Тест окружения</h1>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Telegram WebApp не обнаружен</strong>. Это нормально в режиме разработки.
                Запустите приложение внутри Telegram для полной проверки.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h2 className="font-bold mb-2">Проверка методов</h2>
            <button 
              onClick={() => alert('Имитация popup в dev-режиме')}
              className="w-full bg-blue-500 text-white py-2 rounded mb-2"
            >
              Show Popup
            </button>
            <button 
              onClick={() => console.log('Имитация закрытия WebApp')}
              className="w-full bg-gray-500 text-white py-2 rounded"
            >
              Close WebApp
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <h2 className="font-bold mb-2">Статус WebApp</h2>
            <p className="mb-1"><strong>Статус:</strong> <span className="text-red-500">Не подключен</span></p>
            <p className="mb-1"><strong>Платформа:</strong> Браузер/Dev</p>
            <p><strong>Версия API:</strong> Отсутствует</p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Рекомендации</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Запустите приложение через Telegram: t.me/your_bot?startapp=test</li>
            <li>Проверьте наличие скрипта Telegram WebApp в &lt;head&gt;</li>
            <li>Убедитесь что используете WebAppProvider в корне приложения</li>
            <li>Для тестирования используйте TMA Launcher: 
              <pre className="bg-black text-white p-2 mt-2 rounded">npx https://github.com/Telegram-Mini-Apps/tma-launcher</pre>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (!webApp) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold">Инициализация Telegram API...</h1>
        <p className="mt-2">Пожалуйста, подождите</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Ошибка инициализации</h1>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700"><strong>Произошла ошибка:</strong> {error}</p>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Возможные решения:</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Убедитесь что запускаете через Telegram (не через прямой URL в браузере)</li>
            <li>Проверьте что скрипт Telegram WebApp загружен (должен быть в &lt;head&gt;)</li>
            <li>Обновите приложение: <code className="bg-gray-200 px-1">window.Telegram.WebApp.expand()</code></li>
            <li>Попробуйте перезапустить приложение</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Тест окружения WebApp</h1>
      
      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
        <p className="text-green-700">
          <strong>Telegram WebApp успешно подключен!</strong> Ниже вся диагностическая информация
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h2 className="font-bold mb-2">Основная информация</h2>
          <p className="mb-1"><strong>Версия API:</strong> {telegramInfo.version}</p>
          <p className="mb-1"><strong>Платформа:</strong> {telegramInfo.platform}</p>
          <p className="mb-1"><strong>Цветовая схема:</strong> {telegramInfo.colorScheme}</p>
          <p className="mb-1"><strong>Статус:</strong> <span className="text-green-500">Активен</span></p>
          <p><strong>Высота viewport:</strong> {telegramInfo.viewportHeight}px</p>
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="font-bold mb-2">Проверка методов</h2>
          <MainButton
            text="SHOW POPUP"
            onClick={() => showPopup({ message: 'Тест popup из WebApp' })}
          />
          <button 
            onClick={() => webApp.close()}
            className="w-full bg-gray-500 text-white py-2 rounded mt-2"
          >
            Close WebApp
          </button>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-bold mb-2">Данные пользователя</h2>
        <pre className="bg-gray-100 p-2 overflow-x-auto text-sm">
          {JSON.stringify(telegramInfo.initDataUnsafe?.user || 'Данные пользователя недоступны', null, 2)}
        </pre>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-bold mb-2">Параметры темы</h2>
        <pre className="bg-gray-100 p-2 overflow-x-auto text-sm">
          {JSON.stringify(telegramInfo.themeParams || 'Параметры темы недоступны', null, 2)}
        </pre>
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-bold mb-2">Полные initDataUnsafe</h2>
        <pre className="bg-gray-100 p-2 overflow-x-auto text-xs max-h-40">
          {JSON.stringify(telegramInfo.initDataUnsafe || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}