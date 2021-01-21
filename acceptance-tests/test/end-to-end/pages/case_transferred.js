'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const {I} = inject();

module.exports = {
  locators: {
    transferred_reason: {xpath: '//*[@id="reason"]'},
    receiving_site_id: {xpath: '//*[@id="responsibleOffice"]'},
  },


  validateTransferredPage(dcn_number, amount, method) {
    I.see('Mark payment as transferred');
    I.see('Payment asset number (DCN)');
    I.see('Banked date');
    I.see('Amount');
    I.see('Method');
    I.see('Reason for payment being marked as transferred');
    I.see("Receiving Site ID (Receiving court/Bulk centre site ID)");
    I.see(dcn_number);
    I.see(amount);
    I.see(method);
  },


  confirmPayment(transferred_reason, site_id) {
    I.click('Confirm');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  inputTransferredReason(transferred_reason) {
    I.fillField(this.locators.transferred_reason, transferred_reason);
  },

  selectSiteId(site_id) {
    I.selectOption(this.locators.receiving_site_id, site_id);
  },

  validateTransferredConfirmationPage(transferred_reason, site_id) {
    I.see('Reason');
    I.see('Receiving site ID');
    I.see('Are you sure you want to mark this payment as transferred?');
    I.see(transferred_reason);
    I.see(site_id);
  },

  validateAndConfirmTransferred(transferred_reason, site_id) {
    this.inputTransferredReason(transferred_reason);
    this.selectSiteId(site_id);
    this.confirmPayment();
    I.wait(CCPBConstants.fiveSecondWaitTime);
    this.validateTransferredConfirmationPage(transferred_reason, site_id)

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
  },
}
