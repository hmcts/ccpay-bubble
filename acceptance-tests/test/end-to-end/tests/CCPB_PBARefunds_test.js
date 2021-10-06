const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');

// eslint-disable-next-line no-unused-vars
const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds_test.js');
const successResponse = 202;

// const successResponse = 202;

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
    console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment('90.00');
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    console.info(ccdCaseNumber);
    console.info(paymentReference);
    console.log('The length of the CCD Case Number ' + ccdCaseNumber.toString().length);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    await miscUtils.multipleSearchForRefunds(CaseSearch, I, ccdCaseNumber)
    CaseTransaction.validateCaseTransactionPageForRefunds();
    I.wait(5);
    I.click("//div[3]//a[.='Review']");
    I.wait(5);
    InitiateRefunds.verifyPaymentDetailsPage('Issue refund');
    pause();
  });*/

Scenario.skip('Add a Remissions and Add Refunds for a Successful PBA Payment through the Payments',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment('90.00');
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    console.info(ccdCaseNumber);
    console.info(paymentReference);
    console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');

    // The various change options....
    const checkYourAnswersData = checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
    console.log('The value of the check your answers ' + `${checkYourAnswersData.paymentReference}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, true, false);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23A');
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    const checkYourAnswersDataAfterHWFCodeChange = checkYourAnswers(paymentReference, 'HWF-A1B-23A', '200.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersDataAfterHWFCodeChange, false, true);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '115.00');
    const checkYourAnswersDataAfterAmount = checkYourAnswers(paymentReference, 'HWF-A1B-23A', '115.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersDataAfterAmount, false, false);

    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(true, '115.00');
    InitiateRefunds.verifyRefundSubmittedPage('115.00');
  });

Scenario.skip('Add a Remissions through Payments and Add Refunds for a Successful PBA Payment through the Payment Details',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment('90.00');
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    console.info(ccdCaseNumber);
    console.info(paymentReference);
    console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.click('//div[3]//a[.=\'Review\']');
    I.wait(5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');

    // The various change options....
    const checkYourAnswersData = checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
    console.log('The value of the check your answers ' + `${checkYourAnswersData.paymentReference}`);
    I.wait(2);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);

    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(false, '200.00');
    I.click('//div[3]//a[.=\'Review\']'); // Takes you to the Payment Details page
    InitiateRefunds.verifyHelpWithFeesSectionOnPaymentDetailsPage(checkYourAnswersData, 'Payment details');
    InitiateRefunds.verifyCheckYourAnswersPageForAddOrInitiateRefund(checkYourAnswersData, 'Retrospective remission');
    InitiateRefunds.verifyRefundSubmittedPage('200.00');
  });

Scenario('Add a Remissions through Payments and Add Refunds for a Successful PBA Payment through the Service Requests',
  async(I, CaseSearch, CaseTransaction, InitiateRefunds) => {
    // logger.log('Starting the PBA Payment');
    console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment('90.00');
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    console.info(ccdCaseNumber);
    console.info(paymentReference);
    console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[3]//a[.=\'Review\']'); // Takes you to the Service Request Page...
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = checkYourAnswers(paymentReference, 'HWF-A1B-23C', '200.00');
    console.log('The value of the check your answers ' + `${checkYourAnswersData.paymentReference}`);
    pause();
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Adding a Remission Finally and Submitting the Refund Request.
    InitiateRefunds.verifyRemissionAddedPage(false, '200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//div[@class=\'paymentrequest\']//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyHelpWithFeesSectionOnPaymentDetailsPage(checkYourAnswersData, 'Service request');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForAddOrInitiateRefund(checkYourAnswersData, 'Retrospective remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    console.log(`The Refund Reference :${refundReference}`);
    const caseTransactionsData = getCaseTransactionsData(paymentReference, '£200',
      'Sent for approval', refundReference, 'Retrospective remission');
    CaseTransaction.validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber, caseTransactionsData);
    I.click('//ccpay-refund-status[1]//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyRefundDetailsPage(caseTransactionsData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    pause();
  });


/* Scenario.skip('Refund a Successful PBA Payment through the Service Requests', async I => {

  logger.log('Starting the PBA Payment');
  const ccdCaseNumber = await bulkScanApiCalls.createAPBAPayment('90.00');
  logger.log(`CCD Case Number : ${ccdCaseNumber}`);

  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  await miscUtils.multipleSearch(CaseSearch, I, ccd_case_number);
  InitiateRefunds.issueRefundJourney('Payments');
});

Scenario.skip('Refund List Page and Review Refund Journey', async I => {
  logger.log('Starting the PBA Payment');
  const ccdCaseNumber = await bulkScanApiCalls.createAPBAPayment('90.00');
  logger.log(`CCD Case Number : ${ccdCaseNumber}`);

  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  await miscUtils.multipleSearch(CaseSearch, I, ccd_case_number);
  const refundReference = InitiateRefunds.issueRefundJourney();
  RefundsList.reviewRefundJourney(refundReference);
});

Scenario.skip('Refund List Page and Approver Journey', async I => {
  logger.log('Starting the PBA Payment');
  const ccdCaseNumber = await bulkScanApiCalls.createAPBAPayment('90.00');
  logger.log(`CCD Case Number : ${ccdCaseNumber}`);

  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  await miscUtils.multipleSearch(CaseSearch, I, ccd_case_number);
  const refundReference = InitiateRefunds.issueRefundJourney();
  RefundsList.approveRefundJourney(refundReference);
});*/

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

function getCaseTransactionsData(paymentReference, refundAmount, refundStatus, refundReference, refundReason) {
  console.log('Inside caseTransactionsData()');
  const caseTransactionsData = {
    paymentReference: `${paymentReference}`,
    paymentAmount: '£215.00',
    totalRemissions: `${refundAmount}`,
    refundAmount: `${refundAmount}`,
    unallocatedPayments: '0',
    amountDue: '£0.00',
    refundStatus: `${refundStatus}`,
    refundReference: `${refundReference}`,
    refundReason: `${refundReason}`
  };
  console.log(`The value of the caseTransactionsData()${JSON.stringify(caseTransactionsData)}`);
  return caseTransactionsData;
}
