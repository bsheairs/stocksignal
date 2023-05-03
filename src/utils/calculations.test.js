import { calculateSMA } from "./calculations";

describe("calculateSMA", () => {
  it("should calculate the correct simple moving average", () => {
    const prices = [2, 3, 4];
    const period = 3;

    const expectedSMA = (2 + 3 + 4) / 3;

    expect(calculateSMA(prices, period)).toEqual(expectedSMA);
  });

  it("should return 0 for an empty prices array", () => {
    const prices = [];
    const period = 3;

    expect(calculateSMA(prices, period)).toEqual(0);
  });

  it("should handle periods longer than the prices array", () => {
    const prices = [1, 2, 3];
    const period = 5;

    expect(calculateSMA(prices, period)).toEqual(0);
  });
});
