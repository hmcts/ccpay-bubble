'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');


const { I } = inject();


module.exports = {
  locators: { fee_search: { xpath: '//*[@id="fee-search"]' } },
  locatoramountselect: { amount_select: { xpath: '//*[@id="fee-version0"]' } },

  addFees(amount, jurisdiction1, jurisdiction2) {
    I.see('Search for a fee');
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click('Jurisdiction 1');
    I.click({ css: '#'.concat(jurisdiction1) });
    I.click('Jurisdiction 2');
    I.click({ css: '#'.concat(jurisdiction2) });
    I.click('Apply filters');
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  addFeesAmount(amount, jurisdiction1, jurisdiction2) {
    I.see('Search for a fee');
    I.see('For example: Application or £10.00. You don\'t need to use the whole description or amount.');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    I.wait(CCPBConstants.tenSecondWaitTime);
    I.click('Jurisdiction 1');
    I.click({ css: '#'.concat(jurisdiction1) });
    I.click('Jurisdiction 2');
    I.click({ css: '#'.concat(jurisdiction2) });
    I.click('Apply filters');
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }
};
