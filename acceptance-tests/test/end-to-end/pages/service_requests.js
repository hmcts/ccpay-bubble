/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
'use strict';
const stringUtils = require('../helpers/string_utils');
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {

  locators: {
    service_requests_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' }
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
    } else{
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

  verifyPayFeePage(feeAmount) {
    I.see('Pay fee using Payment by Account (PBA)');
    I.see('Amount to pay');
    I.see(`${feeAmount}`);
    I.see('Select a PBA');
    I.selectOption(this.locators.reasons_drop_down, 'Other - CoP');
  }
};
