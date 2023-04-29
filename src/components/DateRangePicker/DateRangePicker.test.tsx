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
    it('should whens the start date to today`s date', async () => {
      const startDate = driver.userMetadataDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);
    });

    it('should whens the end date to 14 days from today', async () => {
      const endDate = driver.userMetadataDriver.get.endDateValue();
      expect(endDate).toEqual(defaultEndDate);
    });
  });

  describe('Invalid Date Selection', () => {
    // TODO: implement status validation

    it('should not allow choosing a date in the past for start date', async () => {
      const startDate = driver.userMetadataDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);

      // Try to select a disabled date
      driver.userMetadataDriver.when.chooseStartDate(yesterdayDate);

      // start date should not change
      const currentStartDate = driver.userMetadataDriver.get.startDateValue();
      expect(currentStartDate).toBe(todayDate);
    });

    it('should not allow choosing a date in the past for end date date', async () => {
      expect(driver.userMetadataDriver.get.endDateValue()).toEqual(defaultEndDate);

      // Try to select a disabled date
      driver.userMetadataDriver.when.chooseEndDate(yesterdayDate);

      // start date should not change
      expect(driver.userMetadataDriver.get.endDateValue()).toEqual(defaultEndDate);
    });

    // it('should show error when user choose start date that is after the end date', async () => {
    //   const startDate = driver.userMetadataDriver.get.startDateValue();
    //   expect(startDate).toEqual(todayDate);
    //
    //   const dateAfterEndDate = format(addDays(new Date(), 20), IsraelDateFormat);
    //   // Try to select a disabled date
    //   driver.userMetadataDriver.when.chooseStartDate(dateAfterEndDate);
    //
    //   // start date should not change
    //   const currentStartDate = driver.userMetadataDriver.get.startDateValue();
    //   expect(currentStartDate).toBe(todayDate);
    // });
    //
    // it('should show error when user choose a end date that is before the end date', async () => {
    //   expect(driver.userMetadataDriver.get.endDateValue()).toEqual(defaultEndDate);
    //   expect(driver.userMetadataDriver.get.startDateValue()).toEqual(todayDate);
    //   const status1 = driver.userMetadataDriver.get.endDateStatus();
    //   console.log(status1);
    //
    //   // select valid start date
    //   driver.userMetadataDriver.when.chooseStartDate(tomorrowDate);
    //   expect(driver.userMetadataDriver.get.startDateValue()).toEqual(tomorrowDate);
    //
    //   // select invalid end date
    //   driver.userMetadataDriver.when.chooseEndDate(todayDate);
    //   expect(driver.userMetadataDriver.get.endDateValue()).toBe(todayDate);
    //
    //   // TODO: implement status validation
    //   const status = driver.userMetadataDriver.get.endDateStatus();
    //   console.log(status);
    // });
  });

  describe('Date Selection', () => {
    it('should select the start date to be tomorrow', async () => {
      const startDate = driver.userMetadataDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);

      driver.userMetadataDriver.when.chooseStartDate(tomorrowDate);
      const updatedStartDate = driver.userMetadataDriver.get.startDateValue();
      expect(updatedStartDate).toBe(tomorrowDate);
    });

    it('should select end date that is exactly 7 days from today', async () => {
      const endDate = driver.userMetadataDriver.get.endDateValue();
      expect(endDate).toEqual(defaultEndDate);

      const newEndDate = format(addDays(new Date(), 7), IsraelDateFormat);
      driver.userMetadataDriver.when.chooseEndDate(newEndDate);

      const updatedEndDate = driver.userMetadataDriver.get.endDateValue();
      expect(updatedEndDate).toBe(newEndDate);
    });

    it('should allow to select same end and start date', async () => {
      const endDate = driver.userMetadataDriver.get.endDateValue();
      const startDate = driver.userMetadataDriver.get.startDateValue();
      expect(startDate).toEqual(todayDate);
      expect(endDate).toEqual(defaultEndDate);

      const newDate = format(addDays(new Date(), 7), IsraelDateFormat);
      driver.userMetadataDriver.when.chooseStartDate(newDate);
      driver.userMetadataDriver.when.chooseEndDate(newDate);

      const updatedStartDate = driver.userMetadataDriver.get.startDateValue();
      const updatedEndDate = driver.userMetadataDriver.get.endDateValue();

      expect(updatedEndDate).toBe(newDate);
      expect(updatedStartDate).toBe(newDate);
    });
  });
});
