export const calculateSMA = (prices, period) => {
  const result = new Array(prices.length).fill(null);

  for (let i = prices.length - 1; i >= 0; i--) {
    if (i + period - 1 < prices.length) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += prices[i + j];
      }
      result[i] = sum / period;
    }
  }

  return result;
};

//not correct
export const calculateEMA = (prices, period) => {
  if (prices.length < period) {
    return new Array(prices.length).fill(null);
  }

  const result = new Array(prices.length).fill(null);

  const daysInYear =
    prices.length > 1
      ? prices[prices.length - 1].time - prices[prices.length - 2].time
      : 252;
  const multiplier = 2 / (period + 1);
  let sum = 0;

  for (let i = 0; i < period; i++) {
    sum += prices[i].close;
  }

  const initialEMA = sum / period;

  result[period - 1] = initialEMA;

  for (let i = period; i < prices.length; i++) {
    result[i] = (prices[i].close - result[i - 1]) * multiplier + result[i - 1];
  }

  return result;
};

export const calculateLastSignalDate = (sma50, sma200, dates) => {
  for (let i = dates.length - 1; i > 0; i--) {
    if (
      (sma50[i] > sma200[i] && sma50[i - 1] <= sma200[i - 1]) ||
      (sma50[i] < sma200[i] && sma50[i - 1] >= sma200[i - 1])
    ) {
      return dates[i];
    }
  }
  return null;
};
