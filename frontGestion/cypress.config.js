const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      require('@shelex/cypress-allure-plugin/writer')(on, config);
      return config;
    },
    baseUrl: 'http://localhost:4200', // o la URL donde corre tu app Angular
  },
});
