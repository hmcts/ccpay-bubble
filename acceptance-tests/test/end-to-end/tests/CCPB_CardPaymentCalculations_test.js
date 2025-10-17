/* eslint-disable */
const stringUtils = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");

Feature('CC Pay Bubble Card payment calculations test').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Card payment with failed and success transaction should have the correct calculations on the Case Transaction page',
  async ({ I, ServiceRequests, CaseSearch, CaseTransaction }) => {

    const totalAmount = '300.00';
    const ccdCaseNumber = await apiUtils.createACCDCaseForProbate();

    const serviceRequestDetails = await apiUtils.createAServiceRequest('ABA6', totalAmount, 'FEE0219', '7', 1, ccdCaseNumber);
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;

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
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Sign in or create an account');

    // declined(failed) card payment 2
    const cardPaymentResponse2 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url2 = `${cardPaymentResponse2.next_url}`;

    I.amOnPage(next_url2);
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
    I.wait(CCPBATConstants.fortySecondWaitTime);

    // successful card payment
    const cardPaymentResponse3 = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url3 = `${cardPaymentResponse3.next_url}`;

    I.amOnPage(next_url3);
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
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Sign in');

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');
