import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA, calculateLastSignalDate } from "./utils/calculations";
import { drawConfidenceChart } from "./chartConfig";

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
