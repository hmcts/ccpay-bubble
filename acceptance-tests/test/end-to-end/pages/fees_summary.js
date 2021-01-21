'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const PaybubbleStaticData = require('../pages/paybubble_static_data');

const { I } = inject();

module.exports = {

  verifyFeeSummaryBulkScan(feeCode) {
    I.see('Fee Summary');
    I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see('Fee amount');
    I.see('Volume');
    I.see('Fee total');
    I.see('Remission amount');
    I.see('Total after remission');
    I.see('Total payment');
    I.see('Total outstanding amount');
    I.dontSee('What service is this fee for?');
  },

  allocateBulkPayment() {
    I.click('Allocate payment');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  addFeeFromSummary() {
    I.click('Add a new fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  deductRemission(feeCode) {
    I.click({ xpath: `//ccpay-fee-summary//*[text()='${feeCode}']/../td[4]//*[text()=' Deduct remission ']` });
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  removeFeesFromSummary() {
    I.click('remove fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Are you sure you want to delete this fee?');
    I.click('Remove');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }


};
