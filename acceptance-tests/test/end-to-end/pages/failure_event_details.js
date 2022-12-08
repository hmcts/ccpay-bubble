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

  async verifyFailureDetailsPage() {
    I.see('FR-');
    I.see('RR001');
    I.see('RC-');
    I.see('£215.00');
    I.see('£10.00');
    I.see('AR1234556');
    I.see('Chargeback');
    I.see('28 Nov 2022');
    I.see('Yes');
    I.see('Failure');
    I.see('29 Nov 2022');
    I.click(this.locators.failure_events_page_back_button);
  },

  async verifyFailureDetailsPageForInitiatedEvent() {
    I.see('FR-');
    I.see('RR001');
    I.see('RC-');
    I.see('£215.00');
    I.see('£10.00');
    I.see('AR1234556');
    I.see('Chargeback');
    I.see('28 Nov 2022');
    I.see('Yes');
    I.Logout();
  },

  async verifyFailureDetailsPageForBounceBack() {
    I.see('FR-');
    I.see('RR001');
    I.see('RC-');
    I.see('£250.00');
    I.see('£250.00');
    I.see('AR1234556');
    I.see('Bounced Cheque');
    I.see('28 Nov 2022');
    I.see('Success');
    I.see('29 Nov 2022');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.failure_events_page_back_button);
  },

  async verifyFailureDetailsPageForInitiatedEventForBounceBack() {
    I.see('FR-');
    I.see('RR001');
    I.see('RC-');
    I.see('£250.00');
    I.see('£250.00');
    I.see('AR1234556');
    I.see('Bounced Cheque');
    I.see('28 Nov 2022');
    I.Logout();
  }
};
