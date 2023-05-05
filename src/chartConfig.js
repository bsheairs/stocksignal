import Chart from "chart.js/auto";
import { registerables } from "chart.js";
import moment from "moment";
import { calculateLastSignalDate } from "./utils/calculations";
import "chartjs-adapter-moment";

Chart.register(...registerables);

export const drawConfidenceChart = (
  chartRef,
  prices,
  dates,
  sma50,
  sma200,
  filterPeriod = "1y" // Default value set to 1 year
) => {
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

    const periodMap = {
      "1m": 20,
      "3m": 60,
      "6m": 120,
      "1y": 240,
    };

    for (let i = 0; i < dates.length && i < periodMap[filterPeriod]; i++) {
      const date = moment(dates[i]);

      filteredDates.push(date.format("YYYY-MM-DD"));
      filteredPrices.push(prices[i]);
      filteredSma50.push(sma50[i]);
      filteredSma200.push(sma200[i]);
    }

    // Reverse the filtered data arrays
    filteredDates.reverse();
    filteredPrices.reverse();
    filteredSma50.reverse();
    filteredSma200.reverse();

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
            type: "timeseries",
            time: {
              parser: "YYYY-MM-DD",
              adapter: moment,
              unit: "day",
            },
            // ticks: {
            //   //   skipNull: true,
            //   autoSkip: true,
            // },
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
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
};
