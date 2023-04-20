import * as React from 'react';
import { createRoot } from 'react-dom/client';
import browser from 'webextension-polyfill';
import { App } from '@src/components/App';
import { ConfigProvider } from 'antd';
import locale from 'antd/locale/he_IL';

import 'antd/dist/reset.css';
import './popup.scss';

export const Popup = () => (
  <ConfigProvider direction={'rtl'} locale={locale} theme={{ token: { fontFamily: 'Heebo' } }}>
    <App />
  </ConfigProvider>
);

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  const root = createRoot(document.getElementById('popup') as HTMLElement);

  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
});
