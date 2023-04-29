import { useEffect, useState } from 'react';
import { StorageService, UserMetadata } from '@src/services/storage';
import { DateUtils } from '@src/lib/utils';
import {
  validateEndDate,
  validateIsraeliIdNumber,
  validateNumberOfAllowedCities,
  validatePhoneNumber,
  validateStartDate,
} from '@src/validators/validators';
import dayjs from 'dayjs';
import debounce from 'lodash.debounce';
import addDays from 'date-fns/addDays';

type SetMetadataFunction = {
  <T>(value: T): void;
};

export type SetMetadata = (property: keyof UserMetadata) => SetMetadataFunction;

export const useUserMetadata = (storageService: StorageService) => {
  const [userMetadata, setUserMetadata] = useState<UserMetadata>({
    phone: '',
    cities: [],
    id: '',
    startDate: new Date().getTime(),
    endDate: addDays(new Date(), 14).getTime(),
  });
  const { id, phone, cities, startDate, endDate } = userMetadata;

  useEffect(() => {
    storageService.getUserMetadata().then((metadata) => {
      if (metadata) {
        initializeMetadata(metadata);
      }
    });
  }, []);

  const setDataInCache = debounce((userMetadata) => storageService.setUserMetadata(userMetadata), 500);

  const initializeMetadata = (metadata: UserMetadata) => {
    const { cities, phone, id } = metadata;
    const { startDate, endDate } = initializeDates(metadata);
    setUserMetadata({ cities, phone, id, startDate, endDate });
  };

  const initializeDates = (metadata: UserMetadata) => {
    const startOfTodayDate = dayjs(new Date()).startOf('day').toDate();

    const startDate =
      metadata.startDate && DateUtils.isBefore(new Date(metadata.startDate), startOfTodayDate)
        ? new Date().getTime()
        : metadata.startDate;
    const endDate =
      metadata.endDate && DateUtils.isBefore(new Date(metadata.endDate), startOfTodayDate)
        ? addDays(new Date(), 14).getTime()
        : metadata.endDate;

    return { startDate, endDate };
  };

  const setMetadata: SetMetadata =
    (property: keyof UserMetadata) =>
    <T>(value: T) => {
      const newMetadata = { ...userMetadata, ...{ [property]: value } };
      setUserMetadata(newMetadata);
      setDataInCache(newMetadata);
    };

  const isValidMetadata =
    validateIsraeliIdNumber(id) &&
    validatePhoneNumber(phone) &&
    validateNumberOfAllowedCities(cities) &&
    startDate > 0 &&
    validateStartDate(dayjs(startDate), endDate ? dayjs(endDate) : undefined) &&
    endDate > 0 &&
    validateEndDate(dayjs(endDate), startDate ? dayjs(startDate) : undefined);

  return { userMetadata, isValidMetadata, setMetadata };
};
