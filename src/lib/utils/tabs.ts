import browser, { Tabs } from 'webextension-polyfill';
import Tab = Tabs.Tab;

export const getMyVisitTab = async (): Promise<Tab | null> => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
    url: '*://*.myvisit.com/*',
  });
  return tab;
};
