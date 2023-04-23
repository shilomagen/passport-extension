import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService, UserMetadata } from '@src/services/storage';
import { Button, Input, Select, Typography } from 'antd';
import { DateOptions, DateRangePicker } from '@src/components/DateRangePicker/DateRangePicker';
import Content from '@src/content.json';
import { Locations } from '@src/lib/locations';
import styles from './App.scss';
import debounce from 'lodash.debounce';
import browser, { Tabs } from 'webextension-polyfill';
import GamKenBot from '@src/assets/gamkenbot.svg';
import { Consent } from '@src/components/Consent/Consent';
import addDays from 'date-fns/addDays';
import { LoginStatus } from '@src/components/LoginStatus/LoginStatus';
import {
  validateIsraeliIdNumber,
  validateNumberOfAllowedCities,
  validatePhoneNumber,
} from '@src/validators/validators';
import { ActionTypes } from '@src/platform-message';

import Tab = Tabs.Tab;
const { Title, Text } = Typography;

const ALL_CITIES = Array.from(new Set(Locations.map((location) => location.city))).map((value) => ({ value }));

const storageService = new StorageService();

export const App: FunctionComponent = () => {
  const [userMetadata, setUserMetadata] = useState<UserMetadata>({
    phone: '',
    cities: [],
    id: '',
    startDate: new Date().getTime(),
    endDate: addDays(new Date(), 14).getTime(),
  });
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

  const { id, phone, cities, startDate, endDate } = userMetadata;

  const submitEnabled =
    validateIsraeliIdNumber(id) &&
    validatePhoneNumber(phone) &&
    cities.length > 0 &&
    cities.length <= 4 &&
    consent &&
    startDate > 0 &&
    endDate > 0;

  const setDataInCache = debounce((userMetadata) => storageService.setUserMetadata(userMetadata), 500);

  const initializeMetadata = (metadata: UserMetadata) => {
    const { cities, phone, id, startDate, endDate } = metadata;
    setUserMetadata({ cities, phone, id, startDate, endDate });
  };

  const setMetadata =
    (property: keyof UserMetadata) =>
    <T,>(value: T) => {
      const newMetadata = { ...userMetadata, ...{ [property]: value } };
      setUserMetadata(newMetadata);
      setDataInCache(newMetadata);
    };

  useEffect(() => {
    storageService.getUserMetadata().then((metadata) => {
      if (metadata) {
        initializeMetadata(metadata);
      }
    });
  }, []);

  const onDateChange = (dateSelected: Date, dateOption: DateOptions) => {
    setMetadata(dateOption)(new Date(dateSelected).getTime());
  };

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
      <Input
        className={styles.inputContainer}
        addonBefore={Content.id.label}
        name="id"
        value={userMetadata.id}
        placeholder={Content.id.placeholder}
        status={validateIsraeliIdNumber(userMetadata.id) ? '' : 'error'}
        onChange={(e) => setMetadata('id')(e.target.value)}
      />
      <Input
        className={styles.inputContainer}
        addonBefore={Content.phone.label}
        name="phone"
        value={userMetadata.phone}
        placeholder={Content.phone.placeholder}
        status={validatePhoneNumber(userMetadata.phone) ? '' : 'error'}
        onChange={(e) => setMetadata('phone')(e.target.value)}
      />
      <Text>{Content.maxCitiesText}</Text>
      <Select
        options={ALL_CITIES}
        value={userMetadata.cities}
        placeholder={Content.citiesLabel}
        onChange={setMetadata('cities')}
        mode="multiple"
        listHeight={200}
        status={validateNumberOfAllowedCities(userMetadata.cities) ? 'error' : ''}
        className={styles.selectContainer}
      />
      <DateRangePicker userMetadata={userMetadata} onDateChange={onDateChange} />
      <div className={styles.consentContainer}>
        <Consent onConsentChanged={setUserConsent} consent={consent} />
      </div>
      <div className={styles.buttonContainer}>
        {searching ? (
          <Button onClick={stop}>{Content.buttons.stopSearch}</Button>
        ) : (
          <Button onClick={start} disabled={!submitEnabled}>
            {Content.buttons.search}
          </Button>
        )}
      </div>
    </div>
  );
};
