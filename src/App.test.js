import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import App from "./App";

describe("App", () => {
  test("renders initial UI elements", () => {
    render(<App />);

    // Check if the header is rendered
    expect(screen.getByText("AI Stock Signal")).toBeInTheDocument();

    // Check if the canvas element for the chart is rendered
    expect(screen.getByTestId("confidence-chart")).toBeInTheDocument();

    // Check if the input field and button are rendered
    expect(
      screen.getByPlaceholderText("Enter stock ticker")
    ).toBeInTheDocument();
    expect(screen.getByText("Get Signal")).toBeInTheDocument();
  });
});
