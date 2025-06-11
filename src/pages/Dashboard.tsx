import React, { useState, useEffect } from 'react';
import { MainButton, useWebApp, useShowPopup } from '@vkruglikov/react-telegram-web-app';

export default function Dashboard() {
  const [isReady, setIsReady] = useState(false);
  const [items, setItems] = useState(null);
  const webApp = useWebApp();
  const showPopup = useShowPopup();

  useEffect(() => {
    // Проверяем доступность Telegram WebApp на клиенте
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const tg = window.Telegram.WebApp;
    const initData = tg.initData;

    fetch("http://127.0.0.1:8000/shopping-list", {
      headers: { Authorization: "Tg " + initData }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then(data => {
        setItems(data.items);
      })
      .catch(err => {
        console.error("Ошибка при получении списка:", err);
        setItems([]); // можно показать пустой список или сообщение об ошибке
      });
  }, [isReady]);

  if (!isReady) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Загрузка...</h1>
      </div>
    );
  }

  const user = webApp.initDataUnsafe?.user || {};

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
        onClick={() => showPopup({ message: 'Hello!' })}
      />
    </div>
  );
}
