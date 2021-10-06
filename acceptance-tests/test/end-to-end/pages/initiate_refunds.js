/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const stringUtils = require('../helpers/string_utils');

const { I } = inject();

module.exports = {

  locators: {
    service_requests_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },
    payment_success_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },

    remission_code_field: { xpath: '//*[@id="remissionCode"]' },
    amount_field: { xpath: '//*[@id="amount"]' },
    refund_reference_field: { xpath: '//strong[starts-with(text(),\'Refund reference:\')]' }
  },

  async getHeaderValue() {
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  verifyCaseTransactionPage(entrypoint) {
    I.waitForText('Case transactions', '5');
    I.see('Payments');
    I.see('Refunds');
    if (entrypoint === 'Payments') {
      I.click(this.locator.payment_success_review);
    } else {
      I.click(service_requests_review);
    }
    I.wait(CCPBConstants.twoSecondWaitTime);
  },

  verifyPaymentDetailsPage(typeOfRefund) {
    I.waitForText('Payment details', '5');
    I.waitForText('Payment status history', '5');
    I.see('Issue refund');
    I.waitForText('Fee and remission details', '5');
    I.see('Add remission');
    I.click(typeOfRefund);
    I.wait(CCPBConstants.twoSecondWaitTime);
  },

  verifyProcessRefundPage() {
    I.waitForText('Process refund', '5');
    I.see('Why are you making this refund', '5');
    // I.selectOption('','Amended claim');
    I.click('Continue');
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

  /* async verifyRefundConfirmationPage(paymentAmount) {
    I.waitForText('Refund Submitted', '5');
    I.see('Refund reference:RF-');
    I.see(`A refund request for £${paymentAmount}has been passed to a team leader to approve`);
    I.see('Return to case');
  },

  verifyServiceRequestPage() {
    I.waitForText('Service request', '5');
    I.see('Total reductions: £');
    I.see('Total fees to pay: £');
    I.see('Payments');
    I.see('Total left to pay: £');
    I.click('Issue refund');
  },*/

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
      console.log('Inside the HWF Code');
      // pause();
      I.click({ xpath: '//tr[5]//a[.="Change"]' });
    } else if (changeRefundAmountFlag) {
      console.log('Inside the Changed Refund Amount');
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
    // pause();
    I.see(`${checkYourAnswersData.hwfReference}`);
    I.see('Reference');
    // I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Fee');
    I.see(`${checkYourAnswersData.feeCode}`);
    I.see('Amount');
    I.see(`£${checkYourAnswersData.refundAmount}`);
    // I.seeElement('[Add remission]:disabled') Check to see disabled button not working for now....
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
    I.see('£' + `${checkYourAnswersData.refundAmount}`);
    I.see('Fee code');
    I.see(`${checkYourAnswersData.feeCode}`);
    I.see('Fee amount');
    I.see(`${checkYourAnswersData.paymentAmount}`);
    I.see('Submit refund');
    I.click('Submit refund');
  },

  verifyRefundDetailsPage(caseTransactionsData) {
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
    I.dontSee('Process Refund');
    I.dontSee('Approve Refund');
    I.click('Back');
  },
  issueRefundJourney(entrypoint) {
    verifyCaseTransactionPage(entrypoint);
    verifyPaymentDetailsPage('Issue Refund');
    verifyProcessRefundPage();
    verifyCheckYourAnswersPageForIssueRefund();
    verifyRefundConfirmationPage();
  },

  addRemissionRefundJourney(entrypoint) {
    verifyCaseTransactionPage(entrypoint);
    verifyPaymentDetailsPage('Add remission');
  }
};
