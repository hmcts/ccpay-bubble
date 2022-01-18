const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');

// eslint-disable-next-line no-unused-vars
const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const {Logger} = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds.js');
const assertionData = require('../fixture/data/refunds/assertion');

// const name = require('../content/multiple_pba.json');

const successResponse = 202;

// const successResponse = 202;

Feature('CC Pay Bubble Acceptance Tests For the Ways To Pay feature').retry(CCPBATConstants.retryScenario);

BeforeSuite(async I => {
  // console.log('Before Suite');
  const response = await bulkScanApiCalls.toggleOffCaseValidation();
  // console.log('After Response');
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Disabled CCD validation');
  }
});

/*
AfterSuite(async I => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Enabled CCD validation');
  }
});
*/

Scenario('A Service Request Journey for a Case Worker for Ways to Pay @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6');
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login('probaterequesteraat@mailnesia.com', 'LevelAt12');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£100.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, '', '£100.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference, '', '£100.00', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, '', '£100.00');
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For a Successful Payment using a PBA Payment @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6');
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    I.login('feeandpaydZtnfQ_external@mailnesia.com', 'Password123!');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£100.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, '', '£100.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference, '', '£100.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,'','£100.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[contains(.,\'Pay now\')]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£100.00', 'PBAFUNC345', 'Test Reference');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyConfirmedBanner('Payment successful');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Paid', serviceRequestReference, '', '£100.00', false);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For a General Technical Error during PBA Payment @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6');
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    I.login('feeandpaydZtnfQ_external@mailnesia.com', 'Password123!');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£100.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, '', '£100.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference, '', '£100.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, '', '£100.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click({xpath: '//a[contains(text(),\'Pay now\')]'});
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£100.00', 'PBAFUNC360', 'Test Reference');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyWTPGeneralPBAErrorPage(false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference, '', '£100.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

/*Scenario('Test with Mocked Data... @pipeline @nightly',
  async (I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6');
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    //pause();
    I.login('feeandpaydZtnfQ_external@mailnesia.com', 'Password123!');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£100.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, '', '£100.00');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
  });*/
