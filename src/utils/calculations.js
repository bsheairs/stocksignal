export const calculateSMA = (values, period) => {
  if (values.length < period) {
    return 0;
  }

  const slicedPrices = values
    .slice(-period)
    .map((value) => parseFloat(value["4. close"]));
  const sum = slicedPrices.reduce((a, b) => a + b, 0);
  return sum / period;
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
