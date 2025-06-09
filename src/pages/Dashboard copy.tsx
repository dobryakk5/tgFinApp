// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { MainButton, BackButton, useShowPopup, useThemeParams } from '@vkruglikov/react-telegram-web-app';
import 'rippleui/dist/css/styles.css';


interface UserInfo {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const showPopup = useShowPopup();
  const [colorScheme] = useThemeParams();
  console.log(colorScheme); // ✅


  useEffect(() => {
    const tg = window.Telegram.WebApp;
    const init = tg.initDataUnsafe?.user;
    if (init) {
      setUser({
        id: init.id,
        first_name: init.first_name,
        last_name: init.last_name,
        username: init.username,
      });
      tg.MainButton.setText('Начать'); 
      tg.MainButton.show();
    }
  }, []);

  const handleStart = () => {
    if (user) {
      showPopup({ message: `Привет, ${user.first_name}! Добро пожаловать.` });
      // Здесь можно отправить запрос к backend, получить данные
    }
  };

  return (
    <div className={`p-4 h-full bg-${colorScheme === 'dark' ? 'gray-900 text-white' : 'white text-black'}`}>
      <div className="flex items-center">
        <BackButton onClick={() => window.history.back()} />
        <h1 className="text-2xl font-bold ml-2">Личный кабинет</h1>
      </div>

      {user ? (
        <div className="mt-4 space-y-2">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Имя:</strong> {user.first_name} {user.last_name}</p>
          {user.username && <p><strong>Юзернейм:</strong> @{user.username}</p>}
        </div>
      ) : (
        <p>Загрузка...</p>
      )}

      <div className="mt-6">
        <MainButton
          text="Начать"
          onClick={handleStart}
        />
      </div>
    </div>
  );
}
