/* eslint-disable no-alert, no-console */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');
const stringUtils = require('../helpers/string_utils');

// eslint-disable-next-line no-unused-vars
const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');
const assertionData = require('../fixture/data/refunds/assertion');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds_test.js');

const testConfig = require('./config/CCPBConfig');
const { SystemJsNgModuleLoader } = require('@angular/core');
const { threadId } = require('worker_threads');
const { Console } = require('console');
const refunds_list = require('../pages/refunds_list');

const successResponse = 202;

// const successResponse = 202;
function RefundException(message) {
  this.message = message;
  this.name = 'Assertion Error';
}

Feature('CC Pay Bubble Refunds V2 OverPayment Test').retry(CCPBATConstants.defaultNumberOfRetries);

BeforeSuite(async I => {
  // console.log('Before Suite');
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  // console.log('After Response');
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

Scenario('OverPayment for Refunds V2 @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
    PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
    const totalAmount = 500;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    // const paymentRef = await bulkScanApiCalls.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
    // console.log('**** payment ref - ' + paymentRef);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await bulkScanApiCalls.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPageForOverPayments();
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');

Scenario('Partial Payments Refunds V2 @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails, RefundsList) => {

    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRef = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRef);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForPartialPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await bulkScanApiCalls.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await PaymentHistory.validatePaymentDetailsForPartialPayment();
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyIssueRefundPageForPartialPayments('200');
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyProcessRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    await InitiateRefunds.verifyCheckYourAnswersPageForPartialPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPageForPartialPayments();
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');

Scenario('FullPayment for Refunds V2 @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
    PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
    const totalAmount = 500;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    // const paymentRef = await bulkScanApiCalls.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
    // console.log('**** payment ref - ' + paymentRef);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await bulkScanApiCalls.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="full-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyProcessRefund();
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    await InitiateRefunds.verifyCheckYourAnswersPageForFullRefunds();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPageForFullRefunds();
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');

Scenario('OverPayment for Refunds V2 Rejected Flow @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
    PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
    const totalAmount = 500;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    // const paymentRef = await bulkScanApiCalls.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
    // console.log('**** payment ref - ' + paymentRef);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await bulkScanApiCalls.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPageForOverPayments();
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Reject');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterRejectionOfOverPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');


Scenario('FullPayment for Refunds V2 Send To Caseworker @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
    PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
    const totalAmount = 500;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    // const paymentRef = await bulkScanApiCalls.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
    // console.log('**** payment ref - ' + paymentRef);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await bulkScanApiCalls.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="full-payment"]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyProcessRefund();
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    await InitiateRefunds.verifyCheckYourAnswersPageForFullRefunds();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPageForFullRefunds();
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterReturnToCaseWorkerOfFullPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');



Scenario('OverPayment for Refunds V2 and Remission Refund Journey @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
    PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
    const totalAmount = 500;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    // const paymentRef = await bulkScanApiCalls.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
    // console.log('**** payment ref - ' + paymentRef);
    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await bulkScanApiCalls.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRefOverPayments = await InitiateRefunds.verifyRefundSubmittedPageForOverPayments();
    // I.Logout();
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    // I.click('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemission();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPageForRemissions();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyIssueRefundPageForRemissions('100');
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyProcessRefund();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await InitiateRefunds.verifyCheckYourAnswersPageForRemissions();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refunds = await InitiateRefunds.verifyRefundSubmittedPageForRefunds();
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    for (let i = 0; i <= 2; i++) {
      console.log('value of i' + i);
      I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      I.click('Refund List');
      I.wait(CCPBATConstants.tenSecondWaitTime);
      if (i == 0) {
       valueToPass = refundRefOverPayments;
      } if (i == 1) {
       valueToPass = refundRefRemissions;
      } if (i == 2) {
       valueToPass = refunds;
      }
      await InitiateRefunds.verifyRefundsListPage(valueToPass);
      I.wait(CCPBATConstants.twoSecondWaitTime);
      InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Approve');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      I.Logout();
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }

    // I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // I.click('Refund List');
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // await InitiateRefunds.verifyRefundsListPage(refundRefOverPayments);
    // I.wait(CCPBATConstants.twoSecondWaitTime);
    // InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Approve');
    // I.wait(CCPBATConstants.twoSecondWaitTime);
    // I.Logout();
    // I.wait(CCPBATConstants.fiveSecondWaitTime);

    // I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // I.click('Refund List');
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // await InitiateRefunds.verifyRefundsListPage(refundRefRemissions);
    // I.wait(CCPBATConstants.twoSecondWaitTime);
    // InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Approve');
    // I.wait(CCPBATConstants.twoSecondWaitTime);
    // I.Logout();
    // I.wait(CCPBATConstants.fiveSecondWaitTime);

    // I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    // I.click('Refund List');
    // I.wait(CCPBATConstants.tenSecondWaitTime);
    // await InitiateRefunds.verifyRefundsListPage(refunds);
    // I.wait(CCPBATConstants.twoSecondWaitTime);
    // InitiateRefunds.verifyReviewRefundsDetailsPageForRefundsV2('Approve');
    // I.wait(CCPBATConstants.twoSecondWaitTime);
    // I.Logout();
    // I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.login(testConfig.TestProbateCaseWorkerNewUserName, testConfig.TestProbateCaseWorkerNewPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPaymentsRemissionsRefunds(refunds, refundRefRemissions, refundRefOverPayments);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterOverPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr[2]/td[6]/a');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterRemission();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr[3]/td[6]/a');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterRefunds();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');
