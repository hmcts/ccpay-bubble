'use strict';
const { retryTo } = require('codeceptjs/effects');
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const { I } = inject();

const inflationFeeSearchAttempts = 6;
const inflationFeeSearchPollIntervalMs = 2_000;

function inflationFeeSelect(feeCode) {
  return { xpath: `//tr[td[normalize-space()="${feeCode}"]]//a[normalize-space()="Select"]` };
}

module.exports = {
  locators: {
    fee_search: { xpath: '//*[@id="fee-search"]' },
    old_amount_select:  { xpath: '//input[@id="fee-version0"]' },
    new_amount_select:  { xpath: '//input[@id="fee-versions"]' },
    locator_calculatedRangedFee: { xpath: '//*[@id="calculatedRangedFee"]' },
    locator_volume: { id: 'volumeAmount' },
    search_for_fee_text: {xpath:'//*[@id="content"]//h1'},
    allocate_payment: {xpath:'//button[@class="button govuk-!-margin-right-1"]'},
    // help_with_fee: {xpath:'//*[text()=" Help with Fees (HWF) application declined "]//../input'},
    help_with_fee: {id:'otherDeduction'},
    // i_have_put_a_stop_on_case: {xpath:'//*[text()=" I have put a stop on the case and contacted the applicant requesting the balance of payment "]//../input'},
    i_have_put_a_stop_on_case: {id:'other'},
    add_Notes: {id:'moreDetails'},
    confirm_button: {xpath:'//button[@type="submit"]'}
  },

  async submitFeeDetailsIfShown() {
    const numOfElements = await I.grabNumberOfVisibleElements('//input[@id=\'fee-version0\']');
    const feeDetailsCount = await I.grabNumberOfVisibleElements('//h1[normalize-space()="Fee details"]/following::th[normalize-space()="Fee code"]');
    const submitButton = { xpath: '//h1[normalize-space()="Fee details"]/following::button[@type="submit" and normalize-space()="Submit"]' };
    const submitButtonCount = await I.grabNumberOfVisibleElements(submitButton);
    if(numOfElements) {
      await I.click('//input[@id=\'fee-version0\']');
    }
    if((numOfElements || feeDetailsCount) && submitButtonCount) {
      await I.click(submitButton);
      await I.wait(CCPBConstants.fiveSecondWaitTime);
    }
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
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);

    /* Comment this out when fee change options expire for inflation update. */
    let numOfElements = await I.grabNumberOfVisibleElements(this.locators.old_amount_select);
    if(numOfElements) {
      I.click(this.locators.old_amount_select);
      I.click('Continue');
      I.wait(CCPBConstants.fiveSecondWaitTime);
    }
    /* END: Comment this out when fee change options expire for inflation update. */
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
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    /* Comment this out when fee change options expire for inflation update. */
    let numOfElements = await I.grabNumberOfVisibleElements(this.locators.old_amount_select);
    if(numOfElements) {
      I.click(this.locators.old_amount_select);
      I.click('Continue');
      I.wait(CCPBConstants.fiveSecondWaitTime);
    }
    /* END: Comment this out when fee change options expire for inflation update. */
  },

  async addFeesAmountByFeeCode(feeCode, amount, amountType, volume) {
    I.see('Search for a fee');
    I.see('For example: Application or £10.00. You don\'t need to use the whole description or amount.');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    I.fillField(this.locators.fee_search, feeCode);
    I.click('Search');
    I.wait(CCPBConstants.tenSecondWaitTime);
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);
    if (amountType?.toLowerCase() === "percentage") {
      I.fillField(this.locators.locator_calculatedRangedFee, amount);
      I.click(this.locators.confirm_button);
      I.wait(CCPBConstants.fiveSecondWaitTime);
    }
    if (amountType?.toLowerCase() === "volume") {
      if (volume) {
        I.fillField(this.locators.locator_volume, volume);
      } else {
        throw new Error("Please provide the volume for the fee code: " + feeCode);
      }
      I.click(this.locators.confirm_button);
      I.wait(CCPBConstants.fiveSecondWaitTime);
    }
    /* Comment this out when fee change options expire for inflation update. */
    let numOfElements = await I.grabNumberOfVisibleElements(this.locators.new_amount_select);
    if(numOfElements) {
      I.click(this.locators.new_amount_select);
      I.click('Continue');
      I.wait(CCPBConstants.fiveSecondWaitTime);
    }
    /* END: Comment this out when fee change options expire for inflation update. */

  },

  async addFeesOverPayment(amount, feeCode) {
    I.see('Search for a fee');
    I.wait(CCPBConstants.tenSecondWaitTime);
    I.fillField(this.locators.fee_search, feeCode);
    I.click('Search');
    I.wait(CCPBConstants.fiveSecondWaitTime, 5);
    I.see(`£${amount}`);
    I.click('Select');
    I.wait(CCPBConstants.fiveSecondWaitTime);

    /* Comment this out when fee change options expire for inflation update. */
    let numOfElements = await I.grabNumberOfVisibleElements(this.locators.old_amount_select);
    if(numOfElements) {
      I.click(this.locators.old_amount_select);
      I.click('Continue');
      I.wait(CCPBConstants.fiveSecondWaitTime);
    }
    /* END: Comment this out when fee change options expire for inflation update. */

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

  async addInflationUpdatedFee(feeCode) {
    I.see('Search for a fee');
    I.fillField(this.locators.fee_search, feeCode);

    await retryTo(async () => {
      await I.click('Search');
      await I.waitForElement(inflationFeeSelect(feeCode), CCPBConstants.fiveSecondWaitTime);
    }, inflationFeeSearchAttempts, inflationFeeSearchPollIntervalMs);

    await I.click(inflationFeeSelect(feeCode));
    await I.waitForElement(this.locators.old_amount_select);
    await I.waitForElement(this.locators.new_amount_select);
    I.click(this.locators.new_amount_select);
    I.click('Continue');
    await I.waitForElement('//h1[normalize-space()="Summary"]', CCPBConstants.oneMinute);
  },

};
