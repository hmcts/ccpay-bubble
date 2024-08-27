/* eslint-disable no-alert, no-console */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');
const assert = require('assert');

// eslint-disable-next-line no-unused-vars

const apiUtils = require('../helpers/utils');
const assertionData = require('../fixture/data/refunds/assertion');
const stringUtil = require('../helpers/string_utils.js');
const testConfig = require('./config/CCPBConfig');

Feature('CC Pay Bubble Refund Over payment option selection journey test').retry(CCPBATConstants.defaultNumberOfRetries);

// Bulk scan cash overpayment refund option (Over Paid Fee CANNOT have a Remission based Refund), email notification preview at all 3 stages(before refund request, refund approve and after approve) and Resend Notification
Scenario('Bulk scan cash Over Payment refund, preview RefundWhenContacted email notification and Resend Notification journey',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cash';
    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = 300;

    // Create Payment and back date for refund eligibility
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('273');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£300.00', '0', '£0.00', '£0.00', '£27.00');
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
    }
    // Over Paid Fee CANNOT have a Remission based Refund
    I.dontSeeElement('Add remission')
    // Submit refund
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£300.00', '£273.00', 'Over payment', '£27.00', emailAddress, '', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, 'RF-****-****-****-****', '27', 'Refund for Overpayment', bulkScanPaymentMethod);

    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, refundNotificationPreviewDataBeforeRefundRequest);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('27.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£300.00', '0', '£0.00', '£0.00', '£27.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.tenSecondWaitTime);

    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, 'Overpayment', '27.00', emailAddress, '', 'payments probate', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '27', 'Refund for Overpayment', bulkScanPaymentMethod);

    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction, true, refundNotificationPreviewDataBeforeRefundApproved);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Verify the email from notify
    const emailResponse = await apiUtils.getEmailFromNotifyWithMaxRetries(emailAddress);
    assert.strictEqual('HMCTS refund request approved', emailResponse.subject);

    // Review refund from case transaction page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£300.00', '0', '£0.00', '£0.00', '£0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, 'Overpayment', '27.00', emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterApproval = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '27', 'Refund for Overpayment', bulkScanPaymentMethod);
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval, true, true, false, refundNotificationPreviewDataAfterApproval);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');

Scenario('Refund journey for complete cheque amount(500) with OverPayment option(280) and Refund(220) and Liberata rejected System approved RefundWhenContacted notification',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('220');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£500.00', '0', '£0.00', '£0.00', '£280.00');

    //  Over Payment refund - 280
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.tenSecondWaitTime);
    }
    I.waitForText('Issue refund', 5);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '£220.00', 'Over payment', '£280.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false);
    const refundRefOverPayments = await InitiateRefunds.verifyRefundSubmittedPage('280.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£500.00', '0', '£0.00', '£0.00', '£280.00');

    // Refund with reason - 220
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Issue refund', 5);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.', '£220.00', '£220.00', '220', '1');
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
    const checkYourAnswersDataBeforeSubmitRefund2 = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '', refundReason, '£220.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund2, false, false, false, false);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('220.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£500.00', '0', '£0.00', '£0.00', '£280.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve both refunds from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;

    for (let i = 0; i <= 1; i++) {
      I.wait(CCPBATConstants.fifteenSecondWaitTime);
      if (i === 0) {
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefOverPayments, 'Overpayment', '£280.00', emailAddress, '', 'payments probate', 'SendRefund');
      }
      if (i === 1) {
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRef, refundReason, '£220.00', emailAddress, '', 'payments probate', 'SendRefund');
      }
      await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
      I.wait(CCPBATConstants.twoSecondWaitTime);
      InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
      InitiateRefunds.approverActionForRequestedRefund('Approve');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      I.amOnPage('/refund-list?takePayment=false&refundlist=true');
    }

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Review approved refunds from Case transactions page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForRefunds(refundRef, refundRefOverPayments);
    await I.click(`//td[contains(.,'${refundRefOverPayments}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewOverPaymentRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefOverPayments, paymentRcReference, 'Overpayment', '£280.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewOverPaymentRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, '£220.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('£500.00', '0', '£0.00', '£0.00', '£280.00');

    // Update refund reference with Rejection (called by Liberata) for System approved RefundWhenContacted email notification verification
    await apiUtils.updateRefundStatusByRefundReference(refundRef, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await apiUtils.updateRefundStatusByRefundReference(refundRef, 'Unable to apply refund to Card', 'REJECTED');

    await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRefundDetailsData = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, '£220.00', emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewData = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundRef, '220', 'Due to a technical error a payment was taken incorrectly and has now been refunded');

    await RefundsList.verifyRefundDetailsAfterLiberataRejection(reviewRefundDetailsData, true, refundNotificationPreviewData);

    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');
