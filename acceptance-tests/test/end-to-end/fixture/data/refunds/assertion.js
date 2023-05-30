/* eslint-disable no-alert, no-console */
// const { Logger } = require('@hmcts/nodejs-logging');

// const logger = Logger.getLogger('fixture/data/refunds/assertion.js');

const stringUtil = require('../../../helpers/string_utils.js');

function checkPaymentValues(
  totalPaymentsValue, unallocatedPaymentsValue, totalRemissionsValue, amountDueValue) {
  const checkPaymentValuesData = {
    totalPayments: `${totalPaymentsValue}`,
    unallocatedPayments: `${unallocatedPaymentsValue}`,
    totalRemissions: `${totalRemissionsValue}`,
    amountDue: `${amountDueValue}`
  };
  return checkPaymentValuesData;
}

function checkYourDetailsSummary(
  serviceReference, paymentReference, paymentAmount,
  paymentMethod, paymentType, paymentChannel, paymentStatus,
  PBAAccountName, PBANumber, customerInternalReference) {
  const checkYourDetailsSummaryData = {
    serviceReference: `${serviceReference}`,
    paymentReference: `${paymentReference}`,
    paymentAmount: `${paymentAmount}`,
    paymentMethod: `${paymentMethod}`,
    paymentType: `${paymentType}`,
    paymentChannel: `${paymentChannel}`,
    paymentStatus: `${paymentStatus}`,
    pbaAccountName: `${PBAAccountName}`,
    pbaNumber: `${PBANumber}`,
    customerInternalReference: `${customerInternalReference}`
  };
  // console.log('After checkYourDetailsSummary()');
  return checkYourDetailsSummaryData;
}

function checkYourAnswers(
  paymentReference, hwfReferenceCode, refundAmount, paymentAmount,
  feeAmount, feeCode, feeDescription, email, postCode, notificationType) {
  const checkYourAnswersData = {
    paymentReference: `${paymentReference}`,
    paymentAmount: `${paymentAmount}`,
    paymentStatus: 'Success',
    feeAmount: `${feeAmount}`,
    feeCode: `${feeCode}`,
    feeDescription: `${feeDescription}`,
    hwfReference: `${hwfReferenceCode}`,
    refundAmount: `${refundAmount}`,
    email: `${email}`,
    postCode: `${postCode}`,
    refundNotificationType: `${notificationType}`
  };
  return checkYourAnswersData;
}

function getPaymentCardValues(cardNumber, expiryMonth, expiryYear, cvc,
  name, houseNumber, addressLine, townOrCity, postcode, email) {
  const paymentCardValues = {
    cardNumber: `${cardNumber}`,
    expiryMonth: `${expiryMonth}`,
    expiryYear: `${expiryYear}`,
    cvc: `${cvc}`,
    name: `${name}`,
    houseNumber: `${houseNumber}`,
    addressLine: `${addressLine}`,
    townOrCity: `${townOrCity}`,
    postcode: `${postcode}`,
    email: `${email}`
  };
  return paymentCardValues;
}

function getCaseTransactionsData(
  paymentReference, refundAmount, refundStatus,
  refundReference, refundReason, refundSubmittedBy, refundNotes) {
  // console.log('Inside caseTransactionsData()');
  const caseTransactionsData = {
    paymentReference: `${paymentReference}`,
    paymentAmount: '£215.00',
    totalRemissions: `${refundAmount}`,
    refundAmount: `${refundAmount}`,
    unallocatedPayments: '0',
    amountDue: '£0.00',
    refundStatus: `${refundStatus}`,
    refundReference: `${refundReference}`,
    refundReason: `${refundReason}`,
    refundSubmittedBy: `${refundSubmittedBy}`,
    refundNotes: `${refundNotes}`
  };
  // console.log(`The value of the caseTransactionsData()${JSON.stringify(caseTransactionsData)}`);
  return caseTransactionsData;
}

function reviewRefundDetailsDataBeforeApproverAction(
  refundReference, refundReason, refundAmount, email, postcode, refundSubmittedBy,
  refundNotificationType) {
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  const refundDetailsData = {
    refundReference: `${refundReference}`,
    refundReason: `${refundReason}`,
    refundAmount: `${refundAmount}`,
    email: `${email}`,
    postcode: `${postcode}`,
    refundSubmittedBy: `${refundSubmittedBy}`,
    refundSubmittedDate: `${todayDateInDDMMMYYYY}`,
    refundNotificationType: `${refundNotificationType}`
  };
  return refundDetailsData;
}

function reviewRefundDetailsDataAfterApproverAction(
  refundReference, paymentRcReference, refundReason, refundAmount, email, postcode,
  refundRequester, refundApprover) {
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  const refundDetailsData = {
    refundReference: `${refundReference}`,
    paymentRcReference: `${paymentRcReference}`,
    refundReason: `${refundReason}`,
    refundAmount: `${refundAmount}`,
    refundSubmittedDate: `${todayDateInDDMMMYYYY}`,
    email: `${email}`,
    postcode: `${postcode}`,
    refundRequester: `${refundRequester}`,
    refundApprover: `${refundApprover}`
  };
  return refundDetailsData;
}

function reviewProcessRefundPageDataForFeeRefundSelection(
  paymentReference, feeDescription,
  feeAmount, paymentAmount, refundAmount, quantity) {
  const reviewProcessRefundPageData = {
    paymentReference: `${paymentReference}`,
    feeDescription: `${feeDescription}`,
    feeAmount: `${feeAmount}`,
    paymentAmount: `${paymentAmount}`,
    quantity: `${quantity}`,
    refundAmount: `${refundAmount}`
  };
  return reviewProcessRefundPageData;
}

function checkYourAnswersBeforeSubmitRefund(
  paymentReference, paymentAmount, feeAmount, refundReason, refundAmount, email, postcode,
  refundNotificationType) {
  const checkYourAnswersDataBeforeSubmitRefund = {
    paymentReference: `${paymentReference}`,
    paymentAmount: `${paymentAmount}`,
    feeAmount: `${feeAmount}`,
    refundReason: `${refundReason}`,
    refundAmount: `${refundAmount}`,
    email: `${email}`,
    postcode: `${postcode}`,
    refundNotificationType: `${refundNotificationType}`
  };
  return checkYourAnswersDataBeforeSubmitRefund;
}

function refundNotificationPreviewData(
  email, postcode, ccdCaseNumber, refundReference, refundAmount, refundReason,
  bulkScanPaymentMethod = 'default') {
  const checkYourAnswersDataBeforeSubmitRefund = {
    email: `${email}`,
    postcode: `${postcode}`,
    ccdCaseNumber: `${ccdCaseNumber}`,
    refundReference: `${refundReference}`,
    refundAmount: `${refundAmount}`,
    refundReason: `${refundReason}`,
    bulkScanPaymentMethod: `${bulkScanPaymentMethod}`
  };

  return checkYourAnswersDataBeforeSubmitRefund;
}

module.exports = {
  checkPaymentValues, checkYourDetailsSummary,
  checkYourAnswers, getCaseTransactionsData,
  getPaymentCardValues, reviewProcessRefundPageDataForFeeRefundSelection,
  checkYourAnswersBeforeSubmitRefund, refundNotificationPreviewData,
  reviewRefundDetailsDataBeforeApproverAction, reviewRefundDetailsDataAfterApproverAction
};
