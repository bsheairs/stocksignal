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

    let lastSignalDate;
    try {
      lastSignalDate = calculateLastSignalDate(sma50, sma200, dates);
    } catch (error) {
      console.error("Error calculating last signal date:", error);
      return;
    }

    window.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dates.map((date) => moment(date).format("YYYY-MM-DD")),
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
