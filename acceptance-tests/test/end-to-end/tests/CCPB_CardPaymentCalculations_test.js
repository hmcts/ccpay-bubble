/* eslint-disable */
const stringUtils = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");
const cookieHelper = require("../helpers/cookie_helper");

Feature('CC Pay Bubble Card payment calculations test').retry(CCPBATConstants.defaultNumberOfRetries);

let totalAmount = '300.00';
let ccdCaseNumber;
let serviceRequestDetails;
let serviceRequestReference;

BeforeSuite(async () => {
  ccdCaseNumber = await apiUtils.createACCDCaseForProbate();
  serviceRequestDetails = await apiUtils.createAServiceRequest('ABA6', totalAmount, 'FEE0219', '7', 1, ccdCaseNumber);
  serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
});

Scenario('Card payment with failed transaction should have the correct calculations on the Case Transaction page',
  async ({ I, ServiceRequests, CaseSearch, CaseTransaction }) => {

    // Cancelled(failed) card payment 1
    const cardPaymentResponse1 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url1 = `${cardPaymentResponse1.next_url}`;

    I.amOnPage(next_url1);
    await cookieHelper.setCookiePreferences(I);
    I.waitForText('Enter card details', 5);
    I.click('Cancel payment');
    I.waitForText('Your payment has been cancelled', 5);
    I.click('Continue');
    I.see('Your card payment was unsuccessful.');
    I.click('Return to service request');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Sign in or create an account');

  }).tag('@serial @pipeline @nightly');

  Scenario('Card payment with declined transaction should have the correct calculations on the Case Transaction page',
    async ({ I, ServiceRequests, CaseSearch, CaseTransaction }) => {

    // declined(failed) card payment 2
    const cardPaymentResponse2 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url2 = `${cardPaymentResponse2.next_url}`;

    I.amOnPage(next_url2);
    await cookieHelper.setCookiePreferences(I);
    I.waitForText('Enter card details', 5);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const declinePaymentCardValues = assertionData.getPaymentCardValues('4000000000000002', '01',
      '26', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(declinePaymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyYourPaymentHasBeenDeclinedPage();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.see('Your card payment was unsuccessful.');
    I.click('Return to service request');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Sign in');

  }).tag('@serial @pipeline @nightly');

  Scenario('Card payment with success transaction should have the correct calculations on the Case Transaction page',
    async ({ I, ServiceRequests, CaseSearch, CaseTransaction }) => {

    // In the event the test is retried with a successful payment, then check if payment exists
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await cookieHelper.setCookiePreferences(I);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const caseAmountDue = await I.grabTextFrom('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[1]/div/table/tbody/tr/td[4]');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Proceed with payment flow only if payment not found
    if (caseAmountDue === '£300.00') {
      // Payment not found, proceed with payment flow
      // Successful card payment
      const cardPaymentResponse3 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
      const next_url3 = `${cardPaymentResponse3.next_url}`;

      I.amOnPage(next_url3);
      await cookieHelper.setCookiePreferences(I);
      I.waitForText('Enter card details', 5);
      ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£300.00');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      const paymentCardValues = assertionData.getPaymentCardValues('4444333322221111', '01',
        '26', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
        'Testcardpayment@mailnesia.com');
      ServiceRequests.populateCardDetails(paymentCardValues);
      I.wait(CCPBATConstants.twoSecondWaitTime);
      ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Confirm your payment', '£300.00');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      ServiceRequests.verifyConfirmYourPaymentPageCardDetails(paymentCardValues);
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      I.see('Payment successful');
      I.click('Return to service request');
    }

    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Sign in');

    // Validate Case Transactions details
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await cookieHelper.setCookiePreferences(I);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@serial @pipeline @nightly');
