/* eslint-disable no-alert, no-console */
const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');
const assert = require('assert');

// eslint-disable-next-line no-unused-vars

const apiUtils = require('../helpers/utils');
const assertionData = require('../fixture/data/refunds/assertion');
const stringUtil = require('../helpers/string_utils.js');

const {Logger} = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds_test.js');

const testConfig = require('./config/CCPBConfig');


Feature('CC Pay Bubble Refunds V2 OverPayment Test'); //.retry(CCPBATConstants.defaultNumberOfRetries);

// Bulk scan cash overpayment refund option, email notification preview at all 3 stages(before refund request, refund approve and after approve) and Resend Notification
Scenario.skip('Bulk scan cash Over Payment refund, preview RefundWhenContacted email notification and Resend Notification',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const bulkScanPaymentMethod = 'cash';
    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = 500;

    // Create Payment and back date for refund eligibility
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA07', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
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

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '£200.00', 'Over payment', '£300.00', emailAddress, '', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, 'RF-****-****-****-****', '300', 'Refund for Overpayment', bulkScanPaymentMethod);

    await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, refundNotificationPreviewDataBeforeRefundRequest);
    I.click('Submit refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('300.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    // I.click('Refund List'); // Refund List menu is hidden on paybubble, navigating to the refund-list page itself -- see above url
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '300', 'Refund for Overpayment', bulkScanPaymentMethod);

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
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber); // 1684932268676603
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterApproval = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '300', 'Refund for Overpayment', bulkScanPaymentMethod);

    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund(reviewRefundDetailsDataAfterApproval, true, true, false, refundNotificationPreviewDataAfterApproval);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');

// Bulk scan cash full payment refund option, letter notification preview at all 3 stages(before refund request, refund approve and after approve) and Resend Notification
Scenario.skip('Bulk scan cash Full Payment refund, preview RefundWhenContacted letter notification and Resend Notification',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const postcode = 'TW4 7EZ';
    const bulkScanPaymentMethod = 'cash';
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA07', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    // Submit refund
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="full-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.', '£200.00', '£500.00', '500', '1');
    await InitiateRefunds.verifyProcessRefundSelectionPageForFullPaymentOption(reviewProcessRefundPageData, ccdCaseNumber);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundReason = 'System/technical error';
    await InitiateRefunds.verifyProcessRefundPageFromTheRadioButtonReasons(ccdCaseNumber, refundReason);
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

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '', refundReason, '£500.00', '', postcode, 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, 'RF-****-****-****-****', '500', 'Due to a technical error a payment was taken incorrectly and has now been refunded', bulkScanPaymentMethod);

    await InitiateRefunds.verifyCheckYourAnswersPageForFullPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false, true, refundNotificationPreviewDataBeforeRefundRequest);
    I.click('Submit refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('500.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    // I.click('Refund List'); // Refund List menu is hidden on paybubble, navigating to the refund-list page itself -- see above url
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, refundReason, '£500.00', '', postcode, 'payments probate', 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundApproved = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, refundReference, '500', 'Due to a technical error a payment was taken incorrectly and has now been refunded', bulkScanPaymentMethod);

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
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, refundReason, '£500.00', '', postcode, 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterApproval = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, refundReference, '500', 'Due to a technical error a payment was taken incorrectly and has now been refunded', bulkScanPaymentMethod);

    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund(reviewRefundDetailsDataAfterApproval, true, true, false, refundNotificationPreviewDataAfterApproval);
    await I.Logout();

  }).tag('@pipeline @nightly');

Scenario.skip('PBA Partial Refund, preview SendRefund letter notification',
  async (I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails, RefundsList) => {

    const postcode = 'TW4 7EZ';
    const fees = {
      calculated_amount: 273,
      code: 'FEE0219',
      fee_amount: 273,
      version: '5',
      volume: 1
    };
    // Create Payment and back date for refund eligibility
    const paymentDetails = await apiUtils.createAPBAPayment('273', fees);
    const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
    const paymentRef = `${paymentDetails.paymentReference}`;
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the paymentReference - ' + paymentRef);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForPartialPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await PaymentHistory.validatePaymentDetailsForPartialPayment(paymentRef);
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    // Submit refund
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Application for a grant of probate (Estate over 5000 GBP)', '£273.00', '£273.00', '200', '1');
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
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.selectOption('//*[@id="postcodeAddress"]', '89, MARTINDALE ROAD, HOUNSLOW, TW4 7EZ');
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£273.00', '', refundDropDownReason + '-' + reasonText, '£200.00', '', postcode, 'SendRefund');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, 'RF-****-****-****-****', '200', 'Other');

    await InitiateRefunds.verifyCheckYourAnswersPageForCorrectlyPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, false, false, refundNotificationPreviewDataBeforeRefundRequest);
    I.click('Submit refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
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

    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund(reviewRefundDetailsDataAfterApproval, true, false, false, refundNotificationPreviewDataAfterApproval);
    await I.Logout();

  }).tag('@pipeline @nightly');

Scenario.skip('OverPayment for Refunds V2 Rejected Flow',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA07', totalAmount, 'cheque');
    const ccdCaseNumber = ccdAndDcn[1];
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="over-payment"]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '£200.00', 'Over payment', '£300.00', 'vamshi.rudrabhatla@hmcts.net', '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('300.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRef, 'Overpayment', '£300.00', 'vamshi.rudrabhatla@hmcts.net', '', 'payments probate', 'SendRefund');
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Reject');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterRejection = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, 'Overpayment', '£300.00', 'vamshi.rudrabhatla@hmcts.net', '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRejectionOfOverPayment(reviewRefundDetailsDataAfterRejection);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');


Scenario.skip('FullPayment for Refunds V2 Send To Caseworker',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA07', totalAmount, 'cash');
    const ccdCaseNumber = ccdAndDcn[1];
    const dcnNumber = ccdAndDcn[0];
    console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
    console.log('**** The value of the dcnNumber - ' + dcnNumber);
    logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
    logger.info(`The value of the dcnNumber : ${dcnNumber}`);
    // const paymentRef = await apiUtils.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
    // console.log('**** payment ref - ' + paymentRef);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
    }
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="full-payment"]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await RefundsList.verifyProcessRefund();
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
    I.click('Continue');
    await InitiateRefunds.verifyCheckYourAnswersPageForFullRefunds();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('500.00');
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.click('Refund List');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage();
    InitiateRefunds.approverActionForRequestedRefund('Return to caseworker');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await RefundsList.verifyRefundDetailsAfterReturnToCaseWorkerOfFullPayment(refundRef);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.Logout();
  }).tag('@pipeline @nightly');


Scenario.skip('OverPayment for Refunds V2 and Remission Refund Journey',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft@mailtest.gov.uk';
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA07', totalAmount, bulkScanPaymentMethod);
    const ccdCaseNumber = ccdAndDcn[1];

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateTransactionPageForOverPayments();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await AddFees.addFeesOverPayment('200');
    I.wait(CCPBATConstants.tenSecondWaitTime);

    //  Over Payment refund - 300
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const paymentRcReference = await I.grabTextFrom(CaseTransaction.locators.rc_reference);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
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
    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '£200.00', 'Over payment', '£300.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRefOverPayments = await InitiateRefunds.verifyRefundSubmittedPage('300.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);

    //  remission refund - 100
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '100.00', '£500.00', '£200.00', 'FEE0373', 'FEE0373 - Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.',
      emailAddress, '', 'SendRefund');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPage('100.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);

    // Refund with reason - 100
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Issue refund', 5);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Notice of hearing date for 1.1 or 1.2 application. Only one payable if applications joined up.', '£200.00', '£200.00', '100', '1');
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
    const checkYourAnswersDataBeforeSubmitRefund2 = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '', refundReason, '£100.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageForCorrectlyPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund2, false, false, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refunds = await InitiateRefunds.verifyRefundSubmittedPage('100.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve all 3 refunds from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;
    for (let i = 0; i <= 2; i++) {
      I.wait(CCPBATConstants.fifteenSecondWaitTime);
      if (i == 0) {
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefOverPayments, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'SendRefund');
      }
      if (i == 1) {
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'SendRefund');
      }
      if (i == 2) {
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refunds, refundReason, '£100.00', emailAddress, '', 'payments probate', 'SendRefund');
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
    await CaseTransaction.validateTransactionPageForOverPaymentsRemissionsRefunds(refunds, refundRefRemissions, refundRefOverPayments);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewOverPaymentRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefOverPayments, paymentRcReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund(reviewOverPaymentRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr[2]/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund(reviewRemissionRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('//*[@id="content"]/div/app-payment-history/ccpay-payment-lib/ccpay-case-transactions/div/main/div/div[4]/ccpay-refund-status/table/tbody/tr[3]/td[6]/a');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refunds, paymentRcReference, refundReason, '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterApprovalOfRefund(reviewRefundDetailsDataAfterApproval);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipelines @nightly');

// Scenario.skip('Refunds V2 Notifications Template(sendRefundWhenContacted Email)',
//   async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
//          PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
//     const totalAmount = 500;
//     const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA07', totalAmount, 'cash');
//     const ccdCaseNumber = ccdAndDcn[1];
//     const dcnNumber = ccdAndDcn[0];
//     console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
//     console.log('**** The value of the dcnNumber - ' + dcnNumber);
//     logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
//     logger.info(`The value of the dcnNumber : ${dcnNumber}`);
//     // const paymentRef = await apiUtils.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
//     // console.log('**** payment ref - ' + paymentRef);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await CaseTransaction.validateTransactionPageForOverPayments();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await AddFees.addFeesOverPayment('200');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[2]');
//     I.wait(CCPBATConstants.fifteenSecondWaitTime);
//     if (I.dontSeeElement('Issue refund')) {
//       console.log('found disabled button');
//       await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
//       I.click('Back');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//       await I.click('(//*[text()[contains(.,"Review")]])[2]');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//     }
//     I.click('Issue refund');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('//*[@id="over-payment"]');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('Continue');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('//*[@id="email"]');
//     I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
//     I.click('Continue');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefundNotificationPreview();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('300.00');
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     I.click('Refund List');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await InitiateRefunds.verifyRefundsListPage(refundRef);
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     InitiateRefunds.verifyReviewRefundsDetailsPageForNotificationsendRefundWhenContacted();
//     InitiateRefunds.verifyApproverReviewRefundsDetailsPage();
//     InitiateRefunds.approverActionForRequestedRefund('Approve');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[3]');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await RefundsList.verifyRefundDetailsAfterApprovalOfRefundSendRefundWhenContacted();
//     I.Logout();
//   }).tag('@pipeline @nightly');
//

// Scenario.skip('Refunds V2 Notifications Template(sendRefundWhenContacted Letter)',
//   async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
//          PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {
//     const totalAmount = 500;
//     const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA07', totalAmount, 'cash');
//     const ccdCaseNumber = ccdAndDcn[1];
//     const dcnNumber = ccdAndDcn[0];
//     console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
//     console.log('**** The value of the dcnNumber - ' + dcnNumber);
//     logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
//     logger.info(`The value of the dcnNumber : ${dcnNumber}`);
//     // const paymentRef = await apiUtils.getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber);
//     // console.log('**** payment ref - ' + paymentRef);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await CaseTransaction.validateTransactionPageForOverPayments();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await AddFees.addFeesOverPayment('200');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[2]');
//     I.wait(CCPBATConstants.fifteenSecondWaitTime);
//     if (I.dontSeeElement('Issue refund')) {
//       console.log('found disabled button');
//       await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
//       I.click('Back');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//       await I.click('(//*[text()[contains(.,"Review")]])[2]');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//     }
//     I.click('Issue refund');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('//*[@id="over-payment"]');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('Continue');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('//*[@id="contact-2"]');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.click('//*[@id="address-postcode"]');
//     I.fillField('//*[@id="address-postcode"]', 'TW4 7EZ');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.click('Find address');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.selectOption('//*[@id="postcodeAddress"]', '89, MARTINDALE ROAD, HOUNSLOW, TW4 7EZ');
//     I.click('Continue');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await InitiateRefunds.verifyCheckYourAnswersPageForOverPaymentRefundNotificationPreviewLetter();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('300.00');
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     I.click('Refund List');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await InitiateRefunds.verifyRefundsListPage(refundRef);
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     InitiateRefunds.verifyReviewRefundsDetailsPageForNotificationsendRefundWhenContactedLetter();
//     InitiateRefunds.verifyApproverReviewRefundsDetailsPage();
//     InitiateRefunds.approverActionForRequestedRefund('Approve');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[3]');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await RefundsList.verifyRefundDetailsAfterApprovalOfRefundSendRefundWhenContactedLetter();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.Logout();
//   }).tag('@pipeline @nightly');
//
//
// Scenario.skip('Partial Payments Refunds V2 Send Refund Email',
//   async (I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails, RefundsList) => {
//     const fees = {
//       calculated_amount: 273,
//       code: 'FEE0219',
//       fee_amount: 273,
//       version: '5',
//       volume: 1
//     };
//     const paymentDetails = await apiUtils.createAPBAPayment('273', fees);
//     const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
//     const paymentRef = `${paymentDetails.paymentReference}`;
//     console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
//     console.log('**** The value of the paymentReference - ' + paymentRef);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await CaseTransaction.validateTransactionPageForPartialPayments();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[2]');
//     I.wait(CCPBATConstants.fifteenSecondWaitTime);
//     if (I.dontSeeElement('Issue refund')) {
//       console.log('found disabled button');
//       await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
//       I.click('Back');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//       await I.click('(//*[text()[contains(.,"Review")]])[2]');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//       await PaymentHistory.validatePaymentDetailsForPartialPayment(paymentRef);
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//     }
//     I.click('Issue refund');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await RefundsList.verifyIssueRefundPageForPartialPayments('200');
//     I.click('Continue');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await RefundsList.verifyProcessRefund();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('//*[@id="email"]');
//     I.fillField('//*[@id="email"]', 'vamshi.rudrabhatla@hmcts.net');
//     I.click('Continue');
//     await InitiateRefunds.verifyCheckYourAnswersPageForPartialPaymentsSendRefundNotification();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     I.click('Refund List');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await InitiateRefunds.verifyRefundsListPage(refundRef);
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     InitiateRefunds.verifyReviewRefundsDetailsPageForNotificationsendRefund();
//     InitiateRefunds.verifyApproverReviewRefundsDetailsPage();
//     InitiateRefunds.approverActionForRequestedRefund('Approve');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[3]');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await RefundsList.verifyRefundDetailsAfterApprovalOfRefundSendRefund();
//     I.Logout();
//   }).tag('@pipeline @nightly');
//
//
// Scenario.skip('Partial Payments Refunds V2 Send Refund Letter',
//   async (I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails, RefundsList) => {
//     const fees = {
//       calculated_amount: 273,
//       code: 'FEE0219',
//       fee_amount: 273,
//       version: '5',
//       volume: 1
//     };
//     const paymentDetails = await apiUtils.createAPBAPayment('273', fees);
//     const ccdCaseNumber = `${paymentDetails.ccdCaseNumber}`;
//     const paymentRef = `${paymentDetails.paymentReference}`;
//     console.log('**** The value of the ccdCaseNumber - ' + ccdCaseNumber);
//     console.log('**** The value of the paymentReference - ' + paymentRef);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await CaseTransaction.validateTransactionPageForPartialPayments();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[2]');
//     I.wait(CCPBATConstants.fifteenSecondWaitTime);
//     if (I.dontSeeElement('Issue refund')) {
//       console.log('found disabled button');
//       await apiUtils.rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(ccdCaseNumber);
//       I.click('Back');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//       await I.click('(//*[text()[contains(.,"Review")]])[2]');
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//       await PaymentHistory.validatePaymentDetailsForPartialPayment(paymentRef);
//       I.wait(CCPBATConstants.fiveSecondWaitTime);
//     }
//     I.click('Issue refund');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await RefundsList.verifyIssueRefundPageForPartialPayments('200');
//     I.click('Continue');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await RefundsList.verifyProcessRefund();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.click('//*[@id="contact-2"]');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.click('//*[@id="address-postcode"]');
//     I.fillField('//*[@id="address-postcode"]', 'TW4 7EZ');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.click('Find address');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.selectOption('//*[@id="postcodeAddress"]', '89, MARTINDALE ROAD, HOUNSLOW, TW4 7EZ');
//     I.click('Continue');
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await InitiateRefunds.verifyCheckYourAnswersPageSendRefundNotificationPreviewLetter();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('200.00');
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     I.click('Refund List');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await InitiateRefunds.verifyRefundsListPage(refundRef);
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     InitiateRefunds.verifyReviewRefundsDetailsPageForNotificationsendRefundLetter();
//     InitiateRefunds.verifyApproverReviewRefundsDetailsPage();
//     InitiateRefunds.approverActionForRequestedRefund('Approve');
//     I.wait(CCPBATConstants.twoSecondWaitTime);
//     I.Logout();
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
//     I.wait(CCPBATConstants.fiveSecondWaitTime);
//     await I.click('(//*[text()[contains(.,"Review")]])[3]');
//     I.wait(CCPBATConstants.tenSecondWaitTime);
//     await RefundsList.verifyRefundDetailsAfterApprovalOfRefundSendRefundLetter();
//     I.Logout();
//   }).tag('@pipeline @nightly');



