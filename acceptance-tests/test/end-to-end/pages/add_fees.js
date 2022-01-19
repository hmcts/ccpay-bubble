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
    I.see('Add FEE0002');
    I.see('When was this application received?');
    I.click(this.locatoramountselect.amount_select);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  }
};
