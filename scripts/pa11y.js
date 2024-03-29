'use strict';
/* eslint-disable no-console */
const pa11y = require('pa11y');
const fs = require('fs');
const htmlReporter = require('pa11y-reporter-html');
const bulkScanApiCalls = require('../acceptance-tests/test/end-to-end/helpers/utils');

const email = 'robreallywantsccdaccess@mailinator.com';
const password = 'Testing1234';
const totalAmount = 550;

// Generates HTML reporter
const generateHTMLReport = html => new Promise((resolve, reject) => {
  fs.appendFile('functional-output/pa11y.html', html, err => {
    if (err) reject(new Error(err));
    resolve({ message: 'pa11y file updated.' });
  });
});

async function runTest() {

  try {
    // Creates a case
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'Cash');
    const dcnNumber = ccdAndDcn[0];
    // Pages running the tests
    // Search case page
    const pa11yResult1 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element .govuk-fieldset__heading to be visible'
      ],
      wait: 1000,
      timeout: 70000,
      chromeLaunchConfig: { slowMo: 500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // Reports page
    const pa11yResult2 = await pa11y('https://paybubble.aat.platform.hmcts.net/payment-history/view?view=reports', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element .govuk-fieldset__legend--xl to be visible'
      ],
      wait: 1000,
      timeout: 70000,
      chromeLaunchConfig: { slowMo: 500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // Search for a fee page
    const pa11yResult3 = await pa11y('https://paybubble.aat.platform.hmcts.net/fee-search', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible',
        'set field #fee-search to 10',
        'click element [class="button button-search"]',
        'wait for element [class="govuk-button"] to be visible'
      ],
      wait: 1000,
      timeout: 70000,
      chromeLaunchConfig: { slowMo: 500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // Add fee details page
    const pa11yResult4 = await pa11y('https://paybubble.aat.platform.hmcts.net/addFeeDetail', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element .heading-xlarge to be visible'
      ],
      wait: 1000,
      timeout: 70000,
      chromeLaunchConfig: { slowMo: 500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // Payment details page
    const pa11yResult5 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element #ccd-search to be visible',
        'click element #RC',
        'set field #RC-search to RC-1611-0153-2743-2552',
        'click element .button',
        'wait for element [class="govuk-table__header col-28"] to be visible',
        'click element [class="govuk-table__cell whitespace-inherit"]',
        'wait for element [class="heading-large govuk-!-margin-top-0"] to be visible'
      ],
      wait: 1000,
      timeout: 70000,
      chromeLaunchConfig: { slowMo: 500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // Case transactions page
    const pa11yResult6 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element #ccd-search to be visible',
        'click element #DCN',
        `set field #dcn-search to ${dcnNumber}`,
        'click element .button',
        'wait for element .govuk-heading-xl to be visible'
      ],
      wait: 1000,
      timeout: 150000,
      chromeLaunchConfig: { slowMo: 1500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // fee summary page
    console.log('fee summary');
    const pa11yResult7 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element #ccd-search to be visible',
        'click element #DCN',
        `set field #dcn-search to ${dcnNumber}`,
        'click element .button',
        'wait for element .govuk-heading-xl to be visible',
        'click element [type="submit"]',
        'wait for element .heading-xlarge to be visible',
        'set field #fee-search to 10',
        'click element [class="button button-search"]',
        'wait for element [class="govuk-button"] to be visible',
        'click element tr:nth-child(1) td:nth-child(4) > a:nth-child(1)',
        'wait for element [class="govuk-table__header govuk-!-font-weight-bold"] to be visible'
      ],
      wait: 1000,
      timeout: 150000,
      chromeLaunchConfig: { slowMo: 1500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // eslint-disable-next-line max-len
    const pa11yResults = [pa11yResult1, pa11yResult2, pa11yResult3, pa11yResult4, pa11yResult5, pa11yResult6, pa11yResult7];

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

async function runTest2() {

  try {

    // Creates a case
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'Cash');
    const dcnNumber = ccdAndDcn[0];
    const ccdAndDcn2 = await bulkScanApiCalls.bulkScanExceptionCcd('AA08', totalAmount, 'Cheque');
    const dcnNumber2 = ccdAndDcn2[0];
    // Pages running the tests
    // Confirm association page
    const pa11yResult1 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element #ccd-search to be visible',
        'click element #DCN',
        `set field #dcn-search to ${dcnNumber}`,
        'click element .button',
        'wait for element [id="\'unpaiedFee\'+i+\'\'"] to be visible',
        'click element [id="\'unpaiedFee\'+i+\'\'"]',
        'click element .button-grb button:nth-child(1)',
        'wait for element .heading-xlarge to be visible',
        'wait for element #fee-search to be visible',
        'set field #fee-search to 10',
        'click element [class="button button-search"]',
        'wait for element [class="govuk-button"] to be visible',
        'click element tr:nth-child(1) td:nth-child(4) > a:nth-child(1)',
        'wait for element [class="govuk-table__header govuk-!-font-weight-bold"] to be visible',
        'click element .govuk-table button',
        'wait for element [class="govuk-warning-text__text govuk-warning-text__custom"] to be visible'
      ],
      wait: 1000,
      timeout: 150000,
      chromeLaunchConfig: { slowMo: 1500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });


    // Mark pay as transferred page
    const pa11yResult2 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element #ccd-search to be visible',
        'click element #DCN',
        `set field #dcn-search to ${dcnNumber}`,
        'click element .button',
        'wait for element [id="\'unpaiedFee\'+i+\'\'"] to be visible',
        'click element [id="\'unpaiedFee\'+i+\'\'"]',
        'click element .button-grb button:nth-child(4)',
        'wait for element [class="govuk-table__cell"] to be visible'
      ],
      wait: 1000,
      timeout: 150000,
      chromeLaunchConfig: { slowMo: 1500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });

    // Mark payment as unidentified page
    const pa11yResult3 = await pa11y('https://paybubble.aat.platform.hmcts.net/', {

      actions: [
        `set field #username to ${email}`,
        `set field #password to ${password}`,
        'click element .button',
        'wait for element #ccd-search to be visible',
        'click element #DCN',
        `set field #dcn-search to ${dcnNumber2}`,
        'click element .button',
        'click element .button',
        'wait for element [id="\'unpaiedFee\'+i+\'\'"] to be visible',
        'click element [id="\'unpaiedFee\'+i+\'\'"]',
        'click element .button-grb button:nth-child(3)',
        'wait for element [class="govuk-table__cell"] to be visible'
      ],
      wait: 1000,
      timeout: 150000,
      chromeLaunchConfig: { slowMo: 1500 },
      log: {
        debug: console.log,
        info: console.log
      }
    });


    // eslint-disable-next-line max-len
    const pa11yResults = [pa11yResult1, pa11yResult2, pa11yResult3];

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
runTest2();
