
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Haven app title', () => {
  render(<App />);
  const title = screen.getByText(/Haven/i);
  expect(title).toBeInTheDocument();
});
