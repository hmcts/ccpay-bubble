const pa11y = require('pa11y');
const path = require('path');
const fs = require('fs');
const htmlReporter = require('pa11y-reporter-html');
const urls = require('./pa11y-urls');

// ------------------------------------------------------------------------

const configuration = {
  headers: { Authorization: 'Bearer post.clerk@hmcts.net' }
  // log: { debug: console.log, error: console.error, info: console.log }
};

// ------------------------------------------------------------------------

const generateHTMLReport = (isNew, html) => new Promise((resolve, reject) => {
  const editType = (isNew) ? 'writeFile' : 'appendFile';
  fs[editType](`${path.resolve(__dirname, '..', 'coverage')}/pa11y.html`, html, err => {
    if (err) reject(new Error({ err }));
    resolve({ message: (isNew) ? 'pa11y file created.' : 'pa11y file updated.' });
  });
});

// ------------------------------------------------------------------------

const runTest = config => {
  let isNewReport = true;

  // loop through the urls that need to be tested
  urls.forEach(async url => {
    const pa11yResults = await pa11y(url, config);
    if (pa11yResults.issues.length) {
      console.error(`Url: ${pa11yResults.pageUrl}`);
      console.error(`Number of issues: ${pa11yResults.issues.length}`);
      /* eslint no-process-exit: 0 */
      process.exit(1);
    }

    htmlReporter.results(pa11yResults)
      .then(htmlResults => generateHTMLReport(isNewReport, htmlResults))
      .then(response => {
        isNewReport = (isNewReport) ? !isNewReport : isNewReport;

        /* eslint no-console: 0 */
        console.log(`Url: ${pa11yResults.pageUrl}`);
        console.log(`Number of issues: ${pa11yResults.issues.length}`);
        console.log(`File Status: ${response.message}`);
        console.log('--');
      })
      .catch(console.error);
  });
};

// ------------------------------------------------------------------------

runTest(configuration);
