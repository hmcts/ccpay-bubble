const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_SearchCaseWithCCD_test.js');

const testConfig = require('./config/CCPBConfig');

const successResponse = 202;

Feature('CC Pay Bubble Acceptance Tests').retry(CCPBATConstants.retryScenario);

BeforeSuite(async I => {
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Disabled CCD validation');
  }
});

AfterSuite(async I => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Enabled CCD validation');
  }
});

Scenario('Search for a case with actual case number from CCD @nightly', async I => {
  if (nightlyTest) {
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    I.see('Search for a case');
    I.see('What do you want to search for?');
    I.see('CCD case reference or exception record');
    I.see('Payment Asset Number (DCN)');
    I.see('Case Transaction');
    I.see('Payment history');
    I.see('Reports');
    await I.searchForCorrectCCDNumber();
    I.Logout();
  }
});

Scenario('Search for a case with actual case for Telephony flow @nightly', async I => {
  if (nightlyTest) {
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    await I.caseforTelephonyFlow();
    I.Logout();
  }
});

Scenario('Amount Due case for Telephony flow @nightly @crossbrowser', async I => {
  if (nightlyTest) {
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    const responseoff = await bulkScanApiCalls.toggleOffCaseValidation();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    if (responseoff === successResponse) {
      logger.info('Disabled CCD validation');
    }
    await I.AmountDueCaseForTelephonyFlow();
    I.Logout();
  }
});

Scenario('Remove fee from case transaction page Telephony flow @nightly', async I => {
  if (nightlyTest) {
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    await I.removeFeeFromCaseTransactionPageTelephonyFlow();
    I.Logout();
  }
});

Scenario('Search for a case with dummy case number @nightly @pipeline', async I => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  const responseOn = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (responseOn === successResponse) {
    logger.info('Enabled CCD validation');
  }
  await I.searchForCCDdummydata();
  I.Logout();
});
