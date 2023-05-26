import React from 'react';
import { PageBaseDriver } from '@test/RTL/RTLPageBaseDriver';
import { IsraelDateFormat } from '@src/lib/utils';
import format from 'date-fns/format';
import addDays from 'date-fns/addDays';
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { SearchStatusType } from '@src/lib/internal-types';
import browser from '@src/__mocks__/webextension-polyfill';

const todayDate = format(new Date(), IsraelDateFormat);
const tomorrowDate = format(addDays(new Date(), 1), IsraelDateFormat);

describe('Gamkenbot App', () => {
  const driver = new PageBaseDriver();

  beforeEach(() => driver.mount());

  afterEach(() => jest.clearAllMocks());

  it('renders without crashing', async () => {
    expect(driver.get.disconnectedStatus()).toBeInTheDocument();
  });

  it('should enable start button when user fill all required fields and check consent', async () => {
    driver.userMetadataDriver.when.fillUserId('123456782');
    expect(driver.get.startButton()).toBeDisabled();

    driver.userMetadataDriver.when.fillPhoneNumber('0507277474');
    expect(driver.get.startButton()).toBeDisabled();

    driver.userMetadataDriver.when.selectCities(['תל אביב', 'גבעתיים']);
    expect(driver.get.startButton()).toBeDisabled();

    driver.when.clickConsent();
    expect(driver.get.startButton()).toBeEnabled();
  });

  describe('Handle invalid metadata', () => {
    beforeEach(() => {
      driver.given.userMetadata({
        userId: '123456782',
        phoneNumber: '0507277474',
        cities: ['תל אביב', 'גבעתיים'],
        startDate: todayDate,
        endDate: tomorrowDate,
      });
      driver.when.clickConsent();
    });
    it('should disabled start button when user fill invalid phone number', () => {
      expect(driver.get.startButton()).toBeEnabled();

      // Invalid phone number
      driver.userMetadataDriver.when.fillPhoneNumber('123abs');
      expect(driver.userMetadataDriver.get.phoneNumber()).toEqual('123abs');

      expect(driver.get.startButton()).toBeDisabled();
    });

    it('should disabled start button when user fill invalid ID', () => {
      expect(driver.get.startButton()).toBeEnabled();

      // Invalid ID
      driver.userMetadataDriver.when.fillUserId('050741');
      expect(driver.userMetadataDriver.get.userId()).toEqual('050741');

      expect(driver.get.startButton()).toBeDisabled();
    });

    it('should disabled start button when user choose more than max cities ', () => {
      expect(driver.get.startButton()).toBeEnabled();

      // Invalid cities -  add 3 more (5 in total)
      driver.userMetadataDriver.when.selectCities(['חדרה', 'נתניה', 'כפר סבא']);

      expect(driver.get.startButton()).toBeDisabled();
    });

    it('should disabled start button when user choose invalid dates', () => {
      expect(driver.get.startButton()).toBeEnabled();

      // Invalid dates number
      driver.userMetadataDriver.when.chooseStartDate(tomorrowDate);
      driver.userMetadataDriver.when.chooseEndDate(todayDate);

      expect(driver.userMetadataDriver.get.startDate()).toEqual(tomorrowDate);
      expect(driver.userMetadataDriver.get.endDate()).toEqual(todayDate);

      expect(driver.get.startButton()).toBeDisabled();
    });

    it('should disabled start button when user unchecked consent', () => {
      expect(driver.get.startButton()).toBeEnabled();

      // unchecked consent
      driver.when.clickConsent();

      expect(driver.get.startButton()).toBeDisabled();
    });
  });

  describe('Change icon based on status', () => {
    beforeAll(() => {
      // we're only mocking the useState hook for the test not to fail due to state changes in the component,
      // so the implementation is not important
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      jest.spyOn(React, 'useState').mockImplementation((initialValue: unknown) => [initialValue, (x: unknown) => x]);
    });

    it('should show error icon when status is error', async () => {
      await browser.runtime.sendMessage({
        action: ActionTypes.SetSearchStatus,
        status: { type: SearchStatusType.Error },
      } as PlatformMessage);

      expect(browser.action.setIcon).toHaveBeenCalledTimes(1);
      expect(browser.action.setIcon).toHaveBeenCalledWith({
        path: expect.stringContaining('error'),
      });
    });

    it('should show searching icon when a search operation is initiated', async () => {
      await browser.runtime.sendMessage({
        action: ActionTypes.SetSearchStatus,
        status: { type: SearchStatusType.Started },
      } as PlatformMessage);

      expect(browser.action.setIcon).toHaveBeenCalledTimes(1);
      expect(browser.action.setIcon).toHaveBeenCalledWith({
        path: expect.stringContaining('searching'),
      });
    });

    it('should show the default icon when stopping to search', async () => {
      await browser.runtime.sendMessage({
        action: ActionTypes.SetSearchStatus,
        status: { type: SearchStatusType.Stopped },
      } as PlatformMessage);

      expect(browser.action.setIcon).toHaveBeenCalledTimes(1);
      expect(browser.action.setIcon).toHaveBeenCalledWith({
        path: expect.stringContaining('gamkenbot.png'),
      });
    });
  });
});
