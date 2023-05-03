import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("displays the trading signal after clicking Get Signal button", async () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter stock ticker/i);
  const buttonElement = screen.getByText(/Get Signal/i);

  fireEvent.change(inputElement, { target: { value: "SPY" } });
  fireEvent.click(buttonElement);

  await waitFor(() => screen.getByText(/Signal:/i));

  expect(screen.getByText(/Signal:/i)).toBeInTheDocument();
});
