import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA } from "./utils/calculations";
import Chart from "chart.js/auto";
import "chartjs-plugin-annotation";

const App = () => {
  const [ticker, setTicker] = useState("SPY");
  const [inputTicker, setInputTicker] = useState("SPY");
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);

  const fetchStockData = async (ticker) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}`
      );
      const data = response.data["Time Series (Daily)"];
      const sma50 = calculateSMA(Object.values(data), 50);
      const sma200 = calculateSMA(Object.values(data), 200);
      setSignal(sma50 > sma200 ? "BUY" : "SELL");
      drawConfidenceChart(Math.random() * 100);
    } catch (error) {
      console.error("Error fetching data:", error);
      setSignal("Error fetching data");
    }
    setLoading(false);
  };

  const drawConfidenceChart = (confidence) => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (window.myChart) {
        window.myChart.destroy();
      }

      window.myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: ["0%", "100%"],
          datasets: [
            {
              data: [0, 100],
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
            },
          },
          plugins: {
            annotation: {
              annotations: {
                point: {
                  type: "point",
                  xValue: confidence,
                  yValue: confidence,
                  backgroundColor: "rgba(255, 99, 132, 1)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  radius: 5,
                },
              },
            },
          },
        },
      });
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
          width="400"
          height="100"
          ref={chartRef}
        ></canvas>
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
