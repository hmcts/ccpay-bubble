'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const PaybubbleStaticData = require('../pages/paybubble_static_data');

const { I } = inject();

module.exports = {

  verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, feeCode, amount, allocatePaymentFlag) {
    I.see('Summary');
    I.see('Case reference:');
    I.see(`${ccdCaseNumberFormatted}`);
    I.see('Description');
    I.see('Quantity');
    I.see('Amount');
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see('1');
    I.see(`£${amount}`);
    I.see('Add fee');
    I.see('Total to pay:');
    I.see(`£${amount}`);
    I.see('Allocate payment');
    if (allocatePaymentFlag) {
      I.click('Allocate payment');
    }
  },

  verifyFeeSummaryAfterRemissionBulkScan(feeCode, feeAmount, remissionAmount, totalAfterRemission) {
    I.see('Summary');
    // I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see('Amount');
    I.see(feeAmount);
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
  },
  removeFeesFromSummary() {
    I.click('remove fee');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Are you sure you want to delete this fee?');
    I.click('Remove');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }


};
