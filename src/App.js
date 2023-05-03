import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA } from "./utils/calculations";

function App() {
  const [ticker, setTicker] = useState("SPY");
  const [loading, setLoading] = useState(true);
  const [signal, setSignal] = useState(null);
  const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

  useEffect(() => {
    document.title = "AI Stock Signal";
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}&outputsize=full`
      );

      const data = response.data["Time Series (Daily)"];
      const prices = Object.values(data).map((entry) =>
        parseFloat(entry["4. close"])
      );
      const sma50 = calculateSMA(prices, 50);
      const sma200 = calculateSMA(prices, 200);

      if (sma50 > sma200) {
        setSignal("BUY");
      } else {
        setSignal("SELL");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Stock Trading Signal</h1>
      </header>
      <div className="content">
        <div className="input-container">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter stock ticker"
          />
          <button onClick={fetchStockData}>Get Signal</button>
        </div>
        <div className="signal">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>
              The trading signal for <strong>{ticker}</strong> is:{" "}
              <strong>{signal}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
