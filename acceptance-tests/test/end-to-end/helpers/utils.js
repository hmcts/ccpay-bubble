const {Logger} = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');
const request = requestModule.defaults({proxy: 'http://proxyout.reform.hmcts.net:8080'});

const stringUtil = require('./string_utils.js');
const numUtil = require('./number_utils');

const logger = Logger.getLogger('helpers/utils.js');

const env = process.env.RUNNING_ENV || 'aat';


async function getServiceToken(service) {
  logger.info('Getting Service Token');

  const serviceSecret = process.env.CCD_SUBMIT_S2S_SECRET;

  const s2sBaseUrl = `http://rpe-service-auth-provider-${env}.service.core-compute-${env}.internal`;
  const s2sAuthPath = '/testing-support/lease';
  // eslint-disable-next-line global-require
  const oneTimePassword = require('otp')({secret: serviceSecret}).totp();

  const serviceToken = await request({
    method: 'POST',
    uri: s2sBaseUrl + s2sAuthPath,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      microservice: service,
      oneTimePassword
    })
  });

  logger.debug(serviceToken);

  return serviceToken;
}

async function CaseValidation(flag) {
  logger.info('Disabling case validation');

  const paymentBaseUrl = `http://payment-api-${env}.service.core-compute-${env}.internal`;
  const disablePath = `/api/ff4j/store/features/caseref-validation/${flag}`;
  // eslint-disable-next-line global-require

  const disabled = await request({
      method: 'POST',
      uri: paymentBaseUrl + disablePath,
      headers: {'Content-Type': 'application/json'},
     },
    function (error, response, body) {
      statusCode = response.statusCode;
    }).catch(error => {
    console.log(error);
  });
  logger.debug(disabled);
  return statusCode
}

async function toggleOffCaseValidation()
{
  return await CaseValidation("disable")
}

async function toggleOnCaseValidation()
{
  return await CaseValidation("enable")
}

async function bulkScanExelaRecord(serviceToken, amount, creditSlipNumber, bankedDate, dcnNumber, paymentMethod) {
  logger.info('Creating bulk Excela Case');
  const bulkApiUrl = `http://ccpay-bulkscanning-api-${env}.service.core-compute-${env}.internal`;
  const bulkendPoint = '/bulk-scan-payment';

  const saveBody = {
    "amount": amount,
    "bank_giro_credit_slip_number": `${creditSlipNumber}`,
    "banked_date": `${bankedDate}`,
    "currency": "GBP",
    "document_control_number": `${dcnNumber}`,
    "method": `${paymentMethod}`
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

  const saveCaseResponse = await request(saveCaseOptions ,function (error, response, body) {
      statusCode = response.statusCode;
    }
  ).catch(error => {
    console.log(error);
  });

  return statusCode;
}

async function bulkScanRecord(serviceToken, ccdNumber, dcnNumber, siteId, exception) {
  logger.info('Creating bulk Scan Case');

  const bulkApiUrl = `http://ccpay-bulkscanning-api-${env}.service.core-compute-${env}.internal`;
  const bulkendPoint = '/bulk-scan-payments';

  const saveBody = {
    "ccd_case_number": `${ccdNumber}`,
    "document_control_numbers": [
      `${dcnNumber}`
    ],
    "is_exception_record": exception,
    "site_id": `${siteId}`
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

  const saveCaseResponse = await request(saveCaseOptions
  ,function (error, response, body) {
      statusCode = response.statusCode;
    }
  ).catch(error => {
    console.log(error);
  });

  return statusCode;
}


async function bulkScanCcdWithException(serviceToken, ccdNumber, exceptionCCDNumber) {
  logger.info('Creating bulk Scan Case linked to Exception CCD');

  const bulkApiUrl = `http://ccpay-bulkscanning-api-${env}.service.core-compute-${env}.internal`;
  const bulkendPoint = '/bulk-scan-payments';
  const query = `?exception_reference=${exceptionCCDNumber}`

  const saveBody = {
    "ccd_case_number": `${ccdNumber}`
  };

  const saveCaseOptions = {
    method: 'PUT',
    uri: bulkApiUrl + bulkendPoint + query,
    headers: {
      ServiceAuthorization: `Bearer ${serviceToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(saveBody),
   };

  const saveCaseResponse = await request(saveCaseOptions
    ,function (error, response, body) {
      statusCode = response.statusCode;
    }
  ).catch(error => {
    console.log(error);
  });

  return statusCode;
}

async function bulkScanExceptionCcd(siteId, amount, paymentMethod) {
 return bulkScanNormalCcd(siteId,amount,paymentMethod,true)
}

async function bulkScanNormalCcd(siteId, amount, paymentMethod, exception=false) {
  const microservice = "api_gw";
  const numberTwo = 2;
  const numberSeven = 7
  const creditSlipNumber = "312312"
  const serviceToken = await getServiceToken(microservice);
  const bankedDate = stringUtil.getDateInYYYYMMDD();
  var retryCount = 0;

  do {
    var dcnNumber = stringUtil.getDateAndTimeInString() + numUtil.getRandomNumber(numberSeven)
    var responseCode = await bulkScanExelaRecord(serviceToken, amount, creditSlipNumber, bankedDate, dcnNumber, paymentMethod)
    if (responseCode == 201)  break
    else if (retryCount > 1) {
      logger.info("retrying to create another dcn " + retryCount);
    }
    retryCount++;
  } while (retryCount <= 3);

  retryCount = 0;
  do {

    var ccdNumber = stringUtil.getDateAndTimeInString() + numUtil.getRandomNumber(numberTwo);
    var responseCode = await bulkScanRecord(serviceToken, ccdNumber, dcnNumber, siteId, exception)
    if (responseCode == 201) break
    else if (retryCount > 1) {
      logger.info("retrying to create another ccd case " + retryCount);
    }
    retryCount++;
  } while (retryCount <= 3);

  return [dcnNumber, ccdNumber]


}

async function bulkScanCcdLinkedToException(siteId, amount, paymentMethod) {
  var ccdAndDcn = await bulkScanExceptionCcd(siteId, amount, paymentMethod)
  var dcnNumber = ccdAndDcn[0];
  var exceptionCcdNumber = ccdAndDcn[1];
  const microservice = "api_gw";
  const numberTwo = 2;
  const numberSeven = 7

  const serviceToken = await getServiceToken(microservice);

  var retryCount = 0;

  do {
    var ccdNumber = stringUtil.getDateAndTimeInString() + numUtil.getRandomNumber(numberTwo);
    var responseCode = await bulkScanCcdWithException(serviceToken,ccdNumber,exceptionCcdNumber)
    if (responseCode == 200) break
    else if (retryCount > 1) {
      logger.info("retrying to create another ccd case linked to exception " + retryCount);
    }
    retryCount++;
  } while (retryCount <= 3);

  return [dcnNumber, ccdNumber, exceptionCcdNumber]

}

module.exports = {bulkScanNormalCcd, bulkScanExceptionCcd, bulkScanCcdLinkedToException, toggleOffCaseValidation, toggleOnCaseValidation }
