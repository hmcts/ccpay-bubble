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

    users_drop_down_for_refunds_returned_to_case_worker: { xpath: '//div[5]//select[@id=\'sort\']' },
    date_updated_for_refunds_returned_to_case_worker: { xpath: '//mat-header-cell[@class=\'mat-header-cell ng-tns-c19-3 cdk-column-date_updated mat-column-date_updated ng-star-inserted\']//button[@class=\'mat-sort-header-button\'][contains(text(),\' Date updated \')]' }
  },

  async getHeaderValue() {
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  verifyServiceRequestPage(typeOfRefund, feeDescription, feeAmount) {
    I.waitForText('Service request', '5');
    I.see('Fee');
    I.see(feeDescription);
    I.see('Amount');
    I.see(`1 X ${feeAmount}`);
    I.see('Total');
    I.see(`${feeAmount}`);
    I.see('No help with fees or remissions.');
    I.see(`Total fees: ${feeAmount}`);
    I.see(typeOfRefund);
    I.click(typeOfRefund);
  },

  verifyPaymentDetailsPage(typeOfRefund) {
    I.waitForText('Payment details', '5');
    I.waitForText('Payment status history', '5');
    I.see('Issue refund');
    I.waitForText('Fee and remission details', '5');
    I.see('Add remission');
    I.click(typeOfRefund);
  },

  verifyProcessRefundPageFromTheDropDownReasons(ccdCaseNumber, dropDownReason, reasonText) {
    I.waitForText('Process refund', '5');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Why are you making this refund');
    I.selectOption(this.locators.reasons_drop_down, 'Other - CoP');
    I.fillField(this.locators.reasons_text, reasonText);
    I.click('Continue');
  },

  verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, reasonId) {
    I.waitForText('Process refund', '5');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Why are you making this refund');
    I.checkOption(`//input[@id='${reasonId}']`);
    I.click('Continue');
  },

  verifyCheckYourAnswersPageForIssueRefund(reasonForRefund, paymentReference, paymentAmount, changeRequiredFlag) {
    I.waitForText('Check your answers', '5');
    I.see('Reason for refund');
    I.see(reasonForRefund);
    I.see('Payment reference');
    I.see(paymentReference);
    I.see('Payment amount');
    I.see(paymentAmount);
    if (changeRequiredFlag) {
      I.click('Change');
    } else {
      I.click('Submit refund');
    }
  },

  verifyCheckYourAnswersPageForRefund(reasonForRefund, paymentReference, paymentAmount) {
    I.waitForText('Check your answers', '5');
    I.waitForText('Payment reference', '5');
    I.see(paymentReference);
    I.waitForText('Payment reference', '5');
    I.see(paymentReference);
    I.waitForText('Reason for refund', '5');
    I.see(reasonForRefund);
    I.waitForText('Payment Amount', `£${paymentAmount}`);
    I.click('Submit refund');
  },

  verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference) {
    I.waitForText('Process remission', '5');
    I.see(`#${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Enter help with fees or remission reference');
    I.see('For example: HWF-A1B-23C');
    I.fillField(this.locators.remission_code_field, hwfReference);
    I.click('Continue');
  },

  verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount) {
    I.waitForText('Process remission', '5');
    I.see(`#${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Enter the amount to be refunded');
    I.fillField(this.locators.amount_field, remissionAmount);
    I.click('Continue');
  },

  verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, changeHWFCodeFlag, changeRefundAmountFlag) {
    I.waitForText('Check your answers', '5');
    I.see('Payment reference');
    I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Payment amount');
    I.see(`${checkYourAnswersData.paymentAmount}`);
    I.see('Payment status');
    I.see(`${checkYourAnswersData.paymentStatus}`);
    I.see('Fee');
    I.see(`${checkYourAnswersData.feeDescription}`);
    I.see('Help with fees or remission reference');
    I.see(`${checkYourAnswersData.hwfReference}`);
    I.see('Refund amount');
    I.see(`${checkYourAnswersData.refundAmount}`);

    if (changeHWFCodeFlag) {
      // console.log('Inside the HWF Code');
      // pause();
      I.click({ xpath: '//tr[5]//a[.="Change"]' });
    } else if (changeRefundAmountFlag) {
      // console.log('Inside the Changed Refund Amount');
      I.click({ xpath: '//tr[6]//a[.="Change"]' });
    } else {
      I.click('Add remission');
    }
  },

  verifyRemissionAddedPage(addRefundFlag, refundAmount) {
    I.waitForText('Remission added', '5');
    I.see('The amount to be refunded should be');
    I.see(`£${refundAmount}`);
    I.see('Submit refund');
    I.see('Return to case');
    if (addRefundFlag) {
      I.click('Submit refund');
    } else {
      I.click('Return to case');
    }
  },

  async verifyRefundSubmittedPage(refundAmount) {
    I.waitForText('Refund submitted', '5');
    I.see('Refund reference:');
    I.see('What happens next');
    I.see(`A refund request for £${refundAmount} has been created and will be passed to a team leader to approve.`);
    I.see('Return to case');
    const refundReferenceStatment = await I.grabTextFrom(this.locators.refund_reference_field);
    const refundReference = refundReferenceStatment.split(':')[1].trim();
    I.click('Return to case');
    return refundReference;
  },

  verifyHelpWithFeesSectionOnPaymentDetailsPage(checkYourAnswersData, pageTitle) {
    I.waitForText(pageTitle, '5');
    I.see('Help with fees or remission code');
    I.see(`${checkYourAnswersData.hwfReference}`);
    I.see('Reference');
    // I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Fee');
    I.see(`${checkYourAnswersData.feeCode}`);
    I.see('Amount');
    I.see(`£${checkYourAnswersData.refundAmount}`);
    // I.seeElement('[Add remission]:disabled') Check to see disabled button not working for now....
    if (pageTitle === 'Service request') {
      I.see('Total reductions: ');
      I.see(`£${checkYourAnswersData.refundAmount}`);
      I.see('Total fees to pay: ');
      I.see('£15.00');
    }
    I.see('Add refund');
    I.click('Add refund');
  },

  verifyCheckYourAnswersPageForAddOrInitiateRefund(checkYourAnswersData, reasonForRefund) {
    I.waitForText('Check your answers', '5');
    I.see('Reason for refund');
    I.see(reasonForRefund);
    I.see('Payment reference');
    I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Refund amount');
    I.see(`£${checkYourAnswersData.refundAmount}`);
    I.see('Fee code');
    I.see(`${checkYourAnswersData.feeCode}`);
    I.see('Fee amount');
    I.see(`${checkYourAnswersData.paymentAmount}`);
    I.see('Submit refund');
    I.click('Submit refund');
  },

  verifyRefundDetailsPage(caseTransactionsData, processRefundButtonVisible) {
    I.waitForText('Refund details', '5');
    I.see('Refund reference');
    I.see(`${caseTransactionsData.refundReference}`);
    I.see('Payment to be refunded');
    I.see(`${caseTransactionsData.paymentReference}`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Amount refunded');
    I.see(`${caseTransactionsData.refundAmount}`);
    I.see('Refund status history');
    I.see('Status');
    I.see(`${caseTransactionsData.refundStatus}`);
    I.see('Date and time');
    I.see('Users');
    I.see('Notes');
    I.see('Refund initiated');

    if (processRefundButtonVisible === false) {
      I.dontSee('Process refund');
      I.click('Back');
    } else {
      I.see('Process refund');
      I.click('Process refund');
    }
  },

  verifyRefundDetailsPageForResubmitRefund(caseTransactionsData) {
    I.see('Refund details');
    I.see('Refund reference');
    I.see(`${caseTransactionsData.refundReference}`);
    I.see('Payment to be refunded');
    I.see(`${caseTransactionsData.paymentReference}`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Amount refunded');
    I.see(`${caseTransactionsData.refundAmount}`);
    I.see('Refund status history');
    I.see('Status');
    I.see(`${caseTransactionsData.refundStatus}`);
    I.see('Sent for approval');
    I.see('Date and time');
    I.see('Users');
    I.see('Notes');
    I.see('Refund initiated');
    I.see('Test Reason Only');
    I.see('Resubmit refund');
    I.click('Resubmit refund');
  },

  verifyReviewAndResubmitRefundPage(caseTransactionsData, sendBackReason, changeRequired) {
    I.see('Review and resubmit refund');
    I.see('Reason for rejection');
    I.see(sendBackReason);
    I.see('Refund reference');
    I.see(`${caseTransactionsData.refundReference}`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Change');
    I.see('Payment reference');
    I.see(`${caseTransactionsData.paymentReference}`);
    I.see('Payment amount');
    I.see(`${caseTransactionsData.paymentAmount}`);
    if (changeRequired) {
      I.click('//a[.=\'Change\']');
    } else {
      I.click('Submit refund');
    }
  },

  verifyNoAddRemissionOnPaymentDetailsPage() {
    I.dontSee('Add remission');
  },

  verifyRefundsListPage(refundReference) {
    I.see('Refund list');
    I.see('Refunds to be approved');
    I.see('Filter by caseworker:');
    I.see('Case ID');
    I.see('Refund reference');
    I.see('Reason');
    I.see('Submitted by');
    I.see('Date updated');
    I.see('Action');
    I.see('Refunds returned to caseworker');
    I.selectOption(this.locators.users_drop_down_for_refunds_to_be_approved, 'Probate Request Request');
    // Double Clicking For Sort By Descending....
    I.click('Date updated');
    I.click('Date updated');
    I.click(`//mat-cell[contains(.,'${refundReference}')]/following-sibling::mat-cell/a[.='Process refund'][1]`);
  },

  verifyReviewRefundsDetailsPage(caseTransactionsData, refundApprovalRequest) {
    I.see('Review refund details');
    I.see('Payment to be refunded');
    // console.log(`${caseTransactionsData.refundReference} (${caseTransactionsData.refundAmount})`);
    I.see(`${caseTransactionsData.refundReference} (${caseTransactionsData.refundAmount})`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Amount to be refunded');
    I.see(`${caseTransactionsData.refundAmount}`);
    I.see('Submitted by');
    // console.log(`The value of the Refund Submitted By : ${caseTransactionsData.refundSubmittedBy}`);
    I.see(`${caseTransactionsData.refundSubmittedBy}`);
    I.see('Date submitted');
    I.see('What do you want to do with this refund?');
    I.see('Approve');
    I.see('Send to middle office');
    I.see('Reject');
    I.see('Return to caseworker');
    if (refundApprovalRequest === 'Reject') {
      I.checkOption('//input[@id=\'refundAction-1\']');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      I.checkOption('//input[@id=\'refundRejectReason-2\']');
    } else if (refundApprovalRequest === 'Approve') {
      I.checkOption('//input[@id=\'refundAction-0\']');
    } else if (refundApprovalRequest === 'Return to caseworker') {
      I.checkOption('//input[@id=\'refundAction-2\']');
      I.fillField('//textarea[@id=\'sendmeback\']', 'Test Reason Only');
    }
    I.click({ xpath: '//button[contains(text(),\'Submit\')]' });
  },

  verifyRefundApprovedPage(refundApprovalRequest) {
    if (refundApprovalRequest === 'Reject') {
      I.see('Refund rejected');
    } else if (refundApprovalRequest === 'Approve') {
      I.see('Refund approved');
    } else if (refundApprovalRequest === 'Return to caseworker') {
      I.see('Refund returned to caseworker');
    }
  },

  operateRefundsReturnedToCaseWorker(refundReference) {
    I.selectOption(this.locators.users_drop_down_for_refunds_returned_to_case_worker, 'Probate Request Request');
    // Double Clicking For Sort By Descending....
    I.click(this.locators.date_updated_for_refunds_returned_to_case_worker);
    I.click(this.locators.date_updated_for_refunds_returned_to_case_worker);
    I.click(`//mat-cell[contains(.,'${refundReference}')]/following-sibling::mat-cell/a[.='Review refund']`);
  },

  verifyPaymentHistoryPage(paymentAmount, reviewRoute) {
    I.see('Status');
    I.see('Amount');
    I.see('Party');
    I.see('Request reference');
    I.see('Paid');
    I.see(paymentAmount);

    I.see('Payments');
    I.see('Status');
    I.see('Amount');
    I.see('Date');
    I.see('Request reference');
    I.see('Success');
    I.see(paymentAmount);

    if (reviewRoute === 'Payments') {
      I.click('//div[2]//a[.=\'Review\']');
    } else {
      I.click('//div[@class=\'govuk-grid-row govuk-grid__surplus-payments\']/div[@class=\'govuk-grid-column-full\']/table[@class=\'govuk-table\']//a[.=\'Review\']');
    }
  }
};