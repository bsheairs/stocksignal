import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

test("renders the header", () => {
  render(<App />);
  const headerElement = screen.getByText(/AI Stock Signal/i);
  expect(headerElement).toBeInTheDocument();
});

test("displays the trading signal after clicking Get Signal button", async () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText("Enter stock ticker");
  const buttonElement = screen.getByText(/Get Signal/i);

  fireEvent.change(inputElement, { target: { value: "AAPL" } });
  fireEvent.click(buttonElement);

  await waitFor(() => screen.getByText(/The trading signal for/i));

  expect(screen.getByText(/The trading signal for/i)).toBeInTheDocument();
});
