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

  describe('Default start and end dates values', () => {
    it('should whens the start date to today`s date', async () => {
      const startDate = driver.userMetadataDriver.get.startDate();
      expect(startDate).toEqual(todayDate);
    });

    it('should whens the end date to 14 days from today', async () => {
      const endDate = driver.userMetadataDriver.get.endDate();
      expect(endDate).toEqual(defaultEndDate);
    });
  });

  describe('Date Selection', () => {
    it('should select the start date to be tomorrow', async () => {
      const startDate = driver.userMetadataDriver.get.startDate();
      expect(startDate).toEqual(todayDate);

      driver.userMetadataDriver.when.chooseStartDate(tomorrowDate);
      const updatedStartDate = driver.userMetadataDriver.get.startDate();
      expect(updatedStartDate).toBe(tomorrowDate);
    });

    it('should select end date that is exactly 7 days from today', async () => {
      const endDate = driver.userMetadataDriver.get.endDate();
      expect(endDate).toEqual(defaultEndDate);

      const newEndDate = format(addDays(new Date(), 7), IsraelDateFormat);
      driver.userMetadataDriver.when.chooseEndDate(newEndDate);

      const updatedEndDate = driver.userMetadataDriver.get.endDate();
      expect(updatedEndDate).toBe(newEndDate);
    });

    it('should allow to select same end and start date', async () => {
      const endDate = driver.userMetadataDriver.get.endDate();
      const startDate = driver.userMetadataDriver.get.startDate();
      expect(startDate).toEqual(todayDate);
      expect(endDate).toEqual(defaultEndDate);

      const newDate = format(addDays(new Date(), 7), IsraelDateFormat);
      driver.userMetadataDriver.when.chooseStartDate(newDate);
      driver.userMetadataDriver.when.chooseEndDate(newDate);

      const updatedStartDate = driver.userMetadataDriver.get.startDate();
      const updatedEndDate = driver.userMetadataDriver.get.endDate();

      expect(updatedEndDate).toBe(newDate);
      expect(updatedStartDate).toBe(newDate);
    });
  });

  describe('Invalid Date Selection', () => {
    it('should not allow choosing a date in the past for start date', async () => {
      const startDate = driver.userMetadataDriver.get.startDate();
      expect(startDate).toEqual(todayDate);

      // Try to select a disabled date
      driver.userMetadataDriver.when.chooseStartDate(yesterdayDate);

      // start date should not change
      const currentStartDate = driver.userMetadataDriver.get.startDate();
      expect(currentStartDate).toBe(todayDate);
    });

    it('should not allow choosing a date in the past for end date date', async () => {
      expect(driver.userMetadataDriver.get.endDate()).toEqual(defaultEndDate);

      // Try to select a disabled date
      driver.userMetadataDriver.when.chooseEndDate(yesterdayDate);

      // start date should not change
      expect(driver.userMetadataDriver.get.endDate()).toEqual(defaultEndDate);
    });
  });
});
