import {
  validateIsraeliIdNumber,
  validatePhoneNumber,
  validateNumberOfAllowedCities,
  validateStartDate,
  validateEndDate,
} from './validators';
import { startOfDay, addDays } from 'date-fns';

describe('validateIsraeliIdNumber', () => {
  test('returns true for a valid Israeli ID number', () => {
    expect(validateIsraeliIdNumber('123456782')).toBe(true);
  });

  test('returns false for a null or undefined input', () => {
    expect(validateIsraeliIdNumber(null)).toBe(false);
    expect(validateIsraeliIdNumber(undefined)).toBe(false);
  });

  test('returns false for an input that is not a string or number', () => {
    expect(validateIsraeliIdNumber({ id: '123456783' })).toBe(false);
  });

  test('returns false for an input that is not a valid Israeli ID number', () => {
    expect(validateIsraeliIdNumber('123456789')).toBe(false);
    expect(validateIsraeliIdNumber('12345678')).toBe(false);
    expect(validateIsraeliIdNumber('12345678a')).toBe(false);
  });
});

describe('validateNumberOfAllowedCities', () => {
  it('should return false for empty array input', () => {
    expect(validateNumberOfAllowedCities([])).toBe(false);
  });

  it('should return true for array input with 4 or fewer elements', () => {
    expect(validateNumberOfAllowedCities(['city1', 'city2', 'city3', 'city4'])).toBe(true);
  });

  it('should return false for array input with more than 4 elements', () => {
    expect(validateNumberOfAllowedCities(['city1', 'city2', 'city3', 'city4', 'city5'])).toBe(false);
  });
});

describe('validatePhoneNumber', () => {
  it('should return true for valid phone numbers', () => {
    expect(validatePhoneNumber('0521234567')).toBe(true);
    expect(validatePhoneNumber('0505555555')).toBe(true);
    expect(validatePhoneNumber('0549876543')).toBe(true);
  });

  it('should return false for invalid phone numbers', () => {
    expect(validatePhoneNumber('0521234')).toBe(false);
    expect(validatePhoneNumber('050555555')).toBe(false);
    expect(validatePhoneNumber('05498765432')).toBe(false);
    expect(validatePhoneNumber('052a234567')).toBe(false);
    expect(validatePhoneNumber('052 123 4567')).toBe(false);
    expect(validatePhoneNumber('052-123-4567')).toBe(false);
    expect(validatePhoneNumber('05212345678')).toBe(false);
    expect(validatePhoneNumber('1234567890')).toBe(false);
  });
});

describe('validateStartDate', () => {
  it('should return false if startDate is 0 - not selected', () => {
    expect(validateStartDate(0)).toBe(false);
  });

  it('should return true if startDate is after or equal to today', () => {
    expect(validateStartDate(startOfDay(new Date()).getTime())).toBe(true);
    expect(validateStartDate(startOfDay(addDays(new Date(), 1)).getTime())).toBe(true);
  });

  it('should return false if startDate is before today', () => {
    const startDate = startOfDay(addDays(new Date(), -1));
    expect(validateStartDate(startDate.getTime())).toBe(false);
  });

  it('should return true if startDate is after today and before endDate', () => {
    const startDate = startOfDay(addDays(new Date(), 1));
    const endDate = startOfDay(addDays(new Date(), 7));
    expect(validateStartDate(startDate.getTime(), endDate.getTime())).toBe(true);
  });

  it('should return false if startDate is before today and before endDate', () => {
    const startDate = startOfDay(addDays(new Date(), -1));
    const endDate = startOfDay(addDays(new Date(), 7));
    expect(validateStartDate(startDate.getTime(), endDate.getTime())).toBe(false);
  });

  it('should return false if startDate is after endDate', () => {
    const startDate = startOfDay(addDays(new Date(), 7));
    const endDate = startOfDay(addDays(new Date(), 1));
    expect(validateStartDate(startDate.getTime(), endDate.getTime())).toBe(false);
  });
});

describe('validateEndDate', () => {
  it('returns false for endDate 0 - not selected', () => {
    expect(validateEndDate(0)).toBe(false);
  });

  it('returns true when endDate is after today', () => {
    const endDate = addDays(new Date(), 1).getTime();
    expect(validateEndDate(endDate)).toBe(true);
  });

  it('returns false when endDate is before today', () => {
    const endDate = addDays(new Date(), -1).getTime();
    expect(validateEndDate(endDate)).toBe(false);
  });

  it('returns true when endDate is after startDate', () => {
    const startDate = new Date().getTime();
    const endDate = addDays(new Date(), 1).getTime();
    expect(validateEndDate(endDate, startDate)).toBe(true);
  });

  it('returns false when endDate is before startDate', () => {
    const startDate = new Date().getTime();
    const endDate = addDays(new Date(), -1).getTime();
    expect(validateEndDate(endDate, startDate)).toBe(false);
  });

  it('returns true when endDate is equal to startDate', () => {
    const startDate = new Date().getTime();
    const endDate = new Date(startDate).getTime();
    expect(validateEndDate(endDate, startDate)).toBe(true);
  });
});
