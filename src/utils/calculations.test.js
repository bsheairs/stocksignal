import { calculateSMA, calculateLastSignalDate } from "./calculations";

describe('calculateSMA', () => {
  test('should calculate the simple moving average correctly', () => {
    const prices = [500, 400, 300, 200, 100].reverse();
    const period = 3;
    const expectedSMA = [null, null, 200, 300, 400].reverse();
    expect(calculateSMA(prices, period)).toEqual(expectedSMA);
  });
});

describe("calculateLastSignalDate", () => {
  it("should return null if no signal change is detected", () => {
    const sma50 = [100, 110, 120, 130, 140];
    const sma200 = [90, 100, 110, 120, 130];
    const dates = [
      "2021-01-01",
      "2021-01-02",
      "2021-01-03",
      "2021-01-04",
      "2021-01-05",
    ].map((date) => new Date(date));
    expect(calculateLastSignalDate(sma50, sma200, dates)).toBeNull();
  });

  it("should return the correct date when a signal change is detected", () => {
    const sma50 = [100, 110, 120, 130, 140];
    const sma200 = [90, 100, 125, 135, 145];
    const dates = [
      "2021-01-01",
      "2021-01-02",
      "2021-01-03",
      "2021-01-04",
      "2021-01-05",
    ].map((date) => new Date(date));
    expect(calculateLastSignalDate(sma50, sma200, dates)).toEqual(
      new Date("2021-01-03")
    );
  });
});
