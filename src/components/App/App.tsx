import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService, UserMetadata } from '@src/services/storage';
import { Button, DatePicker, Input, Select, Typography } from 'antd';
import Content from '@src/content.json';
import { Locations } from '@src/lib/locations';
import styles from './App.scss';
import debounce from 'lodash.debounce';
import browser, { Tabs } from 'webextension-polyfill';
import { ActionTypes, ReportAnalyticsMessage } from '@src/platform-message';
import GamKenBot from '@src/assets/gamkenbot.svg';
import { Consent } from '@src/components/Consent/Consent';
import dayjs from 'dayjs';
import addDays from 'date-fns/addDays';
import { LoginStatus } from '@src/components/LoginStatus/LoginStatus';
import { AnalyticsEventType } from '@src/services/analytics';
import { validateIsraeliIdNumber, validatePhoneNumber, validateNumberOfAllowedCities } from '@src/validators/validators';
import Tab = Tabs.Tab;

const { Title, Text } = Typography;

const ALL_CITIES = Array.from(new Set(Locations.map((location) => location.city))).map((value) => ({ value }));

const storageService = new StorageService();

export const App: FunctionComponent = () => {
  const [userMetadata, setUserMetadata] = useState<UserMetadata>({
    phone: '',
    cities: [],
    id: '',
    lastDate: addDays(new Date(), 14).getTime(),
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

  const { id, phone, cities, lastDate } = userMetadata;

  const submitEnabled = (
    validateIsraeliIdNumber(id) &&
    validatePhoneNumber(phone) &&
    cities.length > 0 &&
    cities.length <= 4 &&
    consent && lastDate > 0
  );
  const setDataInCache = debounce((userMetadata) => storageService.setUserMetadata(userMetadata), 500);

  const initializeMetadata = (metadata: UserMetadata) => {
    const { cities, phone, id, lastDate } = metadata;
    setUserMetadata({ cities, phone, id, lastDate });
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

  const onDateChange = (dateString: string) => {
    const dateSelected = new Date(dateString);
    setMetadata('lastDate')(new Date(dateSelected).getTime());
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
      await browser.tabs.sendMessage(maybeMyVisitTab.id!, {
        action: ActionTypes.ReportAnalytics,
        payload: { type: AnalyticsEventType.StartSearch, payload: { cities: cities.join(',') } },
      } as ReportAnalyticsMessage);
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
      <Text>{Content.maxDateForAppointment.title}</Text>
      <DatePicker
        placeholder={Content.maxDateForAppointment.placeholder}
        className={styles.datePickerContainer}
        value={userMetadata.lastDate ? dayjs(userMetadata.lastDate) : null}
        onChange={(_, dateString) => onDateChange(dateString)}
      />
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
