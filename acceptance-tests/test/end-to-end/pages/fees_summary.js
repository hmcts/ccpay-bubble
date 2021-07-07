'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const PaybubbleStaticData = require('../pages/paybubble_static_data');

const { I } = inject();

module.exports = {

  verifyFeeSummaryBulkScan(feeCode) {
    I.see('Summary');
    // I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see('Amount');
    I.see('Quantity');
    I.see('Total to pay');
    I.see('Remove');
    I.see('Add help with fees or remission');
    I.see('Add fee');
    I.see('Allocate payment');
    I.dontSee('case reference');
  },

  verifyFeeSummaryAfterRemissionBulkScan(feeCode, remissionAmount, totalAfterRemission) {
    I.see('Summary');
    // I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see('Amount');
    // I.see('Volume');
    // I.see('Fee total');
    // I.see('Remission amount');
    I.see('Description');
    I.see('Quantity');
    I.see('Remission,HWF-A1B-23C');
    // I.see('Total after remission');
    I.see(remissionAmount);
    I.see('Total to pay:');
    // I.see('Total outstanding amount');
    I.see(totalAfterRemission);
    I.dontSee('What service is this fee for?');
  },

  allocateBulkPayment() {
    I.click('Allocate payment');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  addFeeFromSummary() {
    I.click('Add fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  deductRemission() {
    I.click('Add help with fees or remission');
    // I.click({ xpath: `//ccpay-fee-summary//*[text()='${feeCode}']/../td[4]//*[text()=' Deduct remission ']` });
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
