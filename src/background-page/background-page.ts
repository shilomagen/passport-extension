import browser from 'webextension-polyfill';
import { StorageService } from '@src/services/storage';
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { SearchStatusType } from '@src/lib/internal-types';
import { dispatchSearchStatus } from '@src/lib/utils/status';

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
    
    await browser.tabs.sendMessage(tab.id!, { action: ActionTypes.IsLoggedIn } as PlatformMessage);
    await dispatchSearchStatus({ type: SearchStatusType.Stopped })
  },
  { url: [{ hostSuffix: '.myvisit.com' }] },
);

// Migration scripts
browser.runtime.onInstalled.addListener(async (details) => {
  const lastVersion = await storageService.getLastExtensionVersion()
  
  if (details.reason == 'update') {
    if (!lastVersion) { // This means we updated from a version where there wasn't lastVersion feature 
      await browser.storage.local.remove('userSearching')
    }
    
    // More update migrations. We can use lastVersion
  }

  await storageService.updateLastExtensionVersion()
})
