import React from 'react';
import { App } from './App';
import { PageBaseDriver } from '@test/RTL/RTLPageBaseDriver';

describe('App', () => {
  const driver = new PageBaseDriver();

  beforeEach(() => driver.mount());

  it('renders without crashing', async () => {
    expect(driver.get.disconnectedStatus()).toBeInTheDocument();
  });
});
