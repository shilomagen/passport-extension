import format from 'date-fns/format';

const ApiDateFormat = 'yyyy-MM-dd';
const IsraelDateFormat = 'dd-MM-yyyy';
export const IsraelDateDigitsFormat = 'DD-MM-YYYY';

const padIfNeeded = (digit: number) => (`${digit}`.length === 1 ? `0${digit}` : `${digit}`);

export const DateUtils = {
  isDateInRange: (date: string, firstDate: Date, lastDate: Date): boolean => {
    const dateFormat = new Date(date);
    return dateFormat >= firstDate && dateFormat <= lastDate;
  },
  isBefore: (currentDate: Date, compareDate: Date): boolean => currentDate < compareDate,
  isAfter: (currentDate: Date, compareDate: Date): boolean => currentDate > compareDate,
  timeSinceMidnightToHour: (timeSinceMidnight: number): string =>
    `${padIfNeeded(Math.floor(timeSinceMidnight / 60))}:${padIfNeeded(timeSinceMidnight % 60)}`,
  toApiFormattedDate: (date: string | number) => format(new Date(date), ApiDateFormat),
  toIsraelFormattedDate: (date: string | number) => format(new Date(date), IsraelDateFormat),
};
