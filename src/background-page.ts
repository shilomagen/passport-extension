import browser from 'webextension-polyfill';
import { StorageService } from '@src/services/storage';
import { ActionTypes } from '@src/action-types';

const storageService = new StorageService();

const VALID_COOKIES_NAMES = ['CentralJwtAnonymous', 'CentralJWTCookie'];

browser.webNavigation.onCompleted.addListener(
  async () => {
    browser.cookies.onChanged.addListener(async (changeInfo) => {
      if (VALID_COOKIES_NAMES.includes(changeInfo.cookie.name) && !changeInfo.removed) {
        await storageService.setLoggedIn(true);
      }
    });
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    await browser.tabs.sendMessage(tab.id!, { action: ActionTypes.IsLoggedIn });
  },
  { url: [{ hostSuffix: '.myvisit.com' }] },
);
