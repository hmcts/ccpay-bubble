/* eslint-disable */
const stringUtils = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");

Feature('CC Pay Bubble Card payment calculations test');

let totalAmount = '300.00';

async function searchCaseTransactionsWithRecovery(I, CaseSearch, caseNumber) {
  await I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
  await miscUtils.multipleSearch(CaseSearch, I, caseNumber, {
    maxSearchAttempts: 7,
    onRetryableError: async () => {
      I.clearCookie();
      await I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    }
  });
}

// Each scenario also has to own the browser session. A scenario that fails before
// its Logout, or a retry that starts mid-flow, otherwise leaves a signed-in
// session behind, and the next scenario then sees a logged-in post-payment
// redirect instead of the IDAM sign-in page it waits for.
async function resetBrowserSession(I) {
  if (await I.grabNumberOfVisibleElements('//*[normalize-space()="Logout"]')) {
    await I.Logout();
  }
  I.clearCookie();
}

const scenarioSetupAttempts = 3;
const scenarioSetupRetryWaitMs = CCPBATConstants.thirtySecondWaitTime * 1000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Every scenario owns its CCD case and service request. A shared BeforeSuite case
// meant each retry stacked another payment onto the same case, so the positional
// Review lookups below pointed at a previous attempt's payment from the second
// attempt onwards. CodeceptJS never retries hooks, so the retry loop has to run
// here in the scenario body rather than in a suite hook.
async function createTestCaseAndServiceRequest() {
  let lastError;

  for (let attempt = 1; attempt <= scenarioSetupAttempts; attempt++) {
    try {
      const ccdCaseNumber = await apiUtils.createACCDCaseForProbate();
      const serviceRequestDetails = await apiUtils.createAServiceRequest('ABA6', totalAmount, 'FEE0219', '7', 1, ccdCaseNumber);

      return {
        ccdCaseNumber,
        serviceRequestReference: `${serviceRequestDetails.serviceRequestReference}`
      };
    } catch (error) {
      lastError = error;
      console.log(`Scenario setup attempt ${attempt} of ${scenarioSetupAttempts} failed: ${error.message}`);

      if (attempt < scenarioSetupAttempts) {
        await sleep(scenarioSetupRetryWaitMs);
      }
    }
  }

  throw lastError;
}

Scenario('Card payment with failed transaction should have the correct calculations on the Case Transaction page and failure details should be captured in payment status history',
  async ({ I, PaymentHistory, CaseSearch, CaseTransaction }) => {

    await resetBrowserSession(I);

    const { ccdCaseNumber, serviceRequestReference } = await createTestCaseAndServiceRequest();

    // Cancelled(failed) card payment 1
    const cardPaymentResponse1 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url1 = `${cardPaymentResponse1.next_url}`;

    I.amOnPage(next_url1);
    I.waitForText('Enter card details', 5);
    I.click('Cancel payment');
    I.waitForText('Your payment has been cancelled', 5);
    I.click('Continue');
    I.see('Your card payment was unsuccessful.');
    I.click('Return to service request');
    // The page reached after returning from a cancelled payment is a paybubble/IDAM
    // redirect that intermittently renders blank, so do not assert on it here. The
    // search below re-navigates and authenticates via I.login.

    // Validate Case Transactions details and payment status history for failed payments
    await searchCaseTransactionsWithRecovery(I, CaseSearch, ccdCaseNumber);
    await CaseTransaction.validateCaseTransactionsDetails('0.00', '0', '0.00', '300.00', '0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await PaymentHistory.validateFailedPaymentStatusHistoryDetails('Failed', '300.00', 'Payment was cancelled by the user');

    await I.Logout();
    I.clearCookie();
  }).retry(CCPBATConstants.defaultNumberOfRetries).tag('@serial @pipeline @nightly');

  Scenario('Card payment with declined transaction should have the correct calculations on the Case Transaction page and failure details should be captured in payment status history',
    async ({ I, ServiceRequests, CaseSearch, CaseTransaction, PaymentHistory }) => {

    await resetBrowserSession(I);

    const { ccdCaseNumber, serviceRequestReference } = await createTestCaseAndServiceRequest();

    // declined(failed) card payment 2
    const cardPaymentResponse2 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url2 = `${cardPaymentResponse2.next_url}`;

    I.amOnPage(next_url2);
    I.waitForText('Enter card details', 5);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const declinePaymentCardValues = assertionData.getPaymentCardValues('4000000000000002', '01',
      '30', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(declinePaymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyYourPaymentHasBeenDeclinedPage();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.see('Your card payment was unsuccessful.');
    I.click('Return to service request');

    // Validate Case Transactions details and payment status history for failed payments
    await searchCaseTransactionsWithRecovery(I, CaseSearch, ccdCaseNumber);
    await CaseTransaction.validateCaseTransactionsDetails('0.00', '0', '0.00', '300.00', '0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await PaymentHistory.validateFailedPaymentStatusHistoryDetails('Failed', '300.00', 'Payment method rejected');

    await I.Logout();
    I.clearCookie();
    }).retry(CCPBATConstants.defaultNumberOfRetries).tag('@serial @pipeline @nightly');

  Scenario('Card payment with success transaction should have the correct calculations on the Case Transaction page',
    async ({ I, ServiceRequests, CaseSearch, CaseTransaction }) => {

    await resetBrowserSession(I);

    const { ccdCaseNumber, serviceRequestReference } = await createTestCaseAndServiceRequest();

    // Successful card payment. The case is created by this attempt, so the amount due
    // is always outstanding and the payment flow always runs.
    const cardPaymentResponse3 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url3 = `${cardPaymentResponse3.next_url}`;

    I.amOnPage(next_url3);
    I.waitForText('Enter card details', 5);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const paymentCardValues = assertionData.getPaymentCardValues('4444333322221111', '01',
      '30', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Confirm your payment', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyConfirmYourPaymentPageCardDetails(paymentCardValues);
    I.waitForText('Payment successful', CCPBATConstants.tenSecondWaitTime);
    I.click('Return to service request');

    I.waitForText('Sign in', CCPBATConstants.tenSecondWaitTime);

    // Validate Case Transactions details
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await searchCaseTransactionsWithRecovery(I, CaseSearch, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).retry(CCPBATConstants.defaultNumberOfRetries).tag('@serial @pipeline @nightly');
