import browser from 'webextension-polyfill';
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { Gamkenbot } from '@src/content-script/gamkenbot';
import { match } from 'ts-pattern';

const gamkenbot = new Gamkenbot();

browser.runtime.onMessage.addListener((message: PlatformMessage) => {
  match(message)
    .with({ action: ActionTypes.IsLoggedIn }, gamkenbot.setLoggedIn)
    .with({ action: ActionTypes.StartSearch }, gamkenbot.startSearching)
    .with({ action: ActionTypes.StopSearch }, gamkenbot.stopSearching)
    .with({ action: ActionTypes.SetSearchStatus }, () => {})
    .exhaustive();
});
