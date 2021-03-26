const { Logger } = require('@hmcts/nodejs-logging');
const requestModule = require('request-promise-native');

// eslint-disable max-len

const request = requestModule.defaults();

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
  const oneTimePassword = require('otp')({ secret: serviceSecret }).totp();

  const serviceToken = await request({
    method: 'POST',
    uri: s2sBaseUrl + s2sAuthPath,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      microservice: service,
      oneTimePassword
    })
  });

  logger.debug(serviceToken);

  return serviceToken;
}

async function CaseValidation(flag) {
  logger.info(`${flag} case validation`);

  // const paymentBaseUrl = `http://payment-api-${env}.service.core-compute-${env}.internal`;
  const paymentBaseUrl = 'http://payment-api-pr-743.service.core-compute-preview.internal';
  const disablePath = `/api/ff4j/store/features/caseref-validation/${flag}`;
  // eslint-disable-next-line global-require

  const saveCaseResponse = await request({
    method: 'POST',
    uri: paymentBaseUrl + disablePath,
    headers: { 'Content-Type': 'application/json' }
  },
  (error, response) => {
    statusCode = response.statusCode;
  }).catch(error => {
    logger.log(error);
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

  const saveCaseResponse = await request(saveCaseOptions, (error, response) => {
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
    , (error, response) => {
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
    , (error, response) => {
      statusCode = response.statusCode;
    }
  ).catch(error => {
    logger.log(error);
  });

  logger.info(saveCaseResponse);

  return statusCode;
}

async function bulkScanCcdLinkedException(exceptionCcdNumber, serviceToken) {
  const numberTwo = 2;
  const successResponse = 200;
  let ccdNumber = 0;
  const randomNumber = numUtil.getRandomNumber(numberTwo);
  ccdNumber = stringUtil.getTodayDateAndTimeInString() + randomNumber;
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
  const numberTwo = 2;
  const numberSeven = 7;
  const creditSlipNumber = '312312';
  const serviceToken = await getServiceToken(microservice);
  const bankedDate = stringUtil.getTodayDateInYYYYMMDD();
  let dcnNumber = 0;
  let ccdNumber = 0;
  const successResponse = 201;

  const randomNumber = numUtil.getRandomNumber(numberSeven);
  dcnNumber = stringUtil.getTodayDateAndTimeInString() + randomNumber;
  const responseDcnCode = await bulkScanExelaRecord(serviceToken, amount,
    creditSlipNumber, bankedDate, dcnNumber, paymentMethod).catch(error => {
    logger.log(error);
  });

  if (responseDcnCode === successResponse) logger.info('DCN Created');
  else logger.info('CCD Case NOT Created');

  ccdNumber = stringUtil.getTodayDateAndTimeInString() + numUtil.getRandomNumber(numberTwo);
  const responseCcdCode = await bulkScanRecord(serviceToken, ccdNumber, dcnNumber,
    siteId, exception).catch(error => {
    logger.log(error);
  });

  if (responseCcdCode === successResponse) logger.info('CCD Case Created');
  else logger.info('CCD Case NOT Created');

  if (linkedCcd) {
    const result = Promise.all([responseDcnCode, responseCcdCode]);
    if (result) {
      const ccdNumberLinked = await bulkScanCcdLinkedException(ccdNumber, serviceToken);
      return [dcnNumber, ccdNumberLinked, ccdNumber];
    }
  }
  return [dcnNumber, ccdNumber];
}

async function bulkScanNormalCcd(siteId, amount, paymentMethod) {
  const bulkDcnCcd = await createBulkScanRecords(siteId, amount, paymentMethod, false);
  return bulkDcnCcd;
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
  toggleOffCaseValidation, toggleOnCaseValidation
};
