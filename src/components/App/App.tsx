import React, { FunctionComponent, useEffect, useState } from 'react';
import { StorageService, UserMetadata } from '@src/services/storage';
import { Button, DatePicker, Input, Select, Typography } from 'antd';
import Content from '@src/content.json';
import { Locations } from '@src/lib/locations';
import styles from './App.scss';
import debounce from 'lodash.debounce';
import browser from 'webextension-polyfill';
import GamKenBot from '@src/assets/gamkenbot.svg';
import { Consent } from '@src/components/Consent/Consent';
import dayjs from 'dayjs';
import addDays from 'date-fns/addDays';
import { LoginStatus } from '@src/components/LoginStatus/LoginStatus';
import { VersionInfo } from '@src/components/VersionInfo/VersionInfo';
import {
  validateIsraeliIdNumber,
  validateNumberOfAllowedCities,
  validatePhoneNumber,
} from '@src/validators/validators';
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { SearchStatusType, SearchStatus } from '@src/lib/internal-types';
import { getMyVisitTab } from '@src/lib/utils';
import { useLoggedIn } from '@src/hooks/loggedIn';

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
  const [searchStatus, setSearchStatus] = useState<SearchStatus>({type: SearchStatusType.Stopped});
  const loggedIn = useLoggedIn();

  useEffect(() => {
    storageService.getConsent().then(setConsent);
    storageService.getSearchStatus().then(setSearchStatus);
  }, []);

  const setUserConsent = (val: boolean) => {
    setConsent(val);
    void storageService.setConsent(val);
  };

  const { id, phone, cities, lastDate } = userMetadata;

  const submitEnabled =
    validateIsraeliIdNumber(id) &&
    validatePhoneNumber(phone) &&
    cities.length > 0 &&
    cities.length <= 4 &&
    consent &&
    lastDate > 0 &&
    loggedIn;
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

  useEffect(() => {
    const listener = (message: PlatformMessage) => {
      if (message.action == ActionTypes.SetSearchStatus) {
        setSearchStatus(message.status)
      }
    }

    browser.runtime.onMessage.addListener(listener);

    return () => browser.runtime.onMessage.removeListener(listener)
  }, [])

  const onDateChange = (dateString: string) => {
    const dateSelected = new Date(dateString);
    setMetadata('lastDate')(new Date(dateSelected).getTime());
  };

  const start = async () => {
    const maybeMyVisitTab = await getMyVisitTab();
    if (maybeMyVisitTab) {
      await browser.tabs.sendMessage(maybeMyVisitTab.id!, { action: ActionTypes.StartSearch });
    }
  };

  const stop = async () => {
    const maybeMyVisitTab = await getMyVisitTab();
    if (maybeMyVisitTab) {
      await browser.tabs.sendMessage(maybeMyVisitTab.id!, { action: ActionTypes.StopSearch });
    }
  };

  const renderMainButton = () => {
    if (searchStatus.type === SearchStatusType.Started || searchStatus.type === SearchStatusType.Warning) {
      return <Button onClick={stop}>{Content.buttons.stopSearch}</Button>
    } else if (searchStatus.type === SearchStatusType.Waiting) {
      return <Button disabled>{Content.buttons.waiting}</Button>
    } else {
      return <Button onClick={start} disabled={!submitEnabled}>{Content.buttons.search}</Button>
    }
  } 

  const renderMessage = () => {
    const colorClass = searchStatus.type === SearchStatusType.Error
      ? styles.error
      : searchStatus.type === SearchStatusType.Warning
        ? styles.warning
        : ''

    return <div className={styles.messageContainer}>
            <Text className={colorClass}>
              {searchStatus.message}
            </Text>
          </div>
  }

  return (
    <div className={styles.container}>
      <LoginStatus />
      
      <div>
        <Title level={2}>{Content.title}</Title>
        <VersionInfo />
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
      
      {searchStatus.message && renderMessage()}

      <div className={styles.buttonContainer}>
        {renderMainButton()}
      </div>
    </div>
  );
};
