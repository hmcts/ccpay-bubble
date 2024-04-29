'use strict';
const { Console } = require('console');
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');


const { I } = inject();


module.exports = {
  locators: {
  fee_search: { xpath: '//*[@id="fee-search"]' },
  locatoramountselect: { amount_select: { xpath: '//*[@id="fee-version0"]' } },
  search_for_fee_text: {xpath:'//*[@id="content"]//h1'},
  allocate_payment: {xpath:'//button[@class="button govuk-!-margin-right-1"]'},
  // help_with_fee: {xpath:'//*[text()=" Help with Fees (HWF) application declined "]//../input'},
  help_with_fee: {id:'otherDeduction'},
  // i_have_put_a_stop_on_case: {xpath:'//*[text()=" I have put a stop on the case and contacted the applicant requesting the balance of payment "]//../input'},
  i_have_put_a_stop_on_case: {id:'other'},
  add_Notes: {id:'moreDetails'},
  confirm_button: {xpath:'//button[@type="submit"]'}
},

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
    I.see('Jurisdiction 2');
    if (jurisdiction2 === 'family_court'){
      I.see('Family Court');
    }
    I.see('Family Court');
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);
  },

  addFeesOverPayment(amount) {
    I.see('Search for a fee');
    I.wait(CCPBConstants.tenSecondWaitTime);
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime, 10);
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.allocate_payment);
    I.wait(CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.help_with_fee);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.i_have_put_a_stop_on_case);
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click(this.locators.add_Notes);
    I.fillField(this.locators.add_Notes,'Test OverPayment');
    I.click(this.locators.confirm_button);

  },
};
