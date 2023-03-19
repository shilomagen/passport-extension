import { DateUtils } from './date';

describe('[Date Utils]', () => {
  test('should pad number with 0 if it has single digit in hour', () => {
    const timeFromMidnight = 520;
    expect(DateUtils.timeSinceMidnightToHour(timeFromMidnight).split(':')[0]).toBe('08');
  });
  test('should pad number with 0 if it  has single digit in minutes', () => {
    const timeFromMidnight = 421;
    expect(DateUtils.timeSinceMidnightToHour(timeFromMidnight).split(':')[1]).toBe('01');
  });
});
