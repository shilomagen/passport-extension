import browser from 'webextension-polyfill';

browser.webNavigation.onCompleted.addListener(
  async () => {
    console.log('HERE');
    const anonymousCookie = await browser.cookies.get({
      url: 'https://myvisit.com',
      name: 'CentralJwtAnonymous',
    });
    if (anonymousCookie) {
      chrome.tabs.query({ url: 'https://myvisit.com/*' }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, { canStart: true });
      });
    }
  },
  { url: [{ hostSuffix: '.myvisit.com' }] },
);
