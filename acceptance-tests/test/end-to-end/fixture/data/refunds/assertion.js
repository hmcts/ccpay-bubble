/* eslint-disable no-alert, no-console */
// const { Logger } = require('@hmcts/nodejs-logging');

// const logger = Logger.getLogger('fixture/data/refunds/assertion.js');

function checkPaymentValues(totalPaymentsValue, unallocatedPaymentsValue,
  totalRemissionsValue, amountDueValue) {
  const checkPaymentValuesData = {
    totalPayments: `${totalPaymentsValue}`,
    unallocatedPayments: `${unallocatedPaymentsValue}`,
    totalRemissions: `${totalRemissionsValue}`,
    amountDue: `${amountDueValue}`
  };
  return checkPaymentValuesData;
}

function checkYourDetailsSummary(serviceReference, paymentReference,
  paymentAmount, paymentMethod,
  paymentType, paymentChannel, paymentStatus, PBAAccountName,
  PBANumber, customerInternalReference) {
  // console.log('Inside checkYourDetailsSummary()');
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

function checkYourAnswers(paymentReference, hwfReferenceCode, refundAmount) {
  const checkYourAnswersData = {
    paymentReference: `${paymentReference}`,
    paymentAmount: '£215.00',
    paymentStatus: 'Success',
    feeCode: 'FEE0226',
    feeDescription: 'FEE0226 - Personal Application for grant of Probate',
    hwfReference: `${hwfReferenceCode}`,
    refundAmount: `${refundAmount}`
  };
  return checkYourAnswersData;
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

module.exports = {
  checkPaymentValues, checkYourDetailsSummary,
  checkYourAnswers, getCaseTransactionsData
};
