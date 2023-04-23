import React from 'react';
import { IsraelDateFormat } from '@src/lib/utils';
import { PageBaseDriver } from '@test/RTL/RTLPageBaseDriver';
import subDays from 'date-fns/subDays';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';

describe('Date Range Picker', () => {
  const driver = new PageBaseDriver();
  const yesterdayDate = format(subDays(new Date(), 1), IsraelDateFormat);
  const todayDate = format(new Date(), IsraelDateFormat);
  const tomorrowDate = format(addDays(new Date(), 1), IsraelDateFormat);
  const defaultEndDate = format(addDays(new Date(), 14), IsraelDateFormat);

  beforeEach(() => driver.mount());

  describe('default start and end dates values', () => {
    it('should sets the start date to today`s date', async () => {
      const startDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);
    });

    it('should sets the end date to 14 days from today', async () => {
      const endDate = driver.dateRangePickerDriver.get.endDateValue();
      expect(endDate).toEqual(defaultEndDate);
    });
  });

  describe('Date Selection', () => {
    it('should select the start date to be tomorrow', async () => {
      const startDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);

      driver.dateRangePickerDriver.set.startDate(tomorrowDate);
      const updatedStartDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(updatedStartDate).toBe(tomorrowDate);
    });

    it('should select end date that is exactly 7 days from today', async () => {
      const endDate = driver.dateRangePickerDriver.get.endDateValue();
      expect(endDate).toEqual(defaultEndDate);

      const newEndDate = format(addDays(new Date(), 7), IsraelDateFormat);
      driver.dateRangePickerDriver.set.endDate(newEndDate);

      const updatedEndDate = driver.dateRangePickerDriver.get.endDateValue();
      expect(updatedEndDate).toBe(newEndDate);
    });
  });

  describe('Invalid Date Selection', () => {
    it('should not allow choosing a date in the past for start date', async () => {
      const startDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);

      // Try to select a disabled date
      driver.dateRangePickerDriver.set.startDate(yesterdayDate);

      // start date should not change
      const currentStartDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(currentStartDate).toBe(todayDate);
    });

    it('should not allow choosing a start date that is after the end date', async () => {
      const startDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);

      const dateAfterEndDate = format(addDays(new Date(), 16), IsraelDateFormat);
      // Try to select a disabled date
      driver.dateRangePickerDriver.set.startDate(dateAfterEndDate);

      // start date should not change
      const currentStartDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(currentStartDate).toBe(todayDate);
    });

    it('should not allow choosing a end date that is in the past', async () => {
      expect(driver.dateRangePickerDriver.get.endDateValue()).toEqual(defaultEndDate);

      // Try to select a disabled date
      driver.dateRangePickerDriver.set.endDate(yesterdayDate);

      // end date should not change
      expect(driver.dateRangePickerDriver.get.endDateValue()).toBe(defaultEndDate);
    });
  });
});
