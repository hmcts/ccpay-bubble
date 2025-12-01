/* eslint-disable */
const stringUtil = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");
const stringUtils = require("../helpers/string_utils");

Feature('CC Pay Bubble Refund Retro Remission journey tests').retry(CCPBATConstants.defaultNumberOfRetries);

Scenario('Fully Paid Fee with Retro Remission CAN have Full Remission Refunded and calculates the Amount to be refunded',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = '300.00';
    const feeAmount = '300.00';
    const remissionAmount= '100.00';
    const hwfReference= 'HWF-A1B-23C';
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount(feeAmount, 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', feeAmount, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationFullPayment('FEE0219', '1', totalAmount, feeAmount);
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');
    //  remission refund - 100
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
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, hwfReference, '£100.00', `£${totalAmount}`, `£${feeAmount}`, 'FEE0219', 'FEE0219 - Application for a grant of probate (Estate over 5000 GBP)',
      emailAddress, '', 'RefundWhenContacted', `£${remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true, 100.00);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPage('100.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '100.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;

    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'RefundWhenContacted');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '100.00');
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£100.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // PAY-7150 - process refund page to display Remission Amount in Fees refund details table and populate the calculated refund value
    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    I.click('Issue refund');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewProcessRefundPageData = assertionData.reviewProcessRefundPageDataForFeeRefundSelection(paymentRcReference, 'Application for a grant of probate (Estate over 5000 GBP)', '£300.00', '£300.00', '200', '1', '£100.00');
    await InitiateRefunds.verifyProcessRefundPageForFeeRefundSelectionWithRemissionAmount(reviewProcessRefundPageData, ccdCaseNumber);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const refundDropDownReason = 'Other - CoP';
    const reasonText = 'Auto test';
    await InitiateRefunds.verifyProcessRefundPageFromTheDropDownReasonsAndContinue(ccdCaseNumber, refundDropDownReason, reasonText);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="contact-2"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//*[@id="address-postcode"]');
    const postcode = 'TW4 7EZ';
    I.fillField('//*[@id="address-postcode"]', postcode);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Find address');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.selectOption('//*[@id="postcodeAddress"]', '89, MARTINDALE ROAD, HOUNSLOW, TW4 7EZ');
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    const checkYourAnswersDataBeforeSubmitRefund = assertionData.checkYourAnswersBeforeSubmitRefund(paymentRcReference, '£300.00', '', refundDropDownReason + '-' + reasonText, '£200.00', '', postcode, 'RefundWhenContacted');
    const refundNotificationPreviewDataBeforeRefundRequest = assertionData.refundNotificationPreviewData('', postcode, ccdCaseNumber, 'RF-****-****-****-****', '200', 'Other', bulkScanPaymentMethod);

    await InitiateRefunds.verifyCheckYourAnswersPageAndSubmitRefundForExactAmountPaidNonCashPartialOrFullRefunds(checkYourAnswersDataBeforeSubmitRefund, false, '', false, true, false, false, refundNotificationPreviewDataBeforeRefundRequest);
    await InitiateRefunds.verifyRefundSubmittedPage('200.00');

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');

Scenario('Partially Paid Fee with Retro Remission resulting in a ZERO Balance Due CAN NOT be Refunded',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = '200.00';
    const feeAmount = '300.00';
    const remissionAmount= '100.00';
    const hwfReference= 'HWF-A1B-23C';
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount(feeAmount, 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', feeAmount, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0219', '1',
      totalAmount, feeAmount, feeAmount, '100.00');
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '100.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '100.00', '0.00');
    //  remission refund - 100
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
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, hwfReference, '', `£${totalAmount}`, `£${feeAmount}`, 'FEE0219', 'FEE0219 - Application for a grant of probate (Estate over 5000 GBP)',
      emailAddress, '', 'RefundWhenContacted', `£${remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(false, 100.00);

    I.click('Return to case');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Payment details', 5);
    // verify that Add refund button is disabled for the remission
    I.dontSeeElement('Add refund')

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');

Scenario('Partially Paid Fee with Retro Remission resulting in a NEGATIVE Balance Due CAN NOT be Refunded',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = '150.00';
    const feeAmount = '300.00';
    const remissionAmount= '100.00';
    const hwfReference= 'HWF-A1B-23C';
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount(feeAmount, 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', feeAmount, true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0219', '1',
      totalAmount, feeAmount, feeAmount, '150.00');
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '150.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '150.00', '0.00');
    //  remission refund - 100
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
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, hwfReference, '', `£${totalAmount}`, `£${feeAmount}`, 'FEE0219', 'FEE0219 - Application for a grant of probate (Estate over 5000 GBP)',
      emailAddress, '', 'RefundWhenContacted', `£${remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(false, 100.00);

    I.click('Return to case');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForElement('(//*[text()[contains(.,"Review")]])[2]', 5);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '50.00', '0.00');
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    I.waitForText('Payment details', 5);
    // verify that Add refund button is disabled for the remission
    I.dontSeeElement('Add refund')

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');

Scenario('Partially Paid Fee with Retro Remission resulting in a POSITIVE Balance Due CAN have the Remission Refunded - (positive balance value)',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = 200;
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, '200.00', 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount('237.00', 'civil', 'civil');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0475', '237.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0475', '1',
      '200.00', '237.00', '237.00', '37.00');
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', '37.00');
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    //  remission refund - 100
    await CaseTransaction.validateCaseTransactionsDetails('200.00', '0', '0.00', '37.00', '0.00');
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
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, '100.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', '£63.00', '£200.00', '£237.00', 'FEE0475', 'FEE0475 - Where the party filing the request is legally aided',
      emailAddress, '', 'RefundWhenContacted', '£100.00');
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true, 100.00);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPage('63.00');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('200.00', '0', '100.00', '0.00', '63.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;

    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions, 'Retrospective remission', '£63.00', emailAddress, '', 'payments probate', 'RefundWhenContacted');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('200.00', '0', '100.00', '0.00', '63.00');
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', '£63.00', emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails('200.00', '0', '100.00', '0.00', '0.00');

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');

Scenario('Partially Paid (multi-fees) with Retro Remission resulting in a POSITIVE Balance Due CAN have relevant Remission Refunded - (positive balance value)',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const bulkScanPaymentMethod = 'cheque';
    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;
    const totalAmount = '332.00';
    const feeAmount1 = '300.00';
    const feeAmount2 = '57.00';
    const shortfallAmount = '25.00'; // 25 = (300+57) - 332
    const remissionAmount= '50.00'; // remission amount against the second fee
    const refundAmount= '25.00'; // refund amount against the remission (50 - 25)
    const ccdAndDcn = await apiUtils.bulkScanNormalCcd('AA08', totalAmount, bulkScanPaymentMethod);
    const dcnNumber = ccdAndDcn[0];
    const ccdCaseNumber = ccdAndDcn[1];
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
    CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
    CaseTransaction.allocateToNewFee();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await AddFees.addFeesAmount(feeAmount1, 'family', 'probate_registry');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0219', feeAmount1, false);
    I.wait(CCPBATConstants.twoSecondWaitTime);

    FeesSummary.addFeeFromSummary();
    await AddFees.addFees(feeAmount2, 'family', 'family_court');
    FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, 'FEE0258', feeAmount2, true);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0219', '1', totalAmount, feeAmount1, feeAmount1, shortfallAmount);
    ConfirmAssociation.verifyConfirmAssociationShortfallPayment('FEE0258', '1', totalAmount, feeAmount2, feeAmount2, shortfallAmount);
    ConfirmAssociation.selectShortfallReasonExplainatoryAndUser('Help with Fees', 'Contact applicant');
    ConfirmAssociation.confirmPayment();

    I.wait(CCPBATConstants.fiveSecondWaitTime);
    CaseTransaction.checkBulkCaseShortfallSuccessPaymentPartiallyPaid(ccdCaseNumberFormatted, 'Case reference', 'Partially paid', shortfallAmount);
    CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
    //  remission refund - 50 -> 25
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', shortfallAmount, '0.00');
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
    I.waitForText('Add remission', 5);
    // adding a retro remission amount of [£50] against the second fee FEE0258 [£57]
    I.click('//table/tbody/tr[2]/td[contains(text(),\'FEE0258\')]//ancestor::table//parent::div/button');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, 'HWF-A1B-23C');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRcReference, 'HWF-A1B-23C', `£${refundAmount}`, totalAmount, `£${feeAmount2}`, 'FEE0258', 'FEE0258 - Application for a maintenance order to be registered 1950 Act or 1958 Act',
      emailAddress, '', 'RefundWhenContacted', `£${remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true, remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions = await InitiateRefunds.verifyRefundSubmittedPage(refundAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '25.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;

    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions, 'Retrospective remission', `£${refundAmount}`, emailAddress, '', 'payments probate', 'RefundWhenContacted');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '25.00');
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const reviewRemissionRefundDetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', `£${refundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefundDetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions, '', 'ACCEPTED');
    // Liberata updated the refund with Expired status after 21 days
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions, 'Unable to process expired refund', 'EXPIRED');
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '25.00');

    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    const reviewRefundDetailsDataAfterRefundAccepted = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', `£${refundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterRefundAccepted = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, refundRefRemissions, refundAmount, 'Retrospective remission', bulkScanPaymentMethod);
    await RefundsList.verifyRefundDetailsAfterLiberataExpiredTheRefund(reviewRefundDetailsDataAfterRefundAccepted, true, refundNotificationPreviewDataAfterRefundAccepted);

    // Reset the refund to Reissue the new refund
    I.see('Reset Refund');
    I.click('Reset Refund');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.see(`Close current refund reference number ${refundRefRemissions}`);
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
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '25.00');

    // Verify the Closed refund
    await I.click(`//td[contains(.,'${refundRefRemissions}')]/following-sibling::td/a[.=\'Review\'][1]`);
    await RefundsList.verifyRefundDetailsAfterCaseworkerClosedTheRefund(reviewRefundDetailsDataAfterRefundAccepted, true, refundNotificationPreviewDataAfterRefundAccepted);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Verify the Reissued refund
    await I.click(`//td[contains(.,'${newRefundReference}')]/following-sibling::td/a[.=\'Review\'][1]`);
    // Reissue refund details will have same data as previous refund except the reference number and reissued user
    reviewRefundDetailsDataAfterRefundAccepted.refundRequester = 'approver probate';
    await RefundsList.verifyRefundDetailsAfterCaseworkerReissuedTheRefund(reviewRefundDetailsDataAfterRefundAccepted, newRefundReference);

    // Liberata Accepted the Reissued Refund
    await apiUtils.updateRefundStatusByRefundReference(newRefundReference, '', 'ACCEPTED');
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount, '0.00', '0.00');
    await I.click(`//td[contains(.,'${newRefundReference}')]/following-sibling::td/a[.=\'Review\'][1]`);
    const reviewRefundDetailsDataAfterRefundReissuedAndAccepted = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions, paymentRcReference, 'Retrospective remission', `£${refundAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    const refundNotificationPreviewDataAfterRefundReissuedAndAccepted = assertionData.refundNotificationPreviewData(emailAddress, '', ccdCaseNumber, newRefundReference, refundAmount, 'Retrospective remission', bulkScanPaymentMethod);
    await RefundsList.verifyRefundDetailsAfterCaseworkerReissuedTheRefundAndLiberataAccepted(reviewRefundDetailsDataAfterRefundReissuedAndAccepted, true, refundNotificationPreviewDataAfterRefundReissuedAndAccepted);

    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  }).tag('@pipeline @nightly');
