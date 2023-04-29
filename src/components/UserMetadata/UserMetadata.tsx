import { Input, Select, Typography } from 'antd';
import styles from './UserMetadata.scss';
import Content from '@src/content.json';
import {
  validateIsraeliIdNumber,
  validateNumberOfAllowedCities,
  validatePhoneNumber,
} from '@src/validators/validators';
import { UserMetadataTestIds } from '@src/components/dataTestIds';
import { DateOptions, DateRangePicker } from '@src/components/DateRangePicker/DateRangePicker';
import React, { FunctionComponent } from 'react';
import { Locations } from '@src/lib/locations';
import { UserMetadata as UserMetadataType } from '@src/services/storage';
import { SetMetadata } from '@src/hooks/userMetadata';

const { Text } = Typography;

interface IUserMetadata {
  userMetadata: UserMetadataType;
  onMetadataChanged: SetMetadata;
}

const ALL_CITIES = Array.from(new Set(Locations.map((location) => location.city))).map((value) => ({ value }));

export const UserMetadata: FunctionComponent<IUserMetadata> = ({ userMetadata, onMetadataChanged }) => {
  const onDateChanged = (dateSelected: Date, dateOption: DateOptions) => {
    onMetadataChanged(dateOption)(new Date(dateSelected).getTime());
  };

  return (
    <div>
      <Input
        className={styles.inputContainer}
        addonBefore={Content.id.label}
        name="id"
        value={userMetadata.id}
        placeholder={Content.id.placeholder}
        status={validateIsraeliIdNumber(userMetadata.id) ? '' : 'error'}
        onChange={(e) => onMetadataChanged('id')(e.target.value)}
        data-testid={UserMetadataTestIds.ID}
      />
      <Input
        className={styles.inputContainer}
        addonBefore={Content.phone.label}
        name="phone"
        value={userMetadata.phone}
        placeholder={Content.phone.placeholder}
        status={validatePhoneNumber(userMetadata.phone) ? '' : 'error'}
        onChange={(e) => onMetadataChanged('phone')(e.target.value)}
        data-testid={UserMetadataTestIds.PHONE_NUMBER}
      />
      <Text>{Content.maxCitiesText}</Text>
      <Select
        options={ALL_CITIES}
        value={userMetadata.cities}
        placeholder={Content.citiesLabel}
        onChange={onMetadataChanged('cities')}
        mode="multiple"
        listHeight={200}
        status={validateNumberOfAllowedCities(userMetadata.cities) ? '' : 'error'}
        className={styles.selectContainer}
        data-testid={UserMetadataTestIds.CITIES}
      />
      <DateRangePicker
        startDate={userMetadata.startDate}
        endDate={userMetadata.endDate}
        onDateChanged={onDateChanged}
      />
    </div>
  );
};
