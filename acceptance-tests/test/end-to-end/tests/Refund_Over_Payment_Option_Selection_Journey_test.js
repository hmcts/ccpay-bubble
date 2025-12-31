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
    const totalAmount = 327;

    // Create Payment and back date for refund eligibility
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('300');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('327.00', '0', '0.00', '0.00', '27.00');
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

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£327.00', '£300.00', 'Over payment', '£27.00', emailAddress, '', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, 'RF-****-****-****-****', '27', 'Refund for Overpayment', bulkScanPaymentMethod);

    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, refundNotificationPreviewDataBeforeRefundRequest);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('27.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('327.00', '0', '0.00', '0.00', '27.00');
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

    // Review refund from case transaction page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('327.00', '0', '0.00', '0.00', '27.00');
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, 'Overpayment', '27.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundReference, '', 'ACCEPTED');

    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('327.00', '0', '0.00', '0.00', '0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    const reviewRefundDetailsDataAfterRefundAccepted = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, 'Overpayment', '27.00', emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterRefundAccepted = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '27', 'Refund for Overpayment', bulkScanPaymentMethod);
    await RefundsList.verifyRefundDetailsAfterRefundAcceptedByLiberata(reviewRefundDetailsDataAfterRefundAccepted, true, true, false, refundNotificationPreviewDataAfterRefundAccepted);

    // Verify the email from notify
    const emailResponse = await apiUtils.getEmailFromNotifyWithMaxRetries(emailAddress);
    assert.strictEqual('HMCTS refund request approved', emailResponse.subject);

    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click(`//td[contains(.,'${refundReference}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyNotificationDetailsAfterResend(refundNotificationPreviewDataAfterRefundAccepted);

    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');

Scenario('Refund journey for complete cheque amount(500) with OverPayment option(273) and Refund(227)',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = '500.00';
    const feeAmount = '227.00';
    const overPaymentAmount = '273.00';
    const overPaymentRefundAmount = '273.00';
    const feePaymentRefundAmount = '227.00';
    const overPaymentAfterFeePaymentRefundAcceptedByLiberata = '46.00'; // 273-227=46
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment(feeAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', overPaymentAmount);

    //  Over Payment refund - 273
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

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, `£${totalAmount}`, `£${feeAmount}`, 'Over payment', `£${overPaymentRefundAmount}`, emailAddress, '', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, 'RF-****-****-****-****', `${overPaymentRefundAmount}`, 'Refund for Overpayment', bulkScanPaymentMethod);
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, refundNotificationPreviewDataBeforeRefundRequest);
    const refundRefOverPayments = await InitiateRefunds.verifyRefundSubmittedPage(overPaymentRefundAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', overPaymentAmount);

    //Fee Payment Refund - 227
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Issue refund', 5);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.', `£${feeAmount}`, `£${feeAmount}`, '227', '1', '£0.00');
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
    const checkYourAnswersDataBeforeSubmitRefund2 = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, `£${totalAmount}`, '', refundReason, `£${feePaymentRefundAmount}`, emailAddress, '', 'RefundWhenContacted');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund2, false, false, false, false);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage(feePaymentRefundAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', overPaymentAmount);
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve both refunds from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;
    let refundNotificationPreviewDataBeforeRefundApproved;
    for (let i = 0; i <= 1; i++) {
      I.wait(CCPBATConstants.fifteenSecondWaitTime);
      if (i === 0) {
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefOverPayments, 'Overpayment', `£${overPaymentRefundAmount}`, emailAddress, '', 'payments probate', 'RefundWhenContacted');
        refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundRefOverPayments, `${overPaymentRefundAmount}`, 'Refund for Overpayment', bulkScanPaymentMethod);
      }
      if (i === 1) {
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRef, refundReason, `£${feePaymentRefundAmount}`, emailAddress, '', 'payments probate', 'RefundWhenContacted');
        refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundRef, `${feePaymentRefundAmount}`, 'Due to a technical error a payment was taken incorrectly and has now been refunded', bulkScanPaymentMethod);
      }
      await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
      I.wait(CCPBATConstants.twoSecondWaitTime);
      InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction, true, refundNotificationPreviewDataBeforeRefundApproved);
      InitiateRefunds.approverActionForRequestedRefund('Approve');
      I.wait(CCPBATConstants.twoSecondWaitTime);
      I.amOnPage('/refund-list?takePayment=false&refundlist=true');
    }

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Review approved refunds from Case transactions page
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', overPaymentAmount);
    await CaseTransaction.validateTransactionPageForRefunds(refundRef, refundRefOverPayments, `£${feePaymentRefundAmount}`, `£${overPaymentRefundAmount}`);
    await I.click(`//td[contains(.,'${refundRefOverPayments}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewOverPaymentRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefOverPayments, paymentRcReference, 'Overpayment', `£${overPaymentRefundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewOverPaymentRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, `£${feePaymentRefundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval);

    // Liberata Accepted the Refund
    await apiUtils.updateRefundStatusByRefundReference(refundRef, '', 'ACCEPTED');

    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', overPaymentAfterFeePaymentRefundAcceptedByLiberata);  // 46.00

    await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    const reviewRefundDetailsDataAfterRefundAccepted = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, `£${feePaymentRefundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterRefundAccepted = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundRef, `${feePaymentRefundAmount}`, 'Due to a technical error a payment was taken incorrectly and has now been refunded', bulkScanPaymentMethod);
    await RefundsList.verifyRefundDetailsAfterRefundAcceptedByLiberata(reviewRefundDetailsDataAfterRefundAccepted, true, false, false, refundNotificationPreviewDataAfterRefundAccepted);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');
