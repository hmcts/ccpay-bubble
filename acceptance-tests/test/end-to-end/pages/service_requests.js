/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
'use strict';
const stringUtils = require('../helpers/string_utils');
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {

  locators: {
    service_requests_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },
    payment_success_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },

    remission_code_field: { xpath: '//*[@id="remissionCode"]' },
    amount_field: { xpath: '//*[@id="amount"]' },
    refund_reference_field: { xpath: '//strong[starts-with(text(),\'Refund reference:\')]' },

    reasons_drop_down: { xpath: '//select[@id=\'sort\']' },
    reasons_text: { xpath: '//input[@id=\'reason\']' },

    users_drop_down_for_refunds_to_be_approved: { xpath: '//ccpay-refund-list[1]/div[3]//select[@id=\'sort\']' },
    date_updated_for_refunds_to_be_approved_by_case_worker: { xpath: '//body[1]/app-root[1]/div[1]/div[1]/app-payment-history[1]/ccpay-payment-lib[1]/ccpay-refund-list[1]/div[3]/ccpay-table[1]/div[1]/div[2]/mat-table[1]/mat-header-row[1]/mat-header-cell[5]/div[1]/button[1]' },

    users_drop_down_for_refunds_returned_to_case_worker: { xpath: '//div[5]//select[@id=\'sort\']' },
    date_updated_for_refunds_returned_to_case_worker: { xpath: '//body[1]/app-root[1]/div[1]/div[1]/app-payment-history[1]/ccpay-payment-lib[1]/ccpay-refund-list[1]/div[5]/ccpay-table[1]/div[1]/div[2]/mat-table[1]/mat-header-row[1]/mat-header-cell[5]/div[1]/button[1]' }
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
  }
};
