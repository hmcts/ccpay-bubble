'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const {I} = inject();

module.exports = {
  locators: {
    unidentified_investigation: {xpath: '//*[@id="investicationDetail"]'},
  },


  validateUnidentifiedPage(dcn_number, amount, method) {
    I.see('Mark payment as unidentified');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Give a reason for marking this payment as unidentified.');
    I.see("Include any investigations you've made.");
    I.see(dcn_number);
    I.see(amount);
    I.see(method);
  },

  continuePayment() {
    I.click('Continue');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  inputUnidentifiedComment(unidentified_investigation) {
    I.fillField(this.locators.unidentified_investigation, unidentified_investigation);
  },

  validateUnidentifiedConfirmationPage(unidentified_investigation) {
    I.see('Investigations');
    I.see(unidentified_investigation);
    I.see('Are you sure you want to mark this payment as unidentified?');
  },

  validateAndConfirmUnidentified(unidentified_investigation) {
    this.inputUnidentifiedComment(unidentified_investigation);
    this.continuePayment();
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateUnidentifiedConfirmationPage(unidentified_investigation)

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
  },
}
