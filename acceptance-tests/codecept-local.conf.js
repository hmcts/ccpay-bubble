/* eslint-disable no-magic-numbers */
const CONF = require('config');

const waitForTimeout = parseInt(CONF.e2e.waitForTimeoutValue);
const waitForAction = parseInt(CONF.e2e.waitForActionValue);

exports.config = {
  name: 'ccpay-bubble-acceptance-tests',
  tests: './test/end-to-end/tests/*_test.js',
  timeout: 10000,
  output: './output',
  helpers: {
    Puppeteer: {
      url: CONF.e2e.frontendUrl,
      waitForTimeout,
      waitForAction,
      // waitForNavigation: 'networkidle0',
      waitForNavigation: 'domcontentloaded',
      show: false,
      restart: false,
      keepCookies: false,
      keepBrowserState: true,
      networkIdleTimeout: 5000,
      waitUntil: 'networkidle',
      timeout: 3000000,
      chrome: { ignoreHTTPSErrors: 'true' }
    },
    Mochawesome: { uniqueScreenshotNames: 'true' }
  },
  include: {
    I: './test/end-to-end/pages/steps_file.js',
    idam: './test/end-to-end/pages/idam_backdoor.js'
  },
  mocha: {
    reporterOptions: {
      mochaFile: 'output/result.xml',
      reportDir: 'output',
      takePassedScreenshot: false,
      clearOldScreenshots: true,
      shortScrFileNames: false
    }
  },
  bootstrap: false
};
