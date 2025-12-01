/* eslint-disable */
const stringUtils = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");

Feature('CC Pay Bubble Card payment refund PayIt journey').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Card payment refund PayIt journey',
  async ({ I, ServiceRequests, CaseSearch, CaseTransaction, InitiateRefunds, RefundsList }) => {

    const emailAddress = stringUtils.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = '300.00';
    const refundAmount = '300.00';
    const ccdCaseNumber = await apiUtils.createACCDCaseForProbate();

    const serviceRequestDetails = await apiUtils.createAServiceRequest('ABA6', totalAmount, 'FEE0219', '7', 1, ccdCaseNumber);
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;

    // successful card payment
    const cardPaymentResponse = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url = `${cardPaymentResponse.next_url}`;

    I.amOnPage(next_url);
    I.waitForText('Enter card details', 5);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const paymentCardValues = assertionData.getPaymentCardValues('4444333322221111', '01',
      '26', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Confirm your payment', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyConfirmYourPaymentPageCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Payment successful');
    I.click('Return to service request');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Sign in');

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');
    // rollback payment date for the refund eligibility
    await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);

    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Application for a grant of probate (Estate over 5000 GBP)', '£300.00', '£300.00', '300', '1', '£0.00');
    await InitiateRefunds.verifyProcessRefundPageForFeeRefundSelection(reviewProcessRefundPageData, ccdCaseNumber);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundReason = 'System/technical error';
    await InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, refundReason);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, `£${totalAmount}`, '', refundReason, `£${refundAmount}`, emailAddress, '', 'SendRefund');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, 'RF-****-****-****-****', refundAmount, 'Due to a technical error a payment was taken incorrectly and has now been refunded', '');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, true, false, refundNotificationPreviewDataBeforeRefundRequest);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage(refundAmount);
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    // I.click('Refund List'); // Refund List menu is hidden on paybubble, navigating to the refund-list page itself -- see above url
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, refundReason, `£${refundAmount}`, emailAddress, '', 'payments probate', 'SendRefund');
    const refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, refundAmount, 'Due to a technical error a payment was taken incorrectly and has now been refunded', '');

    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction, true, refundNotificationPreviewDataBeforeRefundApproved);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Liberata Accepted the Refund
    await apiUtils.updateRefundStatusByRefundReference(refundReference, '', 'ACCEPTED');

    // Review refund from case transaction page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    const reviewRefundDetailsDataAfterRefundAccepted = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, refundReason, `£${refundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterRefundAccepted = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, refundAmount, 'Due to a technical error a payment was taken incorrectly and has now been refunded', '');
    await RefundsList.verifyRefundDetailsAfterRefundAcceptedByLiberata(reviewRefundDetailsDataAfterRefundAccepted, true, false, false, refundNotificationPreviewDataAfterRefundAccepted);
    I.click('Back');

    // Liberata Rejected the Card payment refund with Unable to apply refund to Card reason.
    await apiUtils.updateRefundStatusByRefundReference(refundReference, 'Unable to apply refund to Card', 'REJECTED');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // Liberata pull the refund and ACCEPTED again
    await apiUtils.updateRefundStatusByRefundReference(refundReference, '', 'ACCEPTED');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    await RefundsList.verifyRefundDetailsAfterLiberataRejection(reviewRefundDetailsDataAfterRefundAccepted, true, refundNotificationPreviewDataAfterRefundAccepted);

    await I.Logout();
    I.clearCookie();

  }).tag('@pipeline @nightly');

Scenario('Card payment refund PayIt expired(21 days) journey',
  async ({ I, ServiceRequests, CaseSearch, CaseTransaction, InitiateRefunds, RefundsList }) => {

    const emailAddress = stringUtils.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = '300.00';
    const refundAmount = '300.00';
    const ccdCaseNumber = await apiUtils.createACCDCaseForProbate();

    const serviceRequestDetails = await apiUtils.createAServiceRequest('ABA6', totalAmount, 'FEE0219', '7', 1, ccdCaseNumber);
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;

    // successful card payment
    const cardPaymentResponse = await apiUtils.initiateCardPaymentForServiceRequest(totalAmount, serviceRequestReference);
    const next_url = `${cardPaymentResponse.next_url}`;

    I.amOnPage(next_url);
    I.waitForText('Enter card details', 5);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const paymentCardValues = assertionData.getPaymentCardValues('4444333322221111', '01',
      '26', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Confirm your payment', '£300.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyConfirmYourPaymentPageCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Payment successful');
    I.click('Return to service request');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.see('Sign in');

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');
    // rollback payment date for the refund eligibility
    await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);

    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Application for a grant of probate (Estate over 5000 GBP)', '£300.00', '£300.00', '300', '1', '£0.00');
    await InitiateRefunds.verifyProcessRefundPageForFeeRefundSelection(reviewProcessRefundPageData, ccdCaseNumber);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundReason = 'System/technical error';
    await InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, refundReason);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, `£${totalAmount}`, '', refundReason, `£${refundAmount}`, emailAddress, '', 'SendRefund');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, 'RF-****-****-****-****', refundAmount, 'Due to a technical error a payment was taken incorrectly and has now been refunded', '');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, true, false, refundNotificationPreviewDataBeforeRefundRequest);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage(refundAmount);

    // Approver approved the refund
    await apiUtils.updateRefundStatusByApprover(refundReference, 'APPROVE');
    // Liberata Accepted the Refund
    await apiUtils.updateRefundStatusByRefundReference(refundReference, '', 'ACCEPTED');

    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    const reviewRefundDetailsDataAfterRefundAccepted = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, refundReason, `£${refundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterRefundAccepted = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, refundAmount, 'Due to a technical error a payment was taken incorrectly and has now been refunded', '');
    await RefundsList.verifyRefundDetailsAfterRefundAcceptedByLiberata(reviewRefundDetailsDataAfterRefundAccepted, true, false, false, refundNotificationPreviewDataAfterRefundAccepted);

    // Liberata Rejected the Card payment refund with Unable to apply refund to Card reason.
    await apiUtils.updateRefundStatusByRefundReference(refundReference, 'Unable to apply refund to Card', 'REJECTED');
    // Liberata pull the refund and ACCEPTED again
    await apiUtils.updateRefundStatusByRefundReference(refundReference, '', 'ACCEPTED');

    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    await RefundsList.verifyRefundDetailsAfterLiberataRejection(reviewRefundDetailsDataAfterRefundAccepted, true, refundNotificationPreviewDataAfterRefundAccepted);

    // Liberata updated the refund with Expired status after 21 days
    await apiUtils.updateRefundStatusByRefundReference(refundReference, 'Unable to process expired refund', 'EXPIRED');

    // Verify the Expired refund details
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    await RefundsList.verifyRefundDetailsAfterLiberataExpiredTheRefund(reviewRefundDetailsDataAfterRefundAccepted, true, refundNotificationPreviewDataAfterRefundAccepted);

    // Reset the refund to Reissue the new refund
    I.see('Reset Refund');
    I.click('Reset Refund');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.see(`Close current refund reference number ${refundReference}`);
    I.see('Reissue refund with a new reference number');
    I.see('Issue a new Offer and Contact notification for the reissued refund');
    I.see('Cancel')
    I.click('Cancel');
    I.waitForText('Reset Refund', '5');
    I.click('Reset Refund');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Submit');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.waitForText('Case transactions', '5');
    I.see('Closed');
    I.see('Approved');
    const newRefundReference = await I.grabTextFrom('//td[contains(.,\'Approved\')]/ancestor::tr/td[4]');

    // Verify the Closed refund
    await I.click(`//td[contains(.,'${refundReference}')]/following-sibling::td/a[.=\'Review\'][1]`);
    await RefundsList.verifyRefundDetailsAfterCaseworkerClosedTheRefund(reviewRefundDetailsDataAfterRefundAccepted, true, refundNotificationPreviewDataAfterRefundAccepted);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Verify the Reissued refund
    await I.click(`//td[contains(.,'${newRefundReference}')]/following-sibling::td/a[.=\'Review\'][1]`);
    await RefundsList.verifyRefundDetailsAfterCaseworkerReissuedTheRefund(reviewRefundDetailsDataAfterRefundAccepted, newRefundReference);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Liberata Accepted the Reissued Refund
    await apiUtils.updateRefundStatusByRefundReference(newRefundReference, '', 'ACCEPTED');
    await I.click(`//td[contains(.,'${newRefundReference}')]/following-sibling::td/a[.=\'Review\'][1]`);
    const reviewRefundDetailsDataAfterRefundReissuedAndAccepted = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, refundReason, `£${refundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterRefundReissuedAndAccepted = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, newRefundReference, refundAmount, 'Due to a technical error a payment was taken incorrectly and has now been refunded', '');
    await RefundsList.verifyRefundDetailsAfterCaseworkerReissuedTheRefundAndLiberataAccepted(reviewRefundDetailsDataAfterRefundReissuedAndAccepted, true, refundNotificationPreviewDataAfterRefundReissuedAndAccepted);

    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly @debug');
