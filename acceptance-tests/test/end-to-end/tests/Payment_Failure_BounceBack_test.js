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

const successResponse = 202;

// const successResponse = 202;
function RefundException(message) {
  this.message = message;
  this.name = 'Assertion Error';
}

Feature('CC Pay Bubble Acceptance Tests payment failure for Bounceback and Chargeback').retry(CCPBATConstants.defaultNumberOfRetries);

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

Scenario('Payment Failure for Bounceback @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, 
    PaymentHistory, FailureEventDetails) => {
    const totalAmount = 593;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA07', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    const paymentRef = await bulkScanApiCalls.getPaymentReferenceUsingCCDCaseNumber(ccdCaseNumber);
    console.log('**** payment ref - ' + paymentRef);
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistoryTable();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPageForBounceBack();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistoryInitiatedForBounceBack();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPageForInitiatedEventForBounceBack();
  }).tag('@pipeline @nightly');

Scenario('Payment Failure for chargeback @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails) => {

    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRef = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRef);
    const requestBody = await bulkScanApiCalls.getPaymentDetailsPBA(ccdCaseNumber, paymentRef);
    console.log('**** payment ref - ' + requestBody.failure_reference);
    console.log('**** reason - ' + requestBody.reason);
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistory();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPage();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistoryInitiated();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPageForInitiatedEvent();
  }).tag('@pipelines @nightly');

  Scenario('Payment Failure for chargeback with Service Request Calculation @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails) => {

    const paymentDetails = await bulkScanApiCalls.createAPBAPayment();
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRef = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRef);
    const requestBody = await bulkScanApiCalls.getPaymentDetailsPBAForServiceStatus(ccdCaseNumber, paymentRef);
    console.log('**** payment ref - ' + requestBody.failure_reference);
    console.log('**** reason - ' + requestBody.reason);
    I.login(testConfig.TestDivorceCaseWorkerUserName, testConfig.TestDivorceCaseWorkerPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.verifyServiceRequestStatus();
  }).tag('@pipeline @nightly');