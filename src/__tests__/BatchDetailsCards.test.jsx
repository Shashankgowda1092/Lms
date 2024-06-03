import React from "react";
import { render, screen } from "@testing-library/react";
import BatchDetailsCards from "../Components/BatchDetailsCards";
import "@testing-library/jest-dom"; // Make sure to include this line

// Mocking react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mocking the useBatch hook
jest.mock("../Context/BatchContext", () => ({
  useBatch: jest.fn(() => ({ setId: jest.fn() })),
}));

describe("BatchDetailsCards component", () => {
  const batchData = [
    {
      batchId: 1,
      batchName: "Batch 1",
      batchDescription: "Description 1",
      online: true,
      startDate: "01/01/2022",
    },
    {
      batchId: 2,
      batchName: "Batch 2",
      batchDescription: "Description 2",
      online: false,
      startDate: "02/02/2022",
    },
  ];

  const progressData = [
    { batchId: 1, batchProgress: 50 },
    { batchId: 2, batchProgress: 75 },
  ];

  beforeEach(() => {
    // Reset the mock implementation before each test
    jest.clearAllMocks();
  });

  test("renders BatchDetailsCards component with correct details", () => {
    // Mock the navigate function
    const mockNavigate = jest.fn();
    jest
      .spyOn(require("react-router-dom"), "useNavigate")
      .mockReturnValue(mockNavigate);

    render(
      <BatchDetailsCards
        status="All"
        searchQuery=""
        batchData={batchData}
        progressData={progressData}
        change={false}
      />
    );

    // Check if the course cards are rendered correctly
    expect(screen.getByText("Batch 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("01/01/2022")).toBeInTheDocument();
    expect(screen.getByText("Batch 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
    expect(screen.getByText("02/02/2022")).toBeInTheDocument();

    // Check if the progress values are rendered correctly
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();

    // Add more assertions as needed
  });
});
