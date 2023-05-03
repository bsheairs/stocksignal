import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  test("renders header", () => {
    render(<App />);
    const headerElement = screen.getByText(/AI Stock Signal/i);
    expect(headerElement).toBeInTheDocument();
  });

  test("renders form and input", () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText("Enter stock ticker");
    expect(inputElement).toBeInTheDocument();
  });

  test("renders submit button", () => {
    render(<App />);
    const buttonElement = screen.getByText("Get Signal");
    expect(buttonElement).toBeInTheDocument();
  });

  test("renders confidence chart", () => {
    render(<App />);
    const confidenceChartElement = screen.getByTestId("confidence-chart");
    expect(confidenceChartElement).toBeInTheDocument();
  });

  test("submits form and updates ticker", async () => {
    render(<App />);
    const inputElement = screen.getByPlaceholderText("Enter stock ticker");
    const buttonElement = screen.getByText("Get Signal");

    fireEvent.change(inputElement, { target: { value: "AAPL" } });
    fireEvent.click(buttonElement);

    const tickerElement = await screen.findByText(
      "The trading signal for AAPL is:"
    );
    expect(tickerElement).toBeInTheDocument();
  });
});
