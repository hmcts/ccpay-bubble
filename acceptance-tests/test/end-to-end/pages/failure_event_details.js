'use strict';
const testConfig = require('config');

const PaybubbleStaticData = require('./paybubble_static_data');

const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');

const stringUtils = require('../helpers/string_utils');

const { I } = inject();

module.exports = {

  locators: {
    failure_events_page_back_button: { xpath: '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-payment-view/div/div[1]/ol/li/a' },
  },

  async verifyFailureDetailsPage(paymentRcRef,failureRef, todayDate) {
    I.see(`${failureRef}`);
    I.see('RR001');
    I.see(`${paymentRcRef}`);
    I.see('£215.00');
    I.see('£100.00');
    I.see('AR1234556');
    I.see('Chargeback');
    I.see(`${todayDate}`);
    I.see('Yes');
    I.see('Failure');
    I.click(this.locators.failure_events_page_back_button);
  },

  async verifyFailureDetailsPageForInitiatedEvent(paymentRcRef,failureRef, todayDate) {
    I.see(`${failureRef}`);
    I.see('RR001');
    I.see(`${paymentRcRef}`);
    I.see('£215.00');
    I.see('£100.00');
    I.see('AR1234556');
    I.see('Chargeback');
    I.see(`${todayDate}`);
    I.see('Yes');
    I.Logout();
  },

  async verifyFailureDetailsPageForBounceBack(paymentRcRef,failureRef, todayDate) {
    I.see(`${failureRef}`);
    I.see('RR001');
    I.see(`${paymentRcRef}`);
    I.see('£250.00');
    // I.see('£250.00');
    I.see('AR1234556');
    I.see('Bounced Cheque');
    I.see(`${todayDate}`);
    I.see('Success');
    // I.see('22 Jul 2022');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.failure_events_page_back_button);
  },

  async verifyFailureDetailsPageForInitiatedEventForBounceBack(paymentRcRef,failureRef, todayDate) {
    I.see(`${failureRef}`);
    I.see('RR001');
    I.see(`${paymentRcRef}`);
    I.see('£250.00');
    I.see('AR1234556');
    I.see('Bounced Cheque');
    I.see(`${todayDate}`);
    I.Logout();
  }
};
