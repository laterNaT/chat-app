import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../App";

describe("RootPage", () => {
  it("should render a welcome text", () => {
    render(<App />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it("should render a link to login page", () => {
    render(<App />);
    expect(screen.getByText(/continue/i)).toHaveAttribute("href", "/login");
  });

  it("should redirect to login page when clicking on continue", async () => {
    render(<App />);
    const user = userEvent.setup();
    await user.click(screen.getByText("Continue"));
    expect(screen.getByText(/please sign in to continue/i)).toBeInTheDocument();
  });
});
