'use strict';
const CCPBATConstants = require('../tests/CCPBAcceptanceTestConstants');
const stringUtils = require('../helpers/string_utils');

const {I} = inject();

// Offer and Contact template
function verifyBulkScanPaymentRefundWhenContactedNotification(refundNotificationPreviewData) {
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
  if(refundNotificationPreviewData.customerReference === ""){
    I.see('Customer reference: ');
  } else {
    I.see(`Customer reference: ${refundNotificationPreviewData.customerReference}`);
  }
  I.see('These changes have been considered and you are entitled to a refund on your payment.');
  I.see(`Refund reference: ${refundNotificationPreviewData.refundReference}`);
  I.see(`Refund amount: £${refundNotificationPreviewData.refundAmount.replace('.00','')}`);
  I.see(`Reason for refund: ${refundNotificationPreviewData.refundReason}`);
  I.see('To receive this refund, you must give us the correct bank details to process the request.');
  I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
  I.see('If you do not have a bank account, or if you need further information, contact contactprobate@justice.gov.uk');
  I.see('HM Courts & Tribunals Service');
}

// Offer and Send template
function verifyCardOrPBASendRefundNotification(refundNotificationPreviewData) {
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
  if(refundNotificationPreviewData.customerReference != null){
    I.see(`Customer reference: ${refundNotificationPreviewData.customerReference}`);
  } else {
    I.see('Customer reference: ');
  }
  I.see('These changes have been considered and you are entitled to a refund on your payment.');
  I.see(`Refund reference: ${refundNotificationPreviewData.refundReference}`);
  I.see(`Refund amount: £${refundNotificationPreviewData.refundAmount.replace('.00','')}`);
  I.see(`Reason for refund: ${refundNotificationPreviewData.refundReason}`);
  I.see('Your refund will be processed and sent to the account you originally made the payment from within 14 days');
  I.see('If you have not received the refund by this time, you need further information or you do not have a bank account, contact contactprobate@justice.gov.uk');
  I.see('HM Courts & Tribunals Service');
}

// Online Card Refund When Contacted template
function verifyOnlineCardRefundWhenContactedNotification(refundNotificationPreviewData) {
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
  if(refundNotificationPreviewData.customerReference != null){
    I.see(`Customer reference: ${refundNotificationPreviewData.customerReference}`);
  } else {
    I.see('Customer reference: ');
  }
  I.see('These changes have been considered and you are entitled to a refund on your payment.');
  I.see(`Refund reference: ${refundNotificationPreviewData.refundReference}`);
  I.see(`Refund amount: £${refundNotificationPreviewData.refundAmount.replace('.00','')}`);
  I.see(`Reason for refund: ${refundNotificationPreviewData.refundReason}`);
  I.see('Unfortunately, our attempt to refund the payment card that you used was declined by your card provider. To receive this refund, you must give us the correct bank details to process the request.');
  I.see('To do this, visit https://bparefunds.liberata.com. You will need to quote your payment reference number and refund reference number.');
  I.see('If you do not have a bank account, or if you need further information, contact contactprobate@justice.gov.uk');
  I.see('HM Courts & Tribunals Service');
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

  verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval) {
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
    I.see('Actions');
    I.see('No record found ...');
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
  },

  verifyRefundDetailsAfterRefundRejected(reviewRefundDetailsDataAfterRejection) {
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

  verifyRefundDetailsAfterRefundReturnToCaseWorker(reviewRefundDetailsDataAfterApproval, refundReturnText) {
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
    I.see('No record found ...');
    I.see('Sent to');
    I.see('Sent via');
    I.see('Actions');
    I.see('Refund status history');
    I.see('Status');
    I.see('Sent for approval');
    I.see('Update required');
    I.see('Users');
    I.see(reviewRefundDetailsDataAfterApproval.refundRequester);
    I.see(reviewRefundDetailsDataAfterApproval.refundApprover);
    I.see('Notes');
    I.see('Refund initiated and sent to team leader');
    I.see(refundReturnText);
  },

  verifyRefundDetailsAfterRefundAcceptedByLiberata(reviewRefundDetailsDataAfterApproval, viewNotificationFlag = false, resendNotificationFlag = false, notifyEditDetailsFlag = false, refundNotificationPreviewData = null) {
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
    I.see('Accepted')
    I.see('Users');
    I.see(reviewRefundDetailsDataAfterApproval.refundRequester);
    I.see(reviewRefundDetailsDataAfterApproval.refundApprover);
    I.see('Middle office provider');
    I.see('Notes');
    I.see('Refund initiated and sent to team leader');
    I.see('Sent to middle office');
    I.see('Sent to Middle Office for Processing');
    if (viewNotificationFlag) {
      I.click('View');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      if (refundNotificationPreviewData.bulkScanPaymentMethod) {
        verifyBulkScanPaymentRefundWhenContactedNotification(refundNotificationPreviewData);
      } else {
        verifyCardOrPBASendRefundNotification(refundNotificationPreviewData);
      }
      I.click('Hide');
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
        I.click('//*[@id="contact"]');
        I.wait(CCPBATConstants.twoSecondWaitTime);
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
        I.see('autoTestNotifyEditDetails@mailtest.gov.uk');
        if (viewNotificationFlag) {
          I.click('View');
          I.wait(CCPBATConstants.fiveSecondWaitTime);
          refundNotificationPreviewData.email = 'autoTestNotifyEditDetails@mailtest.gov.uk';
          refundNotificationPreviewData.postcode= '';
          if (refundNotificationPreviewData.bulkScanPaymentMethod) {
            verifyBulkScanPaymentRefundWhenContactedNotification(refundNotificationPreviewData);
          } else {
            verifyCardOrPBASendRefundNotification(refundNotificationPreviewData);
          }
          I.click('Hide');
          I.wait(CCPBATConstants.twoSecondWaitTime);
        }
      } else if (reviewRefundDetailsDataAfterApproval.email) {
        I.waitForElement('//*[@id="contact-2"]', 5);
        I.click('//*[@id="contact-2"]');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.click('//*[@id="address-postcode"]');
        I.fillField('//*[@id="address-postcode"]', 'TW4 7EZ');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.click('Find address');
        I.wait(CCPBATConstants.fiveSecondWaitTime);
        I.selectOption('//*[@id="postcodeAddress"]', '89, MARTINDALE ROAD, HOUNSLOW, TW4 7EZ');
        I.click('Continue');
        I.wait(CCPBATConstants.twoSecondWaitTime);
        I.waitForText('Check your answers', 5);
        I.see('Refund reference');
        I.see(`${reviewRefundDetailsDataAfterApproval.refundReference}`);
        I.see('Send via');
        I.see('Post');
        I.see('TW4 7EZ');
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
        I.see('TW4 7EZ');
        if (viewNotificationFlag) {
          I.click('View');
          I.wait(CCPBATConstants.fiveSecondWaitTime);
          refundNotificationPreviewData.email = '';
          refundNotificationPreviewData.postcode= 'TW4 7EZ';
          if (refundNotificationPreviewData.bulkScanPaymentMethod === 'cash') {
            verifyBulkScanPaymentRefundWhenContactedNotification(refundNotificationPreviewData);
          } else {
            verifyCardOrPBASendRefundNotification(refundNotificationPreviewData);
          }
          I.click('Hide');
          I.wait(CCPBATConstants.twoSecondWaitTime);
        }
      }
    }
  },

  verifyRefundDetailsAfterLiberataRejection(refundDetailsDataAfterRejected, viewNotificationFlag = false, refundNotificationPreviewData = null) {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see(refundDetailsDataAfterRejected.refundReference);
    I.see('Payment to be refunded');
    I.see(refundDetailsDataAfterRejected.paymentRcReference);
    I.see('Reason for refund');
    I.see(refundDetailsDataAfterRejected.refundReason);
    I.see('Amount refunded');
    I.see(refundDetailsDataAfterRejected.refundAmount);
    I.see('Notifications sent');
    I.see('Date and time');
    I.see(refundDetailsDataAfterRejected.refundSubmittedDate);
    I.see('Sent to');
    I.see('Sent via');
    if (refundDetailsDataAfterRejected.email) {
      I.waitForText('Email', 5);
      I.see(refundDetailsDataAfterRejected.email);
    }
    if (refundDetailsDataAfterRejected.postcode) {
      I.waitForText('Post', 5);
      I.see(refundDetailsDataAfterRejected.postcode);
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
    I.see('Accepted');
    I.see('Rejected');
    I.see('Users');
    I.see(refundDetailsDataAfterRejected.refundRequester);
    I.see(refundDetailsDataAfterRejected.refundApprover);
    I.see('Middle office provider');
    I.see('System user');
    I.see('Notes');
    I.see('Refund initiated and sent to team leader');
    I.see('Sent to middle office');
    I.see('Sent to Middle Office for Processing');
    I.see('Unable to apply refund to Card');
    I.see('Refund approved by system');

    if (viewNotificationFlag) {
      I.click('View');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      verifyOnlineCardRefundWhenContactedNotification(refundNotificationPreviewData);
      I.click('Hide');
      I.wait(CCPBATConstants.twoSecondWaitTime);
    }
  },

  verifyRefundDetailsAfterLiberataExpiredTheRefund(refundDetailsDataAfterExpired, viewNotificationFlag = false, refundNotificationPreviewData = null) {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see(refundDetailsDataAfterExpired.refundReference);
    I.see('Payment to be refunded');
    I.see(refundDetailsDataAfterExpired.paymentRcReference);
    I.see('Reason for refund');
    I.see(refundDetailsDataAfterExpired.refundReason);
    I.see('Amount refunded');
    I.see(refundDetailsDataAfterExpired.refundAmount);
    I.see('Notifications sent');
    I.see('Date and time');
    I.see(refundDetailsDataAfterExpired.refundSubmittedDate);
    I.see('Sent to');
    I.see('Sent via');
    if (refundDetailsDataAfterExpired.email) {
      I.waitForText('Email', 5);
      I.see(refundDetailsDataAfterExpired.email);
    }
    if (refundDetailsDataAfterExpired.postcode) {
      I.waitForText('Post', 5);
      I.see(refundDetailsDataAfterExpired.postcode);
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
    I.see('Accepted');
    if (!refundNotificationPreviewData.bulkScanPaymentMethod) {
      I.see('Rejected');
    }
    I.see('Expired');
    I.see('Users');
    I.see(refundDetailsDataAfterExpired.refundRequester);
    I.see(refundDetailsDataAfterExpired.refundApprover);
    I.see('Middle office provider');
    if (!refundNotificationPreviewData.bulkScanPaymentMethod) {
      I.see('System user');
    }
    I.see('Notes');
    I.see('Refund initiated and sent to team leader');
    I.see('Sent to middle office');
    I.see('Sent to Middle Office for Processing');
    if (!refundNotificationPreviewData.bulkScanPaymentMethod) {
      I.see('Unable to apply refund to Card');
      I.see('Refund approved by system');
    }
    I.see('Unable to process expired refund');
    if (viewNotificationFlag) {
      I.click('View');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      if (refundNotificationPreviewData.bulkScanPaymentMethod) {
        verifyBulkScanPaymentRefundWhenContactedNotification(refundNotificationPreviewData);
      } else {
        verifyOnlineCardRefundWhenContactedNotification(refundNotificationPreviewData);
      }
      I.click('Hide');
      I.wait(CCPBATConstants.twoSecondWaitTime);
    }
  },

  verifyRefundDetailsAfterCaseworkerClosedTheRefund(refundDetailsDataAfterClosed, viewNotificationFlag = false, refundNotificationPreviewData = null) {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see(refundDetailsDataAfterClosed.refundReference);
    I.see('Payment to be refunded');
    I.see(refundDetailsDataAfterClosed.paymentRcReference);
    I.see('Reason for refund');
    I.see(refundDetailsDataAfterClosed.refundReason);
    I.see('Amount refunded');
    I.see(refundDetailsDataAfterClosed.refundAmount);
    I.see('Notifications sent');
    I.see('Date and time');
    I.see(refundDetailsDataAfterClosed.refundSubmittedDate);
    I.see('Sent to');
    I.see('Sent via');
    if (refundDetailsDataAfterClosed.email) {
      I.waitForText('Email', 5);
      I.see(refundDetailsDataAfterClosed.email);
    }
    if (refundDetailsDataAfterClosed.postcode) {
      I.waitForText('Post', 5);
      I.see(refundDetailsDataAfterClosed.postcode);
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
    I.see('Accepted');
    if (!refundNotificationPreviewData.bulkScanPaymentMethod) {
      I.see('Rejected');
    }
    I.see('Expired');
    I.see('Closed');
    I.see('Users');
    I.see(refundDetailsDataAfterClosed.refundRequester);
    I.see(refundDetailsDataAfterClosed.refundApprover);
    I.see('Middle office provider');
    if (!refundNotificationPreviewData.bulkScanPaymentMethod) {
      I.see('System user');
    }
    I.see('Notes');
    I.see('Refund initiated and sent to team leader');
    I.see('Sent to middle office');
    I.see('Sent to Middle Office for Processing');
    if (!refundNotificationPreviewData.bulkScanPaymentMethod) {
      I.see('Unable to apply refund to Card');
      I.see('Refund approved by system');
    }
    I.see('Unable to process expired refund');
    I.see('Refund closed by case worker');
    if (viewNotificationFlag) {
      I.click('View');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      if (refundNotificationPreviewData.bulkScanPaymentMethod) {
        verifyBulkScanPaymentRefundWhenContactedNotification(refundNotificationPreviewData);
      } else {
        verifyOnlineCardRefundWhenContactedNotification(refundNotificationPreviewData);
      }
      I.click('Hide');
      I.wait(CCPBATConstants.twoSecondWaitTime);
    }
  },

  verifyRefundDetailsAfterCaseworkerReissuedTheRefund(refundDetailsDataAfterReissued, newRefundReference) {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see(newRefundReference);
    I.see('Payment to be refunded');
    I.see(refundDetailsDataAfterReissued.paymentRcReference);
    I.see('Reason for refund');
    I.see(refundDetailsDataAfterReissued.refundReason);
    I.see('Amount refunded');
    I.see(refundDetailsDataAfterReissued.refundAmount);
    I.see('Notifications sent');
    I.see('Date and time');
    I.see('Sent to');
    I.see('Sent via');
    I.see('Actions');
    I.see('No record found ...');
    I.see('Refund status history');
    I.see('Status');
    I.see('Reissued');
    I.see('Approved');
    I.see('Users');
    I.see(refundDetailsDataAfterReissued.refundRequester);
    I.see('Notes');
    I.see(`1st re-issue of original refund ${refundDetailsDataAfterReissued.refundReference}`);
    I.see('Refund approved by system');
  },

  verifyRefundDetailsAfterCaseworkerReissuedTheRefundAndLiberataAccepted(refundDetailsDataAfterAccepted, viewNotificationFlag = false, refundNotificationPreviewData = null) {
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Refund details');
    I.see('Refund reference');
    I.see(refundNotificationPreviewData.refundReference);
    I.see('Payment to be refunded');
    I.see(refundDetailsDataAfterAccepted.paymentRcReference);
    I.see('Reason for refund');
    I.see(refundDetailsDataAfterAccepted.refundReason);
    I.see('Amount refunded');
    I.see(refundDetailsDataAfterAccepted.refundAmount);
    I.see('Notifications sent');
    I.see('Date and time');
    I.see(refundDetailsDataAfterAccepted.refundSubmittedDate);
    I.see('Sent to');
    I.see('Sent via');
    if (refundDetailsDataAfterAccepted.email) {
      I.waitForText('Email', 5);
      I.see(refundDetailsDataAfterAccepted.email);
    }
    if (refundDetailsDataAfterAccepted.postcode) {
      I.waitForText('Post', 5);
      I.see(refundDetailsDataAfterAccepted.postcode);
      I.see('89 MARTINDALE ROAD HOUNSLOW LONDON BOROUGH OF HOUNSLOW United Kingdom TW4 7EZ');
    }
    I.see('Actions');
    I.see('Resend');
    I.see('Edit details');
    I.see('View');
    I.see('Refund status history');
    I.see('Status');
    I.see('Reissued');
    I.see('Approved');
    I.see('Accepted');
    I.see('Users');
    I.see(refundDetailsDataAfterAccepted.refundRequester);
    I.see('Middle office provider');
    I.see('Notes');
    I.see(`1st re-issue of original refund ${refundDetailsDataAfterAccepted.refundReference}`);
    I.see('Refund approved by system');
    I.see('Sent to Middle Office for Processing');
    if (viewNotificationFlag) {
      I.click('View');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      if (refundNotificationPreviewData.bulkScanPaymentMethod) {
        verifyBulkScanPaymentRefundWhenContactedNotification(refundNotificationPreviewData);
      } else {
        verifyOnlineCardRefundWhenContactedNotification(refundNotificationPreviewData);
      }
      I.click('Hide');
      I.wait(CCPBATConstants.twoSecondWaitTime);
    }
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

  verifyBulkScanPaymentRefundWhenContactedNotification,
  verifyCardOrPBASendRefundNotification

};
