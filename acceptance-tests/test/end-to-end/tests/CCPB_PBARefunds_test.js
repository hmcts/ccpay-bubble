const CCPBATConstants = require('./CCPBAcceptanceTestConstants');

// const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds_test.js');

// const successResponse = 202;

Feature('CC Pay Bubble Acceptance Tests For Refunds and Remissions').retry(CCPBATConstants.retryScenario);

/* BeforeSuite(async I => {
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Disabled CCD validation');
  }
});

AfterSuite(async I => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Enabled CCD validation');
  }
});*/

Scenario.skip('Refund a Successful PBA Payment through the Payments', async I => {
  logger.log('Starting the PBA Payment');
  const ccdCaseNumber = await bulkScanApiCalls.createAPBAPayment('90.00');
  logger.log(`CCD Case Number : ${ccdCaseNumber}`);

  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  await miscUtils.multipleSearch(CaseSearch, I, ccd_case_number);
  InitiateRefunds.issueRefundJourney('Payments');
});

Scenario.skip('Refund a Successful PBA Payment through the Service Requests', async I => {
  logger.log('Starting the PBA Payment');
  const ccdCaseNumber = await bulkScanApiCalls.createAPBAPayment('90.00');
  logger.log(`CCD Case Number : ${ccdCaseNumber}`);

  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  await miscUtils.multipleSearch(CaseSearch, I, ccd_case_number);
  InitiateRefunds.issueRefundJourney('Payments');
});

Scenario.skip('Refund List Page and Review Refund Journey', async I => {
  logger.log('Starting the PBA Payment');
  const ccdCaseNumber = await bulkScanApiCalls.createAPBAPayment('90.00');
  logger.log(`CCD Case Number : ${ccdCaseNumber}`);

  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  await miscUtils.multipleSearch(CaseSearch, I, ccd_case_number);
  const refundReference = InitiateRefunds.issueRefundJourney();
  RefundsList.reviewRefundJourney(refundReference);
});

Scenario.skip('Refund List Page and Approver Journey', async I => {
  logger.log('Starting the PBA Payment');
  const ccdCaseNumber = await bulkScanApiCalls.createAPBAPayment('90.00');
  logger.log(`CCD Case Number : ${ccdCaseNumber}`);

  I.login('robreallywantsccdaccess@mailinator.com', 'Testing1234');
  await miscUtils.multipleSearch(CaseSearch, I, ccd_case_number);
  const refundReference = InitiateRefunds.issueRefundJourney();
  RefundsList.approveRefundJourney(refundReference);
});
