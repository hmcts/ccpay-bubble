'use strict';
const { Console } = require('console');
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const { I } = inject();

async function selectCurrentFeeVersionIfShown() {
  const currentVersionOptions = [
    '//input[@value=\'currentVersion\']',
    '//input[@id=\'fee-version0\']',
    '//input[@id=\'fee-versions\']'
  ];

  for (const option of currentVersionOptions) {
    const visibleOptions = await I.grabNumberOfVisibleElements(option);
    if (visibleOptions) {
      I.click(option);
      I.click('Continue');
      I.wait(CCPBConstants.fiveSecondWaitTime);
      return;
    }
  }
}

async function clickSelectFeeResultWithRetry() {
  const selectLocator = '//a[normalize-space()="Select"] | //button[normalize-space()="Select"]';
  let visibleSelectButtons = await I.grabNumberOfVisibleElements(selectLocator);

  // Some fee searches can take longer to render results; wait once before failing.
  if (!visibleSelectButtons) {
    I.wait(CCPBConstants.tenSecondWaitTime);
    visibleSelectButtons = await I.grabNumberOfVisibleElements(selectLocator);
  }

  if (!visibleSelectButtons) {
    // If results are still not ready, trigger a fresh search and wait again.
    I.click('Search');
    I.wait(CCPBConstants.tenSecondWaitTime);
  }

  I.waitForElement(selectLocator, CCPBConstants.tenSecondWaitTime);
  I.click(selectLocator);
}

module.exports = {
  locators: {
    fee_search: { xpath: '//*[@id="fee-search"]' },
    locatoramountselect: { amount_select: { xpath: '//*[@id="fee-version0"]' } },
    locator_calculatedRangedFee: { xpath: '//*[@id="calculatedRangedFee"]' },
    search_for_fee_text: {xpath:'//*[@id="content"]//h1'},
    allocate_payment: {xpath:'//button[@class="button govuk-!-margin-right-1"]'},
    // help_with_fee: {xpath:'//*[text()=" Help with Fees (HWF) application declined "]//../input'},
    help_with_fee: {id:'otherDeduction'},
    // i_have_put_a_stop_on_case: {xpath:'//*[text()=" I have put a stop on the case and contacted the applicant requesting the balance of payment "]//../input'},
    i_have_put_a_stop_on_case: {id:'other'},
    add_Notes: {id:'moreDetails'},
    confirm_button: {xpath:'//button[@type="submit"]'}
  },

  async addFees(amount, jurisdiction1, jurisdiction2) {
    I.see('Search for a fee');
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.click('Jurisdiction 1');
    I.click({ css: '#'.concat(jurisdiction1) });
    I.click('Jurisdiction 2');
    I.click({ css: '#'.concat(jurisdiction2) });
    I.click('Apply filters');
    await clickSelectFeeResultWithRetry();
    I.wait(CCPBConstants.fiveSecondWaitTime);

    await selectCurrentFeeVersionIfShown();
  },

  async addFeesAmount(amount, jurisdiction1, jurisdiction2) {
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
    await clickSelectFeeResultWithRetry();
    I.wait(CCPBConstants.fiveSecondWaitTime);
    await selectCurrentFeeVersionIfShown();
  },

  async addFeesAmountByFeeCode(feeCode, amount, amountType) {
    I.see('Search for a fee');
    I.see('For example: Application or £10.00. You don\'t need to use the whole description or amount.');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.fillField(this.locators.fee_search, feeCode);
    I.click('Search');
    I.wait(CCPBConstants.tenSecondWaitTime);
    await clickSelectFeeResultWithRetry();
    I.wait(CCPBConstants.fiveSecondWaitTime);
    if(amountType === 'Percentage') {
      I.fillField(this.locators.locator_calculatedRangedFee, amount);
      I.click(this.locators.confirm_button);
      I.wait(CCPBConstants.fiveSecondWaitTime);
    }
    await selectCurrentFeeVersionIfShown();

  },

  async addFeesOverPayment(amount) {
    I.see('Search for a fee');
    I.wait(CCPBConstants.tenSecondWaitTime);
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime, 10);
    await clickSelectFeeResultWithRetry();
    I.wait(CCPBConstants.fiveSecondWaitTime);

    await selectCurrentFeeVersionIfShown();

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
