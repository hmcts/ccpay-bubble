/* eslint-disable */
const stringUtil = require("../helpers/string_utils");
const apiUtils = require("../helpers/utils");
const testConfig = require("./config/CCPBConfig");
const CCPBATConstants = require("./CCPBAcceptanceTestConstants");
const miscUtils = require("../helpers/misc");
const assertionData = require("../fixture/data/refunds/assertion");
const stringUtils = require("../helpers/string_utils");

Feature('CC Pay Bubble Refund Multiple Retro Remissions journey tests').retry(CCPBATConstants.defaultNumberOfRetries);

// PAY-7868
Scenario('Partial Remission Refunds Against Fully Paid Amounts for Multiple Service Requests with a Single Fee Each',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList }) => {

    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;

    const totalAmount = '1,324.15';
    const totalRemissionAmount = '704.15';
    const serviceRequest1feeAmount = '779.15';
    const serviceRequest1remissionAmount= '259.15';
    const serviceRequest1hwfReference= 'HWF-A1B-23C';

    const serviceRequest2feeAmount = '545.00';
    const serviceRequest2remissionAmount= '445.00';
    const serviceRequest2hwfReference= 'PA21-123456';

    const paymentDetails1 = await apiUtils.createAPBAPayment(serviceRequest1feeAmount, 'FEE0209', '3', 1);
    const ccdCaseNumber = `${paymentDetails1.ccdCaseNumber}`;
    const paymentRCRef1 = `${paymentDetails1.paymentReference}`;

    await I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(serviceRequest1feeAmount, '0', '0.00', '0.00', '0.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    I.click('Case Transaction');
    const paymentDetails2 = await apiUtils.createAPBAPaymentForExistingCase(serviceRequest2feeAmount, 'FEE0441', '2', 1, ccdCaseNumber);
    const paymentRCRef2 = `${paymentDetails2.payments[1].payment_reference}`;
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');

    // 1st service request Remission refund - 779.15 - 259.15
    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.wait(CCPBATConstants.fifteenSecondWaitTime);
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      I.wait(CCPBATConstants.fiveSecondWaitTime);
      await I.click('(//*[text()[contains(.,"Review")]])[3]');
      I.wait(CCPBATConstants.tenSecondWaitTime);
    }
    I.waitForText('Add remission', 5);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, serviceRequest1hwfReference);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, serviceRequest1remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData = assertionData.checkYourAnswers(paymentRCRef1, serviceRequest1hwfReference, `£${serviceRequest1remissionAmount}`, `£${serviceRequest1feeAmount}`, `£${serviceRequest1feeAmount}`, 'FEE0209', 'FEE0209 - Money Claims - Claim Amount - 10000.01 up to 200000 GBP. FEE AMOUNT = 5% of claim value',
      emailAddress, '', 'SendRefund', `£${serviceRequest1remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true, serviceRequest1remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions1 = await InitiateRefunds.verifyRefundSubmittedPage(serviceRequest1remissionAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', serviceRequest1remissionAmount);
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    await I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction;

    refundsDataBeforeApproverAction = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions1, 'Retrospective remission', serviceRequest1remissionAmount, emailAddress, '', 'payments probate', 'SendRefund');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', serviceRequest1remissionAmount);
    await I.click(`//td[contains(.,'${refundRefRemissions1}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefund1DetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions1, paymentRCRef1, 'Retrospective remission', `£${serviceRequest1remissionAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefund1DetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions1, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // 2nd service request Remission refund - 545.00 - 445.00
    await I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', serviceRequest1remissionAmount, '0.00', '0.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    await I.click('(//*[text()[contains(.,"Review")]])[3]');
    I.waitForText('Add remission', CCPBATConstants.twentySecondWaitTime);
    InitiateRefunds.verifyPaymentDetailsPage('Add remission');
    I.wait(CCPBATConstants.tenSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, serviceRequest2hwfReference);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, serviceRequest2remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkYourAnswersData2 = assertionData.checkYourAnswers(paymentRCRef2, serviceRequest2hwfReference, `£${serviceRequest2remissionAmount}`, `£${serviceRequest2feeAmount}`, `£${serviceRequest2feeAmount}`, 'FEE0441', 'FEE0441 - Hearing fee: Fast track case',
      emailAddress, '', 'SendRefund', `£${serviceRequest2remissionAmount}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData2, false, false);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyRemissionSubmittedPage(true, serviceRequest2remissionAmount);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData2, false, false);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const refundRefRemissions2 = await InitiateRefunds.verifyRefundSubmittedPage(serviceRequest2remissionAmount);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', totalRemissionAmount, '0.00', serviceRequest2remissionAmount);
    await I.Logout();
    I.clearCookie();
    I.wait(CCPBATConstants.fiveSecondWaitTime);

    // Approve the remission refund from Refund list page
    await I.login(testConfig.TestRefundsApproverUserName, testConfig.TestRefundsApproverPassword, '/refund-list?takePayment=false&refundlist=true');
    let refundsDataBeforeApproverAction2;

    refundsDataBeforeApproverAction2 = assertionData.reviewRefundDetailsDataBeforeApproverAction(refundRefRemissions2, 'Retrospective remission', `£${serviceRequest2remissionAmount}`, emailAddress, '', 'payments probate', 'SendRefund');
    await InitiateRefunds.verifyRefundsListPage(refundsDataBeforeApproverAction2.refundReference);
    InitiateRefunds.verifyApproverReviewRefundsDetailsPage(refundsDataBeforeApproverAction2);
    InitiateRefunds.approverActionForRequestedRefund('Approve');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('Case Transaction');
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', totalRemissionAmount, '0.00', serviceRequest2remissionAmount);
    await I.click(`//td[contains(.,'${refundRefRemissions2}')]/following-sibling::td/a[.=\'Review\'][1]`);
    I.wait(CCPBATConstants.tenSecondWaitTime);
    const reviewRemissionRefund2DetailsDataAfterApproval = assertionData.reviewRefundDetailsDataAfterApproverAction(refundRefRemissions2, paymentRCRef2, 'Retrospective remission', `£${serviceRequest2remissionAmount}`, emailAddress, '', 'payments probate', 'approver probate');
    await RefundsList.verifyRefundDetailsAfterRefundApproved(reviewRemissionRefund2DetailsDataAfterApproval);

    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions2, '', 'ACCEPTED');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('Back');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', totalRemissionAmount, '0.00', '0.00');
    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');

Scenario('Full Remission Refunds Against Fully Paid Amount for a Single Service Request with Multiple Fees',
  async ({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation,
           PaymentHistory, FailureEventDetails, InitiateRefunds, RefundsList, ResetRefund }) => {

    const ccdCaseNumber = await apiUtils.createACCDCaseForProbate();
    const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);

    const emailAddress = `${stringUtil.getTodayDateAndTimeInString()}refundspaybubbleft1@mailtest.gov.uk`;

    const totalAmount = '489.00';

    const feeCode1 = 'FEE0205';
    const feeAmount1 = '80.00';
    const calculatedAmount1 = '80.00';
    const remissionAmount1= '80.00'; // remission amount against the 1st fee
    const refundAmount1= '80.00'; // refund amount against the 1st remission
    const hwfReference1= 'HWF-A1B-23C'; // HWF reference for the 1st fee

    const feeCode2 = 'FEE0450';
    const feeAmount2 = '377.00';
    const calculatedAmount2 = '377.00';
    const remissionAmount2= '377.00'; // remission amount against the 2nd fee
    const refundAmount2= '377.00'; // refund amount against the 2nd remission
    const hwfReference2= 'PA21-123456'; // HWF reference for the 2nd fee

    const feeCode3 = 'FEE0574';
    const feeAmount3 = '16.00' // FEE0574 = 16 * 2 volume = 32
    const calculatedAmount3 = '32.00';
    const remissionAmount3= '32.00'; // remission amount against the 3rd fee
    const refundAmount3= '32.00'; // refund amount against the 3rd remission
    const hwfReference3= 'AKD-C1E-24D'; // HWF reference for the 3rd fee

    const fees = [
      {
        calculated_amount: calculatedAmount1,
        code: feeCode1,
        fee_amount: feeAmount1,
        description:
          "Civil Court fees - Money Claims - Claim Amount - 1000.01 up to 1500 GBP",
        version: "6",
        volume: 1,
      },
      {
        calculated_amount: calculatedAmount2,
        code: feeCode2,
        fee_amount: feeAmount2,
        description: "Any other remedy (County Court)",
        version: "5",
        volume: 1,
      },
      {
        calculated_amount: calculatedAmount3,
        code: feeCode3,
        fee_amount: feeAmount3,
        description:
          "Copy of document of specific individual requested in all other cases where FEE0573 does not apply (for each copy)",
        version: "1",
        volume: 2,
      },
    ];
    const paymentDetails = await apiUtils.createAPBAPaymentForNumberOfFees(ccdCaseNumber, fees);
    const paymentRcReference = `${paymentDetails.payments[0].payment_reference}`;

    await I.login(testConfig.TestRefundsRequestorUserName, testConfig.TestRefundsRequestorPassword);
    await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', '0.00', '0.00', '0.00');

    //  remission refund - 1st fee - FEE0205 = 80.00
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    if (I.dontSeeElement('Issue refund')) {
      console.log('found disabled button');
      await apiUtils.rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber);
      I.click('Back');
      await I.click('(//*[text()[contains(.,"Review")]])[2]');
    }
    I.waitForText('Add remission', 5);
    // adding a retro remission amount of [£80] against the 1st fee FEE0205
    I.click(`//table/tbody/tr[2]/td[contains(text(), '${feeCode1}')]//ancestor::table//parent::div/button`);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference1);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount1);
    const checkYourAnswersData1 = assertionData.checkYourAnswers(paymentRcReference, hwfReference1, `£${refundAmount1}`, totalAmount, `£${feeAmount1}`, `${feeCode1}`, 'FEE0205 - Civil Court fees - Money Claims - Claim Amount - 1000.01 up to 1500 GBP',
      emailAddress, '', 'SendRefund', `£${remissionAmount1}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData1, false, false);
    InitiateRefunds.verifyRemissionSubmittedPage(true, remissionAmount1);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData1, false, false);
    const refundRefRemissions1 = await InitiateRefunds.verifyRefundSubmittedPage(refundAmount1);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount1, '0.00', '80.00');

    // Approver approved the refund
    await apiUtils.updateRefundStatusByApprover(refundRefRemissions1, 'APPROVE');
    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions1, '', 'ACCEPTED');

    I.refreshPage();
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', remissionAmount1, '0.00', '0.00');

    //  remission refund - 2nd fee - FEE0450 = 377.00
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.waitForText('Add remission', 5);
    // adding a retro remission amount of [£377] against the 2nd fee FEE0450
    I.click(`//table/tbody/tr[2]/td[contains(text(), '${feeCode2}')]//ancestor::table//parent::div/button`);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference2);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount2);
    const checkYourAnswersData2 = assertionData.checkYourAnswers(paymentRcReference, hwfReference2, `£${refundAmount2}`, totalAmount, `£${feeAmount2}`, `${feeCode2}`, 'FEE0450 - Any other remedy (County Court)',
      emailAddress, '', 'SendRefund', `£${remissionAmount2}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData2, false, false);
    InitiateRefunds.verifyRemissionSubmittedPage(true, remissionAmount2);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    InitiateRefunds.verifyCheckYourAnswersPageForRemissionFinalSubmission(checkYourAnswersData2, false, false);
    const refundRefRemissions2 = await InitiateRefunds.verifyRefundSubmittedPage(refundAmount2);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', "457.00", '0.00', '377.00');

    // Approver approved the refund
    await apiUtils.updateRefundStatusByApprover(refundRefRemissions2, 'APPROVE');
    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions2, '', 'ACCEPTED');

    I.refreshPage();
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', "457.00", '0.00', '0.00');

    //  remission refund - 3rd fee - FEE0574 = 32.00
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.waitForText('Add remission', 5);
    // adding a retro remission amount of [£377] against the 2nd fee FEE0450
    I.click(`//table/tbody/tr[2]/td[contains(text(), '${feeCode3}')]//ancestor::table//parent::div/button`);
    InitiateRefunds.verifyProcessRemissionHWFCodePage(ccdCaseNumber, hwfReference3);
    InitiateRefunds.verifyProcessRemissionAmountPage(ccdCaseNumber, remissionAmount3);
    const checkYourAnswersData3 = assertionData.checkYourAnswers(paymentRcReference, hwfReference3, `£${refundAmount3}`, totalAmount, `£${feeAmount3}`, `${feeCode3}`, 'FEE0574 - Copy of document of specific individual requested in all other cases where FEE0573 does not apply (for each copy)',
      emailAddress, '', 'SendRefund', `£${remissionAmount3}`);
    InitiateRefunds.verifyCheckYourAnswersPageForAddRemission(checkYourAnswersData3, false, false);
    InitiateRefunds.verifyRemissionAddedPage(false, remissionAmount3);

    // PAY-8488 -  Returned to the Case and click on Payment details to add refund for the 3rd remission
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', "489.00", '0.00', '32.00');
    await I.click('(//*[text()[contains(.,"Review")]])[2]');
    I.scrollPageToBottom();
    I.waitForText('Add refund', 5);
    I.click(`//table/tbody/tr/td[contains(text(), '${feeCode3}')]//ancestor::tr//td[5]/button`);
    I.click('//*[@id="email"]');
    I.fillField('//*[@id="email"]', emailAddress);
    I.click('Continue');
    checkYourAnswersData3.paymentAmount = `£${calculatedAmount3}`;
    InitiateRefunds.verifyCyaPageForAddRefundForPreExistingRemission(checkYourAnswersData3, false, false);
    const refundRefRemissions3 = await InitiateRefunds.verifyRefundSubmittedPage(refundAmount3);
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', "489.00", '0.00', '32.00');

    // Approver approved the refund
    await apiUtils.updateRefundStatusByApprover(refundRefRemissions3, 'APPROVE');
    // Refund Accepted by liberata
    await apiUtils.updateRefundStatusByRefundReference(refundRefRemissions3, '', 'ACCEPTED');

    I.refreshPage();
    await CaseTransaction.validateCaseTransactionsDetails(totalAmount, '0', "489.00", '0.00', '0.00');

    await I.Logout();
    I.clearCookie();
  }).tag('@pipeline @nightly');
