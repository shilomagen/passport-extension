import format from 'date-fns/format';
import differenceInDays from 'date-fns/differenceInDays';

const ApiDateFormat = 'yyyy-MM-dd';
const IsraelDateFormat = 'dd-MM-yyyy';

const padIfNeeded = (digit: number) => `${digit}`.length === 1 ? `0${digit}` : `${digit}`

export const DateUtils = {
  isDateInDaysRange: (date: string, maxDaysDifference: number) => differenceInDays(new Date(date), new Date()) < maxDaysDifference,
  timeSinceMidnightToHour: (timeSinceMidnight: number): string =>
    `${padIfNeeded(Math.floor(timeSinceMidnight / 60))}:${padIfNeeded(timeSinceMidnight % 60)}`,
  toApiFormattedDate: (date: string | number) => format(new Date(date), ApiDateFormat),
  toIsraelFormattedDate: (date: string | number) => format(new Date(date), IsraelDateFormat),
  timeStringToMinutesAfterMidnight: (timeString: string): number =>
    timeString.split(":").reduce((acc, timePart) => acc * 60 + +timePart, 0)
};
