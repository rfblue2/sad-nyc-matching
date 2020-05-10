import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders healthcheck', () => {
  const { getByText } = render(<App />);
  const element = getByText(/Healthcheck/i);
  expect(element).toBeInTheDocument();
});
