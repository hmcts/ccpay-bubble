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

Scenario('A Service Request Journey for a Case Worker for Ways to Pay @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 612.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    await I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£612.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, 'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference, '', '£612.00', false);
    I.click('//a[.=\'Review\']');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference, 'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.Logout();
  });

Scenario('A Service Request Not available for Ways to Pay @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    const ccdCaseNumber = '1234123412341234';
    await I.login(testConfig.TestProbateCaseWorkerUserName, testConfig.TestProbateCaseWorkerPassword);
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestNotFoundErrorPage(true);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For a Successful Payment using a PBA Payment @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 612.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    await I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£612.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00', true);
    I.click('//a[.=\'Review\']');
    // ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,'','£612.00');
    I.click('//a[.=\'Back\']');
    I.click('//a[contains(text(),\'Pay now\')]');
    ServiceRequests.verifyPayFeePage('£612.00', 'PBAFUNC345', 'Test Reference');
    ServiceRequests.verifyConfirmedBanner('Payment successful');
    ServiceRequests.verifyServiceRequestTabPage('Paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00', false);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For a General Technical Error during PBA Payment @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 612.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    await I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£612.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00', true);
    I.click('//a[.=\'Review\']');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.click('//a[.=\'Back\']');
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    ServiceRequests.verifyPayFeePage('£612.00', 'PBAFUNC360', 'Test Reference');
    ServiceRequests.verifyWTPGeneralPBAErrorPage(false);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£612.00', true);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor if a PBA Payment amount is over the Payment Limit @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    // console.log('Creating the Service Request');
    const calculatedAmount = 35000.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    // console.log('Before Log In');
    await I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£35,000.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£35,000.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£35,000.00', true);
    I.click('//a[.=\'Review\']');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£35,000.00');
    I.click('//a[.=\'Back\']');
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    ServiceRequests.verifyPayFeePage('£35,000.00', 'PBAFUNC345', 'Test Reference');
    ServiceRequests.verifyNotEnoughFundsPage();
    I.click('//button[contains(text(),\'View Service Request\')]');
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£35,000.00', true);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor if an Account is Deleted for PBA Payment and the Card Payment is Successful @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    // console.log('Creating the Service Request');
    const calculatedAmount = 612.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    // console.log('Before Log In');
    await I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£612.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00', true);
    I.click('//a[.=\'Review\']');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.click('//a[.=\'Back\']');
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    ServiceRequests.verifyPayFeePage('£612.00', 'PBAFUNC350', 'Test Reference');
    ServiceRequests.verifyPBAPaymentErrorPage('PBAFUNC350', 'no longer exists.');
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£612.00');
    const paymentCardValues = assertionData.getPaymentCardValues('4444333322221111', '01',
      '30', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(paymentCardValues);
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Confirm your payment', '£612.00');
    ServiceRequests.verifyConfirmYourPaymentPageCardDetails(paymentCardValues);
    I.returnBackToSite();
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    // TO DO - Assert on a Positive Payment as it is failing now...
    I.Logout();
  });

Scenario('A Service Request for a Solicitor if an Account is On hold for PBA Payment and the Card Payment Fails @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    // console.log('Creating the Service Request');
    const calculatedAmount = 612.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    // console.log('Before Log In');
    await I.login(testConfig.TestWTPPBAAllAccountsUserName, testConfig.TestWTPPBAAllAccountsPasword);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£612.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£612.00', true);
    I.click('//a[.=\'Review\']');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.click('//a[.=\'Back\']');
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    ServiceRequests.verifyPayFeePage('£612.00', 'PBAFUNC355', 'Test Reference');
    ServiceRequests.verifyPBAPaymentErrorPage('PBAFUNC355', 'has been put on hold.');
    ServiceRequests.verifyHeaderDetailsOnCardPaymentOrConfirmYourPaymentPage('Enter card details', '£612.00');
    const paymentCardValues = assertionData.getPaymentCardValues('4000000000000002', '01',
      '30', '123', 'Mr Test', '1', 'Smith Street', 'Rotherham', 'SA1 1XW',
      'Testcardpayment@mailnesia.com');
    ServiceRequests.populateCardDetails(paymentCardValues);
    ServiceRequests.verifyYourPaymentHasBeenDeclinedPage();
    I.returnBackToSite();
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    const statuses = ['Initiated', 'Failed'];
    CaseTransaction.verifyPaymentStatusOnCaseTransactionPage(statuses);
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    ServiceRequests.verifyServiceRequestTabPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution',
      '£612.00', true);
    I.Logout();
  });

Scenario('A Service Request for a Solicitor For No Payment Account @pipeline @nightly',
  async({ I, CaseSearch, CaseTransaction, ServiceRequests }) => {
    logger.log('Creating the Service Request');
    const calculatedAmount = 612.00;
    const serviceRequestDetails = await bulkScanApiCalls.createAServiceRequest('ABA6', calculatedAmount, 'FEE0002', '1', 1);
    const ccdCaseNumber = `${serviceRequestDetails.ccdCaseNumber}`;
    const serviceRequestReference = `${serviceRequestDetails.serviceRequestReference}`;
    // console.info(`The value of the Service Request Reference : ${serviceRequestReference}`);
    // console.log(`The length of the CCD Case Number ${ccdCaseNumber.toString().length}`);
    // console.log(name); // output 'testing'
    await I.login(testConfig.TestWTPPBANoAccountsUserName, testConfig.TestWTPPBANoAccountsPasword);
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    const checkPaymentValuesData = assertionData.checkPaymentValues('£0.00',
      '0', '£0.00', '£612.00');
    await CaseTransaction.validateCaseTransactionPageWithoutRefunds(ccdCaseNumber,
      true, checkPaymentValuesData);
    // Takes you to the Service Request Page...
    I.click('//td[@class="govuk-table__cell"]/a[.="Review"]');
    ServiceRequests.verifyServiceRequestPage('Not paid', serviceRequestReference,
      'Filing an application for a divorce, nullity or civil partnership dissolution', '£612.00');
    I.see('Service Requests');
    I.click('Service Requests');
    await miscUtils.multipleSearchForRefunds(CaseSearch, CaseTransaction, I, ccdCaseNumber);
    I.click({ xpath: '//a[contains(text(),\'Pay now\')]' });
    ServiceRequests.verifyNoPBAFoundPage();
    I.click({ xpath: '//input[@id=\'cancel-payment\']' });
    ServiceRequests.verifyYourPaymentHasBeenCancelledPage();
  });
