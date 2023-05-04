import { drawConfidenceChart } from "./chartConfig";

jest.mock("chart.js");

describe("drawConfidenceChart", () => {
  it("should call the drawConfidenceChart function", () => {
    const chartRef = { current: { getContext: jest.fn().mockReturnValue({}) } };
    const prices = [100, 200, 300];
    const dates = ["2021-01-01", "2021-02-01", "2021-03-01"];
    const sma50 = [150, 250, 350];
    const sma200 = [50, 100, 200];

    drawConfidenceChart(chartRef, prices, dates, sma50, sma200);
    expect(chartRef.current.getContext).toHaveBeenCalled();
  });
});
