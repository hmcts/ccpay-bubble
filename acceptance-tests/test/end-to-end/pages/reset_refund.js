'use strict';
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const {I} = inject();

module.exports = {

  verifyResetRefundPage (refundReference) {
    I.see('When you click Submit, the system will:');
    I.see(`Close current refund reference number ${refundReference}`);
    I.see('Reissue refund with a new reference number');
    I.see('Issue a new Offer and Contact notification for the reissued refund');
    I.see('Cancel')
    I.click('Cancel');
    I.waitForText('Reset Refund', '5');
    I.click('Reset Refund');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Submit');
  }

}
