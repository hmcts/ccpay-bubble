/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
'use strict';
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {

  locators: {
    pba_account_number_select: { xpath: '//select[@id=\'pbaAccountNumber\']' },
    pba_reference_text_field: { xpath: '//input[@id=\'pbaAccountRef\']' },
    card_number_text_field: { xpath: '//input[@id=\'card-no\']' },
    card_expiry_month_text_field: { xpath: '//input[@id=\'expiry-month\']' },
    card_expiry_year_text_field: { xpath: '//input[@id=\'expiry-year\']' },
    card_cvc_text_field: { xpath: '//input[@id=\'cvc\']' },
    card_name_text_field: { xpath: '//input[@id=\'cardholder-name\']' },
    card_address_line_1_text_field: { xpath: '//input[@id=\'address-line-1\']' },
    card_address_line_2_text_field: { xpath: '//input[@id=\'address-line-2\']' },
    card_address_city_text_field: { xpath: '//input[@id=\'address-city\']' },
    card_address_postcode_text_field: { xpath: '//input[@id=\'address-postcode\']' },
    card_email_text_field: { xpath: '//input[@id=\'email\']' }
  },

  async getHeaderValue() {
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  verifyServiceRequestNotFoundErrorPage(isCaseWorker) {

    I.see('If you are expecting to pay and are not');
    I.see('able to see a service request');
    I.see('please refresh and try in some time.');
    if (isCaseWorker === true) {
      I.see('Refunds');
      I.see('No refunds recorded');
    }
  },

  verifyYourPaymentHasBeenDeclinedPage() {
    I.see('Your payment has been declined');
    I.see('No money has been taken from your account. Contact your');
    I.see('bank for more details.');
    I.click('Continue');
  },

  verifyConfirmYourPaymentPageCardDetails(paymentCardValues) {
    I.see('Card number');
    I.see('●●●●●●●●●●●');
    I.see('Expiry date');
    I.see(
      `${paymentCardValues.expiryMonth}/${paymentCardValues.expiryYear}`);
    I.see('Name on card');
    I.see(`${paymentCardValues.name}`);
    I.see('Billing address');
    // console.log(`${paymentCardValues.houseNumber}, ${paymentCardValues.addressLine}, ${paymentCardValues.townOrCity}, ${paymentCardValues.postcode}, United`);
    I.see(`${paymentCardValues.houseNumber}`);
    I.see(`${paymentCardValues.addressLine}`);
    I.see(`${paymentCardValues.townOrCity}`);
    I.see(`${paymentCardValues.postcode}`);
    I.see('United');
    I.see('Kingdom');
    I.see('Confirmation email');
    I.see(`${paymentCardValues.email}`);
    I.click('//button[@id=\'confirm\']');
  },

  verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage(pageTitle, paymentAmount) {
    I.see(`${pageTitle}`);
    I.see('Payment summary');
    I.see('card payment');
    I.see('Total amount:');
    I.see(`${paymentAmount}`);
  },

  populateCardDetails(paymentCardValues) {
    I.fillField(this.locators.card_number_text_field, `${paymentCardValues.cardNumber}`);
    I.fillField(this.locators.card_expiry_month_text_field, `${paymentCardValues.expiryMonth}`);
    I.fillField(this.locators.card_expiry_year_text_field, `${paymentCardValues.expiryYear}`);
    I.fillField(this.locators.card_cvc_text_field, `${paymentCardValues.cvc}`);
    I.fillField(this.locators.card_name_text_field, `${paymentCardValues.name}`);
    I.fillField(this.locators.card_address_line_1_text_field, `${paymentCardValues.houseNumber}`);
    I.fillField(this.locators.card_address_line_2_text_field, `${paymentCardValues.addressLine}`);
    I.fillField(this.locators.card_address_city_text_field, `${paymentCardValues.townOrCity}`);
    I.fillField(this.locators.card_address_postcode_text_field, `${paymentCardValues.postcode}`);
    I.fillField(this.locators.card_email_text_field, `${paymentCardValues.email}`);
    I.click('//button[@id=\'submit-card-details\']');
  },

  verifyServiceRequestTabPage(paymentStatus, serviceRequestReference, feeDescription, feeAmount, financeManagerFlag) {
    I.see('Status');
    I.see('Amount');
    I.see('Party');
    I.see('Request reference');
    I.see('Review');
    if (financeManagerFlag === false) {
      I.dontSee('Pay now');
    } else {
      I.see('Pay now');
    }
    I.see(`${paymentStatus}`);
    I.see(`${feeAmount}`);
    I.see(`${serviceRequestReference}`);
  },

  verifyNotEnoughFundsPage() {
    I.see('There is a problem');
    I.see('You don\'t have enough funds in your PBA account to pay for this fee.');
    I.see('If you have already topped up your PBA account, wait up to 24 hours for the new balance to');
    I.see('become available.');
    I.see('Should you need any further advice');
    I.see('Email MiddleOffice.DDservices@liberata.com or call 01633 652 125 (option 3)');
    I.see('to try to fix the issue.');
    I.see('you can also pay by credit or debit card.');
  },

  verifyPBAPaymentErrorPage(pbaAccountNumber, errorMessage) {
    I.see('There is a problem');
    I.see(`Your PBA account (${pbaAccountNumber}) ${errorMessage}`);
    I.see('Should you need any further advice');
    I.see('Email MiddleOffice.DDservices@liberata.com or call 01633 652 125 (option 3)');
    I.see('to try to fix the issue.');
    I.see('you can also pay by credit or debit card.');
    I.click('Pay by card');
  },

  verifyServiceRequestPage(paymentStatus, serviceRequestReference, feeDescription, feeAmount) {
    I.see('Service request');
    I.see('Status');
    I.see(`${paymentStatus}`);
    I.see('Service request reference');
    I.see(`${serviceRequestReference}`);
    I.see('Date created');
    I.see('CCD event');
    I.see('Fee');
    // I.see(feeDescription);
    I.see('Amount');
    I.see(`1 X ${feeAmount}`);
    I.see('Total');
    I.see(`${feeAmount}`);
    I.see(`Total fees: ${feeAmount}`);
  },

  verifyNoPBAFoundPage() {
    // I.see('You don'/'t have a registered PBA.');
    I.see('Pay by credit or debit card');
    I.see('We recommend that you apply to get a new PBA to pay for fees.');
    I.see('you can also pay by credit or debit card if you need to pay now');
    I.see('Pay by card');
    I.see('Register an existing PBA with MyHMCTS');
    I.see('You may find it easier in future to pay by PBA, your organisation administrator will need to');
    I.see('email MyHMCTSsupport@justice.gov.uk to ask for your PBA to be registered with your');
    I.see('MyHMCTS account. You should include your organisation name and PBA number.');
    I.see('It can then take up to 3 days for your account to be updated. You’ll need to start your claim');
    I.see('again to pay the fee.');
    I.see('Apply to get a new PBA');
    I.see('You’ll need to provide details for you and your organisation, including the required credit');
    I.see('limit for your account.');
    I.see('Once your account has been registered, you’ll need to start your claim again to pay the fee.');
    I.see('Read more information on registering for PBA.');
  },

  verifyPayFeePage(feeAmount, accountNumber, reference) {
    I.see('Pay fee using Payment by Account (PBA)');
    I.see('Amount to pay');
    I.see(`${feeAmount}`);
    I.see('Select a PBA');
    I.selectOption(this.locators.pba_account_number_select, `${accountNumber}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.see('Enter a reference for your PBA account statements');
    I.see('This should be your own unique reference to identify the case. It will appear on your statements.');
    I.fillField(this.locators.pba_reference_text_field, `${reference}`);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//label[contains(text(),\'Enter a reference for your PBA account statements\')]');
    I.wait(CCPBATConstants.oneSecondWaitTime);
    I.click('Continue');
  },

  verifyConfirmedBanner(bannerValue) {
    I.see(`${bannerValue}`);
    I.see('Your payment reference is');
    I.see('RC-');
    I.click('View service request');
  },

  verifyWTPGeneralPBAErrorPage(payByCardFlag) {
    I.see('Sorry, there is a problem with the service');
    I.see('Try again later.');
    I.see('you can also pay by credit or debit card.');
    if (payByCardFlag === false) {
      I.click('//button[contains(text(),\'View Service Request\')]');
    } else {
      I.click('Pay by card');
    }
  }
};
