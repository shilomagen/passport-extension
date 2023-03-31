import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService, UserMetadata } from '@src/services/storage';
import { Button, DatePicker, TimePicker, Input, Select, Typography } from 'antd';
import Content from '@src/content.json';
import { Locations } from '@src/lib/locations';
import styles from './App.scss';
import debounce from 'lodash.debounce';
import browser from 'webextension-polyfill';
import { ActionTypes } from '@src/action-types';
import GamKenBot from '@src/assets/gamkenbot.svg';
import { Consent } from '@src/components/Consent/Consent';
import dayjs from 'dayjs';
import addDays from 'date-fns/addDays';
import { LoginStatus } from '@src/components/LoginStatus/LoginStatus';
const format = 'HH:mm';

const { Title, Text } = Typography;

const ALL_CITIES = Array.from(new Set(Locations.map((location) => location.city))).map((value) => ({ value }));

const storageService = new StorageService();

export const App: FunctionComponent = () => {
  const [userMetadata, setUserMetadata] = useState<UserMetadata>({
    phone: '',
    cities: [],
    id: '',
    lastDate: addDays(new Date(), 14).getTime(),
    preferredTime: '',
  });
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    storageService.getConsent().then(setConsent);
  }, []);

  const setUserConsent = (val: boolean) => {
    setConsent(val);
    void storageService.setConsent(val);
  };

  const { id, phone, cities, lastDate, preferredTime } = userMetadata;

  const submitEnabled = id && phone && cities.length > 0 && consent && lastDate > 0 && preferredTime;
  const setDataInCache = debounce((userMetadata) => storageService.setUserMetadata(userMetadata), 500);

  const initializeMetadata = (metadata: UserMetadata) => {
    const { cities, phone, id, lastDate, preferredTime } = metadata;

    setUserMetadata({ cities, phone, id, lastDate, preferredTime });
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

  const onPreferredTimeChange = (preferredTime: string) => {
    setMetadata('preferredTime')(preferredTime);
  };

  const disabledTime = (current: dayjs.Dayjs) => {
    const disabledHours = [0, 1, 2, 3, 4, 5, 6, 18, 19, 20, 21, 22, 23];
    return {
      disabledHours: () => disabledHours,
    };
  };


  const start = async () => {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    await browser.tabs.sendMessage(tab.id!, { action: ActionTypes.StartSearch });
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
        onChange={(e) => setMetadata('id')(e.target.value)}
      />
      <Input
        className={styles.inputContainer}
        addonBefore={Content.phone.label}
        name="phone"
        value={userMetadata.phone}
        placeholder={Content.phone.placeholder}
        onChange={(e) => setMetadata('phone')(e.target.value)}
      />
      <Select
        options={ALL_CITIES}
        value={userMetadata.cities}
        placeholder={Content.citiesLabel}
        onChange={setMetadata('cities')}
        mode="multiple"
        listHeight={200}
        className={styles.selectContainer}
      />
      <Text>{Content.DateTimeSelectorTitle.title}</Text>
      <DatePicker
        placeholder={Content.DateTimeSelectorTitle.placeholderDate}
        className={styles.datePickerContainer}
        value={userMetadata.lastDate ? dayjs(userMetadata.lastDate) : null}
        onChange={(_, dateString) => onDateChange(dateString)}
        />
      <TimePicker
        placeholder={Content.DateTimeSelectorTitle.placeholderTime}
        className={styles.timePickerContainer}
        format={format}
        disabledTime={disabledTime}
        hideDisabledOptions={true}
        value={userMetadata.preferredTime ? dayjs(userMetadata.preferredTime, format) : null}
        onChange={(_, timeSelected) => onPreferredTimeChange(timeSelected)}
        />
      <div className={styles.consentContainer}>
        <Consent onConsentChanged={setUserConsent} consent={consent} />
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={start} disabled={!submitEnabled}>
          {Content.buttons.search}
        </Button>
      </div>
    </div>
  );
};
