import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService, UserMetadata } from '@src/services/storage';
import { Button, DatePicker, Input, Select, Typography } from 'antd';
import Content from '@src/content.json';
import { Locations } from '@src/lib/locations';
import styles from './App.scss';
import { useLoggedIn } from '@src/hooks/loggedIn';
import debounce from 'lodash.debounce';
import browser from 'webextension-polyfill';
import { ActionTypes } from '@src/action-types';
import GamKenBot from '@src/assets/gamkenbot.png';

const { Title } = Typography;

const ALL_CITIES = Array.from(new Set(Locations.map((location) => location.city))).map((value) => ({ value }));

const storageService = new StorageService();

export const App: FunctionComponent = () => {
  const [userMetadata, setUserMetadata] = useState<UserMetadata>({ phone: '', cities: [], id: '' });
  const { id, phone, cities } = userMetadata;
  const loggedIn = useLoggedIn();

  const submitEnabled = id && phone && cities.length > 0;
  const setDataInCache = debounce((userMetadata) => storageService.setUserMetadata(userMetadata), 500);

  const initializeMetadata = (metadata: UserMetadata) => {
    const { cities, phone, id } = metadata;
    setUserMetadata({ cities, phone, id });
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
  const goToLogin = () => {
    chrome.tabs.create({
      active: true,
      url: 'https://myvisit.com/#!/home/signin/',
    });
  };

  const start = async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      await browser.tabs.sendMessage(tabs[0].id!, { action: ActionTypes.StartSearch });
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <Title level={2}>{Content.title}</Title>
        <img src={GamKenBot} />
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
      <DatePicker placeholder={Content.maxDateForAppointment} className={styles.datePickerContainer} />
      <div>
        <Button onClick={goToLogin} disabled={!submitEnabled}>
          {loggedIn ? Content.buttons.loggedIn : Content.buttons.login}
        </Button>
        <Button onClick={start} disabled={!submitEnabled || !loggedIn}>
          {Content.buttons.search}
        </Button>
      </div>
    </div>
  );
};
