import { RTLDateRangePickerDriver } from '@test/RTL/RTLDateRangePickerDriver';
import { render, waitFor, RenderResult } from '@testing-library/react';
import { App } from '@src/components/App';
import React from 'react';
import Content from '@src/content.json';

export class PageBaseDriver {
  public renderResult!: RenderResult;
  public dateRangePickerDriver!: RTLDateRangePickerDriver;

  async mount() {
    this.renderResult = render(<App />);
    await waitFor(() => this.get.title());
    this.dateRangePickerDriver = new RTLDateRangePickerDriver(this.renderResult);
  }

  get = {
    title: () => this.renderResult.getByText(Content.title),

    disconnectedStatus: () => this.renderResult.getByText(Content.statuses.disconnected),
  };
}
