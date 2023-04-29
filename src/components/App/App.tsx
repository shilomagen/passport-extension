import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService } from '@src/services/storage';
import { Button, Typography } from 'antd';
import Content from '@src/content.json';
import styles from './App.scss';
import browser, { Tabs } from 'webextension-polyfill';
import GamKenBot from '@src/assets/gamkenbot.svg';
import { Consent } from '@src/components/Consent/Consent';
import { UserMetadata } from '@src/components/UserMetadata/UserMetadata';
import { LoginStatus } from '@src/components/LoginStatus/LoginStatus';
import { ActionTypes } from '@src/platform-message';

import Tab = Tabs.Tab;
import { AppTestIds } from '@src/components/dataTestIds';
import { useUserMetadata } from '@src/hooks/userMetadata';

const { Title } = Typography;

const storageService = new StorageService();

export const App: FunctionComponent = () => {
  const { userMetadata, isValidMetadata, setMetadata } = useUserMetadata(storageService);
  const [consent, setConsent] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    storageService.getConsent().then(setConsent);
    storageService.getIsSearching().then(setSearching);
  }, []);

  const setUserConsent = (val: boolean) => {
    setConsent(val);
    void storageService.setConsent(val);
  };

  const submitEnabled = consent && isValidMetadata;

  const getMyVisitTab = async (): Promise<Tab | null> => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
      url: '*://*.myvisit.com/*',
    });
    return tab;
  };

  const start = async () => {
    const maybeMyVisitTab = await getMyVisitTab();
    if (maybeMyVisitTab) {
      await browser.tabs.sendMessage(maybeMyVisitTab.id!, { action: ActionTypes.StartSearch });
      setSearching(true);
    }
  };

  const stop = async () => {
    const maybeMyVisitTab = await getMyVisitTab();
    if (maybeMyVisitTab) {
      await browser.tabs.sendMessage(maybeMyVisitTab.id!, { action: ActionTypes.StopSearch });
      setSearching(false);
    }
  };

  return (
    <div className={styles.container}>
      <LoginStatus />
      <div>
        <Title level={2}>{Content.title}</Title>
        <div className={styles.logoContainer}>
          <GamKenBot className={styles.logo} />
        </div>
      </div>
      <UserMetadata userMetadata={userMetadata} onMetadataChanged={setMetadata} />
      <div className={styles.consentContainer}>
        <Consent onConsentChanged={setUserConsent} consent={consent} />
      </div>
      <div className={styles.buttonContainer}>
        {searching ? (
          <Button onClick={stop} data-testid={AppTestIds.STOP_SEARCH_BUTTON}>
            {Content.buttons.stopSearch}
          </Button>
        ) : (
          <Button onClick={start} disabled={!submitEnabled} data-testid={AppTestIds.START_SEARCH_BUTTON}>
            {Content.buttons.search}
          </Button>
        )}
      </div>
    </div>
  );
};
