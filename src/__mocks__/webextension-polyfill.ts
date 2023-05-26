// src/__mocks__/webextension-polyfill
// Update this file to include any mocks for the `webextension-polyfill` package
// This is used to mock these values for Storybook so you can develop your components
// outside the Web Extension environment provided by a compatible browser
// See .storybook/main.js to see how this module is swapped in for `webextension-polyfill`
import { MessagingTestkit } from '../../test/testkits/messaging.testkit';
import { LocalStorageTestkit } from '../../test/testkits/storage.testkit';

const messagingTestkit = new MessagingTestkit();

const browser: any = {
  tabs: {
    executeScript(currentTabId: number, details: any) {
      return Promise.resolve({ done: true });
    },
    query(params: any): Promise<Tab[]> {
      return Promise.resolve([{ id: 123 }]);
    },
    sendMessage: (tabId: number, message: any) => messagingTestkit.sendMessage(message),
  },
  runtime: {
    sendMessage: messagingTestkit.sendMessage,
    onMessage: {
      addListener: messagingTestkit.addListener,
      removeListener: messagingTestkit.removeListener,
    },
    onInstalled: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
  },
  storage: {
    onChanged: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    },
    local: new LocalStorageTestkit(),
  },
  webNavigation: {
    onCompleted: {
      addListener: () => null,
    },
  },
  action: {
    setIcon: jest.fn(),
  },
};
export default browser;

interface Tab {
  id: number;
}

export interface Tabs {
  Tab: Tab;
}
