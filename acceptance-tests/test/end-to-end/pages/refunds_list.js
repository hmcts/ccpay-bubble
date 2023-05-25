'use strict';
const CCPBConstants = require('../tests/CCPBAcceptanceTestConstants');
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');
const stringUtils = require('../helpers/string_utils');

const {I} = inject();

// Offer and Contact template
function verifyBulkScanCashPaymentRefundWhenContactedNotification(refundNotificationPreviewData) {
  if (refundNotificationPreviewData.email) {
    I.waitForText('From: contactprobate@justice.gov.uk', 5);
    I.see(`To: ${refundNotificationPreviewData.email}`);
    I.see('Subject: HMCTS refund request approved');
    I.see('This is an automated message, please don’t reply to this email.');
  }
  if (refundNotificationPreviewData.postcode) {
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see(refundNotificationPreviewData.postcode);
    I.see(stringUtils.getTodayDateInDDMMMYYYY());
    I.see('HMCTS refund request approved');
  }
  I.see('Dear Sir/Madam,');
  I.see(`Our records show that case ${refundNotificationPreviewData.ccdCaseNumber} has recently been changed.`);
  I.see('These changes have been considered and you are entitled to a refund on your payment.');
  I.see(`Refund reference: ${refundNotificationPreviewData.refundReference}`);
  I.see(`Refund amount: £${refundNotificationPreviewData.refundAmount}`);
  I.see(`Reason for refund: ${refundNotificationPreviewData.refundReason}`);
  I.see('To receive this refund, you must give us the correct bank details to process the request.');
  I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
  I.see('If you do not have a bank account, or if you need further information, contact contactprobate@justice.gov.uk');
  I.see('HM Courts & Tribunals Service');
}

// Offer and Send template
function verifyChequeCardOrPBASendRefundNotification(refundNotificationPreviewData) {
  if (refundNotificationPreviewData.email) {
    I.waitForText('From: contactprobate@justice.gov.uk', 5);
    I.see(`To: ${refundNotificationPreviewData.email}`);
    I.see('Subject: HMCTS refund request approved');
    I.see('This is an automated message, please don’t reply to this email.');
  }
  if (refundNotificationPreviewData.postcode) {
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see(refundNotificationPreviewData.postcode);
    I.see(stringUtils.getTodayDateInDDMMMYYYY());
    I.see('HMCTS refund request approved');
  }
  I.see('Dear Sir/Madam,');
  I.see(`Our records show that case ${refundNotificationPreviewData.ccdCaseNumber} has recently been changed.`);
  I.see('These changes have been considered and you are entitled to a refund on your payment.');
  I.see(`Refund reference: ${refundNotificationPreviewData.refundReference}`);
  I.see(`Refund amount: £${refundNotificationPreviewData.refundAmount}`);
  I.see(`Reason for refund: ${refundNotificationPreviewData.refundReason}`);
  I.see('Your refund will be processed and sent to the account you originally made the payment from within 14 days');
  I.see('If you have not received the refund by this time, you need further information or you do not have a bank account, contact contactprobate@justice.gov.uk');
  I.see('HM Courts & Tribunals Service');
}

// Refund When Contacted template
function verifySystemApprovedRefundWhenContactedNotification(refundNotificationPreviewData) {
  if (refundNotificationPreviewData.email) {
    I.waitForText('From: contactprobate@justice.gov.uk', 5);
    I.see(`To: ${refundNotificationPreviewData.email}`);
    I.see('Subject: HMCTS refund request approved');
    I.see('This is an automated message, please don’t reply to this email.');
  }
  if (refundNotificationPreviewData.postcode) {
    I.see('89 MARTINDALE ROAD');
    I.see('HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom');
    I.see(refundNotificationPreviewData.postcode);
    I.see(stringUtils.getTodayDateInDDMMMYYYY());
    I.see('HMCTS refund request approved');
  }
  I.see('Dear Sir/Madam,');
  I.see(`Our records show that case ${refundNotificationPreviewData.ccdCaseNumber} has recently been changed.`);
  I.see('These changes have been considered and you are entitled to a refund on your payment.');
  I.see(`Refund reference: ${refundNotificationPreviewData.refundReference}`);
  I.see(`Refund amount: £${refundNotificationPreviewData.refundAmount}`);
  I.see(`Reason for refund: ${refundNotificationPreviewData.refundReason}`);
  I.see('To receive this refund, you must give us the correct bank details to process the request.');
  I.see('Unfortunately, our attempt to refund the payment card that you used was declined by your card provider. To receive this refund, you must give us the correct bank details to process the request.');
  I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
  I.see('If you do not have a bank account, or if you need further information, contact contactprobate@justice.gov.uk');
  I.see('HM Courts & Tribunals Service');
  I.see('This is an automated message, please don’t reply to this email.');
}


module.exports = {
  locators: {
    service_requests_review: {xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]'},
    payment_success_review: {xpath: '//td[1][@class = "govuk-table__cell whitespace-inherit"]/a[text()="Review"]'},
    review_Approved: {xpath: '//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr/td[6]/a'},
    checkbox_fee: {xpath: '//input[@name="organisation"]'},
    amount_to_refund: {xpath: '//input[starts-with(@id, "feeAmount")]'},
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
    I.see('Refund reference: RF-');
    I.see('Refund amount: £200');
    // I.see('Reason for refund: Overpayment');
    I.see('Your refund will be processed and sent to the account you originally made the payment from within 14 days');
    I.see('If you have not received the refund by this time, you need further information or you do not have a bank');
    I.see('account, contact contactprobate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.see('This is an automated message, please don’t reply to this email.');
    I.click('Hide');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.waitForText('View');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

  },

  verifyRefundDetailsAfterApprovalOfRefund(reviewRefundDetailsDataAfterApproval, viewNotificationFlag = false, resendNotificationFlag = false, notifyEditDetailsFlag = false, refundNotificationPreviewData = null) {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see(reviewRefundDetailsDataAfterApproval.refundReference);
    I.see('Payment to be refunded');
    I.see(reviewRefundDetailsDataAfterApproval.paymentRcReference);
    I.see('Reason for refund');
    I.see(reviewRefundDetailsDataAfterApproval.refundReason);
    I.see('Amount refunded');
    I.see(reviewRefundDetailsDataAfterApproval.refundAmount);
    I.see('Notifications sent');
    I.see('Date and time');
    I.see(reviewRefundDetailsDataAfterApproval.refundSubmittedDate);
    I.see('Sent to');
    I.see('Sent via');
    if (reviewRefundDetailsDataAfterApproval.email) {
      I.waitForText('Email', 5);
      I.see(reviewRefundDetailsDataAfterApproval.email);
    }
    if (reviewRefundDetailsDataAfterApproval.postcode) {
      I.waitForText('Post', 5);
      I.see(reviewRefundDetailsDataAfterApproval.postcode);
      I.see('89 MARTINDALE ROAD HOUNSLOW LONDON BOROUGH OF HOUNSLOW United Kingdom TW4 7EZ');
    }
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.see('View');
    I.see('Refund status history');
    I.see('Status');
    I.see('Sent for approval');
    I.see('Approved');
    I.see('Users');
    I.see(reviewRefundDetailsDataAfterApproval.refundRequester);
    I.see(reviewRefundDetailsDataAfterApproval.refundApprover);
    I.see('Notes');
    I.see('Refund initiated and sent to team leader');
    I.see('Sent to middle office');
    if (viewNotificationFlag) {
      I.click('View');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      if (refundNotificationPreviewData.bulkScanPaymentMethod === 'cash') {
        verifyBulkScanCashPaymentRefundWhenContactedNotification(refundNotificationPreviewData);
      } else {
        verifyChequeCardOrPBASendRefundNotification(refundNotificationPreviewData);
      }      I.click('Hide');
      I.wait(CCPBATConstants.twoSecondWaitTime);
    }
    if (resendNotificationFlag) {
      I.click('Resend');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      I.see('Notification sent');
      I.see(`Refund reference: ${reviewRefundDetailsDataAfterApproval.refundReference}`);
      I.click('Return to case');
      // I.wait(CCPBATConstants.fiveSecondWaitTime);
      // I.click('(//*[text()[contains(.,"Review")]])[3]');
      // I.wait(CCPBATConstants.tenSecondWaitTime);
      // I.waitForText('Refund details', 5);
    }
    // Change notification to opposite of earlier one (email -> post, post -> email)
    if (notifyEditDetailsFlag) {
      I.click('Edit details');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      if (reviewRefundDetailsDataAfterApproval.postcode) {
        I.waitForElement('//*[@id="contact"]', 5);
        I.click('//*[@id="email"]');
        I.fillField('//*[@id="email"]', 'autoTestNotifyEditDetails@mailtest.gov.uk');
        I.click('Continue');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.waitForText('Check your answers', 5);
        I.see('Refund reference');
        I.see(`${reviewRefundDetailsDataAfterApproval.refundReference}`);
        I.see('Send via');
        I.see('Email');
        I.see('autoTestNotifyEditDetails@mailtest.gov.uk');
        I.see('Change');
        I.click('Change');
        I.click('Continue');
        I.see('Notification');
        I.see('Preview');
        I.click('Preview');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.waitForText('HMCTS refund request approved', 5);
        I.click('Hide Preview');
        I.click('Send notification');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
        I.see('Notification sent');
        I.see(`Refund reference: ${reviewRefundDetailsDataAfterApproval.refundReference}`);
        I.click('Return to case');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
        I.click('(//*[text()[contains(.,"Review")]])[3]');
        I.wait(CCPBATConstants.tenSecondWaitTime);
        I.waitForText('Refund details', 5);
      } else if (reviewRefundDetailsDataAfterApproval.email) {
        I.waitForElement('//*[@id="contact-2"]', 5);
        I.click('//*[@id="contact-2"]');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.click('//*[@id="address-postcode"]');
        I.fillField('//*[@id="address-postcode"]', 'SL1 2JN');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.click('Find address');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
        I.selectOption('//*[@id="postcodeAddress"]', 'APARTMENT 4, TREVITHICK 113-127, WINDSOR ROAD, SLOUGH, SL1 2JN');
        I.click('Continue');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.waitForText('Check your answers', 5);
        I.see('Refund reference');
        I.see(`${reviewRefundDetailsDataAfterApproval.refundReference}`);
        I.see('Send via');
        I.see('Post');
        I.see('SL1 2JN');
        I.see('Change');
        I.click('Change');
        I.click('Continue');
        I.see('Notification');
        I.see('Preview');
        I.click('Preview');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.waitForText('HMCTS refund request approved', 5);
        I.click('Hide Preview');
        I.click('Send notification');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
        I.see('Notification sent');
        I.see(`Refund reference: ${reviewRefundDetailsDataAfterApproval.refundReference}`);
        I.click('Return to case');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
        I.click('(//*[text()[contains(.,"Review")]])[3]');
        I.wait(CCPBATConstants.tenSecondWaitTime);
        I.waitForText('Refund details', 5);
      }
    }
  },

  verifyRefundDetailsAfterApprovalOfRefundSendRefundWhenContacted() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    I.see('Email');
    I.see('vamshi.rudrabhatla@hmcts.net');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.see('Notifications sent');
    I.see('Refund reference');
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
    I.see('If you do not have a bank account, or if you need further information, contact contactprobate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.see('This is an automated message, please don’t reply to this email.');
    I.click('Hide');
    I.waitForText('View')
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  },

  verifyRefundDetailsAfterApprovalOfRefundSendRefundWhenContactedLetter() {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('	Sent via');
    I.see('Post');
    I.see('89 MARTINDALE ROAD HOUNSLOW');
    I.see('LONDON BOROUGH OF HOUNSLOW');
    I.see('United Kingdom TW4 7EZ');
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
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
    I.see('If you do not have a bank account, or if you need further information, contact contactprobate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.click('Hide');
    I.waitForText('View')
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.click('Resend');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Return to case');
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
    I.see('account, contact contactprobate@justice.gov.uk.');
    I.see('HM Courts & Tribunals Service');
    I.click('Hide');
    I.waitForText('View')
    I.wait(CCPBATConstants.tenSecondWaitTime);

  },

  verifyRefundDetailsAfterRejectionOfOverPayment(reviewRefundDetailsDataAfterRejection) {
    I.see('Refund details');
    I.see('Refund reference');
    I.see(reviewRefundDetailsDataAfterRejection.refundReference);
    I.see('Payment to be refunded');
    I.see(reviewRefundDetailsDataAfterRejection.paymentRcReference);
    I.see('Reason for refund');
    I.see(reviewRefundDetailsDataAfterRejection.refundReason);
    I.see('Amount refunded');
    I.see(reviewRefundDetailsDataAfterRejection.refundAmount);
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('No record found ...');
    I.see('Sent to');
    I.see('Sent via');
    I.see('Actions');
    I.see('Refund status history');
    I.see('Status');
    I.see('Rejected');
    I.see('Sent for approval');
    I.see(reviewRefundDetailsDataAfterRejection.refundSubmittedDate);
    I.see('Users');
    I.see(reviewRefundDetailsDataAfterRejection.refundApprover);
    I.see(reviewRefundDetailsDataAfterRejection.refundRequester);
    I.see('Notes');
    I.see('No associated payment');
    I.see('Refund initiated and sent to team leader');
  },

  verifyRefundDetailsAfterReturnToCaseWorkerOfFullPayment(refundRef) {
    I.see('Refund details');
    I.see('Refund reference');
    I.see('Reason for refund');
    I.see('Amount refunded');
    I.see('Fee not due');
    I.see('£500.00');
    I.see(`${refundRef}`);
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

  verifyIssueRefundPageForPartialPayments(refundAmount) {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Process refund');
    I.see('Payment reference:');
    I.see('Select fees to be refunded');
    I.see('Personal Application for grant of Probate');
    I.see('£273.00');
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
      this.click({xpath: `//matt-cell[.="${refundReferenceNumber}"]/following-sibling::matt-cell/a[.="Process refund"]`});
    } else {
      this.click({xpath: `//matt-cell[.="${refundReferenceNumber}"]/following-sibling::matt-cell/a[.="Review refund"]`});
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

  verifyBulkScanCashPaymentRefundWhenContactedNotification,
  verifyChequeCardOrPBASendRefundNotification,
  verifySystemApprovedRefundWhenContactedNotification

};
