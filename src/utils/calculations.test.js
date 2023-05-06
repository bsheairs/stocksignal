import {
  calculateSMA,
  calculateEMA,
  calculateLastSignalDate,
} from "./calculations";

describe("calculateSMA", () => {
  test("should calculate the simple moving average correctly", () => {
    const prices = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const period = 3;
    const expectedSMA = [20, 30, 40, 50, 60, 70, 80, 90, null, null];

    expect(calculateSMA(prices, period)).toEqual(expectedSMA);
  });

  test("should return an array of null values if the period is larger than the number of prices", () => {
    const prices = [10, 20, 30, 40, 50];
    const period = 6;
    const expectedSMA = [null, null, null, null, null];

    expect(calculateSMA(prices, period)).toEqual(expectedSMA);
  });

  test("should return an array of the same length as the input prices", () => {
    const prices = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const period = 5;

    const sma = calculateSMA(prices, period);
    expect(sma.length).toBe(prices.length);
  });
});

// describe("calculateEMA", () => {
//   it("calculates EMA correctly", () => {
//     const prices = [2, 3, 4, 5, 6, 7, 8, 9, 10];
//     const period = 5;
//     const expectedEMA = [null, null, null, null, 4, 5, 6, 7, 8];

//     expect(calculateEMA(prices, period)).toEqual(expectedEMA);
//   });

//   it("returns an empty array if prices is empty", () => {
//     const prices = [];
//     const period = 5;

//     expect(calculateEMA(prices, period)).toEqual([]);
//   });

//   it("returns an array of nulls if period is greater than prices length", () => {
//     const prices = [2, 3, 4];
//     const period = 5;
//     const expectedEMA = [null, null, null];

//     expect(calculateEMA(prices, period)).toEqual(expectedEMA);
//   });
// });

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
