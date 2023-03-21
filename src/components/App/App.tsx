import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService, UserMetadata } from '@src/services/storage';
import { Button, DatePicker, Input, Select, Typography } from 'antd';
import Content from '@src/content.json';
import { Locations } from '@src/lib/locations';
import styles from './App.scss';
import { useLoggedIn } from '@src/hooks/loggedIn';
import debounce from 'lodash.debounce';

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
    await storageService.setUserMetadata({ id, phone, cities });
    chrome.tabs.create({
      active: true,
      url: 'https://myvisit.com/#!/home/provider/56',
    });
  };

  return (
    <div className={styles.popupContainer}>
      <Typography>{Content.title}</Typography>
      <div>
        <Input
          addonBefore={Content.id.label}
          name="id"
          value={userMetadata.id}
          placeholder={Content.id.placeholder}
          onChange={(e) => setMetadata('id')(e.target.value)}
        />
        <Input
          addonBefore={Content.phone.label}
          name="phone"
          value={userMetadata.phone}
          placeholder={Content.phone.placeholder}
          onChange={(e) => setMetadata('phone')(e.target.value)}
        />
      </div>
      <div>
        <Select
          options={ALL_CITIES}
          value={userMetadata.cities}
          placeholder={Content.citiesLabel}
          onChange={setMetadata('cities')}
          mode="multiple"
          className="w-full"
          placement={'bottomRight'}
        />
      </div>
      <div>
        <DatePicker placeholder={Content.maxDateForAppointment} placement={'bottomRight'} />
      </div>
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
