'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const testConfig = require('config');
const stringUtils = require('../helpers/string_utils');

const { I } = inject();

module.exports = {
  locators: {
    case_title: { xpath: '//*[@class = "heading-medium"]' },
    unallocated_payments_count: { xpath: '//table[@class="govuk-table"]/tbody//td[2]' },
    more_details_actions: { xpath: '//*[@class = "govuk-details__summary"]' },
    unallocated_payment_select_option: { xpath: '//ccpay-app-unprocessed-payments//tbody/tr[1]//input' },
    rc_reference: { xpath: '//*[contains(text() , "RC")]' },
    view_details_for_status_paid: { xpath: '//ccpay-case-transactions/div/main/div/div[2]/table/tbody/tr/td[5]/a' },
    view_details_for_payments: { xpath: '//ccpay-service-request/div[5]/table/tbody/tr/td[1]/a' },
    // Case Transactions Page (Payments Values...)
    total_payments_text: { xpath: '//tr[@class="totalpayments govuk-table__row"]/td[1]' },
    unallocated_payments_text: { xpath: '//td[@class="govuk-table__cell case-transaction__color summary-table-font"]' },
    total_remissions_text: { xpath: '//tr[@class="totalpayments govuk-table__row"]/td[3]' },
    amount_due_text: { xpath: '//tr[@class="totalpayments govuk-table__row"]/td[4]' },
    payments_review_button: { xpath: '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/table/tbody/tr/td[6]/a' },
    disputed_status: { xpath: '//h2[contains(text(), "Disputed payment history")]/../../div[2]/table/tbody/tr/td[1]' },
    disputed_amount: { xpath: '//h2[contains(text(), "Disputed payment history")]/../../div[2]/table/tbody/tr/td[2]' },
    disputed_date: { xpath: '//h2[contains(text(), "Disputed payment history")]/../../div[2]/table/tbody/tr/td[3]' },
    disputed_payment_reference: { xpath: '//h2[contains(text(), "Disputed payment history")]/../../div[2]/table/tbody/tr/td[4]' },
    disputed_event: { xpath: '//h2[contains(text(), "Disputed payment history")]/../../div[2]/table/tbody/tr/td[5]' },
    disputed_closed_show_details: { xpath: '//*[@id="main-content"]/div/div[4]/div[2]/table/tbody/tr[1]/td[6]/a' },
    disputed_initiated_show_details: { xpath: '//*[@id="main-content"]/div/div[4]/div[2]/table/tbody/tr[2]/td[6]/a' },
    // allocate_new_service_request: {xpath: '//*[contains(text(),"Allocate to new service request")]'},
    allocate_new_service_request: {xpath: '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[3]/ccpay-app-unprocessed-payments/div/table/tbody/tr[1]/td[3]/div/button[1]'},
    notpaid_payment_status: { xpath: '//*[contains(text(),"Not paid")]' },
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

  checkRejectedRefundsSection() {
    I.see('Refunds');
    I.see('Status');
    I.see('Rejected');
    I.see('Amount');
    I.see('Date');
    I.see('Refund reference');
    I.see('Reason');
    I.see('No refunds recorded');
  },

  async checkPaymentsValues(checkPaymentValuesData) {
    const totalPaymentsValue = await I.grabTextFrom(this.locators.total_payments_text);
    // console.log(`The value of the Total Payments Text : ${totalPaymentsValue}`);
    if (totalPaymentsValue !== `${checkPaymentValuesData.totalPayments}`) {
      throw new Error('The total payments value is not expected');
    }
    const unallocatedPaymentsValue = await I.grabTextFrom(this.locators.unallocated_payments_text);
    if (unallocatedPaymentsValue !== `${checkPaymentValuesData.unallocatedPayments}`) {
      throw new Error('The unallocated value is not expected');
    }

    const totalRemissionsValue = await I.grabTextFrom(this.locators.total_remissions_text);
    if (totalRemissionsValue !== `${checkPaymentValuesData.totalRemissions}`) {
      throw new Error('The total remissions value is not expected');
    }
    const amountDueValue = await I.grabTextFrom(this.locators.amount_due_text);
    if (amountDueValue !== `${checkPaymentValuesData.amountDue}`) {
      throw new Error('The Amount Due value is not expected');
    }
  },

  async checkPaymentsValuesForAFailedPayments(checkPaymentValuesData) {
    const totalPaymentsValue = await I.grabTextFrom(this.locators.total_payments_text);
    // console.log(`The value of the Total Payments Text : ${totalPaymentsValue}`);
    if (totalPaymentsValue !== `${checkPaymentValuesData.totalPayments}`) {
      throw new Error('The total payments value is not expected');
    }
    const unallocatedPaymentsValue = await I.grabTextFrom(this.locators.unallocated_payments_text);
    if (unallocatedPaymentsValue !== `${checkPaymentValuesData.unallocatedPayments}`) {
      throw new Error('The unallocated value is not expected');
    }

    const totalRemissionsValue = await I.grabTextFrom(this.locators.total_remissions_text);
    if (totalRemissionsValue !== `${checkPaymentValuesData.totalRemissions}`) {
      throw new Error('The total remissions value is not expected');
    }
    /* const amountDueValue = await I.grabTextFrom(this.locators.amount_due_text);
    if (amountDueValue !== '£0.00') {
      throw new Error('The Amount Due value is not expected');
    }*/
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
    I.wait(CCPBConstants.fifteenSecondWaitTime);
    this.validateTransactionPage(caseNumber);
    I.see(caseTitle);
    I.click(this.locators.more_details_actions);
  },

  checkBulkCaseSuccessPayment(caseNumber, caseTitle) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(caseNumber);
    I.see(caseTitle);
  },
  checkBulkCaseSuccessPaymentNotPaid(caseNumber, caseTitle) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPaymentNotPaid(caseNumber);
    I.see(caseTitle);
  },
  checkBulkCaseNonPaidPayment(caseNumber, caseTitle, allocationStatus) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForShortFallPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
  },
  checkBulkCaseSurplusOrShortfallSuccessPayment(caseNumber, caseTitle,
    allocationStatus) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
    // I.see(amoundDue);
  },
  checkBulkCaseSurplusOrShortfallSuccessPaymentNotPaid(caseNumber, caseTitle,
    allocationStatus, amoundDue) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransactionPageForSuccessPaymentNotPaid(caseNumber, allocationStatus);
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
    // if (testConfig.e2e.testForCrossbrowser !== 'true') {
    //   I.see(method);
    // }
    I.see(method);
  },

  checkIfBulkScanPaymentsAllocated(dcnNumber) {
    I.dontSee(dcnNumber);
  },

  allocateToNewFee() {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Allocate to new service request');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToExistingServiceRequest(amount) {
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click('Allocate to existing service request');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Select payment request');
    I.see(amount);
    I.click('//input[@name="orderLevelRecord"]');
    I.click('Continue');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  allocateToTransferred() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Mark as transferred');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  async verifyDisputedPaymentHistory(paymentRCRef, todayDate) {
    I.wait(CCPBConstants.tenSecondWaitTime);
    // I.see('Service requests');
    await I.see('Status');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    await I.see('Partially paid');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.payments_review_button);
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.see('Initiated');
    I.see('Closed');
    I.see('£100.00');
    I.see(`${paymentRCRef}`);

    I.see(`${todayDate}`);
    I.see('Chargeback');
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.click(this.locators.disputed_closed_show_details);
    I.wait(CCPBConstants.sevenSecondWaitTime);
  },

  async verifyDisputedPaymentHistoryEvent(paymentRCRef, todayDate) {
    // I.wait(CCPBConstants.tenSecondWaitTime);
    // I.see('Service requests');
    // await I.see('Status');
    console.log("Asserting Started");
    I.wait(CCPBConstants.tenSecondWaitTime);
    await I.retry(5).seeElement(this.locators.notpaid_payment_status);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.payments_review_button);
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.see('Initiated');
    I.see('Closed');
    I.see('£215.00');
    I.see(`${paymentRCRef}`);
    I.see(`${todayDate}`);
    I.see('Chargeback');
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.click(this.locators.disputed_closed_show_details);
    I.wait(CCPBConstants.sevenSecondWaitTime);
  },

  async verifyServiceRequestStatus() {
    I.wait(CCPBConstants.tenSecondWaitTime);
    // I.see('Service requests');
    await I.see('Status');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Disputed');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.Logout();
  },

   async verifyDisputedPaymentHistoryInitiated() {
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.click(this.locators.disputed_initiated_show_details);
  },

  async verifyDisputedPaymentHistoryTable(paymentRCRef, todayDate) {
    I.wait(CCPBConstants.tenSecondWaitTime);
    await I.see('Service requests');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    await I.see('Status');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Paid');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.payments_review_button);
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.see('Initiated');
    I.see('Closed');
    I.see('£250.00');
    I.see(`${paymentRCRef}`);
    I.see(`${todayDate}`);
    I.see('Bounced Cheque');
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.click(this.locators.disputed_closed_show_details);
    I.wait(CCPBConstants.sevenSecondWaitTime);
  },

  async verifyDisputedPaymentHistoryInitiatedForBounceBack() {
    I.wait(CCPBConstants.sevenSecondWaitTime);
    I.click(this.locators.disputed_initiated_show_details);
  },

  allocateToUnidentified() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.click('Mark as unidentified');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  async validateCaseTransactionPageForRefunds(ccdCaseNumber,
    paymentStatus, checkPaymentValuesData) {
    // console.log(`The value of the Formatted CCD Case Number : ${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Case reference:');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Total payments');
    I.see('Unallocated payments');
    I.see('Total remissions');
    I.see('Amount due');
    if (paymentStatus) {
      await this.checkPaymentsValues(checkPaymentValuesData);
    } else {
      await this.checkPaymentsValuesForAFailedPayments(checkPaymentValuesData);
    }
    this.checkEmptyRefundsSection();
  },

  async validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
    paymentStatus, checkPaymentValuesData) {
    // console.log(`The value of the Formatted CCD Case Number : ${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Case reference:');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Total payments');
    I.see('Unallocated payments');
    I.see('Total remissions');
    I.see('Amount due');
    if (paymentStatus) {
      await this.checkPaymentsValues(checkPaymentValuesData);
    } else {
      await this.checkPaymentsValuesForAFailedPayments(checkPaymentValuesData);
    }
  },

  verifyPaymentStatusOnCaseTransactionPage(statuses) {
    for (let i = 0; i < statuses.length; i++) {
      I.see(`${statuses[i]}`);
    }
  },

  validateCaseTransactionPageForRefundsAfterApplyingRefund(ccdCaseNumber, caseTransactions) {
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
    // I.see('Select');
    // I.see('Payment asset number (DCN)');
    // I.see('Banked date');
    // I.see('Amount');
    // I.see('Method');
    // I.see('Fees');
    // I.see('Code');
    // I.see('Description');
    // I.see('Volume');
    // I.see('Fee amount');
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
    // I.see('Select');
    // I.see('Payment asset number (DCN)');
    // I.see('Banked date');
    // I.see('Amount');
    // I.see('Method');
    // I.see('Fees');
    // I.see('Code');
    // I.see('Description');
    // I.see('Volume');
    // I.see('Fee amount');
    // I.see('Calculated amount');
    // I.see('Amount due');
    // I.see('Action');
    // I.see(allocationStatus);
    // if (testConfig.e2e.testForCrossbrowser !== 'true') {
    //   I.see('Paid');
    // }
    I.see('Paid');
    I.see('Success');
  },
  validateTransactionPageForSuccessPaymentNotPaid(caseNumber) {
    I.see(caseNumber);
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    // I.see('Select');
    // I.see('Payment asset number (DCN)');
    // I.see('Banked date');
    // I.see('Amount');
    // I.see('Method');
    // I.see('Fees');
    // I.see('Code');
    // I.see('Description');
    // I.see('Volume');
    // I.see('Fee amount');
    // I.see('Calculated amount');
    // I.see('Amount due');
    // I.see('Action');
    // I.see(allocationStatus);
    // if (testConfig.e2e.testForCrossbrowser !== 'true') {
    //   I.see('Partially paid');
    // }
    I.see('Partially paid');
    I.see('Success');
  },
  validateTransactionPageForOverPayments() {
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.allocate_new_service_request);
  },
  validateTransactionPageForOverPaymentsRemissionsRefunds(refunds,refundRefRemissions,refundRefOverPayments) {
    I.see(refunds);
    I.see(refundRefRemissions);
    I.see(refundRefOverPayments);
    I.see('Refunds');
    I.see('Approved');
    I.see('£300.00');
    I.see('£100.00');
    I.see('Overpayment');
    I.see('Retrospective remission');
    I.see('System/technical error');
  },
  validateTransactionPageForPartialPayments() {
    I.wait(CCPBConstants.tenSecondWaitTime);
    I.see('Total payments');
    I.see('£273');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.wait(CCPBConstants.fiveSecondWaitTime);
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
    // if (testConfig.e2e.testForCrossbrowser !== 'true') {
    //   I.see('Not paid');
    // }
    I.see('Not paid');
    I.see('Success');
  },
  validateTransactionPageForRemission(remissionCode, feeCode, remissionAmount) {
    I.click(this.locators.view_details_for_status_paid);
    I.see(remissionCode);
    I.see(feeCode);
    I.see(remissionAmount);
  },

  async  getReceiptReference() {
    I.click(this.locators.view_details_for_status_paid);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.view_details_for_payments);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    const receiptReference = await I.grabTextFrom(this.locators.rc_reference);
    return receiptReference;
  }
};
