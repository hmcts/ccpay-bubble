/* eslint-disable */
const CONF = require('config');

exports.config = {
  name: 'ccpay-bubble-acceptance-tests',
  tests: './test/end-to-end/tests/*_test.js',
  timeout: 10000,
  output: `${process.cwd()}/functional-output/functional/reports`,
  helpers: {
    Playwright: {
      url: CONF.e2e.frontendUrl,
      show: false,
      browser: 'chromium',
      waitForTimeout: 60001,
      waitForAction: 2000,
      timeout: 20002,
      waitForNavigation: 'networkidle0',
      ignoreHTTPSErrors: true,
      fullPageScreenshots: true,
      uniqueScreenshotNames: true,
      recordVideo: {
        dir: `${process.cwd()}/functional-output/functional/reports`,
        size : {
          width: 1024,
          height: 768
        }
      }
    },
    PlaywrightHelper: {
      require: "./test/end-to-end/helpers/PlaywrightHelper.js"
    },
    AccessibilityReportingHelper: {
      require: "./test/end-to-end/helpers/AccessibilityReportingHelper.js"
    }
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
  mocha: {}
};
