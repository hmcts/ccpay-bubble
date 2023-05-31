/* eslint-disable no-alert, no-console */
const {Logger} = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');

// eslint-disable max-len

const request = requestModule.defaults();

const stringUtil = require('./string_utils.js');
const numUtil = require('./number_utils');
const testConfig = require('../tests/config/CCPBConfig.js');

const logger = Logger.getLogger('helpers/utils.js');

const paymentBaseUrl = testConfig.TestPaymentApiUrl;
const refundsApiUrl = testConfig.TestRefundsApiUrl;
const bulkScanApiUrl = testConfig.TestBulkScanApiUrl;
const idamApiUrl = testConfig.TestIdamApiUrl;
const rpeServiceAuthApiUrl = testConfig.TestS2SRpeServiceAuthApiUrl;
const ccdDataStoreApiUrl = testConfig.TestCcdDataStoreApiUrl;
const s2sAuthPath = '/testing-support/lease';
const MAX_NOTIFY_PAGES = 3;  //max notify results pages to search
const MAX_RETRIES = 5;  //max retries on each notify results page

let notifyClient;
const NotifyClient = require('notifications-node-client').NotifyClient;
if (testConfig.NotifyEmailApiKey) {
  notifyClient = new NotifyClient(testConfig.NotifyEmailApiKey);
  console.log("Notify API starts with " + testConfig.NotifyEmailApiKey.substring(1, 25));
} else {
  console.log("Notify client API key is not defined");
}

async function getEmailFromNotifyWithMaxRetries(searchEmail) {
  let emailResponse = await getEmailFromNotify(searchEmail);
  let i = 1;
  while (i < MAX_RETRIES && !emailResponse) {
    console.log(`Retrying email in notify for ${i} time`);
    await sleep(1000);
    emailResponse = await getEmailFromNotify(searchEmail);
    i++;
  }
  if (!emailResponse) {
    throw new Error('Email not found in Notify for ' + searchEmail);
  }
  return emailResponse;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getEmailFromNotify(searchEmail) {
  let notificationsResponse = await notifyClient.getNotifications("email", null);
  let emailResponse = searchForEmailInNotifyResults(notificationsResponse.body.notifications, searchEmail);
  let i = 1;
  while (i < MAX_NOTIFY_PAGES && !emailResponse && notificationsResponse.body.links.next) {
    console.log("Searching notify emails, next page " + notificationsResponse.body.links.next);
    let nextPageLink = notificationsResponse.body.links.next;
    let nextPageLinkUrl = new URL(nextPageLink);
    let olderThanId = nextPageLinkUrl.searchParams.get("older_than");
    notificationsResponse = await notifyClient.getNotifications("email", null, null, olderThanId);
    emailResponse = searchForEmailInNotifyResults(notificationsResponse.body.notifications, searchEmail);
    i++;
  }
  return emailResponse;
}

function searchForEmailInNotifyResults(notifications, searchEmail) {
  const result = notifications.find(currentItem => {
    // NOTE: NEVER LOG EMAIL ADDRESS FROM THE PRODUCTION QUEUE
    if (currentItem.email_address === searchEmail) {
      return true;
    }
    return false;
  });
  return result;
}

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

  const idamTokenPath = '/o/token';
  logger.debug(`The value of the IDAM URL : ${idamApiUrl}${idamTokenPath}`);

  const idamTokenResponse = await request({
    method: 'POST',
    uri: `${idamApiUrl}${idamTokenPath}`,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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

  const idamTokenPath = '/o/token';
  logger.debug(`The value of the IDAM URL : ${idamApiUrl}${idamTokenPath}`);
  console.log('****uri - ' + idamApiUrl + idamTokenPath);

  const idamTokenResponse = await request({
      method: 'POST',
      uri: `${idamApiUrl}${idamTokenPath}`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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

  // eslint-disable-next-line global-require
  const oneTimePassword = require('otp')({secret: serviceSecret}).totp();

  logger.info(`Getting The one time password${oneTimePassword}`);
  logger.info(`Getting The one time password :${rpeServiceAuthApiUrl}`);
  const serviceToken = await request({
    method: 'POST',
    uri: rpeServiceAuthApiUrl + s2sAuthPath,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({microservice: service})
  });
  logger.debug(serviceToken);
  logger.log(serviceToken);
  return serviceToken;
}

// eslint-disable-next-line no-unused-vars
async function getServiceToken(_service) {
  console.log('Getting Service Token');

  // eslint-disable-next-line no-unused-vars
  // const oneTimePassword = require('otp')({ secret: serviceSecret }).totp();

  const serviceToken = await request({
    method: 'POST',
    uri: rpeServiceAuthApiUrl + s2sAuthPath,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({microservice: 'ccpay_bubble'})
  });
  console.log(serviceToken + "Servive token is    ");
  logger.debug(serviceToken);
  return serviceToken;
}

async function getUserID(idamToken) {
  // const idamToken = await getIDAMToken();
  const idamDetailsPath = '/details';

  const idamDetailsResponse = await request({
    method: 'GET',
    uri: `${idamApiUrl}${idamDetailsPath}`,
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
  const createTokenCCDEventRelativeBaseUrl = `/caseworkers/${userID}/jurisdictions/PROBATE/case-types/GrantOfRepresentation/event-triggers/createDraft/token`;

  const createTokenResponse = await request({
    method: 'GET',
    uri: `${ccdDataStoreApiUrl}${createTokenCCDEventRelativeBaseUrl}`,
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
  const createTokenCCDEventRelativeBaseUrl = `/caseworkers/${userID}/jurisdictions/DIVORCE/case-types/DIVORCE/event-triggers/createCase/token`;

  const createTokenResponse = await request({
    method: 'GET',
    uri: `${ccdDataStoreApiUrl}${createTokenCCDEventRelativeBaseUrl}`,
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

  const disablePath = `/api/ff4j/store/features/caseref-validation/${flag}`;
  // eslint-disable-next-line global-require
  const saveCaseResponse = await request({
      method: 'POST',
      uri: paymentBaseUrl + disablePath,
      headers: {'Content-Type': 'application/json'}
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
      {id: 'createDraft', summary: '', description: ''},
    event_token: `${createToken}`,
    ignore_warning: false,
    draft_id: null
  };

  const probateCCDCreateCaseRelativeBaseUrl = '/case-types/GrantOfRepresentation/cases';

  logger.info(`The value of the Body ${JSON.stringify(createCCDCaseBody)}`);
  const probateCaseCreated = {
    method: 'POST',
    uri: ccdDataStoreApiUrl + probateCCDCreateCaseRelativeBaseUrl,
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
    data: {LanguagePreferenceWelsh: 'No'},
    event: {
      id: 'createCase',
      summary: 'TESTING',
      description: 'Testing'
    },
    event_token: `${createToken}`,
    ignore_warning: false,
    draft_id: null
  };

  const divorceCCDCreateCaseRelativeBaseUrl = '/case-types/DIVORCE/cases';

  logger.debug(`The value of the Body ${JSON.stringify(createCCDDivorceCaseBody)}`);
  const divorceCaseCreated = {
    method: 'POST',
    uri: ccdDataStoreApiUrl + divorceCCDCreateCaseRelativeBaseUrl,
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
  ccdCaseNumber) {
  const lag_time = 20;
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const testCmcSecret = testConfig.TestCMCSecret;
  const accountNumber = testConfig.TestAccountNumberInActive;
  logger.debug(`The value of the inactive account number : ${accountNumber}`);
  console.log(`The value of the IDAM Token ${idamToken}`);
  logger.debug(`The value of the cmc secret ${testCmcSecret}`);
  const serviceToken = await getServiceTokenForSecret(microservice, testCmcSecret);
  console.log(`The value of the Service Token ${serviceToken}`);
  const rollbackPaymentDateByCCDNumberEndPoint = `/payments/ccd_case_reference/${ccdCaseNumber}/lag_time/${lag_time}`;

  console.log(`The Full URL : ${paymentBaseUrl}${rollbackPaymentDateByCCDNumberEndPoint}`);

  const getPBAPaymentByCCDCaseNumberOptions = {
    method: 'PATCH',
    uri: paymentBaseUrl + rollbackPaymentDateByCCDNumberEndPoint,
    headers: {
      Authorization: `Bearer ${idamToken}`,
      ServiceAuthorization: `${serviceToken}`,
      'Content-Type': 'application/json'
    }
  };
  await request(getPBAPaymentByCCDCaseNumberOptions,
    (_error, response) => {
      // console.log(response);
      console.log(`${statusCode}The value of the status code`);
      console.log(`${response}The value of the response`);
    }).catch(error => {
    logger.error(error);
  });
}

async function getPBAPaymentByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber) {
  logger.debug('Inside the getPBAPaymentByCCDCaseNumber() method');
  const getPaymentByCCDNumberEndPoint = `/reconciliation-payments?ccd_case_number=${ccdCaseNumber}`;
  logger.debug(`The Full URL : ${paymentBaseUrl}${getPaymentByCCDNumberEndPoint}`);

  const getPBAPaymentByCCDCaseNumberOptions = {
    method: 'GET',
    uri: paymentBaseUrl + getPaymentByCCDNumberEndPoint,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    }
  };

  const paymentLookUpResponseString = await request(getPBAPaymentByCCDCaseNumberOptions,
    (_error, response) => {
      logger.info(response);
      logger.info(`${statusCode}The value of the status code`);
      // logger.info(`${response}The value of the response`);
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
  logger.debug(`The Full Payment URL : ${paymentBaseUrl}${creditAccountPaymentEndPoint}`);

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
    uri: paymentBaseUrl + creditAccountPaymentEndPoint,
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
async function createAServiceRequest(hmctsorgid, calculatedAmount, feeCode, version, volume) {
  const createServiceRequestEndPoint = '/service-request';
  const idamToken = await getIDAMToken();
  const testPaybubbleS2SSecret = testConfig.TestPaybubbleS2SSecret;
  const microservice = 'ccpay_bubble';
  const serviceToken = await getServiceTokenForSecret(microservice, testPaybubbleS2SSecret);

  // eslint-disable-next-line no-magic-numbers
  const ccdCaseNumber = numUtil.randomInt(1, 9999999999999999);
  console.log(`The value of the CCD Case Number : ${ccdCaseNumber}`);
  console.log(`The Full Payment URL : ${paymentBaseUrl}${createServiceRequestEndPoint}`);
  console.log(`The value of the IDAM Token ${idamToken}`);
  console.log(`The value of the Service Token ${serviceToken}`);

  const saveBody = {

    call_back_url: 'http://callback.hmcts.net',
    case_payment_request: {
      action: 'Action 1',
      responsible_party: 'Party 1'
    },
    case_reference: '123245677',
    ccd_case_number: `${ccdCaseNumber}`,
    fees: [
      {
        calculated_amount: calculatedAmount,
        code: `${feeCode}`,
        version: `${version}`,
        volume
      }
    ],
    hmcts_org_id: `${hmctsorgid}`
  };

  const createAServiceRequestOptions = {
    method: 'POST',
    uri: paymentBaseUrl + createServiceRequestEndPoint,
    headers: {
      Authorization: `${idamToken}`,
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  };

  const cSRRS = await request(createAServiceRequestOptions, (_error, response) => {
    statusCode = response.statusCode;
    // console.log(`The value of the response status code : ${statusCode}`);
  }).catch(error => {
    logger.error(error);
    console.log(error);
  });

  const createServiceRequestLookupObject = JSON.parse(cSRRS);
  const serviceRequestReference = createServiceRequestLookupObject.service_request_reference;
  console.log(`The value of the service Request Reference ${serviceRequestReference}`);
  const serviceRequestResponseDetails = {
    ccdCaseNumber: `${ccdCaseNumber}`,
    serviceRequestReference: `${serviceRequestReference}`
  };
  // console.log(`The Payment Details Object${JSON.stringify(paymentDetails)}`);
  return serviceRequestResponseDetails;
}

// eslint-disable-next-line no-unused-vars
async function createAPBAPayment(amount, feeCode, version, volume) {
  logger.debug('Creating bulk a PBA Payment...');

  const creditAccountPaymentEndPoint = '/credit-account-payments';
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const testCmcSecret = testConfig.TestCMCSecret;
  const accountNumber = testConfig.TestAccountNumberActive;

  logger.info(`The value of the IDAM Token ${idamToken}`);
  logger.info(`The value of the cmc secret ${testCmcSecret}`);
  const serviceToken = await getServiceTokenForSecret(microservice, testCmcSecret);
  logger.info(`The value of the Service Token ${serviceToken}`);

  // eslint-disable-next-line no-magic-numbers
  const ccdCaseNumber = await createACCDCaseForProbate();
  logger.info(`The value of the CCD Case Number : ${ccdCaseNumber}`);
  logger.debug(`The Full Payment URL : ${paymentBaseUrl}${creditAccountPaymentEndPoint}`);
  const saveBody = {
    account_number: `${accountNumber}`,
    amount: amount,
    case_reference: '1253656',
    ccd_case_number: `${ccdCaseNumber}`,
    currency: 'GBP',
    customer_reference: 'string',
    description: 'string',
    fees: [
      {
        calculated_amount: amount,
        code: `${feeCode}`,
        fee_amount: amount,
        version: `${version}`,
        volume: volume
      }
    ],
    organisation_name: 'string',
    service: 'PROBATE',
    site_id: 'ABA6'
  };
  console.log(`The value of the Body ${JSON.stringify(saveBody)}`);
  const createAPBAPaymentOptions = {
    method: 'POST',
    uri: paymentBaseUrl + creditAccountPaymentEndPoint,
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
  const paymentGroupsEndPoint = `/payment-groups`;
  console.log('***payment group Ref uri - ' + paymentBaseUrl + paymentGroupsEndPoint);
  const paymentGroupsResponse = await request({
    method: 'POST',
    uri: `${paymentBaseUrl}${paymentGroupsEndPoint}`,
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
  console.log('*date time is' + stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ())

  const failureReference = 'FR-267-CC14-' + numUtil.getRandomNumber(9, 999999999);
  const saveBody = {
    'additional_reference': 'AR1234556',
    'amount': 250,
    'ccd_case_number': `${ccdNumber}`,
    'event_date_time': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'failure_reference': `${failureReference}`,
    'payment_reference': `${paymentRCRefernce}`,
    'reason': 'RR001'
  };
  console.log("*** the body for bounceback cheque failure is -" + JSON.stringify(saveBody));
  logger.info('calling recordBouncebackFailure');
  const bouncedChequeEndPoint = `/payment-failures/bounced-cheque`;
  console.log('*** bounceback cheque failure uri - ' + paymentBaseUrl + bouncedChequeEndPoint);
  const bounceChequeResponse = await request({
    method: 'POST',
    uri: `${paymentBaseUrl}${bouncedChequeEndPoint}`,
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
    'amount': 100,
    'ccd_case_number': `${ccdCaseNumber}`,
    'event_date_time': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'has_amount_debited': 'Yes',
    'failure_reference': `${failureReference}`,
    'payment_reference': `${paymentRef}`,
    'reason': 'RR001'
  };
  console.log("*** the body for bounceback cheque failure is -" + JSON.stringify(saveBody));
  logger.info('calling recordChargeBackFailure');
  const chargeBackEndPoint = `/payment-failures/chargeback`;
  console.log('*** bounceback cheque failure uri - ' + paymentBaseUrl + chargeBackEndPoint);
  const chargeBackResponse = await request({
    method: 'POST',
    uri: `${paymentBaseUrl}${chargeBackEndPoint}`,
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

async function recordChargeBackFailureEvent(serviceToken, ccdCaseNumber, paymentRef) {

  const failureReference = 'FR-367-CC14-' + numUtil.getRandomNumber(9, 999999999);
  const saveBody = {
    'additional_reference': 'AR1234556',
    'amount': 273,
    'ccd_case_number': `${ccdCaseNumber}`,
    'event_date_time': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'has_amount_debited': 'Yes',
    'failure_reference': `${failureReference}`,
    'payment_reference': `${paymentRef}`,
    'reason': 'RR001'
  };
  console.log("*** the body for bounceback cheque failure is -" + JSON.stringify(saveBody));
  logger.info('calling recordChargeBackFailure');
  const chargeBackEndPoint = `/payment-failures/chargeback`;
  console.log('*** bounceback cheque failure uri - ' + paymentBaseUrl + chargeBackEndPoint);
  const chargeBackResponse = await request({
    method: 'POST',
    uri: `${paymentBaseUrl}${chargeBackEndPoint}`,
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
    'representment_date': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'representment_status': 'Yes'
  };
  console.log("*** the body patchFailureReference is -" + JSON.stringify(saveBody));
  logger.info('calling patchFailureReference');
  const patchFailureRefEndPoint = `/payment-failures/${failureReference}`;
  console.log('*** patchFailureReference uri - ' + paymentBaseUrl + patchFailureRefEndPoint);
  const patchFailureRefResponse = await request({
    method: 'PATCH',
    uri: `${paymentBaseUrl}${patchFailureRefEndPoint}`,
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
    'representment_date': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'representment_status': 'No'
  };
  console.log("*** the body patchFailureReference is -" + JSON.stringify(saveBody));
  logger.info('calling patchFailureReference');
  const patchFailureRefEndPoint = `/payment-failures/${failureReference}`;
  console.log('*** patchFailureReference uri - ' + paymentBaseUrl + patchFailureRefEndPoint);
  const patchFailureRefResponse = await request({
    method: 'PATCH',
    uri: `${paymentBaseUrl}${patchFailureRefEndPoint}`,
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


async function recordBulkScanPayments(serviceToken, ccdCaseNumberFormatted, paymentGroupRef, dcnNumber) {
  const ccdNumber = ccdCaseNumberFormatted;
  const document_control_number = dcnNumber;
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
    'document_control_number': `${document_control_number}`,
    'requestor': 'PROBATE',
    'site_id': 'AA01'
  };
  logger.info('calling getPaymentGroupRef');
  const recordBulkScanPaymentUrlEndPoint = `/payment-groups/${paymentGroupRef}/bulk-scan-payments`;
  console.log('***record bulk scan payments uri - ' + paymentBaseUrl + recordBulkScanPaymentUrlEndPoint);
  const recordBulkScanPaymentResponse = await request({
    method: 'POST',
    uri: `${paymentBaseUrl}${recordBulkScanPaymentUrlEndPoint}`,
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
  const bulkScanPaymentEndPoint = '/bulk-scan-payment';
  console.log('**** bulk scan payments uri - ' + bulkScanApiUrl + bulkScanPaymentEndPoint);


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
    uri: bulkScanApiUrl + bulkScanPaymentEndPoint,
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

  const bulkScanPaymentsEndPoint = '/bulk-scan-payments';
  console.log('**** bulk scan payments uri - ' + bulkScanApiUrl + bulkScanPaymentsEndPoint);


  const saveBody = {
    ccd_case_number: `${ccdNumber}`,
    document_control_numbers: [`${dcnNumber}`],
    is_exception_record: exception,
    site_id: `${siteId}`
  };

  logger.debug(`What is this CCDCaseNumber ${saveBody.ccd_case_number}`);

  const saveCaseOptions = {
    method: 'POST',
    uri: bulkScanApiUrl + bulkScanPaymentsEndPoint,
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

  const bulkScanPaymentsEndPoint = '/bulk-scan-payments';
  const query = `?exception_reference=${exceptionCCDNumber}`;

  logger.debug(`This is the Actual Case Number : ${ccdNumber}`);
  const saveBody = {ccd_case_number: `${ccdNumber}`};

  const saveCaseOptions = {
    method: 'PUT',
    uri: bulkScanApiUrl + bulkScanPaymentsEndPoint + query,
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

  const ccdNumber = await createACCDCaseForProbate();
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
  const numberSeven = 7;
  const creditSlipNumber = '312312';
  const serviceToken = await getServiceToken(microservice);
  const bankedDate = stringUtil.getTodayDateInYYYYMMDD();
  const successResponse = 201;

  const randomNumber = numUtil.getRandomNumber(numberSeven);
  let dcnNumber = stringUtil.getTodayDateAndTimeInString() + randomNumber;
  const responseDcnCode = await bulkScanExelaRecord(serviceToken, amount,
    creditSlipNumber, bankedDate, dcnNumber, paymentMethod).catch(error => {
    logger.log(error);
  });
  console.log('***responseDcnCode - ' + responseDcnCode);

  if (responseDcnCode === successResponse) logger.info('DCN Created');
  else logger.info('CCD Case NOT Created');

  const ccdNumberExceptionRecord = await createACCDCaseForProbate();
  console.log('***ccdNumberExceptionRecord - ' + ccdNumberExceptionRecord);
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

async function getPaymentReferenceUsingCCDCaseNumber(ccdCaseNumber, dcnNumber) {
  const microservice = 'api_gw';
  const serviceToken = await getServiceToken(microservice);
  console.log('****service token for getPaymentReferenceUsingCCDCaseNumber - ' + serviceToken);
  const paymentGroupRef = await getPaymentGroupRef(serviceToken, ccdCaseNumber);
  const paymentRCRef = await recordBulkScanPayments(serviceToken, ccdCaseNumber, paymentGroupRef, dcnNumber);
  const failurereference = await recordBouncebackFailure(serviceToken, ccdCaseNumber, paymentRCRef);
  await patchFailureReference(serviceToken, failurereference);
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  return [paymentRCRef, failurereference, todayDateInDDMMMYYYY];

}

async function getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber) {
  const microservice = 'api_gw';
  const serviceToken = await getServiceToken(microservice);
  console.log('****service token for getPaymentReferenceUsingCCDCaseNumberForOverPayments - ' + serviceToken);
  const paymentGroupRef = await getPaymentGroupRef(serviceToken, ccdCaseNumber);
  const paymentRCRef = await recordBulkScanPayments(serviceToken, ccdCaseNumber, paymentGroupRef);
  return paymentGroupRef;

}

async function getPaymentDetailsPBA(ccdCaseNumber, paymentRef) {
  const microservice = 'api_gw';
  const serviceToken = await getServiceToken(microservice);
  console.log('****service token for getPaymentReferenceUsingCCDCaseNumber - ' + serviceToken);
  const failurereference = await recordChargeBackFailure(serviceToken, ccdCaseNumber, paymentRef);
  await patchFailureReferenceNo(serviceToken, failurereference.failure_reference);
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  return [paymentRef, failurereference.failure_reference, todayDateInDDMMMYYYY];

}

async function getPaymentDetailsPBAForChargebackEvent(ccdCaseNumber, paymentRef) {
  const microservice = 'api_gw';
  const serviceToken = await getServiceToken(microservice);
  console.log('****service token for getPaymentReferenceUsingCCDCaseNumber - ' + serviceToken);
  const failurereference = await recordChargeBackFailureEvent(serviceToken, ccdCaseNumber, paymentRef);
  await patchFailureReferenceNo(serviceToken, failurereference.failure_reference);
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  return [paymentRef, failurereference.failure_reference, todayDateInDDMMMYYYY];

}

async function getPaymentDetailsPBAForServiceStatus(ccdCaseNumber, paymentRef) {
  const microservice = 'api_gw';
  const serviceToken = await getServiceToken(microservice);
  console.log('****service token for getPaymentReferenceUsingCCDCaseNumber - ' + serviceToken);
  const failurereference = await recordChargeBackFailure(serviceToken, ccdCaseNumber, paymentRef);
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

// eslint-disable-next-line no-unused-vars
async function updateRefundStatusByRefundReference(refundReference, reason, status) {
  const microService = 'ccpay_bubble';
  const testCmcSecret = testConfig.TestCMCSecret;

  const serviceToken = await getServiceTokenForSecret(microService, testCmcSecret);
  logger.info(`The value of the Service Token ${serviceToken}`);

  const saveBody = {
    reason: `${reason}`,
    status: `${status}`,
  };
  console.log(`The value of the Body ${JSON.stringify(saveBody)}`);

  await request({
    method: 'PATCH',
    uri: refundsApiUrl + `/refund/${refundReference}`,
    headers: {
      ServiceAuthorization: `${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody)
  }, (_error, response) => {
    console.log(`The response Status Code for refund update : ${response.statusCode}`);
  }).catch(error => {
    console.log(error);
  });
}


module.exports = {
  bulkScanNormalCcd,
  bulkScanExceptionCcd,
  bulkScanCcdLinkedToException,
  toggleOffCaseValidation,
  toggleOnCaseValidation,
  createAPBAPayment,
  createAFailedPBAPayment,
  createACCDCaseForProbate,
  createACCDCaseForDivorce,
  getPaymentReferenceUsingCCDCaseNumber,
  getPaymentDetailsPBA,
  getPaymentReferenceUsingCCDCaseNumberForOverPayments,
  rollbackPyamentDateForPBAPaymentDateByCCDCaseNumber,
  getPaymentDetailsPBAForServiceStatus,
  getPaymentDetailsPBAForChargebackEvent,
  getEmailFromNotifyWithMaxRetries,
  createAServiceRequest,
  updateRefundStatusByRefundReference
};
