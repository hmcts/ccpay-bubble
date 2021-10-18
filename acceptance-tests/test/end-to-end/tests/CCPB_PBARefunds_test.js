const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');

// eslint-disable-next-line no-unused-vars
const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds_test.js');
const successResponse = 202;

// const successResponse = 202;
function RefundException(message) {
  this.message = message;
  this.name = 'Assertion Error';
}

function checkYourAnswers(paymentReference, hwfReferenceCode, refundAmount) {
  const checkYourAnswersData = {
    paymentReference: `${paymentReference}`,
    paymentAmount: '£215.00',
    paymentStatus: 'Success',
    feeCode: 'FEE0226',
    feeDescription: 'FEE0226 - Personal Application for grant of Probate',
    hwfReference: `${hwfReferenceCode}`,
    refundAmount: `${refundAmount}`
  };
  return checkYourAnswersData;
}

function getCaseTransactionsData(
  paymentReference, refundAmount, refundStatus, refundReference, refundReason, refundSubmittedBy) {
  // console.log('Inside caseTransactionsData()');
  const caseTransactionsData = {
    paymentReference: `${paymentReference}`,
    paymentAmount: '£215.00',
    totalRemissions: `${refundAmount}`,
    refundAmount: `${refundAmount}`,
    unallocatedPayments: '0',
    amountDue: '£0.00',
    refundStatus: `${refundStatus}`,
    refundReference: `${refundReference}`,
    refundReason: `${refundReason}`,
    refundSubmittedBy: `${refundSubmittedBy}`
  };
  // console.log(`The value of the caseTransactionsData()${JSON.stringify(caseTransactionsData)}`);
  return caseTransactionsData;
}

Feature('CC Pay Bubble Acceptance Tests For Refunds and Remissions').retry(CCPBATConstants.retryScenario);

BeforeSuite(async I => {
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Disabled CCD validation');
  }
});

/* AfterSuite(async I => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Enabled CCD validation');
  }
});*/

/* Scenario.skip('Refund a Successful PBA Payment through the Payments',
  async (I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    //console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment('90.00');
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    //console.info(ccdCaseNumber);
    //console.info(paymentReference);
    //console.log('The length of the CCD Case Number ' + ccdCaseNumber.toString().length);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    await miscUtils.multipleSearchForRefunds(CaseSearch, I, ccdCaseNumber)
    CaseTransaction.validateCaseTransactionPageForRefunds();
    I.wait(5);
    I.click("//div[3]//a[.='Review']");
    I.wait(5);
    InitiateRefunds.verifyPaymentDetailsPage('Issue refund');
    pause();
  });*/

Scenario('Add a Remissions and Add Refunds for a Successful PBA Payment through the Payments',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // The various change options....
    const checkYourAnswersData = checkYourAnswers(
      paymentReference, 'HWF-A1B-23C', '200.00');
    // console.log(`The value of the paymentReference : ${checkYourAnswersData.paymentReference}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, true, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23A');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersDataAfterHWFCodeChange = checkYourAnswers(
      paymentReference, 'HWF-A1B-23A', '200.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersDataAfterHWFCodeChange, false, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '115.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersDataAfterAmount = checkYourAnswers(
      paymentReference, 'HWF-A1B-23A', '115.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(
      checkYourAnswersDataAfterAmount, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(true, '115.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('115.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£115.00',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData);
    /* I.wait(CCPBATConstants.twoSecondWaitTime);
    pause();
    I.click('//div[3]//a[.=\'Review\']');
    InitiateRefunds.verifyNoAddRemissionOnPaymentDetailsPage();*/
    logger.info('Test Completed....');
    I.Logout();
  });

Scenario('Add a Remissions through Payments and Add Refunds for a Successful PBA Payment through the Service Request page',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyServiceRequestPage('Add remission', 'Personal Application for grant of Probate', '£215');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = checkYourAnswers(paymentReference,
      'HWF-A1B-23C', '200.00');
    // console.log(`The value of the paymentReference : ${checkYourAnswersData.paymentReference}`);
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
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = getCaseTransactionsData(
      paymentReference, '£200', 'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData);
    /* I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[3]//a[.=\'Review\']');
    InitiateRefunds.verifyNoAddRemissionOnPaymentDetailsPage();
    logger.info('Test Completed....');*/
    I.Logout();
  });

Scenario('Add a Remissions through Payments and Add Refunds for a Successful PBA Payment through the Payment Details page',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£200',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData);
    /* I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[3]//a[.=\'Review\']');
    InitiateRefunds.verifyNoAddRemissionOnPaymentDetailsPage();
    logger.info('Test Completed....');*/
    I.Logout();
  });

Scenario.skip('Add a Remissions for a failed Payment',
  async(I, CaseSearch, CaseTransaction) => {
    logger.log('Starting the PBA Payment');
    // console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAFailedPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    // const paymentReference = `${paymentDetails.paymentReference}`;
    // console.info(ccdCaseNumber);
    // console.info(paymentReference);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
  });

Scenario('Issue a Refund for a PBA Payment through the Payment Details Page',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
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
    InitiateRefunds.verifyCheckYourAnswersPageForIssueRefund(
      'COP Reason...', paymentReference, '£215', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData);
    I.Logout();
  });

Scenario('Issue a Refund for a PBA Payment through the Service Request Page',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData);
    I.Logout();
  });

Scenario('Approve action a  Refund for a Rejection',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
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
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request');
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForRejectedRefund = getCaseTransactionsData(paymentReference, '£215.00',
      'Rejected', refundReference, 'CoP-COP Reason...', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsDataForRejectedRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('Approve action a  Refund for an Approval',
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
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
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
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request');
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('approveraattest1@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewRefundsDetailsPage(caseTransactionsData, 'Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundApprovedPage('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForApprovedRefund = getCaseTransactionsData(paymentReference, '£215.00',
      'Sent to middle office', refundReference,
      'CoP-COP Reason...', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber,
      caseTransactionsDataForApprovedRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('Approve action a Refund Returned to Case Worker and Resubmit By Case Worker',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
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
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£215.00',
      'Sent for approval', refundReference, 'CoP-COP Reason...', 'Probate Request Request');
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
    I.Logout();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForSentBackRefund = getCaseTransactionsData(paymentReference, '£215.00',
      'Sent back', refundReference,
      'CoP-COP Reason...',
      'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber,
      caseTransactionsDataForSentBackRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForSentBackRefundOnResubmitRefund = getCaseTransactionsData(paymentReference, '£215.00',
      'Sentback', refundReference,
      'CoP-COP Reason...',
      'Probate Request Request');
    InitiateRefunds.verifyRefundDetailsPageForResubmitRefund(
      caseTransactionsDataForSentBackRefundOnResubmitRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewAndResubmitRefundPage(
      caseTransactionsDataForSentBackRefundOnResubmitRefund, 'Test Reason Only', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, 'System/technical error');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForSentBackRefundOnResubmitRefundAfterChange = getCaseTransactionsData(paymentReference, '£215.00',
      'Sentback', refundReference,
      'System/technical error', 'Probate Request Request');
    // console.log(`The value of the Case Transaction Data after Change on resubmit : ${JSON.stringify(caseTransactionsDataForSentBackRefundOnResubmitRefundAfterChange)}`);
    InitiateRefunds.verifyReviewAndResubmitRefundPage(
      caseTransactionsDataForSentBackRefundOnResubmitRefundAfterChange,
      'Test Reason Only', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReferenceFromResubmit = await InitiateRefunds.verifyRefundSubmittedPage('215.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    if (refundReference.trim() !== refundReferenceFromResubmit.trim()) {
      throw new
      RefundException(`The initial refundReference : ${refundReference.trim()} is not equals to the resubmitted refund reference : ${refundReferenceFromResubmit.trim()}`);
    }
    I.Logout();
  });

Scenario.skip('Approve action a Refund Returned to Case Worker and Resubmit By Approver(TODO - As the XPATH for Elements on the Refunds List Page does not work)',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
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
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£200.00',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request');
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
    const caseTransactionsDataForSentBackRefundOnResubmitRefund = getCaseTransactionsData(paymentReference, '£200.00',
      'Sentback', refundReference,
      'Retrospective remission', 'Probate Request Request');
    // console.log(`The value of the Case Transaction Data after Change on resubmit : ${JSON.stringify(caseTransactionsDataForSentBackRefundOnResubmitRefund)}`);
    InitiateRefunds.verifyRefundDetailsPageForResubmitRefund(
      caseTransactionsDataForSentBackRefundOnResubmitRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyReviewAndResubmitRefundPage(caseTransactionsDataForSentBackRefundOnResubmitRefund, 'Test Reason Only', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('Add a Remissions Apply for Refund and Process Refunds As an Approver from the Payment Details Page',
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Takes you to the Payment Details Page...
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
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
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£200',
      'Sent for approval', refundReference, 'Retrospective remission', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData);
    /* I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[3]//a[.=\'Review\']');
    InitiateRefunds.verifyNoAddRemissionOnPaymentDetailsPage();
    logger.info('Test Completed....');*/
    I.Logout();
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const caseTransactionsDataForSentForApprovalRefund = getCaseTransactionsData(paymentReference, '£200.00',
      'Sent for approval', refundReference,
      'Retrospective remission', 'Probate Request Request');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(
      ccdCaseNumber, caseTransactionsDataForSentForApprovalRefund);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsDataForSentForApprovalRefund);
    // pause();
  });
