import React from 'react';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';
import 'rippleui/dist/css/styles.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <WebAppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </WebAppProvider>
  );
}