import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import BreadCrumbs from '../Components/BreadCrumbs';
import '@testing-library/jest-dom'; // Add this line

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('BreadCrumbs component', () => {
  it('should render bread crumbs with correct links and text', () => {
    // Mock location object
    const mockLocation = {
      pathname: '/path/to/page',
    };
    useLocation.mockReturnValue(mockLocation);

    const { getByTestId } = render(
      <Router>
        <BreadCrumbs />
      </Router>
    );

    // Check if the current page link is rendered
    const currentPageLink = getByTestId('current-page-link');
    expect(currentPageLink).toBeInTheDocument();
    expect(currentPageLink).toHaveTextContent(/Page/i);
});
});
