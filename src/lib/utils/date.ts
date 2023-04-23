import format from 'date-fns/format';

const ApiDateFormat = 'yyyy-MM-dd';
export const IsraelDateFormat = 'dd-MM-yyyy';

const padIfNeeded = (digit: number) => (`${digit}`.length === 1 ? `0${digit}` : `${digit}`);

export const DateUtils = {
  isDateInRange: (date: string, startDate: Date, endDate: Date): boolean => {
    const dateFormat = new Date(date);
    return dateFormat >= startDate && dateFormat <= endDate;
  },
  isBefore: (currentDate: Date, compareDate: Date): boolean => currentDate < compareDate,
  isAfter: (currentDate: Date, compareDate: Date): boolean => currentDate > compareDate,
  timeSinceMidnightToHour: (timeSinceMidnight: number): string =>
    `${padIfNeeded(Math.floor(timeSinceMidnight / 60))}:${padIfNeeded(timeSinceMidnight % 60)}`,
  toApiFormattedDate: (date: string | number) => format(new Date(date), ApiDateFormat),
  toIsraelFormattedDate: (date: string | number) => format(new Date(date), IsraelDateFormat),
};
