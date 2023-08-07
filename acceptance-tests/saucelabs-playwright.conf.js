const CONF = require('config');
const supportedBrowsers = require('acceptance-tests/test/end-to-end/crossbrowser/supportedBrowsersPlaywright.js');
import {event, container} from 'codeceptjs';

const getBrowserConfig = browserGroup => {
  const browserConfig = [];

  for (const candidateBrowser in supportedBrowsers[browserGroup]) {
    if (candidateBrowser) {
      const candidateCapabilities = {
        ...supportedBrowsers[browserGroup][candidateBrowser]
      };

      browserConfig.push({
        browser: candidateCapabilities.browserName,
        capabilities: candidateCapabilities,
      });
    } else {
      console.error('ERROR: supportedBrowsers.js is empty or incorrectly defined');
    }
  }

  return browserConfig;
};

const setupConfig = {
  name: 'cross-browser',
  tests: './test/end-to-end/tests/*_test.js',
  output: '../../../functional-output/cross-browser/reports',
  helpers: {
    Playwright: {
      url: CONF.e2e.frontendUrl,
      waitForTimeout: 60002,
      waitForAction: 800,
      timeout: 20004,
      waitForNavigation: 'domcontentloaded',
      ignoreHTTPSErrors: true,
      capabilities: {},
    },
  },
  plugins: {
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
    autoDelay: {
      enabled: true
    },
    retryTo: {
      enabled: true
    },
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy'
    },
  },
  include: {
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
    InitiateRefunds: './test/end-to-end/pages/initiate_refunds.js',
    ServiceRequests: './test/end-to-end/pages/service_requests.js',
    RefundsList: './test/end-to-end/pages/refunds_list.js',
    Reports: './test/end-to-end/pages/reports.js',
    FailureEventDetails: './test/end-to-end/pages/failure_event_details.js'
  },
  multiple: {
    webkit: {
      browsers: getBrowserConfig('webkit'),
    },
    chromium: {
      browsers: getBrowserConfig('chromium'),
    },
    firefox: {
      browsers: getBrowserConfig('firefox'),
    },
  },
};

event.dispatcher.on(event.test.before, function (test) {
  const {Playwright} = container.helpers();
  test.title = test.title + ' - ' + Playwright.options.capabilities['sauce:options'].name;
});

exports.config = setupConfig;
