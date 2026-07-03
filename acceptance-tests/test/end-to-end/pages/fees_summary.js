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
    if (allocatePaymentFlag) {
      I.see('Allocate payment');
      I.click('Allocate payment');
    }
  },

  verifyFeeSummaryTelephonyPayment(ccdCaseNumberFormatted, feeCode, amount, takePaymentFlag) {
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
    if (takePaymentFlag) {
      I.see('Take payment');
      I.click('Take payment');
    }
  },


  verifyFeeSummaryAfterRemission(feeCode, feeAmount, remissionAmount, totalAfterRemission) {
    I.see('Summary');
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see('Amount');
    I.see(`£${feeAmount}`);
    I.see('Description');
    I.see('Quantity');
    I.see('Remission HWF-A1B-23C');
    I.see(`£${remissionAmount}`);
    I.see('Total to pay:');
    I.see(`£${totalAfterRemission}`);
    I.dontSee('What service is this fee for?');
  },

  allocateBulkPayment() {
    I.waitForClickable('Allocate payment', CCPBConstants.tenSecondWaitTime);
    I.click('Allocate payment');
    I.waitForText('Confirm allocation', CCPBConstants.tenSecondWaitTime);
  },

  addFeeFromSummary() {
    I.waitForClickable('Add fee', CCPBConstants.tenSecondWaitTime);
    I.click('Add fee');
    I.waitForText('Search for a fee', CCPBConstants.tenSecondWaitTime);
  },

  deductRemission() {
    I.waitForClickable('Add help with fees or remission', CCPBConstants.tenSecondWaitTime);
    I.click('Add help with fees or remission');
    I.waitForText('Add remission', CCPBConstants.tenSecondWaitTime);
  },
  removeFeesFromSummary() {
    I.click('remove fee');
    I.waitForText('Are you sure you want to delete this fee?', CCPBConstants.tenSecondWaitTime);
    I.click('Remove');
    I.waitForText('Summary', CCPBConstants.tenSecondWaitTime);
  }


};
