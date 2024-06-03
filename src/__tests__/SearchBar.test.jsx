// SearchBar.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SearchBar from '../Components/SearchBar'; // Assuming SearchBar is in './Components/SearchBar'
import '@testing-library/jest-dom'; // Importing matchers directly

describe('SearchBar component', () => {
  const TABLE_ROWS = [
    { userId: 1, userName: 'John Doe', businessUnit: 'Finance' },
    { userId: 2, userName: 'Jane Smith', businessUnit: 'Marketing' },
  ];

  it('should render input field and search icon', () => {
    const { getByLabelText, getByTestId } = render(
      <SearchBar TABLE_ROWS={TABLE_ROWS} setRows={() => {}} setSelectedRows={() => {}} clearSearch={false} />
    );

    const inputField = getByLabelText('Search');
    expect(inputField).toBeInTheDocument();

    // Find the search icon within the input field
    const searchIcon = inputField.parentElement.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('should update search query when input value changes', () => {
    const setRowsMock = jest.fn();
    const setSelectedRowsMock = jest.fn();

    const { getByLabelText } = render(
      <SearchBar TABLE_ROWS={TABLE_ROWS} setRows={setRowsMock} setSelectedRows={setSelectedRowsMock} clearSearch={false} />
    );

    const inputField = getByLabelText('Search');
    fireEvent.change(inputField, { target: { value: 'John' } });

    expect(inputField.value).toBe('John');
  });

  // Add more test cases to cover other functionalities of the SearchBar component
});
