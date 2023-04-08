import './background-page';
import browser from 'webextension-polyfill';
import { ActionTypes } from '@src/action-types';
import { AnalyticsEvent, AnalyticsEventType } from '@src/services/analytics';
import { TestsDriver } from '../../test/driver';

const driver = new TestsDriver();

describe('[Background Page]', () => {
  const userId = '40d37f97-f995-470d-a11e-59405abd2fcd';
  beforeEach(driver.reset);

  it('should report analytics with unique user id on report message', async () => {
    await driver.given.userId(userId);
    await browser.runtime.sendMessage({
      action: ActionTypes.ReportAnalytics,
      payload: { type: AnalyticsEventType.StartSearch } as AnalyticsEvent,
    });
    expect(driver.get.analyticsUserId()).toEqual(userId);
    expect(driver.get.reports()).toContainEqual({
      name: AnalyticsEventType.StartSearch,
      data: {},
    });
  });
});
