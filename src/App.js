import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA } from "./utils/calculations";

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;

const App = () => {
  const [signal, setSignal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=SPY&apikey=${API_KEY}`
      );
      const data = response.data["Time Series (Daily)"];
      const prices = Object.values(data).map((day) =>
        parseFloat(day["5. adjusted close"])
      );
      const smaShort = calculateSMA(prices, 20);
      const smaLong = calculateSMA(prices, 50);

      if (smaShort > smaLong) {
        setSignal("Buy");
      } else {
        setSignal("Sell");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="app">
      <div className="header">
        <h1>SPY ETF Trading Signal</h1>
      </div>
      <div className="content">
        {signal ? (
          <div className={`signal-box ${signal.toLowerCase()}`}>
            <h2>Current Signal: {signal}</h2>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default App;
