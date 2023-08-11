import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  BrowserRouter,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { routesConfig } from "../../config/routesConfig";
import LoginPage from "../LoginPage";

describe("LoginPage", () => {
  it("Should display a message", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    expect(screen.getByText(/please sign in to continue/i)).toBeInTheDocument();
  });

  it("Should display a link to register page", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    expect(screen.getByText(/here/i)).toHaveAttribute("href", "/register");
  });

  it("Should display a username field", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  });

  it("Should display a password field", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("Should display a login button", () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Should redirect to home page when login succeeds", async () => {
    vi.mock("../../context/AuthenticationContext.tsx", () => {
      let session: null | true = null;
      return {
        useAuthentication: () => {
          return {
            session: session,
            handleLogin: async () => {
              return new Promise((resolve) =>
                setTimeout(() => {
                  session = true;
                  resolve(true);
                }, 0)
              );
            },
          };
        },
      };
    });

    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/login"],
    });

    render(<RouterProvider router={router} />);

    const user = userEvent.setup();
    const username = screen.getByLabelText(/username/i);
    const password = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole("button");

    await user.type(username, "test");
    await user.type(password, "test");
    await user.click(loginButton);

    await waitFor(() => {
      expect(
        screen.getByText(/use the sidebar to the left/i)
      ).toBeInTheDocument();
    });
  });
});
