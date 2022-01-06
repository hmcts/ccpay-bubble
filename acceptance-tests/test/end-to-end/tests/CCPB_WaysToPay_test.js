const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');

// eslint-disable-next-line no-unused-vars
const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const {Logger} = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds.js');

const name = require('../content/multiple_pba.json');

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

Feature('CC Pay Bubble Acceptance Tests For the Ways To Pay feature').retry(CCPBATConstants.retryScenario);

BeforeSuite(async I => {
  // console.log('Before Suite');
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  // console.log('After Response');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Disabled CCD validation');
  }
});

/*
AfterSuite(async I => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Enabled CCD validation');
  }
});
*/

Scenario('A Service Request for a Case Worker @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6')
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageForRefunds(ccdCaseNumber, true);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,'','£100.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,'','£100.00', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    //ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,'','£100.00');
    I.Logout();
  });

Scenario.only('A Service Request for a Solicitor @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6')
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    console.log(name); // output 'testing'
    I.login('testways2payuser1@mailnesia.com', 'Testing1234');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber, true);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,'','£100.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,'','£100.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    //ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,'','£100.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[contains(.,\'Pay now\')]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£100');
    //pause();
    I.Logout();
  });

