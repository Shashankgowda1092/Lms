import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import BatchDetailsTable from "../Components/BatchDetailsTable";
import { MemoryRouter } from "react-router-dom";

// Mocking the useNavigate hook
jest.mock("../Context/BatchContext", () => ({
  useBatch: jest.fn(() => ({ setId: jest.fn() })),
}));

describe("BatchDetailsTable component", () => {
  const batchData = [
    {
      batchName: "Batch 1",
      online: true,
      startDate: "01/01/2022",
      batchId: "1",
    },
    {
      batchName: "Batch 2",
      online: false,
      startDate: "02/02/2022",
      batchId: "2",
    },
  ];

  const progressData = [
    { batchId: "1", batchProgress: 50 },
    { batchId: "2", batchProgress: 75 },
  ];

  test("renders table with batch details", () => {
    render(
      <MemoryRouter>
        <BatchDetailsTable
          status="All"
          batchData={batchData}
          progressData={progressData}
          searchQuery=""
        />
      </MemoryRouter>
    );

    // Check if the table headings are rendered
    expect(screen.getByText("Batch Name")).toBeInTheDocument();
    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Batch Created Date")).toBeInTheDocument();
    expect(screen.getByText("View Batch")).toBeInTheDocument();

    // Check if the batch details are rendered
    expect(screen.getByText("Batch 1")).toBeInTheDocument();
    expect(screen.getByText("Batch 2")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Non-Active")).toBeInTheDocument();
    expect(screen.getByText("01/01/2022")).toBeInTheDocument();
    expect(screen.getByText("02/02/2022")).toBeInTheDocument();

    // Check if the page information is rendered
    expect(screen.getByText("Page 1 of 10")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
