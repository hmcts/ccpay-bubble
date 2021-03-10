'use strict';
const pa11y = require('pa11y');
const fs = require('fs');
const htmlReporter = require('pa11y-reporter-html');

const options = {
  log: {
    debug: console.log,
    error: console.error,
    info: console.log
  }
};

const actions1 = {
  actions: [
    'set field #username to robreallywantsccdaccess@mailinator.com',
    'set field #password to Testing1234',
    'click element .button',
    'wait for url to not be https://paybubble.aat.platform.hmcts.net/',
    'screen capture a.png'
  ],
  timeout: 70000
};

const actions2 = {
  actions: [
    'set field #username to robreallywantsccdaccess@mailinator.com',
    'set field #password to Testing1234',
    'click element .button',
    'wait for element #ccd-search to be visible',
    'set field #ccd-search to 0903202110281897',
    'click element .button',
    'wait for element .govuk-heading-xl to be visible',
    'screen capture b.png'
  ],
  timeout: 70000
};

const actions3 = {
  actions: [
    'set field #username to robreallywantsccdaccess@mailinator.com',
    'set field #password to Testing1234',
    'click element .button',
    'wait for element .govuk-fieldset__legend--xl to be visible',
    'screen capture c.png'
  ],
  timeout: 70000
};

const actions4 = {
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
  timeout: 70000
};

const actions5 = {
  actions: [
    'set field #username to robreallywantsccdaccess@mailinator.com',
    'set field #password to Testing1234',
    'click element .button',
    'wait for element .heading-xlarge to be visible',
    'screen capture e.png'
  ],
  timeout: 70000
};

const generateHTMLReport = html => new Promise((resolve, reject) => {
  fs.appendFile('./pa11y.html', html, err => {
    if (err) reject(new Error(err));
    resolve({ message: 'pa11y file updated.' });
  });
});

async function runTest() {
  const pa11yResults = await Promise.all([
    // Search case
    pa11y('https://paybubble.aat.platform.hmcts.net/', actions1),
    // Case transactions
    pa11y('https://paybubble.aat.platform.hmcts.net/', actions2),
    // Reports
    pa11y('https://paybubble.aat.platform.hmcts.net/payment-history/view?view=reports', actions3),
    // Search for a fee
    pa11y('https://paybubble.aat.platform.hmcts.net/fee-search', actions4),
    // Add fee details
    pa11y('https://paybubble.aat.platform.hmcts.net/addFeeDetail', actions5)
  ]);

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
}

runTest();
