const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const testConfig = require('./config/CCPBConfig');
const bulkScanApiCalls = require("../helpers/utils");
const stringUtils = require("../helpers/string_utils");
const CCPBConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const searchCase = require("../pages/case_search");

Feature('CC Pay Bubble Acceptance Tests').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Search for a case with actual case number from CCD', async({ I }) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  await I.runAccessibilityTest();
  I.see('Search for a case');
  I.see('What do you want to search for?');
  I.see('CCD case reference or exception record');
  I.see('Payment Asset Number (DCN)');
  I.see('Case Transaction');
  I.see('Payment history');
  I.see('Reports');
  await I.searchForCorrectCCDNumber();
  await I.runAccessibilityTest();
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Search for a case with actual case for Telephony flow', async({ I }) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  await I.caseforTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Amount Due case for Telephony flow', async({ I }) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await I.AmountDueCaseForTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline @crossbrowser');

Scenario('Partially paid (Upfront remission) case for Telephony flow', async({ I, AddFees, FeesSummary, Remission }) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const ccdNumber = await bulkScanApiCalls.createACCDCaseForDivorce();
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
  await miscUtils.multipleSearch(searchCase, I, ccdCaseNumberFormatted);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.see('Case transactions');
  I.see('Case reference:');
  I.see(ccdCaseNumberFormatted);
  // this.click('Take telephony payment');
  I.click('Create service request and pay');
  I.wait(CCPBConstants.fiveSecondWaitTime);
  AddFees.addFeesAmount('593.00', 'family', 'family_court');
  FeesSummary.verifyFeeSummaryTelephonyPayment(ccdCaseNumberFormatted, 'FEE0002', '593.00', false);
  FeesSummary.deductRemission();
  Remission.processRemission('FEE0002', '200');
  Remission.confirmProcessRemission();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.click('Case Transaction');
  I.wait(CCPBConstants.fiveSecondWaitTime);
  await miscUtils.multipleSearch(searchCase, I, ccdNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.see('Case transactions');
  I.see('Case reference:');
  I.see(ccdCaseNumberFormatted);
  I.see('Partially paid');
  I.click('Take telephony payment');
  I.wait(CCPBConstants.fiveSecondWaitTime);
  FeesSummary.verifyFeeSummaryAfterRemission('FEE0002', '£593.00', '£393.00', '£200.00');
  I.click('Take payment');
  I.wait(CCPBConstants.fiveSecondWaitTime);
  I.waitInUrl('pcipal', 2);
  I.click('Cancel');
  I.click('Finish Session');
  I.wait(CCPBConstants.fiveSecondWaitTime);
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Remove fee from case transaction page Telephony flow', async({ I }) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  await I.removeFeeFromCaseTransactionPageTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Search for a case with dummy case number @nightly', async({ I }) => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await I.searchForCCDdummydata();
  I.Logout();
}).tag('@nightly @pipeline');
