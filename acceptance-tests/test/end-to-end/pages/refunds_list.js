'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');

const { I } = inject();

module.exports = {
  locators: {
    service_requests_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },
    payment_success_review: { xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]' },
    review_Approved: {xpath: '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr/td[6]/a'},
    checkbox_fee: {xpath: '//input[@name="organisation"]'},
    amount_to_refund: {xpath: '//input[starts-with(@id, "feeAmount")]'},
    fee_not_due: {xpath: '//*[@id="Fee not due"]'},
    view_button: {xpath: '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-refund-status//a[3]'}
  },

  async getHeaderValue() {
    const headerValue = await I.grabTextFrom(this.locators.header);
    return headerValue;
  },

  verifyReviewRefundDetailsPage(refundReferenceNumber, reasonForRefund, amountToBeRefunded) {
    I.waitForText('Review Refund details', CCPBConstants.fiveSecondWaitTime);
    I.see('Payment to be refunded');
    I.see(refundReferenceNumber);
    I.see('Reason for refund');
    I.see(reasonForRefund);
    I.see('Amount to be refunded');
    I.see(`£${amountToBeRefunded}`);
    I.see('Submitted By');
    I.see('Date submitted');
    I.see('What do you want to do with this refund?');
    // I.click('Approve');
    I.click('Submit');
  },

  verifyProcessRefundPage() {
    I.waitForText('Process refund', '5');
    I.see('Why are you making this refund', '5');
    // I.selectOption('','Amended ');
    I.click('Continue');
  },

  verifyReviewAndResubmitRefundPage(refundReferenceNumber, changeRequired) {
    I.waitForText('Review and resubmit refund', '5');
    I.see('Reason for rejection');
    I.see('Refund reference');
    I.see(refundReferenceNumber);
    I.see('Reason for refund');
    I.see('Change');
    // I.see(reason_for_refund);
    I.see('Payment reference');
    I.see('Payment amount');
    if (changeRequired === 'true') {
      I.click('Change');
    } else {
      I.click('Submit refund');
    }
  },

  verifyRefundDetailsAfterApprovalOfRefund() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    // I.see(reason_for_refund);
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.click('Resend');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Notification sent');
    I.see('Refund reference');
    I.click('Return to case');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(this.locators.review_Approved);
    I.wait(CCPBATConstants.fiveSecondWaitTime);

  },

  verifyRefundDetailsAfterApprovalOfRefundSendRefund() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    // I.see(reason_for_refund);
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.see('View');
    I.click('View');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // I.see('From: HM Courts and Tribunals Registrations');
    // I.see('<hm.courts.and.tribunals.registrations@notifications.service.gov.uk>');
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
    I.click('Hide');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.waitForText('View');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

  },

  verifyRefundDetailsAfterApprovalOfRefundLetter() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    // I.see(reason_for_refund);
    I.see('Post');
    I.see('89 MARTINDALE ROAD HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom TW4 7EZ');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.click('Resend');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Return to case');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(this.locators.review_Approved);
    I.wait(CCPBATConstants.fiveSecondWaitTime);

  },

  verifyRefundDetailsAfterApprovalOfRefundSendRefundWhenContacted() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(this.locators.view_button);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // I.waitForText('From: specified@justice.gov.uk');
    // I.waitForText('<hm.courts.and.tribunals.registrations@notifications.service.gov.uk>');
    I.see('Subject: HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case 1671126906988356 has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    // I.see('Refund reference: RF-****-****-****-****');
    I.see('Refund amount: £300');
    I.see('Reason for refund: Refund for Overpayment');
    I.see('To receive this refund, you must give us the correct bank details to process the request.');
    I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
    I.see('If you do not have a bank account, or if you need further information, contact probate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.see('This is an automated message, please don’t reply to this email.');
    I.click('Hide');
    I.waitForText('View')
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.click('Back');

  },

  verifyRefundDetailsAfterApprovalOfRefundSendRefundWhenContactedLetter() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(this.locators.view_button);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see('TW4 7EZ');
    I.see('HMCTS refund request approved');
    I.see('Dear Sir/Madam,');
    // I.see('Our records show that case has recently been changed.');
    I.see('These changes have been considered and you are entitled to a refund on your payment.');
    I.see('Refund reference: RF-');
    I.see('Refund amount: £300');
    // I.see('Reason for refund: Over payment')
    I.see('To receive this refund, you must give us the correct bank details to process the request.');
    I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
    I.see('If you do not have a bank account, or if you need further information, contact probate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.click('Hide');
    I.waitForText('View')
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.click('Back');

  },

  verifyRefundDetailsAfterApprovalOfRefundSendRefundLetter() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click(this.locators.view_button);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see('TW4 7EZ');
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
    I.click('Hide');
    I.waitForText('View')
    I.wait(CCPBATConstants.tenSecondWaitTime);

  },
  verifyRefundDetailsAfterRejectionOfOverPayment() {
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Overpayment');
    I.see('£300.00');
    I.see('RF-');
    I.see('RC-');
    I.see('Refund status history');
    I.see('Status');
    I.see('Rejected');
    I.see('Sent for approval');
    I.see('Users');
    I.see('Probate Request Request');
    I.see('Refund initiated and sent to team leader');
    I.see('Notes');
    I.see('Date and time');
  },

  verifyRefundDetailsAfterReturnToCaseWorkerOfFullPayment() {
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Fee not due');
    I.see('£500.00');
    I.see('RF-');
    I.see('RC-');
    I.see('Refund status history');
    I.see('Status');
    I.see('Update required');
    I.see('Sent for approval');
    I.see('Users');
    I.see('Probate Request Request');
    I.see('Refund initiated and sent to team leader');
    I.see('Notes');
    I.see('Test Reason Only');
    I.see('Date and time');
  },

verifyIssueRefundPageForPartialPayments(amount){
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.see('Process refund');
  I.see('Payment reference:');
  I.see('Select fees to be refunded');
  I.see('Personal Application for grant of Probate');
  I.see('£215.00');
  I.see('Fee amount');
  I.see('Total paid');
  I.see('Quantity');
  I.see('Amount to refund');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.click(this.locators.checkbox_fee);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.click(this.locators.amount_to_refund);
  I.clearField(this.locators.amount_to_refund);
  I.fillField(this.locators.amount_to_refund, amount);
},

verifyIssueRefundPageForRemissions(amount){
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.see('Process refund');
  I.see('Payment reference:');
  I.see('Select fees to be refunded');
  I.see('Fee amount');
  I.see('Total paid');
  I.see('Quantity');
  I.see('Amount to refund');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.click(this.locators.checkbox_fee);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.click(this.locators.amount_to_refund);
  I.clearField(this.locators.amount_to_refund);
  I.fillField(this.locators.amount_to_refund, amount);
},

verifyProcessRefund(){
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  I.see('Process refund');
  I.see('Payment reference:');
  I.see('Why are you making this refund?');
  I.click(this.locators.fee_not_due);
  I.click('Continue');
},


  /* verifyReviewAndResubmitRefundPage(refund_reference_number) {
    I.waitForText('Review and resubmit refund', '5');
    I.see('Reason for rejection');
    I.see('Refund reference');
    I.see(refund_reference_number);
    I.see('Reason for refund');
    I.see('Change');
    // I.see(reason_for_refund);
    I.see('Payment reference');
    I.see('Payment amount');
    I.click('Change');
  },*/

  verifyRefundsDetailsForResubmitRefundPage(refundReferenceNumber) {
    I.waitForText('Refund Details', '5');
    I.see('Refund reference');
    I.see(refundReferenceNumber);
    I.see('Payment to be refunded');
    I.see('Reason For Refund');
    // I.see(reason_for_refund);
    I.see('Amount refunded');
    // I.see(amount_refunded);
    I.see('Refund status history');
    I.see('status');
    I.see('Date and time');
    I.see('User');
    I.see('Notes');
    this.click('Resubmit refund');
  },

  verifyRefundsListPage(title, refundReferenceNumber) {
    I.waitForText('Refund List', '5');

    if (title === 'Approve Refund') {
      I.see('Refunds to be approved');
    } else {
      I.see('Refunds returned to caseworker');
    }

    I.click('Continue');
    I.see('Case ID');
    I.see('Refund reference');
    I.see('Reason');
    I.see('Submitted by');
    I.see('Date Updated');
    I.see('Action');
    I.click('Date Updated');

    if (title === 'Approve Refund') {
      this.click({ xpath: `//matt-cell[.="${refundReferenceNumber}"]/following-sibling::matt-cell/a[.="Process refund"]` });
    } else {
      this.click({ xpath: `//matt-cell[.="${refundReferenceNumber}"]/following-sibling::matt-cell/a[.="Review refund"]` });
    }
  },

  reviewRefundJourney(refundReferenceNumber) {
    verifyRefundsListPage('Review Refund', refundReferenceNumber);
    verifyRefundsDetailsForResubmitRefundPage(refundReferenceNumber);
    verifyReviewAndResubmitRefundPage(refundReferenceNumber, 'true');
    verifyProcessRefundPage();
    verifyReviewAndResubmitRefundPage(refundReferenceNumber, 'false');
    InitiateRefunds.verifyRefundConfirmationPage();
  },

  approveRefundJourney(refundReferenceNumber) {
    verifyRefundsListPage('Approve Refund', refundReferenceNumber);
    verifyReviewRefundsPage();
  },

  verifyRefundDetailsAfterOverPayment() {
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Payment to be refunded');
    I.see('Reason for refund');
    I.see('£300.00');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.click('Back');
  },

  verifyRefundDetailsAfterRemission() {
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Payment to be refunded');
    I.see('Reason for refund');
    I.see('£100.00');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.click('Back');
  },

  verifyRefundDetailsAfterRefunds() {
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Payment to be refunded');
    I.see('Reason for refund');
    I.see('£100.00');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.click('Back');
  },
};
