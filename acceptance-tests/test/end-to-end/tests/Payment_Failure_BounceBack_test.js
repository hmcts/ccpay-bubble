/* eslint-disable no-alert, no-console */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');

const bulkScanApiCalls = require('../helpers/utils');

const {Logger} = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds_test.js');

const testConfig = require('./config/CCPBConfig');

Feature('CC Pay Bubble Acceptance Tests payment failure for Bounceback and Chargeback').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Payment Failure for Bounceback SR status Paid',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails }) => {
    const totalAmount = 612;
    const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    const paymentRefResult = await bulkScanApiCalls.getPaymentReferenceUsingCCDCaseNumber(ccdCaseNumber, dcnNumber);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twentySecondWaitTime);
    console.log("the payment rc ref and date and failure ref are - "
      + paymentRefResult[0] + 'and' + paymentRefResult[2] + 'and' + paymentRefResult[1]);
    await CaseTransaction.verifyDisputedPaymentHistoryTable(paymentRefResult[0], paymentRefResult[2]);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPageForBounceBack(paymentRefResult[0],
      paymentRefResult[1], paymentRefResult[2]);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistoryInitiatedForBounceBack();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPageForInitiatedEventForBounceBack(paymentRefResult[0],
      paymentRefResult[1], paymentRefResult[2]);
  }).tag('@pipeline @nightly');

Scenario('Payment Failure for chargeback SR status Partially Paid',
  async ({ I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails }) => {

    const paymentDetails = await bulkScanApiCalls.createAPBAPayment(215, 'FEE0226', '3', 1);
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRefResult = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRefResult);
    const requestBody = await bulkScanApiCalls.getPaymentDetailsPBA(ccdCaseNumber, paymentRefResult);
    console.log("the payment rc ref and date and failure ref are - "
      + paymentRefResult[0] + 'and' + paymentRefResult[2] + 'and' + paymentRefResult[1]);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twentySecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistory(paymentRefResult[0], paymentRefResult[2]);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPage(paymentRefResult[0],
      paymentRefResult[1], paymentRefResult[2]);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistoryInitiated();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await FailureEventDetails.verifyFailureDetailsPageForInitiatedEvent(paymentRefResult[0],
      paymentRefResult[1], paymentRefResult[2]);
  }).tag('@pipeline @nightly');

Scenario('Payment Failure for chargeback SR status Not Paid',
  async ({ I, CaseSearch, CaseTransaction }) => {

    const paymentDetails = await bulkScanApiCalls.createAPBAPayment(215, 'FEE0226', '3', 1);
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRefResult = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRefResult);
    const requestBody = await bulkScanApiCalls.getPaymentDetailsPBAForChargebackEvent(ccdCaseNumber, paymentRefResult);
    console.log("the payment rc ref and date and failure ref are - "
      + paymentRefResult[0] + 'and' + paymentRefResult[2] + 'and' + paymentRefResult[1]);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twentySecondWaitTime);
    await CaseTransaction.verifyDisputedPaymentHistoryEvent(paymentRefResult[0], paymentRefResult[2]);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');

Scenario('Payment Failure for chargeback with SR status Disputed',
  async ({ I, CaseSearch, CaseTransaction }) => {

    const paymentDetails = await bulkScanApiCalls.createAPBAPayment(215, 'FEE0226', '3', 1);
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRefResult = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRefResult);
    const requestBody = await bulkScanApiCalls.getPaymentDetailsPBAForServiceStatus(ccdCaseNumber, paymentRefResult);
    console.log('**** payment ref - ' + requestBody.failure_reference);
    console.log('**** reason - ' + requestBody.reason);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.twentySecondWaitTime);
    await CaseTransaction.verifyServiceRequestStatus();
  }).tag('@pipeline @nightly');

