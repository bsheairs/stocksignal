export const calculateSMA = (prices, period) => {
  if (prices.length < period) {
    return 0;
  }

  const slicedPrices = prices.slice(-period);
  const sum = slicedPrices.reduce((a, b) => a + b, 0);
  return sum / period;
};
