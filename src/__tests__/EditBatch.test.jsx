import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditBatch from "../Pages/EditBatch";
import { getBatchDetails, updateBatch } from "../Services/BatchData";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("../Services/BatchData", () => ({
  getBatchDetails: jest.fn(),
  updateBatch: jest.fn(),
}));

describe("EditBatch component", () => {
  test("calls updateBatch function on form submission", async () => {
    const mockUpdateBatch = updateBatch.mockResolvedValue(true);
    const mockBatchDetails = {
      batchName: "Test Batch",
      batchDescription: "Test Description",
      startDate: "2024-04-20",
      endDate: "2024-04-30",
      batchSize: "10",
    };

    getBatchDetails.mockResolvedValue(mockBatchDetails);

    render(<EditBatch />);

    await waitFor(() => {
      expect(screen.getByLabelText("Batch Name:")).toHaveValue(
        mockBatchDetails.batchName
      );
      expect(screen.getByLabelText("Batch Description:")).toHaveValue(
        mockBatchDetails.batchDescription
      );
      expect(screen.getByLabelText("Start Date:")).toHaveValue(
        mockBatchDetails.startDate
      );
      expect(screen.getByLabelText("End Date:")).toHaveValue(
        mockBatchDetails.endDate
      );
      expect(screen.getByLabelText("Batch Size:")).toHaveValue(
        mockBatchDetails.batchSize
      );
    });

    const updatedBatchDetails = {
      batchName: "Updated Batch Name",
      batchDescription: "Updated Batch Description",
      startDate: "2024-04-21",
      endDate: "2024-05-01",
      batchSize: "15",
    };

    fireEvent.change(screen.getByLabelText("Batch Name:"), {
      target: { value: updatedBatchDetails.batchName },
    });
    fireEvent.change(screen.getByLabelText("Batch Description:"), {
      target: { value: updatedBatchDetails.batchDescription },
    });
    fireEvent.change(screen.getByLabelText("Start Date:"), {
      target: { value: updatedBatchDetails.startDate },
    });
    fireEvent.change(screen.getByLabelText("End Date:"), {
      target: { value: updatedBatchDetails.endDate },
    });
    fireEvent.change(screen.getByLabelText("Batch Size:"), {
      target: { value: updatedBatchDetails.batchSize },
    });

    fireEvent.submit(screen.getByRole("button", { name: "Update Batch" }));

    await waitFor(() => {
      expect(mockUpdateBatch).toHaveBeenCalledWith(
        sessionStorage.getItem("id"),
        updatedBatchDetails
      );
    });
  });
});
