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
