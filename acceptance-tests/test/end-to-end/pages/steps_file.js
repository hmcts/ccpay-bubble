'use strict';
const BARATConstants = require('../tests/CCPBAcceptanceTestConstants');
// in this file you can append custom step methods to 'I' object
// const faker = require('faker');

module.exports = () => actor({
  // done
  login(email, password) {
    this.amOnPage('/');
    this.retry(BARATConstants.retryCountForStep).waitForElement('#username', BARATConstants.thirtySecondWaitTime);
    this.fillField('Email address', email);
    this.fillField('Password', password);
    this.waitForElement({ css: '[type="submit"]' }, BARATConstants.thirtySecondWaitTime);
    this.click({ css: '[type="submit"]' });
    this.wait(BARATConstants.fiveSecondWaitTime);
  },
  // done
  paymentTypeCheque(role) {
    this.createPayment(paymentTypes.cheque, ChequePayername, '550', '312323', role);
    this.checkAndSubmit(ChequePayername, 'Submit');
  },
  // done
  paymentTypePostalOrder(role) {
    this.createPayment(paymentTypes.postal, PostalOrderPayername, '550', '312323', role);
    this.checkAndSubmit(PostalOrderPayername, 'Submit');
  },
  // done
  paymentTypeCash(role) {
    this.createPayment(paymentTypes.cash, CashPayername, '550', null, role);
    this.checkAndSubmit(CashPayername, 'Submit');
  },
  // done
  paymentTypeAllPay(role) {
    this.createPayment(paymentTypes.allPay, AllPayPayername, '550', '312323', role);
    this.checkAndSubmit(AllPayPayername, 'Submit');
  },
  // done
  paymentTypeCard(role) {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323', role);
    this.checkAndSubmit(CardPayername, 'Submit');
  },
  paymentTypeRemission(role) {
    this.createRemission(role, RemissionPayerName);
    this.checkAndSubmit(RemissionPayerName, 'Submit');
  },
  // done
  editPayerNameAmountAndAuthorizationCode(role) {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323', role);
    this.click('Check and submit');
    this.waitForElement('#paymentInstructionModel0', BARATConstants.thirtySecondWaitTime);
    this.click('#paymentInstructionModel0');
    this.waitForText('Authorization Code', BARATConstants.tenSecondWaitTime);
    this.see('Authorization Code');
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Authorization Code', '123456');
    this.waitForElement('.button-view', BARATConstants.tenSecondWaitTime);
    this.click('Save changes');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },
  // done
  deletePaymentInformation(role) {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323', role);
    this.checkAndSubmit(CardPayername, 'Delete');
  },
  // done
  checkAddPaymentInstructionPage() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.see('Payment Type');
    this.waitForElement({ css: '[type="radio"]' }, BARATConstants.thirtySecondWaitTime);
    this.see('Cheque');
    this.see('Cash');
    this.see('Postal Order');
    this.see('AllPay');
    this.see('Card');
    this.see('Payer name');
    this.see('Amount');
    this.seeElement('.button.button-view:disabled');
  },
  // done
  feeclerkChequePaymentType() {
    this.createPayment(paymentTypes.cheque, ChequePayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(ChequePayername, 'Submit');
  },
  // done
  feeclerkPostalOrderPaymentType() {
    this.createPayment(paymentTypes.postal, PostalOrderPayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(PostalOrderPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(PostalOrderPayername, 'Submit');
  },
  // done
  feeclerkCashPaymentType() {
    this.createPayment(paymentTypes.cash, CashPayername, '550');
    this.click('Payments list');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(CashPayername, 'Submit');
  },
  // done
  feeclerkCashPaymentTypeWithTwoFees() {
    this.createPayment(paymentTypes.cash, CashPayername, '550');
    this.click('Payments list');
    this.waitForText(CashPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.addMultipleFeeAndCaseWithJurisdictions('Civil Court fees - Money Claims - Claim Amount - 300.01', '654323', 'civil', 'county_court');
    this.waitForElement('#add-case-fee-details', BARATConstants.fiveSecondWaitTime);
    this.click('#add-case-fee-details');
    this.addMultipleFeeAndCaseWithJurisdictions('Hearing fees', '654323', 'family', 'court_of_protection');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(CashPayername, 'Submit');
  },
  // done
  feeclerkAllPayPaymentType() {
    this.createPayment(paymentTypes.allPay, AllPayPayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(AllPayPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(AllPayPayername, 'Submit');
  },
  // done
  feeclerkCardPaymentType() {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.checkAndSubmit(CardPayername, 'Submit');
  },
  feeclerkRemissionPaymentType() {
    this.createRemission('FeeClerk', RemissionPayerName);
    this.click('Payments list');
    this.waitForText(RemissionPayerName, BARATConstants.tenSecondWaitTime);
    this.see(remissionReference);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('fees order 1.2', '654321');
    this.waitForText('Validate payment', BARATConstants.fiveSecondWaitTime);
    this.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
  },
  feeclerkRemissionPaymentTypeAddFeesPrompt() {
    this.createRemission('FeeClerk', RemissionPayerName, true);
    this.editFeeAndCaseNumberAndSave('fees order 1.2', '654321');
    this.waitForText('Validate payment', BARATConstants.fiveSecondWaitTime);
    this.see('Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.');
  },
  feeclerkEditFee() {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323');
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.waitForText('654321', BARATConstants.tenSecondWaitTime);
    this.click('#fee-details > tbody > tr > td.bar-feelogs-td.text-align-right > button');
    this.click('#feedetail-component > div > form > div.current-fee > div.header > div:nth-child(2) > a');
    this.editFeeAndCaseNumberAndSave('upto 1000 GBP', '123456');
    this.waitForText('123456', BARATConstants.tenSecondWaitTime);
    this.waitForText('upto 1000 GBP', BARATConstants.tenSecondWaitTime);
  },
  // done
  feeclerkEditChequePaymentType() {
    this.createPayment(paymentTypes.cheque, ChequePayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(ChequePayername, BARATConstants.tenSecondWaitTime);
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.waitForText('Validate payment', BARATConstants.tenSecondWaitTime);
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement({ css: 'a.button' }, BARATConstants.tenSecondWaitTime);
    this.click('Edit');
    this.waitForText('Edit Payment Instruction', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.fillField('Payer name', EditPayername);
    this.fillField('Amount', '10000');
    this.fillField('Cheque number', '123456');
    this.click('Save changes');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText('Payments list', BARATConstants.tenSecondWaitTime);
    this.click('Payments list');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForText(EditPayername, BARATConstants.tenSecondWaitTime);
  },
  // done
  SeniorFeeClerkCardPaymentType() {
    this.waitForText('Anish feeclerk', BARATConstants.tenSecondWaitTime);
    this.click('Anish feeclerk');
    this.waitForElement('#merged', BARATConstants.fiveSecondWaitTime);
    this.click('#merged');
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-0');
    this.see('Validate payment');
    this.dontSee('button.button-add');
    this.dontSee('#action');
    this.waitForElement('#goBack', BARATConstants.fiveSecondWaitTime);
    this.click('#goBack');
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.waitForElement('#payment-instruction-all', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.click('Approve');
    this.waitForElement('#bgc-number', BARATConstants.fiveSecondWaitTime);
    this.fillField('#bgc-number', BgcNumber);
    this.click('Confirm');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.dontSee(ChequePayername);
  },
  // done
  DeliveryManagerTransferToBAR() {
    this.waitForText('krishna Srfeeclerk', BARATConstants.thirtySecondWaitTime);
    this.click('krishna Srfeeclerk');
    this.waitForText('Payments to review', BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#BGC310000', BARATConstants.thirtySecondWaitTime);
    this.click('#BGC310000');
    this.waitForText(ChequePayername, BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.dontSee('button.button-add');
    this.dontSee('#action');
    this.waitForElement('#goBack', BARATConstants.fiveSecondWaitTime);
    this.click('#goBack');
    this.waitForElement('#payment-instruction-0', BARATConstants.thirtySecondWaitTime);
    this.click('#payment-instruction-all');
    this.waitForElement('#approve', BARATConstants.twoSecondWaitTime);
    this.click('#approve');
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.dontSee(ChequePayername);
    this.dontSeeCheckboxIsChecked('#payment-instruction-all');
  },
  DeliveryManagerConfirmTransferToBAR(textToWait) {
    this.waitForText('Payments overview', BARATConstants.fiveSecondWaitTime);
    this.click('Payments overview');
    this.waitForText('Transfer to BAR', BARATConstants.fiveSecondWaitTime);
    this.click('Transfer to BAR');
    this.waitForText('Confirm BAR transfers', BARATConstants.fiveSecondWaitTime);
    this.click('Confirm BAR transfers');
    this.waitForElement('#transferDate', BARATConstants.fiveSecondWaitTime);
    this.click('Cancel');
    this.click('Confirm BAR transfers');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.click('Confirm');
    this.waitForText(textToWait, BARATConstants.fiveSecondWaitTime);
    this.click('#submitModal');
    this.wait(BARATConstants.twoSecondWaitTime);
  },
  feeClerkRevertPayment() {
    this.createPayment(paymentTypes.card, CardPayername, '550', '312323');
    this.click('Payments list');
    this.waitForText(CardPayername, BARATConstants.tenSecondWaitTime);
    this.navigateValidateScreenAndClickAddFeeDetails();
    this.editFeeAndCaseNumberAndSave('nullity or civil', '654321');
    this.doActionOnPaymentInstruction('Process');
    this.click('Check and submit');
    this.waitForElement('#paymentInstruction0', BARATConstants.thirtySecondWaitTime);
    this.click('#paymentInstruction0');
    this.waitForText('Revert to Pending status', BARATConstants.fiveSecondWaitTime);
  },
  Logout() {
    this.moveCursorTo('//div/div/ul[2]/li[2]/a');
    this.see('Log-out');
    this.click('Log-out');
    this.wait(BARATConstants.fiveSecondWaitTime);
  },
  /**
   * @private
   * @param {string} feeText
   * @param {string} caseNumber
   */
  editFeeAndCaseNumberAndSave(feeText, caseNumber) {
    this.waitForElement('#case-reference', BARATConstants.tenSecondWaitTime);
    this.fillField('Case number', caseNumber);
    this.fillField('Search for a Fee', feeText);
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
  },
  /**
   * @private
   * @param {string} feeText
   * @param {string} caseNumber
   */
  addMultipleFeeAndCaseWithJurisdictions(feeText, caseNumber, juris1, juris2) {
    this.waitForElement('#case-reference', BARATConstants.tenSecondWaitTime);
    this.fillField('Case number', caseNumber);
    this.click('#jurisdiction1Select');
    this.click(`#${juris1}`);
    this.click('#jurisdiction2Select');
    this.click(`#${juris2}`);
    this.fillField('Search for a Fee', feeText);
    this.wait(BARATConstants.fiveSecondWaitTime);
    this.waitForElement('#feeCodeSearch0', BARATConstants.tenSecondWaitTime);
    this.click('#feeCodeSearch0');
    this.waitForElement('#save', BARATConstants.fiveSecondWaitTime);
    this.click('Save');
  },
  /**
   * @private
   * @param {object} paymentType
   * @param {string} payerName
   * @param {string} amount
   * @param {string} reference
   */
  createPayment(paymentType, payerName, amount, reference, role) {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.fillPaymentDetails(paymentType, payerName, amount, reference, role);
  },

  createRemission(role, payerName, addFeeNow) {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForText('Add a full remission payment here', BARATConstants.fiveSecondWaitTime);
    this.click('Add a full remission payment here');
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    this.waitForElement('#remission-reference');
    this.see('Add Full remission payment instruction');
    this.fillField('#payer-name', payerName);
    this.fillField('#remission-reference', remissionReference);
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add remission');
    this.wait(BARATConstants.fiveSecondWaitTime);
    let linkName = '';
    if (addFeeNow) {
      linkName = 'Continue to Payment ID';
    } else if (role === 'PostClerk') {
      linkName = 'Go to Check and submit';
    } else {
      linkName = 'Return to payments list';
    }
    this.waitForText(linkName, BARATConstants.tenSecondWaitTime);
    this.click(linkName);
    if (!addFeeNow) {
      this.retry(FOUR).waitForText(payerName, BARATConstants.tenSecondWaitTime);
    }
  },
  /**
   * Selects the chosen payment type and fills out the required fields
   * @private
   * @param {string} paymentType
   * @param {string} payerName
   * @param {string} amount
   * @param {string} reference
   */
  fillPaymentDetails(paymentType, payerName, amount, reference, role) {
    this.waitForElement(paymentType.id, BARATConstants.fiveSecondWaitTime);
    this.click(paymentType.id);
    this.waitForElement('#payer-name', BARATConstants.tenSecondWaitTime);
    if (reference) {
      this.see(paymentType.reference);
    }
    this.fillField('Payer name', payerName);
    this.fillField('Amount', amount);
    if (reference) {
      this.fillField(paymentType.reference, reference);
    }
    this.waitForElement('.button', BARATConstants.tenSecondWaitTime);
    this.click('Add payment');
    this.wait(BARATConstants.fiveSecondWaitTime);
    let linkName = '';
    if (role === 'PostClerk') {
      linkName = 'Go to Check and submit';
    } else {
      linkName = 'Return to payments list';
    }
    this.waitForText(linkName, BARATConstants.tenSecondWaitTime);
    this.click(linkName);
    this.retry(FOUR).waitForText(payerName, BARATConstants.tenSecondWaitTime);
  },
  /**
   * Navigates to check and submit section and submits all the available payments
   * @private
   * @param {string} payerName
   */
  checkAndSubmit(payerName, action) {
    this.click('Check and submit');
    this.waitForText(payerName, BARATConstants.fiveSecondWaitTime);
    this.click(`//td[contains(text(), '${payerName}')]/parent::*/td[last()]//input`);
    this.click(action);
    this.see('Check and submit');
  },
  /**
   * Selects the first item from the payment list and clicks to see the details
   * @private
   */
  navigateValidateScreenAndClickAddFeeDetails() {
    this.click('#paymentInstruction0');
    this.wait(BARATConstants.twoSecondWaitTime);
    this.see('Validate payment');
    this.see('No fee details on payment');
    this.see('Payment details');
    this.waitForElement('button.button-add', BARATConstants.tenSecondWaitTime);
    this.click('Add fee details');
  },
  /**
   * Starts the selected action on the payment-instruction item
   * @param {string} actionName
   */
  doActionOnPaymentInstruction(actionName) {
    this.waitForElement(`#${actionName}`, BARATConstants.fiveSecondWaitTime);
    this.click(`#${actionName}`);
    this.click('Submit');
    this.waitForText('Payments List', BARATConstants.tenSecondWaitTime);
  },

  async toggleSendToPayhubFeature(enabled) {
    this.amOnPage('/features');
    this.waitForElement('#send-to-payhub', BARATConstants.fiveSecondWaitTime);
    const checkBoxChecked = await this.grabAttributeFrom('#send-to-payhub', 'checked');
    if (Boolean(checkBoxChecked) !== enabled) {
      this.checkOption('#send-to-payhub');
    }
    this.click('Save');
    this.amOnPage('/');
  },

  checkIfFullRemissionEnabled() {
    this.amOnPage('/features');
    this.waitForElement('#full-remission', BARATConstants.fiveSecondWaitTime);
    return this.grabAttributeFrom('#full-remission', 'checked');
  },

  checkFullRemissionIsNotVisible() {
    this.waitForText('Add payment information', BARATConstants.tenSecondWaitTime);
    this.click('Add payment information');
    this.waitForText('Add Payment Instruction', BARATConstants.fiveSecondWaitTime);
    this.dontSee('Add Full remission payment instruction');
  }

});
