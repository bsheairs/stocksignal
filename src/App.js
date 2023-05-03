import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA } from "./utils/calculations";

const App = () => {
  const [ticker, setTicker] = useState("SPY");
  const [inputTicker, setInputTicker] = useState("SPY");
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error("Error fetching data:", error);
      setSignal("Error fetching data");
    }
    setLoading(false);
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
