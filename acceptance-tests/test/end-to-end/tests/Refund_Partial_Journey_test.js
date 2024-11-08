/* eslint-disable */
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");

Feature('CC Pay Bubble Partial Refund journey test').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('PBA Partial Refund, preview SendRefund letter notification journey and resend notification to email from letter edit',
  async ({ I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails, RefundsList }) => {

    const postcode = 'TW4 7EZ';
    // Create Payment and back date for refund eligibility
    const totalAmount = '300.00';
    const paymentDetails = await apiUtils.createAPBAPayment(totalAmount, 'FEE0219', '6', 1);
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRef = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRef);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForPartialPayments(totalAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await PaymentHistory.validatePaymentDetailsForPartialPayment(paymentRef, totalAmount);
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    // Submit refund
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Application for a grant of probate (Estate over 5000 GBP)', '£300.00', '£300.00', '200', '1');
    await InitiateRefunds.verifyProcessRefundPageForFeeRefundSelection(reviewProcessRefundPageData, ccdCaseNumber);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundDropDownReason = 'Other - CoP';
    const reasonText = 'Auto test';
    await InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasonsAndContinue(ccdCaseNumber, refundDropDownReason, reasonText);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="contact-2"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//*[@id="address-postcode"]');
    I.fillField('//*[@id="address-postcode"]', postcode);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Find address');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.selectOption('//*[@id="postcodeAddress"]', '89, MARTINDALE ROAD, HOUNSLOW, TW4 7EZ');
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£300.00', '', refundDropDownReason + '-' + reasonText, '£200.00', '', postcode, 'SendRefund');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, 'RF-****-****-****-****', '200', 'Other');

    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, false, false, refundNotificationPreviewDataBeforeRefundRequest);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, 'CoP-Auto test', '£200.00', '', postcode, 'payments probate', 'SendRefund');
    const refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, refundReference, '200', 'Other');

    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction, true, refundNotificationPreviewDataBeforeRefundApproved);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Review refund from case transaction page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, 'CoP-Auto test', '£200.00', '', postcode, 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterApproval = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, refundReference, '200', 'Other');

    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval, true, false, true, refundNotificationPreviewDataAfterApproval);
    await I.Logout();

  }).tag('@pipeline @nightly');
