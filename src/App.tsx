
import Dashboard from './pages/Dashboard';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

export default function App(){
  return (
    <WebAppProvider options={{ smoothButtonsTransition: true }}>
      <Dashboard />
    </WebAppProvider>
  );
}
