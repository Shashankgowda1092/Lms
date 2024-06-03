import { render, screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import LandingPage from "./LandingPage";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { userEvent } from "@testing-library/user-event";

import ForgotPassword from "./ForgotPassword";
import MailVerificationForgotPassword from "./MailVerificationForgotPassword";

// import matchers from '@testing-library/jest-dom'
// expect.extend(matchers)

it("should have a welcome text", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <LandingPage />
    </MemoryRouter>
  );
  const message = screen.queryByText(/Welcome/i);
  expect(message).toBeVisible();
});

describe("LandingPage", () => {
  test("should have login and signup buttons", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <LandingPage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    const signupButton = screen.getByRole("button", { name: /sign up/i });

    expect(loginButton).toBeInTheDocument();
    expect(signupButton).toBeInTheDocument();
  });
});

// describe("routing test", () => {
//   test("check redirect to register",async ()=>{
//     render(
//       <MemoryRouter initialEntries={["/"]}>
//         <LandingPage />
//       </MemoryRouter>
//   );
//   const signupButton = await screen.findByRole('button', { name: /Sign Up/i }); // Wait for button to be visible

//   await userEvent.click(signupButton);

//   // Improved assertion: Check for substring in pathname
//   expect(window.location.pathname).toBe('/register');
//   })

// });

// it("navigates to Signup", () => {
//   // in a real test a renderer like "@testing-library/react"
//   // would take care of setting up the DOM elements
//   const root = document.createElement("div");
//   document.body.appendChild(root);

//   // Render app
//   render(
//     <MemoryRouter initialEntries={["/"]}>
//       <LandingPage />
//     </MemoryRouter>
//   );

//   // Interact with page
//   act(() => {
//     // Find the link (perhaps using the text content)
//     const registerLink = document.querySelector("#register");
//     // const button = screen.getByText('Sign Up');
//     // Click it
//     registerLink.dispatchEvent(new MouseEvent("click", { bubbles: true }));
//     // userEvent.click(registerLink)
//     // const user = userEvent.setup();
//     // await user.click(registerLink)
//     // userEvent.click(registerLink)
//   });

//   // Check correct page content showed up
//   // expect(document.body.textContent).toBe('Signup');
//   // expect(document.body.textContent).toMatch(/Sign Up/i);
//   // expect(window.location.pathname).toMatch('/register');
//   expect(screen.getByText(/Sign up/)).toBeDefined();
// });
