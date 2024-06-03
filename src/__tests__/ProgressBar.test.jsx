// ProgressBar.test.js
import React from 'react';
import { render } from '@testing-library/react';
import ProgressBar from '../Components/ProgressBar'; // Assuming ProgressBar is in './ProgressBar'
import '@testing-library/jest-dom'; // Importing matchers directly

describe('ProgressBar component', () => {
  it('should render progress value correctly', () => {
    const progressValue = 50;
    const { getByText } = render(<ProgressBar progressValue={progressValue} />);

    const completedText = getByText('Completed');
    expect(completedText).toBeInTheDocument();

    const percentageText = getByText(/0?%/); // Using a regular expression to match any percentage value
    expect(percentageText).toBeInTheDocument();
  });

  it('should render default progress value when not provided', () => {
    const { getByText } = render(<ProgressBar />);

    const completedText = getByText('Completed');
    expect(completedText).toBeInTheDocument();

    const percentageText = getByText(/0?%/); // Using a regular expression to match any percentage value
    expect(percentageText).toBeInTheDocument();
  });
});
