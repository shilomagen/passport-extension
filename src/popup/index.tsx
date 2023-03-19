import * as React from 'react';
import * as ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Popup } from './component';
import CssBaseline from '@mui/material/CssBaseline';

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
  ReactDOM.render(
    <>
      <CssBaseline />
      <Popup />
    </>,
    document.getElementById('popup'),
  );
});
