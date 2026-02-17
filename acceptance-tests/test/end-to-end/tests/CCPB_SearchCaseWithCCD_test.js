const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const testConfig = require('./config/CCPBConfig');
const utils = require("../helpers/utils");
const stringUtils = require("../helpers/string_utils");
const miscUtils = require("../helpers/misc");
const searchCase = require("../pages/case_search");
const apiUtils = require("../helpers/utils");
const FeesSummary = require("../pages/fees_summary");

Feature('CC Pay Bubble Acceptance Tests').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Search for a case with actual case number from CCD', async({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
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
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  await I.caseforTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Amount Due case for Telephony flow', async({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await I.AmountDueCaseForTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline @crossbrowser');

Scenario('Partially paid (Upfront remission) case for Telephony flow', async({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await I.partiallyPaidUpfrontRemissionCaseForTelephonyFlow();
}).tag('@nightly @pipeline');

Scenario('Upfront remission added after failed Telephony Payment and allocate bulk scan payment for remaining amount', async({ I, CaseTransaction, FeesSummary, ConfirmAssociation }) => {
  const feeCode = 'FEE0219';
  const feeAmount = '300.00';
  const remissionAmount= '100.00';
  const amountDue = '200.00';
  const totalPaymentAmount = '200.00';
  const bulkScanPayment = '200.00';
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const ccdNumber = await utils.createACCDCaseForProbate();
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
  await miscUtils.multipleSearch(searchCase, I, ccdCaseNumberFormatted);
  await I.initiateAndCancelTheTelephonyPayment(ccdCaseNumberFormatted, feeCode, feeAmount, 'family', 'probate_registry');
  I.clearCookie();
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  await miscUtils.multipleSearch(searchCase, I, ccdCaseNumberFormatted);
  I.see('Initiated');
  await I.click('(//*[text()[contains(.,"Review")]])[2]');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
  I.updateTheInitiatedTelephonyPaymentStatusToFailed(paymentRcReference, feeAmount, 'FAILED');
  I.click('Back');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.addUpfrontRemissionForFailedTelephonyPayment(feeCode, totalPaymentAmount);
  I.see('Partially paid');
  await apiUtils.bulkScanPaymentForExistingNormalCase('AA08', bulkScanPayment, 'cheque', ccdNumber);
  I.refreshPage();
  await CaseTransaction.validateCaseTransactionsDetails('0.00', '1', remissionAmount, amountDue, '0.00');
  CaseTransaction.allocateToExistingServiceRequest(feeAmount);
  FeesSummary.verifyFeeSummaryAfterRemission(feeCode, feeAmount, remissionAmount, amountDue);
  I.click('Allocate payment');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  ConfirmAssociation.verifyConfirmAssociationFullPayment(feeCode, '1', totalPaymentAmount, feeAmount);
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.see('Success');
  await CaseTransaction.validateCaseTransactionsDetails(totalPaymentAmount, '0', remissionAmount, '0.00', '0.00');
}).tag('@nightly @pipeline');

Scenario('Remove fee from case transaction page Telephony flow', async({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  await I.removeFeeFromCaseTransactionPageTelephonyFlow();
  I.Logout();
}).tag('@nightly @pipeline');

Scenario('Search for a case with dummy case number @nightly', async({ I }) => {
  I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  await I.searchForCCDdummydata();
  I.Logout();
}).tag('@nightly @pipeline');
