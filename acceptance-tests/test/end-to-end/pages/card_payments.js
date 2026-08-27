/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
'use strict';
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {

  locators: {
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

  verifyConfirmYourPaymentPageCardDetails(paymentCardValues) {
    I.waitForText('Card number', CCPBATConstants.tenSecondWaitTime);
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
    I.waitForText(`${pageTitle}`, CCPBATConstants.tenSecondWaitTime);
    I.see(`${pageTitle}`);
    I.see('Payment summary');
    I.see('Testing'); // description value from the citizen card payment payload, e.g. card payment
    I.see('Total amount:');
    I.see(`${paymentAmount}`);
  },

  verifyYourPaymentHasBeenCancelledPage() {
    I.waitForText('Your payment has been cancelled', CCPBATConstants.tenSecondWaitTime);
    I.see('Your payment has been cancelled');
    I.see('No money has been taken from your account.');
    I.click('Continue');
  },

  verifyYourPaymentHasBeenDeclinedPage() {
    I.waitForText('Your payment has been declined', CCPBATConstants.tenSecondWaitTime);
    I.see('Your payment has been declined');
    I.see('No money has been taken from your account. Contact your');
    I.see('bank for more details.');
    I.click('Start again');
  }

};
