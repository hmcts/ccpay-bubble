/* eslint-disable no-alert, no-console */
const {Logger} = require('@hmcts/nodejs-logging');
const fetch = require('node-fetch');

// eslint-disable max-len

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

async function makeRequest(url, method = 'GET', headers = {}, body = null) {
  const resp = await fetch(url, {
    method,
    headers,
    body
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Fetch failed ${resp.status}: ${text}`);
  }
  return resp;
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

  const idamTokenPath = '/o/token';
  const url = `${idamApiUrl}${idamTokenPath}`;
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  const body = `grant_type=${grantType}&client_id=${idamClientID}&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&username=${username}&password=${password}&scope=${scope}`;
  const resp = await makeRequest(url, 'POST', headers, body);

  const idamJson = await resp.json();
  return idamJson.access_token;
}

async function getIDAMTokenForRefundApprover() {
  const username = testConfig.TestRefundsApproverUserName;
  const password = testConfig.TestRefundsApproverPassword;
  const idamClientID = testConfig.TestClientID;
  const idamClientSecret = testConfig.TestClientSecret;
  const redirectUri = testConfig.TestRedirectURI;
  const scope = 'openid profile roles';
  const grantType = 'password';

  const idamTokenPath = '/o/token';
  const url = `${idamApiUrl}${idamTokenPath}`;
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  const body = `grant_type=${grantType}&client_id=${idamClientID}&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&username=${username}&password=${password}&scope=${scope}`;
  const resp = await makeRequest(url, 'POST', headers, body);

  const idamJson = await resp.json();
  return idamJson.access_token;
}

async function getIDAMTokenForDivorceUser() {
  const username = testConfig.TestDivorceCaseWorkerUserName;
  const password = testConfig.TestDivorceCaseWorkerPassword;

  const idamClientID = testConfig.TestDivorceClientID;
  const idamClientSecret = testConfig.TestDivorceClientSecret;
  const redirectUri = testConfig.TestDivorceClientRedirectURI;
  const scope = 'openid profile roles';
  const grantType = 'password';

  const idamTokenPath = '/o/token';
  const url = `${idamApiUrl}${idamTokenPath}`;
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  const body = `grant_type=${grantType}&client_id=${idamClientID}&client_secret=${idamClientSecret}&redirect_uri=${redirectUri}&username=${username}&password=${password}&scope=${scope}`;
  const resp = await makeRequest(url, 'POST', headers, body);

  const idamJson = await resp.json();
  return idamJson.access_token;
}

async function getServiceToken(service = 'ccpay_bubble') {
  const headers = {'Content-Type': 'application/json'};
  const payload = JSON.stringify({microservice: service});
  const resp = await makeRequest(rpeServiceAuthApiUrl + s2sAuthPath, 'POST', headers, payload);
  const serviceToken = await resp.text();
  return serviceToken;
}

async function getUserID(idamToken) {
  // const idamToken = await getIDAMToken();

  const url = `${idamApiUrl}/details`;
  const headers = {
    Authorization: `Bearer ${idamToken}`,
    'Content-Type': 'application/json'
  }
  const resp = await makeRequest(url, 'GET', headers);
  console.log(resp);
  const responsePayload = await resp.json();
  const idValue = responsePayload.id;
  return idValue;
}

async function getCREATEEventForProbate() {
  const idamToken = await getIDAMToken();
  const userID = await getUserID(idamToken);
  const serviceAuthorizationToken = await getServiceToken();
  const createTokenCCDEventRelativeBaseUrl = `/caseworkers/${userID}/jurisdictions/PROBATE/case-types/GrantOfRepresentation/event-triggers/createDraft/token`;

  const url = `${ccdDataStoreApiUrl}${createTokenCCDEventRelativeBaseUrl}`;
  const headers = {
    Authorization: `Bearer ${idamToken}`,
    ServiceAuthorization: `${serviceAuthorizationToken}`,
    'Content-Type': 'application/json'
  };
  const resp = await makeRequest(url, 'GET', headers);

  console.log(resp);
  const responsePayload = await resp.json();
  const createTokenValue = responsePayload.token;
  return createTokenValue;
}

async function getCREATEEventForDivorce() {
  const idamTokenForDivorce = await getIDAMTokenForDivorceUser();
  const userID = await getUserID(idamTokenForDivorce);
  const serviceAuthorizationToken = await getServiceToken();
  const createTokenCCDEventRelativeBaseUrl = `/caseworkers/${userID}/jurisdictions/DIVORCE/case-types/DIVORCE/event-triggers/createCase/token`;

  const url = `${ccdDataStoreApiUrl}${createTokenCCDEventRelativeBaseUrl}`
  const headers = {
    Authorization: `Bearer ${idamTokenForDivorce}`,
    ServiceAuthorization: `${serviceAuthorizationToken}`,
    'Content-Type': 'application/json'
  }
  const resp = await makeRequest(url, 'GET', headers);

  console.log(`Response : ${resp}`);
  const responsePayload = await resp.json();
  const createTokenValue = responsePayload.token;
  return createTokenValue;
}

async function CaseValidation(flag) {
  console.log(`${flag} case validation`);

  const disablePath = `/api/ff4j/store/features/caseref-validation/${flag}`;
  const resp = await makeRequest(paymentBaseUrl + disablePath, 'POST', {'Content-Type': 'application/json'});

  return resp.status;
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

  const createCCDCaseBody = JSON.stringify({
    data: {}, event:
      {id: 'createDraft', summary: '', description: ''},
    event_token: `${createToken}`,
    ignore_warning: false,
    draft_id: null
  });

  const probateCCDCreateCaseRelativeBaseUrl = '/case-types/GrantOfRepresentation/cases';

  const headers = {
      Authorization: `Bearer ${idamToken}`,
      ServiceAuthorization: `${serviceToken}`,
      'Content-Type': 'application/json',
      experimental: true
    };


  const probateCaseCreatedResponse = await makeRequest(
    ccdDataStoreApiUrl + probateCCDCreateCaseRelativeBaseUrl,
    'POST',
    headers,
    createCCDCaseBody
  );

  const ccdCaseNumberPayload = await probateCaseCreatedResponse.json();
  console.log(`CCD Case number created for the test: ${ccdCaseNumberPayload.id}`);
  return ccdCaseNumberPayload.id;
}

async function createACCDCaseForDivorce() {
  const idamTokenForDivorce = await getIDAMTokenForDivorceUser();
  const serviceToken = await getServiceToken();
  const createToken = await getCREATEEventForDivorce();

  const createCCDDivorceCaseBody = JSON.stringify({
    data: {LanguagePreferenceWelsh: 'No'},
    event: {
      id: 'createCase',
      summary: 'TESTING',
      description: 'Testing'
    },
    event_token: `${createToken}`,
    ignore_warning: false,
    draft_id: null
  });

  const url = ccdDataStoreApiUrl + '/case-types/DIVORCE/cases';
  const headers = {
    Authorization: `Bearer ${idamTokenForDivorce}`,
    ServiceAuthorization: `${serviceToken}`,
    'Content-Type': 'application/json',
    experimental: true
  }

  const divorceCaseCreatedResponse = await makeRequest(url, 'POST', headers, createCCDDivorceCaseBody);

  const ccdCaseNumberPayload = await divorceCaseCreatedResponse.json();
  const ccdCaseNumber = ccdCaseNumberPayload.id;
  console.log(`The value of the CCDCaseNumber : ${ccdCaseNumber}`);
  return ccdCaseNumber;
}

async function rollbackPaymentDateByCCDCaseNumber(ccdCaseNumber) {
  const lag_time = 20;
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const serviceToken = await getServiceToken(microservice);
  const rollbackPaymentDateByCCDNumberEndPoint = `/payments/ccd_case_reference/${ccdCaseNumber}/lag_time/${lag_time}`;
  const url = paymentBaseUrl + rollbackPaymentDateByCCDNumberEndPoint;
  const headers = {
      Authorization: `Bearer ${idamToken}`,
      ServiceAuthorization: `${serviceToken}`,
      'Content-Type': 'application/json'
    }

  await makeRequest(url, 'PATCH', headers);
}

async function getPBAPaymentByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber) {
  const getPaymentByCCDNumberEndPoint = `/reconciliation-payments?ccd_case_number=${ccdCaseNumber}`;
  const url = paymentBaseUrl + getPaymentByCCDNumberEndPoint;
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const paymentLookUpResponseString = await makeRequest(url, 'GET', headers);

  const paymentLookupObject = await paymentLookUpResponseString.json();
  return paymentLookupObject;
}

async function createAFailedPBAPayment() {
  const url = paymentBaseUrl + '/credit-account-payments';
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const accountNumber = testConfig.TestAccountNumberInActive;
  const serviceToken = await getServiceToken(microservice);

  // eslint-disable-next-line no-magic-numbers
  const ccdCaseNumber = numUtil.randomInt(1, 9999999999999999);
  console.log(`The value of the CCD Case Number : ${ccdCaseNumber}`);

  const saveBody = JSON.stringify({
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
  });
  const headers = {
    Authorization: `${idamToken}`,
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  }

  const response = await makeRequest(url, 'POST', headers, saveBody);

  const payload = await response.json();
  console.log(`The value of the response status code : ${response.status}`);
  const paymentReference = payload.reference;

  await rollbackPaymentDateByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber);


  const paymentDetails = {
    ccdCaseNumber: `${ccdCaseNumber}`,
    paymentReference: `${paymentReference}`
  };
  return paymentDetails;
}

async function createAServiceRequest(hmctsorgid, calculatedAmount, feeCode, version, volume, ccdCaseNumber = createACCDCaseForProbate(), callBackUrl = 'http://probate-back-office-aat.service.core-compute-aat.internal/payment/gor-payment-request-update') {
  const url = paymentBaseUrl + '/service-request';
  const idamToken = await getIDAMToken();
  const serviceToken = await getServiceToken();
  if (paymentBaseUrl.includes("demo")) {
    callBackUrl = callBackUrl.replaceAll("aat", "demo");
  }

  // eslint-disable-next-line no-magic-numbers
  console.log(`The value of the CCD Case Number : ${ccdCaseNumber}`);

  const saveBody = JSON.stringify({
    call_back_url: callBackUrl,
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
        volume: volume
      }
    ],
    hmcts_org_id: `${hmctsorgid}`
  });
  const headers = {
    Authorization: `${idamToken}`,
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };

  const cSRRS = await makeRequest(url, 'POST', headers, saveBody);
  console.log(`The value of the response status code : ${cSRRS.status}`);

  const createServiceRequestLookupObject = await cSRRS.json();
  const serviceRequestReference = createServiceRequestLookupObject.service_request_reference;
  const serviceRequestResponseDetails = {
    ccdCaseNumber: `${ccdCaseNumber}`,
    serviceRequestReference: `${serviceRequestReference}`
  };
  // console.log(`The Payment Details Object${JSON.stringify(paymentDetails)}`);
  return serviceRequestResponseDetails;
}

async function initiateCardPaymentForServiceRequest(amount, serviceRequestReference, returnUrl = 'https://paymentoutcome-web.aat.platform.hmcts.net/payment') {
  const url = paymentBaseUrl + `/service-request/${serviceRequestReference}/card-payments`;
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();

  if (paymentBaseUrl.includes("int-demo")) {
    returnUrl = returnUrl.replaceAll("web.aat", "web-int.demo");
  } else if (paymentBaseUrl.includes("demo")) {
    returnUrl = returnUrl.replaceAll("aat", "demo");
  }

  const serviceToken = await getServiceToken(microservice);

  // eslint-disable-next-line no-magic-numbers
  const saveBody = JSON.stringify({
    amount: amount,
    currency: 'GBP',
    language: 'en',
    'return-url': returnUrl
  });

  const headers = {
    Authorization: `${idamToken}`,
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };

  const response = await makeRequest(url, 'POST', headers, saveBody);
  console.log(`The value of the response status code : ${response.status}`);
  const responsePayload = await response.json();
  return responsePayload;
}

async function createAPBAPayment(amount, feeCode, version, volume, customerReference = 'ABC98989/65654') {
  const url = paymentBaseUrl + '/credit-account-payments';
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const accountNumber = testConfig.TestAccountNumberActive;

  const serviceToken = await getServiceToken(microservice);

  // eslint-disable-next-line no-magic-numbers
  const ccdCaseNumber = await createACCDCaseForProbate();
  console.log(`The value of the CCD Case Number : ${ccdCaseNumber}`);
  const saveBody = JSON.stringify({
    account_number: `${accountNumber}`,
    amount: amount,
    case_reference: '1253656',
    ccd_case_number: `${ccdCaseNumber}`,
    currency: 'GBP',
    customer_reference: `${customerReference}`,
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
  });

  const headers = {
    Authorization: `${idamToken}`,
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };

  const response = await makeRequest(url, 'POST', headers, saveBody);
  console.log(`The value of the response status code : ${response.status}`);

  const paymentLookupObject = await getPBAPaymentByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber);
  await rollbackPaymentDateByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber);

  const paymentDetails = {
    ccdCaseNumber: `${ccdCaseNumber}`,
    paymentReference: `${paymentLookupObject.payments[0].payment_reference}`
  };
  return paymentDetails;
}

async function createAPBAPaymentForExistingCase(amount, feeCode, version, volume, ccdCaseNumber, customerReference = 'ABC98989/65654') {
  const url = paymentBaseUrl + '/credit-account-payments';
  const microservice = 'cmc';
  const idamToken = await getIDAMToken();
  const accountNumber = testConfig.TestAccountNumberActive;

  const serviceToken = await getServiceToken(microservice);

  // eslint-disable-next-line no-magic-numbers
  // const ccdCaseNumber = await createACCDCaseForProbate();
  console.log(`The value of the CCD Case Number : ${ccdCaseNumber}`);
  const saveBody = JSON.stringify({
    account_number: `${accountNumber}`,
    amount: amount,
    case_reference: '1253656',
    ccd_case_number: `${ccdCaseNumber}`,
    currency: 'GBP',
    customer_reference: `${customerReference}`,
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
  });

  const headers = {
    Authorization: `${idamToken}`,
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };

  const response = await makeRequest(url, 'POST', headers, saveBody);
  console.log(`The value of the response status code : ${response.status}`);

  const paymentDetails = await getPBAPaymentByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber);
  await rollbackPaymentDateByCCDCaseNumber(idamToken, serviceToken, ccdCaseNumber);

  return paymentDetails;
}

async function getPaymentGroupRef(serviceToken, ccdCaseNumberFormatted) {
  const ccdNumber = ccdCaseNumberFormatted;
  const saveBody = JSON.stringify({
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
  });
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };

  const url = `${paymentBaseUrl}/payment-groups`;
  const response = await makeRequest(url, 'POST', headers, saveBody);
  console.log(`The response Status Code for paymentGroups : ${response.status}`);

  const responsePayload = await response.json();
  const paymentGroupRefernce = responsePayload.payment_group_reference;
  return paymentGroupRefernce;
}

async function recordBouncebackFailure(serviceToken, ccdNumber, paymentRCRefernce) {
  console.log('*date time is' + stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ())

  const failureReference = 'FR-267-CC14-' + numUtil.getRandomNumber(9, 999999999);
  const saveBody = JSON.stringify({
    'additional_reference': 'AR1234556',
    'amount': 250,
    'ccd_case_number': `${ccdNumber}`,
    'event_date_time': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'failure_reference': `${failureReference}`,
    'payment_reference': `${paymentRCRefernce}`,
    'reason': 'RR001'
  });

  const url = `${paymentBaseUrl}/payment-failures/bounced-cheque`;
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'POST', headers, saveBody);
  console.log(`The response Status Code for bounceCheque : ${response.status}`);

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

  const url = `${paymentBaseUrl}/payment-failures/chargeback`
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'POST', headers, JSON.stringify(saveBody));

  console.log(`The response Status Code for chargeBack : ${response.status}`);
  return saveBody;
}

async function recordChargeBackFailureEvent(serviceToken, ccdCaseNumber, paymentRef) {

  const failureReference = 'FR-367-CC14-' + numUtil.getRandomNumber(9, 999999999);
  const saveBody = {
    'additional_reference': 'AR1234556',
    'amount': 215,
    'ccd_case_number': `${ccdCaseNumber}`,
    'event_date_time': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'has_amount_debited': 'Yes',
    'failure_reference': `${failureReference}`,
    'payment_reference': `${paymentRef}`,
    'reason': 'RR001'
  };

  const url = `${paymentBaseUrl}/payment-failures/chargeback`
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };

  const response = await makeRequest(url, 'POST', headers, JSON.stringify(saveBody));
  console.log(`The response Status Code for chargeBack : ${response.status}`);
  return saveBody;
}

async function patchFailureReference(serviceToken, failureReference) {
  const saveBody = JSON.stringify({
    'representment_date': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'representment_status': 'Yes'
  });
  const url = `${paymentBaseUrl}/payment-failures/${failureReference}`;
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'PATCH', headers, saveBody);
  console.log(`The response Status Code for patchFailureReference : ${response.status}`);
}

async function patchFailureReferenceNo(serviceToken, failureReference) {
  const saveBody = JSON.stringify({
    'representment_date': stringUtil.getTodayDateTimeInYYYYMMDDTHHMMSSZ(),
    'representment_status': 'No'
  });
  const url = `${paymentBaseUrl}/payment-failures/${failureReference}`;
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'PATCH', headers, saveBody);
  console.log(`The response Status Code for patchFailureReference : ${response.status}`);
}

async function recordBulkScanPayments(serviceToken, ccdCaseNumberFormatted, paymentGroupRef, dcnNumber) {
  const ccdNumber = ccdCaseNumberFormatted;
  const document_control_number = dcnNumber;
  const saveBody = JSON.stringify({
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
  });
  const url = `${paymentBaseUrl}/payment-groups/${paymentGroupRef}/bulk-scan-payments`;
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'POST', headers, saveBody);
  console.log(`The response Status Code for recordBulkScanPayment : ${response.status}`);
  const responsePayload = await response.json();
  return responsePayload.reference;
}

async function bulkScanExelaRecord(serviceToken, amount, creditSlipNumber,
                                   bankedDate, dcnNumber, paymentMethod) {
  const url = bulkScanApiUrl + '/bulk-scan-payment';

  const saveBody = JSON.stringify({
    amount: `${amount}`,
    bank_giro_credit_slip_number: `${creditSlipNumber}`,
    banked_date: `${bankedDate}`,
    currency: 'GBP',
    document_control_number: `${dcnNumber}`,
    method: `${paymentMethod}`
  });
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'POST', headers, saveBody);
  return response.status;
}

async function bulkScanRecord(serviceToken, ccdNumber, dcnNumber, siteId, exception) {
  const url = bulkScanApiUrl + '/bulk-scan-payments';

  const saveBody = {
    ccd_case_number: `${ccdNumber}`,
    document_control_numbers: [`${dcnNumber}`],
    is_exception_record: exception,
    site_id: `${siteId}`
  };
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };

  console.log(`What is this CCDCaseNumber ${saveBody.ccd_case_number}`);

  const response = await makeRequest(url, 'POST', headers, JSON.stringify(saveBody));
  return response.status;
}

async function bulkScanCcdWithException(serviceToken, ccdNumber, exceptionCCDNumber) {
  console.log('Creating bulk Scan Case linked to Exception CCD');

  const url = bulkScanApiUrl + '/bulk-scan-payments' + `?exception_reference=${exceptionCCDNumber}`;

  console.log(`This is the Actual Case Number : ${ccdNumber}`);
  const saveBody = JSON.stringify({ccd_case_number: `${ccdNumber}`});
  const headers = {
    ServiceAuthorization: `Bearer ${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'PUT', headers, saveBody);
  return response.status;
}

async function bulkScanCcdLinkedException(exceptionCcdNumber, serviceToken) {
  // const numberTwo = 2;
  const successResponse = 200;

  const ccdNumber = await createACCDCaseForProbate();
  console.log(`The value of Actual CCDCaseNumber : ${ccdNumber}`);
  const responseCode = await bulkScanCcdWithException(serviceToken, ccdNumber,
    exceptionCcdNumber).catch(error => {
    logger.log(error);
  });
  if (responseCode === successResponse) console.log('CCD link to exception created');
  else console.log('CCD link to exception NOT created');

  return ccdNumber;
}

async function createBulkScanRecords(siteId, amount, paymentMethod, exception, linkedCcd = false) {
  const numberSeven = 7;
  const creditSlipNumber = '312312';
  const serviceToken = await getServiceToken();
  const bankedDate = stringUtil.getTodayDateInYYYYMMDD();
  const successResponse = 201;

  const randomNumber = numUtil.getRandomNumber(numberSeven);
  let dcnNumber = stringUtil.getTodayDateAndTimeInString() + randomNumber;
  const responseDcnCode = await bulkScanExelaRecord(serviceToken, amount,
    creditSlipNumber, bankedDate, dcnNumber, paymentMethod).catch(error => {
    logger.log(error);
  });
  console.log('***responseDcnCode - ' + responseDcnCode);

  if (responseDcnCode === successResponse) console.log('DCN Created');
  else console.log('CCD Case NOT Created');

  const ccdNumberExceptionRecord = await createACCDCaseForProbate();
  console.log('***ccdNumberExceptionRecord - ' + ccdNumberExceptionRecord);
  const responseCcdCode = await bulkScanRecord(serviceToken, ccdNumberExceptionRecord, dcnNumber,
    siteId, exception).catch(error => {
    logger.log(error);
  });

  console.log('***responseCcdCode - ' + responseCcdCode);

  if (responseCcdCode === successResponse) console.log('CCD Case Created');
  else console.log('CCD Case NOT Created');

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
  const serviceToken = await getServiceToken();
  const paymentGroupRef = await getPaymentGroupRef(serviceToken, ccdCaseNumber);
  const paymentRCRef = await recordBulkScanPayments(serviceToken, ccdCaseNumber, paymentGroupRef, dcnNumber);
  const failurereference = await recordBouncebackFailure(serviceToken, ccdCaseNumber, paymentRCRef);
  await patchFailureReference(serviceToken, failurereference);
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  return [paymentRCRef, failurereference, todayDateInDDMMMYYYY];

}

async function getPaymentReferenceUsingCCDCaseNumberForOverPayments(ccdCaseNumber) {
  const serviceToken = await getServiceToken();
  const paymentGroupRef = await getPaymentGroupRef(serviceToken, ccdCaseNumber);
  const paymentRCRef = await recordBulkScanPayments(serviceToken, ccdCaseNumber, paymentGroupRef);
  return paymentGroupRef;

}

async function getPaymentDetailsPBA(ccdCaseNumber, paymentRef) {
  const serviceToken = await getServiceToken();
  const failurereference = await recordChargeBackFailure(serviceToken, ccdCaseNumber, paymentRef);
  await patchFailureReferenceNo(serviceToken, failurereference.failure_reference);
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  return [paymentRef, failurereference.failure_reference, todayDateInDDMMMYYYY];

}

async function getPaymentDetailsPBAForChargebackEvent(ccdCaseNumber, paymentRef) {
  const serviceToken = await getServiceToken();
  const failurereference = await recordChargeBackFailureEvent(serviceToken, ccdCaseNumber, paymentRef);
  await patchFailureReferenceNo(serviceToken, failurereference.failure_reference);
  const todayDateInDDMMMYYYY = stringUtil.getTodayDateInDDMMMYYYY();
  return [paymentRef, failurereference.failure_reference, todayDateInDDMMMYYYY];

}

async function getPaymentDetailsPBAForServiceStatus(ccdCaseNumber, paymentRef) {
  const serviceToken = await getServiceToken();
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

async function updateRefundStatusByRefundReference(refundReference, reason, status) {
  const serviceToken = await getServiceToken();
  const url = refundsApiUrl + `/refund/${refundReference}`

  const saveBody = JSON.stringify({
    reason: `${reason}`,
    status: `${status}`,
  });
  const headers = {
    ServiceAuthorization: `${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'PATCH', headers, saveBody);
  console.log(`The response Status Code for refund update : ${response.status}`);
}

async function updateRefundStatusByApprover(refundReference, reviewerAction = 'APPROVE', reason = '', code='') {
  const serviceToken = await getServiceToken();
  const idamToken = await getIDAMTokenForRefundApprover();
  const url = refundsApiUrl + `/refund/${refundReference}/action/${reviewerAction}`

  const saveBody = JSON.stringify({
    code: `${code}`,
    reason: `${reason}`
  });
  const headers = {
    Authorization: `Bearer ${idamToken}`,
    ServiceAuthorization: `${serviceToken}`,
    'Content-Type': 'application/json'
  };
  const response = await makeRequest(url, 'PATCH', headers, saveBody);
  console.log(`The response Status Code for refund update by approver : ${response.status}`);
}

async function updateCardPaymentStatus() {
  const serviceToken = await getServiceToken();
  const idamToken = await getIDAMToken();
  const url = paymentBaseUrl + '/jobs/card-payments-status-update'

  const headers = {
    Authorization: `${idamToken}`,
    ServiceAuthorization: `${serviceToken}`
  };
  const response = await makeRequest(url, 'PATCH', headers);
  console.log(`The response Status Code for Card payment status update : ${response.status}`);
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
  rollbackPaymentDateByCCDCaseNumber,
  getPaymentDetailsPBAForServiceStatus,
  getPaymentDetailsPBAForChargebackEvent,
  getEmailFromNotifyWithMaxRetries,
  createAServiceRequest,
  updateRefundStatusByRefundReference,
  updateRefundStatusByApprover,
  createAPBAPaymentForExistingCase,
  initiateCardPaymentForServiceRequest,
  updateCardPaymentStatus
};
