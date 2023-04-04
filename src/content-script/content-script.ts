import browser from 'webextension-polyfill';
import { ActionTypes } from '@src/action-types';
import { Gamkenbot } from '@src/content-script/gamkenbot';

const gamkenbot = new Gamkenbot();

const handlers: Record<ActionTypes, () => Promise<boolean>> = {
  [ActionTypes.StartSearch]: () => gamkenbot.startSearching(),
  [ActionTypes.StopSearch]: () => gamkenbot.stopSearching(),
  [ActionTypes.IsLoggedIn]: () => gamkenbot.setLoggedIn(),
};

browser.runtime.onMessage.addListener((message) => {
  const handler = handlers[message.action as ActionTypes];
  if (handler) {
    return handler();
  } else {
    console.error('Could not find method with type', message.type);
    return Promise.resolve(false);
  }
});
