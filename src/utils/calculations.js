export const calculateSMA = (prices, period) => {
  const result = new Array(prices.length).fill(null);
  let sum = 0;

  // Reverse the input price data
  const reversedPrices = [...prices].reverse();

  for (let i = 0; i < reversedPrices.length; i++) {
    sum += reversedPrices[i];

    if (i >= period) {
      sum -= reversedPrices[i - period];
    }

    if (i >= period - 1) {
      result[i] = sum / period;
    }
  }

  // Reverse the result back to the original order
  return result.reverse();
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
