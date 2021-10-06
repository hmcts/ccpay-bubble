'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const testConfig = require('config');
const stringUtils = require('../helpers/string_utils');

const { I } = inject();

module.exports = {
  locators: {
    case_title: { xpath: '//*[@class = "heading-medium"]' },
    unallocated_payments_count: { xpath: '//table[@class="govuk-table"]/tbody//td[4]' },
    unallocated_payment_select_option: { xpath: '//ccpay-app-unprocessed-payments//tbody/tr[1]//input' },
    rc_reference: { xpath: '//*[contains(text() , "RC")]' },

    // Case Transactions Page (Payments Values...)
    total_payments_text: { xpath: '//tr[@class="totalpayments govuk-table__row"]/td[1]' },
    unallocated_payments_text: { xpath: '//td[@class="govuk-table__cell case-transaction__color summary-table-font"]' },
    total_remissions_text: { xpath: '//tr[@class="totalpayments govuk-table__row"]/td[3]' },
    amount_due_text: { xpath: '//tr[@class="totalpayments govuk-table__row"]/td[4]' }
  },

  checkEmptyRefundsSection() {
    I.see('Refunds');
    I.see('Status');
    I.see('Amount');
    I.see('Date');
    I.see('Refund reference');
    I.see('Reason');
    I.see('No refunds recorded');
  },

  async checkPaymentsValues() {
    const totalPaymentsValue = await I.grabTextFrom(this.locators.total_payments_text);
    console.log(`The value of the Total Payments Text : ${totalPaymentsValue}`);
    if (totalPaymentsValue != '£215.00') {
      throw 'The total payments value is not expected';
    }
    const unallocatedPaymentsValue = await I.grabTextFrom(this.locators.unallocated_payments_text);
    if (unallocatedPaymentsValue != '0') {
      throw 'The unallocated value is not expected';
    }

    const totalRemissionsValue = await I.grabTextFrom(this.locators.total_remissions_text);
    if (totalRemissionsValue != '£0.00') {
      throw 'The total remissions value is not expected';
    }
    const amountDueValue = await I.grabTextFrom(this.locators.amount_due_text);
    if (totalRemissionsValue != '£0.00') {
      throw 'The Amount Due value is not expected';
    }
  },

  checkRefundsSectionOfCaseTransactionsPage(caseTransactions) {
    I.see('Refunds');
    I.see('Status');
    I.see(`${caseTransactions.refundStatus}`);
    I.see('Amount');
    I.see(`${caseTransactions.refundAmount}`);
    I.see('Date');
    I.see('Refund reference');
    I.see(`${caseTransactions.refundReference}`);
    I.see('Reason');
    I.see(`${caseTransactions.refundReason}`);
  },

  // done
  checkBulkCase(caseNumber, caseTitle) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPage(caseNumber);
    I.see(caseTitle);
  },

  checkBulkCaseSuccessPayment(caseNumber, caseTitle, allocationStatus) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
  },

  checkBulkCaseSurplusOrShortfallSuccessPayment(caseNumber, caseTitle,
    allocationStatus, amoundDue) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(caseNumber, allocationStatus);
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
    I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Allocate to a new fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToTransferred() {
    I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Mark as transferred');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToUnidentified() {
    I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Mark as unidentified');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  async validateCaseTransactionPageForRefunds(ccdCaseNumber) {
    console.log(`The value of the Formatted CCD Case Number : ${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Case reference:');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Total payments');
    I.see('Unallocated payments');
    I.see('Total remissions');
    I.see('Amount due');
    await this.checkPaymentsValues();
    this.checkEmptyRefundsSection();
  },

  validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber, caseTransactions) {
    console.log(`The value of the Formatted CCD Case Number : ${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Case reference:');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Total payments');
    I.see('Unallocated payments');
    I.see('Total remissions');
    I.see('Amount due');
    this.checkRefundsSectionOfCaseTransactionsPage(caseTransactions);
  },

  validateTransactionPage(caseNumber) {
    I.see(caseNumber);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
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

  validateTransactionPageForSuccessPayment(caseNumber, allocationStatus) {
    I.see(caseNumber);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
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
    I.see(allocationStatus);
    if (testConfig.e2e.testForCrossbrowser !== 'true') {
      I.see('Bulk scan');
    }
    I.see('Success');
  },

  validateTransactionPageForRemission(remissionCode, feeCode, remissionAmount) {
    I.see(remissionCode);
    I.see(feeCode);
    I.see(remissionAmount);
  },

  async getReceiptReference() {
    const receiptReference = await I.grabTextFrom(this.locators.rc_reference);
    return receiptReference;
  }
};
