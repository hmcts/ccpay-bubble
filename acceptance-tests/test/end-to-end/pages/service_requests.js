/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
'use strict';
const stringUtils = require('../helpers/string_utils');
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const {I} = inject();

module.exports = {

  locators: {
    pba_account_number_select: {xpath: '//select[@id=\'pbaAccountNumber\']'},
    pba_reference_text_field: {xpath:'//input[@id=\'pbaAccountRef\']'}
  },

  async getHeaderValue() {
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  verifyServiceRequestTabPage(paymentStatus, serviceRequestReference, feeDescription, feeAmount, financeManagerFlag) {
    I.see('Status');
    I.see('Amount');
    I.see('Party');
    I.see('Request reference');
    I.see('Review');
    if (!financeManagerFlag) {
      I.dontSee('Pay now');
    } else {
      I.see('Pay now');
    }
    I.see(`${paymentStatus}`);
    I.see(`${feeAmount}`);
    I.see(`${serviceRequestReference}`);
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
    //I.see(feeDescription);
    I.see('Amount');
    I.see(`1 X ${feeAmount}`);
    I.see('Total');
    I.see(`${feeAmount}`);
    I.see(`Total fees: ${feeAmount}`);
  },

  verifyPayFeePage(feeAmount, accountNumber, reference) {
    I.see('Pay fee using Payment by Account (PBA)');
    I.see('Amount to pay');
    I.see(`${feeAmount}`);
    I.see('Select a PBA');
    I.selectOption(this.locators.pba_account_number_select, `${accountNumber}`);
    I.wait(1);
    I.see('Enter a reference for your PBA account statements');
    I.see('This should be your own unique reference to identify the case. It will appear on your statements.');
    I.fillField(this.locators.pba_reference_text_field,`${reference}`);
    I.wait(1);
    I.click('Continue');
  },

  verifyConfirmedBanner (bannerValue) {
    I.see(`${bannerValue}`);
    I.see('Your payment reference is');
    I.see('RC-');
    I.click('View service request')
  },

  verifyWTPGeneralPBAErrorPage (payByCardFlag) {
    pause();
    I.see('Sorry, there is a problem with the service');
    I.see('Try again later.');
    I.see('you can also pay by credit or debit card.');
    if (!payByCardFlag) {
      I.click('View service request');
    } else {
      I.click('Pay by card');
    }
  }
};
