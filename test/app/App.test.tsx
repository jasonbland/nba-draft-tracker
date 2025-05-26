import App from "../../src/app/App";
import { render, screen } from "@testing-library/react";

describe("App tests", () => {
  it("should display correct header", () => {
    render(<App />);

    const heading = screen.getByRole("heading");
    expect(heading).toBeInTheDocument();
    expect(screen.getByText("NBA Draft Tracker")).toBeInTheDocument();
  });
});
