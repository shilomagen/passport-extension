import React from 'react';
import { render, waitFor } from '@testing-library/react';
import Content from '@src/content.json';
import { App } from './App';

describe('App', () => {
  it('renders without crashing', async () => {
    const { getByText } = render(<App />);
    await waitFor(() => getByText(Content.title));
    expect(getByText(Content.statuses.disconnected)).toBeInTheDocument();
  });
});
