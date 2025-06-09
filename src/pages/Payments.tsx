import React from 'react';
import { MainButton } from '@vkruglikov/react-telegram-web-app';

export default function Payments() {
  const onPay = () => {
    // тут логика оплаты: отправка запроса к вашему API, Bot API sendInvoice и т.п.
    console.log('Оплатить нажато');
  };

  return (
    <div className="p-4">
      <h2>Оплата услуг</h2>
      <MainButton text="Оплатить" onClick={onPay} />
    </div>
  );
}
