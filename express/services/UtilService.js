const config = require('config');
const otp = require('otp');
const fetch = require('node-fetch')
const { Logger } = require('@hmcts/nodejs-logging');

const s2sUrl = config.get('s2s.url');
const ccpayBubbleSecret = config.get('secrets.ccpay.paybubble-s2s-secret');
const microService = config.get('ccpaybubble.microservice');


async function handleFetchError(resp, url) {
  if (!resp.ok) {
    const text = await resp.text();
    const error = new Error(`${text}`);
    error.status = resp.status;
    error.message = text;
    throw error;
  }
  return resp;
}

async function createAuthToken() {
  const otpPassword = otp({ secret: ccpayBubbleSecret }).totp();
  const serviceAuthRequest = {
    microservice: microService,
    oneTimePassword: otpPassword
  };
  const response = await fetch(`${s2sUrl}/lease`, {
    method: 'POST',
    body: JSON.stringify(serviceAuthRequest),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return await response.text();
}

async function fetchWithAuth(url, authToken, options = {}) {
  const s2sToken = await createAuthToken();
  options.headers = {
    Authorization: `Bearer ${authToken}`,
    ServiceAuthorization: `Bearer ${s2sToken}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const resp = await fetch(url, options);
  return await handleFetchError(resp, url);
}

async function plainFetch(url, options = {}) {
  const resp = await fetch(url, options);
  return await handleFetchError(resp, url);
}


function errorHandler(res, error, fileName) {
  let msg = "";
  if (error.message !== undefined && error.message !== '') {
    msg = error.message;
  } else if (error.cause !== undefined && error.cause !== '') {
    msg = error.cause;
  }
  if (error.statusCode) {
    return res.status(error.statusCode).json({err: msg, success: false});
  } else {
    return res.status(500).json({err: msg, success: false});
  }
}

module.exports = {errorHandler, fetchWithAuth, plainFetch};
