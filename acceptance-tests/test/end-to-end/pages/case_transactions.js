'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const testConfig = require('config');
const stringUtils = require('../helpers/string_utils');
const disputedPaymentHistoryText = 'Disputed payment history';

const { I } = inject();

function xpathLiteral(value) {
  const text = String(value);
  if (!text.includes('\'')) {
    return `'${text}'`;
  }
  if (!text.includes('"')) {
    return `"${text}"`;
  }
  return `concat('${text.split('\'').join('\', "\'", \'')}')`;
}

function closedDisputedPaymentDetailsLink(paymentRCRef, eventName) {
  return {
    xpath: `//tr[td[normalize-space()="Closed"] and td[contains(normalize-space(), ${xpathLiteral(paymentRCRef)})] and td[contains(normalize-space(), ${xpathLiteral(eventName)})]]//a`
  };
}

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
    I.waitForText('Total payments', CCPBConstants.tenSecondWaitTime);
    this.validateTransactionPage(caseNumber);
    I.see(caseTitle);
    I.waitForClickable(this.locators.more_details_actions, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.more_details_actions);
  },

  checkBulkCaseSuccessPayment(caseNumber, caseTitle) {
    I.waitForText('Success', CCPBConstants.oneMinute);
    this.validateTransactionPageForSuccessPayment(caseNumber);
    I.see(caseTitle);
  },
  checkBulkCaseSuccessPaymentPartiallyPaid(caseNumber, caseTitle, allocationStatus) {
    I.waitForText(allocationStatus, CCPBConstants.tenSecondWaitTime);
    this.validateTransactionPageForSuccessPaymentPartiallyPaid(caseNumber, allocationStatus);
    I.see(caseTitle);
  },
  checkBulkCaseNonPaidPayment(caseNumber, caseTitle, allocationStatus) {
    I.waitForText(allocationStatus, CCPBConstants.tenSecondWaitTime);
    this.validateTransactionPageForShortFallPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
  },
  checkBulkCaseSurplusOrShortfallSuccessPayment(caseNumber, caseTitle,
    allocationStatus) {
    I.waitForText(allocationStatus, CCPBConstants.tenSecondWaitTime);
    this.validateTransactionPageForSuccessPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
    // I.see(amoundDue);
  },
  checkBulkCaseShortfallSuccessPaymentPartiallyPaid(caseNumber, caseTitle,
                                                    allocationStatus, amoundDue) {
    I.waitForText(allocationStatus, CCPBConstants.tenSecondWaitTime);
    this.validateTransactionPageForSuccessPaymentPartiallyPaid(caseNumber, allocationStatus);
    I.see(caseTitle);
    I.see(`£${amoundDue}`);
  },
  checkBulkCaseSurplusOrShortfallPayment(caseNumber, caseTitle, allocationStatus, amoundDue) {
    I.waitForText(allocationStatus, CCPBConstants.tenSecondWaitTime);
    this.validateTransactionPageForShortFallPayment(caseNumber, allocationStatus);
    I.see(caseTitle);
    I.see(amoundDue);
  },
  checkUnallocatedPayments(totalDcn, dcnNumber, amount, method) {
    I.see(totalDcn);
    I.see(dcnNumber);
    I.see(`£${amount}`);
    I.see(method);
  },

  checkIfBulkScanPaymentsAllocated(dcnNumber) {
    I.dontSee(dcnNumber);
  },

  allocateToNewFee() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.waitForClickable('Allocate to new service request', CCPBConstants.tenSecondWaitTime);
    I.click('Allocate to new service request');
    I.waitForText('Search for a fee', CCPBConstants.tenSecondWaitTime);
  },

  allocateToExistingServiceRequest(amount) {
    I.waitForClickable('Allocate to existing service request', CCPBConstants.tenSecondWaitTime);
    I.click('Allocate to existing service request');
    I.waitForText('Select payment request', CCPBConstants.tenSecondWaitTime);
    I.see('Select payment request');
    I.see(`£${amount}`);
    I.click('//input[@name="orderLevelRecord"]');
    I.click('Continue');
    I.waitForText('Summary', CCPBConstants.oneMinute);
  },

  allocateToTransferred() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.waitForClickable('Mark as transferred', CCPBConstants.tenSecondWaitTime);
    I.click('Mark as transferred');
    I.waitForText('Mark payment as transferred', CCPBConstants.tenSecondWaitTime);
  },

  async verifyDisputedPaymentHistory(paymentRCRef, todayDate) {
    I.waitForText('Status', CCPBConstants.tenSecondWaitTime);
    await I.see('Status');
    I.waitForText('Partially paid', CCPBConstants.tenSecondWaitTime);
    await I.see('Partially paid');
    I.waitForElement(this.locators.payments_review_button, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.payments_review_button);
    I.waitForText('Initiated', CCPBConstants.tenSecondWaitTime);
    I.see('Initiated');
    I.see('Closed');
    I.see('£100.00');
    I.see(`${paymentRCRef}`);

    I.see(`${todayDate}`);
    I.see('Chargeback');
    const closedDetailsLink = closedDisputedPaymentDetailsLink(paymentRCRef, 'Chargeback');
    I.waitForClickable(closedDetailsLink, CCPBConstants.tenSecondWaitTime);
    I.click(closedDetailsLink);
    I.waitForText(disputedPaymentHistoryText, CCPBConstants.oneMinute);
  },

  async verifyDisputedPaymentHistoryEvent(paymentRCRef, todayDate) {
    // I.see('Service requests');
    // await I.see('Status');
    console.log("Asserting Started");
    await I.retry(5).seeElement(this.locators.notpaid_payment_status);
    I.waitForElement(this.locators.payments_review_button, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.payments_review_button);
    I.waitForText('Initiated', CCPBConstants.tenSecondWaitTime);
    I.see('Initiated');
    I.see('Closed');
    I.see('£215.00');
    I.see(`${paymentRCRef}`);
    I.see(`${todayDate}`);
    I.see('Chargeback');
    const closedDetailsLink = closedDisputedPaymentDetailsLink(paymentRCRef, 'Chargeback');
    I.waitForClickable(closedDetailsLink, CCPBConstants.tenSecondWaitTime);
    I.click(closedDetailsLink);
    I.waitForText(disputedPaymentHistoryText, CCPBConstants.oneMinute);
  },

  async verifyServiceRequestStatus() {
    I.waitForText('Status', CCPBConstants.tenSecondWaitTime);
    await I.see('Status');
    I.waitForText('Disputed', CCPBConstants.tenSecondWaitTime);
    I.see('Disputed');
    I.Logout();
  },

   async verifyDisputedPaymentHistoryInitiated() {
    I.waitForElement(this.locators.disputed_initiated_show_details, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.disputed_initiated_show_details);
  },

  async verifyDisputedPaymentHistoryTable(paymentRCRef, todayDate) {
    I.waitForText('Service requests', CCPBConstants.tenSecondWaitTime);
    I.see('Service requests');
    I.waitForText('Status', CCPBConstants.tenSecondWaitTime);
    await I.see('Status');
    I.waitForText('Paid', CCPBConstants.tenSecondWaitTime);
    I.see('Paid');
    I.waitForElement(this.locators.payments_review_button, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.payments_review_button);
    I.waitForText('Initiated', CCPBConstants.tenSecondWaitTime);
    I.see('Initiated');
    I.see('Closed');
    I.see('£250.00');
    I.see(`${paymentRCRef}`);
    I.see(`${todayDate}`);
    I.see('Bounced Cheque');
    const closedDetailsLink = closedDisputedPaymentDetailsLink(paymentRCRef, 'Bounced Cheque');
    I.waitForClickable(closedDetailsLink, CCPBConstants.tenSecondWaitTime);
    I.click(closedDetailsLink);
    I.waitForText(disputedPaymentHistoryText, CCPBConstants.oneMinute);
  },

  async verifyDisputedPaymentHistoryInitiatedForBounceBack() {
    I.waitForElement(this.locators.disputed_initiated_show_details, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.disputed_initiated_show_details);
  },

  allocateToUnidentified() {
    // I.checkOption(this.locators.unallocated_payment_select_option);
    I.waitForClickable('Mark as unidentified', CCPBConstants.tenSecondWaitTime);
    I.click('Mark as unidentified');
    I.waitForText('Mark payment as unidentified', CCPBConstants.tenSecondWaitTime);
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
    I.waitForText('Case reference:', CCPBConstants.tenSecondWaitTime);
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
    I.waitForText(`${statuses[0]}`, CCPBConstants.tenSecondWaitTime);
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
    I.see('Paid');
    I.see('Success');
  },
  validateTransactionPageForSuccessPaymentPartiallyPaid(caseNumber, allocationStatus) {
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
    I.see(allocationStatus);
    I.see('Success');
  },
  validateTransactionPageForOverPayments() {
    I.see('Total payments');
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
    I.waitForClickable(this.locators.allocate_new_service_request, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.allocate_new_service_request);
  },
  validateTransactionPageForRefunds(refunds,refundRefOverPayments, feePaymentRefundAmount,  overPaymentRefundAmount) {
    I.see(refunds);
    I.see(refundRefOverPayments);
    I.see('Refunds');
    I.see('Approved');
    I.see(overPaymentRefundAmount);
    I.see(feePaymentRefundAmount);
    I.see('Overpayment');
    I.see('System/technical error');
  },
  validateTransactionPageForRefundOverPayment(refundRefOverPayments) {
    I.see(refundRefOverPayments);
    I.see('Refunds');
    I.see('Approved');
    I.see('£280.00');
    I.see('Overpayment');
  },
  validateTransactionPageForPartialPayments(amount) {
    I.waitForText('Total payments', CCPBConstants.tenSecondWaitTime);
    I.see('Total payments');
    I.see(`£${amount}`);
    I.see('Total remissions');
    I.see('Amount due');
    I.see('Unallocated payments');
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
    I.see('Not paid');
    I.see('Success');
  },
  async validatePaymentDetailsPageForRemission(remissionCode, feeCode, remissionAmount) {
    I.click(this.locators.view_details_for_status_paid);
    I.see(remissionCode);
    I.see(feeCode);
    I.see(`£${remissionAmount}`);
  },

  async validateCaseTransactionsDetails(totalPayments, unallocatedPayments, totalRemissions, amountDue, overPayment) {
    I.see('Total payments');
    I.seeTextEquals(`£${totalPayments}`, '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[1]/div/table/tbody/tr/td[1]');
    I.see('Unallocated payments');
    I.seeTextEquals(unallocatedPayments, '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[1]/div/table/tbody/tr/td[2]');
    I.see('Total remissions');
    I.seeTextEquals(`£${totalRemissions}`, '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[1]/div/table/tbody/tr/td[3]');
    I.see('Amount due');
    I.seeTextEquals(`£${amountDue}`, '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[1]/div/table/tbody/tr/td[4]');
    I.see('Over payment');
    I.seeTextEquals(`£${overPayment}`, '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[1]/div/table/tbody/tr/td[5]');
  },

  async  getReceiptReference() {
    I.waitForElement(this.locators.view_details_for_status_paid, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.view_details_for_status_paid);
    I.waitForElement(this.locators.view_details_for_payments, CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.view_details_for_payments);
    I.waitForElement(this.locators.rc_reference, CCPBConstants.tenSecondWaitTime);
    const receiptReference = await I.grabTextFrom(this.locators.rc_reference);
    return receiptReference;
  }
};
