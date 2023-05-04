module.exports = {
  // Your existing configuration
  moduleNameMapper: {
    "^chart.js/auto$": "<rootDir>/src/__mocks__/chartjs.js",
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
};
