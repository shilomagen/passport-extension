import browser from 'webextension-polyfill';
import { StorageService } from '@src/services/storage';
import { ActionTypes } from '@src/action-types';

const storageService = new StorageService();
browser.webNavigation.onCompleted.addListener(
  async () => {
    browser.cookies.onChanged.addListener(async (changeInfo) => {
      if (changeInfo.cookie.name === 'CentralJWTCookie' && !changeInfo.removed) {
        await storageService.setLoggedIn(true);
      }
    });
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await browser.tabs.sendMessage(tabs[0].id!, { action: ActionTypes.IsLoggedIn });
    }
  },
  { url: [{ hostSuffix: '.myvisit.com' }] },
);
