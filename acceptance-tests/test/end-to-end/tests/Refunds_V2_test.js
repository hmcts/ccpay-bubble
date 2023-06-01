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


Feature('CC Pay Bubble Refunds V2 Tests').retry(CCPBATConstants.defaultNumberOfRetries);

// Bulk scan cash overpayment refund option, email notification preview at all 3 stages(before refund request, refund approve and after approve) and Resend Notification
Scenario('Bulk scan cash Over Payment refund, preview RefundWhenContacted email notification and Resend Notification journey',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const bulkScanPaymentMethod = 'cash';
    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = 500;

    // Create Payment and back date for refund eligibility
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
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

    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, refundNotificationPreviewDataBeforeRefundRequest);
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
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterApproval = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundReference, '300', 'Refund for Overpayment', bulkScanPaymentMethod);

    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval, true, true, false, refundNotificationPreviewDataAfterApproval);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');

// Bulk scan cash full payment refund option, letter notification preview at all 3 stages(before refund request, refund approve and after approve) and Resend Notification
Scenario('Bulk scan cash Full Payment refund, preview RefundWhenContacted letter notification and Resend Notification journey',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const postcode = 'TW4 7EZ';
    const bulkScanPaymentMethod = 'cash';
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
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

    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForFullPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false, true, refundNotificationPreviewDataBeforeRefundRequest);
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

    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval, true, true, false, refundNotificationPreviewDataAfterApproval);
    await I.Logout();

  }).tag('@pipeline @nightly');

Scenario('PBA Partial Refund, preview SendRefund letter notification journey and resend notification to email from letter edit',
  async (I, CaseSearch, CaseTransaction, InitiateRefunds, PaymentHistory, FailureEventDetails, RefundsList) => {

    const postcode = 'TW4 7EZ';
    // Create Payment and back date for refund eligibility
    const paymentDetails = await apiUtils.createAPBAPayment('273', 'FEE0219', '5', 1);
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

Scenario('Refund journey for complete cheque amount(500) with OverPayment option(300), Remission(100) and Refund(100) and Liberata rejected System approved RefundWhenContacted notification',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft@mailtest.gov.uk';
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
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
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false);
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
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund2, false, false, false, false);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('100.00');
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
        refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRef, refundReason, '£100.00', emailAddress, '', 'payments probate', 'SendRefund');
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
    await CaseTransaction.validateTransactionPageForOverPaymentsRemissionsRefunds(refundRef, refundRefRemissions, refundRefOverPayments);
    await I.click(`//td[contains(.,'${refundRefOverPayments}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewOverPaymentRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefOverPayments, paymentRcReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewOverPaymentRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRefundDetailsDataAfterApproval);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Update refund reference with Rejection (called by Liberata) for System approved RefundWhenContacted email notification verification
    // TODO: uncomment below lines after the refunds v2.1 release.
    // await apiUtils.updateRefundStatusByRefundReference(refundRef, '', 'ACCEPTED');
    // I.wait(CCPBATConstants.fiveSecondWaitTime);
    await apiUtils.updateRefundStatusByRefundReference(refundRef, 'Unable to apply refund to Card', 'REJECTED');

    await I.click(`//td[contains(.,'${refundRef}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRefundDetailsData = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, refundReason, '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewData = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundRef, '100', 'Due to a technical error a payment was taken incorrectly and has now been refunded');

    await RefundsList.verifyRefundDetailsAfterLiberataRejection(reviewRefundDetailsData, true, refundNotificationPreviewData);

    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');

Scenario('FullPayment Refund Send To Caseworker journey',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, 'cheque');
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
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '', refundReason, '£500.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForFullPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund);
    const refundReference = await InitiateRefunds.verifyRefundSubmittedPage('500.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve refund
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundReference);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    const refundReturnText='Test Reason Only';
    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundReference, refundReason, '£500.00', emailAddress, '', 'payments probate', 'SendRefund');
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Return to caseworker', refundReturnText);
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
    const reviewRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundReference, paymentRcReference, refundReason, '£500.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundReturnToCaseWorker(reviewRefundDetailsDataAfterApproval, refundReturnText);

    await I.Logout();
  }).tag('@pipeline @nightly');

Scenario('OverPayment Refund Rejected journey',
  async (I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
         PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList) => {

    const emailAddress = stringUtil.getTodayDateAndTimeInString() + 'refundspaybubbleft1@mailtest.gov.uk';
    const totalAmount = 500;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, 'cheque');
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
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£500.00', '£200.00', 'Over payment', '£300.00', emailAddress, '', 'SendRefund');
    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForOverPaymentRefundOption(checkYourAnswersDataBeforeSubmitRefund, false, '', false, false);
    const refundRef = await InitiateRefunds.verifyRefundSubmittedPage('300.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    await InitiateRefunds.verifyRefundsListPage(refundRef);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRef, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'SendRefund');
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
    const reviewRefundDetailsDataAfterRejection = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRef, paymentRcReference, 'Overpayment', '£300.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundRejected(reviewRefundDetailsDataAfterRejection);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');



