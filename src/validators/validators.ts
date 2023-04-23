import { DateUtils } from '@src/lib/utils';
import dayjs, { Dayjs } from 'dayjs';

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

export const validateNumberOfAllowedCities = (cities: string[] | null | undefined): boolean => {
  if (!cities || cities.length === 0) {
    return true;
  }
  return cities.length > 4;
};

export const isValidEndDate = (date: Dayjs, startDate?: Dayjs): boolean => {
  const startOfCompareDate = date.startOf('day').toDate();
  const startOfTodayDate = dayjs(new Date()).startOf('day').toDate();
  const startOfStartDate = startDate ? startDate.startOf('day').toDate() : undefined;

  const isAfterOrEqualToday =
    DateUtils.isAfter(startOfCompareDate, startOfTodayDate) || DateUtils.isEqual(startOfCompareDate, startOfTodayDate);

  if (!startOfStartDate) {
    return isAfterOrEqualToday;
  }

  const isAfterOrEqualStartDate =
    DateUtils.isAfter(startOfCompareDate, startOfStartDate) || DateUtils.isEqual(startOfCompareDate, startOfStartDate);

  return isAfterOrEqualToday && isAfterOrEqualStartDate;
};

export const isValidStartDate = (date: Dayjs, endDate?: Dayjs): boolean => {
  const startOfCompareDate = date.startOf('day').toDate();
  const startOfTodayDate = dayjs(new Date()).startOf('day').toDate();
  const startOfEndDate = endDate ? endDate.startOf('day').toDate() : undefined;

  const isAfterOrEqualToday =
    DateUtils.isAfter(startOfCompareDate, startOfTodayDate) || DateUtils.isEqual(startOfCompareDate, startOfTodayDate);

  if (!startOfEndDate) {
    return isAfterOrEqualToday;
  }

  const isBeforeOrEqualEndDate =
    DateUtils.isBefore(startOfCompareDate, startOfEndDate) || DateUtils.isEqual(startOfCompareDate, startOfEndDate);

  return isAfterOrEqualToday && isBeforeOrEqualEndDate;
};
