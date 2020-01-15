'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');
const faker = require('faker');

const CCDNumberprobate1 = faker.random.number(9999999999999999);
const CCDNumberprobate2 = faker.random.number(9999999999999999);
const CCDNumberprobate3 = faker.random.number(9999999999999999);
const CCDNumberprobate4 = faker.random.number(9999999999999999);
const CCDNumberprobate5 = faker.random.number(9999999999999999);
const CCDNumberprobate6 = faker.random.number(9999999999999999);
const CCDNumberprobate7 = faker.random.number(9999999999999999);
const CCDNumberprobate8 = faker.random.number(9999999999999999);
const CCDNumberprobate9 = faker.random.number(9999999999999999);
const CCDNumberprobate10 = faker.random.number(9999999999999999);
const CCDNumberprobate11 = faker.random.number(9999999999999999);

const CCDNumberdivorce1 = faker.random.number(9999999999999999);
const CCDNumberdivorce2 = faker.random.number(9999999999999999);
const CCDNumberdivorce3 = faker.random.number(9999999999999999);
const CCDNumberdivorce4 = faker.random.number(9999999999999999);
const CCDNumberdivorce5 = faker.random.number(9999999999999999);
const CCDNumberdivorce6 = faker.random.number(9999999999999999);
const CCDNumberdivorce7 = faker.random.number(9999999999999999);
const CCDNumberdivorce8 = faker.random.number(9999999999999999);
const CCDNumberdivorce9 = faker.random.number(9999999999999999);
const CCDNumberdivorce10 = faker.random.number(9999999999999999);
const CCDNumberdivorce11 = faker.random.number(9999999999999999);
const CCDNumberdivorce12 = faker.random.number(9999999999999999);
const CCDNumberdivorce13 = faker.random.number(9999999999999999);

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

  clickCaseTransaction() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Logout');
    this.click('Case Transaction');
    this.wait(CCPBConstants.fiveSecondWaitTime);
  },

  Logout1() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Logout');
    this.click('Logout');
    this.wait(CCPBConstants.fiveSecondWaitTime);
  },

  onefeeforpayment() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce1);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
   // this.click({ css: '[type="submit"]' });
  //  this.wait(CCPBConstants.fiveSecondWaitTime);
  //  this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  multiplefeesforpayment() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce2);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('650.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  //  this.click({ css: '[type="submit"]' });
//    this.wait(CCPBConstants.fiveSecondWaitTime);
//    this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
 //   this.seeElement('div.one-half:nth-child(2)');
  },

  partialremissionforonefeeforpayment() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce3);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
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
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  //  this.click({ css: '[type="submit"]' });
  //  this.wait(CCPBConstants.fiveSecondWaitTime);
   // this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
   // this.wait(CCPBConstants.fiveSecondWaitTime);
   // this.seeElement('div.one-half:nth-child(2)');
  },

  partialremissionassignforonefeenotassignforanotherfee() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce4);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
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
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  //  this.click({ css: '[type="submit"]' });
    //  this.wait(CCPBConstants.fiveSecondWaitTime);
    // this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
    // this.wait(CCPBConstants.fiveSecondWaitTime);
    // this.seeElement('div.one-half:nth-child(2)');
  },

  fullremissionforonefee() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce5);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
  },

  fullremissionforonefeenotforanotherfee() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce6);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
    this.see('550.00');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
 //   this.click({ css: '[type="submit"]' });
 //   this.wait(CCPBConstants.fiveSecondWaitTime);
 //   this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  fullremissionforonefeeandonefeeforpartialremission() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce7);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(2) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('99.99');
    this.see('0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('0.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  //  this.click({ css: '[type="submit"]' });
  },

  fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce8);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(2) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('99.99');
    this.see('0.01');
    this.click('Add a new fee');
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.01');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
 //   this.click({ css: '[type="submit"]' });
 //   this.wait(CCPBConstants.fiveSecondWaitTime);
  //  this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  multiplefeesforpaymentandonefeeremoving() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce9);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]'}, '100');
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
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
   // this.click({ css: '[type="submit"]' });
  //  this.wait(CCPBConstants.fiveSecondWaitTime);
 //   this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  partialremissionformorethanfeeamount() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce10);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '600');
    this.click({ css: 'button.button' });
  //  this.click({ css: 'button.button:nth-child(4)' });
    this.see('The remission amount must be less than the total fee');
  },

  onefeeforprobate() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce11);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, 'copy');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: '#jurisdiction1Select' });
    this.click({ css: '#family' });
    this.click({ css: '#jurisdiction2Select' });
    this.click({ css: '#probate_registry' });
    this.click({ css: '[type="submit"]' });
    this.click({ css: '.column-two-thirds > pay-fee-list:nth-child(1) > table:nth-child(1) > tbody:nth-child(2) > tr:nth-child(4) > td:nth-child(4) > a:nth-child(1)' });
    this.fillField({ css: '#volumeAmount'}, '100');
    this.click({ css: '[type="submit"]' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('£1.50');
    this.see('100');
    this.see('£150.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('150.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
 //   this.click({ css: '[type="submit"]' });
//    this.wait(CCPBConstants.fiveSecondWaitTime);
 //   this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  anotherfeeforprobate() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce12);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '215');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: '#jurisdiction1Select' });
    this.click({ css: '#family' })
    this.click({ css: '#jurisdiction2Select' });
    this.click({ css: '#probate_registry' });
    this.click({ css: '[type="submit"]' });
    this.click('Select');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('215.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
 //   this.click({ css: '[type="submit"]' });
 //   this.wait(CCPBConstants.fiveSecondWaitTime);
 //   this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
 //   this.seeElement('div.one-half:nth-child(2)');
  },

  anotherfeeforprobate2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberdivorce13);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '155');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: '#jurisdiction1Select' });
    this.click({ css: '#family' })
    this.click({ css: '#jurisdiction2Select' });
    this.click({ css: '#probate_registry' });
    this.click({ css: '[type="submit"]' });
    this.click('Select');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('155.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  },
  onefeeforpayment2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate1);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  //  this.click({ css: '[type="submit"]' });
  //  this.wait(CCPBConstants.fiveSecondWaitTime);
  //  this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  multiplefeesforpayment2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate2);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('650.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
 //   this.click({ css: '[type="submit"]' });
  //  this.wait(CCPBConstants.fiveSecondWaitTime);
 //   this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  partialremissionforonefeeforpayment2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate3);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('£550.00');
    this.see('£549.99');
    this.see('0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('0.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  //  this.click({ css: '[type="submit"]' });
    //  this.wait(CCPBConstants.fiveSecondWaitTime);
    // this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
    // this.wait(CCPBConstants.fiveSecondWaitTime);
    // this.seeElement('div.one-half:nth-child(2)');
  },

  partialremissionassignforonefeenotassignforanotherfee2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate4);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('550.00');
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
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
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('100.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Case Transaction');
    this.wait(10);
  },

  fullremissionforonefee2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate5);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
  //  this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
  },

  fullremissionforonefeenotforanotherfee2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate6);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
    this.see('550.00');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.00');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
    this.wait(CCPBConstants.fiveSecondWaitTime);
  //  this.click('Case Transaction');
  },

  fullremissionforonefeeandonefeeforpartialremission2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate7);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(2) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('£100.00');
    this.see('£99.99');
    this.see('£0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'button.button' });
    this.see('0.01');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
 //   this.click('Case Transaction');
  },

  fullremissionforonefeeandonefeeforpartialremissionandonefeeforfullamount2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate8);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.click({ css: 'button.govuk-button:nth-child(1)' });
    this.click({ css: '.summary' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('RM');
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '100');
    this.click('Search');
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '0.01');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    // this.click({ css: 'button.button' });
    this.click({ css: '.govuk-main-wrapper > div:nth-child(4) > div:nth-child(3) > div:nth-child(2) > button:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('100.00');
    this.see('99.99');
    this.see('0.01');
    this.click('Add a new fee');
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.click({ css: 'div.govuk-radios__item:nth-child(1) > input:nth-child(1)' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'button.button' });
    this.see('550.01');
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
  },

  multiplefeesforpaymentandonefeeremoving2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate9);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click('Add a new fee');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.fillField({ css: '[type="text"]'}, '100');
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
    this.fillField({ css: 'section.form-field:nth-child(3) > div:nth-child(2) > input:nth-child(1)'}, 'Krishna Kishore Nuthalapati');
    this.fillField({ css: 'section.form-field:nth-child(4) > div:nth-child(2) > input:nth-child(1)'}, '38 Highfield Road');
    this.fillField({ css: 'section.form-field:nth-child(5) > div:nth-child(2) > input:nth-child(1)'}, 'Feltham');
    this.fillField({ css: 'section.form-field:nth-child(6) > div:nth-child(2) > input:nth-child(1)'}, 'TW13 4DA');
 //   this.click({ css: '[type="submit"]' });
  //  this.wait(CCPBConstants.fiveSecondWaitTime);
 //   this.seeElement('div.one-full:nth-child(3) > div:nth-child(2) > input:nth-child(1):disabled');
  //  this.seeElement('div.one-half:nth-child(2)');
  },

  partialremissionformorethanfeeamount2() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate10);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'a.button' });
    this.fillField({ css: '[type="text"]'}, '550');
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'tr:nth-child(1) > td:nth-child(4) > a' });
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.click({ css: 'div.govuk-radios__item:nth-child(2) > input:nth-child(1)' });
    this.click({ css: 'tr.govuk-table__row:nth-child(4) > td:nth-child(3) > a:nth-child(1)' });
    this.fillField({ css: '#remissionCode'}, 'HWF-A1B-23C');
    this.fillField({ css: '#amount'}, '600');
    this.click({ css: 'button.button' });
    this.click({ css: 'button.button:nth-child(4)' });
    this.see('Error in processing the request');
  },

  searchForCCDdummydata() {
    this.fillField({ css: '[type="text"]'}, CCDNumberprobate11);
    this.click('Search');
    this.wait(CCPBConstants.fiveSecondWaitTime);
    this.see('No matching cases found');
  },

  searchForCorrectCCDNumber() {
    this.fillField({ css: '[type="text"]'}, '1516881806468540');
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
