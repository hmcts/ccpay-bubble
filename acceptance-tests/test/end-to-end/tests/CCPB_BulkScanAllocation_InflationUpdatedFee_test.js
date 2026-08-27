/* eslint-disable no-alert, no-console, object-curly-newline */
const { Logger } = require('@hmcts/nodejs-logging');

const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

const logger = Logger.getLogger('CCPB_BulkScanAllocation_InflationUpdatedFee_test.js');

const bulkScanApiCalls = require('../helpers/utils');

const miscUtils = require('../helpers/misc');

const stringUtils = require('../helpers/string_utils');

const testConfig = require('./config/CCPBConfig');
const apiUtils = require("../helpers/utils");
const assertionData = require("../fixture/data/refunds/assertion");

let feeCode;

Feature('CC Pay Bubble Bulk Scan Test for Inflation updated Fee').retry(CCPBATConstants.defaultNumberOfRetries);

Before(async() => {
  feeCode = await apiUtils.createInflationTestingFee();
});

After(async () => {
  if (feeCode) {
    await apiUtils.deleteFee(feeCode);
  }
});

Scenario('Normal ccd case cheque payment full allocation with Inflation updated Fee', async({ I, CaseSearch, CaseTransaction, AddFees, FeesSummary, ConfirmAssociation, PaymentHistory }) => {
  // logger.info(`The value of the ccdCaseNumber from the test: ${ccdCaseNumber}`);
  await I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
  const totalAmount = '150.00';
  const feeAmount = '150.00';
  const ccdAndDcn = await bulkScanApiCalls.bulkScanNormalCcd('AA08', totalAmount, 'cheque');
  const ccdCaseNumber = ccdAndDcn[1];
  const dcnNumber = ccdAndDcn[0];
  const ccdCaseNumberFormatted = stringUtils.getCcdCaseInFormat(ccdCaseNumber);
  await miscUtils.multipleSearch(CaseSearch, I, ccdCaseNumber);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  CaseTransaction.checkBulkCase(ccdCaseNumberFormatted, 'Case reference');
  CaseTransaction.checkUnallocatedPayments('1', dcnNumber, totalAmount, 'cheque');
  CaseTransaction.allocateToNewFee();
  await AddFees.addInflationUpdatedFee(feeCode);
  FeesSummary.verifyFeeSummaryBulkScan(ccdCaseNumberFormatted, feeCode, feeAmount, true);
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  ConfirmAssociation.verifyConfirmAssociationFullPayment(feeCode, '1', totalAmount, feeAmount);
  ConfirmAssociation.confirmPayment();
  I.wait(CCPBATConstants.tenSecondWaitTime);
  CaseTransaction.checkBulkCaseSuccessPayment(ccdCaseNumberFormatted, 'Case reference', 'Allocated');
  CaseTransaction.checkIfBulkScanPaymentsAllocated(dcnNumber);
  I.Logout();
}).tag('@pipeline @nightly @inflationUpdatedFee');
