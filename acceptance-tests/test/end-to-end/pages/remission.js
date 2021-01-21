'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const PaybubbleStaticData = require('../pages/paybubble_static_data');
const {I} = inject();

module.exports = {

  locators: {
    remission_code: {xpath: '//*[@id="remissionCode"]'},
    amount: {xpath: '//*[@id="amount"]'},
  },


  verifyRemissionPage(fee_code) {
    I.see('Add remission');
    I.see('Enter remission for reference. For example: HWF-A1B-23C');
    I.see('Add remission to ' + fee_code + ':' + PaybubbleStaticData.fee_description[fee_code]);
    I.see('How much does the applicant need to pay?');
    I.see('Submit');
  },

  verifyRemissionConfirmationPage(fee_code, amount) {

    I.see('Are you sure you want to add remission to this fee?');
    I.see('Remission code:');
    I.see('Fee code:');
    I.see('Fee description:');
    I.see('Amount the applicant must pay:');
    I.see('HWF-A1B-23C');
    I.see(fee_code);
    I.see(PaybubbleStaticData.fee_description[fee_code]);
    I.see(amount);
    I.see('Confirm');
  },

  processRemission(fee_code, amount) {
    this.verifyRemissionPage(fee_code);
    I.fillField(this.locators.remission_code, 'HWF-A1B-23C');
    I.fillField(this.locators.amount, amount);
    I.click('Submit')
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.verifyRemissionConfirmationPage(fee_code, amount)
  },

  cancelprocessRemission() {
    I.click('Cancel')
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  noRemissionCodeOrAmount() {
    I.click('Submit')
    I.see('Enter a remission code')
    I.see('Enter a amount')
  },

  remissionAmountExceed(amount) {
    I.fillField(this.locators.remission_code, 'HWF-A1B-23C');
    I.fillField(this.locators.amount, amount);
    I.click('Submit')
    I.see('The remission amount must be less than the total fee')
  },


}
