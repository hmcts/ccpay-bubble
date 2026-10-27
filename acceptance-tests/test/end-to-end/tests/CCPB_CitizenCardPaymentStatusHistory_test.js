/* eslint-disable */
const stringUtils = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");

Feature('CC Pay Bubble Card payment calculations test').retry(CCPBATConstants.defaultNumberOfRetries);

let totalAmount = '300.00';

Scenario('Citizen Card payment with success transaction should have the correct calculations on the Case Transaction page',
  async ({ I, CardPayments, CaseSearch, CaseTransaction, PaymentHistory }) => {

    const ccdCaseNumber = await apiUtils.createACCDCaseForProbate();
    const cardPaymentResponse = await apiUtils.initiateCardPaymentForCitizen(ccdCaseNumber, "PROBATE", "FEE0219", totalAmount, "8", 1, "ABA6");
    const govPayLink = `${cardPaymentResponse._links.next_url.href}`;

    I.amOnPage(govPayLink);
    I.waitForText('Enter card details', 5);
    CardPayments.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const paymentCardValues = assertionData.getPaymentCardValues('4444333322221111', '01',
      '30', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    CardPayments.populateCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    CardPayments.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Confirm your payment', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    CardPayments.verifyConfirmYourPaymentPageCardDetails(paymentCardValues);

    // Redirect to Citizen login page after successful payment (Usually Confirmation page hosted by citizen service)
    I.waitForText('Sign in', CCPBATConstants.tenSecondWaitTime);

    // Validate Case Transactions details
    await I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    const caseAmountDue = await I.grabTextFrom('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[1]/div/table/tbody/tr/td[4]');
    // Need some refresh here to get the correct status of the payment in case transactions page
    if (caseAmountDue === '£300.00') {
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      await PaymentHistory.validateSuccessPaymentStatusHistoryDetails('Success', '300.00');
      I.click('//a[.=\'Back\']');
    }
    I.waitForText('Success', CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
  }).tag('@serial @pipeline @nightly');
