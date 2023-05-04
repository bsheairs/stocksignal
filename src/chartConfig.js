import Chart from "chart.js/auto";
import { registerables } from "chart.js";
import moment from "moment";
import { calculateLastSignalDate } from "./utils/calculations";

Chart.register(...registerables);

export const drawConfidenceChart = (chartRef, prices, dates, sma50, sma200) => {
  if (chartRef.current) {
    const ctx = chartRef.current.getContext("2d");

    if (window.myChart) {
      window.myChart.destroy();
    }

    const lastSignalDate = calculateLastSignalDate(sma50, sma200, dates);

    const filteredDates = [];
    const filteredPrices = [];
    const filteredSma50 = [];
    const filteredSma200 = [];

    for (let i = 0; i < dates.length; i++) {
      const date = moment(dates[i]);
      const dayOfWeek = date.day();
      const isWeekend = dayOfWeek === 6 || dayOfWeek === 0;

      if (isWeekend) {
        continue;
      }

      const hasData =
        prices[i] !== null && sma50[i] !== null && sma200[i] !== null;

      if (!hasData) {
        continue;
      }

      filteredDates.push(date.format("YYYY-MM-DD"));
      filteredPrices.push(prices[i]);
      filteredSma50.push(sma50[i]);
      filteredSma200.push(sma200[i]);
    }

    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: filteredDates,
        datasets: [
          {
            label: "Stock Price",
            data: filteredPrices,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "SMA50",
            data: filteredSma50,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "SMA200",
            data: filteredSma200,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              parser: "YYYY-MM-DD",
              unit: "day",
            },
          },
          y: {
            beginAtZero: false,
          },
        },
        plugins: {
          annotation: {
            annotations: {
              line: {
                type: "line",
                xMin: lastSignalDate,
                xMax: lastSignalDate,
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
            },
          },
        },
      },
    });
  }
};
