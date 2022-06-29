const CCPBATConstants = require('./CCPBAcceptanceTestConstants');
const miscUtils = require('../helpers/misc');

// eslint-disable-next-line no-unused-vars
const nightlyTest = process.env.NIGHTLY_TEST;

const bulkScanApiCalls = require('../helpers/utils');

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('CCPB_PBARefunds.js');
const assertionData = require('../fixture/data/refunds/assertion');

const testConfig = require('./config/CCPBConfig');

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

AfterSuite(async I => {
  const response = await bulkScanApiCalls.toggleOnCaseValidation();
  I.wait(CCPBATConstants.fiveSecondWaitTime);
  if (response === successResponse) {
    logger.info('Enabled CCD validation');
  }
});

Scenario('A Service Request Journey for a Case Worker for Ways to Pay @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 593.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£593.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, 'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference, '', '£593.00', false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, 'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.Logout();
  });

Scenario('A Service Request Not available for Ways to Pay @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    const ccdCaseNumber = '1234123412341234';
    I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestNotFoundErrorPage(true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For a Successful Payment using a PBA Payment @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 593.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£593.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    // ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,'','£593.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//a[contains(text(),\'Pay now\')]');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£593.00', 'PBAFUNC345', 'Test Reference');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyConfirmedBanner('Payment successful');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00', false);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For a General Technical Error during PBA Payment @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 593.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£593.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£593.00', 'PBAFUNC360', 'Test Reference');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyWTPGeneralPBAErrorPage(false);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£593.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor if a PBA Payment amount is over the Payment Limit @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    // console.log('Creating the Service Request');
    const calculatedAmount = 35000.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    // console.log('Before Log In');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£35,000.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£35,000.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£35,000.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£35,000.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£35,000.00', 'PBAFUNC345', 'Test Reference');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyNotEnoughFundsPage();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//button[contains(text(),\'View Service Request\')]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£35,000.00', true);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor if an Account is Deleted for PBA Payment and the Card Payment is Successful @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    // console.log('Creating the Service Request');
    const calculatedAmount = 593.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    // console.log('Before Log In');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£593.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£593.00', 'PBAFUNC350', 'Test Reference');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyPBAPaymentErrorPage('PBAFUNC350', 'no longer exists.');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£593.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const paymentCardValues = assertionData.getPaymentCardValues('4444333322221111', '01',
      '26', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Confirm your payment', '£593.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyConfirmYourPaymentPageCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.returnBackToSite();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    // TO DO - Assert on a Positive Payment as it is failing now...
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor if an Account is On hold for PBA Payment and the Card Payment Fails @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    // console.log('Creating the Service Request');
    const calculatedAmount = 593.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    // console.log('Before Log In');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£593.00');
    I.wait(CCPBATConstants.sevenSecondWaitTime);
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£593.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click('//a[.=\'Review\']');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.click('//a[.=\'Back\']');
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyPayFeePage('£593.00', 'PBAFUNC355', 'Test Reference');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyPBAPaymentErrorPage('PBAFUNC355', 'has been put on hold.');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£593.00');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const paymentCardValues = assertionData.getPaymentCardValues('4000000000000002', '01',
      '26', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(paymentCardValues);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyYourPaymentHasBeenDeclinedPage();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.returnBackToSite();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    const statuses = ['Initiated', 'Failed'];
    CaseTransaction.verifyPaymentStatusOnCaseTransactionPage(statuses);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£593.00', true);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For No Payment Account @pipeline @nightly',
  async(I, CaseSearch, CaseTransaction, ServiceRequests) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 593.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    I.login(testConfig.TestWTPPBANoAccountsUserName, testConfig.TestWTPPBANoAccountsPasword);
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£593.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£593.00');
    I.see('Service Requests');
    I.click('Service Requests');
    I.wait(CCPBATConstants.twoSecondWaitTime);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    I.wait(CCPBATConstants.fiveSecondWaitTime);
    ServiceRequests.verifyNoPBAFoundPage();
    I.wait(CCPBATConstants.twoSecondWaitTime);
    I.click({ xpath: '//input[@id=\'cancel-payment\']' });
    I.wait(CCPBATConstants.twoSecondWaitTime);
    ServiceRequests.verifyYourPaymentHasBeenCancelledPage();
  });
