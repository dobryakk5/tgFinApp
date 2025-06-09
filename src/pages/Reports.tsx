import { BackButton, MainButton } from '@vkruglikov/react-telegram-web-app';

export default function Reports() {
  const onBack = () => window.history.back();

  return (
    <div className="p-4">
      <BackButton onClick={onBack} />
      <h2>Отчёты</h2>
      {/* верхнее меню */}
      <MainButton text="Скачать PDF" onClick={() => {/* ... */}} />
    </div>
  );
}
