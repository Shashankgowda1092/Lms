import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Make sure to include this line
import EmployeeTable from "../Components/EmployeeTable";

describe("EmployeeTable component", () => {
  const TABLE_HEAD = [
    "ID",
    "First Name",
    "Last Name",
    "Email",
    "Business Unit",
  ];
  const rows = [
    {
      empId: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      businessUnit: "BU1",
    },
    {
      empId: 2,
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
      businessUnit: "BU2",
    },
  ];
  const selectedRows = {
    1: true,
    2: false,
  };
  const handleCheckboxChange = jest.fn();
  const setSelectedRows = jest.fn();

  test("renders employee table with correct details", () => {
    render(
      <EmployeeTable
        TABLE_HEAD={TABLE_HEAD}
        rows={rows}
        selectedRows={selectedRows}
        handleCheckboxChange={handleCheckboxChange}
        setSelectedRows={setSelectedRows}
      />
    );

    // Check if the table headers are rendered correctly
    TABLE_HEAD.forEach((header) => {
      expect(screen.getByText(header)).toBeInTheDocument();
    });

    // Check if the table rows are rendered correctly
    rows.forEach((row) => {
      expect(screen.getByText(row.empId.toString())).toBeInTheDocument();
      expect(screen.getByText(row.firstName)).toBeInTheDocument();

      // Use getAllByText for last name
      const lastNameElements = screen.getAllByText(row.lastName);
      expect(lastNameElements.length).toBeGreaterThan(0);

      expect(screen.getByText(row.email)).toBeInTheDocument();
      expect(screen.getByText(row.businessUnit)).toBeInTheDocument();
    });
  });
});
