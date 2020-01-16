'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');
const faker = require('faker');

const RANDOM_NUMBER = 9999999999999999;

const CCDNumber = faker.random.number(RANDOM_NUMBER);

module.exports = () => actor({
  // done
  login(email, password) {
    this.amOnPage('/');
    this.retry(CCPBConstants.retryCountForStep).waitForElement('#username', CCPBConstants.thirtySecondWaitTime);
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.waitForElement({ css: '[type="submit"]' }, CCPBConstants.thirtySecondWaitTime);
    this.click({ css: '[type="submit"]' });
  },

  Logout() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Logout');
    this.click('Logout');
    this.wait(CCPBConstants.fiveSecondWaitTime);
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
    pause();
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

  searchForCCDdummydata() {
    this.fillField({ css: '[type="text"]' }, '3456789098765434');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('No matching cases found');
  },

  searchForCorrectCCDNumber() {
    this.fillField({ css: '[type="text"]' }, '1516881806468540');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('Case transactions');
    this.see('1516-8818-0646-8540');
    this.see('Total payments');
    this.see('Total remissions');
    this.see('Description');
    this.see('Volume');
    this.see('Fee amount');
    this.see('Calculated amount');
    this.see('Group amount outstanding');
    this.see('£0.00');
  }
});
