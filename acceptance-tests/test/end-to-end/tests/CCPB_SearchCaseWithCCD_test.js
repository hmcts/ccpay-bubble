const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_SearchCaseWithCCD_test.js');

Feature('CC Pay Bubble Acceptance Tests');

BeforeSuite(async I => {
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  I.wait(CCPBATConstants.oneMinute);
  if (response === '202') {
    logger.info('Disabled CCD validation');
  }
});

AfterSuite(async() => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  if (response === '202') {
    logger.info('Enabled CCD validation');
  }
});

Scenario('Search for a case with actual case number from CCD @nightly', I => {
  if (nightlyTest === 'true') {
    I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
    I.see('Search for a case');
    I.see('What do you want to search for?');
    I.see('CCD case reference or exception record');
    I.see('Payment Asset Number (DCN)');
    I.see('Case Transaction');
    I.see('Payment history');
    I.see('Reports');
    I.searchForCorrectCCDNumber();
    I.Logout();
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Search for a case with actual case for Telephony flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.caseforTelephonyFlow();
  I.Logout();
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Amount Due case for Telephony flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.AmountDueCaseForTelephonyFlow();
  I.Logout();
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Remove fee from case transaction page Telephony flow', I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  I.see('Search for a case');
  I.see('Search');
  I.see('Case Transaction');
  I.see('Payment history');
  I.removeFeeFromCaseTransactionPageTelephonyFlow();
  I.Logout();
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });

Scenario('Search for a case with dummy case number @nightly @pipeline', async I => {
  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  const responseOff = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.oneMinute);
  if (responseOff === '202') {
    logger.info('Enabled CCD validation');
  }
  I.searchForCCDdummydata();
  I.Logout();

  const responseOn = await bulkScanApiCalls.toggleOffCaseValidation();
  if (responseOn === '202') {
    logger.info('Disabled CCD validation');
  }
}).retry({ retries: CCPBATConstants.retryScenario, maxTimeout: CCPBATConstants.maxTimeout });
