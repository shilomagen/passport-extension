import * as React from 'react';
import * as ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { App } from '@src/components/App';

import { ConfigProvider } from 'antd';
import locale from 'antd/locale/he_IL';
// import './popup.scss';

export const Popup = () => (
  <ConfigProvider direction={'rtl'} locale={locale} theme={{ token: { fontFamily: 'Heebo' } }}>
    <App />
  </ConfigProvider>
);

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(<Popup />, document.getElementById('popup'));
});
