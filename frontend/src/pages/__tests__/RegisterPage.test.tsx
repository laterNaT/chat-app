import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BrowserRouter,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { routesConfig } from "../../config/routesConfig";
import RegisterPage from "../RegisterPage";

describe("RegisterPage", () => {
  it("Should display a message", () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    expect(
      screen.getByText(/Register an account by submitting the form below/i)
    ).toBeInTheDocument();
  });

  it("Should display a link to login page", () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    expect(screen.getByText(/here/i)).toHaveAttribute("href", "/login");
  });

  it("Should display a username field", () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it("Should display a password field", () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("Should display a register button", () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Should redirect to login page when register succeeds", async () => {
    vi.mock("../../context/AuthenticationContext.tsx", () => {
      return {
        useAuthentication: () => {
          return {
            handleRegister: async () => {
              return new Promise((resolve) =>
                setTimeout(() => {
                  resolve(true);
                }, 0)
              );
            },
          };
        },
      };
    });

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/register"],
    });
    render(<RouterProvider router={router} />);

    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "testpassword");
    await userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText(/please sign in to continue/i)
      ).toBeInTheDocument();
    });
  });
});
