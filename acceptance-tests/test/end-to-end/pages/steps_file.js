'use strict';
/* eslint-disable no-magic-numbers */
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');
const PaybubbleStaticData = require('../pages/paybubble_static_data');

// const testConfig = require('config');

const numUtils = require('../helpers/number_utils');

const miscUtils = require('../helpers/misc');

const searchCase = require('../pages/case_search');

const stringUtils = require('../helpers/string_utils');

const bulkScanApiCalls = require('../helpers/utils');
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');
const AddFees = require('../pages/add_fees');
const FeesSummary = require('../pages/fees_summary');
const Remission = require('../pages/remission');
// const numberTwo = 2;

module.exports = () => actor({

  returnBackToSite() {
    this.amOnPage('/');
    this.wait(CCPBConstants.twoSecondWaitTime);
  },

  login(email, password, uri = '/') {
    this.amOnPage(uri);
    this.wait(CCPBConstants.twoSecondWaitTime);
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.wait(CCPBConstants.twoSecondWaitTime);
    this.click({ css: '[type="submit"]' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.AcceptPayBubbleCookies();
  },

  // Logout() {
  //   this.wait(CCPBConstants.fiveSecondWaitTime);
  //   this.click('Logout');
  //   this.wait(CCPBConstants.fiveSecondWaitTime);
  // },

  async Logout() {
    this.scrollPageToTop();
    await this.click('Logout');
  },

  AcceptPayBubbleCookies() {
    this.waitForText('Cookies on ccpay-bubble', 5);
    this.click({ css: 'button.cookie-banner-accept-button' });
    this.click({ css: 'div.cookie-banner-accept-message > div.govuk-button-group > button' });
    this.wait(CCPBConstants.twoSecondWaitTime);
  },

  RejectPayBubbleCookies() {
    this.waitForText('Cookies on ccpay-bubble', 5);
    this.click({ css: 'button.cookie-banner-reject-button' });
    this.click({ css: 'div.cookie-banner-reject-message > div.govuk-button-group > button' });
    this.wait(CCPBConstants.twoSecondWaitTime);
  },

  onefeeforpayment() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  multiplefeesforpayment() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('650.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  partialremissionforonefeeforpayment() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('£550.00');
    this.see('£549.99');
    this.see('0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('0.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  partialremissionassignforonefeenotassignforanotherfee() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('£550.00');
    this.see('£549.99');
    this.see('0.01');
    this.see('100.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('100.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  fullremissionforonefee() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
  },

  fullremissionforonefeenotforanotherfee() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
    this.see('550.00');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  fullremissionforonefeeandonefeeforpartialremission() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(5) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('99.99');
    this.see('0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('0.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(5) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('99.99');
    this.see('0.01');
    this.click('Add a new fee');
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.01');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  multiplefeesforpaymentandonefeeremoving() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click('remove fee');
    this.click('button.button:nth-child(2)');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  partialremissionformorethanfeeamount() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '600');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.see('Error in processing the request');
  },

  onefeeforprobate() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, 'copy');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: '#jurisdiction1Select' });
    this.click({ css: '#family' });
    this.click({ css: '#jurisdiction2Select' });
    this.click({ css: '#probate_registry' });
    this.click({ css: '[type="submit"]' });
    this.click({ css: '.column-two-thirds > pay-fee-list:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(3) > td:nth-child(4) > a:nth-child(1)' });
    this.fillField({ css: '#volumeAmount' }, '100');
    this.click({ css: '[type="submit"]' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('£1.50');
    this.see('100');
    this.see('£150.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('150.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  anotherfeeforprobate() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '215');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: '#jurisdiction1Select' });
    this.click({ css: '#family' });
    this.click({ css: '#jurisdiction2Select' });
    this.click({ css: '#probate_registry' });
    this.click({ css: '[type="submit"]' });
    this.click('Select');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('215.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  anotherfeeforprobate2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '155');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: '#jurisdiction1Select' });
    this.click({ css: '#family' });
    this.click({ css: '#jurisdiction2Select' });
    this.click({ css: '#probate_registry' });
    this.click({ css: '[type="submit"]' });
    this.click('Select');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('155.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },
  onefeeforpayment2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  multiplefeesforpayment2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('650.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  partialremissionforonefeeforpayment2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('£550.00');
    this.see('£549.99');
    this.see('0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('0.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  partialremissionassignforonefeenotassignforanotherfee2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('£550.00');
    this.see('£549.99');
    this.see('0.01');
    this.see('100.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('100.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  fullremissionforonefee2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
  },

  fullremissionforonefeenotforanotherfee2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
    this.see('550.00');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  fullremissionforonefeeandonefeeforpartialremission2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(5) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('99.99');
    this.see('0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('0.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(5) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('99.99');
    this.see('0.01');
    this.click('Add a new fee');
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.01');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  multiplefeesforpaymentandonefeeremoving2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]' }, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click('remove fee');
    this.click('button.button:nth-child(2)');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)' }, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)' }, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)' }, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)' }, 'TW13 4DA');
  },

  partialremissionformorethanfeeamount2() {
    this.fillField({ css: '[type="text"]' }, CCDNumber);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]' }, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode' }, 'HWF-A1B-23C');
    this.fillField({ css: '#amount' }, '600');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.see('Error in processing the request');
  },

  async searchForCCDdummydata() {
    const ccdNumber = numUtils.getRandomNumber(CCPBConstants.CCDCaseNumber, true);
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
    await miscUtils.ccdSearchEnabledValidation(searchCase, this, ccdCaseNumberFormatted);
    this.see('No matching cases found');
  },

  async searchForCorrectCCDNumber() {
    const ccdNumber = await bulkScanApiCalls.createACCDCaseForProbate();
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
    await miscUtils.multipleSearch(searchCase, this, ccdNumber);
    this.see('Case transactions');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.see('Total payments');
    this.see('Total remissions');
    this.see('Amount due');
    this.see('Unallocated payments');
    this.see('Unallocated payments');
    this.see('£0.00');
  },

  async caseforTelephonyFlow() {
    const ccdNumber = await bulkScanApiCalls.createACCDCaseForProbate();
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
    await miscUtils.multipleSearch(searchCase, this, ccdCaseNumberFormatted);
    // this.waitInUrl(`/payment-history/${ccdNumber}?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Disable&isTurnOff=Disable&isOldPcipalOff=Enable&isNewPcipalOff=Disable`, CCPBConstants.nineSecondWaitTime);
    this.wait(CCPBConstants.nineSecondWaitTime);
    this.see('Case transactions');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.click('Create service request and pay');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('Search for a fee');
    await this.runAccessibilityTest();
    this.fillField({ css: '[type="text"]' }, '300');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    await this.runAccessibilityTest();
    this.click('Jurisdiction 1');
    this.click({ css: '#family' });
    this.click('Jurisdiction 2');
    this.click({ css: '#probate_registry' });
    this.click('Apply filters');
    this.click('Select');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    let numOfElements = await this.grabNumberOfVisibleElements('//input[@id=\'fee-version0\']');
    if(numOfElements) {
      this.click('//input[@id=\'fee-versions\']');
      this.click('Continue');
      this.wait(CCPBConstants.fiveSecondWaitTime);
    }
    this.see('Add fee');
    await this.runAccessibilityTest();
    this.see('Summary');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.see('Description');
    this.see('Quantity');
    this.see('Amount');
    this.see('Add fee');
    this.see(PaybubbleStaticData.fee_description.FEE0219);
    this.see('£300.00');
    this.see('Total to pay: £300.00');
    this.click('Remove');
    this.see('Are you sure you want to delete this fee?');
    await this.runAccessibilityTest();
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Remove');
    this.wait(CCPBConstants.fiveSecondWaitTime);
  },

  async AmountDueCaseForTelephonyFlow() {
    const ccdNumber = await bulkScanApiCalls.createACCDCaseForProbate();
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
    await miscUtils.multipleSearch(searchCase, this, ccdCaseNumberFormatted);
    // this.waitInUrl(`/payment-history/${ccdNumber}?selectedOption=CCDorException&dcn=null&view=case-transactions&takePayment=true&caseType=MoneyClaimCase&isBulkScanning=Enable&isStFixEnable=Disable&isTurnOff=Disable&isOldPcipalOff=Enable&isNewPcipalOff=Disable`, CCPBConstants.nineSecondWaitTime);
    this.see('Case transactions');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    // this.click('Take telephony payment');
    this.click('Create service request and pay');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('Search for a fee');
    this.fillField({ css: '[type="text"]' }, '300');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Jurisdiction 1');
    this.click({ css: '#family' });
    this.click('Jurisdiction 2');
    this.click({ css: '#probate_registry' });
    this.click('Apply filters');
    this.click('Select');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    let numOfElements = await this.grabNumberOfVisibleElements('//input[@id=\'fee-version0\']');
    if(numOfElements) {
      this.click('//input[@id=\'fee-versions\']');
      this.click('Continue');
      this.wait(CCPBConstants.fiveSecondWaitTime);
    }
    this.see('Add fee');
    this.click('Case Transaction');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    await miscUtils.multipleSearch(searchCase, this, ccdNumber);
    this.see('Case transactions');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.click('Take telephony payment');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('Summary');
    this.see(PaybubbleStaticData.fee_description.FEE0219);
    this.see('Amount');
    // this.see('Volume');
    this.see('Total to pay: £300.00');
    this.see('Remove');
    this.see('Add help with fees or remission');
    this.see('Quantity');
    this.see('Description');
    this.see('300.00');
    this.wait(CCPBConstants.fiveSecondWaitTime);
  },

  async partiallyPaidUpfrontRemissionCaseForTelephonyFlow() {
    const ccdNumber = await bulkScanApiCalls.createACCDCaseForProbate();
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
    await miscUtils.multipleSearch(searchCase, this, ccdCaseNumberFormatted);
    this.wait(CCPBATConstants.fiveSecondWaitTime);
    this.see('Case transactions');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.click('Create service request and pay');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    await AddFees.addFeesAmount('300.00', 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryTelephonyPayment(ccdCaseNumberFormatted, 'FEE0219', '300.00', false);
    FeesSummary.deductRemission();
    Remission.processRemission('FEE0219', '200');
    Remission.confirmProcessRemission();
    this.wait(CCPBATConstants.fiveSecondWaitTime);
    this.click('Case Transaction');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    await miscUtils.multipleSearch(searchCase, this, ccdNumber);
    this.wait(CCPBATConstants.fiveSecondWaitTime);
    this.see('Case transactions');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.see('Partially paid');
    this.click('Take telephony payment');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    FeesSummary.verifyFeeSummaryAfterRemission('FEE0219', '300.00', '100.00', '£200.00');
    this.click('Take payment');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.waitInUrl('pcipal', 2);
    this.click('Cancel');
    this.click('Finish Session');
  },

  async removeFeeFromCaseTransactionPageTelephonyFlow() {
    /* const randomNumber = numUtils.getRandomNumber(numberTwo);
    const ccdNumber = stringUtils.getTodayDateAndTimeInString() + randomNumber;*/
    const ccdNumber = await bulkScanApiCalls.createACCDCaseForProbate();
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdNumber);
    await miscUtils.multipleSearch(searchCase, this, ccdNumber);
    this.see('Case transaction');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.click('Create service request and pay');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('Search for a fee');
    this.fillField({ css: '[type="text"]' }, '300');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Jurisdiction 1');
    this.click({ css: '#family' });
    this.click('Jurisdiction 2');
    this.click({ css: '#probate_registry' });
    this.click('Apply filters');
    this.click('Select');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    let numOfElements = await this.grabNumberOfVisibleElements('//input[@id=\'fee-version0\']');
    if(numOfElements) {
      this.click('//input[@id=\'fee-versions\']');
      this.click('Continue');
      this.wait(CCPBConstants.fiveSecondWaitTime);
    }
    this.see('Summary');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.see('Description');
    this.see('Quantity');
    this.see('Amount');
    this.see('Add fee');
    this.see(PaybubbleStaticData.fee_description.FEE0219);
    this.see('300.00');
    this.see('Total to pay: £300.00');
    this.click('Case Transaction');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    await miscUtils.multipleSearch(searchCase, this, ccdNumber);
    await this.runAccessibilityTest();
    this.see('Case transaction');
    this.see('Case reference:');
    this.see(ccdCaseNumberFormatted);
    this.click('Take telephony payment');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Remove');
    this.see('Are you sure you want to delete this fee?');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Remove');
    this.wait(CCPBConstants.fiveSecondWaitTime);
  },

  /* async setUpRefund() {
    console.log('Starting the PBA Payment');
    const paymentDetails = await bulkScanApiCalls.createAPBAPayment('90.00');
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentReference = `${paymentDetails.paymentReference}`;
    console.info(ccdCaseNumber);
    console.info(paymentReference);
    console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    this.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(5);
    return paymentDetails;
  }*/
});
