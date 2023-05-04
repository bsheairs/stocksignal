import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA, calculateLastSignalDate } from "./utils/calculations";
import Chart from "chart.js/auto";
import "chartjs-plugin-annotation";

const App = () => {
  const [ticker, setTicker] = useState("SPY");
  const [inputTicker, setInputTicker] = useState("SPY");
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  const drawConfidenceChart = (prices, dates, sma50, sma200) => {
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

  const fetchStockData = async (ticker) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
      );

      if (!response.data || !response.data["Time Series (Daily)"]) {
        console.error("API response missing data:", response);
        throw new Error("Missing data in API response");
      }

      const data = response.data["Time Series (Daily)"];
      const values = Object.values(data);
      const dates = Object.keys(data).map((date) => new Date(date));

      if (!values || values.length === 0) {
        console.error("No data values found:", data);
        throw new Error("No data values found");
      }

      const prices = values.map((value) => parseFloat(value["4. close"]));
      const sma50 = calculateSMA(prices, 50);
      const sma200 = calculateSMA(prices, 200);
      setSignal(
        sma50[sma50.length - 1] > sma200[sma200.length - 1] ? "BUY" : "SELL"
      );

      drawConfidenceChart(
        prices.slice(-30),
        dates.slice(-30),
        sma50.slice(-30),
        sma200.slice(-30)
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      setSignal("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData(ticker);
  }, [ticker]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTicker(inputTicker);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>AI Stock Signal</h1>
      </header>
      <div className="content">
        <canvas
          id="confidence-chart"
          ref={chartRef}
          data-testid="confidence-chart"
          width={400}
          height={100}
        />

        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={inputTicker}
              onChange={(e) => setInputTicker(e.target.value)}
              placeholder="Enter stock ticker"
            />
            <button type="submit">Get Signal</button>
          </div>
        </form>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            The trading signal for <strong>{ticker}</strong> is: {signal}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
