import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { routesConfig } from "../../config/routesConfig";

describe("ErrorPage", () => {
  it("should display custom error page on non-existent route", () => {
    const router = createMemoryRouter(routesConfig, {
      initialEntries: ["/page-does-not-exist"],
    });
    render(<RouterProvider router={router} />);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
