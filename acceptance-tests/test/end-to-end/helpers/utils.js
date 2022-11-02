/* eslint-disable no-alert, no-console */
const { Logger } = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');

// eslint-disable max-len

const request = requestModule.defaults();

const stringUtil = require('./string_utils.js');
const numUtil = require('./number_utils');
const testConfig = require('../tests/config/CCPBConfig.js');
const { Console } = require('console');
const { async } = require('rxjs/internal/scheduler/async.js');

const logger = Logger.getLogger('helpers/utils.js');

const env = testConfig.TestIDAMEnvironment;
const environment = testConfig.TestRunningEnvironment;
const prNumber = testConfig.TestPrNumber;

async function getIDAMToken() {
  const username = testConfig.TestProbateCaseWorkerUserName;
  const password = testConfig.TestProbateCaseWorkerPassword;

  const idamClientID = testConfig.TestClientID;
  const idamClientSecret = testConfig.TestClientSecret;
  const redirectUri = testConfig.TestRedirectURI;
  const scope = 'openid profile roles';
  const grantType = 'password';
  logger.info(`The value of the User Name ${username}`);
  logger.info(`The value of the Password ${password}`);
  logger.info(`The value of the Client Id : ${idamClientID}`);
  logger.info(`The value of the Client Secret : ${idamClientSecret}`);
  logger.info(`The value of the Redirect URI : ${redirectUri}`);
  logger.info(`The value of the grant Type : ${grantType}`);
  logger.info(`The value of the scope : ${scope}`);

  const s2sBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;
  const idamTokenPath = '/o/token';
  logger.debug(`The value of the IDAM URL : ${s2sBaseUrl}${idamTokenPath}`);

  const idamTokenResponse = await request({
    method: 'POST',
    uri: `${s2sBaseUrl}${idamTokenPath}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${grantType}&client_id=${idamClientID}&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&username=${username}&password=${password}&scope=${scope}`
  }, (_error, response) => {
    statusCode = response.statusCode;
  }).catch(error => {
    logger.error(error);
  });
  logger.debug(idamTokenPath);
  return JSON.parse(idamTokenResponse).access_token;
}

async function getIDAMTokenForDivorceUser() {
  const username = testConfig.TestDivorceCaseWorkerUserName;
  const password = testConfig.TestDivorceCaseWorkerPassword;

  const idamClientID = testConfig.TestDivorceClientID;
  const idamClientSecret = testConfig.TestDivorceClientSecret;
  const redirectUri = testConfig.TestDivorceClientRedirectURI;
  const scope = 'openid profile roles';
  const grantType = 'password';
  logger.info(`The value of the User Name ${username}`);
  logger.info(`The value of the Password ${password}`);
  logger.info(`The value of the Client Id : ${idamClientID}`);
  logger.info(`The value of the Client Secret : ${idamClientSecret}`);
  logger.info(`The value of the Redirect URI : ${redirectUri}`);
  logger.info(`The value of the grant Type : ${grantType}`);
  logger.info(`The value of the scope : ${scope}`);

  const s2sBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;
  const idamTokenPath = '/o/token';
  logger.debug(`The value of the IDAM URL : ${s2sBaseUrl}${idamTokenPath}`);
  console.log('****uri - ' + s2sBaseUrl + idamTokenPath);

  const idamTokenResponse = await request({
    method: 'POST',
    uri: `${s2sBaseUrl}${idamTokenPath}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${grantType}&client_id=${idamClientID}&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&username=${username}&password=${password}&scope=${scope}`
  }
    , (_error, response) => {
      statusCode = response.statusCode;
      console.log('*****statuscode - ' + statusCode);
    }).catch(error => {
      logger.error(error);
      console.log('*****error - ' + error);
    });
  logger.debug(idamTokenPath);
  return JSON.parse(idamTokenResponse).access_token;
}

async function getServiceTokenForSecret(service, serviceSecret) {
  logger.info('Getting Service Token');
  logger.info(`Getting Service Token${service}`);
  logger.info(`Getting Service Token${serviceSecret}`);

  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
  const s2sAuthPath = '/testing-support/lease';
  // eslint-disable-next-line global-require
  const oneTimePassword = require('otp')({ secret: serviceSecret }).totp();

  logger.info(`Getting The one time password${oneTimePassword}`);
  logger.info(`Getting The one time password :${s2sBaseUrl}`);
  const serviceToken = await request({
    method: 'POST',
    uri: s2sBaseUrl + s2sAuthPath,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ microservice: service })
  });
  logger.debug(serviceToken);
  logger.log(serviceToken);
  return serviceToken;
}

// eslint-disable-next-line no-unused-vars
async function getServiceToken(_service) {
  console.log('Getting Service Token');

  // const serviceSecret = process.env.CCD_SUBMIT_S2S_SECRET;

  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
  const s2sAuthPath = '/testing-support/lease';

  // eslint-disable-next-line no-unused-vars
  // const oneTimePassword = require('otp')({ secret: serviceSecret }).totp();

  const serviceToken = await request({
    method: 'POST',
    uri: s2sBaseUrl + s2sAuthPath,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ microservice: 'ccpay_bubble' })
  });
  console.log(serviceToken + "Servive token is    ")
  logger.debug(serviceToken);
  return serviceToken;
}

async function getUserID(idamToken) {
  // const idamToken = await getIDAMToken();
  const detailsBaseUrl = `https://idam-api.${env}.platform.hmcts.net`;
  const idamDetailsPath = '/details';

  const idamDetailsResponse = await request({
    method: 'GET',
    uri: `${detailsBaseUrl}${idamDetailsPath}`,
    headers: {
      Authorization: `Bearer ${idamToken}`,
      'Content-Type': 'application/json'
    }
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The response Status Code : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });
  logger.debug(idamDetailsResponse);
  const responsePayload = JSON.parse(idamDetailsResponse);
  const idValue = responsePayload.id;
  return idValue;
}

async function getCREATEEventForProbate() {
  const idamToken = await getIDAMToken();
  const userID = await getUserID(idamToken);
  const serviceAuthorizationToken = await getServiceToken();
  const createTokenCCDEventContextBaseUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal`;
  const createTokenCCDEventRelativeBaseUrl = `/caseworkers/${userID}/jurisdictions/PROBATE/case-types/GrantOfRepresentation/event-triggers/createDraft/token`;

  const createTokenResponse = await request({
    method: 'GET',
    uri: `${createTokenCCDEventContextBaseUrl}${createTokenCCDEventRelativeBaseUrl}`,
    headers: {
      Authorization: `Bearer ${idamToken}`,
      ServiceAuthorization: `${serviceAuthorizationToken}`,
      'Content-Type': 'application/json'
    }
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.log(statusCode);
  }).catch(error => {
    logger.log(error);
    logger.error(error);
  });
  logger.debug(createTokenResponse);
  const responsePayload = JSON.parse(createTokenResponse);
  const createTokenValue = responsePayload.token;
  return createTokenValue;
}

async function getCREATEEventForDivorce() {
  const idamTokenForDivorce = await getIDAMTokenForDivorceUser();
  logger.info(`The value of the idamTokenForDivorce ${idamTokenForDivorce}`);
  const userID = await getUserID(idamTokenForDivorce);
  logger.info(`The value of the userID ${userID}`);
  const serviceAuthorizationToken = await getServiceToken();
  logger.info(`The value of the service Token ${serviceAuthorizationToken}`);
  const createTokenCCDEventContextBaseUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal`;
  const createTokenCCDEventRelativeBaseUrl = `/caseworkers/${userID}/jurisdictions/DIVORCE/case-types/DIVORCE/event-triggers/createCase/token`;

  const createTokenResponse = await request({
    method: 'GET',
    uri: `${createTokenCCDEventContextBaseUrl}${createTokenCCDEventRelativeBaseUrl}`,
    headers: {
      Authorization: `Bearer ${idamTokenForDivorce}`,
      ServiceAuthorization: `${serviceAuthorizationToken}`,
      'Content-Type': 'application/json'
    }
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(statusCode);
  }).catch(error => {
    logger.error(error);
  });
  logger.debug(`Response : ${createTokenResponse}`);
  const responsePayload = JSON.parse(createTokenResponse);
  const createTokenValue = responsePayload.token;
  return createTokenValue;
}

async function CaseValidation(flag) {
  logger.info(`${flag} case validation`);

  const paymentBaseUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const disablePath = `/api/ff4j/store/features/caseref-validation/${flag}`;
  // eslint-disable-next-line global-require
  const saveCaseResponse = await request({
    method: 'POST',
    uri: paymentBaseUrl + disablePath,
    headers: { 'Content-Type': 'application/json' }
  },
    (_error, response) => {
      statusCode = response.statusCode;
      logger.info(statusCode);
    }).catch(error => {
      logger.error(error);
    });
  logger.info(saveCaseResponse);
  return statusCode;
}

async function toggleOffCaseValidation() {
  const response = await CaseValidation('disable');
  return Promise.all([response]);
}

async function toggleOnCaseValidation() {
  const response = await CaseValidation('enable');
  return Promise.all([response]);
}

async function createACCDCaseForProbate() {
  const idamToken = await getIDAMToken();
  const serviceToken = await getServiceToken();
  const createToken = await getCREATEEventForProbate();

  const createCCDCaseBody = {

    data: {}, event:
      { id: 'createDraft', summary: '', description: '' },
    event_token: `${createToken}`,
    ignore_warning: false,
    draft_id: null
  };

  const probateCCDCreateCaseContextBaseUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal`;
  const probateCCDCreateCaseRelativeBaseUrl = '/case-types/GrantOfRepresentation/cases';

  logger.info(`The value of the Body ${JSON.stringify(createCCDCaseBody)}`);
  const probateCaseCreated = {
    method: 'POST',
    uri: probateCCDCreateCaseContextBaseUrl + probateCCDCreateCaseRelativeBaseUrl,
    headers: {
      Authorization: `Bearer ${idamToken}`,
      ServiceAuthorization: `${serviceToken}`,
      'Content-Type': 'application/json',
      experimental: true
    },
    body: JSON.stringify(createCCDCaseBody)
  };

  const probateCaseCreatedResponse = await request(probateCaseCreated,
    (_error, response) => {
      logger.info(response);
      logger.info(`${statusCode}The value of the status code`);
      logger.info(`${response}The value of the response`);
    }).catch(error => {
      logger.error(error);
    });

  logger.debug(probateCaseCreatedResponse);

  const ccdCaseNumberPayload = JSON.parse(probateCaseCreatedResponse);
  const ccdCaseNumber = ccdCaseNumberPayload.id;
  return ccdCaseNumber;
}

async function createACCDCaseForDivorce() {
  const idamTokenForDivorce = await getIDAMTokenForDivorceUser();
  console.log('****idamTokenForDivorce-' + idamTokenForDivorce);
  const serviceToken = await getServiceToken();
  console.log('****serviceToken-' + serviceToken);
  const createToken = await getCREATEEventForDivorce();
  console.log('****createToken-' + createToken);


  const createCCDDivorceCaseBody = {
    data: { LanguagePreferenceWelsh: 'No' },
    event: {
      id: 'createCase',
      summary: 'TESTING',
      description: 'Testing'
    },
    event_token: `${createToken}`,
    ignore_warning: false,
    draft_id: null
  };

  const divorceCCDCreateCaseContextBaseUrl = `http://ccd-data-store-api-${env}.service.core-compute-${env}.internal`;
  const divorceCCDCreateCaseRelativeBaseUrl = '/case-types/DIVORCE/cases';

  logger.debug(`The value of the Body ${JSON.stringify(createCCDDivorceCaseBody)}`);
  const divorceCaseCreated = {
    method: 'POST',
    uri: divorceCCDCreateCaseContextBaseUrl + divorceCCDCreateCaseRelativeBaseUrl,
    headers: {
      Authorization: `Bearer ${idamTokenForDivorce}`,
      ServiceAuthorization: `${serviceToken}`,
      'Content-Type': 'application/json',
      experimental: true
    },
    body: JSON.stringify(createCCDDivorceCaseBody)
  };



  logger.debug(`The value of the Service Token : ${serviceToken}`);
  logger.debug(`The value of the Create Token for Divorce: ${createToken}`);

  const divorceCaseCreatedResponse = await request(divorceCaseCreated,
    (_error, response) => {
      logger.info(response);
      logger.debug(`${statusCode}The value of the status code`);
      logger.debug(`${response}The value of the response`);
    }).catch(error => {
    console.error(error);
  });
  logger.debug(divorceCaseCreatedResponse);

  console.log('*****divorceCaseCreatedResponse - ' + divorceCaseCreatedResponse);

  const ccdCaseNumberPayload = JSON.parse(divorceCaseCreatedResponse);
  const ccdCaseNumber = ccdCaseNumberPayload.id;
  logger.info(`The value of the CCDCaseNumber : ${ccdCaseNumber}`);
  return ccdCaseNumber;
}

async function rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(
  idamToken, serviceToken, ccdCaseNumber) {
  logger.debug('Inside the updatePBAPaymentDateByCCDCaseNumber() method');
  const rollbackPaymentDateByCCDNumberUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const rollbackPaymentDateByCCDNumberEndPoint = `/payments/ccd_case_reference/${ccdCaseNumber}`;
  logger.debug(`The Full URL : ${rollbackPaymentDateByCCDNumberUrl}${rollbackPaymentDateByCCDNumberEndPoint}`);

  const getPBAPaymentByCCDCaseNumberOptions = {
    method: 'PATCH',
    uri: rollbackPaymentDateByCCDNumberUrl + rollbackPaymentDateByCCDNumberEndPoint,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  };
  await request(getPBAPaymentByCCDCaseNumberOptions,
    (_error, response) => {
      logger.info(response);
      logger.info(`${statusCode}The value of the status code`);
      logger.info(`${response}The value of the response`);
    }).catch(error => {
      logger.error(error);
    });
}

async function getPBAPaymentByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber) {
  logger.debug('Inside the getPBAPaymentByCCDCaseNumber() method');
  const getPaymentByCCDNumberUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const getPaymentByCCDNumberEndPoint = `/reconciliation-payments?ccd_case_number=${ccdCaseNumber}`;
  logger.debug(`The Full URL : ${getPaymentByCCDNumberUrl}${getPaymentByCCDNumberEndPoint}`);

  const getPBAPaymentByCCDCaseNumberOptions = {
    method: 'GET',
    uri: getPaymentByCCDNumberUrl + getPaymentByCCDNumberEndPoint,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  };

  const paymentLookUpResponseString = await request(getPBAPaymentByCCDCaseNumberOptions,
    (_error, response) => {
      logger.info(response);
      logger.info(`${statusCode}The value of the status code`);
      logger.info(`${response}The value of the response`);
    }).catch(error => {
      logger.error(error);
    });
  logger.debug(`The value of the PaymentLookUpResponseString : ${paymentLookUpResponseString}`);
  const paymentLookupObject = JSON.parse(paymentLookUpResponseString);
  const paymentReference = paymentLookupObject.payments[0].payment_reference;
  logger.debug(`The value of the payment Reference${paymentReference}`);
  return paymentReference;
}

// eslint-disable-next-line no-unused-vars
async function createAFailedPBAPayment() {
  logger.debug('Creating bulk a PBA Payment...');
  const creditAccountPaymentUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const creditAccountPaymentEndPoint = '/credit-account-payments';
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const testCmcSecret = testConfig.TestCMCSecret;
  const accountNumber = testConfig.TestAccountNumberInActive;
  logger.debug(`The value of the inactive account number : ${accountNumber}`);
  logger.debug(`The value of the IDAM Token ${idamToken}`);
  logger.debug(`The value of the cmc secret ${testCmcSecret}`);
  const serviceToken = await getServiceTokenForSecret(microservice, testCmcSecret);
  logger.debug(`The value of the Service Token ${serviceToken}`);

  // eslint-disable-next-line no-magic-numbers
  const ccdCaseNumber = numUtil.randomInt(1, 9999999999999999);
  logger.debug(`The value of the CCD Case Number : ${ccdCaseNumber}`);
  logger.debug(`The Full Payment URL : ${creditAccountPaymentUrl}${creditAccountPaymentEndPoint}`);

  const saveBody = {
    account_number: `${accountNumber}`,
    amount: 215,
    case_reference: '1253656',
    ccd_case_number: `${ccdCaseNumber}`,
    currency: 'GBP',
    customer_reference: 'string',
    description: 'string',
    fees: [
      {
        calculated_amount: 215,
        code: 'FEE0226',
        fee_amount: 215,
        version: '3',
        volume: 1
      }
    ],
    organisation_name: 'string',
    service: 'PROBATE',
    site_id: 'AA08'
  };
  logger.debug(`The value of the Body ${JSON.stringify(saveBody)}`);
  const createAPBAPaymentOptions = {
    method: 'POST',
    uri: creditAccountPaymentUrl + creditAccountPaymentEndPoint,
    headers: {
      Authorization: `${idamToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  let paymentReference = '';
  await request(createAPBAPaymentOptions, (_error, response) => {
    statusCode = response.statusCode;
    paymentReference = JSON.parse(response.body).reference;
    logger.debug(`Response Body : ${JSON.stringify(response.body)}`);
    logger.debug(`The value of the response status code : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });

  logger.debug(JSON.stringify(saveCaseResponse));
  logger.info(`The Payment Reference : ${paymentReference}`);

  await rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber);

  logger.debug(saveCaseResponse);
  const paymentDetails = {
    ccdCaseNumber: `${ccdCaseNumber}`,
    paymentReference: `${paymentReference}`
  };
  logger.debug(`The Payment Details Object : ${JSON.stringify(paymentDetails)}`);
  return paymentDetails;
}

// eslint-disable-next-line no-unused-vars
async function createAPBAPayment() {
  logger.debug('Creating bulk a PBA Payment...');

  const creditAccountPaymentUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const creditAccountPaymentEndPoint = '/credit-account-payments';
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const testCmcSecret = testConfig.TestCMCSecret;
  const accountNumber = testConfig.TestAccountNumberActive;

  logger.info(`The value of the IDAM Token ${idamToken}`);
  logger.info(`The value of the cmc secret ${testCmcSecret}`);
  const serviceToken = await getServiceTokenForSecret(microservice, testCmcSecret);
  logger.info(`The value of the Service Token ${serviceToken}`);

  /* const numberTwo = 2;
  const randomNumber = numUtils.getRandomNumber(numberTwo);
  const ccdNumber = stringUtils.getTodayDateAndTimeInString() + randomNumber;*/

  // eslint-disable-next-line no-magic-numbers
  const ccdCaseNumber = numUtil.randomInt(1, 9999999999999999);
  logger.info(`The value of the CCD Case Number : ${ccdCaseNumber}`);
  logger.debug(`The Full Payment URL : ${creditAccountPaymentUrl}${creditAccountPaymentEndPoint}`);

  const saveBody = {
    account_number: `${accountNumber}`,
    amount: 215,
    case_reference: '1253656',
    ccd_case_number: `${ccdCaseNumber}`,
    currency: 'GBP',
    customer_reference: 'string',
    description: 'string',
    fees: [
      {
        calculated_amount: 215,
        code: 'FEE0226',
        fee_amount: 215,
        version: '3',
        volume: 1
      }
    ],
    organisation_name: 'string',
    service: 'PROBATE',
    site_id: 'AA08'
  };
  logger.debug(`The value of the Body ${JSON.stringify(saveBody)}`);
  const createAPBAPaymentOptions = {
    method: 'POST',
    uri: creditAccountPaymentUrl + creditAccountPaymentEndPoint,
    headers: {
      Authorization: `${idamToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  await request(createAPBAPaymentOptions, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The value of the response status code : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });

  const paymentReference = await getPBAPaymentByCCDCaseNumber(
    idamToken, serviceToken, ccdCaseNumber);
  await rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber);

  const paymentDetails = {
    ccdCaseNumber: `${ccdCaseNumber}`,
    paymentReference: `${paymentReference}`
  };
  console.log(`The Payment Details Object${JSON.stringify(paymentDetails)}`);
  return paymentDetails;
}

async function getPaymentGroupRef(serviceToken, ccdCaseNumberFormatted) {
  const ccdNumber = ccdCaseNumberFormatted;
  const saveBody = {
    'fees': [
      {
        'code': 'FEE0239',
        'version': '3',
        'calculated_amount': '250',
        'memo_line': 'RECEIPT OF FEES - Family appeal other',
        'natural_account_code': 4481102170,
        'ccd_case_number': `${ccdNumber}`,
        'jurisdiction1': 'family',
        'jurisdiction2': 'court of protection',
        'description': 'Appeal fee Article 5.',
        'volume': 1,
        'fee_amount': 250
      }
    ]
  };
  console.log("*** the body for payment group ref is -" + JSON.stringify(saveBody));
  logger.info('calling getPaymentGroupRef');
  const paymentGroupsUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const paymentGroupsEndPoint = `/payment-groups`;
  console.log('***payment group Ref uri - ' + paymentGroupsUrl + paymentGroupsEndPoint);
  const paymentGroupsResponse = await request({
    method: 'POST',
    uri: `${paymentGroupsUrl}${paymentGroupsEndPoint}`,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The response Status Code for paymentGroups : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });
  logger.debug();
  const responsePayload = JSON.parse(paymentGroupsResponse);
  console.log('****responsePayload for payment groups -' + responsePayload);
  const paymentGroupRefernce = responsePayload.payment_group_reference;
  console.log('****payment group ref -' + paymentGroupRefernce);
  return paymentGroupRefernce;
}

async function recordBouncebackFailure(serviceToken, ccdNumber, paymentRCRefernce) {

  const failureReference = 'FR-267-CC14-' + numUtil.getRandomNumber(9, 999999999);
  const saveBody = {
    'additional_reference': 'AR1234556',
    'amount': 100,
    'ccd_case_number': `${ccdNumber}`,
    'event_date_time': '2022-08-28T14:28:34.355Z',
    'failure_reference': `${failureReference}`,
    'payment_reference': `${paymentRCRefernce}`,
    'reason': 'RR001'
  };
  console.log("*** the body for bounceback cheque failure is -" + JSON.stringify(saveBody));
  logger.info('calling recordBouncebackFailure');
  const bouncedChequeUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const bouncedChequeEndPoint = `/payment-failures/bounced-cheque`;
  console.log('*** bounceback cheque failure uri - ' + bouncedChequeUrl + bouncedChequeEndPoint);
  const bounceChequeResponse = await request({
    method: 'POST',
    uri: `${bouncedChequeUrl}${bouncedChequeEndPoint}`,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The response Status Code for bounceCheque : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });
  return failureReference;
}

async function recordChargeBackFailure(serviceToken, ccdCaseNumber, paymentRef) {

  const failureReference = 'FR-367-CC14-' + numUtil.getRandomNumber(9, 999999999);
  const saveBody = {
    'additional_reference': 'AR1234556',
    'amount': 10,
    'ccd_case_number': `${ccdCaseNumber}`,
    'event_date_time': '2022-08-28T14:28:34.355Z',
    'has_amount_debited': 'Yes',
    'failure_reference': `${failureReference}`,
    'payment_reference': `${paymentRef}`,
    'reason': 'RR001'
  };
  console.log("*** the body for bounceback cheque failure is -" + JSON.stringify(saveBody));
  logger.info('calling recordChargeBackFailure');
  const chargeBackUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const chargeBackEndPoint = `/payment-failures/chargeback`;
  console.log('*** bounceback cheque failure uri - ' + chargeBackUrl + chargeBackEndPoint);
  const chargeBackResponse = await request({
    method: 'POST',
    uri: `${chargeBackUrl}${chargeBackEndPoint}`,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The response Status Code for chargeBack : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });
  return saveBody;
}

async function patchFailureReference(serviceToken, failureReference) {
  const saveBody = {
    'representment_date': '2022-07-22T11:03:02.544Z',
    'representment_status': 'Yes'
  };
  console.log("*** the body patchFailureReference is -" + JSON.stringify(saveBody));
  logger.info('calling patchFailureReference');
  const patchFailureRefUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const patchFailureRefEndPoint = `/payment-failures/${failureReference}`;
  console.log('*** patchFailureReference uri - ' + patchFailureRefUrl + patchFailureRefEndPoint);
  const patchFailureRefResponse = await request({
    method: 'PATCH',
    uri: `${patchFailureRefUrl}${patchFailureRefEndPoint}`,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The response Status Code for patchFailureReference : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });
}

async function patchFailureReferenceNo(serviceToken, failureReference) {
  const saveBody = {
    'representment_date': '2022-07-22T11:03:02.544Z',
    'representment_status': 'No'
  };
  console.log("*** the body patchFailureReference is -" + JSON.stringify(saveBody));
  logger.info('calling patchFailureReference');
  const patchFailureRefUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const patchFailureRefEndPoint = `/payment-failures/${failureReference}`;
  console.log('*** patchFailureReference uri - ' + patchFailureRefUrl + patchFailureRefEndPoint);
  const patchFailureRefResponse = await request({
    method: 'PATCH',
    uri: `${patchFailureRefUrl}${patchFailureRefEndPoint}`,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The response Status Code for patchFailureReference : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });
}


async function recordBulkScanPayments(serviceToken, ccdCaseNumberFormatted, paymentGroupRef) {
  const ccdNumber = ccdCaseNumberFormatted;
  const saveBody = {
    'amount': 250,
    'payment_method': 'CHEQUE',
    'ccd_case_number': `${ccdNumber}`,
    'payment_channel': {
      'description': '',
      'name': 'bulk scan'
    },
    'payment_status': {
      'description': 'bulk scan payment completed',
      'name': 'success'
    },
    'currency': 'GBP',
    'giro_slip_no': 1234,
    'banked_date': '2022-06-18T00:00:00.000+0000',
    'payer_name': 'CCD User1',
    'document_control_number': '{{payment_dcn}}',
    'requestor': 'PROBATE',
    'site_id': 'AA01'
  };
  logger.info('calling getPaymentGroupRef');
  const recordBulkScanPaymentUrl = `http://payment-api-${prNumber}.service.core-compute-${environment}.internal`;
  const recordBulkScanPaymentUrlEndPoint = `/payment-groups/${paymentGroupRef}/bulk-scan-payments`;
  console.log('***record bulk scan payments uri - ' + recordBulkScanPaymentUrl + recordBulkScanPaymentUrlEndPoint);
  const recordBulkScanPaymentResponse = await request({
    method: 'POST',
    uri: `${recordBulkScanPaymentUrl}${recordBulkScanPaymentUrlEndPoint}`,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  }, (_error, response) => {
    statusCode = response.statusCode;
    logger.info(`The response Status Code for recordBulkScanPayment : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
  });
  logger.debug();
  const responsePayload = JSON.parse(recordBulkScanPaymentResponse);
  console.log('****recordBulkScanPayment response -' + responsePayload);
  const paymentRCRefernce = responsePayload.reference;
  console.log('****paymentRCRefernce -' + paymentRCRefernce);
  return paymentRCRefernce;
}
async function bulkScanExelaRecord(serviceToken, amount, creditSlipNumber,
  bankedDate, dcnNumber, paymentMethod) {
  logger.info('Creating bulk Excela Case');
  const bulkApiUrl = `http://ccpay-bulkscanning-api-${env}.service.core-compute-${env}.internal`;
  const bulkendPoint = '/bulk-scan-payment';

  const saveBody = {
    amount,
    bank_giro_credit_slip_number: `${creditSlipNumber}`,
    banked_date: `${bankedDate}`,
    currency: 'GBP',
    document_control_number: `${dcnNumber}`,
    method: `${paymentMethod}`
  };

  const saveCaseOptions = {
    method: 'POST',
    uri: bulkApiUrl + bulkendPoint,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  const saveCaseResponse = await request(saveCaseOptions, (_error, response) => {
    statusCode = response.statusCode;
  }
  ).catch(error => {
    logger.log(error);
  });

  logger.info(saveCaseResponse);
  return statusCode;
}

async function bulkScanRecord(serviceToken, ccdNumber, dcnNumber, siteId, exception) {
  logger.info('Creating bulk Scan Case');

  const bulkApiUrl = `http://ccpay-bulkscanning-api-${env}.service.core-compute-${env}.internal`;
  const bulkendPoint = '/bulk-scan-payments';

  const saveBody = {
    ccd_case_number: `${ccdNumber}`,
    document_control_numbers: [`${dcnNumber}`],
    is_exception_record: exception,
    site_id: `${siteId}`
  };

  logger.debug(`What is this CCDCaseNumber ${saveBody.ccd_case_number}`);

  const saveCaseOptions = {
    method: 'POST',
    uri: bulkApiUrl + bulkendPoint,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  const saveCaseResponse = await request(saveCaseOptions
    , (_error, response) => {
      statusCode = response.statusCode;
    }
  ).catch(error => {
    logger.log(error);
  });

  logger.info(saveCaseResponse);
  return statusCode;
}

async function bulkScanCcdWithException(serviceToken, ccdNumber, exceptionCCDNumber) {
  logger.info('Creating bulk Scan Case linked to Exception CCD');

  const bulkApiUrl = `http://ccpay-bulkscanning-api-${env}.service.core-compute-${env}.internal`;
  const bulkendPoint = '/bulk-scan-payments';
  const query = `?exception_reference=${exceptionCCDNumber}`;

  logger.debug(`This is the Actual Case Number : ${ccdNumber}`);
  const saveBody = { ccd_case_number: `${ccdNumber}` };

  const saveCaseOptions = {
    method: 'PUT',
    uri: bulkApiUrl + bulkendPoint + query,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  const saveCaseResponse = await request(saveCaseOptions
    , (_error, response) => {
      statusCode = response.statusCode;
    }
  ).catch(error => {
    logger.log(error);
  });

  logger.info(saveCaseResponse);

  return statusCode;
}

async function bulkScanCcdLinkedException(exceptionCcdNumber, serviceToken) {
  // const numberTwo = 2;
  const successResponse = 200;

  const ccdNumber = await createACCDCaseForDivorce();
  logger.debug(`The value of Actual CCDCaseNumber : ${ccdNumber}`);
  const responseCode = await bulkScanCcdWithException(serviceToken, ccdNumber,
    exceptionCcdNumber).catch(error => {
      logger.log(error);
    });
  if (responseCode === successResponse) logger.info('CCD link to exception created');
  else logger.info('CCD link to exception NOT created');

  return ccdNumber;
}

async function createBulkScanRecords(siteId, amount, paymentMethod, exception, linkedCcd = false) {
  const microservice = 'api_gw';
  // const numberTwo = 2;
  const numberSeven = 7;
  const creditSlipNumber = '312312';
  const serviceToken = await getServiceToken(microservice);
  const bankedDate = stringUtil.getTodayDateInYYYYMMDD();
  let dcnNumber = 0;
  // const ccdNumber = 0;
  const successResponse = 201;

  const randomNumber = numUtil.getRandomNumber(numberSeven);
  dcnNumber = stringUtil.getTodayDateAndTimeInString() + randomNumber;
  const responseDcnCode = await bulkScanExelaRecord(serviceToken, amount,
    creditSlipNumber, bankedDate, dcnNumber, paymentMethod).catch(error => {
      logger.log(error);
    });
  console.log('***responseDcnCode - ' + responseDcnCode);

  if (responseDcnCode === successResponse) logger.info('DCN Created');
  else logger.info('CCD Case NOT Created');

  // ccdNumber = stringUtil.getTodayDateAndTimeInString() + numUtil.getRandomNumber(numberTwo);
  const ccdNumberExceptionRecord = await createACCDCaseForDivorce();
  console.log('***ccdNumberExceptionRecord - ' + ccdNumberExceptionRecord);
  logger.debug(`ccdNumberExceptionRecord : ${ccdNumberExceptionRecord}`);
  const responseCcdCode = await bulkScanRecord(serviceToken, ccdNumberExceptionRecord, dcnNumber,
    siteId, exception).catch(error => {
      logger.log(error);
    });

  console.log('***responseCcdCode - ' + responseCcdCode);

  if (responseCcdCode === successResponse) logger.info('CCD Case Created');
  else logger.info('CCD Case NOT Created');

  if (linkedCcd) {
    const ccdNumberLinked = await bulkScanCcdLinkedException(ccdNumberExceptionRecord,
      serviceToken);
    console.log('***ccdNumberLinked - ' + ccdNumberLinked);
    return [dcnNumber, ccdNumberLinked, ccdNumberExceptionRecord];
  }
  return [dcnNumber, ccdNumberExceptionRecord];
}

async function bulkScanNormalCcd(siteId, amount, paymentMethod) {
  const bulkDcnCcd = await createBulkScanRecords(siteId, amount, paymentMethod, false);
  return bulkDcnCcd;
}

async function getPaymentReferenceUsingCCDCaseNumber(ccdCaseNumber) {
  const microservice = 'api_gw';
  const serviceToken = await getServiceToken(microservice);
  console.log('****service token for getPaymentReferenceUsingCCDCaseNumber - ' + serviceToken);
  const paymentGroupRef = await getPaymentGroupRef(serviceToken, ccdCaseNumber);
  const paymentRCRef = await recordBulkScanPayments(serviceToken, ccdCaseNumber, paymentGroupRef);
  const failurereference = await recordBouncebackFailure(serviceToken, ccdCaseNumber, paymentRCRef);
  await patchFailureReference(serviceToken, failurereference);
  return failurereference;

}

async function getPaymentDetailsPBA(ccdCaseNumber, paymentRef) {
  const microservice = 'api_gw';
  const serviceToken = await getServiceToken(microservice);
  console.log('****service token for getPaymentReferenceUsingCCDCaseNumber - ' + serviceToken);
  const failurereference = await recordChargeBackFailure(serviceToken, ccdCaseNumber, paymentRef);
  await patchFailureReferenceNo(serviceToken, failurereference.failure_reference);
  return failurereference;

}

async function bulkScanExceptionCcd(siteId, amount, paymentMethod) {
  const bulkDcnExceptionCcd = await createBulkScanRecords(siteId, amount, paymentMethod, true);
  return bulkDcnExceptionCcd;
}

async function bulkScanCcdLinkedToException(siteId, amount, paymentMethod) {
  const bulkDcnExpCcd = await createBulkScanRecords(siteId, amount, paymentMethod, true, true);
  return bulkDcnExpCcd;
}


module.exports = {
  bulkScanNormalCcd, bulkScanExceptionCcd, bulkScanCcdLinkedToException,
  toggleOffCaseValidation, toggleOnCaseValidation, createAPBAPayment, createAFailedPBAPayment,
  createACCDCaseForProbate, createACCDCaseForDivorce, getPaymentReferenceUsingCCDCaseNumber, getPaymentDetailsPBA
};
