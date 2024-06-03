import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import BatchHeader from "../Components/BatchHeader";
import "@testing-library/jest-dom";

describe("BatchHeader component", () => {
  // Mock functions
  const toggleHandler = jest.fn();
  const onStatusChange = jest.fn();
  const searchHandler = jest.fn();
  const changeCardLayout = jest.fn();

  it("should render BatchHeader component with correct elements and attributes", () => {
    const { getByText, getByLabelText } = render(
      <Router>
        <BatchHeader
          card={true}
          toggleHandler={toggleHandler}
          onStatusChange={onStatusChange}
          searchHandler={searchHandler}
          changeCardLayout={changeCardLayout}
        />
      </Router>
    );

    // Check if the Batch list heading is rendered
    expect(getByText("Batch list")).toBeInTheDocument();

    // Check if the Create New Batch button is rendered
    const createNewBatchButton = getByText("Create New Batch");
    expect(createNewBatchButton).toBeInTheDocument();
    expect(createNewBatchButton).toHaveTextContent("Create New Batch");
    expect(createNewBatchButton.closest("a")).toHaveAttribute(
      "href",
      "/lms/batches/create-batch"
    );

    // Check if the Tabs are rendered
    expect(getByText("All")).toBeInTheDocument();
    expect(getByText("Active")).toBeInTheDocument();
    expect(getByText("In-Active")).toBeInTheDocument();
  });

  // Add more test cases to cover other functionalities of the BatchHeader component
});
