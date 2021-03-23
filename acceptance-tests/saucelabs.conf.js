/* eslint-disable */

const supportedBrowsers = require('acceptance-tests/test/end-to-end/crossbrowser/supportedBrowsers.js');
const testConfig = require('config');

const waitForTimeout = parseInt(process.env.WAIT_FOR_TIMEOUT) || 45000;
const smartWait = parseInt(process.env.SMART_WAIT) || 30000;
const browser = process.env.SAUCELABS_BROWSER || 'chrome';
const defaultSauceOptions = {
  username: process.env.SAUCE_USERNAME,
  accessKey: process.env.SAUCE_ACCESS_KEY,
  tunnelIdentifier: process.env.TUNNEL_IDENTIFIER || 'reformtunnel',
  acceptSslCerts: true,
  windowSize: '1600x900',
  tags: ['FeeAndPay']
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

function getBrowserConfig(browserGroup) {
  const browserConfig = [];
  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = supportedBrowsers[browserGroup][candidateBrowser];
      candidateCapabilities['sauce:options'] = merge(
        defaultSauceOptions, candidateCapabilities['sauce:options']
      );
      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }
  return browserConfig;
}

// testConfig.TestOutputDir = undefined;
const setupConfig = {
  tests: './test/end-to-end/tests/*_test.js',
  output: './output',
  helpers: {
    WebDriver: {
      url: testConfig.e2e.frontendUrl,
      browser,
      smartWait,
      waitForTimeout,
      cssSelectorsEnabled: 'true',
      host: 'ondemand.eu-central-1.saucelabs.com',
      port: 80,
      region: 'eu',
      capabilities: {}
    },
    SauceLabsReportingHelper: { require: './test/end-to-end/helpers/SauceLabsReportingHelper.js' },
    // MiscHelper: { require: './test/end-to-end/helpers/misc.js' },
    // NumberHelpers: { require: './test/end-to-end/helpers/number_utils.js' },
    // StringHelper: { require: './test/end-to-end/helpers/string_utils.js' },
    // UtilsHelper: { require: './test/end-to-end/helpers/utils.js' }
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2
    },
    autoDelay: {
      enabled: true,
      delayAfter: 2000
    }
  },
  include: {
    config: 'config.js',
    I: './test/end-to-end/pages/steps_file.js',
    CaseSearch: './test/end-to-end/pages/case_search.js',
    CaseTransaction: './test/end-to-end/pages/case_transactions.js',
    FeesSummary: './test/end-to-end/pages/fees_summary.js',
    AddFees: './test/end-to-end/pages/add_fees.js',
    ConfirmAssociation: './test/end-to-end/pages/confirm_association.js',
    CaseTransferred: './test/end-to-end/pages/case_transferred.js',
    CaseUnidentified: './test/end-to-end/pages/case_unidentified.js',
    Remission: './test/end-to-end/pages/remission.js',
    PaymentHistory: './test/end-to-end/pages/payment_history.js',
    Reports: './test/end-to-end/pages/reports.js'
  },
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: 'functional-output/result.xml' }
      },
      mochawesome: {
        stdout: 'functional-output/console.log',
        options: {
          reportDir: 'functional-output',
          reportName: 'index',
          reportTitle: 'Crossbrowser results',
          inlineAssets: true
        }
      }
    }
  },
  // multiple: {
  //   chrome: { browsers: getBrowserConfig('chrome') },
  //   firefox: { browsers: getBrowserConfig('firefox') }
  // },
  name: 'Fee and Pay FrontEnd Cross-Browser Tests'
};

exports.config = setupConfig;
