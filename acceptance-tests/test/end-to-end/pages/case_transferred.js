'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {
  locators: {
    transferred_reason: { xpath: '//*[@id="reason"]' },
    receiving_site_id: { xpath: '//*[@id="responsibleOffice"]' }
  },


  validateTransferredPage(dcnNumber, amount, method) {
    I.see('Mark payment as transferred');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Reason for payment being marked as transferred');
    I.see('Receiving Site ID (Receiving court/Bulk centre site ID)');
    I.see(dcnNumber);
    I.see(amount);
    I.see(method);
  },


  confirmPayment() {
    I.click('Confirm');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  inputTransferredReason(transferredReason) {
    I.fillField(this.locators.transferred_reason, transferredReason);
  },

  selectSiteId(siteId) {
    I.selectOption(this.locators.receiving_site_id, siteId);
  },

  validateTransferredConfirmationPage(transferredReason, siteId) {
    I.see('Reason');
    I.see('Receiving site ID');
    I.see('Are you sure you want to mark this payment as transferred?');
    I.see(transferredReason);
    I.see(siteId);
  },

  validateAndConfirmTransferred(transferredReason, siteId) {
    this.inputTransferredReason(transferredReason);
    this.selectSiteId(siteId);
    this.confirmPayment();
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransferredConfirmationPage(transferredReason, siteId);
  },

  cancelTransferred() {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Are you sure you want to cancel?');
    I.click('Yes');
  },

  cancelTransferredReason() {
    I.click('Cancel');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.see('Are you sure you want to cancel?');
    I.click('Yes');
  },

  whenNoReasonAndSiteid() {
    I.see('Enter a reason for marking this payment as transferred.');
    I.see('Please select Receiving Site ID');
  },

  whenReasonLessThanLimit() {
    I.see('Reason should be at least 3 characters.');
  }
};
