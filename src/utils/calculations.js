export const calculateSMA = (prices, period) => {
  if (prices.length < period) {
    return Array(prices.length).fill(0);
  }

  let sma = [];
  for (let i = period - 1; i < prices.length; i++) {
    const slicedPrices = prices.slice(i - period + 1, i + 1);
    const sum = slicedPrices.reduce((a, b) => a + b, 0);
    sma.push(sum / period);
  }
  return Array(period - 1)
    .fill(0)
    .concat(sma);
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
