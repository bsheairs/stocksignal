import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders SPY ETF Trading Signal header", () => {
  render(<App />);
  const headerElement = screen.getByText(/SPY ETF Trading Signal/i);
  expect(headerElement).toBeInTheDocument();
});
