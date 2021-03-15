'use strict';
/* eslint-disable no-console */
const pa11y = require('pa11y');
const fs = require('fs');
const htmlReporter = require('pa11y-reporter-html');
const bulkScanApiCalls = require('../acceptance-tests/test/end-to-end/helpers/utils');

// Generates HTML reporter
const generateHTMLReport = html => new Promise((resolve, reject) => {
  fs.appendFile('functional-output/pa11y.html', html, err => {
    if (err) reject(new Error(err));
    resolve({ message: 'pa11y file updated.' });
  });
});

async function runTest() {
  // Creates a case
  const totalAmount = 550;
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'Cash');
  const ccdCaseNumber = ccdAndDcn[1];

  // Pages running the tests
  try {
  // Search case page
    const pa11yResult1 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        'set field #username to robreallywantsccdaccess@mailinator.com',
        'set field #password to Testing1234',
        'click element .button',
        'wait for url to not be https://paybubble.aat.platform.hmcts.net/',
        'screen capture a.png'
      ],
      wait: 1000,
      timeout: 70000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    // Case transactions
    const pa11yResult2 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        'set field #username to robreallywantsccdaccess@mailinator.com',
        'set field #password to Testing1234',
        'click element .button',
        'wait for element #ccd-search to be visible',
        `set field #ccd-search to ${ccdCaseNumber}`,
        'click element .button',
        'wait for element .govuk-heading-xl to be visible',
        'screen capture b.png'
      ],
      wait: 1000,
      timeout: 70000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    // Reports
    const pa11yResult3 = await pa11y('https://paybubble.aat.platform.hmcts.net/payment-history/view?view=reports', {

      actions: [
        'set field #username to robreallywantsccdaccess@mailinator.com',
        'set field #password to Testing1234',
        'click element .button',
        'wait for element .govuk-fieldset__legend--xl to be visible',
        'screen capture c.png'
      ],
      timeout: 70000,
      wait: 1000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    // Search for a fee
    const pa11yResult4 = await pa11y('https://paybubble.aat.platform.hmcts.net/fee-search', {

      actions: [
        'set field #username to robreallywantsccdaccess@mailinator.com',
        'set field #password to Testing1234',
        'click element .button',
        'wait for element .heading-xlarge to be visible',
        'set field #fee-search to 10',
        'click element [class="button button-search"]',
        'wait for element [class="govuk-button"] to be visible',
        'screen capture d.png'
      ],
      wait: 1000,
      timeout: 70000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    // Add fee details
    const pa11yResult5 = await pa11y('https://paybubble.aat.platform.hmcts.net/addFeeDetail', {

      actions: [
        'set field #username to robreallywantsccdaccess@mailinator.com',
        'set field #password to Testing1234',
        'click element .button',
        'wait for element .heading-xlarge to be visible',
        'screen capture e.png'
      ],
      wait: 1000,
      timeout: 70000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    // Payment details
    const pa11yResult6 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        'set field #username to robreallywantsccdaccess@mailinator.com',
        'set field #password to Testing1234',
        'click element .button',
        'wait for element #ccd-search to be visible',
        'click element #RC',
        'set field #RC-search to RC-1611-0153-2743-2552',
        'click element .button',
        'wait for element [class="govuk-table__header col-28"] to be visible',
        'click element [class="govuk-table__cell whitespace-inherit"]',
        'wait for element [class="heading-large govuk-!-margin-top-0"] to be visible',
        'screen capture f.png'
      ],
      wait: 1000,
      timeout: 70000,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log
      }
    });

    // console.log(pa11yResult6);
    // eslint-disable-next-line max-len
    const pa11yResults = [pa11yResult1, pa11yResult2, pa11yResult3, pa11yResult4, pa11yResult5, pa11yResult6];

    for (let index = 0; index < pa11yResults.length; index++) {
      const pa11yResult = pa11yResults[index];

      console.log(pa11yResult);
      htmlReporter.results(pa11yResult)
        .then(htmlResults =>
          generateHTMLReport(htmlResults)
            .then(response => {
              console.log(`Url: ${pa11yResult.pageUrl}`);
              console.log(`Number of issues: ${pa11yResult.issues.length}`);
              console.log(`File Status: ${response.message}`);
              console.log('--');
            })
            .catch(console.error));
    }
  } catch (error) {
    console.log(error);
  }
}

runTest();
