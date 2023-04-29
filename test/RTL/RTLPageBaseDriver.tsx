import { render, waitFor, RenderResult, fireEvent } from '@testing-library/react';
import { App } from '@src/components/App';
import React from 'react';
import Content from '@src/content.json';
import { RTLUserMetadataDriver } from '@test/RTL/RTLUserMetadataDriver';
import { AppTestIds } from '@src/components/dataTestIds';
import browser from 'webextension-polyfill';

export class PageBaseDriver {
  public renderResult!: RenderResult;
  public userMetadataDriver!: RTLUserMetadataDriver;

  async mount() {
    await this.clearStorage();
    this.renderResult = render(<App />);
    await waitFor(() => this.get.title());
    this.userMetadataDriver = new RTLUserMetadataDriver(this.renderResult);
  }

  private async clearStorage() {
    return browser.storage.local.clear();
  }

  get = {
    title: () => this.renderResult.getByText(Content.title),

    disconnectedStatus: () => this.renderResult.getByText(Content.statuses.disconnected),

    startButton: () => this.renderResult.getByTestId(AppTestIds.START_SEARCH_BUTTON),

    checkedConsent: () => {
      return this.renderResult.getByTestId(AppTestIds.CONSENT_CHECKBOX);
    },
  };

  when = {
    checkedConsent: () => {
      const checkbox = this.renderResult.getByTestId(AppTestIds.CONSENT_CHECKBOX);
      fireEvent.click(checkbox);
    },

    fillAllFields: (props: {
      userId: string;
      phoneNumber: string;
      cities: string[];
      startDate: string;
      endDate: string;
    }) => {
      this.userMetadataDriver.when.fillUserId(props.userId);
      this.userMetadataDriver.when.fillPhoneNumber(props.phoneNumber);
      this.userMetadataDriver.when.selectCities(props.cities);
      this.userMetadataDriver.when.chooseStartDate(props.startDate);
      this.userMetadataDriver.when.chooseEndDate(props.endDate);
      this.when.checkedConsent();
    },
  };
}
