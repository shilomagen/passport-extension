import browser from 'webextension-polyfill';
import { StorageService } from '@src/services/storage';
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { Gamkenbot } from '@src/lib/gamkenbot/gamkenbot';
import { match } from 'ts-pattern';

const storageService = new StorageService();

const VALID_COOKIES_NAMES = ['CentralJwtAnonymous', 'CentralJWTCookie'];

browser.webNavigation.onCompleted.addListener(
  async () => {
    browser.cookies.onChanged.addListener(async (changeInfo) => {
      if (VALID_COOKIES_NAMES.includes(changeInfo.cookie.name) && !changeInfo.removed) {
        await storageService.setLoggedIn(true);
      }
    });

    await browser.runtime.sendMessage({ action: ActionTypes.IsLoggedIn } as PlatformMessage);
  },
  { url: [{ hostSuffix: '.myvisit.com' }] },
);

// Migration scripts
browser.runtime.onInstalled.addListener(async (details) => {
  const lastVersion = await storageService.getLastExtensionVersion();

  if (details.reason == 'update') {
    if (!lastVersion) {
      // This means we updated from a version where there wasn't lastVersion feature
      await browser.storage.local.remove('userSearching');
    }

    // More update migrations. We can use lastVersion
  }

  await storageService.updateLastExtensionVersion();
});

const gamkenbot = new Gamkenbot();

browser.runtime.onMessage.addListener((message: PlatformMessage) => {
  match(message)
    .with({ action: ActionTypes.IsLoggedIn }, gamkenbot.setLoggedIn)
    .with({ action: ActionTypes.StartSearch }, gamkenbot.startSearching)
    .with({ action: ActionTypes.StopSearch }, gamkenbot.stopSearching)
    .with({ action: ActionTypes.SetSearchStatus }, () => null)
    .exhaustive();
});
