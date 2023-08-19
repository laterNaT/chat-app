import { render, screen, waitFor } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, vi } from "vitest";
import { routesConfig } from "../../config/routesConfig";

vi.mock("../../context/AuthenticationContext.tsx", () => {
  return {
    useAuthentication: () => {
      return {
        session: true,
      };
    },
  };
});

describe("HomePage", () => {
  it("Should display a top nav bar", async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/home"],
    });
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeInTheDocument();
      expect(screen.getByText(/home/i)).toHaveAttribute("href", "/home");
      expect(screen.getByText(/profile/i)).toHaveAttribute(
        "href",
        "/home/profile"
      );
    });
  });

  it("Should display a sidebar", async () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/home"],
    });
    render(<RouterProvider router={router} />);

    await waitFor(() => {
      const sidebar = screen.getByTestId("sidebar");
      expect(sidebar).toBeInTheDocument();
      const conversationBtn = screen.getByText("Conversations");
      expect(sidebar).toContainElement(conversationBtn);
    });
  });
});
