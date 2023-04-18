import React from 'react';
import moment from 'moment/moment';
import { IsraelDateDigitsFormat } from '@src/lib/utils';
import { PageBaseDriver } from '@test/RTL/RTLPageBaseDriver';

describe('Date Range Picker', () => {
  const driver = new PageBaseDriver();
  const yesterdayDate = moment().subtract(1, 'days').format(IsraelDateDigitsFormat);
  const todayDate = moment().format(IsraelDateDigitsFormat);
  const tomorrowDate = moment().add(1, 'days').format(IsraelDateDigitsFormat);
  const defaultEndDate = moment().add(14, 'days').format(IsraelDateDigitsFormat);

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

      const newEndDate = moment().add(7, 'days').format(IsraelDateDigitsFormat);
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

      const dateAfterEndDate = moment(defaultEndDate, IsraelDateDigitsFormat)
        .add(5, 'days')
        .format(IsraelDateDigitsFormat);

      // Try to select a disabled date
      driver.dateRangePickerDriver.set.startDate(dateAfterEndDate);

      // start date should not change
      const currentStartDate = driver.dateRangePickerDriver.get.startDateValue();
      expect(currentStartDate).toBe(todayDate);
    });

    it('should not allow choosing a end date that is in the past', async () => {
      const endDate = driver.dateRangePickerDriver.get.endDateValue();
      expect(endDate).toEqual(defaultEndDate);

      // Try to select a disabled date
      driver.dateRangePickerDriver.set.endDate(yesterdayDate);

      // end date should not change
      const currentEndDate = driver.dateRangePickerDriver.get.endDateValue();
      expect(currentEndDate).toBe(defaultEndDate);
    });
    //
    // it('should not be able to select end date which is older then start date', async () => {
    //   const { getByText, getByTestId } = render(<App />);
    //   await waitFor(() => getByText(Content.title));
    //
    //   const startinput = getByTestId('start-date');
    //   const newStartDate = moment().add(3, 'days').format(IsraelDateDigitsFormat);
    //
    //   fireEvent.click(startinput);
    //   fireEvent.change(startinput, { target: { value: newStartDate } });
    //   const calenderDateS = document.querySelector('.ant-picker-cell-selected');
    //   expect(calenderDateS).not.toBe(null);
    //   if (calenderDateS) {
    //     fireEvent.click(calenderDateS);
    //   }
    //   fireEvent.click(startinput);
    //
    //   expect(startinput.getAttribute('value')).toBe(newStartDate);
    //
    //   const input = getByTestId('end-date');
    //   const newendDateWhichIsOlderThenstartDate = moment().add(1, 'days').format(IsraelDateDigitsFormat);
    //   const endDate = moment().add(14, 'days').format(IsraelDateDigitsFormat);
    //
    //   expect(input.getAttribute('value')).toBe(endDate);
    //
    //   fireEvent.mouseDown(input);
    //   fireEvent.change(input, { target: { value: newendDateWhichIsOlderThenstartDate } });
    //
    //   const calenderDate = document.querySelector('.ant-picker-cell-selected');
    //   expect(calenderDate).not.toBe(null);
    //   if (calenderDate) {
    //     fireEvent.click(calenderDate);
    //   }
    //
    //   expect(input.getAttribute('value')).toBe(endDate);
    // });
  });
});
