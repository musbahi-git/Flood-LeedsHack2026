import React from 'react';

import { render, waitFor } from '@testing-library/react';
import { useIncidents } from '../hooks/useIncidents';

jest.mock('../api/incidentsApi', () => ({
  getIncidents: jest.fn(() => Promise.resolve([{ _id: '1', type: 'incident', description: 'Test incident' }]))
}));

function TestComponent() {
  const { incidents } = useIncidents({}, false);
  return <div>{incidents.length > 0 ? incidents[0].description : 'No incidents'}</div>;
}

test('useIncidents fetches incidents', async () => {
  const { getByText } = render(<TestComponent />);
  await waitFor(() => {
    expect(getByText('Test incident')).toBeInTheDocument();
  });
});
