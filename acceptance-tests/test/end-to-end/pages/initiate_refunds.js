/* eslint-disable max-len */
/* eslint-disable no-dupe-keys */
'use strict';
const stringUtils = require('../helpers/string_utils');
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {

  locators: {
    service_requests_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },
    payment_success_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },

    remission_code_field: { xpath: '//*[@id="remissionCode"]' },
    amount_field: { xpath: '//*[@id="amount"]' },
    refund_reference_field: { xpath: '//strong[starts-with(text(),"Refund reference:")]' },

    reasons_drop_down: { xpath: '//select[@id=\'sort\']' },
    reasons_text: { xpath: '//input[@id=\'reason\']' },

    users_drop_down_for_refunds_to_be_approved: { xpath: '//ccpay-refund-list[1]/div[3]//select[@id="sort"]' },
    date_updated_for_refunds_to_be_approved_by_case_worker: { xpath: '(//button[@aria-label="Change sorting for date_updated"])[1]'},

    users_drop_down_for_refunds_returned_to_case_worker: { xpath: '//div[5]//select[@id=\'sort\']' },
    date_updated_for_refunds_returned_to_case_worker: { xpath: '//body[1]/app-root[1]/div[1]/div[1]/app-payment-history[1]/ccpay-payment-lib[1]/ccpay-refund-list[1]/div[5]/ccpay-table[1]/div[1]/div[2]/mat-table[1]/mat-header-row[1]/mat-header-cell[5]/div[1]/button[1]' },
    submit_Refund: {xpath: '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-payment-view/div[2]/button[2]'}
  },

  async getHeaderValue() {
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  verifyServiceRequestPage(typeOfRefund, serviceRequestReference, feeDescription, feeAmount) {
    I.see('Service request');
    I.see('Service request reference');
    I.see(`${serviceRequestReference}`);
    I.see('Fee');
    I.see(`${feeDescription}`);
    I.see('Amount');
    I.see(`1 X ${feeAmount}`);
    I.see('Total');
    I.see(`${feeAmount}`);
    I.see('No help with fees or remissions.');
    I.see(`Total fees: ${feeAmount}`);
    I.see(typeOfRefund);
    I.click(typeOfRefund);
  },

  verifyPaymentDetailsPage(typeOfRefund) {
    I.see('Payment details');
    I.see('Payment status history');
    I.see('Issue refund');
    I.waitForText('Fee and remission details', '5');
    I.see('Add remission');
    I.click(typeOfRefund);
  },

  verifyPaymentDetailsPageSummarySection(checkYourDetailsSummary) {
    I.see('Payment details');
    I.see('Service request reference');
    I.see('Payment reference');
    I.see(`${checkYourDetailsSummary.paymentReference}`);
    I.see('Payment amount');
    I.see(`${checkYourDetailsSummary.paymentAmount}`);
    I.see('Payment method');
    I.see(`${checkYourDetailsSummary.paymentMethod}`);
    I.see('Type');
    I.see(`${checkYourDetailsSummary.paymentType}`);
    I.see('Channel');
    I.see(`${checkYourDetailsSummary.paymentChannel}`);
    I.see('PBA account name');
    I.see(`${checkYourDetailsSummary.pbaAccountName}`);
    I.see('PBA number');
    I.see(`${checkYourDetailsSummary.pbaNumber}`);
    I.see('Customer internal reference');
    I.see(`${checkYourDetailsSummary.customerInternalReference}`);
  },

  verifyPaymentDetailsPageForFailedPayment(typeOfRefund) {
    I.waitForText('Payment details', '5');
    I.waitForText('Payment status history', '5');
    I.waitForText('Fee and remission details', '5');
    I.see('Add remission');
    I.click(typeOfRefund);
  },

  verifyProcessRefundPageFromTheDropDownReasons(ccdCaseNumber, dropDownReason, reasonText) {
    I.waitForText('Process refund', '5');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Why are you making this refund');
    I.selectOption(this.locators.reasons_drop_down, 'Other - CoP');
    I.fillField(this.locators.reasons_text, reasonText);
    I.click('Continue');
  },

  verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, reasonId) {
    I.waitForText('Process refund', '5');
    I.see(stringUtils.getCcdCaseInFormat(ccdCaseNumber));
    I.see('Why are you making this refund');
    I.checkOption(`//input[@id='${reasonId}']`);
    I.click('Continue');
  },

  verifyCheckYourAnswersPageForIssueRefund(reasonForRefund, paymentReference, paymentAmount, changeRequiredFlag) {
    I.see('Check your answers');
    I.see('Reason for refund');
    I.see(reasonForRefund);
    I.see('Payment reference');
    I.see(paymentReference);
    I.see('Payment amount');
    I.see(paymentAmount);
    if (changeRequiredFlag) {
      I.click('Change');
    } else {
      I.click('Submit refund');
    }
  },

  verifyCheckYourAnswersPageForRefund(reasonForRefund, paymentReference, paymentAmount) {
    I.waitForText('Check your answers', '5');
    I.waitForText('Payment reference', '5');
    I.see(paymentReference);
    I.waitForText('Payment reference', '5');
    I.see(paymentReference);
    I.waitForText('Reason for refund', '5');
    I.see(reasonForRefund);
    I.waitForText('Payment Amount', `£${paymentAmount}`);
    I.click('Submit refund');
  },


  verifyCheckYourAnswersPageForOverPaymentRefund() {
    I.see('RC-');
    I.see('	£500.00');
    I.see('	£200.00');
    I.see('£300');
    I.see('Over payment');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.click('Submit refund');
  },

  verifyCheckYourAnswersPageForOverPaymentRefundNotificationPreview() {
    I.see('RC-');
    I.see('	£500.00');
    I.see('	£200.00');
    I.see('£300');
    I.see('Over payment');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Notification');
    I.see('RefundWhenContacted');
    I.click('Preview');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('From: specified@justice.gov.uk');
    // I.waitForText('<hm.courts.and.tribunals.registrations@notifications.service.gov.uk>');
    I.see('To: vamshi.rudrabhatla@hmcts.net');
    I.see('Subject: HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case 1671126906988356 has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    I.see('Refund reference: RF-****-****-****-****');
    I.see('Refund amount: £300');
    I.see('Reason for refund: Refund for Overpayment')
    I.see('To receive this refund, you must give us the correct bank details to process the request.');
    I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
    I.see('If you do not have a bank account, or if you need further information, contact specified@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.see('This is an automated message, please don’t reply to this email.');
    I.click('Hide Preview');
    I.waitForText('Preview')
    I.click('Submit refund');
  },

  verifyCheckYourAnswersPageForOverPaymentRefundNotificationPreviewLetter() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('RC-');
    I.see('	£500.00');
    I.see('	£200.00');
    I.see('£300');
    I.see('Over payment');
    I.see('Post');
    // I.see('89 MARTINDALE');
    // I.see('ROAD HOUNSLOW LONDON');
    // I.see('BOROUGH OF HOUNSLOW United');
    // I.see('Kingdom TW4 7EZ');
    I.see('Notification');
    I.see('RefundWhenContacted');
    I.see('Change');
    I.see('Preview');
    I.click('Preview');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see('TW4 7EZ');
    I.see('From');
    I.see('ABC');
    I.see('london');
    I.see('UK');
    I.see('123 436');
    I.waitForText('HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.waitForText('Our records show that case has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    I.see('Refund reference: RF-****-****-****-****');
    I.see('Refund amount: £300');
    I.see('Reason for refund: Over payment')
    I.see('To receive this refund, you must give us the correct bank details to process the request.');
    I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
    I.see('If you do not have a bank account, or if you need further information, contact specified@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.click('Hide Preview');
    I.waitForText('Preview')
    I.click('Submit refund');
  },

  verifyCheckYourAnswersPageSendRefundNotificationPreviewLetter() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('RC-');
    I.see('£215.00');
    I.see('	£200.00');
    // I.see('Over payment');
    I.see('Post');
    // I.see('89 MARTINDALE');
    // I.see('ROAD HOUNSLOW LONDON');
    // I.see('BOROUGH OF HOUNSLOW United');
    // I.see('Kingdom TW4 7EZ');
    I.see('Notification');
    I.see('SendRefund');
    I.see('Change');
    I.see('Preview');
    I.click('Preview');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see('TW4 7EZ');
    I.see('From');
    I.see('ABC');
    I.see('london');
    I.see('UK');
    I.see('123 436');
    I.see('HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.waitForText('Our records show that case has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    I.see('Refund reference: RF-****-****-****-****');
    I.see('Refund amount: £200');
    // I.see('Reason for refund: Over payment')
    I.see('Your refund will be processed and sent to the account you originally made the payment from within 14 days');
    I.see('If you have not received the refund by this time, you need further information or you do not have a bank');
    I.see('account, contact probate@justice.gov.uk');
    I.see('HM Courts & Tribunals Service');
    I.click('Hide Preview');
    I.waitForText('Preview')
    I.click('Submit refund');
  },

  verifyCheckYourAnswersPageForPartialPaymentsSendRefundNotification() {
    I.see('RC-');
    I.see('£215.00');
    I.see('Fee not due');
    I.see('Change');
    I.see('	£200.00');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Notification');
    I.see('SendRefund');
    I.see('Change');
    I.see('Preview');
    I.click('Preview');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('From: HM Courts and Tribunals Registrations');
    I.waitForText('<hm.courts.and.tribunals.registrations@notifications.service.gov.uk>');
    I.see('To: vamshi.rudrabhatla@hmcts.net');
    I.see('Subject: HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case 1671126906988356 has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    I.see('Refund reference: RF-****-****-****-****');
    I.see('Refund amount: £200');
    // I.see('Reason for refund: Over payment')
    I.see('Your refund will be processed and sent to the account you originally made the payment from within 14 days');
    I.see('If you have not received the refund by this time, you need further information or you do not have a bank');
    I.see('account, contact probate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.see('This is an automated message, please don’t reply to this email.');
    I.click('Hide Preview');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.waitForText('Preview')
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Submit refund');
  },

  verifyCheckYourAnswersPageForRemissions() {
    I.see('RC-');
    I.see('£500.00');
    I.see('Fee not due');
    I.see('Change');
    I.see('£100.00');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.click('Submit refund');
  },
  verifyCheckYourAnswersPageForFullRefunds() {
    I.see('RC-');
    I.see('£500.00');
    I.see('Fee not due');
    I.see('Change');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.click('Submit refund');
  },

  verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference) {
    I.waitForText('Process remission', '5');
    I.see(`#${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Enter help with fees or remission reference');
    I.see('For example: HWF-A1B-23C OR PA21-123456');
    I.fillField(this.locators.remission_code_field, hwfReference);
    I.click('Continue');
  },

  verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount) {
    I.waitForText('Process remission', '5');
    I.see(`#${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Enter the amount to be refunded');
    I.fillField(this.locators.amount_field, remissionAmount);
    I.click('Continue');
  },

  verifyProcessRemissionAmountPageForFailedPayment(ccdCaseNumber, remissionAmount) {
    I.waitForText('Process remission', '5');
    I.see(`#${stringUtils.getCcdCaseInFormat(ccdCaseNumber)}`);
    I.see('Enter the remission amount');
    I.fillField(this.locators.amount_field, remissionAmount);
    I.click('Continue');
  },

  verifyCheckYourAnswersPageForRemission() {
    I.waitForText('Check your answers', '5');
    I.see('Payment reference');
    I.see('RC-')
    I.see('Payment amount');
    I.see('500');
    I.see('Payment status');
    I.see('Success');
    I.see('Fee');
    I.see('FEE0373 - Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.');
    I.see('Help with fees or remission reference');
    I.see('	HWF-A1B-23C');
    I.see('Refund amount');
    I.see('100');
    I.click('Add remission');
  },

  verifyCheckYourAnswersPageForRemissionFinalSubmission() {
    I.see('Send via');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Change');
    I.click('Submit refund');
  },

  verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, changeHWFCodeFlag, changeRefundAmountFlag) {
    I.waitForText('Check your answers', '5');
    I.see('Payment reference');
    I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Payment amount');
    I.see(`${checkYourAnswersData.paymentAmount}`);
    I.see('Payment status');
    I.see(`${checkYourAnswersData.paymentStatus}`);
    I.see('Fee');
    I.see(`${checkYourAnswersData.feeDescription}`);
    I.see('Help with fees or remission reference');
    I.see(`${checkYourAnswersData.hwfReference}`);
    I.see('Refund amount');
    I.see(`${checkYourAnswersData.refundAmount}`);

    if (changeHWFCodeFlag) {
      // console.log('Inside the HWF Code');
      // pause();
      I.click({ xpath: '//tr[5]//a[.="Change"]' });
    } else if (changeRefundAmountFlag) {
      // console.log('Inside the Changed Refund Amount');
      I.click({ xpath: '//tr[6]//a[.="Change"]' });
    } else {
      I.click('Add remission');
    }
  },

  verifyCheckYourAnswersPageForAddRemissionForFailedPayment(checkYourAnswersData, changeHWFCodeFlag, changeRefundAmountFlag) {
    I.waitForText('Check your answers', '5');
    I.see('Payment reference');
    I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Payment amount');
    I.see(`${checkYourAnswersData.paymentAmount}`);
    I.see('Payment status');
    I.see('Failed');
    I.see('Fee');
    I.see(`${checkYourAnswersData.feeDescription}`);
    I.see('Help with fees or remission reference');
    I.see(`${checkYourAnswersData.hwfReference}`);
    I.see('Remission amount');
    I.see(`${checkYourAnswersData.refundAmount}`);

    if (changeHWFCodeFlag) {
      // console.log('Inside the HWF Code');
      // pause();
      I.click({ xpath: '//tr[5]//a[.="Change"]' });
    } else if (changeRefundAmountFlag) {
      // console.log('Inside the Changed Refund Amount');
      I.click({ xpath: '//tr[6]//a[.="Change"]' });
    } else {
      I.click('Add remission');
    }
  },

  async verifyRemissionAddedPage(addRefundFlag, refundAmount) {
    I.see('Remission added');
    I.see('The amount to be refunded should be');
    I.see(`£${refundAmount}`);
    I.see('Submit refund');
    I.see('Return to case');
    if (addRefundFlag) {
      I.click('Submit refund');
    } else {
      await I.click({ xpath: '//a[contains(.,\'Return to case\')]' });
    }
  },

  verifyRemissionAddedPageForFailedPayment() {
    I.see('Remission added');
    I.click('Return to case');
  },

  async verifyRefundSubmittedPage(refundAmount) {
    I.see('Refund submitted');
    I.see('Refund reference:');
    I.see('What happens next');
    I.see(`A refund request for £${refundAmount} has been created and will be passed to a team leader to approve.`);
    I.see('Return to case');
    const refundReferenceStatment = await I.grabTextFrom(this.locators.refund_reference_field);
    const refundReference = refundReferenceStatment.split(':')[1].trim();
    I.click('Return to case');
    return refundReference;
  },

  async verifyRefundSubmittedPageForOverPayments() {
    I.see('Refund submitted');
    I.see('Refund reference:');
    I.see('What happens next');
    I.see(`A refund request for £300.00 has been created and will be passed to a team leader to approve.`);
    I.see('Return to case');
    const refundReferenceStatment = await I.grabTextFrom(this.locators.refund_reference_field);
    const refundRefOverPayments = refundReferenceStatment.split(':')[1].trim();
    console.log("The Refund Reference number is "   + refundRefOverPayments);
    I.click('Return to case');
    return refundRefOverPayments;
  },

   verifyRemissionSubmittedPage() {
    I.see('Remission added');
    I.see('The amount to be refunded should be £100.00');
    I.click('Continue');

  },

  async verifyRefundSubmittedPageForFullRefunds() {
    I.see('Refund submitted');
    I.see('Refund reference:');
    I.see('What happens next');
    I.see(`A refund request for £500.00 has been created and will be passed to a team leader to approve.`);
    I.see('Return to case');
    const refundReferenceStatment = await I.grabTextFrom(this.locators.refund_reference_field);
    const refundRef = refundReferenceStatment.split(':')[1].trim();
    console.log("The Refund Reference number is "   + refundRef);
    I.click('Return to case');
    return refundRef;
  },

  async verifyRefundSubmittedPageForPartialPayments() {
    I.see('Refund submitted');
    I.see('Refund reference:');
    I.see('What happens next');
    I.see(`A refund request for £200.00 has been created and will be passed to a team leader to approve.`);
    I.see('Return to case');
    const refundReferenceStatment = await I.grabTextFrom(this.locators.refund_reference_field);
    const refundRef = refundReferenceStatment.split(':')[1].trim();
    console.log("The Refund Reference number is "   + refundRef);
    I.click('Return to case');
    return refundRef;
  },

  async verifyRefundSubmittedPageForRemissions() {
    I.see('Refund submitted');
    I.see('Refund reference:');
    I.see('What happens next');
    I.see('A refund request for £100.00 has been created and will be passed to a team leader to approve.');
    I.see('Return to case');
    const refundReferenceStatment = await I.grabTextFrom(this.locators.refund_reference_field);
    const refundRefRemissions = refundReferenceStatment.split(':')[1].trim();
    console.log("The Refund Reference number is "   + refundRefRemissions);
    I.click('Return to case');
    return refundRefRemissions;
  },

  async verifyRefundSubmittedPageForRefunds() {
    I.see('Refund submitted');
    I.see('Refund reference:');
    I.see('What happens next');
    I.see('A refund request for £100.00 has been created and will be passed to a team leader to approve.');
    I.see('Return to case');
    const refundReferenceStatment = await I.grabTextFrom(this.locators.refund_reference_field);
    const refunds = refundReferenceStatment.split(':')[1].trim();
    console.log("The Refund Reference number is "   + refunds);
    I.click('Return to case');
    return refunds;
  },

  verifyHelpWithFeesSectionOnPaymentDetailsPage(checkYourAnswersData, pageTitle) {
    I.see(pageTitle);
    I.see('Help with fees or remission code');
    I.see(`${checkYourAnswersData.hwfReference}`);
    I.see('Reference');
    // I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Fee');
    I.see(`${checkYourAnswersData.feeCode}`);
    I.see('Amount');
    I.see(`£${checkYourAnswersData.refundAmount}`);
    // I.seeElement('[Add remission]:disabled') Check to see disabled button not working for now....
    if (pageTitle === 'Service request') {
      I.see('Total reductions: ');
      I.see(`£${checkYourAnswersData.refundAmount}`);
      I.see('Total fees to pay: ');
      I.see('£15.00');
    }
    I.see('Add refund');
    I.click('//button[contains(.,\'Add refund\')]');
  },

  verifyCheckYourAnswersPageForAddOrInitiateRefund(checkYourAnswersData, reasonForRefund) {
    I.see('Check your answers');
    I.see('Reason for refund');
    I.see(reasonForRefund);
    I.see('Payment reference');
    I.see(`${checkYourAnswersData.paymentReference}`);
    I.see('Refund amount');
    I.see(`£${checkYourAnswersData.refundAmount}`);
    I.see('Fee code');
    I.see(`${checkYourAnswersData.feeCode}`);
    I.see('Fee amount');
    I.see(`${checkYourAnswersData.paymentAmount}`);
    I.see('Submit refund');
    I.click('Submit refund');
  },

  verifyRefundDetailsPage(caseTransactionsData, processRefundButtonVisible) {
    I.see('Refund details');
    I.see('Refund reference');
    I.see(`${caseTransactionsData.refundReference}`);
    I.see('Payment to be refunded');
    I.see(`${caseTransactionsData.paymentReference}`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Amount refunded');
    I.see(`${caseTransactionsData.refundAmount}`);
    I.see('Refund status history');
    I.see('Status');
    I.see(`${caseTransactionsData.refundStatus}`);
    I.see('Date and time');
    I.see('Users');
    I.see('Notes');
    I.see(`${caseTransactionsData.refundNotes}`);

    if (processRefundButtonVisible === false) {
      I.dontSee('Process refund');
      I.click('Back');
    } else {
      I.see('Process refund');
      I.click('Process refund');
    }
  },

  verifyRefundDetailsPageForResubmitRefund(caseTransactionsData) {
    I.see('Refund details');
    I.see('Refund reference');
    I.see(`${caseTransactionsData.refundReference}`);
    I.see('Payment to be refunded');
    I.see(`${caseTransactionsData.paymentReference}`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Amount refunded');
    I.see(`${caseTransactionsData.refundAmount}`);
    I.see('Refund status history');
    I.see('Status');
    I.see(`${caseTransactionsData.refundStatus}`);
    I.see('Update required');
    I.see('Date and time');
    I.see('Users');
    I.see('Notes');
    I.see('Refund initiated');
    I.see(`${caseTransactionsData.refundNotes}`);
    I.see('Resubmit refund');
    I.click('Resubmit refund');
  },

  verifyReviewAndResubmitRefundPage(caseTransactionsData, sendBackReason, changeRequired, issueRefund) {
    I.see('Review and resubmit refund');
    I.see('Reason for rejection');
    I.see(sendBackReason);
    I.see('Refund reference');
    I.see(`${caseTransactionsData.refundReference}`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Change');
    I.see('Payment reference');
    I.see(`${caseTransactionsData.paymentReference}`);
    // console.log(`The value of the change required flag ${changeRequired}`);
    // console.log(`The value of the issue refund flag ${issueRefund}`);
    // console.log(`The value of the payment amount ${caseTransactionsData.paymentAmount}`);
    // console.log(`The value of the refund amount ${caseTransactionsData.refundAmount}`);
    if (issueRefund) {
      I.see('Payment amount');
      I.see(`${caseTransactionsData.paymentAmount}`);
    } else {
      I.see('Refund amount');
      I.see(`${caseTransactionsData.refundAmount}`);
    }
    if (changeRequired) {
      I.click('//a[.=\'Change\']');
    } else {
      I.click('Submit refund');
    }
  },

  verifyNoAddRemissionOnPaymentDetailsPage() {
    I.dontSee('Add remission');
  },

  verifyRefundsListPage(refundRef) {
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.see('Refund list');
    I.see('Refunds to be approved');
    I.see('Filter by caseworker:');
    I.see('Case reference');
    I.see('Refund reference');
    I.see('Submitted by');
    I.see('Date created');
    I.see('Last updated');
    I.see('Action');
    I.see('Refunds returned to caseworker');
    I.selectOption(this.locators.users_drop_down_for_refunds_to_be_approved, 'Probate Requester12');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(this.locators.date_updated_for_refunds_to_be_approved_by_case_worker);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(this.locators.date_updated_for_refunds_to_be_approved_by_case_worker);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(`//mat-cell[contains(.,'${refundRef}')]/following-sibling::mat-cell/a[.='Process refund'][1]`);
  },

  verifyRefundsListPageForCaseWorker() {
    I.see('Refund list');
    I.dontSee('Refunds to be approved');
    I.see('Refunds returned to caseworker');
  },

  verifyRefundsListPageForCaseApproverPostApproverResubmission(refundReference) {
    I.see('Refund list');
    I.see('Refunds to be approved');
    I.selectOption(this.locators.users_drop_down_for_refunds_to_be_approved, 'Probate Request Request');
    I.click(this.locators.date_updated_for_refunds_to_be_approved_by_case_worker);
    I.click(this.locators.date_updated_for_refunds_to_be_approved_by_case_worker);
    I.dontSee(`${refundReference}`);
    I.see('Refunds returned to caseworker');
  },

  verifyReviewRefundsDetailsPage(caseTransactionsData, refundApprovalRequest) {
    I.see('Review refund details');
    I.see('Payment to be refunded');
    // console.log(`${caseTransactionsData.refundReference} (${caseTransactionsData.refundAmount})`);
    I.see(`${caseTransactionsData.refundReference} (${caseTransactionsData.refundAmount})`);
    I.see('Reason for refund');
    I.see(`${caseTransactionsData.refundReason}`);
    I.see('Amount to be refunded');
    I.see(`${caseTransactionsData.refundAmount}`);
    I.see('Submitted by');
    // console.log(`The value of the Refund Submitted By : ${caseTransactionsData.refundSubmittedBy}`);
    I.see(`${caseTransactionsData.refundSubmittedBy}`);
    I.see('Date submitted');
    I.see('What do you want to do with this refund?');
    I.see('Approve');
    I.see('Send to middle office');
    I.see('Reject');
    I.see('Return to caseworker');
    if (refundApprovalRequest === 'Reject') {
      I.checkOption('//input[@id=\'refundAction-1\']');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      I.checkOption('//input[@id=\'refundRejectReason-2\']');
    } else if (refundApprovalRequest === 'Approve') {
      I.checkOption('//input[@id=\'refundAction-0\']');
    } else if (refundApprovalRequest === 'Return to caseworker') {
      I.checkOption('//input[@id=\'refundAction-2\']');
      I.fillField('//textarea[@id=\'sendmeback\']', 'Test Reason Only');
    }
    I.click({ xpath: '//button[contains(text(),\'Submit\')]' });
  },

  verifyRefundApprovedPage(refundApprovalRequest) {
    if (refundApprovalRequest === 'Reject') {
      I.see('Refund rejected');
    } else if (refundApprovalRequest === 'Approve') {
      I.see('Refund approved');
    } else if (refundApprovalRequest === 'Return to caseworker') {
      I.see('Refund returned to caseworker');
    }
  },

  verifyReviewRefundsDetailsPageForNotificationsendRefund() {
    I.see('Notification');
    I.see('SendRefund');
    I.click('Preview');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.waitForText('From: HM Courts and Tribunals Registrations');
    I.waitForText('<hm.courts.and.tribunals.registrations@notifications.service.gov.uk>');
    I.see('To: vamshi.rudrabhatla@hmcts.net');
    I.see('Subject: HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case 1671126906988356 has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    // I.see('Refund reference: RF-****-****-****-****');
    I.see('Refund amount: £200');
    // I.see('Reason for refund: Overpayment');
    I.see('Your refund will be processed and sent to the account you originally made the payment from within 14 days');
    I.see('If you have not received the refund by this time, you need further information or you do not have a bank');
    I.see('account, contact probate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.see('This is an automated message, please don’t reply to this email.');
    I.click('Hide Preview');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.waitForText('Preview')
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  },

  verifyReviewRefundsDetailsPageForRefundsV2(refundApprovalRequest) {
    I.see('Review refund details');
    I.see('Payment to be refunded');
    I.see('Reason for refund');
    I.see('Amount to be refunded');
    I.see('Submitted by');
    I.see('Date submitted');
    I.see('What do you want to do with this refund?');
    I.see('Approve');
    I.see('Send to middle office');
    I.see('Reject');
    I.see('Return to caseworker');
    if (refundApprovalRequest === 'Reject') {
      I.checkOption('//input[@id=\'refundAction-1\']');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      I.checkOption('//input[@id=\'refundRejectReason-2\']');
    } else if (refundApprovalRequest === 'Approve') {
      I.checkOption('//input[@id=\'refundAction-0\']');
    } else if (refundApprovalRequest === 'Return to caseworker') {
      I.checkOption('//input[@id=\'refundAction-2\']');
      I.fillField('//textarea[@id=\'sendmeback\']', 'Test Reason Only');
    }
    I.click({ xpath: '//button[contains(text(),\'Submit\')]' });
  },

  verifyReviewRefundsDetailsPageForNotificationsendRefundWhenContacted() {
    I.see('Notification');
    I.see('RefundWhenContacted');
    I.click('Preview');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.waitForText('From: specified@justice.gov.uk');
    // I.waitForText('<hm.courts.and.tribunals.registrations@notifications.service.gov.uk>');
    I.see('To: vamshi.rudrabhatla@hmcts.net');
    I.see('Subject: HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case 1671126906988356 has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    // I.see('Refund reference: RF-****-****-****-****');
    I.see('Refund amount: £300');
    I.see('Reason for refund: Refund for Overpayment');
    I.see('To receive this refund, you must give us the correct bank details to process the request.');
    I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
    I.see('If you do not have a bank account, or if you need further information, contact specified@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.see('This is an automated message, please don’t reply to this email.');
    I.click('Hide Preview');
    I.waitForText('Preview')
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  },

  verifyReviewRefundsDetailsPageForNotificationsendRefundWhenContactedLetter() {
    I.see('Notification');
    I.see('RefundWhenContacted');
    I.click('Preview');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see('TW4 7EZ');
    I.see('From');
    I.see('ABC');
    I.see('london');
    I.see('UK');
    I.see('123 436');
    I.see('HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    I.see('Refund reference: RF-');
    I.see('Refund amount: £300');
    // I.see('Reason for refund: Overpayment');
    I.see('To receive this refund, you must give us the correct bank details to process the request.');
    I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
    I.see('If you do not have a bank account, or if you need further information, contact specified@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.click('Hide Preview');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.waitForText('Preview')
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  },

  verifyReviewRefundsDetailsPageForNotificationsendRefundLetter() {
    I.see('Notification');
    I.see('SendRefund');
    I.click('Preview');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see('TW4 7EZ');
    I.see('From');
    I.see('ABC');
    I.see('london');
    I.see('UK');
    I.see('123 436');
    I.see('HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    I.see('Refund reference: RF-');
    I.see('Refund amount: £200');
    // I.see('Reason for refund: Overpayment');
    I.see('Your refund will be processed and sent to the account you originally made the payment from within 14 days');
    I.see('If you have not received the refund by this time, you need further information or you do not have a bank');
    I.see('account, contact probate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.click('Hide Preview');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.waitForText('Preview')
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  },

  verifyRefundApprovedPage(refundApprovalRequest) {
    if (refundApprovalRequest === 'Reject') {
      I.see('Refund rejected');
    } else if (refundApprovalRequest === 'Approve') {
      I.see('Refund approved');
    } else if (refundApprovalRequest === 'Return to caseworker') {
      I.see('Refund returned to caseworker');
    }
  },

  operateRefundsReturnedToCaseWorker(refundReference) {
    I.selectOption(this.locators.users_drop_down_for_refunds_returned_to_case_worker, 'Probate Request Request');
    // Double Clicking For Sort By Descending....
    I.click(this.locators.date_updated_for_refunds_returned_to_case_worker);
    I.click(this.locators.date_updated_for_refunds_returned_to_case_worker);
    I.click(`//mat-cell[contains(.,'${refundReference}')]/following-sibling::mat-cell/a[.='Review refund']`);
  },

  verifyPaymentHistoryPage(paymentAmount, reviewRoute) {
    I.see('Payments');
    I.see('Status');
    I.see('Amount');
    I.see('Date');
    I.see('Request reference');
    I.see('Success');
    I.see(paymentAmount);

    I.see('Refunds');
    I.see('Status');
    I.see('Amount');
    I.see('Date');
    I.see('Refund reference');
    I.see('Reason');

    if (reviewRoute === 'Payments') {
      I.click('//div[2]//a[.=\'Review\']');
    } else {
      I.click('//div[@class=\'govuk-grid-row govuk-grid__surplus-payments\']/div[@class=\'govuk-grid-column-full\']/table[@class=\'govuk-table\']//a[.=\'Review\']');
    }
  }
};
