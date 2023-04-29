import { DateUtils } from '@src/lib/utils';
import startOfDay from 'date-fns/startOfDay';

export const validateIsraeliIdNumber = (id: any): boolean => {
  if (!id) {
    return false;
  }
  id = String(id).trim();
  if (id.length !== 9 || isNaN(Number(id))) return false;
  return (
    Array.from(id, Number).reduce((counter: number, digit: number, i: number) => {
      const step = digit * ((i % 2) + 1);
      return counter + (step > 9 ? step - 9 : step);
    }, 0) %
      10 ===
    0
  );
};

export const validatePhoneNumber = (inputString: string): boolean => {
  const regex = /^05\d{8}$/;
  return regex.test(inputString);
};

export const validateNumberOfAllowedCities = (cities: string[]): boolean => {
  return cities.length > 0 && cities.length <= 4;
};

export const validateEndDate = (endDate: number, startDate?: number): boolean => {
  if (endDate === 0) {
    return false;
  }

  const startOfEndDate = startOfDay(new Date(endDate));
  const startOfTodayDate = startOfDay(new Date());
  const startOfStartDate = startDate ? startOfDay(new Date(startDate)) : undefined;

  const isAfterOrEqualToday =
    DateUtils.isAfter(startOfEndDate, startOfTodayDate) || DateUtils.isEqual(startOfEndDate, startOfTodayDate);

  if (startOfStartDate) {
    const isAfterOrEqualStartDate =
      DateUtils.isAfter(startOfEndDate, startOfStartDate) || DateUtils.isEqual(startOfEndDate, startOfStartDate);

    return isAfterOrEqualToday && isAfterOrEqualStartDate;
  }

  return isAfterOrEqualToday;
};

export const validateStartDate = (startDate: number, endDate?: number): boolean => {
  if (startDate === 0) {
    return false;
  }

  const startOfStartDate = startOfDay(new Date(startDate));
  const startOfTodayDate = startOfDay(new Date());
  const startOfEndDate = endDate ? startOfDay(new Date(endDate)) : undefined;

  const isAfterOrEqualToday =
    DateUtils.isAfter(startOfStartDate, startOfTodayDate) || DateUtils.isEqual(startOfStartDate, startOfTodayDate);

  if (startOfEndDate) {
    const isBeforeOrEqualEndDate =
      DateUtils.isBefore(startOfStartDate, startOfEndDate) || DateUtils.isEqual(startOfStartDate, startOfEndDate);
    return isAfterOrEqualToday && isBeforeOrEqualEndDate;
  }

  return isAfterOrEqualToday;
};
