import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

test("renders input field and Get Signal button", () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Enter stock ticker/i);
  const buttonElement = screen.getByText(/Get Signal/i);

  expect(inputElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});

test("displays the trading signal after clicking Get Signal button", async () => {
  render(<App />);
  const buttonElement = screen.getByText(/Get Signal/i);

  // Mock the API response
  jest.spyOn(global, "fetch").mockResolvedValue({
    json: () =>
      Promise.resolve({
        "Time Series (Daily)": {
          "2023-05-03": { "4. close": "100.00" },
          "2023-05-02": { "4. close": "101.00" },
          "2023-05-01": { "4. close": "102.00" },
        },
      }),
  });

  fireEvent.click(buttonElement);

  await waitFor(() => screen.getByText(/The trading signal for/i));

  expect(screen.getByText(/The trading signal for/i)).toBeInTheDocument();

  // Clean up after the test
  global.fetch.mockRestore();
});
