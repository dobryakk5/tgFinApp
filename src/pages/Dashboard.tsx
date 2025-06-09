import React from 'react';
import { MainButton, useWebApp, useShowPopup } from '@vkruglikov/react-telegram-web-app';

export default function Dashboard() {
  const webApp = useWebApp();
  const showPopup = useShowPopup();

  const user = webApp.initDataUnsafe.user;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Привет, {user?.first_name || 'пользователь'}!</h1>
      <MainButton text="SHOW POPUP" onClick={() => showPopup({ message: 'Hello!' })} />
    </div>
  );
}
