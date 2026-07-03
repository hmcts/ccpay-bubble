'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {
  locators: { unidentified_investigation: { xpath: '//*[@id="investicationDetail"]' } },


  validateUnidentifiedPage(dcnNumber, amount, method) {
    I.see('Mark payment as unidentified');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Give a reason for marking this payment as unidentified.');
    I.see('Include any investigations you\'ve made.');
    I.see(dcnNumber);
    I.see(amount);
    I.see(method);
  },

  continuePayment() {
    I.click('Continue');
  },

  confirmPayment() {
    I.click('Confirm');
  },

  inputUnidentifiedComment(unidentifiedInvestigation) {
    I.fillField(this.locators.unidentified_investigation, unidentifiedInvestigation);
  },

  validateUnidentifiedConfirmationPage(unidentifiedInvestigation) {
    I.see('Investigations');
    I.see(unidentifiedInvestigation);
    I.see('Are you sure you want to mark this payment as unidentified?');
  },

  validateAndConfirmUnidentified(unidentifiedInvestigation) {
    this.inputUnidentifiedComment(unidentifiedInvestigation);
    this.continuePayment();
    I.waitForText('Are you sure you want to mark this payment as unidentified?', CCPBConstants.tenSecondWaitTime);
    this.validateUnidentifiedConfirmationPage(unidentifiedInvestigation);
  },

  cancelUnidentified() {
    I.click('Cancel');
    I.waitForText('Mark payment as unidentified', CCPBConstants.tenSecondWaitTime);
    I.click('Cancel');
    I.waitForText('Are you sure you want to cancel?', CCPBConstants.tenSecondWaitTime);
    I.click('Yes');
  },

  cancelUnidentifiedComment() {
    I.click('Cancel');
    I.waitForText('Are you sure you want to cancel?', CCPBConstants.tenSecondWaitTime);
    I.click('Yes');
  },

  whenNoInvestigation() {
    I.waitForText('Enter a reason for marking this payment as unidentified.', CCPBConstants.tenSecondWaitTime);
    I.see('Enter a reason for marking this payment as unidentified.');
  },

  whenCommentLessThanLimit() {
    I.waitForText('Reason should be at least 3 characters.', CCPBConstants.tenSecondWaitTime);
    I.see('Reason should be at least 3 characters.');
  }
};
