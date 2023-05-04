// src/chartConfig.js
import { Chart } from "chart.js";
import "chartjs-plugin-annotation";
import "chartjs-adapter-date-fns";
import { calculateLastSignalDate } from "./utils/calculations";

export const drawConfidenceChart = (prices, dates, sma50, sma200) => {
  if (chartRef.current) {
    const ctx = chartRef.current.getContext("2d");

    if (window.myChart) {
      window.myChart.destroy();
    }

    const lastSignalDate = calculateLastSignalDate(sma50, sma200, dates);

    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Stock Price",
            data: prices,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "SMA50",
            data: sma50,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
          {
            label: "SMA200",
            data: sma200,
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
