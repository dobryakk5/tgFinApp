import React, { useState, useEffect } from 'react';
import { WebAppProvider, useWebApp, useShowPopup } from '@vkruglikov/react-telegram-web-app';

// Компонент для глубокой диагностики
export default function TelegramDebugger() {
  const [status, setStatus] = useState('initializing');
  const [webAppState, setWebAppState] = useState(null);
  const [windowTelegram, setWindowTelegram] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);
  
  const addDiagnostic = (message) => {
    setDiagnostics(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`
    ]);
  };

  // Шаг 1: Проверка глобального объекта window
  useEffect(() => {
    if (typeof window === 'undefined') {
      addDiagnostic('⚠️ window object не доступен (возможно, SSR)');
      setStatus('error');
      return;
    }
    
    addDiagnostic('✅ window object доступен');
    setWindowTelegram(window.Telegram);
    addDiagnostic(`window.Telegram = ${window.Telegram ? 'доступен' : 'недоступен'}`);
    
    if (window.Telegram?.WebApp) {
      addDiagnostic('✅ Telegram.WebApp найден в window');
    } else {
      addDiagnostic('⚠️ Telegram.WebApp не найден в window');
    }
  }, []);

  // Шаг 2: Проверка провайдера
  useEffect(() => {
    if (status === 'initializing') {
      try {
        const webAppFromHook = useWebApp();
        setWebAppState(webAppFromHook);
        
        if (webAppFromHook) {
          addDiagnostic('✅ useWebApp() вернул объект WebApp');
          setStatus('ready');
        } else {
          addDiagnostic('⚠️ useWebApp() вернул null/undefined');
          setStatus('provider-issue');
        }
      } catch (e) {
        addDiagnostic(`🚨 Ошибка при вызове useWebApp(): ${e.message}`);
        setStatus('hook-error');
      }
    }
  }, [status]);

  // Шаг 3: Попытка ручной инициализации
  const tryManualInit = () => {
    addDiagnostic('Попытка ручной инициализации...');
    
    if (window.Telegram?.WebApp) {
      try {
        window.Telegram.WebApp.ready();
        addDiagnostic('✅ Вызван Telegram.WebApp.ready()');
        addDiagnostic(`Платформа: ${window.Telegram.WebApp.platform}`);
        addDiagnostic(`Версия: ${window.Telegram.WebApp.version}`);
        addDiagnostic(`InitData: ${window.Telegram.WebApp.initData ? 'есть' : 'нет'}`);
        setStatus('manual-success');
      } catch (e) {
        addDiagnostic(`🚨 Ошибка при ручной инициализации: ${e.message}`);
        setStatus('manual-error');
      }
    } else {
      addDiagnostic('⚠️ window.Telegram.WebApp недоступен для ручного вызова');
      setStatus('manual-not-available');
    }
  };

  // Рендер по статусам
  if (status === 'initializing') {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Инициализация...</h1>
        <p>Проверяем окружение Telegram</p>
        <div className="mt-4 p-3 bg-gray-100 rounded">
          {diagnostics.map((msg, i) => (
            <div key={i} className="text-sm font-mono">{msg}</div>
          ))}
        </div>
      </div>
    );
  }

  if (status.startsWith('manual-')) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Ручная инициализация</h1>
        <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
          <h3 className="font-bold">Результат:</h3>
          <div className="mt-2 p-2 bg-white rounded">
            {diagnostics.slice(-3).map((msg, i) => (
              <div key={i} className="text-sm font-mono">{msg}</div>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setStatus('initializing')}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Повторить проверку
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Диагностика Telegram WebApp</h1>
      
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
        <h2 className="font-bold text-lg mb-2">Обнаружена проблема</h2>
        <p>
          Компонент не может получить доступ к Telegram WebApp API через провайдер.
          Возможные причины:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Причина 1: Отсутствует провайдер</h3>
          <p className="mb-3">
            Убедитесь, что ваш корневой компонент обёрнут в WebAppProvider:
          </p>
          <pre className="bg-gray-800 text-white p-3 rounded text-sm">
{`import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

function App() {
  return (
    <WebAppProvider>
      <YourComponent />
    </WebAppProvider>
  );
}`}
          </pre>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-bold mb-2">Причина 2: Скрипт не загружен</h3>
          <p className="mb-3">
            Добавьте скрипт Telegram WebApp в index.html:
          </p>
          <pre className="bg-gray-800 text-white p-3 rounded text-sm">
{`<head>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
</head>`}
          </pre>
        </div>
      </div>

      <div className="border rounded-lg p-4 mb-6">
        <h3 className="font-bold mb-2">Текущий статус</h3>
        <div className="mb-3 p-3 bg-gray-100 rounded">
          {diagnostics.map((msg, i) => (
            <div key={i} className="text-sm font-mono">{msg}</div>
          ))}
        </div>
        
        <button 
          onClick={tryManualInit}
          className="px-4 py-2 bg-green-600 text-white rounded mr-3"
        >
          Попробовать ручную инициализацию
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Перезагрузить страницу
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Дополнительные шаги для диагностики:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Откройте консоль разработчика (F12) и проверьте наличие ошибок</li>
          <li>Проверьте наличие тега script с Telegram WebApp в вкладке Elements</li>
          <li>В консоли введите <code>window.Telegram</code> и проверьте результат</li>
          <li>
            Для тестирования используйте TMA Launcher:
            <pre className="bg-black text-white p-2 mt-2 rounded">npx https://github.com/Telegram-Mini-Apps/tma-launcher</pre>
          </li>
          <li>
            Проверьте запуск в Telegram:
            <pre className="bg-black text-white p-2 mt-2 rounded">t.me/your_bot?startapp=test</pre>
          </li>
        </ol>
      </div>
    </div>
  );
}

// Обертка для провайдера в тестовом режиме
export function DebugWrapper() {
  return (
    <WebAppProvider>
      <TelegramDebugger />
    </WebAppProvider>
  );
}