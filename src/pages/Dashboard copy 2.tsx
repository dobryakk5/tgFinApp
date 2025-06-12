import React, { useState, useEffect } from 'react';
import { MainButton, useWebApp, useShowPopup } from '@vkruglikov/react-telegram-web-app';

export default function Dashboard() {
  const [isReady, setIsReady] = useState(false);
  const [items, setItems] = useState(null);
  const webApp = useWebApp();
  const showPopup = useShowPopup();

  // Проверка доступности Telegram WebApp API
  useEffect(() => {
    console.log('[CheckTelegram] window.Telegram:', window.Telegram);
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      console.log('✅ Telegram.WebApp найден');
      setIsReady(true);
    } else {
      console.warn('⚠️ Telegram.WebApp не найден — проверьте запуск внутри Telegram');
    }
  }, []);

  // Загрузка данных после готовности WebApp
  useEffect(() => {
    console.log('[AwaitReady] isReady =', isReady);
    if (!isReady) return;

    const tg = window.Telegram.WebApp;
    console.log('[Init] initData:', tg.initData);
    console.log('[Init] initDataUnsafe:', webApp.initDataUnsafe);

    fetch('http://127.0.0.1:8000/shopping-list', {
      headers: { Authorization: 'Tg ' + tg.initData }
    })
      .then(res => {
        console.log('[Fetch] response status =', res.status);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('[Fetch] data received:', data);
        setItems(data.items);
      })
      .catch(err => {
        console.error('[Fetch] Ошибка при получении списка:', err);
        setItems([]);
      });
  }, [isReady, webApp]);

  if (!isReady) {
    console.log('[Render] WebApp не готов — показываем экран загрузки');
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Загрузка...</h1>
      </div>
    );
  }

  const user = webApp.initDataUnsafe?.user || {};
  console.log('[Render] user:', user, 'items:', items);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Привет, {user.first_name || 'пользователь'}!</h1>

      {items === null ? (
        <p>Загрузка списка...</p>
      ) : items.length === 0 ? (
        <p>Список пуст.</p>
      ) : (
        <ul className="mb-4">
          {items.map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      )}

      <MainButton
        text="SHOW POPUP"
        onClick={() => {
          console.log('[Popup] showPopup called');
          showPopup({ message: 'Hello!' });
        }}
      />
    </div>
  );
}
