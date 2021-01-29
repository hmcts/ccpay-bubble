'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const PaybubbleStaticData = require('../pages/paybubble_static_data');

const { I } = inject();

module.exports = {

  verifyConfirmAssociationFullPayment(feeCode, amount) {
    I.see('Confirm association');
    I.see('Amount to be allocated: '.concat(amount));
    I.see('Code');
    I.see('Description');
    I.see('Volume');
    I.see('Fee amount');
    I.see('Calculated amount');
    I.see('Amount Due');
    I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see(amount);
    I.see('Amount left to be allocated £0.00');
    I.see('Confirm');
  },

  verifyConfirmAssociationShortfallPayment(feeCode, amount, shortfallAmount) {
    I.see('Confirm association');
    I.see('Amount to be allocated: '.concat(amount));
    I.see('Code');
    I.see('Description');
    I.see('Volume');
    I.see('Fee amount');
    I.see('Calculated amount');
    I.see('Amount Due');
    I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see(amount);
    I.see('There is a shortfall of '.concat((shortfallAmount)));
    I.see('Provide a reason');
    I.see('Help with Fees (HWF) application declined');
    I.see('Incorrect payment received');
    I.see('Other');
    I.see('Provide an explanatory note');
    I.see('I have put a stop on the case and contacted the applicant requesting the balance of payment');
    I.see('I have put a stop on the case. The applicant needs to be contacted to request the balance of payment');
    I.see('Enter your name');
    I.see('Confirm');
  },

  verifyConfirmAssociationSurplusPayment(feeCode, amount, surplusAmount) {
    I.see('Confirm association');
    I.see('Amount to be allocated: '.concat(amount));
    I.see('Code');
    I.see('Description');
    I.see('Volume');
    I.see('Fee amount');
    I.see('Calculated amount');
    I.see('Amount Due');
    I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
    I.see(amount);
    I.see('There is a surplus of '.concat(surplusAmount));
    I.see('Provide a reason. This will be used in the Refund process.');
    I.see('Help with Fees (HWF) awarded. Please include the HWF reference number in the explanatory note');
    I.see('Incorrect payment received');
    I.see('Unable to issue case');
    I.see('Other');
    I.see('Provide an explanatory note');
    I.see('Details in case notes. Refund due');
    I.see('Details in case notes. No refund due');
    I.see('No case created. Refund due');
    I.see('Enter your name');
    I.see('Confirm');
  },

  cancelPayment() {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }

};
