/* eslint-disable no-alert, no-console */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');

// eslint-disable-next-line no-unused-vars
const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');
const assertionData = require('../fixture/data/refunds/assertion');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds_test.js');

const successResponse = 202;

// const successResponse = 202;
function RefundException(message) {
  this.message = message;
  this.name = 'Assertion Error';
}

Feature('CC Pay Bubble Acceptance Tests For Refunds and Remissions').retry(CCPBATConstants.retryScenario);

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

Scenario('Add a Remissions and Add Refunds for a Successful PBA Payment through the Payments @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00', '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Payment Details Page
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourDetailsSummaryData = assertionData.checkYourDetailsSummary('', paymentReference, '£215.00', 'Payment by account',
      'Credit', 'Online', 'Success', 'string', 'PBAFUNC12345', 'string');
    InitiateRefunds.verifyPaymentDetailsPageSummarySection(checkYourDetailsSummaryData);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // The various change options....
    const checkYourAnswersData = assertionData.checkYourAnswers(
      paymentReference, 'HWF-A1B-23C', '200.00');
    // console.log(`The value of the paymentReference : ${checkYourAnswersData.paymentReference}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, true, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'PA20-123456');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersDataAfterHWFCodeChange = assertionData.checkYourAnswers(
      paymentReference, 'PA20-123456', '200.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersDataAfterHWFCodeChange, false, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '115.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersDataAfterAmount = assertionData.checkYourAnswers(
      paymentReference, 'PA20-123456', '115.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersDataAfterAmount, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(true, '115.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('115.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£115.00',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData, false);
    /* I.wait(CCPBATConstants.twoSecondWaitTime);
    pause();
    I.click('//div[3]//a[.=\'Review\']');
    InitiateRefunds.verifyNoAddRemissionOnPaymentDetailsPage();*/
    logger.info('Test Completed....');
    I.Logout();
  });

Scenario('Add a Remissions through Payments and Add Refunds for a Successful PBA Payment through the Service Request page @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // pause();
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Add remission', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentReference,
      'HWF-A1B-23C', '200.00');
    // console.log(`The value of the paymentReference : ${checkYourAnswersData.paymentReference}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(false, '200.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Review');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyHelpWithFeesSectionOnPaymentDetailsPage(
      checkYourAnswersData, 'Service request');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddOrInitiateRefund(
      checkYourAnswersData, 'Retrospective remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£200.00',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData, false);
    /* I.wait(CCPBATConstants.twoSecondWaitTime);
      I.click('//div[3]//a[.=\'Review\']');
      InitiateRefunds.verifyNoAddRemissionOnPaymentDetailsPage();
      logger.info('Test Completed....');*/
    I.Logout();
  });

Scenario('Add a Remissions through Payments and Add Refunds for a Successful PBA Payment through the Payment Details page @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourDetailsSummaryData = assertionData.checkYourDetailsSummary('', paymentReference, '£215.00', 'Payment by account',
      'Credit', 'Online', 'Success', 'string', 'PBAFUNC12345', 'string');
    InitiateRefunds.verifyPaymentDetailsPageSummarySection(checkYourDetailsSummaryData);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
    // //console.log('The value of the check your answers ' + `${checkYourAnswersData.paymentReference}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(false, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[@class=\'paymentrequest\']//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyHelpWithFeesSectionOnPaymentDetailsPage(
      checkYourAnswersData, 'Service request');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddOrInitiateRefund(
      checkYourAnswersData, 'Retrospective remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£200.00',
      'Sent for approval', refundReference, 'Retrospective remission',
      'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[3]//a[.=\'Review\']');
    logger.info('Test Completed....');
    I.Logout();
  });

Scenario('Add a Remissions through Payments and Add Refunds for a Successful PBA Payment through the Payment History Page @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    logger.log(ccdCaseNumber);
    // console.info(paymentReference);
    logger.log(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    logger.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00', '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Add remission', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentReference,
      'HWF-A1B-23C', '200.00');
    // console.log(`The value of the paymentReference : ${checkYourAnswersData.paymentReference}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(false, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Payment history');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyPaymentHistoryPage('£215.00', 'Payments');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyHelpWithFeesSectionOnPaymentDetailsPage(checkYourAnswersData, 'Payment details');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddOrInitiateRefund(
      checkYourAnswersData, 'Retrospective remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await InitiateRefunds.verifyRefundSubmittedPage('200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('Add a Remissions for a failed Payment @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAFailedPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    //  console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00', '0',
      '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      false, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourDetailsSummaryData = assertionData.checkYourDetailsSummary('', paymentReference, '£215.00', 'Payment by account',
      'Credit', 'Online', 'Failed', 'string', 'PBAFUNC12350', 'string');
    InitiateRefunds.verifyPaymentDetailsPageSummarySection(checkYourDetailsSummaryData);
    InitiateRefunds.verifyPaymentDetailsPageForFailedPayment('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPageForFailedPayment(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemissionForFailedPayment(
      checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRemissionAddedPageForFailedPayment();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });


Scenario('Issue a Refund for a PBA Payment through the Payment Details Page @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourDetailsSummaryData = assertionData.checkYourDetailsSummary('', paymentReference, '£215.00', 'Payment by account',
      'Credit', 'Online', 'Success', 'string', 'PBAFUNC12345', 'string');
    InitiateRefunds.verifyPaymentDetailsPageSummarySection(checkYourDetailsSummaryData);
    InitiateRefunds.verifyPaymentDetailsPage('Issue refund');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(
      ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'System/technical error', paymentReference, '£215', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasons(
      ccdCaseNumber, 'Other - CoP', 'COP Reason...');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // TO DO - The Reason for Refund should be chnged post defect fixing to CoP-COP Reason...
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'Other - CoP-COP Reason...', paymentReference, '£215', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData, false);
    I.Logout();
  });


Scenario('Issue a Refund for a PBA Payment through the Service Request Page @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.sevenSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Issue refund', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(
      ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'System/technical error', paymentReference, '£215', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasons(
      ccdCaseNumber, 'Other - CoP', 'COP Reason...');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // TO DO - The reasonForReason should change from COP Reason... to CoP-COP Reason...
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'Other - CoP-COP Reason...', paymentReference, '£215', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData, false);
    I.Logout();
  });


Scenario('Approve action a  Refund for a Rejection @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(`The value of the CCD Case Number : ${ccdCaseNumber}`);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Issue refund', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(
      ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'System/technical error', paymentReference, '£215', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasons(
      ccdCaseNumber, 'Other - CoP', 'COP Reason...');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'Other - CoP-COP Reason...', paymentReference, '£215', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    logger.log(refundReference);
    // console.log(`The value of the Refund Reference : ${refundReference}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.twentySecondWaitTime);
    InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPage(caseTransactionsData, 'Reject');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundApprovedPage('Reject');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const caseTransactionsDataForRejectedRefund = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Rejected', refundReference, 'CoP-COP Reason...', 'Probate Request Request', 'More evidence is required');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsDataForRejectedRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('Approve action a Refund for an Approval @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(`The value of the CCD Case Number : ${ccdCaseNumber}`);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.sevenSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Issue refund', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(
      ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'System/technical error', paymentReference, '£215', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasons(
      ccdCaseNumber, 'Other - CoP', 'COP Reason...');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'COP Reason...', paymentReference, '£215', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    logger.log(refundReference);
    // console.log(`The value of the Refund Reference : ${refundReference}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request', 'Refund initiated and sent to team leader');
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.twentySecondWaitTime);
    InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPage(caseTransactionsData, 'Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundApprovedPage('Approve');
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const caseTransactionsDataForApprovedRefund = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Approved', refundReference,
      'CoP-COP Reason...', 'Probate Request Request', 'Sent to middle office');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber,
      caseTransactionsDataForApprovedRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });


Scenario('Approve action a Refund Returned to Case Worker and Resubmit By Approver through the Case Transaction Page Refunds Review Section @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(`The value of the CCD Case Number : ${ccdCaseNumber}`);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Issue refund', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(
      ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'System/technical error', paymentReference, '£215', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasons(
      ccdCaseNumber, 'Other - CoP', 'COP Reason...');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'Other - CoP-COP Reason...', paymentReference, '£215', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    logger.log(refundReference);
    // console.log(`The value of the Refund Reference : ${refundReference}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber,
      caseTransactionsData);
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.twentySecondWaitTime);
    InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPage(caseTransactionsData, 'Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundApprovedPage('Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const caseTransactionsDataForUpdateRequiredRefund = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Update required', refundReference,
      'CoP-COP Reason...',
      'Probate Request Request', '\'Test Reason Only\'');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber,
      caseTransactionsDataForUpdateRequiredRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForUpdateRequiredRefundOnResubmitRefund = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Update required', refundReference,
      'CoP-COP Reason...',
      'Probate Request Request', 'Test Reason Only');
    InitiateRefunds.verifyRefundDetailsPageForResubmitRefund(
      caseTransactionsDataForUpdateRequiredRefundOnResubmitRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // pause();
    InitiateRefunds.verifyReviewAndResubmitRefundPage(
      caseTransactionsDataForUpdateRequiredRefundOnResubmitRefund, 'Test Reason Only', true, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForSentBackRefundOnResubmitRefundAfterChange = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Update required', refundReference,
      'System/technical error', 'Probate Request Request', 'Test Reason Only');
    // console.log(`The value of the Case Transaction Data after Change on resubmit : ${JSON.stringify(caseTransactionsDataForSentBackRefundOnResubmitRefundAfterChange)}`);
    InitiateRefunds.verifyReviewAndResubmitRefundPage(
      caseTransactionsDataForSentBackRefundOnResubmitRefundAfterChange,
      'Test Reason Only', false, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReferenceFromResubmit = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    if (refundReference.trim() !== refundReferenceFromResubmit.trim()) {
      throw new
      RefundException(`The initial refundReference : ${refundReference.trim()} is not equals to the resubmitted refund reference : ${refundReferenceFromResubmit.trim()}`);
    }
    I.Logout();
  });

Scenario('Approve action a Refund Returned to Case Worker and Resubmit By Approver through the Refunds List Page @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourDetailsSummaryData = assertionData.checkYourDetailsSummary('', paymentReference, '£215.00', 'Payment by account',
      'Credit', 'Online', 'Success', 'string', 'PBAFUNC12345', 'string');
    InitiateRefunds.verifyPaymentDetailsPageSummarySection(checkYourDetailsSummaryData);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
    // console.log('The value of the check your answers ' + `${checkYourAnswersData.paymentReference}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(false, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[@class=\'paymentrequest\']//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyHelpWithFeesSectionOnPaymentDetailsPage(
      checkYourAnswersData, 'Service request');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddOrInitiateRefund(
      checkYourAnswersData, 'Retrospective remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£200.00',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request', 'Test Reason Only');
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPage(caseTransactionsData, 'Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundApprovedPage('Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.operateRefundsReturnedToCaseWorker(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    let caseTransactionsDataForSentBackRefundOnResubmitRefund = assertionData.getCaseTransactionsData(paymentReference, '£200.00',
      'Update required', refundReference,
      'Retrospective remission', 'Probate Request Request', 'Test Reason Only');
    // console.log(`The value of the Case Transaction Data after Change on resubmit : ${JSON.stringify(caseTransactionsDataForSentBackRefundOnResubmitRefund)}`);
    InitiateRefunds.verifyRefundDetailsPageForResubmitRefund(
      caseTransactionsDataForSentBackRefundOnResubmitRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewAndResubmitRefundPage(caseTransactionsDataForSentBackRefundOnResubmitRefund, 'Test Reason Only', true, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '15.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    caseTransactionsDataForSentBackRefundOnResubmitRefund = assertionData.getCaseTransactionsData(paymentReference, '£15.00',
      'Update required', refundReference,
      'Retrospective remission', 'Probate Request Request', 'Test Reason Only');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewAndResubmitRefundPage(caseTransactionsDataForSentBackRefundOnResubmitRefund, 'Test Reason Only', false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReferenceFromResubmit = await InitiateRefunds.verifyRefundSubmittedPage('15.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyRefundsListPageForCaseApproverPostApproverResubmission(refundReference);
    if (refundReference.trim() !== refundReferenceFromResubmit.trim()) {
      throw new
      RefundException(`The initial refundReference : ${refundReference.trim()} is not equals to the resubmitted refund reference : ${refundReferenceFromResubmit.trim()}`);
    }
    I.Logout();
  });

Scenario('Add a Remissions Apply for Refund and Process Refunds As an Approver from the Payment Details Page @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    logger.log(ccdCaseNumber);
    // console.info(ccdCaseNumber);
    logger.log(paymentReference);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourDetailsSummaryData = assertionData.checkYourDetailsSummary('', paymentReference, '£215.00', 'Payment by account',
      'Credit', 'Online', 'Success', 'string', 'PBAFUNC12345', 'string');
    InitiateRefunds.verifyPaymentDetailsPageSummarySection(checkYourDetailsSummaryData);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
    // //console.log('The value of the check your answers ' + `${checkYourAnswersData.paymentReference}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(false, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[@class=\'paymentrequest\']//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyHelpWithFeesSectionOnPaymentDetailsPage(
      checkYourAnswersData, 'Service request');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddOrInitiateRefund(
      checkYourAnswersData, 'Retrospective remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£200',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const caseTransactionsDataForSentForApprovalRefund = assertionData.getCaseTransactionsData(paymentReference, '£200.00',
      'Sent for approval', refundReference,
      'Retrospective remission', 'Probate Request Request', 'Refund initiated and sent to team leader');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsDataForSentForApprovalRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsDataForSentForApprovalRefund, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPage(caseTransactionsDataForSentForApprovalRefund, 'Reject');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundApprovedPage('Reject');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('Check Page Access for a Refund Requestor @pipeline @nightly',
  (I, InitiateRefunds) => {
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRefundsListPageForCaseWorker();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('Approve action a Refund Returned to Case Worker and Resubmit By Caseworker @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(`The value of the CCD Case Number : ${ccdCaseNumber}`);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£215.00',
      '0', '£0.00', '£0.00');
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Issue refund', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(
      ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'System/technical error', paymentReference, '£215', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasons(
      ccdCaseNumber, 'Other - CoP', 'COP Reason...');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'Other - CoP-COP Reason...', paymentReference, '£215', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    logger.log(refundReference);
    // console.log(`The value of the Refund Reference : ${refundReference}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsData = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request', 'Refund initiated and sent to team leader');
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPage(caseTransactionsData, 'Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundApprovedPage('Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    let caseTransactionsDataForSentBackRefundOnResubmitRefund = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Update required', refundReference,
      'CoP-COP Reason...', 'Probate Request Request', 'Test Reason Only');
    // console.log(`The value of the Case Transaction Data after Change on resubmit : ${JSON.stringify(caseTransactionsDataForSentBackRefundOnResubmitRefund)}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPageForResubmitRefund(
      caseTransactionsDataForSentBackRefundOnResubmitRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewAndResubmitRefundPage(caseTransactionsDataForSentBackRefundOnResubmitRefund, 'Test Reason Only', true, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasons(
      ccdCaseNumber, 'Other - CoP', 'COPReason-ResubmitRefund');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    caseTransactionsDataForSentBackRefundOnResubmitRefund = assertionData.getCaseTransactionsData(paymentReference, '£215.00',
      'Update required', refundReference,
      'Other - CoP-COPReason-ResubmitRefund', 'Probate Request Request', 'Test Reason Only');
    InitiateRefunds.verifyReviewAndResubmitRefundPage(caseTransactionsDataForSentBackRefundOnResubmitRefund, 'Other - CoP-COPReason-ResubmitRefund', false, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReferenceFromResubmit = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    if (refundReference.trim() !== refundReferenceFromResubmit.trim()) {
      throw new
      RefundException(`The initial refundReference : ${refundReference.trim()} is not equals to the resubmitted refund reference : ${refundReferenceFromResubmit.trim()}`);
    }
    I.Logout();
  });
