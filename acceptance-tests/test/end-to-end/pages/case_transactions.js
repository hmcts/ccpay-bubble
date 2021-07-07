'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const testConfig = require('config');

const { I } = inject();

module.exports = {
  locators: {
    case_title: { xpath: '//*[@class = "heading-medium"]' },
    unallocated_payments_count: { xpath: '//table[@class="govuk-table"]/tbody//td[2]' },
    more_details_actions: { xpath: '//*[@class = "govuk-details__summary"]' },
    unallocated_payment_select_option: { xpath: '//ccpay-app-unprocessed-payments//tbody/tr[1]//input' },
    rc_reference: { xpath: '//*[contains(text() , "RC")]' },
    view_details_for_status_paid: { xpath: '//ccpay-case-transactions/div/main/div/div[2]/table/tbody/td[5]/a' },
    view_details_for_payments: { xpath: '//ccpay-case-transactions/div/main/div[5]/table/tbody/tr/td[1]/a' }
  },
  // done
  checkBulkCase(caseNumber, caseTitle) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPage(caseNumber);
    I.see(caseTitle);
    I.click(this.locators.more_details_actions);
  },

  checkBulkCaseSuccessPayment(caseNumber, caseTitle, allocationStatus) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
  },

  checkBulkCaseNonPaidPayment(caseNumber, caseTitle, allocationStatus) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForShortFallPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
  },

  checkBulkCaseSurplusOrShortfallSuccessPayment(caseNumber, caseTitle,
    allocationStatus, amoundDue) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
    I.see(amoundDue);
  },

  checkBulkCaseSurplusOrShortfallPayment(caseNumber, caseTitle, allocationStatus, amoundDue) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForShortFallPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
    I.see(amoundDue);
  },
  checkUnallocatedPayments(totalDcn, dcnNumber, amount, method) {
    I.see(totalDcn);
    I.see(dcnNumber);
    I.see(amount);
    if (testConfig.e2e.testForCrossbrowser !== 'true') {
      I.see(method);
    }
  },

  checkIfBulkScanPaymentsAllocated(dcnNumber) {
    I.dontSee(dcnNumber);
  },

  allocateToNewFee() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Allocate to new payment request');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToTransferred() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Mark as transferred');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToUnidentified() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Mark as unidentified');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  validateTransactionPage(caseNumber) {
    I.see(caseNumber);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.see('Payment requests');
    I.see('No payment requests on this case.');
    I.see('Create payment request and pay');
    I.see('Payments');
    I.see('Status');
    I.see('Amount');
    I.see('Date allocated');
    I.see('Request reference');
    I.see('Unallocated');
    I.see('More details and actions');
    /* I.see('Calculated amount');
    I.see('Amount due');
    I.see('Action');
    I.see('No fees recorded'); */
  },

  validateTransactionPageForSuccessPayment(caseNumber) {
    I.see(caseNumber);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.see('Payment requests');
    I.see('Status');
    I.see('Paid');
    I.see('Amount');
    I.see('Party');
    I.see('Request reference');
    // I.see('View details');
    // I.see('Description');
    I.see('Create payment request and pay');
    I.see('Payments');
    I.see('Date allocated');
    I.see('Request reference');
    // I.see('Action');
    // I.see(allocationStatus);
    if (testConfig.e2e.testForCrossbrowser !== 'true') {
      I.see('Paid');
    }
    I.see('Success');
  },

  validateTransactionPageForShortFallPayment(caseNumber) {
    I.see(caseNumber);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.see('Payment requests');
    I.see('Status');
    I.see('Not paid');
    I.see('Amount');
    I.see('Party');
    I.see('Request reference');
    // I.see('View details');
    // I.see('Description');
    I.see('Create payment request and pay');
    I.see('Payments');
    I.see('Date allocated');
    I.see('Request reference');
    // I.see('Action');
    // I.see(allocationStatus);
    if (testConfig.e2e.testForCrossbrowser !== 'true') {
      I.see('Not paid');
    }
    I.see('Success');
  },
  validateTransactionPageForRemission(remissionCode, feeCode, remissionAmount) {
    I.click(this.locators.view_details_for_status_paid);
    I.see(remissionCode);
    I.see(feeCode);
    I.see(remissionAmount);
  },

  async getReceiptReference() {
    I.click(this.locators.view_details_for_status_paid);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.view_details_for_payments);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    const receiptReference = await I.grabTextFrom(this.locators.rc_reference);
    return receiptReference;
  }

};
