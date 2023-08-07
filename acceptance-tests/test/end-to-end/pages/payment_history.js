'use strict';
const testConfig = require('config');

const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');

const PaybubbleStaticData = require('../pages/paybubble_static_data');

const { I } = inject();

module.exports = {
  // done
  navigateToPaymentHistory() {
    I.click('Payment history');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  navigateToReceiptRefs(receiptRef) {
    I.click(receiptRef);
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  verifyPaymentHistoryPage(paymentAmount, paymentReference) {
    I.see('Payments');
    I.see('Status');
    I.see('Amount');
    I.see('Date');
    I.see('Payment reference');
    I.see('Success');
    I.see(paymentAmount);
    I.see(paymentReference);
    I.see('Review');

    I.see('Refunds');
    I.see('Status');
    I.see('Amount');
    I.see('Date');
    I.see('Refund reference');
    I.see('Reason');
    I.see('No refunds recorded');

    I.click('//a[.=\'Review\']');
  },


  validatePaymentHistoryPage() {
    I.dontSee('Total payments');
    I.see('Unprocessed payments');
    I.dontSee('Select');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.dontSee('Fees');
    I.dontSee('Code');
    I.dontSee('Description');
    I.dontSee('Volume');
    I.dontSee('Fee amount');
    I.dontSee('Calculated amount');
    I.dontSee('Amount due');
    I.dontSee('Action');
    I.dontSee('No fees recorded');
    I.see('Processed payments');
    I.see('Payment reference');
    I.see('Channel');
    I.see('Status');
  },

  validateCCDPaymentDetailsPage() {
    I.see('Payment details');
    I.see('Payment reference');
    I.see('Payment amount');
    I.see('Payment asset number(DCN)');
    I.see('Banked date');
    I.see('Fee and remission details');
    I.see('Description');
    I.see('Fee code');
    I.see('Fee amount');
    I.see('Allocated amount');
    I.see('Payment method');
    // I.see('Method');
    // I.see('Type');
    I.see('Payment status history');
    // I.see('Amount');
    // I.see('Status');
    // I.see('Date');
  },

  validateTransferredUnidentifedPaymentDetailsPage() {
    I.see('Payment details');
    I.see('Payment reference');
    I.see('Payment amount');
    I.see('Payment asset number(DCN)');
    I.see('Banked date');
    I.dontSee('Fee and remission details');
    I.dontSee('Description');
    I.dontSee('Fee code');
    I.dontSee('Fee amount');
    I.dontSee('Allocated amount');
    I.see('Payment method');
    // I.see('Method');
    // I.see('Type');
    I.dontSee('Payment status history');
    // I.dontSee('Amount');
    // I.dontSee('Status');
    // I.dontSee('Date');
  },

  validatePaymentDetailsForPartialPayment(paymentReference) {
    I.see('Payment details');
    I.see('Payment reference');
    I.see('Payment amount');
    I.see('Payment method');
    I.see('Type');
    I.see('PBA account name');
    I.see('PBA number');
    I.see('Customer internal reference');
    I.see('£273.00');
    I.see(`${paymentReference}`);
    I.see('2023-');
  },


  validateCcdPaymentDetails(receiptReference, amount, dcnNumber, status, paymentMethod, feeCode) {
    this.validateCCDPaymentDetailsPage();
    I.see(receiptReference);
    I.see(amount);
    // I.see(dcnNumber);
    I.see(status);
    // if (testConfig.e2e.testForCrossbrowser !== 'true') {
    //   I.see(paymentMethod);
    // }
    I.see(paymentMethod);
    I.see(feeCode);
    I.see(PaybubbleStaticData.fee_description[feeCode]);
  },

  validateTransferredUnidentifiedPaymentDetails(receiptReference, amount,
    dcnNumber, paymentMethod) {
    this.validateTransferredUnidentifedPaymentDetailsPage();
    I.see(receiptReference);
    I.see(amount);
    // I.see(dcnNumber);
    // if (testConfig.e2e.testForCrossbrowser !== 'true') {
    //   I.see(paymentMethod);
    // }
    I.see(paymentMethod);
  }
};
