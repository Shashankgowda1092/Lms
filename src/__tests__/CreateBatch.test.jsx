import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateBatch from "../Pages/CreateBatch";
import { createBatch } from "../Services/BatchData";

// Mock the useHistory hook
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../Services/BatchData", () => ({
  createBatch: jest.fn(),
}));

describe("CreateBatch component", () => {
  test("calls createBatch function on form submission", async () => {
    const mockCreateBatch = createBatch.mockResolvedValue(true);
    render(<CreateBatch />);

    fireEvent.change(screen.getByLabelText("Batch Name:"), {
      target: { value: "Test Batch" },
    });
    fireEvent.change(screen.getByLabelText("Batch Description:"), {
      target: { value: "Test Description" },
    });
    fireEvent.change(screen.getByLabelText("Start Date:"), {
      target: { value: "2024-04-20" },
    });
    fireEvent.change(screen.getByLabelText("End Date:"), {
      target: { value: "2024-04-30" },
    });
    fireEvent.change(screen.getByLabelText("Batch Size:"), {
      target: { value: "10" },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Create Batch" }));

    await waitFor(() => {
      expect(mockCreateBatch).toHaveBeenCalledWith({
        batchName: "Test Batch",
        batchDescription: "Test Description",
        startDate: "2024-04-20",
        endDate: "2024-04-30",
        batchSize: "10",
      });
    });
  });
});
