'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const PaybubbleStaticData = require('../pages/paybubble_static_data');

const { I } = inject();

module.exports = {

  locators: {
    remission_code: { xpath: '//*[@id="remissionCode"]' },
    amount: { xpath: '//*[@id="amount"]' }
  },


  verifyRemissionPage(feeCode) {
    I.see('Add remission');
    I.see('Enter remission for reference. For example: HWF-A1B-23C OR PA21-123456');
    I.see(`Add remission to ${feeCode}:${PaybubbleStaticData.fee_description[feeCode]}`);
    I.see('How much does the applicant need to pay?');
    I.see('Submit');
  },

  verifyRemissionConfirmationPage(feeCode, amount) {
    I.see('Are you sure you want to add remission to this fee?');
    I.see('Remission code:');
    I.see('Fee code:');
    I.see('Fee description:');
    I.see('Amount the applicant must pay:');
    I.see('HWF-A1B-23C');
    I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see(amount);
    I.see('Confirm');
  },

  processRemission(feeCode, amount) {
    // this.verifyRemissionPage(feeCode);
    I.fillField(this.locators.remission_code, 'HWF-A1B-23C');
    I.fillField(this.locators.amount, amount);
    I.click('Submit');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.verifyRemissionConfirmationPage(feeCode, amount);
  },

  cancelprocessRemission() {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  confirmProcessRemission() {
    I.click('Confirm');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  verifyAddRemissionPageText() {
    I.see('Add remission');
    I.see('Add remission to FEE0002: Filing an application for a divorce, nullity or civil partnership dissolution');
    I.see('Enter remission for reference. For example: HWF-A1B-23C OR PA21-123456');
    I.see('How much does the applicant need to pay?');
  },

  verifyNoRemissionCodeOrAmountErrorMessages() {
    I.click('Submit');
    I.see('Enter a remission code');
    I.see('Enter a amount');
  },

  checkRemissionCodeAndAmount() {
    I.click('Submit');
    I.see('Enter a remission code');
    I.see('Enter a amount');
  },

  remissionAmountExceed(amount) {
    I.fillField(this.locators.remission_code, 'HWF-A1B-23C');
    I.fillField(this.locators.amount, amount);
    I.click('Submit');
    I.see('The remission amount must be less than the total fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }


};
