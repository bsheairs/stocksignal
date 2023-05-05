import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import { calculateSMA } from "./utils/calculations";
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
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${ticker}&apikey=${process.env.REACT_APP_ALPHA_VANTAGE_API_KEY}&outputsize=full`
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
        alert("No data values found");
        return;
      }

      const requiredDataPoints = 440;
      if (values.length < requiredDataPoints) {
        console.error("Not enough data points:", data);
        alert("Not enough data points");
        return;
      }

      const prices = values.map((value) => parseFloat(value["4. close"]));
      console.log("prices", prices);
      const sma50 = calculateSMA(prices, 50);
      console.log("sma50", sma50);
      const sma200 = calculateSMA(prices, 200);
      console.log("sma200", sma200);
      setSignal(
        sma50[sma50.length - 1] > sma200[sma200.length - 1] ? "BUY" : "SELL"
      );
      console.log("sma50", sma50[sma50.length - 1]);
      console.log("sma200", sma200[sma200.length - 1]);

      drawConfidenceChart(chartRef, prices, dates, sma50, sma200);
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
        <div className="chart-container">
          <canvas
            id="confidence-chart"
            ref={chartRef}
            data-testid="confidence-chart"
            width={400}
            height={100}
          />
        </div>

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
      <footer className="footer">
        <div className="container">
          <p>
            This project is an example of the power of large language models
            (LLMs) and how they can be used to develop code and automate the
            deployment and security of web applications. ChatGPT, a language
            model trained by OpenAI based on the GPT4 and GPT-3.5 architecture,
            was used to provide intelligent responses and assist in the
            development of this application.{" "}
          </p>
          <p>
            Through the use of DevOps best practices and tools such as
            Dependabot, CodeQL, and Vercel, this project aims to showcase how
            LLMs can streamline the development process, increase efficiency,
            and enhance security.{" "}
          </p>
          <p>
            We hope that this project inspires others to explore the potential
            of LLMs in software development and highlights the importance of
            incorporating best practices in DevOps.{" "}
          </p>
          <p>
            <a href="https://github.com/bsheairs/stocksignal">
              Visit the GitHub repo
            </a>{" "}
            to learn more
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
