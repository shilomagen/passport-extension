import { DateUtils } from './date';

describe('[Date Utils]', () => {
  describe('timeSinceMidnightToHour', () => {
    test('should pad number with 0 if it has single digit in hour', () => {
      const timeFromMidnight = 520;
      expect(DateUtils.timeSinceMidnightToHour(timeFromMidnight).split(':')[0]).toBe('08');
    });
    test('should pad number with 0 if it  has single digit in minutes', () => {
      const timeFromMidnight = 421;
      expect(DateUtils.timeSinceMidnightToHour(timeFromMidnight).split(':')[1]).toBe('01');
    });
  });

  describe('isDateInRange', () => {
    const startDate = new Date('2023-04-10');
    const endDate = new Date('2023-04-20');
    test('should return true if current date is within date range', () => {
      const currentDate = '2023-04-15';
      expect(DateUtils.isDateInRange(currentDate, startDate, endDate)).toBe(true);
    });
    test('should return true if current date is equal to start date', () => {
      const currentDate = '2023-04-10';
      expect(DateUtils.isDateInRange(currentDate, startDate, endDate)).toBe(true);
    });
    test('should return true if current date is equal to end date', () => {
      const currentDate = '2023-04-20';
      expect(DateUtils.isDateInRange(currentDate, startDate, endDate)).toBe(true);
    });
    test('should return false if current date is before start date', () => {
      const currentDate = '2023-04-05';
      expect(DateUtils.isDateInRange(currentDate, startDate, endDate)).toBe(false);
    });
    test('should return false if current date is after end date', () => {
      const startDate = new Date('2023-04-10');
      const endDate = new Date('2023-04-20');
      const currentDate = '2023-04-25';
      expect(DateUtils.isDateInRange(currentDate, startDate, endDate)).toBe(false);
    });
  });

  describe('isBefore', () => {
    test('should return true if date is before the compare date', () => {
      const currentDate = new Date('2023-04-14');
      const compareDate = new Date('2023-04-15');
      expect(DateUtils.isBefore(currentDate, compareDate)).toBe(true);
    });

    test('should return false if current date is after the compare date', () => {
      const currentDate = new Date('2023-04-16');
      const compareDate = new Date('2023-04-15');
      expect(DateUtils.isBefore(currentDate, compareDate)).toBe(false);
    });

    test('should return false if current date is equal to the compare date', () => {
      const currentDate = new Date('2023-04-15');
      const compareDate = new Date('2023-04-15');
      expect(DateUtils.isBefore(currentDate, compareDate)).toBe(false);
    });
  });

  describe('isAfter', () => {
    test('should return true if date is after the compare date', () => {
      const currentDate = new Date('2023-04-20');
      const compareDate = new Date('2023-04-15');
      expect(DateUtils.isAfter(currentDate, compareDate)).toBe(true);
    });
    test('should return false if current date is before the compare date', () => {
      const currentDate = new Date('2023-04-10');
      const compareDate = new Date('2023-04-15');
      expect(DateUtils.isAfter(currentDate, compareDate)).toBe(false);
    });
    test('should return false if current date is equal to the compare date', () => {
      const currentDate = new Date('2023-04-15');
      const compareDate = new Date('2023-04-15');
      expect(DateUtils.isAfter(currentDate, compareDate)).toBe(false);
    });
  });
});
