'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');
const faker = require('faker');

const {I} = inject();

const RANDOM_NUMBER = 9999999999999999;

const CCDNumber = faker.random.number(RANDOM_NUMBER);

module.exports =  {
  add_fees(amount)
  {
        I.see('Search for a fee');
        I.fillField({ css: '[type="text"]' }, amount);
        I.click('Search');
        I.wait(CCPBConstants.fiveSecondWaitTime);
        I.click('Jurisdiction 1');
        I.click({ css: '#family' });
        I.click('Jurisdiction 2');
        I.click({ css: '#family_court' });
        I.click('Apply filters');
        I.click('Select');
        I.wait(CCPBConstants.fiveSecondWaitTime);
  }
}
