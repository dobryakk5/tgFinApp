import React from 'react';
import { MainButton, useWebApp } from '@vkruglikov/react-telegram-web-app';

export default function Dashboard() {
  const webApp = useWebApp();
  const user = webApp.initDataUnsafe.user;

  const handleClick = () => {
    alert('Оплата пока не реализована');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Привет, {user?.first_name || 'пользователь'}!</h1>
      <p>Это твой личный кабинет.</p>

      <MainButton text="Оплатить" onClick={handleClick} />
    </div>
  );
}
