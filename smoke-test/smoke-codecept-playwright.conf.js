/* eslint-disable */
const CONF = require('config');

exports.config = {
  name: 'ccpaybubble-smoke-test',
  tests: './test/smoke-test.js',
  timeout: 10000,
  output: './output',
  helpers: {
    Playwright: {
      url: `${CONF.e2e.frontendUrl}/health`,
      waitForNavigation: 'domcontentloaded',
      show: false,
      waitUntil: 'networkidle',
    }
  },
  mocha: {}
};
