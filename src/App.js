import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA } from "./utils/calculations";

const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [ticker, setTicker] = useState("SPY");
  const [displayedTicker, setDisplayedTicker] = useState(ticker);
  const [signal, setSignal] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStockData = async (ticker) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${API_KEY}`
      );
      const prices = Object.values(data["Time Series (Daily)"]).map((day) =>
        parseFloat(day["5. adjusted close"])
      );
      const sma50 = calculateSMA(prices, 50);
      const sma200 = calculateSMA(prices, 200);

      if (sma50 > sma200) {
        setSignal("Buy");
      } else {
        setSignal("Sell");
      }
      setDisplayedTicker(ticker);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    fetchStockData(ticker);
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchStockData(ticker);
  };

  const handleInputChange = (event) => {
    setTicker(event.target.value);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>AI Stock Signal</h1>
      </header>
      <div className="content">
        <form onSubmit={handleFormSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={ticker}
              onChange={handleInputChange}
              placeholder="Enter stock ticker"
            />
            <button type="submit">Get Signal</button>
          </div>
        </form>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <strong>{displayedTicker}</strong> Signal: {signal}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
