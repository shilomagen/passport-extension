import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Content from '@src/content.json';
import { App, validateIsraeliIdNumber, validatePhoneNumber, validateNumberOfAllowedCities } from './App';

describe('App', () => {
  it('renders without crashing', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => getByText(Content.title));
    expect(getByText(Content.statuses.disconnected)).toBeInTheDocument();
  });
});

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
  it('should return true for null input', () => {
    expect(validateNumberOfAllowedCities(null)).toBe(true);
  });

  it('should return true for undefined input', () => {
    expect(validateNumberOfAllowedCities(undefined)).toBe(true);
  });

  it('should return true for empty array input', () => {
    expect(validateNumberOfAllowedCities([])).toBe(true);
  });

  it('should return false for array input with 4 or fewer elements', () => {
    expect(validateNumberOfAllowedCities(['city1', 'city2', 'city3', 'city4'])).toBe(false);
  });

  it('should return true for array input with more than 4 elements', () => {
    expect(validateNumberOfAllowedCities(['city1', 'city2', 'city3', 'city4', 'city5'])).toBe(true);
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
