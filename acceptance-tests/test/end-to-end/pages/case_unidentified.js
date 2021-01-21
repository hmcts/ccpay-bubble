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
    I.wait(CCPBConstants.fiveSecondWaitTime);
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
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateUnidentifiedConfirmationPage(unidentifiedInvestigation);
  },

  cancelUnidentified() {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Are you sure you want to cancel?');
    I.click('Yes');
  },

  cancelUnidentifiedComment() {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Are you sure you want to cancel?');
    I.click('Yes');
  },

  whenNoInvestigation() {
    I.see('Enter a reason for marking this payment as unidentified.');
  },

  whenCommentLessThanLimit() {
    I.see('Reason should be at least 3 characters.');
  }
};
