const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const testConfig = require('./config/CCPBConfig');

Feature('CC Pay Bubble Acceptance Tests').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Search for a case with actual case number from CCD', async I => {
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

Scenario('Search for a case with actual case for Telephony flow', async I => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  I.AcceptPayBubbleCookies();
  await I.caseforTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Amount Due case for Telephony flow', async I => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await I.AmountDueCaseForTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline @crossbrowser');

Scenario('Remove fee from case transaction page Telephony flow', async I => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  I.RejectPayBubbleCookies();
  await I.removeFeeFromCaseTransactionPageTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Search for a case with dummy case number @nightly', async I => {
  I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await I.searchForCCDdummydata();
  I.Logout();
}).tag('@nightly @pipeline');
