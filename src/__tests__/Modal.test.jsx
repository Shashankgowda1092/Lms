// Modal.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Modal from '../Components/Modal'; // Assuming your Modal component is in './Modal'
import '@testing-library/jest-dom'
describe('Modal component', () => {
    it('should render the modal title and message correctly', () => {
      const mockData = { title: 'My Modal Title', message: 'This is the modal content.', actionText: 'Perform Action' };
      const { getByText } = render(<Modal open={true} data={mockData} handleOpen={jest.fn()} handleClose={jest.fn()} />);
  
      expect(getByText(mockData.title)).toBeInTheDocument();
      expect(getByText(mockData.message)).toBeInTheDocument();
    });
  
  it('should call handleClose on clicking the cancel button', () => {
    const mockData = { title: 'My Modal Title', message: 'This is the modal content.', actionText: 'Perform Action' };
    const handleCloseMock = jest.fn();
    const { getByText } = render(<Modal open={true} data={mockData} handleOpen={jest.fn()} handleClose={handleCloseMock} />);

    const cancelButton = getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(handleCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call handleOpen on clicking the action button with delete set to true', () => {
    const mockData = { title: 'My Modal Title', message: 'This is the modal content.', actionText: 'Perform Action', delete: true };
    const handleOpenMock = jest.fn();
    const { getByText } = render(<Modal open={true} data={mockData} handleOpen={handleOpenMock} handleClose={jest.fn()} />);

    const actionButton = getByText(mockData.actionText);
    fireEvent.click(actionButton);

    expect(handleOpenMock).toHaveBeenCalledTimes(1);
  });

  it('should call handleOpen on clicking the action button with delete set to false', () => {
    const mockData = { title: 'My Modal Title', message: 'This is the modal content.', actionText: 'Perform Action', delete: false };
    const handleOpenMock = jest.fn();
    const { getByText } = render(<Modal open={true} data={mockData} handleOpen={handleOpenMock} handleClose={jest.fn()} />);

    const actionButton = getByText(mockData.actionText);
    fireEvent.click(actionButton);

    expect(handleOpenMock).toHaveBeenCalledTimes(1);
  });
});
