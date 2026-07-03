'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const { I } = inject();
const feePageReadySelector = '//h1[normalize-space()="Fee details"] | //h1[normalize-space()="Summary"] | //button[normalize-space()="Submit"]';
const feeSummaryReadySelector = '//h1[normalize-space()="Summary"] | //h1[normalize-space()="Fee details"]';

async function clickSelectFeeResult() {
  const selectLocator = '//a[normalize-space()="Select"] | //button[normalize-space()="Select"]';
  const visibleSelect = await I.grabNumberOfVisibleElements(selectLocator);

  if (!visibleSelect) {
    I.waitForElement(selectLocator, CCPBConstants.tenSecondWaitTime);
  }

  I.click(selectLocator);
}

async function selectCurrentFeeVersionIfShown() {
  const versionSelectors = [
    '//input[@value=\'currentVersion\']',
    '//input[@id=\'fee-version0\']',
    '//input[@id=\'fee-versions\']'
  ];

  for (const selector of versionSelectors) {
    const isVisible = await I.grabNumberOfVisibleElements(selector);
    if (isVisible) {
      I.click(selector);
      I.click('Continue');
      I.waitForElement(feePageReadySelector, CCPBConstants.oneMinute);
      return;
    }
  }
}

async function submitFeeDetailsIfShown() {
  const feeDetailsTitle = '//h1[normalize-space()="Fee details"]';
  const submitButton = '//button[normalize-space()="Submit"]';
  const cancelButton = '//button[normalize-space()="Cancel"]';
  const hasFeeDetailsTitle = await I.grabNumberOfVisibleElements(feeDetailsTitle);
  const hasSubmitButton = await I.grabNumberOfVisibleElements(submitButton);
  const hasCancelButton = await I.grabNumberOfVisibleElements(cancelButton);

  if (hasFeeDetailsTitle || (hasSubmitButton && hasCancelButton)) {
    I.click(submitButton);
    I.waitForElement(feeSummaryReadySelector, CCPBConstants.oneMinute);
  }
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
      await I.waitForElement(feeSummaryReadySelector, CCPBConstants.oneMinute);
    }
  },

  async addFees(amount, jurisdiction1, jurisdiction2) {
    I.see('Search for a fee');
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    I.waitForText('Jurisdiction 1', CCPBConstants.tenSecondWaitTime);
    I.click('Jurisdiction 1');
    I.click({ css: '#'.concat(jurisdiction1) });
    I.click('Jurisdiction 2');
    I.click({ css: '#'.concat(jurisdiction2) });
    I.click('Apply filters');
    await clickSelectFeeResult();
    await selectCurrentFeeVersionIfShown();
    await submitFeeDetailsIfShown();
    await selectCurrentFeeVersionIfShown();
  },

  async addFeesAmount(amount, jurisdiction1, jurisdiction2) {
    I.see('Search for a fee');
    I.see('For example: Application or £10.00. You don\'t need to use the whole description or amount.');
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    I.waitForText('Jurisdiction 1', CCPBConstants.tenSecondWaitTime);
    I.click('Jurisdiction 1');
    I.click({ css: '#'.concat(jurisdiction1) });
    I.click('Jurisdiction 2');
    I.click({ css: '#'.concat(jurisdiction2) });
    I.click('Apply filters');
    I.see('Jurisdiction 2');
    if (jurisdiction2 === 'family_court'){
      I.see('Family Court');
    }
    await clickSelectFeeResult();
    await selectCurrentFeeVersionIfShown();
    await submitFeeDetailsIfShown();
    await selectCurrentFeeVersionIfShown();
  },

  async addFeesAmountByFeeCode(feeCode, amount, amountType) {
    I.see('Search for a fee');
    I.see('For example: Application or £10.00. You don\'t need to use the whole description or amount.');
    I.fillField(this.locators.fee_search, feeCode);
    I.click('Search');
    await clickSelectFeeResult();
    if(amountType === 'Percentage') {
      I.fillField(this.locators.locator_calculatedRangedFee, amount);
      I.click(this.locators.confirm_button);
      I.waitForElement(feeSummaryReadySelector, CCPBConstants.oneMinute);
    }
    await selectCurrentFeeVersionIfShown();
    await submitFeeDetailsIfShown();
    await selectCurrentFeeVersionIfShown();

  },

  async addFeesOverPayment(amount) {
    I.see('Search for a fee');
    I.fillField(this.locators.fee_search, amount);
    I.click('Search');
    await clickSelectFeeResult();
    await selectCurrentFeeVersionIfShown();
    await submitFeeDetailsIfShown();
    await selectCurrentFeeVersionIfShown();

    I.click(this.locators.allocate_payment);
    I.waitForText('Provide a reason', CCPBConstants.tenSecondWaitTime);
    I.click(this.locators.help_with_fee);
    I.click(this.locators.i_have_put_a_stop_on_case);
    I.click(this.locators.add_Notes);
    I.fillField(this.locators.add_Notes,'Test OverPayment');
    I.click(this.locators.confirm_button);

  },
};
