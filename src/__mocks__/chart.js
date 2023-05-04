const Chart = jest.fn();
const registerables = [];

Chart.register = jest.fn((...args) => {
  registerables.push(...args);
});

export { Chart, registerables };
