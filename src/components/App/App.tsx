import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService } from '@src/services/storage';
import { Typography } from 'antd';
import Content from '@src/content.json';
import styles from './App.scss';
import browser from 'webextension-polyfill';
import GamKenBot from '@src/assets/gamkenbot.svg';
import { Consent } from '@src/components/Consent/Consent';
import { UserMetadata } from '@src/components/UserMetadata/UserMetadata';
import { LoginStatus } from '@src/components/LoginStatus/LoginStatus';
import { useUserMetadata } from '@src/hooks/userMetadata';
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { SearchStatusType, SearchStatus } from '@src/lib/internal-types';
import { MainButton } from '../MainButton/MainButton';
import { SearchMessage } from '../MainButton/SearchMessage';

const { Title } = Typography;

const storageService = new StorageService();

export const App: FunctionComponent = () => {
  const { userMetadata, isValidMetadata, setMetadata } = useUserMetadata(storageService);
  const [consent, setConsent] = useState(false);
  const [searchStatus, setSearchStatus] = useState<SearchStatus>({ type: SearchStatusType.Stopped });

  useEffect(() => {
    storageService.getConsent().then(setConsent);
    storageService.getSearchStatus().then(setSearchStatus);
  }, []);

  useEffect(() => {
    const listener = (message: PlatformMessage) => {
      if (message.action == ActionTypes.SetSearchStatus) {
        setSearchStatus(message.status);
      }
    };

    browser.runtime.onMessage.addListener(listener);

    return () => browser.runtime.onMessage.removeListener(listener);
  }, []);

  const setUserConsent = (val: boolean) => {
    setConsent(val);
    void storageService.setConsent(val);
  };

  const submitEnabled = consent && isValidMetadata;

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

      {searchStatus.message && <SearchMessage searchStatus={searchStatus} />}

      <MainButton searchStatusType={searchStatus.type} enabled={submitEnabled} />
    </div>
  );
};
