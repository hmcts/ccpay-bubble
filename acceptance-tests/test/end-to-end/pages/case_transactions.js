'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const {I} = inject();

module.exports = {
  locators: {
    case_title: {xpath: '//*[@class = "heading-medium"]'},
    unallocated_payments_count: {xpath: '//table[@class="govuk-table"]/tbody//td[4]'},
    unallocated_payment_select_option: {xpath: '//ccpay-app-unprocessed-payments//tbody/tr[1]//input'},


  },
  // done
  checkBulkCase(case_number, case_title) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPage(case_number);
    I.see(case_title);
  },

  checkBulkCaseSuccessPayment(case_number, case_title, allocation_status) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(case_number, allocation_status);
    I.see(case_title);
  },

  checkUnallocatedPayments(total_dcn, dcn_number, amount, method) {
    I.see(total_dcn);
    I.see(dcn_number);
    I.see(amount);
    I.see(method);

  },

  allocateToNewFee() {
    I.checkOption(this.locators.unallocated_payment_select_option)
    I.click('Allocate to a new fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToTransferred() {
    I.checkOption(this.locators.unallocated_payment_select_option)
    I.click('Mark as transferred');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToUnidentified() {
    I.checkOption(this.locators.unallocated_payment_select_option)
    I.click('Mark as unidentified');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  validateTransactionPage(case_number) {
    I.see(case_number);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.see('Unallocated payments');
    I.see('Select');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Fees');
    I.see('Code');
    I.see('Description');
    I.see('Volume');
    I.see('Fee amount');
    I.see('Calculated amount');
    I.see('Amount due');
    I.see('Action');
    I.see('No fees recorded');
  },

  validateTransactionPageForSuccessPayment(case_number, allocation_status) {
    I.see(case_number);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.see('Unallocated payments');
    I.see('Select');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Fees');
    I.see('Code');
    I.see('Description');
    I.see('Volume');
    I.see('Fee amount');
    I.see('Calculated amount');
    I.see('Amount due');
    I.see('Action');
    I.see(allocation_status);
    I.see('Bulk scan');
    I.see('Success');

  }


}
