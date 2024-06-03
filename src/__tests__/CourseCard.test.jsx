import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CourseCard } from "../Components/CourseCard";
import { MemoryRouter } from "react-router-dom";

// Mocking the useNavigate and useBatch hooks
jest.mock("../Context/BatchContext", () => ({
  useBatch: jest.fn(() => ({ setId: jest.fn() })),
}));

describe("CourseCard component", () => {
  const courseData = {
    online: true,
    progressValue: 50,
    name: "Course 1",
    description: "This is Course 1 description",
    date: "01/01/2022",
    batchId: 1,
    change: true,
  };

  test("renders course card with correct details", () => {
    render(
      <MemoryRouter>
        <CourseCard {...courseData} />
      </MemoryRouter>
    );

    // Check if the course details are rendered correctly
    expect(screen.getByText("Course 1")).toBeInTheDocument();
    expect(
      screen.getByText("This is Course 1 description")
    ).toBeInTheDocument();
    expect(screen.getByText("01/01/2022")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Batch Details")).toBeInTheDocument();
  });
});
