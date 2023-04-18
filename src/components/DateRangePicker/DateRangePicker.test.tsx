import { fireEvent, render, waitFor } from '@testing-library/react';
import { App } from '@src/components/App';
import Content from '@src/content.json';
import moment from 'moment/moment';
import { IsraelDateDigitsFormat } from '@src/lib/utils';
import React from 'react';

describe('Date Range Picker', () => {
  describe('default first and last dates values', () => {
    it('should sets the first date to today`s date', async () => {
      const { getByText, getByTestId } = render(<App />);
      await waitFor(() => getByText(Content.title));
      const todayDate = moment().format(IsraelDateDigitsFormat);

      const test = getByTestId('first-date').getAttribute('value');
      expect(test).toEqual(todayDate);
    });

    it('should sets the last date to 14 days from today', async () => {
      const { getByText, getByTestId } = render(<App />);
      await waitFor(() => getByText(Content.title));
      const lastDate = moment().add(14, 'days').format(IsraelDateDigitsFormat);

      const test = getByTestId('last-date').getAttribute('value');
      expect(test).toEqual(lastDate);
    });
  });

  describe('Date Selection', () => {
    it('should select the first date to be tomorrow', async () => {
      const { getByText, getByTestId } = render(<App />);
      await waitFor(() => getByText(Content.title));

      const input = getByTestId('first-date');
      const tomorrowDate = moment().add(1, 'days').format(IsraelDateDigitsFormat);

      fireEvent.click(input);
      fireEvent.change(input, { target: { value: tomorrowDate } });
      const calenderDate = document.querySelector('.ant-picker-cell-selected');
      expect(calenderDate).not.toBe(null);
      if (calenderDate) {
        fireEvent.click(calenderDate);
      }

      expect(input.getAttribute('value')).toBe(tomorrowDate);
    });

    it('should select last date that is exactly 7 days from today', async () => {
      const { getByText, getByTestId } = render(<App />);
      await waitFor(() => getByText(Content.title));

      const input = getByTestId('last-date');
      const tomorrowDate = moment().add(7, 'days').format(IsraelDateDigitsFormat);

      fireEvent.mouseDown(input);
      fireEvent.change(input, { target: { value: tomorrowDate } });

      const calenderDate = document.querySelector('.ant-picker-cell-selected');
      expect(calenderDate).not.toBe(null);
      if (calenderDate) {
        fireEvent.click(calenderDate);
      }

      expect(input.getAttribute('value')).toBe(tomorrowDate);
    });
  });

  describe('Invalid Date Selection', () => {
    it('should not allow choosing a date in the past for first date', async () => {
      const { getByText, getByTestId } = render(<App />);
      await waitFor(() => getByText(Content.title));

      const input = getByTestId('first-date');
      const todayDate = moment().format(IsraelDateDigitsFormat);
      const yesterdayDate = moment().subtract(1, 'days').format(IsraelDateDigitsFormat);

      expect(input.getAttribute('value')).toBe(todayDate);

      fireEvent.mouseDown(input);
      fireEvent.change(input, { target: { value: yesterdayDate } });

      const calenderDate = document.querySelector('.ant-picker-cell-selected');
      expect(calenderDate).not.toBe(null);
      if (calenderDate) {
        fireEvent.click(calenderDate);
      }

      expect(input.getAttribute('value')).toBe(todayDate);
    });

    it('should not allow choosing a first date that is after the last date', async () => {
      const { getByText, getByTestId } = render(<App />);
      await waitFor(() => getByText(Content.title));

      const input = getByTestId('first-date');
      const lastDateInput = getByTestId('last-date').getAttribute('value');

      const todayDate = moment().format(IsraelDateDigitsFormat);
      expect(input.getAttribute('value')).toBe(todayDate);

      const dateAfterLastDate = moment(lastDateInput).add(5, 'days').format(IsraelDateDigitsFormat);

      fireEvent.mouseDown(input);
      fireEvent.change(input, { target: { value: dateAfterLastDate } });

      const calenderDate = document.querySelector('.ant-picker-cell-selected');
      expect(calenderDate).not.toBe(null);
      if (calenderDate) {
        fireEvent.click(calenderDate);
      }

      expect(input.getAttribute('value')).toBe(todayDate);
    });

    it('should not allow choosing a last date that is in the past', async () => {
      const { getByText, getByTestId } = render(<App />);
      await waitFor(() => getByText(Content.title));

      const input = getByTestId('last-date');
      const lastDate = moment().add(14, 'days').format(IsraelDateDigitsFormat);
      const yesterdayDate = moment().subtract(1, 'days').format(IsraelDateDigitsFormat);

      expect(input.getAttribute('value')).toBe(lastDate);

      fireEvent.mouseDown(input);
      fireEvent.change(input, { target: { value: yesterdayDate } });

      const calenderDate = document.querySelector('.ant-picker-cell-selected');
      expect(calenderDate).not.toBe(null);
      if (calenderDate) {
        fireEvent.click(calenderDate);
      }

      expect(input.getAttribute('value')).toBe(lastDate);
    });
    //
    // it('should not be able to select last date which is older then first date', async () => {
    //   const { getByText, getByTestId } = render(<App />);
    //   await waitFor(() => getByText(Content.title));
    //
    //   const firstinput = getByTestId('first-date');
    //   const newStartDate = moment().add(3, 'days').format(IsraelDateDigitsFormat);
    //
    //   fireEvent.click(firstinput);
    //   fireEvent.change(firstinput, { target: { value: newStartDate } });
    //   const calenderDateS = document.querySelector('.ant-picker-cell-selected');
    //   expect(calenderDateS).not.toBe(null);
    //   if (calenderDateS) {
    //     fireEvent.click(calenderDateS);
    //   }
    //   fireEvent.click(firstinput);
    //
    //   expect(firstinput.getAttribute('value')).toBe(newStartDate);
    //
    //   const input = getByTestId('last-date');
    //   const newLastDateWhichIsOlderThenFirstDate = moment().add(1, 'days').format(IsraelDateDigitsFormat);
    //   const lastDate = moment().add(14, 'days').format(IsraelDateDigitsFormat);
    //
    //   expect(input.getAttribute('value')).toBe(lastDate);
    //
    //   fireEvent.mouseDown(input);
    //   fireEvent.change(input, { target: { value: newLastDateWhichIsOlderThenFirstDate } });
    //
    //   const calenderDate = document.querySelector('.ant-picker-cell-selected');
    //   expect(calenderDate).not.toBe(null);
    //   if (calenderDate) {
    //     fireEvent.click(calenderDate);
    //   }
    //
    //   expect(input.getAttribute('value')).toBe(lastDate);
    // });
  });
});
