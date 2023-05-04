module.exports = {
  // Your existing configuration
  moduleNameMapper: {
    "^chart.js/auto$": "<rootDir>/src/__mocks__/chartjs.js",
    "^chartjs-adapter-date-fns$":
      "<rootDir>/node_modules/chartjs-adapter-date-fns",
  },
  setupFilesAfterEnv: ["./jest.setup.js"],
};
